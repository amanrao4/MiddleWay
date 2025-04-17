// File: NotFoundPage.js — Styled with theme, functionality untouched
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#E8F5E9', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h1 style={{ fontSize: '6rem', color: '#004D40' }}>404</h1>
            <h2 style={{ color: '#004D40' }}>Page Not Found</h2>
            <p className="mb-4" style={{ color: '#555' }}>
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            <Button
              style={{ backgroundColor: '#82B1FF', border: 'none', color: '#004D40' }}
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFoundPage;