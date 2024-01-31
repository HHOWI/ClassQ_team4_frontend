import React, { useState, useEffect } from "react";
import { getUser, userLike } from "../api/user";
import defaultimg from "../assets/defaultimg.png";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getUserCategory } from "../api/category";
import { postBlockUser, getBlockUser, putBlockUser } from "../api/blockuser";
import ProfileImgModal from "./ProfileImgModal";

const StyledProfile = styled.div`
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

  .ap_container {
    margin-top: 20px;
  }

  .ap_custom_card {
    width: 300px;
    height: 600px;
    border-radius: 35px;
    position: relative;
    font-weight: bold;
  }

  .ap_front_info {
    padding-top: 25px;
    width: 100%;
    height: 100%;
    background-color: rgb(231, 240, 252);
    border-radius: 30px;
    border: 2px solid rgb(93, 156, 235);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), 0 6px 6px rgba(0, 0, 0, 0.23);
    transition: transform 0.5s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
    position: absolute;
    backface-visibility: hidden;
  }

  .ap_back_top {
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    font-size: 0.9rem;
  }

  .ap_main_image {
    margin-bottom: 10px;
    width: 250px;
    height: 250px;
    border-radius: 100%;
    object-fit: cover;
    box-sizing: border-box;
    cursor: pointer;
  }

  .ap_front_nickname {
    font-size: 1.8rem;
    margin-bottom: 10px;
    color: rgb(49, 49, 49);
  }

  .ap_front_mbti_popular {
    color: rgb(49, 49, 49);
    width: 50%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .ap_front_text {
    width: 80%;
    height: 120px;
    color: rgb(49, 49, 49);
    white-space: pre-line;
  }

  .ap_front_Btn {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: auto;
  }

  .ap_front_infoBtn,
  .ap_front_likeBtn {
    border: none;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    background-color: rgb(93, 156, 235);
    width: 50%;
    height: 50px;
  }

  .ap_front_infoBtn {
    border-right: 0.5px solid rgb(231, 240, 252);
    border-bottom-left-radius: 26px;
  }
  .ap_front_likeBtn {
    border-left: 0.5 solid rgb(231, 240, 252);
    border-bottom-right-radius: 26px;
  }

  .ap_back_Btn {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: auto;
  }

  .ap_back_infoBtn,
  .ap_back_blockBtn {
    border: none;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    background-color: rgb(93, 156, 235);
    width: 50%;
    height: 50px;
  }

  .ap_back_infoBtn {
    border-right: 0.5px solid rgb(231, 240, 252);
    border-bottom-left-radius: 26px;
  }
  .ap_back_blockBtn {
    border-left: 0.5 solid rgb(231, 240, 252);
    border-bottom-right-radius: 26px;
  }

  .ap_back_info {
    width: 100%;
    height: 100%;
    background-color: rgb(231, 240, 252);
    border-radius: 30px;
    border: 2px solid rgb(93, 156, 235);
    transition: transform 0.5s ease-in-out;
    display: flex;
    flex-direction: column;
    position: absolute;
    backface-visibility: hidden;
    font-size: 1.1rem;
  }

  .ap_custom_card.flipped .ap_front_info {
    transform: rotateY(180deg);
  }

  .ap_custom_card.flipped .ap_back_info {
    transform: rotateY(360deg);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), 0 6px 6px rgba(0, 0, 0, 0.23);
  }

  .ap_back_body {
    padding-left: 20px;
    padding-right: 20px;
  }

  .ap_back_age_gender {
    margin-top: 30px;
    margin-bottom: 10px;
    gap: 20px;
    width: 100%;
    display: flex;

    .ap_back_age,
    .ap_back_gender,
    .ap_back_place {
      color: rgb(49, 49, 49);
    }
  }

  .ap_back_place {
    margin-bottom: 10px;
  }

  .ap_back_category {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 0.5px solid gray;
    width: 100%;
  }

  .ap_back_category_list {
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    .ap_back_category_list_user {
      font-size: 1rem;
      font-weight: normal;
      background-color: rgb(93, 156, 235);
      color: white;
      padding: 5px;
      border-radius: 10px;
    }
  }
`;

