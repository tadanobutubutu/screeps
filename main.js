import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* Add a button for the 'rotate back' action */}
        <button id="unrotate" onClick={() => {/* Rotate back logic here */}}>rotate back</button>
      </body>
    </Html>
  );
}