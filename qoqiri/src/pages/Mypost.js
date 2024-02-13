import React, { useState, useEffect } from "react";
import { getMyPosts } from "../api/post";
import "../css/Mypost.css";
import MyInfoHeader from "../components/MyInfoHeader";

function Mypost() {
  const [myPosts, setMyPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("user");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);

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
                <td>{post.postTitle}</td>
                <td>{post.postContent}</td>
                <td>{post.postDate.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Mypost;
