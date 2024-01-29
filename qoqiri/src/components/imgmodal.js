import React from "react";
import "../css/imgmodal.css";

const imgmodal = ({ images, close }) => {
  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-main">
        <img src={images} alt="imgmodal" />
        <button className="modal-close" onClick={close}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default imgmodal;
