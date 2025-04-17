import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
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
  const [coordinates, setCoordinates] = useState({ lat: 42.3398, lng: -71.0892 });
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

    if (userInfo.location?.trim()) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(userInfo.location)}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            setCoordinates({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          }
        })
        .catch(console.error);
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.map(item => ({
          name: item.display_name,
          coordinates: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
        })));
      } catch (err) {
        console.error('Location search error:', err);
      }
    }, 500);

    return () => clearTimeout(timeout);
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

    const updatedUser = {
      name,
      email,
      location,
      preferredDistance,
      preferences: preferences.split(',').map(p => p.trim()).filter(p => p),
      ...(password && { password }),
    };

    try {
      await updateUserProfile(updatedUser);
      setSuccess(true);
      setMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess(false);
        setMessage(null);
      }, 5000);
    } catch (err) {
      // handled by context
    }
  };

  return (
    <div style={{ backgroundColor: '#E8F5E9', minHeight: '100vh', padding: '2rem' }}>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm border-0" style={{ backgroundColor: '#fff' }}>
            <h1 style={{ color: '#004D40' }}>User Profile</h1>
            {message && (
              <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`}>{message}</div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label style={{ color: '#004D40' }}>Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label style={{ color: '#004D40' }}>Email Address</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label style={{ color: '#004D40' }}>Password</Form.Label>
                <Form.Control type="password" placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label style={{ color: '#004D40' }}>Confirm Password</Form.Label>
                <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="location">
                <Form.Label style={{ color: '#004D40' }}>Your Location</Form.Label>
                <Form.Control type="text" value={searchQuery || location} onChange={(e) => setSearchQuery(e.target.value)} />

                {searchResults.length > 0 && (
                  <div className="mt-2 border rounded">
                    <div className="p-2">
                      <h6 style={{ color: '#004D40' }}>Search Results</h6>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {searchResults.map((result, i) => (
                          <div key={i} className="py-2 border-bottom" style={{ cursor: 'pointer' }} onClick={() => selectLocation(result)}>
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
                  markers={[{ lat: coordinates.lat, lng: coordinates.lng, name: 'Your Location' }]}
                  zoom={15}
                />
              </div>

              <Form.Group className="mb-3" controlId="preferredDistance">
                <Form.Label style={{ color: '#004D40' }}>Preferred Distance (miles)</Form.Label>
                <Form.Control type="number" value={preferredDistance} min="1" max="50" onChange={(e) => setPreferredDistance(Number(e.target.value))} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="preferences">
                <Form.Label style={{ color: '#004D40' }}>Preferences (comma-separated)</Form.Label>
                <Form.Control type="text" value={preferences} onChange={(e) => setPreferences(e.target.value)} />
                <Form.Text className="text-muted">
                  E.g., Coffee shops, Libraries, Parks
                </Form.Text>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading} style={{ backgroundColor: '#82B1FF', border: 'none', color: '#004D40' }}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;