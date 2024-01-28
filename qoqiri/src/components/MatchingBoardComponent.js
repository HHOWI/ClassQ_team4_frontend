import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import DetailView from "./DetailView";
import { getCategoryTypes } from "../api/categoryType";
import { getCategories } from "../api/category";
import { getAttachmentsAll } from "../api/post";
import { getCommentCount, getPlace, getPlaceType } from "../api/post";
import { getUserCategory } from "../api/category";
import { getBlockUser } from "../api/blockuser";
import {
  getMatchCategoryInfo,
  getPosts,
  getPostsByCategoryType,
} from "../api/post";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import defaultimg from "../assets/defaultimg.png";
import { formatDate24Hours } from "../utils/TimeFormat";
import styled from "styled-components";

const StyledMatchingBoardComponent = styled.div`
  .Matching-modal::-webkit-scrollbar-button:horizontal:single-button:start {
    position: absolute;
    content: "";
    border-bottom: 20px solid transparent;
    border-right: 42px solid rgba(0, 0, 0, 0);
    border-left: 20px solid transparent;
    border-top: 20px solid transparent;
  }

  .Matching-modal::-webkit-scrollbar-button:vertical:single-button:start {
    position: absolute;
    content: "";
    border-right: 20px solid transparent;
    border-bottom: 62px solid rgba(0, 0, 0, 0);
    border-left: 20px solid transparent;
    border-top: 20px solid transparent;
  }

  .Matching-modal::-webkit-scrollbar-button:horizontal:single-button:end {
    position: absolute;
    overflow: hidden;
    content: "";
    border-bottom: 20px solid transparent;
    border-left: 42px solid rgba(0, 0, 0, 0);
    border-right: 20px solid transparent;
    border-top: 20px solid transparent;
  }

  .Matching-modal::-webkit-scrollbar-button:vertical:single-button:end {
    position: absolute;
    overflow: hidden;
    content: "";
    border-bottom: 20px solid transparent;
    border-top: 62px solid rgba(0, 0, 0, 0);
    border-right: 20px solid transparent;
    border-left: 20px solid transparent;
  }

  .Matching-modal::-webkit-scrollbar {
    display: none;
  }

  .real-main {
    width: 100%;
    min-width: 1450px;
    padding-left: 240px;
    padding-bottom: 250px;
    background-color: #ff7f38;
  }
  .main {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 1200px;
    height: 100%;
    margin: 0px auto;
    padding-top: 40px;
  }

  .select-bar {
    border: 1px solid #ff7f38;
    display: flex;
    border-radius: 4px;
    width: 1200px;
    padding: 0px 10px;
    margin-bottom: 12px;
    background-color: #ffffff;
  }

  .select-bar a {
    padding: 5px 10px;
    border-radius: 4px;
    line-height: 56px;
    margin: 5px;
    color: #4d391c;
    border-style: none;
    font-weight: 700;
  }

  .select-bar a:hover {
    color: #ff7f38;
  }

  .search-box {
    display: flex;
    position: relative;
    background-color: #ffffff;
    width: 1197px;
    padding: 5px 25px;
    border-radius: 4px;
    margin-bottom: 12px;
  }

  .place-box {
    display: flex;
    margin-right: auto;
  }

  .place-box select {
    height: 40px;
    width: 140px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 4px;
  }

  .place-box h1 {
    display: flex;
    align-items: center;
    color: #4d391c;
    font-weight: bold;
  }

  .userCategory {
    display: flex;
    align-items: center;
  }

  .userCategory button {
    padding: 8px 15px;
    border-radius: 4px;
    border-style: none;
    font-weight: 800;
    font-size: 10px;
    line-height: 14px;
    background: #ff7f38;
    color: #ffffff;
  }

  .section {
    display: flex;
    flex-wrap: wrap;
    margin: -5px -5px 5px;
    margin-bottom: 20px;
  }

  .section .noContent {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: xx-large;
    margin-top: 10px;
  }

  .board {
    background-color: #ffffff;
    display: flex;
    position: relative;
    flex-direction: column;
    border: 1px solid #ff7f38;
    border-radius: 4px;
    width: 393px;
    min-height: 270px;
    padding: 20px;
    margin: 5px;
  }

  .board-header {
    display: flex;
  }

  .board-header-time {
    font-size: 7px;
    font-weight: 660;
    color: #ff7f38;
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .profile {
    position: relative;
    width: 44px;
    height: 44px;
    margin-right: 8px;
  }

  .profile img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }

  .titleNickname .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: #000000;
    font-weight: 800;
    font-size: 14px;
  }

  .nickname {
    font-size: 13px;
    font-weight: normal;
    color: #ff7f38;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    margin-top: 4px;
  }

  .board-image-main {
    float: right;
    min-height: 50px;
  }

  .board-image {
    display: flex;
    float: right;
  }

  .board-image img {
    height: 50px;
    width: 60px;
    margin-right: 5px;
  }

  .titleNickname {
    display: flex;
    flex-direction: column;
    margin-top: 4px;
  }

  .write-board {
    margin-top: 20px;
    line-height: 16px;
    word-break: break-all;
    height: 48px;
  }

  .write {
    font-size: 12px;
    font-weight: 800;
    color: #000000;
    line-height: 18px;
    max-height: 100px; /* 허용할 최대 높이 설정 */
    overflow: hidden; /* 내용이 넘칠 경우 숨김 처리 */
    text-overflow: ellipsis; /* 넘치는 텍스트를 ...으로 표시 */
  }

  .comment-count {
    display: flex;
    float: right;
    gap: 5px;
    justify-content: center;
    align-items: center;
  }

  .category {
    font-weight: 600;
    font-size: 13px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 28px;
  }

  .category span {
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 8px;
    line-height: 14px;
    background: #ff7f38;
    color: #ffffff;
  }

  .foot-place-detail {
    position: absolute;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    right: 20px;
    top: 210px;
    gap: 6px;
  }

  .foot-place-detail p {
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 8px;
    line-height: 14px;
    background: #ff7f38;
    color: #ffffff;
  }

  /* 모달 스타일 */

  .Matching-modal-main {
    z-index: 11;
  }

  .Matching-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .Matching-modal {
    background: #ffffff;
    width: 700px; /* 너비 조절 */
    height: 500px; /* 높이 조절 */
    /* padding: 10px; */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    overflow: auto;
    position: relative;
    border-radius: 4px;

    /* 화살표 스타일 */
    .arrow-button {
      position: absolute; /* 절대 위치 설정 */
      top: 50%; /* 세로 중앙 정렬 */
      transform: translateY(-50%); /* 세로 중앙 정렬을 위한 변형 */
      font-size: 60px; /* 화살표 크기 조절 */
      cursor: pointer; /* 커서 변경 */
      color: #bcbcbc; /* 화살표 색상 설정 (원하는 색상으로 변경) */
      z-index: 3;
    }

    .left-arrow {
      left: 10px; /* 왼쪽에 위치 */
    }

    .right-arrow {
      right: 10px; /* 오른쪽에 위치 */
    }

    /* 다른 스타일 속성들... */
  }

  .modal-image-body {
    /* 이미지 컨테이너 스타일 속성들... */
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .Matching-modal img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin: 0 auto;
  }

  .modal-bar {
    width: 100%;
    /* background-color: #ff7f38; */
    height: 20px;
  }

  .close-button {
    position: absolute;
    top: 10px; /* 수직 위치를 조정하려면 top 값을 조정하세요. */
    right: 10px; /* 수평 위치를 조정하려면 right 값을 조정하세요. */
    font-size: 20px;
    cursor: pointer;
    color: #ffffff; /* 선택 사항: 필요한대로 색상을 변경하세요. */
  }

  /* comment */

  .comment {
    display: flex;
  }

  .comment textarea {
    border-style: none;
    min-width: 750px;
    min-height: 10px;
    resize: none;
  }

  .comment button {
    border-style: none;
    cursor: pointer;
    min-height: 10px;
  }

  .comment-profile {
    margin-right: 10px;
  }

  .commentList {
    display: flex;
  }

  svg:not(:root).svg-inline--fa,
  svg:not(:host).svg-inline--fa {
    overflow: visible;
    box-sizing: content-box;
    color: #ff7f38;
  }

  .play {
    background: #ff7f38;
    border-style: none;
    color: white;
    border-radius: 5px;
    padding: 5px 10px;
    height: 40px;
    font-size: 1.5rem;
    font-weight: bold;
  }

  #editPost {
    background-color: #ff7f38;
    color: white;
    padding-top: 5px;
    padding-right: 5px;
    padding-left: 5px;
    margin-bottom: 15px;
    border-radius: 5px;
  }

  #deletePost {
    background: #ff7f38;
    border-style: none;
    color: white;
    border-radius: 5px;
    font-size: 0.9rem;
    margin-bottom: 15px;
    font: inherit;
  }
`;

