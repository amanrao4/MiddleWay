import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();
        console.log({ name, email, message });
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');

        setTimeout(() => {
            setSubmitted(false);
        }, 5000);
    };

    return (
        <div style={{ backgroundColor: '#E8F5E9', minHeight: '100vh', padding: '2rem' }}>
            <Row className="my-4">
                <Col md={6}>
                    <h1 style={{ color: '#004D40' }}>Contact Us</h1>
                    <p className="lead" style={{ color: '#333' }}>
                        Have questions or feedback? We'd love to hear from you!
                    </p>

                    {submitted && (
                        <Alert variant="success">
                            Thank you for your message! We'll get back to you soon.
                        </Alert>
                    )}

                    <Card className="p-4 shadow-sm border-0" style={{ backgroundColor: '#ffffff' }}>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label style={{ color: '#004D40' }}>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label style={{ color: '#004D40' }}>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="message">
                                <Form.Label style={{ color: '#004D40' }}>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Enter your message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" style={{ backgroundColor: '#82B1FF', border: 'none', color: '#004D40' }}>
                                Send Message
                            </Button>
                        </Form>
                    </Card>
                </Col>

                <Col md={6} className="mt-4 mt-md-0">
                    <Card className="p-4 shadow-sm border-0" style={{ backgroundColor: '#ffffff', color: '#004D40' }}>
                        <Card.Body>
                            <h2 className="h5" style={{ color: '#82B1FF' }}>Visit Us</h2>
                            <p className="mb-4">
                                Northeastern University<br />
                                360 Huntington Ave<br />
                                Boston, MA 02115
                            </p>

                            <h2 className="h5" style={{ color: '#82B1FF' }}>Email</h2>
                            <p>
                                <a href="mailto:contact@middleway.northeastern.edu" className="text-decoration-none" style={{ color: '#004D40' }}>
                                    contact@middleway.northeastern.edu
                                </a>
                            </p>

                            <h2 className="h5" style={{ color: '#82B1FF' }}>Social Media</h2>
                            <p>
                                <a href="#" className="me-3 text-decoration-none" style={{ color: '#004D40' }}>Facebook</a>
                                <a href="#" className="me-3 text-decoration-none" style={{ color: '#004D40' }}>Twitter</a>
                                <a href="#" className="me-3 text-decoration-none" style={{ color: '#004D40' }}>Instagram</a>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ContactPage;
