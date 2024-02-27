import { useState, useEffect } from "react";
import axios from "axios";
import { getCategoryTypes } from "../api/categoryType";
import { getCategories } from "../api/category";
import { getPlaceType } from "../api/place";
import {
  signUp,
  uploadProfileImg,
  userCategoryInfoRegister,
} from "../api/user";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledSignup = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;

  .form {
    max-width: 35vw;
    min-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 8px;
    border: 1px solid #e2e0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .form h3 {
    font-size: 26px;
    font-weight: bold;
    color: #262626;
    margin-bottom: 20px;
  }

  .form-el {
    margin-top: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .form-el label {
    font-size: 12px;
    font-weight: 600;
    color: #262626;
  }

  .form-el input {
    width: 75%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e2e0e0;
    font-size: 18px;
    font-weight: 400;
    margin-top: 4px;
    outline: none;
  }

  .form-el input:focus {
    border: 1px solid #ff7f38;
  }

  .message {
    font-size: 15px;
    color: #ef0000;
    margin-top: 4px;
  }

  .signup-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .signup-form button[type="submit"] {
    width: 500%;
    height: 48px;
    border: none;
    font-weight: bold;
    border-radius: 5px;
    background-color: #ff7f38;
    color: white;
    margin-top: 16px;
    cursor: pointer;
  }

  .signup-form button[type="submit"]:disabled {
    background-color: #ff7f38;
    color: white;
  }

  .show-password-button {
    border: 2px solid #e2e0e0;
    margin-bottom: 5px;
  }

  .form img {
    width: 5%;
    height: auto;
    margin-bottom: 20px;
  }

  .form-el.label-for-gender {
    margin-top: 16px; /* 간격 조절 */
  }

  .gender-options {
    display: flex;
    flex-direction: row;
    gap: 20px; /* 남자 여자 글자 사이의 간격 조절 */
  }

  .gender-option {
    display: flex;
    align-items: center;
  }

  .gender-option input[type="radio"] {
    margin-right: 2px; /* 라디오 버튼 간격 조절 */
  }

  .form-el.label-for-bloodType {
    margin-top: 16px; /* 간격 조절 */
  }

  /* 혈액형 선택창 스타일 */
  .form-el select {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e2e0e0;
    font-size: 14px;
    font-weight: 400;
    margin-top: 4px;
    outline: none;
  }

  /* 지역 선택창 조정 */
  .form-el select#place {
    width: 30%;
  }

  .form-el select#mbti {
    width: 30%;
  }

  /* 관심사 선택 부분 */
  .interest-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 16px;
  }

  .interest-section .form-el label {
    font-size: 25px; /* 관심 주제를 선택해주세요 글자 부분 */
  }

  .selectlike-box {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    margin-top: 8px;
  }

  .box-options {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    font-size: 16px;
  }

  .selectlike-box-item {
    font-style: inherit;
    margin: 5px;
    padding: 7px 10px;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 20px;
    font-size: 13px;
  }

  .selectlike-box-item.selected {
    background-color: #ff9615;
    color: white;
    border: 1px solid #ff9615;
  }

  .selectlike-box h3 {
    font-size: 17px;
    color: #ff9615;
  }

  /* 프로필 사진 부분 */
  .profile-picture-preview {
    margin-top: 10px;
    border: 1px solid #ccc;
    object-fit: cover;
    box-sizing: border-box;
    border-radius: 25px;
  }