const ProfileModal = ({ userId, handleCloseProfile }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCategoryList, setUserCategoryList] = useState([]);
  const [userData, setUserData] = useState("");
  const user = useSelector((state) => state.user);
  const [blockUser, setBlockUser] = useState([]);
  const [blockUserFetched, setBlockUserFetched] = useState(false);

  const blockUserAPI = async () => {
    try {
      if (!blockUserFetched) {
        const result = await getBlockUser(user.id);
        setBlockUser(result.data);
        setBlockUserFetched(true);
      }
    } catch (error) {}
  };

  const handleBlockUser = async () => {
    const sendUserInfo = {
      userInfo: {
        userId: user.id,
      },
      blockInfo: { userId },
    };

    try {
      // 사용자가 이미 차단되었는지 확인합니다.
      const existingBlockUser = blockUser.find(
        (blockedUser) => blockedUser.blockInfo.userId === userId
      );

      if (existingBlockUser) {
        // 이미 차단된 경우 차단 정보를 업데이트합니다.
        const updatedBlockUser = await putBlockUser(userId);
        alert("차단했습니다.");
        // 필요한 경우 updatedBlockUser 데이터를 처리합니다.
      } else {
        // 차단되지 않은 경우 새로운 차단 항목을 생성합니다.
        const createdBlockUser = await postBlockUser(sendUserInfo);
        alert("차단했습니다.");
        // 필요한 경우 createdBlockUser 데이터를 처리합니다.
      }

      // 페이지를 다시 로드하거나 필요한 경우 상태를 업데이트합니다.
      window.location.reload();
    } catch (error) {
      // 오류 처리
      console.error("사용자 차단 중 오류 발생:", error);
    }
  };

  const userLikeAPI = async () => {
    await userLike(userLikeDTO);
  };

  useEffect(() => {
    blockUserAPI();
  }, [user, blockUserFetched]);

  const userLikeDTO = {
    likeUpUser: user.id,
    likeUpTarget: userId,
  };

  const getUserAPI = async () => {
    const result = await getUser(userId);
    setUserData(result.data);
  };

  const getUserCategoryAPI = async () => {
    const result = await getUserCategory(userId);
    setUserCategoryList(result.data);
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };
  const handleOpenProfileImage = () => {
    setIsModalOpen(true);
  };
  const handleCloseProfileImage = () => {
    setIsModalOpen(false);
  };

  const close = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseProfile();
    }
  };

  useEffect(() => {
    getUserAPI();
    getUserCategoryAPI();
  }, [userId]);

  return (
    <StyledProfile onClick={close}>
      <div className="ap_container">
        <div className={`ap_custom_card ${isFlipped ? "flipped" : ""}`}>
          <div className="ap_front_info">
            <img
              className="ap_main_image"
              src={
                userData?.profileImg
                  ? `/uploadprofile/${userData?.profileImg}`
                  : defaultimg
              }
              alt="User"
              onClick={handleOpenProfileImage}
            />
            <div className="ap_front_nickname">{userData?.userNickname}</div>
            <div className="ap_front_mbti_popular">
              <div className="ap_front_mbti">
                {userData?.mbti !== null ? userData?.mbti : "비공개"}
              </div>
              <div className="ap_front_popular">
                인기도 {userData?.popularity}
              </div>
            </div>
            <div className="ap_front_text">{userData?.statusMessage}</div>
            <div className="ap_front_Btn">
              <button className="ap_front_infoBtn" onClick={handleCardFlip}>
                상세 프로필
              </button>
              <button className="ap_front_likeBtn" onClick={userLikeAPI}>
                좋아요
              </button>
            </div>
          </div>
          <div className="ap_back_info">
            <div className="ap_back_body">
              <div className="ap_back_age_gender">
                <div className="ap_back_age">
                  나이 {userData?.age !== null ? userData?.age : "비공개"}
                </div>
                <div className="ap_back_gender">
                  성별 {userData?.gender !== null ? userData?.gender : "비공개"}
                </div>
              </div>
              <div className="ap_back_place">
                지역{" "}
                {userData?.placeType?.placeTypeName !== null
                  ? userData?.placeType?.placeTypeName
                  : "비공개"}
              </div>
              <div className="ap_back_category">
                관심사
                <div className="ap_back_category_list">
                  {userCategoryList.map((categoryList) => (
                    <div
                      className="ap_back_category_list_user"
                      key={categoryList.matchingCategorySEQ}
                    >
                      {categoryList.category?.categoryName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="ap_back_Btn">
              <button className="ap_back_infoBtn" onClick={handleCardFlip}>
                기본 프로필
              </button>
              <button className="ap_back_blockBtn" onClick={handleBlockUser}>
                차단
              </button>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <ProfileImgModal
            images={[
              userData?.profileImg
                ? `/uploadprofile/${userData?.profileImg}`
                : defaultimg,
            ]}
            handleCloseProfileImage={handleCloseProfileImage}
          />
        )}
      </div>
    </StyledProfile>
  );
};
export default ProfileModal;
