"use client";
import { useState } from "react";
import { Form, Card, Container, Row, Col } from "react-bootstrap";
import styles from './Page.module.css'; // Keep your custom CSS for background image

export default function Page() {
  const rooms = [
    {
      name: "room1",
      state: "Ready",
      id: 1,
      gametype: "13poker",
      max_player: 4,
      password: null,
    },
    {
      name: "room2",
      state: "unReady",
      id: 2,
      gametype: "big2",
      max_player: 4,
      password: "123456",
    },
    {
      name: "room3",
      state: "Ready",
      id: 3,
      gametype: "pickred",
      max_player: 4,
      password: "122333",
    },
    {
      name: "room4",
      state: "unReady",
      id: 4,
      gametype: "13poker",
      max_player: 4,
      password: null,
    },
  ];

  const [selectedGameType, setSelectedGameType] = useState("all");

  // Filter rooms based on selected game type
  const filteredRooms =
    selectedGameType === "all"
      ? rooms
      : rooms.filter((room) => room.gametype === selectedGameType);

  // Extract unique game types for the select options
  const gameTypes = ["all", ...new Set(rooms.map((room) => room.gametype))];

  return (
    <Container fluid className={styles.page}>
      <Row>
        <Col xs={12} md={3} className="p-4">
          <Form.Group>
            <Form.Label>Select Game Type</Form.Label>
            <Form.Control
              as="select"
              value={selectedGameType}
              onChange={(e) => setSelectedGameType(e.target.value)}
              className="mb-3"
            >
              {gameTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "Select All" : type}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Optional: You can add a search bar below */}
          {/* <Form.Control type="text" placeholder="Search room..." className="mb-3" /> */}
        </Col>

        <Col xs={12} md={7} className="p-4">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="mb-3">
              <Card.Body>
                <Card.Title>{room.name}</Card.Title>
                <Card.Text>
                  <strong>Game Type:</strong> {room.gametype} <br />
                  <strong>Status:</strong> {room.state} <br />
                  <strong>Max Players:</strong> {room.max_player} <br />
                  <strong>Password:</strong> {room.password ? room.password : "No password"}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
