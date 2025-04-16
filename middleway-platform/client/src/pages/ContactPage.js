import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();
        // In a real app, we would send this data to a backend
        console.log({ name, email, message });
        setSubmitted(true);
        // Reset form
        setName('');
        setEmail('');
        setMessage('');

        // Hide success message after 5 seconds
        setTimeout(() => {
            setSubmitted(false);
        }, 5000);
    };

    return (
        <Row className="my-5">
            <Col md={6}>
                <h1>Contact Us</h1>
                <p className="lead">
                    Have questions or feedback? We'd love to hear from you!
                </p>

                {submitted && (
                    <Alert variant="success">
                        Thank you for your message! We'll get back to you soon.
                    </Alert>
                )}

                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="message">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Enter your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Send Message
                    </Button>
                </Form>
            </Col>

            <Col md={6}>
                <Card className="mt-4 mt-md-0">
                    <Card.Body>
                        <h2>Visit Us</h2>
                        <p>
                            Northeastern University<br />
                            360 Huntington Ave<br />
                            Boston, MA 02115
                        </p>

                        <h2>Email</h2>
                        <p>
                            <a href="mailto:contact@middleway.northeastern.edu">
                                contact@middleway.northeastern.edu
                            </a>
                        </p>

                        <h2>Social Media</h2>
                        <p>
                            <a href="#" className="me-3">Facebook</a>
                            <a href="#" className="me-3">Twitter</a>
                            <a href="#" className="me-3">Instagram</a>
                        </p>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ContactPage;