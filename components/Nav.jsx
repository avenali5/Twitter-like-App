import Link from "next/link";
import React, { useState } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  const [menu, setMenu] = useState(false);
  return (
    <nav className='flex items-center justify-between py-5 px-2 z-50'>
      <Link href={"/"}>
        <img src='/assets/logo.svg' alt='' />
      </Link>
      <ul className='flex items-center gap-10'>
        {!user ? (
          <Link href={"/auth/login"}>
            <span className='button'>Join Now</span>
          </Link>
        ) : (
          <div className='flex items-center gap-6'>
            <Link href={"/post"}>
              <button className='button'>Post</button>
            </Link>
            <div className='relative'>
              <img
                onClick={() => setMenu(!menu)}
                className='w-12 rounded-xl cursor-pointer'
                src={user.photoURL}
              />
              {menu && (
                <div className='absolute w-max flex flex-col gap-5 right-0 bg-slate-50 p-4 shadow-md rounded-md'>
                  <Link href={"/dashboard"}>Go to dashboard</Link>
                  <button
                    onClick={() => auth.signOut()}
                    className='font-medium text-white bg-gray-800 py-2 px-4 rounded-md '
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </ul>
    </nav>
  );
}
