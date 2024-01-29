import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  getChatMessage,
  getChatRoomInfo,
  getUserChatRoomInfo,
  joinMessage,
  leaveChatroom,
} from "../api/chat";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";
import { formatSendTime } from "../utils/TimeFormat";

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
    width: 850px;
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
    width: 842px;
    height: 594px;
    overflow-y: scroll;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding-left: 10px;
    padding-right: 10px;
  }

  .chat_list {
    margin-top: auto;
    width: 100%;
    max-height: -webkit-fill-available;
  }

  .chat_list_item {
    padding-bottom: 5px;
    border-top: 1px solid rgb(210, 210, 210);
  }

  .chat_list_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 8px;
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

  .room_body::-webkit-scrollbar {
    width: 6px; /* 스크롤바 너비 조절 */
  }

  .room_body::-webkit-scrollbar-thumb {
    background-color: rgb(214, 214, 214);
    border-radius: 2px; /* 스크롤바 둥글게 만들기 */
  }

  .room_body::-webkit-scrollbar-thumb:hover {
    background-color: rgb(200, 200, 200); /* 스크롤바 호버 시 색상 변경 */
  }
`;

const ChatRoom = ({ chatRoomSEQ, handleCloseChatRoom }) => {
  const [chatRoomInfo, setChatRoomInfo] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadMessage, setLoadMessage] = useState([]);
  const stompClient = useRef(null);
  const user = useSelector((state) => state.user);

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
    const result = await getChatMessage(chatRoomSEQ);
    setLoadMessage(result.data);
  };

  // 현재 채팅방에 참여한 유저정보중 내 정보 받아오기(최초접속 확인용)
  const userChatRoomInfoAPI = async () => {
    const result = await getUserChatRoomInfo(user.id, chatRoomSEQ);
    return result.data;
  };

  // 메세지 발송, 채팅방 참여시 스크롤 하단이동(최하단 요소부터 노출)
  const scrollToBottom = () => {
    const chatContainer = document.getElementById("app");
    chatContainer.scrollTop = chatContainer.scrollHeight;
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
      }),
    });

    setMessage("");
  };

  // 서버에서 메세지정보 받기
  const recvMessage = (recv) => {
    const currentTime = new Date();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        nickname: recv.nickname,
        chatRoomSEQ: recv.chatRoomSEQ,
        message: recv.message,
        sendTime: currentTime.toISOString(),
      },
    ]);
  };

  //채팅방 나가기
  const exit = async () => {
    const currentTime = new Date();
    stompClient.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify({
        nickname: user.nickname,
        chatRoomSEQ: chatRoomSEQ,
        message: user.nickname + "님이 채팅방에서 퇴장하였습니다.",
        sendTime: currentTime.toISOString(),
      }),
    });

    leaveChatroom(chatDTO);
    window.location.reload();
  };

  //채팅방 닫기
  const close = () => {
    handleCloseChatRoom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [loadMessage, messages]);

  useEffect(() => {
    chatRoomInfoAPI();
    chatMessageAPI();

    const currentTime = new Date();
    const socket = new SockJS("http://localhost:8080/ws/chat");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 무조건 유저의 채팅방 정보를 받아온 뒤에 작동해야됨!
    // 특정 주소 구독처리(채팅방 구현)
    userChatRoomInfoAPI().then((userChatRoomInfo) => {
      stompClient.current.onConnect = () => {
        stompClient.current.subscribe(
          `/sub/chat/room/${chatRoomSEQ}`,
          (message) => {
            const recv = JSON.parse(message.body);
            recvMessage(recv);
          }
        );

        if (userChatRoomInfo.joinMessageSent == "N") {
          stompClient.current.publish({
            destination: "/pub/chat/message",
            body: JSON.stringify({
              nickname: user.nickname,
              chatRoomSEQ: chatRoomSEQ,
              message: user.nickname + "님이 채팅에 참여하였습니다.",
              sendTime: currentTime.toISOString(),
            }),
          });
          joinMessage(chatDTO);
        }
      };

      stompClient.current.activate();

      return () => {
        if (stompClient.current && stompClient.current.active) {
          stompClient.current.deactivate();
        }
      };
    });
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

        <div className="room_body" id="app">
          <div className="chat_list">
            {loadMessage.map((msg) => (
              <div className="chat_list_item" key={msg?.chatMessageSEQ}>
                <div className="chat_list_header">
                  <div className="nickname">{msg?.userInfo?.userNickname}</div>
                  <div className="sendTime">
                    {formatSendTime(msg?.sendTime)}
                  </div>
                </div>
                <div className="message">{msg?.message}</div>
              </div>
            ))}
            {messages.map((msg, index) => (
              <div className="chat_list_item" key={index}>
                <div className="chat_list_header">
                  <div className="nickname">{msg?.nickname}</div>
                  <div className="sendTime">
                    {formatSendTime(msg?.sendTime)}
                  </div>
                </div>
                <div className="message">{msg.message}</div>
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
    </StyledChatRoom>
  );
};

export default ChatRoom;
