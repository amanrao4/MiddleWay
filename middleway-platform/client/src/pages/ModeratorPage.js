// File: ModeratorPage.js — Styled with theme, original functionality preserved
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Table, Spinner, Container } from 'react-bootstrap';

const ModeratorPage = () => {
  const { userInfo, isModerator } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!isModerator) return <Navigate to="/" />;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/moderator/reports`,
          config
        );

        setReports(data);
      } catch (err) {
        setError("Failed to fetch reports");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userInfo.token]);

  return (
    <div style={{ backgroundColor: '#E8F5E9', minHeight: '100vh', padding: '2rem' }}>
      <Container>
        <Card className="p-4 shadow-sm border-0" style={{ backgroundColor: '#fff' }}>
          <h2 style={{ color: '#004D40' }}>Moderator Dashboard</h2>
          <p className="text-muted">Review user reports and flagged content</p>

          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <Table bordered hover responsive>
              <thead style={{ backgroundColor: '#004D40', color: '#fff' }}>
                <tr>
                  <th>ID</th>
                  <th>Reporter</th>
                  <th>Report</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id}>
                    <td>{report._id}</td>
                    <td>{report.reporter}</td>
                    <td>{report.content}</td>
                    <td>{new Date(report.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default ModeratorPage;