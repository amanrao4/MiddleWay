import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
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
            // Error is already handled in the context
        }
    };

    return (
        <Row className="justify-content-md-center my-5">
            <Col xs={12} md={6}>
                <h1>Sign In</h1>
                {error && <p className="text-danger">{error}</p>}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </Form>

                <Row className="py-3">
                    <Col>
                        New User? <Link to="/register">Register</Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default LoginPage;