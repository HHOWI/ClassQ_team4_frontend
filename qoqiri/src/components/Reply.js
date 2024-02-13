import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteComment,
  updateComment,
  viewComments,
} from "../store/commentSlice";
import { formatDate24Hours } from "../utils/TimeFormat";
import { delLike, getLike, postLike } from "../api/commentLike";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import ProfileModal from "./ProfileModal";

const StyledReply = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: row;

  .reply_flex {
    width: 5%;
  }

  .comment_list {
    width: 100%;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .comment_top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;

    .comment_nickname_date {
      display: flex;
      flex-direction: row;

      .comment_nickname {
        font-weight: bold;
        margin-right: 10px;
      }

      .comment_date {
        font-size: 0.75rem;
        color: gray;
        margin-top: auto;
      }
    }
  }

  .comment_and_button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #ededed;
  }

  .comment_info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .comment_content {
    overflow-wrap: break-word;
    word-wrap: break-word;
    line-height: 18px;
  }

  .comment_button_list {
    margin-left: auto;
  }

  .comment_button {
    background-color: transparent;
    color: #aaaaaa;
    border-style: none;
    font-size: 0.8rem;
  }

  .comment_button:hover {
    color: gray;
    text-decoration: underline;
  }
`;

const Reply = ({ reply }) => {
  const [content, setContent] = useState(reply.commentDesc);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [seq, setSeq] = useState(0);
  const [like, setLike] = useState(0);
  const [liked, setLiked] = useState(false);
  const user = useSelector((state) => state.user);
  const blockUserList = useSelector((state) => state.blockUsers);
  const dispatch = useDispatch();

  const likeAPI = async () => {
    // 서버에서 사용자가 현재 Comment를 좋아요 했는지 여부를 확인
    const result = await getLike(reply.commentsSEQ);
    setLiked(result.data > 0); // 사용자가 좋아요를 했으면 true, 아니면 false로 설정
    setLike(result.data); // 좋아요 수 설정
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const editCancel = () => {
    setContent(reply.commentDesc);
    setIsEditing(false);
  };

  // 프로필카드 모달 여는 함수
  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
  };

  // 프로필카드 모달 닫는 함수
  const handleCloseProfile = () => {
    setIsProfileModalOpen(false);
  };

  // 차단한 사용자인지 확인
  const isBlocked = blockUserList.some(
    (blockUser) => blockUser.blockInfo.userId === reply.userInfo.userId
  );

  const toggleLike = async () => {
    if (liked) {
      const response = await delLike(seq);
      if (response.status === 200) {
        setLiked(false);
        setLike(like - 1);
        // 좋아요를 취소할 때 'seq'를 localStorage에서 제거
        localStorage.removeItem(`seq_${reply.commentsSEQ}`);
        setSeq(null); // 'seq' 상태를 null로 설정
      } else {
        console.error("좋아요 취소 중에 문제가 발생했습니다.");
      }
    } else {
      try {
        const commentLikeId = reply.commentsSEQ;
        const response = await postLike({
          commentLikeId,
          commentsSEQ: reply.commentsSEQ,
          userInfo: reply.userInfo,
        });
        setSeq(response.data.clSEQ);
        if (response.status === 200) {
          setLiked(true);
          setLike(like + 1);
          // 좋아요를 할 때 'seq'를 localStorage에 저장
          localStorage.setItem(`seq_${reply.commentsSEQ}`, response.data.clSEQ);
        } else {
          console.error("좋아요 추가 중에 문제가 발생했습니다.");
        }
      } catch (error) {
        console.error("좋아요 추가 중에 문제가 발생했습니다.", error);
      }
    }
  };

  const onUpdate = async () => {
    await dispatch(
      updateComment({
        commentsSEQ: reply.commentsSEQ,
        commentDesc: content,
      })
    );

    await dispatch(viewComments(reply.post));
    setIsEditing(false);
  };
  const onDelete = async () => {
    await dispatch(
      deleteComment({
        commentsSEQ: reply.commentsSEQ,
        commentsParentSeq: reply.commentsParentSeq,
      })
    );

    await dispatch(viewComments(reply.post));
  };

  useEffect(() => {
    likeAPI();

    // 댓글마다의 'seq' 값을 localStorage에서 가져와 설정
    const storedSeq = localStorage.getItem(`seq_${reply.commentsSEQ}`);
    if (storedSeq) {
      setSeq(storedSeq);
    }
  }, []);

  return (
    <StyledReply>
      <div className="reply_flex" />
      <div className="comment_list">
        {isBlocked ? (
          <div className="block_comment">차단한 사용자의 댓글입니다.</div>
        ) : (
          <>
            <div className="comment_top">
              <div className="comment_nickname_date">
                <div className="comment_nickname" onClick={handleOpenProfile}>
                  ┗ {reply.userInfo.userNickname}
                </div>
                <div className="comment_date">
                  {formatDate24Hours(reply.commentDate)}
                </div>
              </div>
              <div className="comment_like">
                <div className="comment_like_icon">
                  {liked ? ( // liked 상태에 따라 아이콘 변경
                    <FontAwesomeIcon
                      icon={solidThumbsUp}
                      className="like"
                      onClick={toggleLike}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      className="like"
                      onClick={toggleLike}
                    />
                  )}
                </div>
                {like > 0 && <div className="comment_like_count">{like}</div>}
              </div>
            </div>

            <div className="comment_and_button">
              <div className="comment_info">
                {isEditing ? (
                  <textarea
                    className="comment_edit"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    cols={50}
                  />
                ) : (
                  <div className="comment_content">{content}</div>
                )}
                {user.id === reply.userInfo.userId && (
                  <div className="comment_button_list">
                    {isEditing ? ( // 수정 중일 때는 저장과 취소 버튼 표시
                      <>
                        <button className="comment_button" onClick={onUpdate}>
                          저장
                        </button>
                        <button className="comment_button" onClick={editCancel}>
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="comment_button" onClick={handleEdit}>
                          수정
                        </button>
                        <button className="comment_button" onClick={onDelete}>
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {isProfileModalOpen && (
        <ProfileModal
          userId={reply.userInfo.userId}
          handleCloseProfile={handleCloseProfile}
        />
      )}
    </StyledReply>
  );
};
export default Reply;
