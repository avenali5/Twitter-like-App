import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../utils/firebase";
import Message from "../components/Message";
import Head from "next/head";

function PostDetails() {
  const route = useRouter();
  const routeData = route.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //submit message
  const submitMessage = async () => {
    //check if user is logged
    if (!auth.currentUser) return route.push("/auth/login");
    if (!message) {
      toast.error("Don't leave an empty message", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };

  //get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
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
    <div>
      <Head>
        <title>Creative Minds | Post</title>
        <meta
          name='description'
          content='Basic Twitter-like app by Alejo Avenali'
        />
        <link rel='icon' href='/favicon.svg' />
      </Head>
      <Message {...routeData}></Message>
      <div className='my-4'>
        <div className='flex'>
          <input
            type='text'
            value={message}
            placeholder={"Write a comment..."}
            onChange={(e) => setMessage(e.target.value)}
            className='bg-gray-800 w-full p-2 text-white text-sm'
          />
          <button
            onClick={submitMessage}
            className='bg-cyan-500 text-white py-2 px-4 text-sm'
          >
            Submit
          </button>
        </div>
        <div className='py-6'>
          <h2 className='font-bold'>Comments</h2>
          {allMessages ? (
            allMessages.map((msg, i) => (
              <div key={i}>
                <div className='flex items-center'>
                  <img className='w-10 rounded-full' src={msg.avatar} alt='' />
                  <h2>{msg.username}</h2>
                </div>
                <h2>{msg.message}</h2>
              </div>
            ))
          ) : (
            <span className='text-gray-500 py-5 block text-sm'>
              There are no comments yet. Be the first!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
