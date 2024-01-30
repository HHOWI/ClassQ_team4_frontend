import styled from "styled-components";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteComment, updateComment } from "../store/commentSlice";
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
  const contentRef = useRef(null);
  const dispatch = useDispatch();
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
    alert("댓글 삭제 완료!");
    window.location.reload();
  };
  const handleBlur = () => {
    setContent(contentRef.current.innerText);
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
    alert("댓글 수정 완료!");
    window.location.reload();
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
            <div
              className="comment_content"
              contentEditable="true"
              suppressContentEditableWarning
              ref={contentRef}
              onBlur={handleBlur}
            >
              {content}
            </div>
            <div className="comment_button_list">
              <button className="comment_button" onClick={onUpdate}>
                수정
              </button>
              <button className="comment_button" onClick={onDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};
export default Reply;
