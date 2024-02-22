import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  getChatMessage,
  getChatRoomInfo,
  getChatRoomUserList,
  joinMessage,
  leaveChatroom,
} from "../api/chat";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";
import { formatSendTime } from "../utils/TimeFormat";
import defaultimg from "../assets/defaultimg.png";
import ProfileModal from "./ProfileModal";
import { asyncChatRooms } from "../store/chatRoomSlice";

const StyledChatRoom = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.2);

  .chatroom {
    width: 900px;
    height: 700px;
    background-color: white;
    display: flex;
    flex-direction: column;
    border: 3px solid #ff7f38;
    border-radius: 18px;
    overflow: hidden;
  }

  .room_header {
    width: 100%;
    height: 50px;
    background-color: #ff7f38;
    color: white;
    display: flex;
    justify-content: space-between;
    padding: 25px;
    align-items: center;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .close_leave {
    display: flex;
    flex-direction: row;
    gap: 15px;
  }
  .close_btn,
  .leave_btn {
    margin: auto;
    border: none;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 15px;
    padding: 5px;
  }

  .room_body {
    width: 100%;
    height: 594px;
    display: flex;
    flex-direction: row;
    padding-left: 10px;
  }

  .chat_list {
    width: 75%;
    height: 100%;
    margin-top: auto;
    max-height: -webkit-fill-available;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    padding-right: 10px;
  }

  .chat_list_content {
    width: 100%;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid rgb(210, 210, 210);
  }

  .chat_list_item {
    width: 100%;
    padding-bottom: 5px;
  }

  .chat_list_profileimg {
    width: 45px;
    height: 45px;
    margin-bottom: auto;
    margin-right: 10px;
    margin-top: 8px;
    border-radius: 15px;
    object-fit: cover;
    box-sizing: border-box;
  }

  .chat_list_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 6px;
    margin-top: 5px;
  }

  .nickname {
    width: 50%;
    font-weight: bold;
    font-size: 1.1rem;
    color: rgb(49, 49, 49);
  }

  .sendTime {
    font-size: 0.8rem;
    color: #808080;
    align-items: flex-end;
  }

  .message {
    width: 100%;
    color: rgb(49, 49, 49);
    white-space: normal;
    line-height: 18px;
  }

  .chat_user_list {
    width: 25%;
    color: rgb(49, 49, 49);
    padding: 15px;
    border-left: 2px solid #ff7f38;
    cursor: pointer;

    .chat_user_info {
      width: 100%;
      color: rgb(49, 49, 49);
      font-size: 1.1rem;
      font-weight: bold;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #dddddd;
      margin-bottom: 5px;
      padding-bottom: 5px;

      .chat_user_img {
        width: 50px;
        height: 50px;
        border-radius: 15px;
        object-fit: cover;
        box-sizing: border-box;
      }
    }
  }

  .room_footer {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 3px solid #ff7f38;
  }

  .form-control {
    border: none;
  }

  .form-control:focus {
    outline: none !important;
    border: none;
    box-shadow: none;
  }

  .sendMessageBtn {
    margin-top: auto;
    width: 50px;
    height: 50px;
    background-color: white;
    border: none;
    display: flex;
    align-items: center;
  }

  .chat_list::-webkit-scrollbar {
    width: 6px; /* 스크롤바 너비 조절 */
  }

  .chat_list::-webkit-scrollbar-thumb {
    background-color: rgb(214, 214, 214);
    border-radius: 2px; /* 스크롤바 둥글게 만들기 */
  }

  .chat_list::-webkit-scrollbar-thumb:hover {
    background-color: rgb(200, 200, 200); /* 스크롤바 호버 시 색상 변경 */
  }
