import React, { useEffect, useState } from "react";
import defaultimg from "../assets/defaultimg.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import styled from "styled-components";
import {
  editPostAPI,
  getAttachments,
  getPost,
  deletePost,
  getMatchCate,
} from "../api/post";
import { viewComments } from "../store/commentSlice";
import { useSelector, useDispatch } from "react-redux";
import AddComment from "../components/AddComment";
import Comment from "../components/Comment";
import { MatchingApply } from "../api/matching";
import { joinChatRoom } from "../api/chat";
import { asyncChatRooms } from "../store/chatRoomSlice";
import { formatDate24Hours } from "../utils/TimeFormat";
import ProfileModal from "./ProfileModal";
import { Link } from "react-router-dom";

const StyledDetailView = styled.div`
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
  background-color: rgba(0, 0, 0, 0.2);

  .detail_post {
    width: 700px;
    height: 600px;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: relative;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }

  .detail_post_top {
    width: 700px;
    height: 25px;
    background-color: #ff7f38;
    position: fixed;
    z-index: 5;
    display: flex;
    justify-content: flex-end;
    padding-right: 8px;
    div {
      color: white;
      font-weight: bold;
      font-size: 1.5rem;
      cursor: pointer;
    }
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }

  .detail_post_body {
    width: 100%;
    height: 300px;
    padding: 15px;
    padding-top: 35px;
    display: flex;
    flex-direction: column;
  }

  .detail_post_info {
    width: 100%;
    height: 45px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .profile {
    display: flex;
    flex-direction: row;
    width: 200px;
    gap: 10px;
    cursor: pointer;

    .detail_nickname {
      font-size: 1rem;
      font-weight: bold;
      color: rgb(49, 49, 49);
      margin-top: auto;
      margin-bottom: auto;
    }
  }

  .post_date {
    font-size: 0.7rem;
    margin-bottom: auto;
    color: gray;
  }

  .title {
    width: 100%;
    height: 30px;
    font-size: 1.3rem;
    font-weight: bold;
    color: rgb(49, 49, 49);
    margin-bottom: 15px;
  }

  .content {
    width: 100%;
    height: 100px;
    color: rgb(49, 49, 49);
  }

  .board_image_list {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-left: auto;
    gap: 10px;
    .board_image {
    }
  }

  .category_place {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: auto;
  }

  .category_list {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .detail_category,
  .detail_place {
    font-size: 0.8rem;
    font-weight: normal;
    color: white;
    padding: 5px;
    border-radius: 10px;
    background-color: #ff7f38;
  }

  .detail_button {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    .play_btn {
      width: 250px;
      height: 50px;
      color: rgb(49, 49, 49);
      font-weight: bold;
      background-color: #dfdfdfdf;
      border: none;
      border-radius: 10px;
    }
  }

  .update,
  .delete {
    color: gray;
    border: none;
    background-color: transparent;
    margin-left: 10px;
  }

  .carousel img {
    height: 500px;
    padding: 30px;
  }
`;

