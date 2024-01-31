import { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import defaultimg from "../assets/defaultimg.png";
import { formatDate24Hours } from "../utils/TimeFormat";
import DetailView from "./DetailView";
import {
  getAttachments,
  getCommentCount,
  getMatchCate,
  getPost,
} from "../api/post";

const StyledPost = styled.div`
  width: 370px;
  height: 210px;
  background-color: white;
  margin: 10px;
  border: 1px solid #efefef;
  border-radius: 15px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);

  .post_body {
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    border-radius: 15px;
    transition: background-color 0.2s ease;
    cursor: pointer;
  }

  .post_body:hover {
    background-color: #eeeeee;
  }

  .post_top {
    width: 100%;
    height: 45px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    position: relative;
  }

  .post_profile {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 15px;
    img {
      border-radius: 100px;
    }

    .post_nickname {
      font-size: 1rem;
      font-weight: bold;
      color: rgb(49, 49, 49);
      margin-top: auto;
      margin-bottom: auto;
    }
  }

  .post_date {
    position: absolute;
    font-size: 0.7rem;
    top: 0;
    right: 0;
    color: gray;
  }

  .post_title {
    width: 100%;
    height: 20px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 1.3rem;
    font-weight: bold;
    color: rgb(49, 49, 49);
    margin-bottom: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .post_image_comment {
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;

    .post_image_list {
      width: 310px;
      height: 100%;
      display: flex;
      flex-direction: row;
      gap: 3px;

      img {
        width: 30%;
        height: 100%;
        border-radius: 10px;
        object-fit: cover;
      }
    }

    .post_comment_count {
      display: flex;
      gap: 5px;
      color: rgb(49, 49, 49);
      margin-top: auto;
      .count {
        font-weight: bold;
      }
    }
  }

  .category_list {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: auto;
    overflow: hidden;
    white-space: nowrap;
  }

  .post_category {
    font-size: 0.8rem;
    color: white;
    padding: 4px;
    border-radius: 10px;
    background-color: #ff7f38;
  }
`;

const Post = ({ postSEQ }) => {
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [post, setPost] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [commentCount, setCommentsCount] = useState(0);

  const getPostAPI = async () => {
    const result = await getPost(postSEQ);
    setPost(result.data);
  };

  const getAttachmentsAPI = async () => {
    const result = await getAttachments(postSEQ);
    setAttachmentList(result.data);
  };

  const getMatchingCategoryInfoAPI = async () => {
    const result = await getMatchCate(postSEQ);
    setCategoryList(result.data);
  };

  const commentCountAPI = async () => {
    const result = await getCommentCount(postSEQ);
    setCommentsCount(result.data);
  };

  // 게시글 상세보기 모달 열기 함수
  const handleOpenDetailView = () => {
    setIsDetailViewOpen(true);
  };

  // 게시글 상세보기 모달 닫기 함수
  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
  };

  useEffect(() => {
    getPostAPI();
    getAttachmentsAPI();
    getMatchingCategoryInfoAPI();
    commentCountAPI();
  }, [postSEQ]);

  return (
    <StyledPost>
      <div className="post_body" onClick={handleOpenDetailView}>
        <div className="post_top">
          <div className="post_profile">
            <img
              src={
                post?.userInfo?.profileImg
                  ? `/uploadprofile/${post?.userInfo?.profileImg}`
                  : defaultimg
              }
            />
            <div className="post_nickname">{post?.userInfo?.userNickname}</div>
          </div>
          <div className="post_date">
            {post?.place?.placeType?.placeTypeName} {post?.place?.placeName} ·{" "}
            {formatDate24Hours(post?.postDate)}
          </div>
        </div>
        <div className="post_title">{post?.postTitle}</div>
        <div className="post_image_comment">
          <div className="post_image_list">
            {attachmentList.map((attachment) => (
              <img
                key={attachment.postAttachmentSEQ}
                src={`/upload/${attachment?.attachmentURL}`}
              />
            ))}
          </div>
          <div className="post_comment_count">
            <FontAwesomeIcon icon={faMessage} />
            {commentCount > 0 && <div className="count">{commentCount}</div>}
          </div>
        </div>
        <div className="category_list">
          {categoryList.map((category) => (
            <div className="post_category" key={category.matchingCategorySEQ}>
              {category.category.categoryName}
            </div>
          ))}
        </div>
      </div>
      {isDetailViewOpen && (
        <DetailView
          selectedPostSEQ={postSEQ}
          handleCloseDetailView={handleCloseDetailView}
        />
      )}
    </StyledPost>
  );
};

export default Post;
