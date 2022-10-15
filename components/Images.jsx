import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";

const ImagesStyle = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  .img-container {
    position: relative;
    img {
      height: 3rem;
      width: 3rem;
      border-radius: 0.7rem;
      object-fit: cover;
    }
    .iconify {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      opacity: 0;
      font-size: 20px;
      background: black;
      border-radius: 200px;
      padding: 0.1rem;
      path {
        fill: white;
      }
    }
    &:hover {
      .iconify {
        opacity: 1;
      }
    }
  }
  label {
    cursor: pointer;
  }
`;

function Images({ children, imagesArr }) {
  const [OIndex, setOIndex] = useState(null);
  const [modal, setModal] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages(imagesArr);
  }, [imagesArr]);

  const handleOpenImg = (idx) => {
    setModal(true);
    setOIndex(idx);
  };

  return (
    <ImagesStyle>
      {images &&
        images.map((img, i) => (
          <div>
            <div className='img-container'>
              <img key={i} src={img.src} onClick={() => handleOpenImg(i)} />
            </div>
            {modal && i === OIndex && (
              <Modal setModal={setModal}>
                <img src={img.src} alt='' className='enlarged-picture' />
              </Modal>
            )}
          </div>
        ))}
      {children}
    </ImagesStyle>
  );
}

export default Images;
