import React, { useState, useEffect } from "react";
import { getComment } from "../api/comment";
import "../css/Mycomments.css";
import MyInfoHeader from "../components/MyInfoHeader";

function MyComments() {
  const [myComments, setMyComments] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("user");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);

      const getMyComments = async () => {
        try {
          if (parsedUserInfo) {
            const response = await getComment(parsedUserInfo.id);
            setMyComments(response.data);
            console.log(response.data);
          }
        } catch (error) {
          console.error("오류가 발생했습니다. ", error);
        }
      };
      getMyComments();
    }
  }, []);

  return (
    <>
      <MyInfoHeader />
      <div className="comments-container">
        <table className="comments-table">
          <thead>
            <tr>
              <th>댓글 번호</th>
              <th>댓글 내용</th>
              <th>작성 날짜</th>
            </tr>
          </thead>
          <tbody>
            {myComments.map((comment) => (
              <tr key={comment.commentsSEQ}>
                <td>{comment.commentsSEQ}</td>
                <td>{comment.commentDesc}</td>
                <td>{comment.commentDate.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MyComments;
