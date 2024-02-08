import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPosts, headerSearch } from "../api/post";
import styled from "styled-components";
import Post from "../components/Post";

const StyledSearch = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .main {
    width: 100%;
    min-width: 1450px;
    padding-left: 240px;
    padding-bottom: 250px;
    background-color: rgb(231, 240, 252);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .post_list {
    width: 1200px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .more_post {
    width: 200px;
    height: 50px;
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 30px;
    border: none;
    border-radius: 10px;
    color: white;
    background-color: #ff7f38;
  }
`;

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // 페이지 번호 추가
  const { keyword } = useParams();
  const user = useSelector((state) => state.user);

  const headerSearchAPI = async () => {
    const result = await headerSearch(1, user.id, keyword);
    await setPosts(result.data);
  };

  // 더보기 버튼
  const loadMorePosts = async () => {
    const nextPage = page + 1;
    const result = await headerSearch(nextPage, user.id, keyword);

    if (result.data.length > 0) {
      // 새로운 페이지에 게시물이 있을 경우
      setPosts([...posts, ...result.data]);
      setPage(nextPage);
    } else {
      // 마지막 페이지인 경우, 모든 게시물을 가져옴
      setPosts([...posts, ...result.data]);
    }
  };

  useEffect(() => {
    headerSearchAPI();
  }, [keyword]);

  return (
    <StyledSearch>
      <div className="main">
        <div className="post_list">
          {posts.map((post) => (
            <Post key={post.postSEQ} postSEQ={post.postSEQ} />
          ))}
        </div>
        <button className="more_post" onClick={loadMorePosts}>
          더보기
        </button>
      </div>
    </StyledSearch>
  );
};
export default Search;
