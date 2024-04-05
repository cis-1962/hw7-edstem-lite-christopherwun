import React from 'react';
import '../app.css';

export default function Navbar({
  user,
  logout,
  toLogin,
}: {
  user: string | null;
  logout: () => void;
  toLogin: () => void;
}) {
  return (
    <div className="navbar">
      <h1 className="title">Campuswire Lite</h1>
      {user ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <p>Hi, {user}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={toLogin}>Login</button>
      )}
    </div>
  );
}
