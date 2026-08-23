tsx
export default function Dashboard() {
  const [data, setData] = useState(initialState);
  const { isLoading, error } = data;

  // Error handling and data fetching logic goes here

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <p>Error: {error.message}</p>
      </section>
    );
  }

  return (
    <section>
      {/* Other success state content goes here */}
    </section>
  );
}