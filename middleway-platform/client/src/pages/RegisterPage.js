import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
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
            // Error is already handled in the context
        }
    };

    return (
        <Row className="justify-content-md-center my-5">
            <Col xs={12} md={6}>
                <h1>Register</h1>
                {message && <p className="text-danger">{message}</p>}
                {error && <p className="text-danger">{error}</p>}

                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

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

                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </Form>

                <Row className="py-3">
                    <Col>
                        Already have an account? <Link to="/login">Sign In</Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default RegisterPage;