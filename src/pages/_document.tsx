import { Html, Head, Main, NextScript } from "next/document";
import {
  HeaderNavigationTemplates,
  HeaderTemplates,
} from "../components/templates";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,600;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>
      <body className="bg-[#f3f3f3] w-screen overflow-x-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
