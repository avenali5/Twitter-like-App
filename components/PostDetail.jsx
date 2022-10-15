import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { auth, db } from "../utils/firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import Message from "./message";

const PostDetailStyle = styled.div`
  max-height: 40rem;
  min-width: 100%;
  overflow-y: scroll;
  background: white;
  margin: auto;
  position: absolute;
  padding: 1.4rem;
  border-radius: 0.8rem;
  > div:nth-child(1) {
    &:hover {
      background: none !important;
    }
  }
  &::-webkit-scrollbar {
    width: 0;
  }
  .iconify {
    font-size: 35px !important;
    position: absolute;
    top: 0.5rem;
    right: 2rem;
    cursor: pointer;
    path {
      fill: black !important;
    }
  }
  .profile-image {
    width: 2.5rem !important;
    height: 2.5rem !important;
  }
  .name {
    margin-right: 8rem;
    font-size: 1.3rem !important;
  }
  .date {
    font-size: 0.8rem;
  }
  .comments {
    margin: 1rem 0 2rem;
  }
  .input {
    display: flex;
    flex-direction: column;
    // margin: 2rem 0;
    textarea {
      background: #eaeaea;
      padding: 0.5rem;
      margin-bottom: 0.4rem;
      border-radius: 0.7rem;
    }
    .primary-button {
      background: #09ae69;
      padding: 0.3rem 1.2rem;
      border-radius: 0.5rem;
      color: white;
    }
  }
  @media (min-width: 768px) {
    min-width: 40rem;
  }
`;

function PostDetail(props) {
  const route = useRouter();
  const [description, setDescription] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //submit message
  const submitMessage = async () => {
    //check if user is logged
    if (!auth.currentUser) return route.push("/auth/login");
    if (!description) {
      toast.error("Don't leave an empty message", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "posts", props.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        description,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        timestamp: Timestamp.now(),
      }),
    });
    setDescription("");
  };

  //get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", props.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!route.isReady) return;
    getComments();
  }, [route.isReady]);

  return (
    <PostDetailStyle>
      <Icon
        icon={"ci:off-outline-close"}
        onClick={() => {
          props.setModal(false);
        }}
      />
      <Message
        username={props.username}
        timestamp={props.timestamp}
        avatar={props.avatar}
        files={props.files}
        description={props.description}
      />
      <div className='comments'>
        <h2 className='font-bold'>Comments</h2>
        {allMessages ? (
          allMessages.map((msg, i) => <Message {...msg} key={i} />)
        ) : (
          <span className=''>There are no comments yet. Be the first!</span>
        )}
      </div>
      <div className='input'>
        <textarea
          type='text'
          value={description}
          placeholder={"Write a comment..."}
          onChange={(e) => setDescription(e.target.value)}
          className=''
        />
        <button onClick={submitMessage} className='primary-button lg:w-1/3'>
          Submit
        </button>
      </div>
    </PostDetailStyle>
  );
}

export default PostDetail;
