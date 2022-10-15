import { Icon } from "@iconify/react";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const ModalStyle = styled.div`
  background: #00000040;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  .modal-children {
    display: grid;
    place-items: center;
    position: relative;
    height: auto;
    max-height: 90%;
    width: auto;
    max-width: 90%;
    .iconify {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 40px;
      // transform: translate(0%, -0%);
      cursor: pointer;
      path {
        fill: black;
      }
    }
    .enlarged-picture {
      width: 100%;
      height: 100%;
      // object-fit: cover;
      cursor: unset;
    }
  }
`;

function Modal({ children, setModal }) {
  const modalRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      document.addEventListener(
        "click",
        (e) => {
          if (modalRef.current && !modalRef.current.contains(e.target)) {
            setModal(false);
          }
        },
        200
      );
    });
  }, []);
  return (
    <ModalStyle>
      <div className='modal-children' ref={modalRef}>
        <Icon
          icon={"ci:off-outline-close"}
          onClick={() => {
            setModal(false);
          }}
        />
        {children}
      </div>
    </ModalStyle>
  );
}

export default Modal;
