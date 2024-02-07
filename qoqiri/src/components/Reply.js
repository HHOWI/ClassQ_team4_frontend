import styled from "styled-components";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteComment,
  updateComment,
  viewComments,
} from "../store/commentSlice";
import { formatDate24Hours } from "../utils/TimeFormat";

const Box = styled.div`
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
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const editCancel = () => {
    setContent(reply.commentDesc);
    setIsEditing(false);
  };

  const onDelete = () => {
    dispatch(
      deleteComment({
        commentsSEQ: reply.commentsSEQ,
        post: reply.post,
        commentsParentSeq: reply.commentsParentSeq,
        userInfo: reply.userInfo,
        commentDesc: content,
        secretComment: "N",
        commentDelete: "Y",
      })
    );

    dispatch(viewComments(reply.post));
  };

  const onUpdate = () => {
    dispatch(
      updateComment({
        commentsSEQ: reply.commentsSEQ,
        post: reply.post,
        commentDesc: content,
        commentsParentSeq: reply.commentsParentSeq,
      })
    );
    dispatch(viewComments(reply.post));
    setIsEditing(false);
  };
  return (
    <Box>
      <div className="reply_flex" />
      <div className="comment_list">
        <div className="comment_top">
          <div className="comment_nickname_date">
            <div className="comment_nickname">
              {reply.userInfo.userNickname}
            </div>
            <div className="comment_date">
              {formatDate24Hours(reply.commentDate)}
            </div>
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
      </div>
    </Box>
  );
};
export default Reply;