const MatchingBoardComponent = () => {
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPostSEQ, setSelectedPostSEQ] = useState(0);
  const [userCategory, setUserCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryType, setCategoryType] = useState([]);
  const [selectedCatSEQ, setSelectedCatSEQ] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [commentCount, setCommentsCount] = useState(0);
  const [matchCate, setMatchCate] = useState([]);
  const [page, setPage] = useState(1); // 페이지 번호 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const { id } = useParams();
  const [place, setPlace] = useState([]);
  const [placeType, setPlaceType] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState();
  const [selectedPlaceType, setSelectedPlaceType] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const user = useSelector((state) => state.user);
  const [blockUser, setBlockUser] = useState([]);
  const [blockUserFetched, setBlockUserFetched] = useState(false); // 계속 가져와서 한번만 가져오도록 조건 걸음

  const viewCategory = () => {
    // Filter posts based on user and matching categories
    const filteredPosts = posts.filter((post) => {
      // Check if there is a matching category for the post
      const matchingCategory = matchCate.find(
        (match) => match.post.postSEQ === post.postSEQ
      );

      // Check if the matching category belongs to the user's categories
      return (
        matchingCategory &&
        userCategory.some(
          (userCat) =>
            userCat.category.categorySEQ ===
            matchingCategory.category.categorySEQ
        )
      );
    });

    setFilteredPosts(filteredPosts);
  };

  const blockUserAPI = async () => {
    try {
      if (!blockUserFetched) {
        const result = await getBlockUser(user.id);
        setBlockUser(result.data);
        setBlockUserFetched(true);
      }
    } catch (error) {
      // 에러 처리
    }
  };

  const blockUserPost = () => {
    // blockUser가 배열인 것으로 가정하며, 차단된 사용자가 있는지 확인합니다.
    if (blockUser.length > 0) {
      const filteredBlock = posts.filter(
        (post) =>
          !blockUser.some(
            (blockedUser) =>
              post.userInfo.userId === blockedUser.blockInfo.userId &&
              blockedUser.unblock !== "N"
          )
      );
      setPosts(filteredBlock);
    }
  };

  useEffect(() => {
    blockUserAPI();
    blockUserPost();
  }, [user, blockUserFetched]);

  const searchList = useSelector((state) => {
    return state.post;
  });

  useEffect(() => {
    setPosts(searchList);
  }, [searchList]);

  // 카테고리 타입 SEQ받아서 해당하는 POST가져오기
  const PostsByCategoryTypeAPI = async () => {
    const result = await getPostsByCategoryType(id);
    setPosts(result.data);
  };

  const getUserCategoryAPI = async () => {
    const result = await getUserCategory(user.id);
    setUserCategory(result.data);
  };

  const getPostsAPI = async () => {
    const result = await getPosts();
    setPosts(result.data);
  };

  // 카테고리 불러오는 API
  const categoryAPI = async () => {
    const result = await getCategories();
    setCategory(result.data);
  };

  // 카테고리 타입 불러오는 API
  const categoryTypeAPI = async () => {
    const result = await getCategoryTypes();
    setCategoryType(result.data);
  };

  // 첨부한 첨부파일 불러오는 API
  const attachmentsAPI = async () => {
    const result = await getAttachmentsAll();
    setAttachments(result.data);
  };

  // 매칭 카테고리 인포 불러오는 API
  const matchCategoryInfoAPI = async () => {
    const result = await getMatchCategoryInfo();
    setMatchCate(result.data);
  };

  const commentCountAPI = async () => {
    const counts = [];
    for (const post of posts) {
      const result = await getCommentCount(post.postSEQ);
      counts.push(result.data);
    }

    setCommentsCount(counts);
  };

  // 지역으로 게시물 검색하기

  // place 리스트 불러오기
  const placeAPI = async () => {
    const result = await getPlace();
    setPlace(result.data);
  };

  // placeType 리스트 불러오기
  const placeTypeAPI = async () => {
    const result = await getPlaceType();
    setPlaceType(result.data);
  };

  const handlePlaceTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedPlaceType(selectedType);

    // 선택한 장소 유형에 따라 장소 필터링
    const filtered = place.filter(
      (place) => place.placeType.placeTypeSEQ == selectedType
    );
    setFilteredPlaces(filtered);

    // 장소 유형이 변경될 때 선택한 장소를 재설정합니다.
    setSelectedPlace(null);

    // 선택한 장소 유형 및 장소에 따라 게시물 필터링
    filterPosts(selectedType, null);
  };

  const handlePlaceChange = (event) => {
    const selectedPlace = event.target.value;
    setSelectedPlace(selectedPlace);

    // 선택한 장소 유형 및 장소에 따라 게시물 필터링
    filterPosts(selectedPlaceType, selectedPlace);
  };

  const filterPosts = (placeType, place) => {
    // 장소 유형과 장소가 모두 선택된 경우, 해당하는 게시물을 필터링합니다.
    if (placeType && place) {
      const filtered = posts.filter(
        (post) =>
          post.place?.placeType?.placeTypeSEQ == placeType &&
          post.place?.placeSEQ == place
      );
      setFilteredPosts(filtered);
    } else {
      // 장소 유형이나 장소 중 하나가 선택되지 않은 경우 모든 게시물을 표시합니다.
      setFilteredPosts(posts);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // 선택한 장소 및 장소 유형에 따라 게시물을 가져옵니다.
    filterPosts(selectedPlaceType, selectedPlace);
  }, [selectedPlaceType, selectedPlace, posts]);

  useEffect(() => {
    placeAPI();
    placeTypeAPI();
  }, []);

  useEffect(() => {
    getUserCategoryAPI();
  }, [user]); // 'user'가 변경될 때만 효과를 발생시키도록 함

  useEffect(() => {
    matchCategoryInfoAPI();
    attachmentsAPI(selectedPostSEQ);
  }, [posts]);

  useEffect(() => {
    if (posts.length > 0) {
      commentCountAPI();
    }
  }, [posts]);

  useEffect(() => {
    if (id == null) {
      getPostsAPI(); // id가 없을 때는 postsAPI 실행
    } else {
      PostsByCategoryTypeAPI(); // id가 있을 때는 PostsByCategoryTypeAPI 실행
    }
  }, [id]);

  // 카테고리, 카테고리 타입 PostSEQ로 불러오는 useEffect
  useEffect(() => {
    categoryTypeAPI();
    categoryAPI();
  }, [selectedCatSEQ]);

  const loadMorePosts = async () => {
    setLoading(true);

    const nextPage = page + 1;
    const result = await getPosts(nextPage);

    if (result.data.length > 0) {
      // 새로운 페이지에 게시물이 있을 경우
      setPosts([...posts, ...result.data]);
      setPage(nextPage);
    } else {
      // 마지막 페이지인 경우, 모든 게시물을 가져옴
      setPosts([...posts, ...result.data]);
    }

    setLoading(false);
  };
  return (
    <StyledMatchingBoardComponent>
      <div className="real-main">
        <main className="main">
          <div className="select-bar">
            <div className="active-button">
              <Link to="/matchingBoard" className="active">
                전체보기
              </Link>
              {categoryType.map((cat) => (
                <Link
                  to={`/matchingBoard/${cat?.ctSEQ}`}
                  className="active"
                  key={cat?.ctSEQ}
                >
                  {cat?.ctName}
                </Link>
              ))}
            </div>
          </div>
          <div className="search-box">
            <div className="place-box">
              <h1>지역 선택</h1>
              <select onChange={handlePlaceTypeChange}>
                <option value="">지역을 선택해주세요</option>
                {placeType.map((type) => (
                  <option key={type.placeTypeSEQ} value={type.placeTypeSEQ}>
                    {type.placeTypeName}
                  </option>
                ))}
              </select>
              {selectedPlaceType && (
                <div className="place-box">
                  <h1>상세 지역</h1>
                  <select onChange={handlePlaceChange}>
                    <option value="">상세 지역을 선택해주세요</option>
                    {filteredPlaces.map((place) => (
                      <option key={place.placeSEQ} value={place.placeSEQ}>
                        {place.placeName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="userCategory">
              <button onClick={viewCategory}>내 관심사만 보기</button>
            </div>
          </div>
          <section className="section">
            {filteredPosts.length === 0 ? (
              <p className="noContent">검색 결과가 없습니다.</p>
            ) : (
              filteredPosts?.map((po, index) => (
                <div
                  onClick={() => {
                    setSelectedPostSEQ(po?.postSEQ);
                    setIsOpen(!isOpen);
                  }}
                  className="board"
                  key={po?.postSEQ}
                >
                  <div className="board-header-time">
                    {formatDate24Hours(po?.postDate)}
                  </div>
                  <div className="board-header">
                    <div className="profile">
                      <img
                        src={
                          po?.userInfo?.profileImg
                            ? `/uploadprofile/${po?.userInfo?.profileImg}`
                            : defaultimg
                        }
                      />
                    </div>
                    <div className="titleNickname">
                      <div className="title">{po?.postTitle}</div>
                      <span className="nickname">
                        {po?.userInfo?.userNickname}
                      </span>
                    </div>
                  </div>
                  <div className="board-image-main">
                    {attachments
                      ?.filter(
                        (attachment) => attachment.post?.postSEQ === po.postSEQ
                      )
                      ?.map((filterattachment, index) => (
                        <div className="board-image" key={index}>
                          <img
                            src={`/upload/${filterattachment?.attachmentURL}`}
                          />
                        </div>
                      ))}
                  </div>
                  <div className="write-board">
                    <div className="write">
                      {po.postContent}
                      <a href="#" className="comment-count">
                        <FontAwesomeIcon icon={faMessage} />
                        <div className="count">{commentCount[index]}</div>
                      </a>
                    </div>
                  </div>
                  <div className="category">
                    {matchCate
                      .filter((match) => match?.post?.postSEQ === po?.postSEQ)
                      ?.map((filteredMatch, index) => (
                        <span key={index}>
                          {filteredMatch?.category?.categoryName}
                        </span>
                      ))}
                  </div>
                  <div className="foot-place-detail">
                    <p>{po?.place?.placeName}</p>
                    <p>{po?.place?.placeType?.placeTypeName}</p>
                  </div>
                </div>
              ))
            )}

            {loading && <p>Loading...</p>}

            {!loading && posts.length > 0 && (
              <button
                onClick={loadMorePosts}
                style={{
                  background: "antiquewhite",
                  color: "#ff9615",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  border: "none",
                  marginLeft: "10px",
                }}
              >
                더 보기
              </button>
            )}

            {isOpen && (
              <div className="Matching-modal-main">
                <div className="Matching-modal-overlay">
                  <div className="Matching-modal">
                    <div className="close-button" onClick={closeModal}>
                      &times;
                    </div>
                    <DetailView selectedPostSEQ={selectedPostSEQ} />
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </StyledMatchingBoardComponent>
  );
};
export default MatchingBoardComponent;
