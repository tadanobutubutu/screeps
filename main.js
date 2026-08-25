// Existing code before the refactor
export default function Dashboard() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (error) {
    return <main>Error: {error.message}</main>;
  }

  if (success) {
    return <main>Success: {success.message}</main>;
  }

  return <main>Welcome to the Dashboard</main>;
}

// Refactored code to remove duplicate <main> elements
export default function Dashboard() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  return (
    <div>
      {error && <section>Error: {error.message}</section>}
      {success && <section>Success: {success.message}</section>}
      <main>Welcome to the Dashboard</main>
    </div>
  );
}