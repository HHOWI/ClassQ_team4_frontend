import logo from "../assets/logo.png";
import title from "../assets/title.JPG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell as solidBell,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBell as regularBell,
  faComment,
} from "@fortawesome/free-regular-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { userSave, userLogout } from "../store/userSlice";
import { asyncChatRooms } from "../store/chatRoomSlice";
import { asyncSearchResult } from "../store/postSlice";
import { checkNotify, getUnreadNotify } from "../api/notify";
import NotifyList from "./NotifyList";
import ChatList from "./ChatList";
import { asyncMyPostNotMatched } from "../store/myPostSlice";
import { asyncBlockUsers } from "../store/blockUserSlice";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const user = useSelector((state) => state.user);
  const [notify, setNotify] = useState(0);
  const [notifyListShow, setNotifyListShow] = useState(false);
  const [chatRoomListShow, setChatRoomListShow] = useState(false);
  const notifyClose = () => setNotifyListShow(false);
  const notifyShow = () => setNotifyListShow(true);
  const chatListClose = () => setChatRoomListShow(false);
  const chatListShow = () => setChatRoomListShow(true);

  // 미확인 알림개수 API
  const unreadNotifyAPI = async () => {
    const result = await getUnreadNotify(user.id);
    setNotify(result.data);
  };

  // 알림확인처리 API
  const checkNotifyAPI = async () => {
    // 미확인 알림 구분을 위해 1초 딜레이 후 확인처리
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await checkNotify(user.id);
  };

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      dispatch(asyncChatRooms(user.id));
      dispatch(asyncMyPostNotMatched(user.id));
      dispatch(asyncBlockUsers(user.id));
      unreadNotifyAPI();
    }

    const save = localStorage.getItem("user");
    if (Object.keys(user).length === 0 && save !== null) {
      dispatch(userSave(JSON.parse(save)));
    }
  }, [user]);

  if (location.pathname === "/Login" || location.pathname === "/signup") {
    return null; // 로그인, 회원가입 페이지일때 헤더 숨김
  }

  const logout = () => {
    console.log("logout!");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(userLogout());
    window.location.reload(); // 현재 페이지를 새로고침
  };

  return (
    <>
      <div className="header">
        <div className="header-logo">
          <a href="/" className="logo">
            <img
              src={logo}
              className="App-logo"
              alt="logo"
              style={{ height: "50px", width: "auto" }}
            />
            <img
              src={title}
              className="App-title"
              alt="title"
              style={{
                height: "40px",
                width: "auto",
              }}
            />
          </a>
        </div>

        <div className="header-search">
          <input
            type="search"
            id="search"
            className="search"
            placeholder="원하는 끼리를 검색해보세요"
            name="search"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />

          <button
            className="searchBtn"
            onClick={() => {
              dispatch(asyncSearchResult(keyword));
            }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{
                height: "20px",
                width: "auto",
                color: "rgb(49, 49, 49)",
              }}
            />
          </button>
        </div>
        <div className="header-right_item">
          <div className="header-matching_container">
            <Link to="/postWrite" className="header-matching">
              모집
            </Link>
            <Link to="/matchingBoard" className="header-matching">
              찾기
            </Link>
            <Link to="/review" className="header-matching">
              후기
            </Link>
          </div>
          <div className="header-flex"></div>

          {/* 로그인이 되어 있지 않은 경우 */}
          {Object.keys(user).length === 0 && (
            <>
              <button className="header-user">
                <Link to="/Login" className="login">
                  로그인
                </Link>
              </button>
              <button className="header-user">
                <Link to="/signup" className="join">
                  회원가입
                </Link>
              </button>
            </>
          )}

          {/* 로그인이 되어 있는 경우 */}
          {Object.keys(user).length !== 0 && (
            <>
              <button className="header-user">
                <Link to="/myinfo" className="myInfo">
                  {user.nickname}
                </Link>
              </button>
              <button onClick={logout} className="header-user">
                <div className="logout">로그아웃</div>
              </button>
              <div className="header-icon">
                <div
                  className="header-user open_chatlist"
                  onClick={chatListShow}
                >
                  <FontAwesomeIcon
                    icon={faComment}
                    size={"2xl"}
                    style={{ color: "rgb(49, 49, 49)" }}
                  />
                </div>
                <button
                  className="header-user"
                  onClick={() => {
                    notifyShow();
                    checkNotifyAPI();
                  }}
                >
                  <div className="notify-icon">
                    {notify > 0 ? (
                      <FontAwesomeIcon
                        icon={solidBell}
                        style={{
                          height: "30px",
                          color: "red",
                        }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={regularBell}
                        style={{
                          height: "30px",
                          color: "rgb(49, 49, 49)",
                        }}
                      />
                    )}
                  </div>
                  {notify > 0 && <div className="notify-count">{notify}</div>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <NotifyList
        show={notifyListShow}
        handleClose={notifyClose}
        placement="end"
      />
      <ChatList
        show={chatRoomListShow}
        handleClose={chatListClose}
        placement="end"
      />
    </>
  );
};
export default Header;
