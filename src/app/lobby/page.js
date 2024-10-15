"use client";
import { useState } from "react";
import { Form, Card, Container, Row, Col, Button } from "react-bootstrap";
import { FaLock } from "react-icons/fa"; // Import lock icon from react-icons
import styles from './Page.module.css'; // Custom CSS for background image

export default function Page() {
  const rooms = [
    {
      name: "room1",
      state: "Ready",
      id: 1,
      gametype: "13poker",
      current_player: 3,
      max_player: 4,
      password: null,
    },
    {
      name: "room2",
      state: "unReady",
      id: 2,
      gametype: "big2",
      current_player: 4,
      max_player: 4,
      password: "123456",
    },
    {
      name: "room3",
      state: "Ready",
      id: 3,
      gametype: "pickred",
      current_player: 2,
      max_player: 4,
      password: "122333",
    },
    {
      name: "room4",
      state: "unReady",
      id: 4,
      gametype: "13poker",
      current_player: 3,
      max_player: 4,
      password: null,
    },
    {
      name: "room5",
      state: "unReady",
      id: 5,
      gametype: "13poker",
      current_player: 1,
      max_player: 4,
      password: null,
    },
    {
      name: "room6",
      state: "unReady",
      id: 6,
      gametype: "13poker",
      current_player: 1,
      max_player: 4,
      password: null,
    },
    {
      name: "room7",
      state: "unReady",
      id: 7,
      gametype: "13poker",
      current_player: 2,
      max_player: 4,
      password: null,
    },
    {
      name: "room8",
      state: "unReady",
      id: 8,
      gametype: "13poker",
      current_player: 1,
      max_player: 4,
      password: null,
    },
    {
      name: "room9",
      state: "unReady",
      id: 9,
      gametype: "13poker",
      current_player: 1,
      max_player: 4,
      password: null,
    },
    {
      name: "room10",
      state: "unReady",
      id: 10,
      gametype: "13poker",
      current_player: 1,
      max_player: 4,
      password: null,
    },
    {
      name: "room11",
      state: "unReady",
      id: 11,
      gametype: "13poker",
      current_player: 1,
      max_player: 4,
      password: null,
    },
    {
      name: "room12",
      state: "unReady",
      id: 12,
      gametype: "13poker",
      current_player: 1,
      max_player: 4,
      password: null,
    },
    {
      name: "room13",
      state: "unReady",
      id: 13,
      gametype: "13poker",
      current_player: 1,
      max_player: 4,
      password: null,
    },
  ];

  const [selectedGameType, setSelectedGameType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rooms based on selected game type and search term
  const filteredRooms = rooms
    .filter(
      (room) =>
        selectedGameType === "all" || room.gametype === selectedGameType
    )
    .filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Extract unique game types for the select options
  const gameTypes = ["all", ...new Set(rooms.map((room) => room.gametype))];

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

          {/* Search bar to filter rooms */}
          <Form.Control
            type="text"
            placeholder="Search room..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-3"
          />
        </Col>

        <Col xs={12} md={7} className="p-4">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="mb-4">
              <Card.Body>
                <Card.Text>
                  {room.name}
                  {room.password && (
                    <FaLock
                      className="ml-2"
                      style={{ cursor: "pointer" }}
                      title={`Password: ${room.password}`} // Show the password on hover
                    />
                  )}
                  <br />
                  <strong>Game Type:</strong> {room.gametype}
                  <br />
                  <strong>Current Players:</strong> {room.current_player}/
                  {room.max_player}
                  <br />
                  <strong>Status:</strong> {room.state}
                  <br />
                </Card.Text>
                <Button
                  variant={
                    room.current_player === room.max_player ? "secondary" : "primary"
                  }
                  disabled={room.current_player === room.max_player}
                >
                  {room.current_player === room.max_player ? "Room Full" : "Enter"}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
