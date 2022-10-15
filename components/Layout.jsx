import React from "react";
import Nav from "./Nav";

export const Layout = ({ children }) => {
  return (
    <div className='mx-6 md:max-w-4xl md:mx-auto font-noto'>
      <Nav />
      <main>{children}</main>
    </div>
  );
};
