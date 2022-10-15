import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import Images from "../components/Images";
import Head from "next/head";

const PostStyle = styled.div`
  input {
    display: none !important;
  }
  .iconify {
    font-size: 30px;
  }
`;

export default function Post() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const inputRef = useRef();
  const [loader, setLoader] = useState(false);
  const [post, setPost] = useState({
    description: "",
    files: [],
  });
  const routeData = route.query;

  const submitPost = async (e) => {
    e.preventDefault();
    //run check

    if (!post.description) {
      toast.error("Oops.. Description field empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    if (post.description.length > 300) {
      toast.error("Oops.. Description too long", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    setLoader(true);
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = {
        ...post,
        timestamp: serverTimestamp(),
        edited: true,
      };
      await updateDoc(docRef, updatedPost);
      setLoader(false);
      return route.push("/");
    } else {
      //make new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: "" });
      toast.success("New post has been created!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      setLoader(false);
      return route.push("/");
    }
  };

  //check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <PostStyle className='m7-20 p-12 shadow-lg rounded-lg max-w-md mx-auto'>
      <Head>
        <title>Creative Minds | Make a Post</title>
        <meta
          name='description'
          content='Basic Twitter-like app by Alejo Avenali'
        />
        <link rel='icon' href='/favicon.svg' />
      </Head>
      <form onSubmit={submitPost}>
        <h1 className='text-2x1 font-bold'>
          {post.hasOwnProperty("id") ? "Edit your post" : "Create a new post"}
        </h1>
        <div className='py-2'>
          <h3 className='text-lg font-medium py-2'>Description</h3>
          <textarea
            className='bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm'
            placeholder="I'm feeling inspired..."
            ref={inputRef}
            value={post.description}
            onChange={(e) => {
              setPost({ ...post, description: e.target.value });
            }}
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <Images imagesArr={post.files}>
          <label htmlFor='file'>
            <Icon icon={"icon-park:add-picture"} />
          </label>
          <input
            style={{ display: "none" }}
            type='file'
            id='file'
            accept='image/jpg, image/jpeg, image/webp'
            onChange={(e) =>
              setPost({
                ...post,
                files: [
                  ...post.files,
                  {
                    src: URL.createObjectURL(e.target.files[0]),
                  },
                ],
              })
            }
          />
        </Images>
        {loader ? (
          <div className='flex justify-center items-center button mt-3 animate-spin'>
            <Icon icon={"ei:spinner-3"} className='animate-spin' />
          </div>
        ) : (
          <button type='submit' className='button w-full mt-4'>
            {post.hasOwnProperty("id") ? "Edit your post" : "Create a new post"}
          </button>
        )}
      </form>
    </PostStyle>
  );
}
