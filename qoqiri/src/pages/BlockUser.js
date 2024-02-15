import { useDispatch, useSelector } from "react-redux";
import { deleteBlock } from "../api/blockuser";
import "../css/BlockUser.css";
import { asyncBlockUsers } from "../store/blockUserSlice";
import { formatSendTime } from "../utils/TimeFormat";
import MyInfoHeader from "../components/MyInfoHeader";
import ProfileModal from "../components/ProfileModal";
import { useState } from "react";

const BlockUserInfo = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const blockUserList = useSelector((state) => state.blockUsers);
  const dispatch = useDispatch();

  const handleBlockUser = async (blockId) => {
    const userBlockDTO = {
      userId: user.id,
      blockId: blockId,
    };

    await deleteBlock(userBlockDTO);
    await dispatch(asyncBlockUsers(user.id));
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

  return (
    <>
      <MyInfoHeader />
      <div className="blockUser-container">
        <table className="blockUser-table">
          <thead>
            <tr>
              <th>차단 유저</th>
              <th>차단 사유</th>
              <th>차단 날짜</th>
              <th>차단 해제</th>
            </tr>
          </thead>
          <tbody>
            {blockUserList.map((blockUser) => (
              <tr key={blockUser.blockUserSeq}>
                <td
                  onClick={() => handleOpenProfile(blockUser.blockInfo.userId)}
                  style={{ cursor: "pointer" }}
                >
                  {blockUser.blockInfo.userNickname}
                </td>
                <td>{blockUser.blockReason}</td>
                <td>{formatSendTime(blockUser.blockDate)}</td>
                <td>
                  <button
                    onClick={() => handleBlockUser(blockUser.blockInfo.userId)}
                  >
                    차단 해제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isProfileModalOpen && (
        <ProfileModal
          userId={selectedUser}
          handleCloseProfile={handleCloseProfile}
        />
      )}
    </>
  );
};

export default BlockUserInfo;
