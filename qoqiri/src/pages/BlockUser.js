import { useDispatch, useSelector } from "react-redux";
import { deleteBlock } from "../api/blockuser";
import "../css/BlockUser.css";
import { asyncBlockUsers } from "../store/blockUserSlice";
import { formatSendTime } from "../utils/TimeFormat";
import MyInfoHeader from "../components/MyInfoHeader";

const BlockUserInfo = () => {
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
                <td>{blockUser.blockInfo.userNickname}</td>
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
    </>
  );
};

export default BlockUserInfo;
