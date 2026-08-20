// Fixed for REACT_036: Replaced <a href="#" with <button for in-page actions to improve accessibility

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        {/* Assuming the original link was intended to trigger an action, here is a button replacement */}
        <button id="unrotate" onClick={() => {/* Code to handle the 'rotate back' action */}}>rotate back</button>
      </body>
    </html>
  );
}