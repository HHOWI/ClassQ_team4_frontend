import React, { useEffect, useState } from "react";
import defaultimg from "../assets/defaultimg.png";
import styled from "styled-components";
import {
  getAttachments,
  getPost,
  getMatchCate,
  deletePost,
  viewCount,
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
import ImageModal from "./ImageModal";

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

  .post_comment {
    width: 700px;
    height: 550px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }

  .post_comment::-webkit-scrollbar {
    display: none;
  }

  .detail_post {
    width: 700px;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .detail_post_top {
    width: 700px;
    height: 25px;
    background-color: #ff7f38;
    position: fixed;
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
    min-height: 380px;
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

  .detail_profile {
    width: 50%;
    display: flex;
    flex-direction: row;
    gap: 15px;
    cursor: pointer;
    img {
      border-radius: 100px;
    }

    .detail_nickname {
      font-size: 1rem;
      font-weight: bold;
      color: rgb(49, 49, 49);
      margin-top: auto;
      margin-bottom: auto;
    }
  }

  .post_place_date {
    font-size: 0.8rem;
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
    min-height: 60px;
    margin-bottom: 20px;
    color: rgb(49, 49, 49);
    line-height: 18px;
  }

  .detail_image_list {
    width: 100%;
    height: 130px;
    display: flex;
    flex-direction: row;
    gap: 3px;
    margin-bottom: 10px;
    justify-content: flex-end;
    img {
      width: 20%;
      height: 100%;
      border-radius: 10px;
      object-fit: cover;
      cursor: pointer;
    }
  }

  .category_list {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: auto;
    flex-wrap: wrap;
  }

  .detail_category {
    width: fit-content;
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
    border-bottom: 0.5px solid #dddddd;
    .play_btn {
      width: 400px;
      height: 50px;
      color: rgb(49, 49, 49);
      font-weight: bold;
      background-color: #ededed;
      transition: background-color 0.2s ease;
      border: none;
      border-radius: 10px;
    }

    .update_delete {
      margin-top: auto;
    }
  }

  .play_btn:hover {
    background-color: #dddddd;
  }

  .update,
  .delete {
    font-size: 0.8rem;
    color: gray;
    border: none;
    background-color: transparent;
    margin-left: 10px;
  }

  .update:hover,
  .delete:hover {
    text-decoration: underline;
  }
`;

const DetailView = ({ selectedPostSEQ, handleCloseDetailView }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [post, setPost] = useState({});
  const [attachmentList, setAttachmentList] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const comments = useSelector((state) => state.comment);

  // 게시물 API
  const getPostAPI = async () => {
    const result = await getPost(selectedPostSEQ);
    setPost(result.data);
  };
  // 첨부파일 API
  const getAttachmentsAPI = async () => {
    const result = await getAttachments(selectedPostSEQ);
    setAttachmentList(result.data);
  };

  const getMatchingCategoryInfoAPI = async () => {
    const result = await getMatchCate(selectedPostSEQ);
    setCategoryList(result.data);
  };

  // 조회수 증가
  const viewCountAPI = async () => {
    await viewCount(selectedPostSEQ);
  };

  // 프로필카드 모달 여는 함수
  const handleOpenProfile = () => {
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

  // 게시물 이미지 오픈
  const handleOpenImage = (index) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  // 게시물 이미지 클로즈
  const handleCloseImage = () => {
    setSelectedImageIndex(0);
    setIsImageModalOpen(false);
  };

  const deletePostAPI = () => {
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
    viewCountAPI();
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
      <div className="post_comment">
        <div className="detail_post">
          <div className="detail_post_top">
            <div onClick={close}>x</div>
          </div>
          <div className="detail_post_body">
            <div className="detail_post_info">
              <div className="detail_profile" onClick={handleOpenProfile}>
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
              <div className="post_place_date">
                {post?.place?.placeType?.placeTypeName} {post?.place?.placeName}{" "}
                · {formatDate24Hours(post?.postDate)}
              </div>
            </div>
            <div className="title">{post?.postTitle}</div>
            <div className="content">{post?.postContent}</div>

            <div className="detail_image_list">
              {attachmentList.map((attachment, index) => (
                <img
                  key={attachment.postAttachmentSEQ}
                  src={`/upload/${attachment?.attachmentURL}`}
                  alt={`이미지 ${index + 1}`}
                  onClick={() => handleOpenImage(index)}
                />
              ))}
            </div>

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
          </div>
          <div className="detail_button">
            {post.matched == "Y" ? (
              <button className="play_btn">완료된 매칭입니다</button>
            ) : (
              <button className="play_btn" onClick={handleApplyClick}>
                신청
              </button>
            )}

            {user?.id === post?.userInfo?.userId ? (
              <div className="update_delete">
                <Link className="update" to={`/postedit/${selectedPostSEQ}`}>
                  수정
                </Link>
                <button className="delete" onClick={deletePostAPI}>
                  삭제
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <AddComment code={post !== null ? post.postSEQ : null} />
        {comments?.map((comment) => (
          <Comment key={comment.commentsSEQ} comment={comment} />
        ))}
      </div>

      {isImageModalOpen && (
        <ImageModal
          index={selectedImageIndex}
          attachmentList={attachmentList}
          handleCloseImage={handleCloseImage}
        />
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
