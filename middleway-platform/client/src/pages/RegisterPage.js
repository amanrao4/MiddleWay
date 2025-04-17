import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const { register, userInfo, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/');
    } catch (error) {
      // Error handled in context
    }
  };

  return (
    <div style={{ backgroundColor: '#E8F5E9', minHeight: '100vh', padding: '2rem' }}>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card className="shadow-sm border-0 p-4" style={{ backgroundColor: '#fff' }}>
            <h1 style={{ color: '#004D40' }}>Register</h1>
            {message && <p className="text-danger">{message}</p>}
            {error && <p className="text-danger">{error}</p>}

            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label style={{ color: '#004D40' }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label style={{ color: '#004D40' }}>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label style={{ color: '#004D40' }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label style={{ color: '#004D40' }}>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading} style={{ backgroundColor: '#82B1FF', border: 'none', color: '#004D40' }}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Form>

            <Row className="py-3">
              <Col style={{ color: '#004D40' }}>
                Already have an account? <Link to="/login">Sign In</Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
