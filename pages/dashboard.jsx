import React, { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Icon } from "@iconify/react";
import Message from "../components/message";
import Link from "next/link";
import Head from "next/head";

export default function dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [allPosts, setAllPosts] = useState([]);

  const getData = async () => {
    //see if user is logged
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsubscribe;
  };

  //delete post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <Head>
        <title>Creative Minds | Your Posts</title>
        <meta
          name='description'
          content='Basic Twitter-like app by Alejo Avenali'
        />
        <link rel='icon' href='/favicon.svg' />
      </Head>
      <h1>Your posts</h1>
      <div>
        {allPosts &&
          allPosts.map((post, i) => (
            <Message key={i} {...post}>
              <div className='flex gap-4'>
                <button
                  onClick={() => deletePost(post.id)}
                  className='text-pink-600 flex items-center justify-center gap-2 py-2 cursor-pointer text-sm'
                >
                  <Icon icon={"heroicons-solid:trash"} className='text-2xl' />
                  Delete
                </button>
                <Link href={{ pathname: "/post", query: post }}>
                  <button className='text-teal-600 flex items-center justify-center gap-2 py-2 cursor-pointer text-sm'>
                    <Icon
                      icon={"heroicons:pencil-square-solid"}
                      className='text-2xl'
                    />
                    Edit
                  </button>
                </Link>
              </div>
            </Message>
          ))}
      </div>
      <button
        onClick={() => auth.signOut()}
        className='font-medium text-white bg-gray-800 py-2 px-4 rounded-md my-6'
      >
        Sign out
      </button>
    </div>
  );
}
