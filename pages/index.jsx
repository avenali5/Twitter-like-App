import Head from "next/head";
import { useEffect, useState } from "react";
import Message from "../components/message";
import { db } from "../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Icon } from "@iconify/react";
import styled from "styled-components";
import PostDetail from "../components/PostDetail";
import Modal from "../components/Modal";

const HomeStyle = styled.div`
  .iconify {
    font-size: 19px;
    path {
      fill: #09ae69;
    }
  }
`;

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [detail, setModal] = useState(false);
  const [oIndex, setOIndex] = useState(null);
  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
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

  const handleDetail = (oId) => {
    setOIndex(oId);
    setModal(true);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <Head>
        <title>Creative Minds | Home</title>
        <meta
          name='description'
          content='Basic Twitter-like app by Alejo Avenali'
        />
        <link rel='icon' href='/favicon.svg' />
      </Head>

      <HomeStyle>
        {allPosts ? (
          allPosts.map((post, i) => (
            <Message key={i} {...post}>
              <button className='flex items-center gap-3 text-gray-700 text-base'>
                <Icon icon='heroicons:chat-bubble-left-right-20-solid' />
                <div
                  className='comments'
                  onClick={() => {
                    handleDetail(post.id);
                  }}
                >
                  {post.comments ? post.comments.length : 0} comments
                </div>
              </button>
              {detail && post.id === oIndex && (
                <Modal setModal={setModal}>
                  <PostDetail {...post} setModal={setModal} />
                </Modal>
              )}
            </Message>
          ))
        ) : (
          <span>
            There are no posts yet. Click on{" "}
            <span className='button'>Post</span> and be the first!
          </span>
        )}
      </HomeStyle>
    </div>
  );
}
