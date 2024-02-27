import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyPostsNotMatched } from "../api/post";
import styled from "styled-components";
import { formatDate24Hours } from "../utils/TimeFormat";

const StyledSidebar = styled.div`
  .side_menu {
    height: 100%;
    width: 240px;
    position: fixed;
    z-index: 9;
    background-color: white;
    border-right: 1px solid #cccccc;
    display: flex;
    max-height: -webkit-fill-available;
    flex-direction: column;
    padding-left: 15px;
    overflow-y: hidden;
  }
  .side_menu:hover {
    overflow-y: auto;
  }

  .side_menu::-webkit-scrollbar {
    width: 7px;
  }

  .side_menu::-webkit-scrollbar-thumb {
    outline: none;
    border-radius: 10px;
    background-color: rgb(214, 214, 214);
  }

  .mypost {
    margin-top: 30px;
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: rgb(49, 49, 49);
  }
  .post_item {
    width: 200px;
    height: 50px;
    margin-bottom: 15px;
    background-color: white;
    border-bottom: 0.5px solid rgb(224, 224, 224);
    padding-bottom: 15px;
    color: rgb(49, 49, 49);
    cursor: pointer;
    transition: color 0.2s ease;
    position: relative;
  }

  .post_item:hover {
    color: #ff7f38;
  }

  .post_title {
    font-weight: bold;
  }

  .post_date {
    font-size: 0.8rem;
    color: gray;
    display: flex;
    justify-content: end;
    position: absolute;
    bottom: 2px;
    right: 2px;
  }
  .apply_button {
    color: white;
    background-color: #ff7f38;
    padding: 8px;
    border: none;
    border-radius: 10px;
  }
  .please_login {
    height: 100%;
    margin: 10px;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    align-self: start;
    justify-content: end;
    p {
      color: rgb(49, 49, 49);
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
  .sidebar_user {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
  }

  .login {
    font-size: 1.5rem;
    color: white;
    background-color: #ff7f38;
    padding-left: 60px;
    padding-right: 60px;
    padding-top: 15px;
    padding-bottom: 15px;
    border-radius: 15px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .join {
    align-self: end;
    color: gray;
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const myPost = useSelector((state) => state.myPost);

  if (location.pathname === "/Login" || location.pathname === "/signup") {
    return null; // 로그인, 회원가입 페이지일때 헤더 숨김
  }

  return (
    <StyledSidebar>
      <div className="side_menu">
        {Object.keys(user).length === 0 && (
          <>
            <div className="please_login">
              <p>같이 놀 사람을 구하고 싶다면!</p>
              <div className="sidebar_user">
                <Link to="/Login" className="login">
                  로그인
                </Link>
                <Link to="/signup" className="join">
                  회원가입
                </Link>
              </div>
            </div>
          </>
        )}
        {Object.keys(user).length !== 0 && (
          <>
            <div className="mypost">나의 모집글</div>
            {myPost.map((post) => (
              <div
                key={post.postSEQ}
                className="post_item"
                onClick={() => navigate(`/apply/${post.postSEQ}`)}
              >
                <div className="post_title">{post.postTitle}</div>
                <div className="post_date">
                  {formatDate24Hours(post.postDate)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </StyledSidebar>
  );
};
export default Sidebar;
