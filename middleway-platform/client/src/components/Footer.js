import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#004D40' }}>
      <Container>
        <Row>
          <Col className="text-center py-4">
            <small style={{ color: '#E8F5E9' }}>
              &copy; {new Date().getFullYear()} MiddleWay &mdash; Helping you find the perfect meeting spot.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
