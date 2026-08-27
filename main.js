// TODO: This is the existing code that needs to be preserved
// ...

import { useButton } from 'react-aria';

function MyButton({ label }) {
  const { buttonProps } = useButton({ label });

  return <button {...buttonProps}>{label}</button>;
}