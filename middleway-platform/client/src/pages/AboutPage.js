import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
    return (
        <Row className="my-5">
            <Col>
                <h1>About MiddleWay</h1>
                <p className="lead">
                    Helping Northeastern University students find the perfect meeting spot!
                </p>

                <Card className="my-4">
                    <Card.Body>
                        <h2>Our Mission</h2>
                        <p>
                            MiddleWay is designed to help Northeastern University students find convenient
                            meeting locations that are equidistant from all participants. Whether you're
                            planning a study session, a group project meeting, or just hanging out with
                            friends, MiddleWay makes it easy to find a spot that's fair for everyone.
                        </p>
                    </Card.Body>
                </Card>

                <Card className="my-4">
                    <Card.Body>
                        <h2>How It Works</h2>
                        <ol>
                            <li>Create an account and set your location preferences</li>
                            <li>Start a new meetup and invite your friends</li>
                            <li>MiddleWay will suggest locations that are convenient for everyone</li>
                            <li>Select a location and confirm your meetup!</li>
                        </ol>
                    </Card.Body>
                </Card>

                <Card className="my-4">
                    <Card.Body>
                        <h2>Our Team</h2>
                        <p>
                            MiddleWay was developed by a team of Northeastern University students
                            passionate about using technology to solve everyday problems on campus.
                        </p>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default AboutPage;