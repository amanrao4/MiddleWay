import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Table, Button, Container, Spinner } from "react-bootstrap";

const AdminPage = () => {
  const { userInfo, isAdmin } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(null);
  const [error, setError] = useState(null);

  if (!isAdmin) return <Navigate to="/" />;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/admin/all-users`,
          config
        );
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userInfo.token]);

  const promoteToModerator = async (userId) => {
    try {
      setPromoting(userId);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/promote/${userId}`,
        { role: "moderator" },
        config
      );

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, role: "moderator" } : u
        )
      );
    } catch (err) {
      console.error("Promotion failed:", err);
      alert("Failed to promote user.");
    } finally {
      setPromoting(null);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>
      <p>Manage users and their roles</p>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === "regular" ? (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => promoteToModerator(user._id)}
                      disabled={promoting === user._id}
                    >
                      {promoting === user._id ? "Promoting..." : "Promote to Moderator"}
                    </Button>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminPage;
