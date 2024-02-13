import { useNavigate } from "react-router-dom";
import "../css/Myinfo.css";

const MyInfoHeader = () => {
  const navigate = useNavigate();
  const categories = [
    "가입 정보",
    "회원정보 변경",
    "내가 쓴 글",
    "내가 쓴 댓글",
    "차단한 사용자",
  ];

  const handleCategoryClick = (category) => {
    if (category === "가입 정보") {
      navigate("/MyInfo");
    }
    if (category === "회원정보 변경") {
      navigate("/EditProfile");
    }
    if (category === "내가 쓴 댓글") {
      navigate("/Mycomments");
      return;
    }
    if (category === "내가 쓴 글") {
      navigate("/Mypost");
      return;
    }
    if (category === "차단한 사용자") {
      navigate("/BlockUserInfo");
      return;
    }
  };

  return (
    <div className="category-page">
      <div className="category-buttons">
        {categories.map((category, index) => (
          <button key={index} onClick={() => handleCategoryClick(category)}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyInfoHeader;
