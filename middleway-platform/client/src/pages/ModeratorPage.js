import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ModeratorPage = () => {
  const { isModerator } = useContext(AuthContext);

  if (!isModerator) return <Navigate to="/" />;

  return (
    <div className="container mt-4">
      <h1>Moderator Panel</h1>
      <p>Welcome! Here you can review meetups and moderate content.</p>
    </div>
  );
};

export default ModeratorPage;
