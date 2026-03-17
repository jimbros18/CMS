import React from "react";
import './styles/content.css';

 const Clients = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', department: 'Marketing' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive', department: 'Sales' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active', department: 'HR' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Developer', status: 'Active', department: 'Engineering' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Manager', status: 'Active', department: 'Marketing' },
    { id: 7, name: 'Ethan Hunt', email: 'ethan@example.com', role: 'User', status: 'Pending', department: 'Operations' },
    { id: 8, name: 'Fiona Green', email: 'fiona@example.com', role: 'Admin', status: 'Active', department: 'Engineering' },
  ];

function Content({ activeKey }) {
  if (activeKey === "clients") {
    return (
    <ul>
        {Clients.map((client) => (
          <li key={client.id}>
            {client.name} — {client.email} — {client.role}
          </li>
        ))}
    </ul>
    );
    }
  return <h2>Other Page</h2>;
}


export default Content;