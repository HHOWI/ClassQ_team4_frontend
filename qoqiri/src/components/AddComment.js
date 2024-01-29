import { addComment } from "../store/commentSlice";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";

const StyledAddComment = styled.form`
  text-align: center;
  margin: 20px;

  &.active {
    display: none;
  }

  input[type="text"] {
    width: 89%;
    border: none;
    border-bottom: 1px solid #ddd;
    height: 7vh;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 5px;
  }

  input[type="submit"] {
    background: #ff7f38;
    border-style: none;
    color: white;
    border-radius: 5px;
    margin: 10px;
    padding: 5px 10px;
    height: 25px;
    margin-left: 10px;
    font-size: 10px;
    font-weight: 700;
  }
`;

const AddComment = ({ code, active, parent }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 여부 확인 로직
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = { post: code, commentDesc: comment };
    if (parent !== undefined) {
      data.commentsParentSeq = parent;
    }
    dispatch(addComment(data));
    setComment("");

    alert("댓글이 추가되었습니다!");
    window.location.reload();
  };
  return (
    <StyledAddComment onSubmit={onSubmit} className={active ? "active" : ""}>
      {isLoggedIn ? (
        <>
          <input
            type="text"
            value={comment}
            placeholder="댓글을 달아 원하는 끼리를 찾아보세요."
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <input type="submit" value="댓글" />
        </>
      ) : (
        <p>댓글을 작성하려면 로그인이 필요합니다.</p>
      )}
    </StyledAddComment>
  );
};
export default AddComment;
