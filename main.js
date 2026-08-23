const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  errorWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
  errorCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    maxWidth: "400px",
    textAlign: "center",
  },
  errorTitle: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#333",
  },
  errorMessage: {
    color: "#666",
    marginBottom: "1.5rem",
  },
  successTitle: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#333",
  },
  successMessage: {
    color: "#666",
    marginBottom: "1.5rem",
  },
};

export function FormComponent({ hasError, isSuccess }) {
  if (hasError) {
    return (
      <section style={styles.errorWrapper}>
        <article style={styles.errorCard}>
          <h1 style={styles.errorTitle}>Error</h1>
          <p style={styles.errorMessage}>
            An error occurred. Please try again later.
          </p>
        </article>
      </section>
    );
  }

  if (isSuccess) {
    return (
      <main style={styles.wrapper}>
        <div style={styles.card}>
          <h1 style={styles.successTitle}>Success</h1>
          <p style={styles.successMessage}>
            Your form has been submitted successfully!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        <form style={styles.form}>
          <input type="text" placeholder="Username" style={styles.input} />
          <input type="password" placeholder="Password" style={styles.input} />
          <button type="submit" style={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}