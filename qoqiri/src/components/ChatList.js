import Offcanvas from "react-bootstrap/Offcanvas";
import { useSelector } from "react-redux";
import ChatRoomForm from "./ChatRoomForm";

const ChatList = ({ show, handleClose, ...props }) => {
  const myChatRoom = useSelector((state) => state.chatRoom);

  return (
    <Offcanvas show={show} onHide={handleClose} {...props}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          내 채팅방
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {myChatRoom?.map((chatRoom) => (
          <ChatRoomForm
            chatRoomSEQ={chatRoom.chatRoom?.chatRoomSEQ}
            joinDate={chatRoom.joinDate}
            postTitle={chatRoom.chatRoom?.post?.postTitle}
            key={chatRoom.userChatRoomInfoSeq}
          />
        ))}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ChatList;
