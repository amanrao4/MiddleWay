import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, userInfo, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      // Already handled in context
    }
  };

  return (
    <div style={{ backgroundColor: '#E8F5E9', minHeight: '100vh', padding: '2rem' }}>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card className="shadow-sm border-0 p-4" style={{ backgroundColor: '#fff' }}>
            <h1 style={{ color: '#004D40' }}>Sign In</h1>
            {error && <p className="text-danger">{error}</p>}
            <Form onSubmit={submitHandler}>
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

              <Button variant="primary" type="submit" disabled={loading} style={{ backgroundColor: '#82B1FF', border: 'none', color: '#004D40' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>

            <Row className="py-3">
              <Col style={{ color: '#004D40' }}>
                New User? <Link to="/register">Register</Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;