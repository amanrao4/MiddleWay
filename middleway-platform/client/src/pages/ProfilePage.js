import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Map from '../components/Map';

const ProfilePage = () => {
    const { userInfo, updateUserProfile, loading, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [location, setLocation] = useState('');
    const [preferredDistance, setPreferredDistance] = useState(5);
    const [preferences, setPreferences] = useState('');
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState(false);
    const [coordinates, setCoordinates] = useState({ lat: 42.3398, lng: -71.0892 }); // Default to NEU
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        setName(userInfo.name || '');
        setEmail(userInfo.email || '');
        setLocation(userInfo.location || '');
        setPreferredDistance(userInfo.preferredDistance || 5);
        setPreferences(userInfo.preferences ? userInfo.preferences.join(', ') : '');
    }, [navigate, userInfo]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
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

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const selectLocation = (result) => {
        setLocation(result.name);
        setCoordinates(result.coordinates);
        setSearchResults([]);
        setSearchQuery('');
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const updatedUser = {
                name,
                email,
                location,
                preferredDistance,
                preferences: preferences.split(',').map(pref => pref.trim()).filter(pref => pref !== ''),
            };

            if (password) {
                updatedUser.password = password;
            }

            await updateUserProfile(updatedUser);
            setSuccess(true);
            setMessage('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');

            // Hide success message after 5 seconds
            setTimeout(() => {
                setSuccess(false);
                setMessage(null);
            }, 5000);
        } catch (error) {
            // Error is already handled in the context
        }
    };

    return (
        <Row className="justify-content-md-center my-5">
            <Col md={8}>
                <h1>User Profile</h1>
                {message && (
                    <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                    </div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}

                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password (leave blank to keep current)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="location">
                        <Form.Label>Your Location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search for your location"
                            value={searchQuery || location}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        {searchResults.length > 0 && (
                            <div className="mt-2 border rounded">
                                <div className="p-2">
                                    <h6>Search Results</h6>
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
                                </div>
                            </div>
                        )}
                    </Form.Group>

                    <div className="mb-4">
                        <Map
                            center={[coordinates.lat, coordinates.lng]}
                            markers={[
                                {
                                    lat: coordinates.lat,
                                    lng: coordinates.lng,
                                    name: 'Your Location',
                                },
                            ]}
                            zoom={15}
                        />
                    </div>

                    <Form.Group className="mb-3" controlId="preferredDistance">
                        <Form.Label>Preferred Maximum Distance (miles)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter preferred distance"
                            value={preferredDistance}
                            onChange={(e) => setPreferredDistance(Number(e.target.value))}
                            min="1"
                            max="50"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="preferences">
                        <Form.Label>Preferences (comma-separated)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="E.g., Coffee shops, Libraries, Parks"
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Enter your preferred meeting place types, separated by commas.
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

export default ProfilePage;