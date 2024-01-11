import React, { useEffect, useState } from "react";
import "../css/MatchingBoard.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Date from "../components/Date";
import { editPostAPI, getPost, getPosts } from "../api/post";
import UserRating from "../components/UserRating";
import { viewComments } from "../store/commentSlice";
import { useSelector, useDispatch } from "react-redux";
import AddComment from "../components/AddComment";
import Comment from "../components/Comment";
import { MatchingApply } from "../api/matching"; // 신청버튼테스트용
import { createChatRoom, joinChatRoom } from "../api/chat";
import styled from "styled-components";
import { asyncChatRooms } from "../store/chatRoomSlice";

const Detail = styled.div`
  border-top: 33px solid #ff7f38;

  .board-detail {
    margin-top: 30px;
    margin-left: 20px;
    margin-right: 20px;
    min-height: 100%;
    position: relative;
    padding-bottom: 60px;
  }

  .board-header-time {
    margin-top: 15px;
    margin-right: 10px;
  }

  .board-image-main {
    margin-top: 20px;
  }

  .board-image img {
    margin-left: 10px;
  }

  .write-board {
    margin-top: 70px;
    margin-bottom: 20px;
  }

  .foot-place-detail {
    top: 200px;
    flex-direction: column;
    margin-right: 20px;
  }

  .foot-place {
    display: flex;
    gap: 4px;
  }

  .foot-post {
    width: 100%;
    padding: 5px;
    background-color: #ff7f38;
    bottom: 0;
    margin-top: 10px;
    position: relative;
  }

  .footFlex {
    maring-left: 100px;
    text-align: right;
  }

  .post-put {
    padding: 5.85px 10px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 1rem;
    line-height: 14px;
    background-color: #ff7f38;
    color: #ffffff;
    border-style: none;
  }
  .post-delete {
    padding: 5px 10px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 1rem;
    line-height: 14px;
    background-color: #ff7f38;
    color: #ffffff;
    border-style: none;
    margin-left: 10px;
    margin-right: 10px;
  }

  .carousel img {
    height: 500px;
    padding: 30px;
  }
`;

const DetailView = ({ selectedPostSEQ, attachments }) => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [post, setPost] = useState({});
  const [commentsCount, setCommentsCount] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const comments = useSelector((state) => {
    return state.comment;
  });

  const openModal = (imageIndex) => {
    setSelectedImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImageIndex(0);
    setIsModalOpen(false);
  };

  const postsAPI = async () => {
    const result = await getPosts();
    setPosts(result.data);
  };
  const getPostAPI = async () => {
    const result = await getPost(selectedPostSEQ);
    setPost(result.data);
  };

  const ChatDTO = {
    id: user.id,
    postSEQ: selectedPostSEQ,
  };

  const deletePost = () => {
    editPostAPI(selectedPostSEQ);
    alert("게시물이 삭제됐습니다.");
  };

  // 매칭신청
  const handleApplyClick = async () => {
    const currentPost = posts.find((po) => po.postSEQ === selectedPostSEQ);

    if (!user.id || !user.token) {
      alert("로그인해주세요");
      return;
    }

    if (currentPost?.userInfo?.userId === user.id) {
      alert("본인이 작성한 게시물에는 신청할 수 없습니다.");
      return;
    }
    await saveData();
  };

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

  useEffect(() => {
    getPostAPI();
    postsAPI();
  }, []);

  useEffect(() => {
    dispatch(viewComments(selectedPostSEQ));
  }, [dispatch]);

  return (
    <Detail>
      <div className="board-detail" key={post?.postSEQ}>
        <div className="board-header-time">
          <Date postDate={post?.postDate} />
        </div>
        <div className="board-header">
          <div className="profile">
            <img
              src={`/uploadprofile/${post?.userInfo?.profileImg}`}
              alt="프로필 이미지"
            />
          </div>
          <div className="titleNickname">
            <div className="title">{post?.postTitle}</div>
            <span className="nickname">{post?.userInfo?.userNickname}</span>
          </div>
        </div>
        <div className="board-image-main">
          <div className="board-image">
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
        <div className="write-board">
          <div className="write">{post?.postContent}</div>
        </div>
        <button className="play" onClick={handleApplyClick}>
          같이놀자!
        </button>
        <div className="foot-place-detail">
          <div className="foot-place">
            <p>{post?.place?.placeName}</p>
            <p>{post?.place?.placeType?.placeTypeName}</p>
          </div>
        </div>
        <hr />
        <AddComment code={post !== null ? post.postSEQ : null} />
        {comments
          .filter((comment) => comment.commentDelete === "N")
          .map((comment) => (
            <Comment key={comment.commentsSEQ} comment={comment} />
          ))}
      </div>
      <div className="foot-post">
        {user?.id === post?.userInfo?.userId ? (
          <div className="footFlex">
            <a className="post-put" href={`/postedit/${selectedPostSEQ}`}>
              수정
            </a>
            <button className="post-delete" onClick={deletePost}>
              삭제
            </button>
          </div>
        ) : null}
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
            <div onClick={closeModal} className="close-button">
              &times;
            </div>
          </div>
        </div>
      )}
    </Detail>
  );
};
export default DetailView;
