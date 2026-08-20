export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>
          <header>
            <h1>Dashboard</h1>
          </header>
          <section>
            <h2>Statistics</h2>
            <p>{stats.summary}</p>
          </section>
          <section>
            <h2>Users</h2>
            <UserTable data={users} />
          </section>
          <nav>
            <ul>
              {links.map((link, idx) => (
                <li key={link.href}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </body>
    </html>
  );
}

export function UserTable({ data }) {
  return (
    <table>
      <caption>User List</caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user, index) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Icon({ title, children }) {
  return (
    <svg aria-label={title} focusable="false" role="presentation">
      <title>{title}</title>
      {children}
    </svg>
  );
}