import '../styles/globals.css'; function MyApp({ Component, pageProps }) { return <Component {...pageProps} />; } export default MyApp; 

import { Html, Head, Main, NextScript } from 'next/document'; export default function Document() { return ( <Html lang="en"> <Head /> <body> <Main /> <NextScript /> </body> </Html> ); } 

const AccessibleSvg = ({ children, ...props }) => { return ( <svg aria-hidden="true" {...props}> {children} </svg> ); }; export { AccessibleSvg };