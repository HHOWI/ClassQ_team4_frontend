import { addComment, viewComments } from "../store/commentSlice";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useState, useEffect } from "react";

const StyledAddComment = styled.form`
  width: 100%;
  padding: 15px;
  background-color: white;
  display: flex;
  justify-content: center;

  .add_comment {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dddddd;
    border-radius: 20px;
  }

  &.active {
    display: none;
  }

  .add_box {
    width: 80%;
    min-height: 60%;
    padding: 10px;
    background-color: #eeeeee;
    border: none;
    border-bottom: 1px solid #dddddd;
    color: rgb(49, 49, 49);
    font-size: 0.9rem;
    font-weight: bold;
    border-radius: 5px;
    outline-color: #ff7f38;
    resize: none;
  }

  .add_btn {
    width: 80px;
    height: 60%;
    background: #ff7f38;
    border-style: none;
    color: white;
    border-radius: 5px;
    margin-left: 5px;
    font-size: 0.9rem;
    font-weight: bold;
  }
`;

const AddComment = ({ code, active, parent }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // 로그인 여부 확인 로직
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const onSubmit = async (e) => {
    await e.preventDefault();
    const data = { post: code, commentDesc: comment, userId: user.id };
    if (parent !== undefined) {
      data.commentsParentSeq = parent;
    }
    await dispatch(addComment(data));
    await setComment("");
    await dispatch(viewComments(code));
  };
  return (
    <StyledAddComment onSubmit={onSubmit} className={active ? "active" : ""}>
      {isLoggedIn ? (
        <div className="add_comment">
          <textarea
            className="add_box"
            type="text"
            value={comment}
            placeholder="댓글을 달아 원하는 끼리를 찾아보세요."
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <input className="add_btn" type="submit" value="댓글" />
        </div>
      ) : (
        <div className="please_login">
          댓글을 작성하려면 로그인이 필요합니다.
        </div>
      )}
    </StyledAddComment>
  );
};
export default AddComment;
