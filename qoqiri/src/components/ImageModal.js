import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import styled from "styled-components";

const StyledImageModal = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 21;
  background-color: rgba(0, 0, 0, 0.2);
  .image_list {
    width: 1000px;

    .image_carosel {
      width: 100%;
    }
  }
`;

const ImageModal = ({ index, attachmentList, handleCloseImage }) => {
  const [activeIndex, setActiveIndex] = useState(index);

  const handleSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
  };

  const close = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseImage();
    }
  };

  return (
    <StyledImageModal onClick={close}>
      <Carousel
        className="image_list"
        activeIndex={activeIndex}
        onSelect={handleSelect}
        interval={null}
      >
        {attachmentList.map((attachment, idx) => (
          <Carousel.Item key={attachment.postAttachmentSEQ}>
            <img
              src={`/upload/${attachment?.attachmentURL}`}
              alt={`이미지 ${idx + 1}`}
              className="image_carosel"
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </StyledImageModal>
  );
};

export default ImageModal;
