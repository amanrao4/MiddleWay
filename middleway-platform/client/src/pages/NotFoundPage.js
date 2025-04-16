import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Row className="text-center my-5">
            <Col>
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>We can't seem to find the page you're looking for.</p>
                <Link to="/">
                    <Button variant="primary">Go Back Home</Button>
                </Link>
            </Col>
        </Row>
    );
};

export default NotFoundPage;