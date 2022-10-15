import { Layout } from "../components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import styled from "styled-components";
import Head from "next/head";

const AppStyle = styled.div`
  // background: url("/assets/background.jpg") no-repeat center center/cover;
  background: #fafafa;
  height: 100vh;
`;

function MyApp({ Component, pageProps }) {
  return (
    <AppStyle>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin />
        <link
          href='https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
          rel='stylesheet'
        />
      </Head>
      <Layout>
        <ToastContainer limit={1} />
        <Component {...pageProps} />
      </Layout>
    </AppStyle>
  );
}

export default MyApp;
