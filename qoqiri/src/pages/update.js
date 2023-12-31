import React, { useState, useEffect } from 'react';
import '../css/PostWrite.css';
import axios from 'axios';
import { navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../api/user';
import { addPostAPI, addMatchingAPI, getBoards, getPlace, getPlaceType, addAttachmentsAPI } from '../api/post';
import { getCategories } from '../api/category';
import { getCategoryTypes } from '../api/categoryType';

const PostUpdate = () => {
    const [postSEQ, setPostSEQ] = useState();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [attachmentImg, setAttachmentImg] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // const [userInfo, setUserInfo] = useState([]);

    const [place, setPlace] = useState([]);
    const [placeType, setPlaceType] = useState([]);

    const [filteredPlaces, setFilteredPlaces] = useState([]);

    const [selectedPlace, setSelectedPlace] = useState();
    const [selectedPlaceType, setSelectedPlaceType] = useState(null);

    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(1);

    const [categories, setCategories] = useState([]);
    const [categoryTypes, setCategoryTypes] = useState([]);

    const [selectSEQ, setSelectSEQ] = useState([]);
    const [selectlike, setSelectlike] = useState([]);

    const maxCharacterCount = 100000; // 게시판 글자 제한

    const navigate = useNavigate();

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
    const handleUploadImage = async (e) => {
        const files = e.target.files;

        console.log(files);

        const maxFileSize = 10 * 1024 * 1024;
        const newAttachmentImg = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.size <= maxFileSize) {
                if (newAttachmentImg.length < maxFileCount) {
                    newAttachmentImg.push(file);
                } else {
                    alert('사진은 3장까지만 업로드 할 수 있습니다.');
                    break;
                }
            } else {
                alert('사진 용량이 10MB를 초과합니다.');
            }
        }

        setAttachmentImg(newAttachmentImg); // 변경된 첨부 파일 배열을 상태로 설정
        updateImagePreviews(newAttachmentImg);
    };

    const updateImagePreviews = (newAttachmentImg) => {
        const previews = [];

        for (let i = 0; i < newAttachmentImg.length && i < maxFileCount; i++) {
            previews.push(URL.createObjectURL(newAttachmentImg[i]));
        }

        setImagePreviews(previews); // 미리보기 이미지 URL
    };

    // 카테고리 선택 핸들러
    const handleInterestClick = (categorySEQ, TypeSEQ) => {
        // console.log(seq);
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

    // 카테고리, 카테고리 타입
    useEffect(() => {
        const fetchCategoryTypes = async () => {
            const result = await getCategoryTypes();
            setCategoryTypes(result.data);
        };

        const fetchCategories = async () => {
            const result = await getCategories();
            // console.log(result.data);
            setCategories(result.data);
        };

        fetchCategoryTypes();
        fetchCategories();
    }, []);

    // 카테고리랑 카테고리 타입이랑 한꺼번에 묶어서 아래
    const getCategoriesByType = (ctSEQ) => {
        return categories.filter((category) => category.categoryType && category.categoryType.ctSEQ === ctSEQ);
    };

    // UserInfo API
    // const UserInfoAPI = async () => {
    //     const result = await getUser();
    //     setUserInfo(result.data);
    // };

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

    const boardsAPI = async () => {
        const result = await getBoards();
        setBoards(result.data);
    };

    useEffect(() => {
        placeAPI();
        placeTypeAPI();
        boardsAPI();
    }, []);

    useEffect(() => {
        console.log(selectedPlace);
    }, [selectedPlace]);

    useEffect(() => {
        console.log(selectedPlaceType);
    }, [selectedPlaceType]);

    // useEffect(() => {
    //     console.log(selectedBoard);
    // }, [selectedBoard]);

    const handleCancel = (e) => {
        navigate('/');
        alert('글쓰기를 취소했습니다');
    };

    // 서버에 전송
    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault(); // 폼 기본 제출 방지
        }
        console.log(selectlike);
        console.log(selectSEQ);

        const PostDTO = {
            token: localStorage.getItem('token'), // 유저 정보
            postTitle: title, // 제목
            postContent: content, // 내용
            placeSEQ: selectedPlace, // 선택한 세부 지역
            placeTypeSEQ: selectedPlaceType, // 선택한 지역 앞에가 사용한 dto나 domain의 필드명 이름 뒤에가 사용한 useState이름
            boardSEQ: selectedBoard, // 선택한 게시판
        };
        console.log(localStorage.getItem('token'));
        console.log('PostDTO: ', PostDTO);

        // 선택한 카테고리 seq MatchingCategoryInfo 테이블로 보냄
        const MatchingDTO = {
            categoryList: selectlike,
            categoryTypeList: selectSEQ,
        };
        console.log('MatchingDTO: ', MatchingDTO);

        // 첨부한 사진 저장 경로와 등록한 게시물 Seq를 PostAttachments 테이블로 보냄

        // try {
        console.log(PostDTO);

        const postResponse = await addPostAPI(PostDTO); //addPostAPI를 이용해 서버로 전달  //api 사용 쓰는 명령어 기억하기

        console.log(postResponse);

        const formData = new FormData();
        // formData.enctype = 'multipart/form-data';
        formData.append('postId', postResponse.data.postSEQ);

        console.log(attachmentImg);
        console.log(attachmentImg.length);

        attachmentImg.forEach((image) => {
            formData.append('files', image);
        });

        console.log(MatchingDTO.categoryList);
        console.log(MatchingDTO.categoryList.map((categorySEQ) => ({ categorySEQ })));

        // addPostAPI 호출 이후에 addMatchingAPI를 호출
        const matchingResponse = await addMatchingAPI({
            postSEQ: postResponse.data.postSEQ,
            categories: MatchingDTO.categoryList.map((categorySEQ) => ({ categorySEQ })), // 이게 map으로 카테고리랑 카테고리 타입 SEQ묶어서 보내는 것
        });
        console.log(matchingResponse);

        // 여기 마저 작성해라

        const attachmentResponse = await addAttachmentsAPI(formData);
        console.log(attachmentResponse);
        console.log(postResponse.data.postSEQ);

        if (postResponse.data) {
            alert('글쓰기 성공');

            navigate('/');
        } else {
            alert('글쓰기 실패');
        }
    };

    return (
        <>
            <div id="form-container">
                <div id="form">
                    <form method="POST">
                        <div id="interest-section">
                            {/* <label>관심 주제를 선택하세요</label> */}
                            <div className="form-el">
                                <br />
                                <div className="set-categoryLike-box">
                                    {categoryTypes.map((categoryType) => (
                                        <div key={categoryType.ctSEQ}>
                                            <h3>{categoryType.ctName}</h3>
                                            <div className="set-box-options">
                                                {/* 여기서 한번에 묶은 카테고리 카테고리 타입을 맵으로 보여줌 */}
                                                {getCategoriesByType(categoryType.ctSEQ).map((category) => (
                                                    <div
                                                        key={category.categorySEQ}
                                                        className={`set-categoryLike-box-item ${
                                                            selectlike.includes(category.categorySEQ) ? 'selected' : ''
                                                            // 선택한 카테고리 배경색 나오게함
                                                        }`}
                                                        onClick={() =>
                                                            handleInterestClick(
                                                                // 선택된 카테고리 이름과 seq를 selectLike 배열에 추가하거나 제거하는 이벤트 selectSeq도 마찬가지

                                                                category.categorySEQ,
                                                                category.categoryType.ctSEQ
                                                            )
                                                        }
                                                    >
                                                        {/* {console.log(category)} */}
                                                        {category.categoryName}
                                                        {/*페이지에서 직접 보이는 카테고리 이름*/}
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
                            <div>
                            <div className='select-place'>
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
                                    <div className='select-place'>
                                        <h2>상세 지역</h2>
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
                                {selectedPlace && (
                                    <div>
                                        {/* <h2>Selected Place</h2>
                                        <p>{selectedPlace}</p> */}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div id="file-upload">
                            <label htmlFor="image-upload">
                                <input
                                    type="file"
                                    id="image-upload"
                                    className="image-upload"
                                    accept="image/*"
                                    onChange={handleUploadImage}
                                    multiple
                                />
                                <span>사진첨부</span>
                            </label>
                            <div>
                                <div className="board-image-main">
                                    <div className="board-image">
                                        {attachmentImg.map((attachment, index) => (
                                            <img
                                                key={index}
                                                src={URL.createObjectURL(attachment)}
                                                alt={`사진 ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {imagePreviews.map((preview, index) => (
                                    <img
                                        key={index}
                                        src={preview}
                                        alt={`사진 미리보기 ${index + 1}`}
                                        style={{ width: '150px', height: '150px' }}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* {console.log('typeof boardSeq', typeof 'boardSeq')}; */}
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
                                    내용: {content.length} / {maxCharacterCount}
                                </div>
                            </div>
                        </div>

                        <div className="submitButton">
                            <button type="submit" onClick={handleSubmit}>
                                등록
                            </button>
                        </div>
                        <div className="cancelButton">
                            <button onClick={handleCancel}>취소 </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
export default PostUpdate;
