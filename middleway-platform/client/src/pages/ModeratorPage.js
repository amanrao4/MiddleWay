import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Container, Table, Spinner } from "react-bootstrap";

const ModeratorPage = () => {
  const { userInfo, isModerator } = useContext(AuthContext);
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!isModerator) return <Navigate to="/" />;

  useEffect(() => {
    const fetchMeetups = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/meetups/moderator`,
          config
        );

        setMeetups(data);
      } catch (err) {
        setError("Failed to fetch meetups");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetups();
  }, [userInfo]);

  return (
    <Container className="mt-4">
      <h2>Moderator Dashboard</h2>
      <p>Review all meetups in the system</p>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Created By</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {meetups.map((m) => (
              <tr key={m._id}>
                <td>{m.title}</td>
                <td>{new Date(m.scheduledDate).toLocaleString()}</td>
                <td>{m.creator?.name || "N/A"}</td>
                <td>{m.location?.name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ModeratorPage;
