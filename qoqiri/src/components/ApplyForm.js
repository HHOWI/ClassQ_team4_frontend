import React, { useState, useEffect } from "react";
import defaultimg from "../assets/defaultimg.png";
import { useDispatch, useSelector } from "react-redux";
import {
  matchingAccept,
  hideMachingUser,
  getApplicantUserMatchingInfo,
} from "../api/matching";
import styled from "styled-components";
import { getUserCategory } from "../api/category";
import { formatDate24Hours } from "../utils/TimeFormat";
import ProfileImgModal from "./ProfileImgModal";
import { postBlockUser } from "../api/blockuser";
import { asyncBlockUsers } from "../store/blockUserSlice";

const StyledApplyForm = styled.div`
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

  .ap_front_top {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    font-size: 0.9rem;
    padding-left: 10px;
    padding-right: 10px;
    width: 100%;
  }

  .ap_back_top {
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    font-size: 0.9rem;
  }

  .ap_hide {
    border: none;
    font-weight: bold;
    background-color: transparent;
  }

  .ap_main_image {
    margin-bottom: 10px;
    width: 250px;
    height: 250px;
    border-radius: 80px;
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
  .ap_front_applyBtn {
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
  .ap_front_applyBtn {
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
  .ap_back_applyBtn {
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
  .ap_back_applyBtn {
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

const ApplyForm = ({ userInfo, postSEQ, getMatchingUserInfoByPostSEQAPI }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCategoryList, setUserCategoryList] = useState([]);
  const [applicantUserMatchingInfo, setApplicantUserMatchingInfo] =
    useState("");
  const user = useSelector((state) => state.user);
  const blockUserList = useSelector((state) => state.blockUsers);
  const dispatch = useDispatch();

  // 차단한 사용자인지 확인
  const isBlocked = blockUserList.some(
    (blockUser) => blockUser.blockInfo.userId === userInfo.userId
  );

  const DTO = {
    id: user.id,
    postSEQ: postSEQ,
    applicantId: userInfo.userId,
  };

  const handleBlockUser = async () => {
    if (!isBlocked) {
      const userInput = window.prompt("차단 사유를 메모할 수 있습니다.");
      if (userInput !== null) {
        const userBlockDTO = {
          userId: user.id,
          blockId: userInfo.userId,
          blockReason: userInput,
        };
        await postBlockUser(userBlockDTO);
        await dispatch(asyncBlockUsers(user.id));
        await getMatchingUserInfoByPostSEQAPI();
        alert("차단하였습니다");
      }
    } else {
      alert("이미 차단된 사용자입니다.");
    }
  };

  const getUserCategoryAPI = async () => {
    const result = await getUserCategory(userInfo.userId);
    setUserCategoryList(result.data);
  };

  const getApplicantUserMatchingInfoAPI = async () => {
    const result = await getApplicantUserMatchingInfo(postSEQ, userInfo.userId);
    setApplicantUserMatchingInfo(result.data);
  };

  const matchingAcceptAPI = async () => {
    await matchingAccept(DTO);
    await getMatchingUserInfoByPostSEQAPI();
  };
  const hideMatchingUser = async () => {
    await hideMachingUser(DTO);
    await getMatchingUserInfoByPostSEQAPI();
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

  useEffect(() => {
    getUserCategoryAPI();
    getApplicantUserMatchingInfoAPI();
  }, [userInfo]);

  return (
    <StyledApplyForm>
      <div className="ap_container">
        <div className={`ap_custom_card ${isFlipped ? "flipped" : ""}`}>
          <div className="ap_front_info">
            <div className="ap_front_top">
              <div className="ap_date">
                {formatDate24Hours(applicantUserMatchingInfo.applicationDate)}
              </div>
              <button className="ap_hide" onClick={hideMatchingUser}>
                숨기기
              </button>
            </div>
            <img
              className="ap_main_image"
              src={
                userInfo?.profileImg
                  ? `/uploadprofile/${userInfo?.profileImg}`
                  : defaultimg
              }
              alt="User"
              onClick={handleOpenProfileImage}
            />
            <div className="ap_front_nickname">{userInfo?.userNickname}</div>
            <div className="ap_front_mbti_popular">
              <div className="ap_front_mbti">
                {userInfo?.mbti !== null ? userInfo?.mbti : "비공개"}
              </div>
              <div className="ap_front_popular">
                인기도 {userInfo?.popularity}
              </div>
            </div>
            <div className="ap_front_text">{userInfo?.statusMessage}</div>
            <div className="ap_front_Btn">
              <button className="ap_front_infoBtn" onClick={handleCardFlip}>
                상세 프로필
              </button>
              <button className="ap_front_applyBtn" onClick={matchingAcceptAPI}>
                {applicantUserMatchingInfo?.matchingAccept == "Y"
                  ? "승낙한 유저"
                  : "승낙"}
              </button>
            </div>
          </div>
          <div className="ap_back_info">
            <div className="ap_back_top">
              <div className="ap_date">
                {formatDate24Hours(applicantUserMatchingInfo.applicationDate)}
              </div>
              <button className="ap_hide" onClick={hideMatchingUser}>
                숨기기
              </button>
            </div>
            <div className="ap_back_body">
              <div className="ap_back_age_gender">
                <div className="ap_back_age">
                  나이 {userInfo?.age !== null ? userInfo?.age : "비공개"}
                </div>
                <div className="ap_back_gender">
                  성별 {userInfo?.gender !== null ? userInfo?.gender : "비공개"}
                </div>
              </div>
              <div className="ap_back_place">
                지역{" "}
                {userInfo?.placeType?.placeTypeName !== null
                  ? userInfo?.placeType?.placeTypeName
                  : "비공개"}
              </div>
              <div className="ap_back_category">
                관심사
                <div className="ap_back_category_list">
                  {userCategoryList.map((categoryList) => (
                    <div
                      className="ap_back_category_list_user"
                      key={categoryList.userCategorySeq}
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
              <button className="ap_back_applyBtn" onClick={handleBlockUser}>
                차단
              </button>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <ProfileImgModal
            images={[
              userInfo?.profileImg
                ? `/uploadprofile/${userInfo?.profileImg}`
                : defaultimg,
            ]}
            handleCloseProfileImage={handleCloseProfileImage}
          />
        )}
      </div>
    </StyledApplyForm>
  );
};
export default ApplyForm;
