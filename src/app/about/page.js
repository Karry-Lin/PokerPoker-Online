"use client";

import {Card, Col, Container, Row} from 'react-bootstrap';
import styles from './Page.module.css';
import NavBar from "../components/navBar";

export default function Page() {
  return (
    <>
      <NavBar/>
      <Container className={styles.container}>
        <Row className="justify-content-center">
          <Col md={8}>
            <h1 className="text-center mb-4 display-4">About</h1>
            <p className="text-center mb-5 fs-5 text-muted">
              This website is an online multiplayer card game that offers three games: "Chinese Poker," "Big Two," and
              "Pick Up Red Dots." Players can create rooms and enjoy exciting gameplay with their pals, experiencing the
              joy of friendship and challenge. <br/>This website is built using the following technologies:
            </p>

            <Row className="mb-4 text-center">
              <Col md={4} className="mb-4">
                <Card className={`shadow-sm border-0 h-100 ${styles.hoverCard}`}>
                  <Card.Body>
                    <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
                      <img src="/next_icon.jpg" alt="next_icon" width={50} height={50}/>
                    </a>
                    <Card.Title className="mt-3 fs-4">Next.js</Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4} className="mb-4">
                <Card className={`shadow-sm border-0 h-100 ${styles.hoverCard}`}>
                  <Card.Body>
                    <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                      <img src="/react_icon.png" alt="react_icon" width={50} height={50}/>
                    </a>
                    <Card.Title className="mt-3 fs-4">React</Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4} className="mb-4">
                <Card className={`shadow-sm border-0 h-100 ${styles.hoverCard}`}>
                  <Card.Body>
                    <a href="https://react-bootstrap.github.io" target="_blank" rel="noopener noreferrer">
                      <img src="/reactBootstrap_icon.svg" alt="reactBootstrap_icon" width={50} height={50}/>
                    </a>
                    <Card.Title className="mt-3 fs-4">React-Bootstrap</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4 text-center">
              <Col md={4} className="mb-4">
                <Card className={`shadow-sm border-0 h-100 ${styles.hoverCard}`}>
                  <Card.Body>
                    <a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer">
                      <img src="/firebase_icon.png" alt="firebase_icon" width={50} height={50}/>
                    </a>
                    <Card.Title className="mt-3 fs-4">Firebase</Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4} className="mb-4">
                <Card className={`shadow-sm border-0 h-100 ${styles.hoverCard}`}>
                  <Card.Body>
                    <a href="https://zustand-demo.pmnd.rs/" target="_blank" rel="noopener noreferrer">
                      <img src="/zustand_icon.svg" alt="zustand_icon" width={50} height={50}/>
                    </a>
                    <Card.Title className="mt-3 fs-4">Zustand</Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4} className="mb-4">
                <Card className={`shadow-sm border-0 h-100 ${styles.hoverCard}`}>
                  <Card.Body>
                    <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">
                      <img src="/freepik_icon.png" alt="freepik_icon" width={50} height={50}/>
                    </a>
                    <Card.Title className="mt-3 fs-4">Freepik</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="text-center mt-5">
              <h5>
                Authors:{" "}
                <a href="https://github.com/Karry-Lin" target="_blank" rel="noopener noreferrer" className="me-1">
                  Karry
                </a>
                ,
                <a href="https://github.com/howard522" target="_blank" rel="noopener noreferrer" className="ms-2">
                  Howard
                </a>
              </h5>
            </div>

          </Col>
        </Row>
      </Container>
    </>
  );
};

