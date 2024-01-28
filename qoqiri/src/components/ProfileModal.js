import Profile from "./Profile";
import styled from "styled-components";
const StyledApplyForm = styled.div`
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
  background-color: rgba(0, 0, 0, 0.3);
`;

const ProfileModal = ({ userId, postSEQ, handleCloseProfile }) => {
  const close = (e) => {
    // 클릭된 요소가 StyledApplyForm 자체인 경우에만 close 함수 호출
    if (e.target === e.currentTarget) {
      handleCloseProfile();
    }
  };

  return (
    <StyledApplyForm onClick={close}>
      <Profile userId={userId} postSEQ={postSEQ} />
    </StyledApplyForm>
  );
};
export default ProfileModal;
