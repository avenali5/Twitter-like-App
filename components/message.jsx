import React, { useEffect, useState } from "react";
import moment from "moment";
import styled from "styled-components";
import Images from "./Images";
const MessageStyle = styled.div`
  border-bottom: 1px solid #4f4f4f50;
  padding: 1rem;
  .profile-image {
    filter: drop-shadow(0px 4px 19px rgba(30, 30, 30, 0.35));
    border-radius: 0.6rem;
    width: 2.6rem;
    margin-right: 1rem;
  }
  .name {
    color: #3c3c3c;
    font-size: 1.1rem;
    font-weight: 600;
  }
  > .description {
    padding: 0.1rem 0 1rem;
    padding-left: 3.6rem;
    p {
      font-weight: 400;
      color: #3c3c3c;
    }
  }
  .date-container {
    display: flex;
    font-size: 0.8rem;
    color: grey;
    .date {
      span {
        margin-right: 0.1rem;
      }
    }
  }
  > .description + div {
    padding-left: 3.6rem;
    img {
      width: 8rem;
      height: 8rem;
      cursor: pointer;
    }
  }
  .children {
    padding-left: 3.6rem;
    * {
      font-size: 0.9rem;
    }
  }
  &:hover {
    background: #eaeaea;
    transition: 0.3s all;
  }
`;
function Message({
  children,
  avatar,
  username,
  description,
  edited,
  timestamp,
  files,
}) {
  const [formattedTime, setformattedTime] = useState("");
  useEffect(() => {
    setformattedTime(new Date(timestamp.seconds * 1000));
  }, []);

  return (
    <MessageStyle>
      <div className='flex items-center'>
        <img
          src={avatar ? avatar : "./assets/user.png"}
          loading='lazy'
          className='profile-image'
        />
        <div className='flex flex-col justify-between w-full sm:flex-row '>
          <h2 className='name'>{username}</h2>
          <div className='date-container'>
            <span>
              {edited && <span>Edited ●</span>}{" "}
              {moment(formattedTime).calendar()}
            </span>
          </div>
        </div>
      </div>
      <div className='description'>
        <p>{description}</p>
      </div>
      {files && <Images imagesArr={files} />}
      <div className='children'>{children}</div>
    </MessageStyle>
  );
}

export default Message;
