export default function Component() {
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState(null);
  
  const fetchData = async () => {
    try {
      setHasError(false);
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <section>
        <div className="error-container">
          <h1>Something went wrong</h1>
          <p>Unable to load data. Please try again later.</p>
          <button onClick={fetchData}>Retry</button>
        </div>
      </section>
    );
  }

  return (
    <main>
      <div className="content">
        <h1>Data Overview</h1>
        {data ? (
          <div>{data.content}</div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </main>
  );
}