// File: MeetupFormPage.js — Styling applied (light green background, accent buttons)
import React, { useState, useContext } from "react";
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

const restaurantOptions = [
  "Central Bites Cafe",
  "Flour Bakery",
  "Tatte Bakery",
  "City Grille",
  "Sunset Diner",
  "Back Bay Bites",
  "Common Grounds Cafe"
];

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
    if (!query.trim()) return setSuggestions([]);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/map/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.map(item => ({
        name: item.display_name,
        coordinates: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
      })));
    } catch (err) {
      console.error("❌ Failed to fetch suggestions", err);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

  const handleSelectAddress = (index, suggestion) => {
    if (index === 1) {
      setAddress1(suggestion.name);
      setCoords1(suggestion.coordinates);
      setAddress1Suggestions([]);
    } else {
      setAddress2(suggestion.name);
      setCoords2(suggestion.coordinates);
      setAddress2Suggestions([]);
    }
  };

  const findMidpoint = () => {
    if (!coords1 || !coords2) return alert("Please select both addresses first.");
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
      const randomRestaurant = restaurantOptions[Math.floor(Math.random() * restaurantOptions.length)];
      await axios.post(
        `${process.env.REACT_APP_API_URL}/meetups`,
        {
          title,
          description,
          location: { ...location, restaurant: randomRestaurant },
          scheduledDate,
          participants,
        },
        config
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#E8F5E9', minHeight: '100vh', padding: '2rem' }}>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm border-0" style={{ backgroundColor: '#fff' }}>
            <h1 style={{ color: '#004D40' }}>Create a Meetup</h1>
            {error && <p className="text-danger">{error}</p>}
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label style={{ color: '#004D40' }}>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter meetup title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label style={{ color: '#004D40' }}>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="scheduledDate">
                <Form.Label style={{ color: '#004D40' }}>Date & Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
              </Form.Group>
              {[participant1, participant2].map((val, i) => (
                <Form.Group className="mb-3" key={i}>
                  <Form.Label style={{ color: '#004D40' }}>{`Participant ${i + 1} Email`}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={`user${i + 1}@example.com`}
                    value={val}
                    onChange={(e) => (i === 0 ? setParticipant1(e.target.value) : setParticipant2(e.target.value))}
                    required
                  />
                </Form.Group>
              ))}
              {[address1, address2].map((address, i) => (
                <Form.Group className="mb-3" key={i}>
                  <Form.Label style={{ color: '#004D40' }}>{`Address for User ${i + 1}`}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter address for user ${i + 1}`}
                    value={address}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (i === 0) setAddress1(val);
                      else setAddress2(val);
                      if (val.length >= 10) {
                        debouncedFetchSuggestions(val, i === 0 ? setAddress1Suggestions : setAddress2Suggestions);
                      } else {
                        i === 0 ? setAddress1Suggestions([]) : setAddress2Suggestions([]);
                      }
                    }}
                  />
                  {(i === 0 ? address1Suggestions : address2Suggestions).length > 0 && (
                    <Card className="mt-1">
                      <Card.Body>
                        <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 0 }}>
                          {(i === 0 ? address1Suggestions : address2Suggestions).map((sug, idx) => (
                            <li
                              key={idx}
                              style={{ cursor: "pointer", padding: "6px 0" }}
                              onClick={() => (i === 0 ? handleSelectAddress(1, sug) : handleSelectAddress(2, sug))}
                            >
                              {sug.name}
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  )}
                </Form.Group>
              ))}
              <Button
                variant="info"
                className="mb-3"
                onClick={findMidpoint}
                style={{ backgroundColor: '#82B1FF', border: 'none', color: '#004D40' }}
              >
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
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                style={{ backgroundColor: '#82B1FF', border: 'none', color: '#004D40' }}
              >
                {loading ? "Creating..." : "Create Meetup"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MeetupFormPage;