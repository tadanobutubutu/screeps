import React from 'react';

const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.role}</td>
            <td>{item.status}</td>
            <td>{item.actions}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

export function DataView({ data, isLoading, error }) {
  return (
    <main>
      {isLoading && (
        <section aria-busy="true" aria-label="Loading content">
          <p>Loading...</p>
        </section>
      )}

      {error && (
        <section role="alert" aria-label="Error message">
          <p>Error: {error}</p>
        </section>
      )}

      {!isLoading && !error && data && (
        <section aria-label="Main content">
          <h1>{data.title}</h1>
          <p>{data.description}</p>
        </section>
      )}
    </main>
  );
}