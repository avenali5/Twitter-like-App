import React, { useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Icon } from "@iconify/react";
import Head from "next/head";

const login = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  // sign in with google
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      route.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
    }
  }, [user]);

  return (
    <div className='shadow-xl mt-32 p-10 text-gray-700 rounded-lg'>
      <Head>
        <title>Creative Minds | Join Now</title>
        <meta
          name='description'
          content='Basic Twitter-like app by Alejo Avenali'
        />
        <link rel='icon' href='/favicon.svg' />
      </Head>
      <h2 className='text-2x1 font-medium'>Join Today</h2>
      <div className='py-4'>
        <h3 className='py-4'>Sign in with of the providers</h3>
        <button
          className='text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4'
          onClick={GoogleLogin}
        >
          <Icon icon='flat-color-icons:google' className='text-2xl mr-3' />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default login;
