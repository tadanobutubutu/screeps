import { useButton } from 'react-aria';

function MyButton({ label }) {
  const { buttonProps } = useButton({ label });

  return <button {...buttonProps}>{label}</button>;
}