import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getCategoryTypes } from "../api/categoryType";
import { getPlace, getPlaceType } from "../api/place";
import { getPosts } from "../api/post";
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

  .select_bar {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    padding: 10px 10px;
    margin-bottom: 12px;
    background-color: #ffffff;
  }

  .category_name {
    padding: 5px 10px;
    border-radius: 4px;
    margin: 5px;
    color: #4d391c;
    border-style: none;
    font-weight: 700;
    transition: color 0.2s ease;
    cursor: pointer;
  }

  .category_name:hover {
    color: #ff7f38;
  }

  .search-box {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 0px 10px;
    margin-bottom: 12px;
  }

  .select_place {
    display: flex;
  }

  .place-box {
    display: flex;
  }

  .place-box select {
    height: 40px;
    width: 200px;
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

  .search_btn {
    margin-left: 15px;
    padding: 12px 10px;
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
  const [categoryType, setCategoryType] = useState([]);
  const [page, setPage] = useState(1); // 페이지 번호 추가
  const [place, setPlace] = useState([]);
  const [placeType, setPlaceType] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPlaceType, setSelectedPlaceType] = useState(null);
  const [onMyCateogry, setOnMyCategory] = useState(0);
  const { id } = useParams();
  const user = useSelector((state) => state.user);

  const getPostsAPI = async (
    page,
    userId,
    categoryTypeSEQ,
    placeSEQ,
    placeTypeSEQ,
    onMyCateogry
  ) => {
    const result = await getPosts(
      page,
      userId,
      categoryTypeSEQ,
      placeSEQ,
      placeTypeSEQ,
      onMyCateogry
    );
    await setPosts(result.data);
  };

  // 카테고리 타입 불러오는 API
  const categoryTypeAPI = async () => {
    const result = await getCategoryTypes();
    setCategoryType(result.data);
  };

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
  };

  const handlePlaceChange = (event) => {
    const selectedPlace = event.target.value;
    setSelectedPlace(selectedPlace);
  };

  // 내 관심사만 보기
  const myCategoryView = async () => {
    await setPage(1);
    await setOnMyCategory(1);
    await getPostsAPI(null, user.id, id, selectedPlace, selectedPlaceType, 1);
  };

  // 모든 카테고리 보기
  const allCategoryView = async () => {
    await setPage(1);
    await setOnMyCategory(0);
    await getPostsAPI(null, user.id, null, selectedPlace, selectedPlaceType, 0);
  };

  // 모든 지역 보기
  const allPlaceView = async () => {
    await setPage(1);
    await setSelectedPlace(null);
    await setSelectedPlaceType(null);
    await getPostsAPI(null, user.id, id, null, null, onMyCateogry);
  };

  // 선택한 지역만 보기
  const viewSelectedPlace = async () => {
    await setPage(1);
    await getPostsAPI(
      null,
      user.id,
      id,
      selectedPlace,
      selectedPlaceType,
      onMyCateogry
    );
  };

  // 더보기 버튼
  const loadMorePosts = async () => {
    const nextPage = page + 1;
    const result = await getPosts(
      nextPage,
      user.id,
      id,
      selectedPlace,
      selectedPlaceType,
      onMyCateogry
    );

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
    placeAPI();
    placeTypeAPI();
    categoryTypeAPI();
    // 카테고리별 보기
    getPostsAPI(null, user.id, id, selectedPlace, selectedPlaceType, 0);
  }, [id]);

  return (
    <StyledMatchingBoardComponent>
      <div className="main">
        <div className="select_bar">
          <div className="category_list">
            {categoryType.map((cat) => (
              <Link
                to={`/matchingBoard/${cat?.ctSEQ}`}
                className="category_name"
                key={cat?.ctSEQ}
              >
                {cat?.ctName}
              </Link>
            ))}
          </div>
          <div>
            <button className="search_btn" onClick={myCategoryView}>
              내 관심사만 보기
            </button>
            <button className="search_btn" onClick={allCategoryView}>
              모든 카테고리 보기
            </button>
          </div>
        </div>
        <div className="search-box">
          <div className="select_place">
            <div className="place-box">
              <h1>지역 선택</h1>
              <select
                onChange={handlePlaceTypeChange}
                onClick={handlePlaceTypeChange}
              >
                <option value="">지역을 선택해주세요</option>
                {placeType.map((type) => (
                  <option key={type.placeTypeSEQ} value={type.placeTypeSEQ}>
                    {type.placeTypeName}
                  </option>
                ))}
              </select>
            </div>
            <div className="place-box">
              <h1>상세 지역</h1>
              <select onChange={handlePlaceChange} onClick={handlePlaceChange}>
                <option value="">상세 지역을 선택해주세요</option>
                {filteredPlaces.map((place) => (
                  <option key={place.placeSEQ} value={place.placeSEQ}>
                    {place.placeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button className="search_btn" onClick={viewSelectedPlace}>
              선택한 지역만 보기
            </button>
            <button className="search_btn" onClick={allPlaceView}>
              모든 지역 보기
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
