import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getCategoryTypes } from "../api/categoryType";
import { getCategories } from "../api/category";
import { getPlace, getPlaceType } from "../api/post";
import { getUserCategory } from "../api/category";
import { getBlockUser } from "../api/blockuser";
import {
  getMatchCategoryInfo,
  getPosts,
  getPostsByCategoryType,
} from "../api/post";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import styled from "styled-components";
import Post from "./Post";

const StyledMatchingBoardComponent = styled.div`
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

  .select-bar {
    display: flex;
    border-radius: 4px;
    width: 100%;
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
    transition: color 0.2s ease;
  }

  .select-bar a:hover {
    color: #ff7f38;
  }

  .search-box {
    width: 100%;
    display: flex;
    position: relative;
    background-color: #ffffff;
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
    font-size: 1rem;
    line-height: 14px;
    background: #ff7f38;
    color: #ffffff;
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

const MatchingBoardComponent = () => {
  const [posts, setPosts] = useState([]);
  const [userCategory, setUserCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryType, setCategoryType] = useState([]);
  const [selectedCatSEQ, setSelectedCatSEQ] = useState(null);
  const [matchCate, setMatchCate] = useState([]);
  const [page, setPage] = useState(1); // 페이지 번호 추가
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
    const filteredPosts = posts.filter((post) => {
      const matchingCategory = matchCate.find(
        (match) => match.post.postSEQ === post.postSEQ
      );

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
    await setPosts(result.data);
    console.log(posts);
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

  // 매칭 카테고리 인포 불러오는 API
  const matchCategoryInfoAPI = async () => {
    const result = await getMatchCategoryInfo();
    setMatchCate(result.data);
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
  };
  return (
    <StyledMatchingBoardComponent>
      <div className="main">
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
            <button className="userCategory" onClick={viewCategory}>
              내 관심사만 보기
            </button>
          </div>
        </div>
        <div className="post_list">
          {posts.map((post) => (
            <Post key={post.postSEQ} postSEQ={post.postSEQ} />
          ))}
        </div>
        <button className="more_post" onClick={loadMorePosts}>
          더보기
        </button>
      </div>
    </StyledMatchingBoardComponent>
  );
};
export default MatchingBoardComponent;
