import { useEffect, useState } from "react";
import ApplyForm from "../components/ApplyForm";
import { getMatchingUserInfoByPostSEQ } from "../api/matching";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGroupChat } from "../api/chat";
import { asyncChatRooms } from "../store/chatRoomSlice";
import styled from "styled-components";
import { matchedPost } from "../api/post";
import ChatRoom from "../components/ChatRoom";
import { asyncMyPostNotMatched } from "../store/myPostSlice";

const StyledApply = styled.div`
  padding-left: 240px;
  width: 100%;

  .ApplyMain {
    width: 95%;
    min-width: 1100px;
    height: 800px;
    margin-top: 30px;
    margin-bottom: 30px;
    margin-left: 30px;
    border-radius: 20px;
    background-color: rgb(235, 238, 241);
    display: flex;
    flex-direction: column;
  }

  .aplly_button {
    display: flex;
    justify-content: flex-end;

    .group_chat_button,
    .complete_button {
      margin: 10px;
      border: none;
      font-weight: bold;
      color: white;
      background-color: #ff7f38;
      font-size: 1.2rem;
      padding: 10px;
      border-radius: 12px;
    }
  }

  .AC {
    height: 100%;
    margin-bottom: 15px;
    overflow-x: auto;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    overflow-x: auto;
    white-space: nowrap;
  }

  .AC::-webkit-scrollbar {
    height: 12px;
  }

  .AC::-webkit-scrollbar-thumb {
    outline: none;
    border-radius: 5px;
    background-color: rgb(210, 210, 210);
  }

  .AC::-webkit-scrollbar-thumb:hover {
    background-color: rgb(190, 190, 190);
  }

  .ap-empty-p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 100px;
    color: #ff7f38;
  }

  .ap-section {
    display: flex;
    padding: 20px;
    margin-left: 20px;
    margin-right: 20px;
    align-items: flex-start;
    justify-content: flex-start;
    white-space: nowrap;
  }
`;

const Apply = () => {
  const [appliedUsers, setAppliedUsers] = useState([]);
  const [chatRoomSEQ, setChatRoomSEQ] = useState(null);
  const navigate = useNavigate();
  const { postSEQ } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const getMatchingUserInfoByPostSEQAPI = async () => {
    const result = await getMatchingUserInfoByPostSEQ(DTO);
    setAppliedUsers(result.data);
  };

  useEffect(() => {
    getMatchingUserInfoByPostSEQAPI();
  }, [postSEQ, user]);

  const groupChat = async () => {
    alert("그룹채팅방이 생성되었습니다!");
    const result = await createGroupChat(DTO);
    await setChatRoomSEQ(result.data.chatRoomSEQ);
    await dispatch(asyncChatRooms(user.id));
  };

  const matchingEnd = async () => {
    alert("즐겁게 노시길 바래요!");
    await matchedPost(postSEQ);
    await dispatch(asyncMyPostNotMatched(user.id));
    await navigate("/matchingBoard");
  };

  // ChatRoom 모달을 닫기 위한 함수
  const handleCloseChatRoom = () => {
    setChatRoomSEQ(null);
  };

  // ChatRoom 모달이 열려 있는지 확인
  const isChatRoomModalOpen = chatRoomSEQ !== null;

  const DTO = {
    id: user.id,
    postSEQ: postSEQ,
  };

  return (
    <StyledApply>
      <div className="ApplyMain">
        <div className="aplly_button">
          <button className="group_chat_button" onClick={groupChat}>
            승락한 사람들과 그룹채팅
          </button>
          <button className="complete_button" onClick={matchingEnd}>
            모집 완료
          </button>
        </div>
        <div className="AC">
          {appliedUsers.map((userInfo) => (
            <section className="ap-section" key={userInfo.matchingUserInfoSeq}>
              <div className=".apply-form">
                <ApplyForm userInfo={userInfo.userInfo} postSEQ={postSEQ} />
              </div>
            </section>
          ))}
        </div>

        {isChatRoomModalOpen && (
          <ChatRoom
            chatRoomSEQ={chatRoomSEQ}
            handleCloseChatRoom={handleCloseChatRoom}
          />
        )}
      </div>
    </StyledApply>
  );
};

export default Apply;
