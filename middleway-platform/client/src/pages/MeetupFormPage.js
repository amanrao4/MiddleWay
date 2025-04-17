import React, { useState, useContext, useRef } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Map from "../components/Map";

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const MeetupFormPage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [participant1, setParticipant1] = useState("");
  const [participant2, setParticipant2] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address1Suggestions, setAddress1Suggestions] = useState([]);
  const [address2Suggestions, setAddress2Suggestions] = useState([]);
  const [coords1, setCoords1] = useState(null);
  const [coords2, setCoords2] = useState(null);

  const [location, setLocation] = useState({
    name: "",
    address: "",
    coordinates: { lat: 42.3398, lng: -71.0892 },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const url = `${process.env.REACT_APP_API_URL}/map/search?q=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const suggestions = data.map((item) => ({
        name: item.display_name,
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        },
      }));

      setSuggestions(suggestions);
    } catch (err) {
      console.error("❌ Failed to fetch suggestions", err);
      setSuggestions([]); // Optional: clear if it fails
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

  const handleSelectAddress1 = (suggestion) => {
    setAddress1(suggestion.name);
    setCoords1(suggestion.coordinates);
    setAddress1Suggestions([]);
  };

  const handleSelectAddress2 = (suggestion) => {
    setAddress2(suggestion.name);
    setCoords2(suggestion.coordinates);
    setAddress2Suggestions([]);
  };

  const findMidpoint = () => {
    if (!coords1 || !coords2) {
      alert("Please select both addresses from the dropdown first.");
      return;
    }

    const midpoint = {
      lat: (coords1.lat + coords2.lat) / 2,
      lng: (coords1.lng + coords2.lng) / 2,
    };

    setLocation({
      name: "Suggested Midpoint",
      address: `${address1} ↔ ${address2}`,
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

          <Form.Group className="mb-3">
            <Form.Label>Address for User 1</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address for user 1"
              value={address1}
              onChange={(e) => {
                const val = e.target.value;
                setAddress1(val);
                if (val.length >= 10) {
                  debouncedFetchSuggestions(val, setAddress1Suggestions);
                } else {
                  setAddress1Suggestions([]);
                }
              }}
            />
            {address1Suggestions.length > 0 && (
              <Card className="mt-1">
                <Card.Body>
                  <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 0 }}>
                    {address1Suggestions.map((sug, idx) => (
                      <li
                        key={idx}
                        style={{ cursor: "pointer", padding: "6px 0" }}
                        onClick={() => handleSelectAddress1(sug)}
                      >
                        {sug.name}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address for User 2</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address for user 2"
              value={address2}
              onChange={(e) => {
                const val = e.target.value;
                setAddress2(val);
                if (val.length >= 10) {
                  debouncedFetchSuggestions(val, setAddress2Suggestions);
                } else {
                  setAddress2Suggestions([]);
                }
              }}
            />
            {address2Suggestions.length > 0 && (
              <Card className="mt-1">
                <Card.Body>
                  <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 0 }}>
                    {address2Suggestions.map((sug, idx) => (
                      <li
                        key={idx}
                        style={{ cursor: "pointer", padding: "6px 0" }}
                        onClick={() => handleSelectAddress2(sug)}
                      >
                        {sug.name}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            )}
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