import Offcanvas from "react-bootstrap/Offcanvas";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteNotify, getNotifyList } from "../api/notify";
import DetailView from "./DetailView";
import { formatDate24Hours } from "../utils/TimeFormat";
import { useNavigate } from "react-router-dom";
import ChatRoom from "./ChatRoom";

const NotifyList = ({ show, handleClose, ...props }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [notifyList, setNotifyList] = useState([]);
  const [chatRoomSEQ, setChatRoomSEQ] = useState(null);
  const [postSEQ, setPostSEQ] = useState(null);

  // ChatRoom 모달을 열기 위한 함수
  const handleShowChatRoom = (chatRoomSEQ) => {
    setChatRoomSEQ(chatRoomSEQ);
  };

  // ChatRoom 모달을 닫기 위한 함수
  const handleCloseChatRoom = () => {
    setChatRoomSEQ(null);
  };

  // 게시글 상세보기 모달 닫기 함수
  const handleCloseDetailView = () => {
    setPostSEQ(null);
  };

  // 내 알림 리스트 불러오기
  const notifyListAPI = async () => {
    const result = await getNotifyList(user.id);
    setNotifyList(result.data);
  };

  // 내 알림 모두 제거
  const deleteNotifyAPI = async () => {
    await deleteNotify(user.id);
  };

  // 알림 전체 삭제 버튼 함수
  const deleteNotifyBtn = async () => {
    await deleteNotifyAPI();
    notifyListAPI();
    alert("모든 알림이 삭제되었습니다.");
  };

  useEffect(() => {
    notifyListAPI();
  }, [show]);

  return (
    <Offcanvas show={show} onHide={handleClose} {...props}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ display: "flex" }}>
          <div className="my_notify">내 알림</div>
          <button className="delete_notify" onClick={deleteNotifyBtn}>
            알림 전체 삭제
          </button>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {notifyList.map((notify) => (
          <div
            className={`notify_list ${
              notify?.isRead === "Y" ? "read" : "unread"
            }`}
            onClick={() => {
              if (notify?.message?.includes("끼리 신청이 있습니다.")) {
                navigate(`/apply/${notify?.post?.postSEQ}`);
              } else if (notify?.chatRoom !== null) {
                handleShowChatRoom(notify?.chatRoom?.chatRoomSEQ);
              } else if (notify?.post !== null && notify?.chatRoom == null) {
                setPostSEQ(notify?.post?.postSEQ);
                setIsOpen(!isOpen);
              }
            }}
            key={notify?.notificationMessageSEQ}
          >
            <div className="notify_message">{notify?.message}</div>
            <div className="notify_time">
              {formatDate24Hours(notify?.sentTime)}
            </div>
          </div>
        ))}
      </Offcanvas.Body>
      {chatRoomSEQ && (
        <ChatRoom
          chatRoomSEQ={chatRoomSEQ}
          handleCloseChatRoom={handleCloseChatRoom}
        />
      )}
      {postSEQ && (
        <DetailView
          selectedPostSEQ={postSEQ}
          handleCloseDetailView={handleCloseDetailView}
        />
      )}
    </Offcanvas>
  );
};

export default NotifyList;
