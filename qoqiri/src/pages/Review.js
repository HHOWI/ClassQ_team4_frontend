import React, { useState, useEffect } from "react";
import {
  saveReview,
  updateReview,
  getAllReview,
  getMyMatchings,
} from "../api/review";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { deletePost } from "../api/post";
import ProfileModal from "../components/ProfileModal";
import DetailView from "../components/DetailView";
import { formatDate24Hours } from "../utils/TimeFormat";

const StyledReview = styled.div`
  width: 100%;
  padding-left: 240px;
  padding-top: 30px;
  padding-bottom: 50px;

  .rv-container {
    width: 100%;
    min-width: 1000px;
    padding-left: 180px;
    display: flex;
    flex-direction: column;
  }

  .rv-container h1 {
    color: #ff7f38;
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 30px;
  }

  .rv-input-area {
    width: 1000px;
    height: 80px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-bottom: 20px;
    gap: 2px;
  }

  .rv-select {
    width: 11%;
    height: 100%;
    display: flex;
    justify-items: baseline;
    font-size: 13px;
    font-weight: bold;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    color: rgb(49, 49, 49);
  }

  .rv_textbox {
    width: 85%;
    height: 100%;
    position: relative;

    textarea {
      width: 100%;
      height: 100%;
      padding: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      resize: none;
    }

    .rv-character-count {
      font-size: 0.9em;
      color: gray;
      position: absolute;
      bottom: 5px;
      right: 5px;
    }
  }

  .rv-write-button {
    width: 4%;
    height: 100%;
    font-weight: bold;
    background-color: #ff7f38;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .rv-review-board {
    width: 100%;
    min-width: 100px;
  }

  .rv-review-item {
    width: 1000px;
    height: 100px;
    padding: 15px;
    border-bottom: 1px solid #e0e0e08e;
    transition: background-color 0.3s;
  }

  .rv-review-item:hover {
    background-color: #f5f5f5;
  }

  .rv-review-item:last-child {
    border-bottom: none;
  }

  .rv_post_info {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .rv_post_content {
    font-size: 1.2rem;
    color: rgb(49, 49, 49);
  }

  .rv-menu {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .rv-info {
    font-size: 0.8rem;
    color: gray;
    .rv-writer {
      margin-right: 10px;
      cursor: pointer;
    }
    .rv_date {
      margin-right: 10px;
    }
    .rv-matching-title {
      cursor: pointer;
    }
  }

  .rv_edit {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    resize: none;
    height: 60px;
    width: 900px;
  }

  .rv-psUpdataOKBtn {
    background: none;
    border: none;
    color: blue;
    font-size: small;
    font-weight: bold;
  }

  .rv-psUpdataBtn {
    background: none;
    border: none;
    color: blue;
    font-size: small;
    font-weight: bold;
  }

  .rv-psDeleteBtn {
    background: none;
    border: none;
    color: blue;
    font-size: small;
    font-weight: bold;
  }

  .rv-review-item p {
    font-size: 20px;
  }
`;

