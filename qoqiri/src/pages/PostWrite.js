import React, { useState, useEffect, useRef } from "react";
import "../css/PostWrite.css";
import { navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { addAttachmentsAPI, addMatchingAPI, addPostAPI } from "../api/post";
import { getPlace, getPlaceType } from "../api/place";
import { getCategories } from "../api/category";
import { getCategoryTypes } from "../api/categoryType";

const PostWrite = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 이미지 미리보기용
  const [imagePreviews, setImagePreviews] = useState([]);
  // 서버로 보낼 이미지들의 객체 덩어리
  const [sendImgs, setSendImgs] = useState(null);

  const fileInputRef = useRef(null); // 미리보기

  const [place, setPlace] = useState([]);
  const [placeType, setPlaceType] = useState([]);

  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [selectedPlace, setSelectedPlace] = useState(); // 세부 지역
  const [selectedPlaceType, setSelectedPlaceType] = useState(null); // 큰 지역

  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(1);

  const [categories, setCategories] = useState([]); // 세부 카테고리 배열
  const [categoryTypes, setCategoryTypes] = useState([]); // 큰 카테고리 배열

  const [selectSEQ, setSelectSEQ] = useState([]); // 선택한 세부 카테고리
  const [selectlike, setSelectlike] = useState([]);

  const maxCharacterCount = 10000; // 게시판 글자 제한

  const navigate = useNavigate();

  const handlePlaceTypeChange = (event) => {
    // 지역 선택 핸들러

    const selectedType = event.target.value;
    setSelectedPlaceType(selectedType);

    const filtered = place.filter(
      (place) => place.placeType.placeTypeSEQ == selectedType
    );
    setFilteredPlaces(filtered);

    setSelectedPlace(null);
  };

  const handlePlaceChange = (event) => {
    // 세부 지역 선택 핸들러
    const selectedPlace = event.target.value;
    setSelectedPlace(selectedPlace);
  };

  // 제목 입력 핸들러
  const onChangeTitle = (e) => {
    const currentTitle = e.target.value;
    setTitle(currentTitle);
  };
  // 내용 입력 핸들러
  const handleEditorChange = (event) => {
    const newContent = event.target.value;
    setContent(newContent);
  };

  const maxFileCount = 3;
  // 첨부파일 핸들러
  const handleUploadImage = (e) => {
    e.preventDefault();
    e.persist();

    // files 는 객체로 들고옴
    const files = e.target.files;

    if (files.length === 0) {
      // 파일이 선택되지 않았을 때 아무 동작도 하지 않음
      return;
    }

    const maxFileSize = 10 * 1024 * 1024; // 사진 용량 제한 10mb
    const filesList = [...files];
    const imgList = [];

    for (let i = 0; i < files.length; i++) {
      // 사진 3장까지만 제한
      const image = URL.createObjectURL(files[i]);

      if (filesList[i].size <= maxFileSize) {
        if (filesList.length <= maxFileCount) {
          imgList.push(image);
        } else {
          alert("사진은 3장까지만 업로드 할 수 있습니다.");
          break;
        }
      } else {
        alert("사진 용량이 10MB를 초과합니다.");
      }
    }
    setImagePreviews(imgList);
    setSendImgs(filesList);
  };

  const handlerDeleteImage = (e, img) => {
    const newImgUrl = imagePreviews.filter((image) => image != img);
    setImagePreviews(newImgUrl);
    URL.revokeObjectURL(img);
    setSendImgs(sendImgs.filter((file, index) => e.target.name != index));
  };

  // 카테고리 선택 핸들러
  const handleInterestClick = (categorySEQ, TypeSEQ) => {
    setSelectlike([]);
    setSelectSEQ([]);

    if (selectlike.includes(categorySEQ)) {
      setSelectlike(selectlike.filter((item) => item !== categorySEQ)); // selectLike(선택할 주제들) 배열
      setSelectSEQ(selectSEQ.filter((item) => item !== TypeSEQ)); //
    } else {
      setSelectlike([...selectlike, categorySEQ]); // selectLike(선택할 주제들)
      setSelectSEQ([...selectSEQ, TypeSEQ]);
    }
  };

  // 글 등록 시 상단에 선택할 수 있는 카테고리, 카테고리 타입
  useEffect(() => {
    const fetchCategoryTypes = async () => {
      const result = await getCategoryTypes();
      setCategoryTypes(result.data);
    };

    const fetchCategories = async () => {
      const result = await getCategories();

      setCategories(result.data);
    };

    fetchCategoryTypes();
    fetchCategories();
  }, []);

  // 카테고리랑 카테고리 타입이랑 한꺼번에 묶어서 아래
  const getCategoriesByType = (ctSEQ) => {
    return categories.filter(
      (category) =>
        category.categoryType && category.categoryType.ctSEQ === ctSEQ
    );
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

  // 지역, 세부지역, 게시판 API
  useEffect(() => {
    placeAPI();
    placeTypeAPI();
  }, []);

  const handleCancel = (e) => {
    alert("글쓰기를 취소했습니다");
    navigate("/");
  };

  // 서버에 전송
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault(); // 폼 기본 제출 방지
    }

    // 필수 입력 필드 확인
    if (
      !title ||
      !content ||
      !selectedPlaceType ||
      !selectedPlace ||
      !selectedBoard ||
      selectlike.length === 0
    ) {
      alert("제목, 내용, 카테고리 선택은 필수입니다.");
      return;
    }

    const PostDTO = {
      token: localStorage.getItem("token"),
      postTitle: title,
      postContent: content,
      placeSEQ: selectedPlace,
      placeTypeSEQ: selectedPlaceType,
      boardSEQ: selectedBoard,
    };

    let postResponse;

    try {
      // addPostAPI를 이용해 서버로 전달
      postResponse = await addPostAPI(PostDTO);
    } catch (error) {
      alert("글쓰기 중 오류가 발생했습니다.");
      return;
    }

    const MatchingDTO = {
      categoryList: selectlike,
      categoryTypeList: selectSEQ,
    };

    if (sendImgs) {
      if (sendImgs.length > 0) {
        const formData = new FormData();

        formData.append("postId", postResponse.data.postSEQ);

        sendImgs.forEach((image) => {
          formData.append("files", image);
        });

        // 첨부파일 API
        await addAttachmentsAPI(formData);
      }
    }

    const matchingResponse = await addMatchingAPI({
      postSEQ: postResponse.data.postSEQ,
      categories: MatchingDTO.categoryList.map((categorySEQ) => ({
        categorySEQ,
      })),
    });

    if (postResponse.data) {
      alert("글쓰기 성공");
      navigate("/");
    } else {
      alert("글쓰기 실패");
    }
  };

  return (
    <>
      <div id="form-container">
        <div id="form">
          <div id="interest-section">
            <div className="form-el">
              <br />
              <div className="set-categoryLike-box">
                {categoryTypes.map((categoryType) => (
                  <div key={categoryType.ctSEQ}>
                    <h3>{categoryType.ctName}</h3>
                    <div className="set-box-options">
                      {/* 여기서 한번에 묶은 카테고리 카테고리 타입을 맵으로 보여줌 */}
                      {getCategoriesByType(categoryType.ctSEQ).map(
                        (category) => (
                          <div
                            key={category.categorySEQ}
                            className={`set-categoryLike-box-item ${
                              selectlike.includes(category.categorySEQ)
                                ? "selected"
                                : ""
                              // 선택한 카테고리 배경색 나오게함
                            }`}
                            onClick={() =>
                              handleInterestClick(
                                category.categorySEQ,
                                category.categoryType.ctSEQ
                              )
                            }
                          >
                            {category.categoryName}
                            {/*페이지에서 직접 보이는 카테고리 이름*/}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="select-place">
              <div>지역 선택</div>
              <select
                onChange={handlePlaceTypeChange}
                style={{
                  background: "antiquewhite",
                  color: "#ff9615",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  border: "none",
                }}
              >
                <option value="">지역을 선택해주세요</option>
                {placeType.map((type) => (
                  <option key={type.placeTypeSEQ} value={type.placeTypeSEQ}>
                    {type.placeTypeName}
                  </option>
                ))}
              </select>
              {selectedPlaceType && (
                <div className="select-place">
                  <h2>상세 지역</h2>
                  <select
                    onChange={handlePlaceChange}
                    style={{
                      background: "antiquewhite",
                      color: "#ff9615",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      border: "none",
                    }}
                  >
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
            {selectedPlace && <div></div>}
          </div>

          <div id="postTitle">
            <input
              type="text"
              className="title"
              id="title"
              value={title}
              onChange={onChangeTitle}
              placeholder="제목"
              maxLength="100"
            />
          </div>

          <div id="file-upload">
            <label htmlFor="image-upload">
              <input
                type="file"
                id="image-upload"
                className="image-upload"
                accept="image/*"
                onChange={(e) => handleUploadImage(e)}
                multiple
                ref={fileInputRef}
              />
              <span>사진첨부</span>
            </label>
            <div>
              <div className="board-image-main">
                <div className="board-image">
                  {imagePreviews.length > 0
                    ? imagePreviews.map((img, index) => (
                        <div key={index}>
                          <img
                            src={img}
                            alt={`사진 미리보기 ${index + 1}`}
                            style={{ width: "150px", height: "150px" }}
                            className="post_img_preview"
                          />

                          <button
                            id="remove-image"
                            name={index}
                            onClick={(e) => handlerDeleteImage(e, img)}
                          >
                            삭제
                          </button>
                        </div>
                      ))
                    : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="textareaContainer">
            <textarea
              className="post-content"
              id="editor"
              maxLength={maxCharacterCount}
              onChange={handleEditorChange}
              value={content}
            ></textarea>
            <div className="wordCount">
              내용: {content.length} / {maxCharacterCount}
            </div>
          </div>

          <div className="submitButton">
            <button type="submit" onClick={() => handleSubmit()}>
              등록
            </button>
            <button onClick={() => handleCancel()}>취소 </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default PostWrite;