`;

const SignUp = () => {
  // 상태 변수들
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState(true);
  const [isNameAvailable, setIsNameAvailable] = useState(true);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [age, setAge] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [hasPartner, setHasPartner] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [mbti, setMbti] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState(""); // 상태 메시지 글자수 경고
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [placeTypes, setPlaceTypes] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedPlaceType, setSelectedPlaceType] = useState({
    placeTypeSEQ: "", // 선택한 placeType의 placeTypeSEQ
    placeTypeName: "",
  });
  // 관심사 관련
  const [categories, setCategories] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [selectlike, setSelectlike] = useState([]);
  const [selectSeq, setSelectSeq] = useState([]);

  // 알림창(에러 메시지)
  const [idMessage, setIdMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [birthMessage, setBirthMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");

  // 유효성 검사
  const [isId, setIsId] = useState(false);
  const [isName, setIsName] = useState(false);
  const [isNickname, setIsNickname] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 아이디 중복 확인 함수
  const checkIdDuplicate = (currentId) => {
    fetch(`/api/checkDuplicate?id=${currentId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.isAvailable) {
          setIsIdAvailable(true);
          setIdMessage("사용 가능한 아이디입니다.");
        } else {
          setIsIdAvailable(false);
          setIdMessage("이미 사용 중인 아이디입니다.");
        }
      })
      .catch((error) => console.error(error));
  };

  // 닉네임 중복 확인 함수
  const checkNicknameDuplicate = (currentNickname) => {
    fetch(`/api/checkNicknameDuplicate?nickname=${currentNickname}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.isAvailable) {
          setIsNicknameAvailable(true);
          setNicknameMessage("사용 가능한 닉네임입니다.");
        } else {
          setIsNicknameAvailable(false);
          setNicknameMessage("이미 사용 중인 닉네임입니다.");
        }
      })
      .catch((error) => console.error(error));
  };

  // 아이디 입력 핸들러
  const onChangeId = (e) => {
    const currentId = e.target.value;
    setId(currentId);
    const idRegExp = /^[a-zA-z0-9]{4,12}$/;

    if (!idRegExp.test(currentId)) {
      setIsId(false);
      setIdMessage("4-12자 사이 대소문자 또는 숫자만 입력해 주세요.");
    } else {
      setIsId(true);
      setIdMessage("");
      checkIdDuplicate(currentId);
    }
  };

  // 이름 입력 핸들러
  const onChangeName = (e) => {
    const currentName = e.target.value;
    setName(currentName);

    if (currentName.length < 2 || currentName.length > 8) {
      setNameMessage("이름은 2글자 이상 8글자 이하로 입력해주세요.");
      setIsName(false);
    } else {
      setNameMessage("");
      setIsName(true);
    }
  };

  // 닉네임 입력 핸들러
  const onChangeNickname = (e) => {
    const currentNickname = e.target.value;
    setNickname(currentNickname);

    if (currentNickname.length < 2 || currentNickname.length > 8) {
      setNicknameMessage("닉네임은 2글자 이상 8글자 이하로 입력해주세요.");
      setIsNickname(false);
    } else {
      setNicknameMessage("");
      setIsNickname(true);
      checkNicknameDuplicate(currentNickname);
    }
  };

  // 비밀번호 입력 핸들러
  const onChangePassword = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMessage(
        "숫자+영문자+특수문자 사용해서 8자리 이상 입력해주세요."
      );
      setIsPassword(false);
    } else {
      setPasswordMessage("");
      setIsPassword(true);
    }
  };

  // 비밀번호 확인 입력 핸들러
  const onChangePasswordConfirm = (e) => {
    const currentPasswordConfirm = e.target.value;
    setPasswordConfirm(currentPasswordConfirm);
    if (password !== currentPasswordConfirm) {
      setPasswordConfirmMessage("비밀번호가 같지 않습니다.");
      setIsPasswordConfirm(false);
    } else {
      setPasswordConfirmMessage("");
      setIsPasswordConfirm(true);
    }
  };

  // 비밀번호 보이기 토글 핸들러
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // 이메일 입력 핸들러
  const onChangeEmail = (e) => {
    const currentEmail = e.target.value;
    setEmail(currentEmail);
    const emailRegExp =
      /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

    if (!emailRegExp.test(currentEmail)) {
      setEmailMessage("이메일의 형식이 올바르지 않습니다.");
      setIsEmail(false);
    } else {
      setEmailMessage("");
      setIsEmail(true);
    }
  };

  // 휴대전화번호 입력 핸들러
  const onChangePhone = (getNumber) => {
    const currentPhone = getNumber;
    setPhone(currentPhone);
    const phoneRegExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if (!phoneRegExp.test(currentPhone)) {
      setPhoneMessage("올바른 형식이 아닙니다.");
      setIsPhone(false);
    } else {
      setPhoneMessage("");
      setIsPhone(true);
    }
  };

  // 휴대전화번호 입력 핸들러 (자동으로 하이픈 추가)
  const addHyphen = (e) => {
    const currentNumber = e.target.value;
    setPhone(currentNumber);
    if (currentNumber.length === 3 || currentNumber.length === 8) {
      setPhone(currentNumber + "-");
      onChangePhone(currentNumber + "-");
    } else {
      onChangePhone(currentNumber);
    }
  };

  // 생일 입력 핸들러
  const onChangeBirth = (e) => {
    const currentBirth = e.target.value;
    setBirth(currentBirth);

    // 생일 기반 나이 계산
    const birthDate = new Date(currentBirth);
    const today = new Date();
    const ageDiff = today.getFullYear() - birthDate.getFullYear();
    // 현재 월과 생일 월 비교
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // 만약 현재 월이 생일 월보다 이전이거나, 현재 월과 생일 월이 같지만 현재 날짜가 생일보다 전일 경우 1 빼기
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      setAge(ageDiff - 1);
    } else {
      setAge(ageDiff);
    }
  };

  // 나이 입력 핸들러
  const onChangeAge = (e) => {
    const currentAge = e.target.value;
    setAge(currentAge);
  };

  // 성별 변경 핸들러
  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  // 애인 여부 선택 핸들러
  const handleHasPartnerChange = (e) => {
    setHasPartner(e.target.value);
  };

  // 혈액형 변경 핸들러
  const handleBloodTypeChange = (e) => {
    setSelectedBloodType(e.target.value);
  };

  // 지역 변경 핸들러
  const handlePlaceChange = (e) => {
    const selectedPlaceTypeName = e.target.value;
    const selectedPlaceTypeObj = placeTypes.find(
      (placeType) => placeType.placeTypeName === selectedPlaceTypeName
    );

    setSelectedPlaceType({
      placeTypeSEQ: selectedPlaceTypeObj
        ? selectedPlaceTypeObj.placeTypeSEQ
        : "",
      placeTypeName: selectedPlaceTypeName,
    });
  };

  // MBTI 변경 핸들러
  const handleMbtiChange = (e) => {
    setMbti(e.target.value);
  };

  // 상태 메시지 입력 핸들러
  const onChangeStatusMessage = (e) => {
    const currentStatusMessage = e.target.value;
    if (currentStatusMessage.length > 20) {
      setWarningMessage("최대 20자까지 입력 가능합니다.");
    } else {
      setStatusMessage(currentStatusMessage);
      setWarningMessage("");
    }
  };

  // 프로필 사진 파일 업로드 핸들러
  const handleProfilePictureUpload = (e) => {
    e.preventDefault();

    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setProfilePictureUrl(URL.createObjectURL(uploadedFile));
  };

  // 관심 주제 선택 핸들러
  const handleInterestClick = (interest, seq) => {
    console.log(seq);
    if (selectlike.includes(interest)) {
      setSelectlike(selectlike.filter((item) => item !== interest));
      setSelectSeq(selectSeq.filter((item) => item !== seq));
    } else {
      setSelectlike([...selectlike, interest]);
      setSelectSeq([...selectSeq, seq]);
    }
  };

  const getCategoriesByType = (ctSEQ) => {
    return categories.filter(
      (category) =>
        category.categoryType && category.categoryType.ctSEQ === ctSEQ
    );
  };

  const placeTypeAPI = async () => {
    const result = await getPlaceType();
    setPlaceTypes(result.data);
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault(); // 폼 기본 제출 방지
    }

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadProfileImg(formData);
    const profileImg = result.data;

    const userInfoDTO = {
      id,
      pwd: password,
      name,
      nickname,
      placeType: selectedPlaceType,
      age,
      gender: selectedGender,
      phone,
      email,
      hasPartner,
      birthday: birth,
      bloodType: selectedBloodType,
      mbti,
      statusMessage,
      profileImg: profileImg,
    };

    const signUpDTO = {
      userInfoDTO,
      userCategories: selectSeq.map((userCategorySeq) => ({ userCategorySeq })),
    };

    const userResponse = await signUp(signUpDTO);
    await userCategoryInfoRegister(signUpDTO);

    if (userResponse.data) {
      alert("회원가입 성공. 로그인 해주세요");
      navigate("/");
    } else {
      alert("회원가입 실패. 다시 시도해주세요.");
    }
  };

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
    placeTypeAPI();
  }, []);

  return (
    <StyledSignup>
      <div className="form-container">
        <div className="form">
          <div className="form-el">
            <label htmlFor="notion"> * 는 필수 입력 항목입니다. </label> <br />
            <br></br>
            <label htmlFor="notion">
              {" "}
              기입하지 않은 정보는 비공개 표시됩니다.{" "}
            </label>{" "}
            <br />
            <br></br>
            <br></br>
            <label htmlFor="id"> * 아이디 </label> <br />
            <input id="id" name="id" value={id} onChange={onChangeId} />
            <br></br>
            {!isNameAvailable && <p>이미 사용 중인 아이디입니다.</p>}
            <p className="message">{idMessage}</p>
          </div>

          {/* 이름 입력 양식 */}
          <div className="form-el">
            <label htmlFor="name"> * 이름</label> <br />
            <input id="name" name="name" value={name} onChange={onChangeName} />
            <br />
            {!isNameAvailable && <p>이미 사용 중인 이름입니다.</p>}
            <p className="message">{nameMessage}</p>
          </div>

          {/* 닉네임 입력 양식 */}
          <div className="form-el">
            <label htmlFor="nickname"> * 닉네임</label> <br />
            <input
              id="nickname"
              name="nickname"
              value={nickname}
              onChange={onChangeNickname}
            />
            <br></br>
            {!isNicknameAvailable && <p>이미 사용 중인 닉네임입니다.</p>}
            <p className="message">{nicknameMessage}</p>
          </div>

          {/* 비밀번호 입력 양식 */}
          <div className="form-el">
            <label htmlFor="password"> * 비밀번호</label> <br />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"} // 비밀번호 보이기 입력에 따라 변경
              value={password}
              onChange={onChangePassword}
            />
            <br></br>
            <button
              type="button"
              onClick={toggleShowPassword}
              className="show-password-button"
            >
              {showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            </button>
            <p className="message">{passwordMessage}</p>
          </div>

          {/* 비밀번호 확인 입력 양식 */}
          <div className="form-el">
            <label htmlFor="passwordConfirm"> * 비밀번호 확인</label> <br />
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type={showPassword ? "text" : "password"}
              value={passwordConfirm}
              onChange={onChangePasswordConfirm}
            />
            <br></br>
            <button
              type="button"
              onClick={toggleShowPassword}
              className="show-password-button"
            >
              {showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            </button>
            <p className="message">{passwordConfirmMessage}</p>
          </div>

          {/* 이메일 입력 양식 */}
          <div className="form-el">
            <label htmlFor="email"> * 이메일</label> <br />
            <input
              id="email"
              name="name"
              value={email}
              onChange={onChangeEmail}
            />
            <p className="message">{emailMessage}</p>
          </div>

          {/* 휴대전화번호 입력 양식 */}
          <div className="form-el">
            <label htmlFor="phone">* 휴대전화번호</label> <br />
            <input id="phone" name="phone" value={phone} onChange={addHyphen} />
            <p className="message">{phoneMessage}</p>
          </div>

          {/* 생일 입력 양식 */}
          <div className="form-el">
            <label htmlFor="birth">생일</label> <br />
            <input
              id="birth"
              name="birth"
              type="Date"
              value={birth}
              onChange={onChangeBirth}
            />
            <p className="message">{birthMessage}</p>
          </div>

          {/* 나이 입력 양식 */}
          <div className="form-el">
            <label htmlFor="age">나이 (생일 선택시 자동 선택. 만나이)</label>{" "}
            <br />
            <input
              id="age"
              name="age"
              type="number"
              value={age}
              onChange={onChangeAge}
            />
          </div>

          {/* 성별 입력 양식 */}
          <div className="form-el">
            <label>성별</label> <br />
            <div className="gender-options">
              <div className="gender-option">
                <label htmlFor="남">
                  <input
                    type="radio"
                    id="남"
                    name="gender"
                    value="남"
                    checked={selectedGender === "남"}
                    onChange={handleGenderChange}
                  />
                  남
                </label>
              </div>
              <br></br>
              <div className="gender-option">
                <label htmlFor="여">
                  <input
                    type="radio"
                    id="여"
                    name="gender"
                    value="여"
                    checked={selectedGender === "여"}
                    onChange={handleGenderChange}
                  />
                  여
                </label>
              </div>
            </div>
            <br></br>
            {/* 애인 여부 입력 양식 */}
            <div className="form-el">
              <label>애인 여부</label> <br />
              <div className="gender-options">
                <div className="gender-option">
                  <input
                    type="radio"
                    id="hasPartnerYes"
                    name="hasPartner"
                    value="Y"
                    checked={hasPartner === "Y"}
                    onChange={handleHasPartnerChange}
                  />
                  <label htmlFor="hasPartnerYes">있음</label>
                </div>
                <br></br>
                <div className="gender-option">
                  <input
                    type="radio"
                    id="hasPartnerNo"
                    name="hasPartner"
                    value="N"
                    checked={hasPartner === "N"}
                    onChange={handleHasPartnerChange}
                  />
                  <label htmlFor="hasPartnerNo">없음</label>
                </div>
              </div>
            </div>
            <br></br>
            {/* 혈액형 입력 양식 */}
            <div className="blood-type">
              <label>혈액형</label> <br />
              <select
                id="bloodType"
                name="bloodType"
                type="String"
                value={selectedBloodType}
                onChange={handleBloodTypeChange}
              >
                <option value="">선택하세요</option>
                <option value="A">A형</option>
                <option value="B">B형</option>
                <option value="AB">AB형</option>
                <option value="O">O형</option>
              </select>
            </div>
          </div>

          {/* 지역 입력 양식 */}
          <div className="form-el select-for-place">
            <label htmlFor="place"> * 지역</label> <br />
            <select
              id="place"
              name="place"
              value={selectedPlaceType.placeTypeName}
              onChange={handlePlaceChange}
            >
              <option value="">선택하세요</option>
              {placeTypes.map((placeType) => (
                <option
                  value={placeType.placeTypeName}
                  key={placeType.placeTypeSEQ}
                >
                  {placeType.placeTypeName}
                </option>
              ))}
            </select>
          </div>

          {/* MBTI 입력 양식 */}
          <div className="form-el select-for-mbti">
            <label htmlFor="mbti">MBTI</label> <br />
            <select
              id="mbti"
              name="mbti"
              type="String"
              value={mbti}
              onChange={handleMbtiChange}
            >
              <option value="">선택하세요</option>
              <option value="ISTJ">ISTJ</option>
              <option value="ISFJ">ISFJ</option>
              <option value="INFJ">INFJ</option>
              <option value="INTJ">INTJ</option>
              <option value="ISTP">ISTP</option>
              <option value="ISFP">ISFP</option>
              <option value="INFP">INFP</option>
              <option value="INTP">INTP</option>
              <option value="ESTP">ESTP</option>
              <option value="ESFP">ESFP</option>
              <option value="ENFP">ENFP</option>
              <option value="ENTP">ENTP</option>
              <option value="ESTJ">ESTJ</option>
              <option value="ESFJ">ESFJ</option>
              <option value="ENFJ">ENFJ</option>
              <option value="ENTJ">ENTJ</option>
            </select>
          </div>
          <br></br>

          {/* 상태 메시지 입력 양식 */}
          <div className="form-el">
            <label htmlFor="statusMessage">상태 메시지 (최대 20자)</label>{" "}
            <br />
            <input
              id="statusMessage"
              name="statusMessage"
              value={statusMessage}
              onChange={onChangeStatusMessage}
              maxLength={20}
            />
            <p className="message">{warningMessage}</p>
          </div>

          {/* 프로필 사진 입력 양식 */}
          <div className="form-el">
            <label htmlFor="profilePicture">프로필 사진</label> <br />
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={(e) => handleProfilePictureUpload(e)}
            />
            <br />
            {profilePictureUrl && (
              <img
                src={profilePictureUrl}
                alt="프로필 사진 미리보기"
                className="profile-picture-preview"
                style={{ width: "150px", height: "150px" }}
              />
            )}
          </div>

          {/* 관심 주제 선택 양식 */}
          <div className="interest-section">
            <div className="form-el">
              <label>관심 주제를 선택해주세요</label>
              <br />
              <div className="selectlike-box">
                {categoryTypes.map((categoryType) => (
                  <div key={categoryType.ctSEQ}>
                    <h3>{categoryType.ctName}</h3>
                    <div className="box-options">
                      {getCategoriesByType(categoryType.ctSEQ).map(
                        (category) => (
                          <div
                            key={category.categorySEQ}
                            className={`selectlike-box-item ${
                              selectlike.includes(category.categoryName)
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              handleInterestClick(
                                category.categoryName,
                                category.categorySEQ
                              )
                            }
                          >
                            {category.categoryName}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <br />
          <br />
          <div onClick={handleSubmit} className="signup-form">
            <button type="submit">가입하기</button>
          </div>
        </div>
      </div>
    </StyledSignup>
  );
};

export default SignUp;
