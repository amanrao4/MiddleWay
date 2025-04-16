import React, { useState, useContext, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Map from '../components/Map';

const MeetupFormPage = () => {
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [participants, setParticipants] = useState('');
    const [location, setLocation] = useState({
        name: '',
        address: '',
        coordinates: { lat: 42.3398, lng: -71.0892 }, // Default to NEU
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    // Handle location search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                // We're using OpenStreetMap's Nominatim API for geocoding
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
                );
                const data = await response.json();

                setSearchResults(
                    data.map((item) => ({
                        name: item.display_name,
                        coordinates: {
                            lat: parseFloat(item.lat),
                            lng: parseFloat(item.lon),
                        },
                    }))
                );
            } catch (error) {
                console.error('Error searching locations:', error);
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const selectLocation = (result) => {
        setLocation({
            name: result.name,
            address: result.name,
            coordinates: result.coordinates,
        });
        setSearchResults([]);
        setSearchQuery('');
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            // Parse participant emails into an array
            const participantList = participants
                .split(',')
                .map((email) => email.trim())
                .filter((email) => email !== '');

            await axios.post(
                `${process.env.REACT_APP_API_URL}/meetups`,
                {
                    title,
                    description,
                    location,
                    scheduledDate,
                    participants: participantList,
                },
                config
            );

            setLoading(false);
            navigate('/');
        } catch (error) {
            setLoading(false);
            setError(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
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
                            placeholder="Enter meetup description"
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

                    <Form.Group className="mb-3" controlId="participants">
                        <Form.Label>Participants (comma-separated emails)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="friend1@northeastern.edu, friend2@northeastern.edu"
                            value={participants}
                            onChange={(e) => setParticipants(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="location">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search for a location"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        {searchResults.length > 0 && (
                            <Card className="mt-2">
                                <Card.Body>
                                    <Card.Title>Search Results</Card.Title>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {searchResults.map((result, index) => (
                                            <div
                                                key={index}
                                                className="py-2 border-bottom"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => selectLocation(result)}
                                            >
                                                {result.name}
                                            </div>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>
                        )}

                        {location.name && (
                            <p className="mt-2">
                                <strong>Selected:</strong> {location.name}
                            </p>
                        )}
                    </Form.Group>

                    <div className="mb-4">
                        <Map
                            center={[location.coordinates.lat, location.coordinates.lng]}
                            markers={[
                                {
                                    lat: location.coordinates.lat,
                                    lng: location.coordinates.lng,
                                    name: location.name || 'Selected Location',
                                },
                            ]}
                            zoom={15}
                        />
                    </div>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Meetup'}
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

export default MeetupFormPage;