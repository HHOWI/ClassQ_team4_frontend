import styled from "styled-components";
import AddComment from "./AddComment";
import { useState, useRef, useEffect } from "react";
import Reply from "./Reply";
import { useDispatch } from "react-redux";
import { deleteComment, updateComment } from "../store/commentSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { getLike, postLike, delLike } from "../api/commentLike";
import { formatDate24Hours } from "../utils/TimeFormat";

const StyledComment = styled.div`
  width: 750px;
  margin: 10px auto;
  margin-bottom: 30px;

  h2 {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .buttons {
    display: flex;
    height: 30px;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .comment-button {
    background: #ff7f38;
    color: white;
    border-radius: 5px;
    padding: 5px 10px;
    height: 25px;
    margin-left: 10px;
    border-style: none;
    font-size: 10px;
    font-weight: 700;
  }

  .buttonFlex {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .like {
    cursor: pointer;
    color: #ff9326;
  }
  .like:hover {
    color: #ff7200;
  }
  .like-count {
    display: flex;
    gap: 6px;
  }
  .like-count {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 750;
  }

  .spanButton {
    display: flex;
  }
  .spanButton span {
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Comment = ({ comment }) => {
  const [isActive, setIsActive] = useState(true);
  const [content, setContent] = useState(comment.commentDesc);
  const [like, setLike] = useState(0);
  const contentRef = useRef(null);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [seq, setSeq] = useState(0);
  const [likeStatus, setLikeStatus] = useState(false);
  const [userInfo, setUserinfo] = useState([]);

  const onClick = () => {
    setIsActive(!isActive);
  };

  const handleBlur = () => {
    setContent(contentRef.current.innerText);
  };

  const likeAPI = async () => {
    // 서버에서 사용자가 현재 Comment를 좋아요 했는지 여부를 확인
    const result = await getLike(comment.commentsSEQ);
    setLiked(result.data > 0); // 사용자가 좋아요를 했으면 true, 아니면 false로 설정
    setLike(result.data); // 좋아요 수 설정
  };

  const toggleLike = async () => {
    if (liked) {
      const response = await delLike(seq);
      if (response.status === 200) {
        setLiked(false);
        setLike(like - 1);
        // 좋아요를 취소할 때 'seq'를 localStorage에서 제거
        localStorage.removeItem(`seq_${comment.commentsSEQ}`);
        setSeq(null); // 'seq' 상태를 null로 설정
      } else {
        console.error("좋아요 취소 중에 문제가 발생했습니다.");
      }
    } else {
      try {
        const commentLikeId = comment.commentsSEQ;
        const response = await postLike({
          commentLikeId,
          comments: comment,
          userInfo: comment.userInfo,
        });
        setSeq(response.data.clSEQ);
        if (response.status === 200) {
          setLiked(true);
          setLike(like + 1);
          // 좋아요를 할 때 'seq'를 localStorage에 저장
          localStorage.setItem(
            `seq_${comment.commentsSEQ}`,
            response.data.clSEQ
          );
        } else {
          console.error("좋아요 추가 중에 문제가 발생했습니다.");
        }
      } catch (error) {
        console.error("좋아요 추가 중에 문제가 발생했습니다.", error);
      }
    }
  };

  useEffect(() => {
    likeAPI();

    // 댓글마다의 'seq' 값을 localStorage에서 가져와 설정
    const storedSeq = localStorage.getItem(`seq_${comment.commentsSEQ}`);
    if (storedSeq) {
      setSeq(storedSeq);
    }
  }, []);

  const onUpdate = () => {
    dispatch(
      updateComment({
        commentsSEQ: comment.commentsSEQ,
        post: comment.post,
        commentDesc: content,
      })
    );
    alert("수정완료!");
    window.location.reload();
  };
  const onDelete = () => {
    dispatch(
      deleteComment({
        commentsSEQ: comment.commentsSEQ,
        post: comment.post,
        commentsParentSeq: comment.commentsParentSeq,
        userInfo: comment.userInfo,
        commentDesc: content,
        secretComment: "N",
        commentDelete: "Y",
      })
    );
    alert("삭제완료!");
    window.location.reload();
  };

  return (
    <StyledComment>
      <h2>@{comment.userInfo.userNickname}</h2>
      <div className="buttons">
        <div className="spanButton">
          <span
            contentEditable="true"
            suppressContentEditableWarning
            ref={contentRef}
            onBlur={handleBlur}
          >
            {content}
          </span>
          <div className="buttonFlex">
            <button className="comment-button" onClick={onClick}>
              <p>답글</p>
            </button>
            <button className="comment-button" onClick={onUpdate}>
              댓글 수정
            </button>
            <button className="comment-button" onClick={onDelete}>
              댓글 삭제
            </button>
          </div>
        </div>
        <div className="like-count">
          <div className="like-count">
            {formatDate24Hours(comment.commentDate)}
          </div>
          <div className="like-count">
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
            {like}
            {/* 좋아요 수 렌더링 */}
          </div>
        </div>
      </div>

      <AddComment
        active={isActive}
        parent={comment.commentsSEQ}
        code={comment.post}
      />
      {comment.replies
        ?.filter((comment) => comment.commentDelete == "N")
        .map((reply) => (
          <Reply reply={reply} key={reply.commentsSEQ} />
        ))}
    </StyledComment>
  );
};
export default Comment;
