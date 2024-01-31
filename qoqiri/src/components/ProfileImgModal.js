import React from "react";
import styled from "styled-components";

const StyledProfileImgModal = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 21;
  background-color: rgba(0, 0, 0, 0.2);
  .profile_img {
    width: 750px;
  }
`;

const ProfileImgModal = ({ images, handleCloseProfileImage }) => {
  const close = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseProfileImage();
    }
  };

  return (
    <StyledProfileImgModal onClick={close}>
      <img className="profile_img" src={images} alt="profile_img" />
    </StyledProfileImgModal>
  );
};

export default ProfileImgModal;