const DetailView = ({ selectedPostSEQ, handleCloseDetailView }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [post, setPost] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // 게시물 API
  const getPostAPI = async () => {
    const result = await getPost(selectedPostSEQ);
    setPost(result.data);
  };
  // 첨부파일 API
  const getAttachmentsAPI = async () => {
    const result = await getAttachments(selectedPostSEQ);
    setAttachments(result.data);
  };

  const getMatchingCategoryInfoAPI = async () => {
    const result = await getMatchCate(selectedPostSEQ);
    setCategoryList(result.data);
  };

  // 프로필카드 모달 여는 함수
  const openProfile = () => {
    setIsProfileModalOpen(true);
  };

  // 프로필카드 모달 닫는 함수
  const handleCloseProfile = () => {
    setIsProfileModalOpen(false);
  };

  // 디테일뷰 닫는 함수
  const close = () => {
    handleCloseDetailView();
  };

  // 댓글 슬라이스
  const comments = useSelector((state) => {
    return state.comment;
  });

  // 게시물 카드 오픈
  const openModal = (imageIndex) => {
    setSelectedImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  // 게시물 카드 클로즈
  const closeModal = () => {
    setSelectedImageIndex(0);
    setIsModalOpen(false);
  };

  const deletePost = () => {
    deletePost(selectedPostSEQ);
    alert("게시물이 삭제됐습니다.");
    window.location.reload();
  };

  const ChatDTO = {
    id: user.id,
    postSEQ: selectedPostSEQ,
  };

  // 매칭신청
  const handleApplyClick = async () => {
    if (!user) {
      alert("로그인해주세요");
      return;
    }

    if (post.userInfo?.userId === user.id) {
      alert("본인이 작성한 게시물에는 신청할 수 없습니다.");
      return;
    }
    await saveData();
  };

  useEffect(() => {
    getPostAPI();
    getAttachmentsAPI();
    getMatchingCategoryInfoAPI();
  }, [selectedPostSEQ]);

  useEffect(() => {
    dispatch(viewComments(selectedPostSEQ));
  }, [dispatch]);

  // 매칭신청 상세
  const saveData = async () => {
    const MatchingUserInfoDTO = {
      token: user.token,
      postSEQ: selectedPostSEQ,
    };

    try {
      const response = await MatchingApply(MatchingUserInfoDTO);
      // 성공시 메세지 출력, 채팅방 생성 접속
      if (response.status === 200) {
        alert("신청 성공 및 채팅방 생성!");
        await joinChatRoom(ChatDTO);
        await dispatch(asyncChatRooms(user.id));
      }
    } catch (error) {
      // 반환값에 따라 신청한 게시물 확인 처리
      if (error.response && error.response.status === 409) {
        alert("이미 신청한 게시물입니다.");
      } else {
        console.error("오류 발생", error);
      }
    }
  };

  return (
    <StyledDetailView>
      <div className="detail_post">
        <div className="detail_post_top">
          <div onClick={close}>x</div>
        </div>
        <div className="detail_post_body">
          <div className="detail_post_info">
            <div className="profile" onClick={openProfile}>
              <img
                src={
                  post?.userInfo?.profileImg
                    ? `/uploadprofile/${post?.userInfo?.profileImg}`
                    : defaultimg
                }
              />
              <div className="detail_nickname">
                {post?.userInfo?.userNickname}
              </div>
            </div>
            <div className="post_date">{formatDate24Hours(post?.postDate)}</div>
          </div>
          <div className="title">{post?.postTitle}</div>
          <div className="content">{post?.postContent}</div>
          <div className="board_image_list">
            <div className="board_image">
              {attachments
                ?.filter(
                  (attachment) => attachment.post?.postSEQ === post.postSEQ
                )
                ?.map((filterattachment, index) => (
                  <img
                    key={index}
                    src={`/upload/${filterattachment?.attachmentURL}`}
                    alt={`이미지 ${index + 1}`}
                    onClick={() => openModal(index)}
                  />
                ))}
            </div>
          </div>
          <div className="category_place">
            <div className="category_list">
              {categoryList.map((category) => (
                <div
                  className="detail_category"
                  key={category.matchingCategorySEQ}
                >
                  {category.category.categoryName}
                </div>
              ))}
            </div>
            <div className="detail_place">
              {post?.place?.placeType?.placeTypeName} {post?.place?.placeName}
            </div>
          </div>
        </div>
        <div className="detail_button">
          <button className="play_btn" onClick={handleApplyClick}>
            신청
          </button>
          <div>
            {user?.id === post?.userInfo?.userId ? (
              <div className="update_delete">
                <Link className="update" to={`/postedit/${selectedPostSEQ}`}>
                  수정
                </Link>
                <button className="delete" onClick={deletePost}>
                  삭제
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <AddComment code={post !== null ? post.postSEQ : null} />
        {comments
          .filter((comment) => comment.commentDelete === "N")
          .map((comment) => (
            <Comment key={comment.commentsSEQ} comment={comment} />
          ))}
      </div>

      {isModalOpen && (
        <div className="Matching-modal-overlay">
          <div className="Matching-modal">
            <div
              onClick={() => {
                if (selectedImageIndex > 0) {
                  setSelectedImageIndex(selectedImageIndex - 1);
                }
              }}
              className="arrow-button left-arrow"
            >
              &lt;
            </div>
            <Carousel
              showArrows={false}
              selectedItem={selectedImageIndex}
              dynamicHeight={true}
              showThumbs={false}
            >
              {attachments
                ?.filter(
                  (attachment) => attachment.post?.postSEQ === post.postSEQ
                )
                ?.map((filterattachment, index) => (
                  <div key={index}>
                    <img
                      src={`/upload/${filterattachment?.attachmentURL}`}
                      alt={`이미지 ${index + 1}`}
                    />
                  </div>
                ))}
            </Carousel>
            <div
              onClick={() => {
                if (selectedImageIndex < attachments?.length - 1) {
                  setSelectedImageIndex(selectedImageIndex + 1);
                }
              }}
              className="arrow-button right-arrow"
            >
              &gt;
            </div>
          </div>
          <div onClick={closeModal} className="close-button">
            &times;
          </div>
        </div>
      )}
      {isProfileModalOpen && (
        <ProfileModal
          userId={post.userInfo.userId}
          handleCloseProfile={handleCloseProfile}
        />
      )}
    </StyledDetailView>
  );
};
export default DetailView;
