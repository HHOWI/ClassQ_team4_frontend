import React, { useEffect, useState } from "react";
import "../css/login.css";
import logo from "../assets/logo.png";
import { useDispatch } from "react-redux"; 
import { asyncLogin } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [idValid, setIdValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (idValid && pwValid) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [idValid, pwValid]);

  const handleId = (e) => {
    setId(e.target.value);

    if (e.target.value.trim() !== "") {
      setIdValid(true);
    } else {
      setIdValid(false);
    }
  };

  const handlePw = (e) => {
    setPw(e.target.value);
    if (e.target.value.trim() !== "") {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };

  const onClickConfirmButton = async (event) => {
    event.preventDefault();

    try {
      const resultAction = await dispatch(asyncLogin({ id: id, pwd: pw }));
      const { payload } = resultAction;
      
      if (payload && payload.token) {
        alert("로그인 성공.");
        navigate("/");
      } else {
        alert("로그인 실패");
      }
    } catch (error) {
      alert("로그인 중 오류 발생");
    }
  };

  return (
    <div className="login-page">
      <div className="image">
        <img src={logo} style={{ height: "150px" }} alt="로고" />
      </div>
      <div className="contentWrap">
        <div className="titleWrap">
          <br />
        </div>
        <form onSubmit={onClickConfirmButton}>
          <div className="inputTitle">아이디</div>
          <div className="inputWrap">
            <input
              className="input"
              type="text"
              placeholder="아이디 입력"
              value={id}
              onChange={handleId}
            />
          </div>
          <div className="errorMessageWrap">
            {!idValid && id.length > 0 && <div>아이디를 입력해주세요.</div>}
          </div>

          <div style={{ marginTop: "26px" }} className="inputTitle">
            비밀번호
          </div>
          <div className="inputWrap">
            <input
              className="input"
              type="password"
              placeholder="비밀번호 입력"
              value={pw}
              onChange={handlePw}
            />
          </div>
          <div className="errorMessageWrap">
            {!pwValid && pw.length > 0 && <div>비밀번호를 입력해주세요.</div>}
          </div>

          <div className="linksWrap">
            <a href="/find-password">비밀번호 찾기</a>
            <span> ㅣ </span>
            <a href="/find-id">아이디 찾기</a>
            <span> ㅣ </span>
            <a href="/signup">회원가입</a>
          </div>
          <br />
          <div>
            <button type="submit" disabled={notAllow} className="bottomButton">
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
