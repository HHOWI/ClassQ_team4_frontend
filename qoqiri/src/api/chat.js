import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/qiri/",
});

// 내가 참여중인 채팅방 리스트
export const getChatRoomList = async (id) => {
  return await instance.get("public/chatRooms/" + id);
};

// 채팅방 정보 가져오기
export const getChatRoomInfo = async (id) => {
  return await instance.get("chat/room/" + id);
};

//참여중인 채팅방의 내 참여정보 가져오기
export const getUserChatRoomInfo = async (userId, code) => {
  return await instance.get(`/public/chatRoomInfo/${userId}/${code}`);
};

// 채팅방의 채팅보기
export const getChatMessage = async (dto) => {
  return await instance.get(`/chat/room/message/${dto.chatRoomSEQ}_${dto.id}`);
};

// 채팅방나가기 및 참여자 없는 채팅방 정보 자동 삭제
export const leaveChatroom = async (data) => {
  return await instance.put("chatroom/leave", data);
};

//채팅방의 참여유저목록 가져오기
export const getChatRoomUserList = async (code) => {
  return await instance.get("chatroom/userlist/" + code);
};

//채팅방 최초접속확인
export const joinMessage = async (data) => {
  return await instance.put("/chatroom/user/join", data);
};

//매칭 신청시 채팅방 생성 및 접속
export const joinChatRoom = async (data) => {
  return await instance.post("/chatroom/join", data);
};

//특정매칭글 승락한사람이 모두 접속한 채팅방 생성
export const createGroupChat = async (data) => {
  return await instance.post("/groupChat", data);
};
