import React, { useState, useContext } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Map from "../components/Map";

const MeetupFormPage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [participant1, setParticipant1] = useState("");
  const [participant2, setParticipant2] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const [location, setLocation] = useState({
    name: "",
    address: "",
    coordinates: { lat: 42.3398, lng: -71.0892 }, // Default to NEU
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const geocodeLocation = async (address) => {
    const encoded = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  };

  const findMidpoint = async () => {
    if (!address1 || !address2) {
      alert("Please enter both addresses");
      return;
    }

    const location1 = await geocodeLocation(address1);
    const location2 = await geocodeLocation(address2);

    if (!location1 || !location2) {
      alert("One or both addresses could not be located. Please check.");
      return;
    }

    const midpoint = {
      lat: (location1.lat + location2.lat) / 2,
      lng: (location1.lng + location2.lng) / 2,
    };

    setLocation({
      name: "Suggested Midpoint",
      address: "Midpoint between provided addresses",
      coordinates: midpoint,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const participants = [participant1.trim(), participant2.trim()].filter(Boolean);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/meetups`,
        {
          title,
          description,
          location,
          scheduledDate,
          participants,
        },
        config
      );

      console.log("✅ Meetup created:", data);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-md-center my-5">
      <Col md={8}>
        <h1>Create a Meetup</h1>
        {error && <p className="text-danger">{error}</p>}

        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter meetup title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="scheduledDate">
            <Form.Label>Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
            />
          </Form.Group>

          {/* Separate participant emails */}
          <Form.Group className="mb-3">
            <Form.Label>Participant 1 Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="firstuser@example.com"
              value={participant1}
              onChange={(e) => setParticipant1(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Participant 2 Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="seconduser@example.com"
              value={participant2}
              onChange={(e) => setParticipant2(e.target.value)}
              required
            />
          </Form.Group>

          {/* Manual address input */}
          <Form.Group className="mb-3">
            <Form.Label>Address for User 1</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address for user 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address for User 2</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address for user 2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </Form.Group>

          <Button variant="info" className="mb-3" onClick={findMidpoint}>
            Find Midpoint
          </Button>

         

          <div className="mb-4">
            <Map
              key={`${location.coordinates.lat}-${location.coordinates.lng}`}
              center={[location.coordinates.lat, location.coordinates.lng]}
              markers={[
                {
                  lat: location.coordinates.lat,
                  lng: location.coordinates.lng,
                  name: location.name || "Suggested Location",
                },
              ]}
              zoom={15}
            />
          </div>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Meetup"}
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default MeetupFormPage;
