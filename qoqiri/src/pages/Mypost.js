import React, { useState, useEffect } from "react";
import { getMyPosts } from "../api/post";
import "../css/Mypost.css";
import MyInfoHeader from "../components/MyInfoHeader";
import DetailView from "../components/DetailView";

function Mypost() {
  const [myPosts, setMyPosts] = useState([]);
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

      const getMyPost = async () => {
        try {
          if (parsedUserInfo) {
            const response = await getMyPosts(parsedUserInfo.id);
            setMyPosts(response.data);
            console.log(response.data);
          }
        } catch (error) {
          console.error("오류가 발생했습니다. ", error);
        }
      };
      getMyPost();
    }
  }, []);

  return (
    <>
      <MyInfoHeader />
      <div className="post-container">
        <table className="post-table">
          <thead>
            <tr>
              <th>글 제목</th>
              <th>글 내용</th>
              <th>작성 날짜</th>
            </tr>
          </thead>
          <tbody>
            {myPosts.map((post) => (
              <tr key={post.id}>
                <td
                  onClick={() => handleOpenDetailView(post.postSEQ)}
                  style={{ cursor: "pointer" }}
                >
                  {post.postTitle}
                </td>
                <td>{post.postContent}</td>
                <td>{post.postDate.split("T")[0]}</td>
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

export default Mypost;
