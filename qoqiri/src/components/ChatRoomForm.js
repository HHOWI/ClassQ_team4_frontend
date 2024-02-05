import styled from "styled-components";
import ChatRoom from "./ChatRoom";
import { getChatRoomUserList } from "../api/chat";
import { useEffect, useState } from "react";
import { formatSendTimeBasedOnDate } from "../utils/TimeFormat";

const StyledChatRoomForm = styled.div`
  margin-bottom: 10px;

  .chatlist {
    display: flex;
    flex-direction: column;
  }

  .chat-link {
    background-color: white;
    border-radius: 15px;
    border: 0.5px solid rgb(224, 224, 224);
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    padding: 15px;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .chat-link:hover {
    opacity: 0.7;
  }

  .chat-top {
    display: flex;
    justify-content: space-between;
  }

  .chat-exp {
    font-weight: bold;
    font-size: 1.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chat-time {
    font-size: 0.8rem;
    margin-right: 5px;
    color: gray;
  }

  .chat-addr {
    font-size: 1rem;
    white-space: normal;
    margin-top: 10px;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const ChatRoomForm = ({ chatRoomSEQ, joinDate, postTitle }) => {
  const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);
  const [userList, setUserList] = useState([]);

  // ChatRoom 모달을 열기 위한 함수
  const handleShowChatRoom = () => {
    setIsChatRoomOpen(true);
  };

  // ChatRoom 모달을 닫기 위한 함수
  const handleCloseChatRoom = () => {
    setIsChatRoomOpen(false);
  };

  const getChatRoomUserListAPI = async () => {
    const result = await getChatRoomUserList(chatRoomSEQ);
    setUserList(result.data);
  };

  useEffect(() => {
    getChatRoomUserListAPI();
  }, [chatRoomSEQ]);

  return (
    <StyledChatRoomForm>
      <div className="chatlist">
        <div
          className="chat-link"
          onClick={() => handleShowChatRoom(chatRoomSEQ)}
        >
          <div className="chat-top">
            <div className="chat-exp">{postTitle}</div>
            <div className="chat-time">
              {formatSendTimeBasedOnDate(joinDate)}
            </div>
          </div>
          <div className="chat-addr">
            {userList?.map((user) => (
              <span key={user?.userChatRoomInfoSeq}>
                {user?.userInfo?.userNickname}&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
      {isChatRoomOpen && (
        <ChatRoom
          chatRoomSEQ={chatRoomSEQ}
          handleCloseChatRoom={handleCloseChatRoom}
        />
      )}
    </StyledChatRoomForm>
  );
};
export default ChatRoomForm;
