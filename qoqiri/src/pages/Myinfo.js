import React, { useState, useEffect } from "react";
import MyInfoHeader from "../components/MyInfoHeader";

const MyInfo = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("user");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
    }
  }, []);

  return (
    <>
      <MyInfoHeader />
      <div className="selected-category">
        {userInfo ? (
          <table className="user-info-table">
            <thead>
              <tr>
                <th>항목</th>
                <th>내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>아이디</td>
                <td>{userInfo.id}</td>
              </tr>
              <tr>
                <td>비밀번호</td>
                <td>비공개 (표시되지 않음)</td>
              </tr>
              <tr>
                <td>이름</td>
                <td>{userInfo.name}</td>
              </tr>
              <tr>
                <td>닉네임</td>
                <td>{userInfo.nickname}</td>
              </tr>
              <tr>
                <td>지역</td>
                <td>{userInfo.placeType.placeTypeName}</td>
              </tr>
              <tr>
                <td>나이</td>
                <td>{userInfo.age || "비공개"}</td>
              </tr>
              <tr>
                <td>성별</td>
                <td>{userInfo.gender || "비공개"}</td>
              </tr>
              <tr>
                <td>휴대전화번호</td>
                <td>{userInfo.phone}</td>
              </tr>
              <tr>
                <td>이메일</td>
                <td>{userInfo.email}</td>
              </tr>
              <tr>
                <td>상태메시지</td>
                <td>{userInfo.statusMessage || "비공개"}</td>
              </tr>
              <tr>
                <td>애인여부</td>
                <td>{userInfo.hasPartner || "비공개"}</td>
              </tr>
              <tr>
                <td>혈액형</td>
                <td>{userInfo.bloodType || "비공개"}</td>
              </tr>
              <tr>
                <td>MBTI</td>
                <td>{userInfo.mbti || "비공개"}</td>
              </tr>
              <tr>
                <td>생일</td>
                <td>
                  {userInfo.birthday
                    ? userInfo.birthday.split("T")[0]
                    : "비공개"}
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </div>
    </>
  );
};

export default MyInfo;
