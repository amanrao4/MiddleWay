import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Card } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetups = async () => {
      try {
        if (!userInfo?.token) return;

        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/meetups`,
          config
        );

        setMeetups(data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching meetups");
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchMeetups();
    }
  }, [userInfo]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Welcome to MiddleWay</h1>
          <p>
            Find the perfect meeting spot for you and your friends at
            Northeastern University!
          </p>
        </Col>
      </Row>

      {userInfo ? (
        <>
          <Row className="mb-4">
            <Col className="text-right">
              <Button
                variant="success"
                onClick={() => navigate("/meetup")}
              >
                Create New Meetup
              </Button>
            </Col>
          </Row>

          <Row>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : meetups.length === 0 ? (
              <p>No meetups found. Create your first meetup!</p>
            ) : (
              meetups.map((meetup) => (
                <Col key={meetup._id} sm={12} md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>{meetup.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {new Date(meetup.scheduledDate).toLocaleDateString()}
                      </Card.Subtitle>
                      <Card.Text>{meetup.description}</Card.Text>
                      <Card.Text>
                        <strong>Location:</strong> {meetup.location.name}
                      </Card.Text>
                      <Link to={`/meetup/${meetup._id}`}>
                        <Button variant="outline-primary">View Details</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </>
      ) : (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Get Started</Card.Title>
                <Card.Text>
                  Sign in or create an account to start finding perfect meeting
                  spots!
                </Card.Text>
                <Link to="/login">
                  <Button variant="primary">Sign In</Button>
                </Link>
                <Link to="/register" className="ml-3">
                  <Button variant="outline-primary" className="ms-3">
                    Register
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default HomePage;
