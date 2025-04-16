import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className="text-center py-3">
                        <p>MiddleWay &copy; {new Date().getFullYear()} - Find the perfect meeting spot</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;