`;

const ChatRoom = ({ chatRoomSEQ, handleCloseChatRoom }) => {
  const [chatRoomInfo, setChatRoomInfo] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadMessage, setLoadMessage] = useState([]);
  const [chatRoomUserList, setChatRoomUserList] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const blockUserList = useSelector((state) => state.blockUsers);
  const stompClient = useRef(null);

  const chatDTO = {
    id: user.id,
    chatRoomSEQ: chatRoomSEQ,
  };

  //어느 채팅방인지 받아오기
  const chatRoomInfoAPI = async () => {
    const result = await getChatRoomInfo(chatRoomSEQ);
    setChatRoomInfo(result.data);
  };

  //현재 채팅방의 메세지들 받아오기
  const chatMessageAPI = async () => {
    const result = await getChatMessage(chatDTO);
    setLoadMessage(result.data);
  };

  // 채팅방 참여자 명단 가져오기
  const getChatRoomUserListAPI = async () => {
    const result = await getChatRoomUserList(chatRoomSEQ);
    setChatRoomUserList(result.data);
  };

  // 메세지 발송, 채팅방 참여시 스크롤 하단이동(최하단 요소부터 노출)
  const scrollToBottom = () => {
    const chatContainer = document.getElementById("app");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  // 프로필카드 모달 여는 함수
  const handleOpenProfile = (userId) => {
    setSelectedUser(userId);
    setIsProfileModalOpen(true);
  };

  // 프로필카드 모달 닫는 함수
  const handleCloseProfile = () => {
    setSelectedUser(null);
    setIsProfileModalOpen(false);
  };

  // 웹소켓 연결
  const connectWebsocket = () => {
    const socket = new SockJS("http://localhost:8080/ws/chat");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 특정 주소 구독처리(채팅방 구현)
    stompClient.current.onConnect = () => {
      stompClient.current.subscribe(
        `/sub/chat/room/${chatRoomSEQ}`,
        (message) => {
          const recv = JSON.parse(message.body);
          recvMessage(recv);
        }
      );

      joinMessage(chatDTO);
    };

    stompClient.current.activate();
  };

  //메세지정보 서버로 전송
  const sendMessage = async () => {
    // 입력한 메시지의 양 끝 공백 제거
    const trimmedMessage = message.trim();

    // 메세지가 비어 있으면 동작하지 않음
    if (!trimmedMessage) {
      return;
    }

    stompClient.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify({
        nickname: user.nickname,
        chatRoomSEQ: chatRoomSEQ,
        message: message,
        profileImg: user.profileImg,
      }),
    });

    setMessage("");
  };

  // 서버에서 웹소켓 메세지정보 받기
  const recvMessage = (recv) => {
    const currentTime = new Date();
    if (
      blockUserList.some(
        (blockUser) => blockUser.blockInfo.userNickname === recv.nickname
      )
    ) {
      return; // 차단된 사용자일 경우 메시지 무시
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        nickname: recv.nickname,
        chatRoomSEQ: recv.chatRoomSEQ,
        message: recv.message,
        sendTime: currentTime.toISOString(),
        profileImg: recv.profileImg,
      },
    ]);

    // 채팅방에서 나가면 유저목록 업데이트
    if (recv.leave === "Y") {
      getChatRoomUserListAPI();
    }
  };

  //채팅방 나가기
  const exit = async () => {
    await leaveChatroom(chatDTO);
    dispatch(asyncChatRooms(user.id));
    stompClient.current?.deactivate();
  };

  //채팅방 닫기
  const close = () => {
    handleCloseChatRoom();
    stompClient.current?.deactivate();
  };

  useEffect(() => {
    scrollToBottom();
  }, [loadMessage, messages]);

  useEffect(() => {
    chatRoomInfoAPI();
    chatMessageAPI();
    connectWebsocket();
    getChatRoomUserListAPI();
  }, [user, chatRoomSEQ]);

  return (
    <StyledChatRoom>
      <div className="chatroom">
        <div className="room_header">
          <div className="room_name">
            {chatRoomInfo?.post?.postTitle}의 채팅방
          </div>
          <div className="close_leave">
            <button className="close_btn" onClick={close}>
              닫기
            </button>
            <button className="leave_btn" onClick={exit}>
              나가기
            </button>
          </div>
        </div>

        <div className="room_body">
          <div className="chat_list" id="app">
            {loadMessage.map((msg) => (
              <div className="chat_list_content" key={msg?.chatMessageSEQ}>
                <img
                  className="chat_list_profileimg"
                  src={
                    msg.userInfo.profileImg
                      ? `/uploadprofile/${msg?.userInfo.profileImg}`
                      : defaultimg
                  }
                />
                <div className="chat_list_item">
                  <div className="chat_list_header">
                    <div className="nickname">
                      {msg?.userInfo?.userNickname}
                    </div>
                    <div className="sendTime">
                      {formatSendTime(msg?.sendTime)}
                    </div>
                  </div>
                  <div className="message">{msg?.message}</div>
                </div>
              </div>
            ))}
            {messages.map((msg, index) => (
              <div className="chat_list_content" key={index}>
                <img
                  className="chat_list_profileimg"
                  src={
                    msg.profileImg
                      ? `/uploadprofile/${msg?.profileImg}`
                      : defaultimg
                  }
                />
                <div className="chat_list_item">
                  <div className="chat_list_header">
                    <div className="nickname">{msg?.nickname}</div>
                    <div className="sendTime">
                      {formatSendTime(msg?.sendTime)}
                    </div>
                  </div>
                  <div className="message">{msg.message}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="chat_user_list">
            {chatRoomUserList.map((member) => (
              <div
                className="chat_user_info"
                key={member.userChatRoomInfoSeq}
                onClick={() => handleOpenProfile(member.userInfo.userId)}
              >
                <img
                  className="chat_user_img"
                  src={
                    member.userInfo.profileImg
                      ? `/uploadprofile/${member.userInfo.profileImg}`
                      : defaultimg
                  }
                />
                <div className="chat_user_nickname">
                  {member.userInfo.userNickname}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="room_footer">
          <input
            type="text"
            className="form-control"
            value={message}
            placeholder="메세지를 입력해주세요"
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button className="sendMessageBtn" onClick={sendMessage}>
            <FontAwesomeIcon
              icon={faCircleUp}
              rotation={90}
              style={{ color: "#ff7f38" }}
              size="2xl"
            />
          </button>
        </div>
      </div>
      {isProfileModalOpen && (
        <ProfileModal
          userId={selectedUser}
          handleCloseProfile={handleCloseProfile}
        />
      )}
    </StyledChatRoom>
  );
};

export default ChatRoom;