const ReviewBoard = () => {
  const user = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [content, setContent] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [myMatchings, setMyMatchings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [selectedMatching, setSelectedMatching] = useState(""); // 선택된 글 타이틀
  const [editingPostTitle, setEditingPostTitle] = useState(""); // 수정할 글 타이틀
  const [writerId, setWriterId] = useState("");
  const [postSEQ, SetPostSEQ] = useState("");

  const getAllReviewAPI = async () => {
    const result = await getAllReview();
    setReviews(result.data);
  };

  const getMyMatchingsAPI = async () => {
    const result = await getMyMatchings(user.id);
    setMyMatchings(result.data);
  };

  const handleOpenProfile = (id) => {
    setWriterId(id);
  };

  const handleCloseProfile = () => {
    setWriterId(null);
  };

  const handleOpenDetailView = (postSEQ) => {
    SetPostSEQ(postSEQ);
  };

  // 게시글 상세보기 모달 닫기 함수
  const handleCloseDetailView = () => {
    SetPostSEQ(null);
  };

  // 리뷰 수정버튼 활성화함수
  const handleEditClick = (postId, content, postTitle) => {
    setIsEditing(true);
    setEditingPostId(postId);
    setEditingContent(content);
    setEditingPostTitle(postTitle);
  };

  // 리뷰 업데이트 확인함수
  const handleUpdateSubmit = async () => {
    // 수정 로직
    const updateData = {
      token: user.token,
      postTitle: editingPostTitle,
      postContent: editingContent,
      board: 2,
      postSEQ: editingPostId,
    };

    try {
      await updateReview(updateData);
      alert("게시글이 수정되었습니다.");
      setIsEditing(false);
      setEditingPostId(null);
      setContent("");
      getAllReviewAPI();
    } catch (error) {
      alert("게시글 수정에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  // 리뷰 삭제 확인함수
  const handleDeleteClick = async (postSEQ) => {
    try {
      await deletePost(postSEQ);
      alert("리뷰가 삭제되었습니다.");
      // 드롭박스를 업데이트하기 위해 사용자 글 목록을 다시 가져옴
      getMyMatchingsAPI();
      getAllReviewAPI();
    } catch (error) {
      alert("리뷰 삭제에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  // 드롭박스로 선택한 매칭글 담기
  const handleMatchingSelect = async (data) => {
    await setSelectedMatching(data);
  };

  // 글쓰기 버튼 함수
  const handleWriteClick = async () => {
    // 글 타이틀이 선택되지 않았을 경우 글쓰기 방지
    if (!selectedMatching || selectedMatching === "글 타이틀 선택") {
      alert("글 타이틀을 선택해주세요.");
      return;
    }

    if (content.length <= 50) {
      // PostDTO 형식에 맞게 reviewData 객체를 수정
      const PostDTO = {
        postSEQ: selectedMatching,
        token: user.token, //로그인한 사용자의 토큰
        postContent: content,
        boardSEQ: 2,
        postTitle: selectedMatching,
      };
      try {
        // 리뷰 내용을 백엔드로 전송
        await saveReview(PostDTO);
        alert("리뷰가 저장되었습니다.");
        getAllReviewAPI();
        getMyMatchingsAPI();
        setContent("");
      } catch (error) {
        alert("리뷰 저장에 실패하였습니다. 다시 시도해주세요.");
      }
    } else {
      alert("50자를 초과할 수 없습니다.");
    }
  };

  // 리뷰글 수정 함수
  const handleContentChange = (e, isEditingMode = false) => {
    const value = e.target.value;
    if (value.length <= 50) {
      if (isEditingMode) {
        setEditingContent(value);
      } else {
        setContent(value);
      }
    } else {
      alert("50자를 초과할 수 없습니다.");
    }
  };

  useEffect(() => {
    setLoggedInUser(user);
    getMyMatchingsAPI(); // 사용자 글 목록 가져오기
    getAllReviewAPI();
  }, [user]);

  return (
    <StyledReview>
      <div className="rv-container">
        <h1>저는 이랬어요</h1>
        <div className="rv-input-area">
          <select
            className="rv-select"
            value={selectedMatching}
            onChange={(e) => handleMatchingSelect(e.target.value)}
          >
            <option value={""}>원글 제목 선택</option>
            {myMatchings.map((myMatching) => (
              <option
                key={myMatching.post?.postSEQ}
                value={myMatching.post?.postSEQ}
              >
                {myMatching.post?.postTitle}
              </option>
            ))}
          </select>
          <div className="rv_textbox">
            <textarea
              placeholder="리뷰 내용을 입력하세요. (50자를 초과할 수 없습니다.)"
              value={content}
              onChange={handleContentChange}
            />
            <div className="rv-character-count">{content.length}/50</div>
          </div>
          <button className="rv-write-button" onClick={handleWriteClick}>
            글쓰기
          </button>
        </div>
        <div className="rv-review-board">
          {reviews.map((po) => (
            <div key={po.postSEQ} className="rv-review-item">
              {isEditing && editingPostId === po.postSEQ ? (
                <>
                  <textarea
                    className="rv_edit"
                    value={editingContent}
                    onChange={(e) => handleContentChange(e, true)}
                  />
                  <button
                    className="rv-psUpdataOKBtn"
                    onClick={handleUpdateSubmit}
                  >
                    수정 완료
                  </button>
                </>
              ) : (
                <>
                  <div className="rv_post_info">
                    <div className="rv_post_content">{po.postContent}</div>
                    <div className="rv-menu">
                      <div className="rv-info">
                        <span
                          className="rv-writer"
                          onClick={() => handleOpenProfile(po.userInfo.userId)}
                        >
                          작성자: {po.userInfo.userNickname}
                        </span>
                        <span className="rv_date">
                          {formatDate24Hours(po.postDate)}
                        </span>
                        <span
                          className="rv-matching-title"
                          onClick={() => handleOpenDetailView(po.postTitle)}
                        >
                          원글
                        </span>
                      </div>
                      {loggedInUser.id === po.userInfo.userId && (
                        <div className="rv-persnalBtn">
                          <button
                            className="rv-psUpdataBtn"
                            onClick={() =>
                              handleEditClick(
                                po.postSEQ,
                                po.postContent,
                                po.postTitle
                              )
                            }
                          >
                            수정
                          </button>
                          <button
                            className="rv-psDeleteBtn"
                            onClick={() => handleDeleteClick(po.postSEQ)}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {writerId && (
        <ProfileModal
          userId={writerId}
          handleCloseProfile={handleCloseProfile}
        />
      )}
      {postSEQ && (
        <DetailView
          selectedPostSEQ={postSEQ}
          handleCloseDetailView={handleCloseDetailView}
        />
      )}
    </StyledReview>
  );
};

export default ReviewBoard;
