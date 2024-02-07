import React, { useState, useEffect, useRef } from "react";
import "../css/PostEdit.css";
import {
    getPlace,
    getPlaceType,
    getPost,
    getMatchCate,
    getAttachments,
    editPostAPI,
    getSelectPlace,
    getSelectPlaceType,
    getSelectAttach,
    deleteMatchingAPI,
    addMatchingAPI,
    deleteAttachmentsAPI,
    addAttachmentsAPI,
    deleteFileAPI,
} from "../api/post";
import { getCategories } from "../api/category";
import { getCategoryTypes } from "../api/categoryType";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const PostEdit = () => {
    const { id } = useParams();
    const [postSEQ, SetPostSEQ] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 이미지 미리보기용
    const [imagePreviews, setImagePreviews] = useState([]);
    // 서버로 보낼 이미지들의 객체 덩어리
    const [selectAttach, setSelectAttach] = useState([]);

    // 사용자가 수정버튼을 눌러서 새롭게 이미지가 db에 올라가게 되면 기존 파일을 지우기 위해 임시로 들고 있을 변수
    const [temporaryData, setTemporaryData] = useState([]);

    const [selectedBoard, setSelectedBoard] = useState(1);
    const fileInputRef = useRef(null); // 미리보기

    const [place, setPlace] = useState([]);
    const [placeType, setPlaceType] = useState([]);

    const [filteredPlaces, setFilteredPlaces] = useState([]);

    const [selectedPlace, setSelectedPlace] = useState();
    const [selectedPlaceType, setSelectedPlaceType] = useState(null);

    const [selectedPlaceName, setSelectedPlaceName] = useState("");
    const [selectedPlaceTypeName, setSelectedPlaceTypeName] = useState("");

    const [categories, setCategories] = useState([]);
    const [categoryTypes, setCategoryTypes] = useState([]);

    const [editLike, setEditLike] = useState([]);
    const [editSeq, setEditSeq] = useState([]);

    const maxCharacterCount = 100000;

    // 게시물 불러오기
    const getPostAPI = async () => {
        const result = await getPost(id);
        console.log(result);

        const postData = result.data;
        SetPostSEQ(postData.postSEQ);

        setTitle(postData.postTitle);
        setContent(postData.postContent);

        // 선택한 상세 지역 정보 불러오기
        const selectedPlaceData = await getSelectPlace(postData.place.placeSEQ);
        setSelectedPlaceName(selectedPlaceData.data.placeName);

        // 선택한 지역 타입 정보 불러오기
        const selectedPlaceTypeData = await getSelectPlaceType(postData.place.placeType.placeTypeSEQ);
        setSelectedPlaceTypeName(selectedPlaceTypeData?.data?.placeTypeName);

        setSelectedPlace(postData?.place?.placeSEQ);
        setSelectedPlaceType(postData?.place?.placeType?.placeTypeSEQ);
    };

    const handlePlaceTypeChange = (event) => {
        const selectedType = event.target.value;
        setSelectedPlaceType(selectedType);

        const filtered = place.filter((place) => place.placeType.placeTypeSEQ == selectedType);
        setFilteredPlaces(filtered);

        setSelectedPlace(null);
    };

    const handlePlaceChange = (event) => {
        const selectedPlace = event.target.value;
        setSelectedPlace(selectedPlace);
    };

    // 선택한 category 리스트 불러오기
    const selectCategoryAPI = async () => {
        const selectedCategoriesData = await getMatchCate(id);
        console.log(selectedCategoriesData);

        const selectedCategorySEQs = selectedCategoriesData.data.map((item) => item.category.categorySEQ);
        setEditLike(selectedCategorySEQs);

        const selectedCategoryTypesData = await getCategoryTypes(selectedCategorySEQs);
        setCategoryTypes(selectedCategoryTypesData.data);
    };

    // 첨부한 첨부파일 불러오기
    const getSelectAttachAPI = async () => {
        const selectedAttachData = await getSelectAttach(id);

        setSelectAttach(selectedAttachData.data);
    };

    // 불러온 첨부파일 미리보기
    const selectAttachAPI = async () => {
        try {
            const result = await getAttachments(id);
            // console.log(result.data); // 전체 서버 응답 확인

            setImagePreviews(result.data);
        } catch (error) {
            console.error("Error fetching attachments:", error);
        }
    };

    useEffect(() => {
        getPostAPI();
        selectCategoryAPI();
        getSelectAttachAPI();
    }, [id]);

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

        if (selectAttach.length > 0 && temporaryData.length == 0) {
            console.log("인풋으로 사진 추가 하면서 기존 삭제해야 하는 배열은 비어있을때.");
            console.log(selectAttach);
            let tempArr = [];
            selectAttach.forEach((data) => {
                tempArr.push(data.attachmentURL);
            });

            if (selectAttach[0].attachmentURL) setTemporaryData([...tempArr]);
        }

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
        setSelectAttach(filesList);
    };

    const handlerDeleteImage = (e, img) => {
        const newImgUrl = imagePreviews.filter((image, index) => e.target.name != index);
        setImagePreviews(newImgUrl);

        setSelectAttach(selectAttach?.filter((file, index) => e.target.name != index));
        console.log(selectAttach);
        if (selectAttach[0].attachmentURL) {
            setTemporaryData([
                ...temporaryData,
                selectAttach?.filter((file, index) => e.target.name == index)[0].attachmentURL,
            ]);
        } else {
            console.log("attachmentURL 이 없다는 의미는 파일형식으로 받은 즉 input에서 새롭게 넣은 file형식임.");
        }
    };

    console.log(temporaryData);

    // 카테고리 선택, 제거 핸들러
    const handleInterestClick = (categorySEQ, TypeSEQ) => {
        setEditLike([...editLike, categorySEQ]);
        if (editLike.includes(categorySEQ)) {
            // 이미 선택된 카테고리인 경우 선택 해제
            setEditLike(editLike.filter((item) => item !== categorySEQ));
            setEditSeq(editSeq.filter((item) => item !== TypeSEQ));
        } else {
            // 선택되지 않은 카테고리인 경우 선택
            setEditLike([...editLike, categorySEQ]);
            setEditSeq([...editSeq, TypeSEQ]);
        }
    };

    // 글 수정 시 상단에 선택할 수 있는 카테고리, 카테고리 타입
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

        selectAttachAPI();
    }, []);

    // 카테고리랑 카테고리 타입이랑 한꺼번에 묶어서 아래
    const getCategoriesByType = (ctSEQ) => {
        return categories.filter((category) => category.categoryType && category.categoryType.ctSEQ === ctSEQ);
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

    useEffect(() => {
        placeAPI();
        placeTypeAPI();
    }, [id]);

    // 저장소에서 파일을 삭제하는 useEffect
    // useEffect(() => {
    //     if (selectAttach.length > 0 && temporaryData.length == 0) {
    //         let tempArr = [];
    //         selectAttach.forEach((data) => {
    //             tempArr.push(data.attachmentURL);
    //         });
    //         setTemporaryData([...tempArr]);
    //     }
    // }, [selectAttach]);

    const handleCancel = (e) => {
        navigate("/");
        alert("글쓰기를 취소했습니다");
    };

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault(); // 폼 기본 제출 방지
        }

        // 필수 입력 필드 확인
        if (!title || !content || !selectedPlaceType || !selectedPlace || !selectedBoard) {
            alert("제목, 내용, 카테고리 선택은 필수입니다.");
            return;
        }

        const PostDTO = {
            token: localStorage.getItem("token"),
            postSEQ: postSEQ,
            postTitle: title,
            postContent: content,
            placeSEQ: selectedPlace,
            placeTypeSEQ: selectedPlaceType,
            boardSEQ: selectedBoard,
        };

        let postResponse;

        try {
            postResponse = await editPostAPI(PostDTO);
            console.log(postResponse);
            console.log("config.data:", postResponse.config.data);

            //  기존의 매칭 카테고리 정보 삭제
            await deleteMatchingAPI(postSEQ);

            const MatchingDTO = {
                categoryList: editLike,
                categoryTypeList: editSeq,
            };

            console.log(selectAttach);
            if (selectAttach.length > 0 || temporaryData.length > 0) {
                console.log("프론트 폴더 내부 파일 삭제 기능 시작");
                console.log(temporaryData);
                if (temporaryData.length > 0) {
                    console.log("삭제할 파일 들어있는 배열 체킹 들어옴?");
                    const deleteFormData = new FormData();
                    temporaryData.forEach((data) => deleteFormData.append("files", data));
                    const isDelete = await deleteFileAPI(deleteFormData);

                    if (isDelete) {
                        setTemporaryData([]);
                        console.log("기존 파일 삭제 완료");
                    }
                }

                const formData = new FormData();
                formData.append("postId", postSEQ);

                selectAttach.forEach((image) => {
                    if (image.attachmentURL) {
                        // 기존 DB에 저장했던 URL 이 존재하는 객체 형식의 이미지 인 경우에....
                        console.log("객체 형식의 DB에서 받아온 이미지가 남아이씀...");
                        formData.append("urls", image.attachmentURL);
                    } else {
                        // 새롭게 싹 다 엎어 버리거나, input이라는 태그를 통해서 파일을 첨부해서 서버에서 처리 할 때
                        console.log("새롭게 파일 형식의 이미지를 첨부 해 놓은 상태임..");

                        formData.append("files", image);
                    }
                });
                // 첨부파일 API
                const isSucc = await addAttachmentsAPI(formData);

                console.log(isSucc);
            }

            // editMatchingAPI 호출
            const matchingResponse = await addMatchingAPI({
                postSEQ: postResponse.data.postSEQ,
                categories: MatchingDTO.categoryList.map((categorySEQ) => ({ categorySEQ })),
            });

            // console.log(matchingResponse);
            // console.log(matchingResponse.data);
            if (postResponse.data) {
                alert("수정 성공");
                navigate("/");
            } else {
                alert("수정 중 오류가 발생했습니다.");
                console.log("Error response:", postResponse);
            }
        } catch (error) {
            console.error("Error adding/editing post:", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <div id="form-container">
                <div id="form">
                    <div id="interest-section">
                        <div className="form-el">
                            <br />
                            <div className="edit-categoryLike-box">
                                {categoryTypes.map((categoryType) => (
                                    <div key={categoryType.ctSEQ}>
                                        <h3>{categoryType.ctName}</h3>
                                        <div className="edit-box-options">
                                            {getCategoriesByType(categoryType.ctSEQ).map((category) => (
                                                <div
                                                    key={category.categorySEQ}
                                                    className={`edit-categoryLike-box-item ${
                                                        editLike.includes(category.categorySEQ) ? "selected" : ""
                                                    }`}
                                                    onClick={() => handleInterestClick(category.categorySEQ)}
                                                >
                                                    {category.categoryName}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div id="postTitle">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={title}
                            onChange={onChangeTitle}
                            placeholder="제목"
                            maxLength="100"
                        />
                    </div>
                    <div className="select-place">
                        <h1>지역 선택</h1>
                        <select
                            onChange={handlePlaceTypeChange}
                            style={{
                                background: "antiquewhite",
                                color: "#ff9615",
                                fontWeight: "bold",
                                borderRadius: "5px",
                                border: "none",
                                marginLeft: "10px",
                            }}
                        >
                            <option className="place-option">{selectedPlaceTypeName}</option>
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
                                        marginLeft: "10px",
                                    }}
                                >
                                    <option className="place-option">{selectedPlaceName}</option>
                                    {filteredPlaces.map((place) => (
                                        <option key={place.placeSEQ} value={place.placeSEQ}>
                                            {place.placeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div id="file-update">
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
                    </div>
                    <div>
                        <div className="board-image-main">
                            <div className="board-image">
                                {imagePreviews.length > 0
                                    ? imagePreviews.map((img, index) => (
                                          <div key={index}>
                                              {img?.attachmentURL ? (
                                                  <>
                                                      <img
                                                          src={"/upload/" + img.attachmentURL}
                                                          alt={`서버기존데이터 ${index + 1}`}
                                                          style={{ width: "150px", height: "150px" }}
                                                      />
                                                      <button
                                                          id="remove-image"
                                                          name={index}
                                                          onClick={(e) => handlerDeleteImage(e, img)}
                                                      >
                                                          삭제
                                                      </button>
                                                  </>
                                              ) : (
                                                  <>
                                                      <img
                                                          src={img}
                                                          alt={`임시URL ${index + 1}`}
                                                          style={{ width: "150px", height: "150px" }}
                                                      />
                                                      <button
                                                          id="remove-image"
                                                          name={index}
                                                          onClick={(e) => handlerDeleteImage(e, img)}
                                                      >
                                                          삭제
                                                      </button>
                                                  </>
                                              )}
                                          </div>
                                      ))
                                    : ""}
                            </div>
                        </div>
                    </div>
                    <div className="post-content">
                        <div className="textareaContainer">
                            <textarea
                                name="post-content"
                                id="editor"
                                maxLength={maxCharacterCount}
                                onChange={handleEditorChange}
                                value={content}
                            ></textarea>
                            <div className="wordCount">
                                내용:
                                {content.length} / {maxCharacterCount}
                            </div>
                        </div>
                    </div>

                    <div className="updateButton">
                        <button type="submit" onClick={handleSubmit}>
                            수정
                        </button>
                    </div>
                    <div className="cancelButton">
                        <button onClick={handleCancel}>취소 </button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default PostEdit;
