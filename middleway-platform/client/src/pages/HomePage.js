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
  const [expandedMeetupId, setExpandedMeetupId] = useState(null);

  const restaurantOptions = [
    "Central Bites Cafe",
    "Flour Bakery",
    "Tatte Bakery",
    "City Grille",
    "Sunset Diner",
    "Back Bay Bites",
    "Common Grounds Cafe"
  ];
  

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
              <Button variant="success" onClick={() => navigate("/meetup")}>
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
              <>
                {meetups.map((meetup) => {
                  const isExpanded = expandedMeetupId === meetup._id;
                  console.log("Participants:", meetup.participants);
                  const randomRestaurant =
    restaurantOptions[Math.floor(Math.random() * restaurantOptions.length)];

                  return (
                    <Col
                      key={meetup._id}
                      sm={12}
                      md={6}
                      lg={4}
                      className="mb-4"
                    >
                      <Card>
                        <Card.Body>
                          <Card.Title>{meetup.title}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            {new Date(meetup.scheduledDate).toLocaleString()}
                          </Card.Subtitle>
                          <Card.Text>
            <strong>Suggested Restaurant:</strong> {randomRestaurant}
          </Card.Text>
                          <Card.Text>
                            <strong>Location:</strong> {meetup.location.name}
                          </Card.Text>

                          <Button
                            variant="outline-primary"
                            onClick={() =>
                              setExpandedMeetupId(
                                isExpanded ? null : meetup._id
                              )
                            }
                          >
                            {isExpanded ? "Hide Details" : "View Details"}
                          </Button>

                          {isExpanded && (
                            <div className="mt-3">
                              <Card.Text>
                                <strong>Description:</strong>{" "}
                                {meetup.description}
                              </Card.Text>
                              <Card.Text>
                                <strong>Address:</strong>{" "}
                                {meetup.location.address}
                              </Card.Text>
                              <Card.Text>
                                <strong>Coordinates:</strong>{" "}
                                {meetup.location.coordinates.lat.toFixed(4)},{" "}
                                {meetup.location.coordinates.lng.toFixed(4)}
                              </Card.Text>
                              <Card.Text>
                                <strong>Participants:</strong>{" "}
                                {meetup.participants.length > 0
                                  ? meetup.participants
                                      .map((p, i) => {
                                        const displayName =
                                          p.user?.name ||
                                          p.user?.email ||
                                          "Unnamed User";
                                        return `${displayName}`;
                                      })
                                      .join(", ")
                                  : "None"}
                              </Card.Text>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </>
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
