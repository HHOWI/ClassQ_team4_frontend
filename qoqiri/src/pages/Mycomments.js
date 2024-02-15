import React, { useState, useEffect } from "react";
import { getComment } from "../api/comment";
import "../css/Mycomments.css";
import MyInfoHeader from "../components/MyInfoHeader";
import DetailView from "../components/DetailView";

function MyComments() {
  const [myComments, setMyComments] = useState([]);
  const [postSEQ, setPostSEQ] = useState("");
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  // 게시글 상세보기 모달 열기 함수
  const handleOpenDetailView = async (postSEQ) => {
    await setPostSEQ(postSEQ);
    await setIsDetailViewOpen(true);
  };

  // 게시글 상세보기 모달 닫기 함수
  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
  };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("user");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);

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
                <td
                  onClick={() => handleOpenDetailView(comment.post?.postSEQ)}
                  style={{ cursor: "pointer" }}
                >
                  {comment.commentDesc}
                </td>
                <td>{comment.commentDate.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isDetailViewOpen && (
        <DetailView
          selectedPostSEQ={postSEQ}
          handleCloseDetailView={handleCloseDetailView}
        />
      )}
    </>
  );
}

export default MyComments;
