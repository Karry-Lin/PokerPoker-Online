"use client";
import {useEffect, useState} from 'react';
import NavBar from '../components/navBar';
import {Button, Card, Col, Form, Image, Row, Spinner} from 'react-bootstrap';
import styles from './Page.module.css';
import {useUserStore} from "@/app/stores/userStore.js";

export default function Page() {
  const userStore = useUserStore();
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("loading...");
  const [password, setPassword] = useState("loading...");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(originalData.avatar);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const email = originalData?.email ?? "loading...";
  const [money, setMoney] = useState("loading...");
  const fileState = useState(null);
  /** @type {File | null} */
  const file = fileState[0];
  /** @type {(file: File | null) => void} */
  const setFile = fileState[1];
  const [error, setError] = useState('');
  const fetchUserData = async () => {
    if (userStore.userId) {
      const response = await fetch(`/api/user?id=${userStore.userId}`, {method: 'GET'});
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      }
      setOriginalData(data);
      setUsername(data.username || '');
      setPassword(data.password || '');
      setMoney(data.money || 0);
      setAvatar(data.avatar || '');
      setFile(null);
    }
  };
  const addMoney = async () => {
    const response = await fetch(`/api/money`, {
      method: 'PUT',
      body: JSON.stringify({userId: userStore.userId, money})
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
    }
    alert(data.message);
    setMoney(originalData.money + 50);
  };
  useEffect(() => {
    fetchUserData().then();
  }, [userStore.userId, money]);
  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append('userId', userStore.userId);
    formData.append('username', username === originalData.username ? "" : username);
    formData.append('password', isPasswordChanged ? password : "");
    formData.append('confirmPassword', confirmPassword);
    formData.append('file', file);
    const response = await fetch(`/api/user/`, {
      method: 'PUT',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      return;
    }
    setError("");
    alert(data.message);
    await fetchUserData();
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value !== originalData.password) {
      setIsPasswordChanged(true);
    }
  };
  const handleCancelClick = () => {
    setIsEditing(false);
    setUsername(originalData.username);
    setPassword(originalData.password);
    setAvatar(originalData.avatar);
    setConfirmPassword("");
    setFile(null);
  };
  return (
    <div>
      <NavBar avatar={avatar} setAvatar={setAvatar}/>
      <h1 className={styles.title}>個人檔案</h1>
      <Card className={styles.card}>
        <Card.Body>
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextUsername">
              <Form.Label column sm="4">Username</Form.Label>
              <Col sm="8">
                <Form.Control
                  plaintext={!isEditing}
                  readOnly={!isEditing}
                  value={username}
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="4">Email</Form.Label>
              <Col sm="8">
                <Form.Control
                  plaintext
                  readOnly
                  value={email}
                  autoComplete="email"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
              <Form.Label column sm="4">Password</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="password"
                  value={password}
                  autoComplete="new-password"
                  onChange={handlePasswordChange}
                  plaintext={!isEditing}
                  readOnly={!isEditing}
                />
              </Col>
            </Form.Group>
            {isEditing && (
              <Form.Group as={Row} className="mb-3" controlId="formConfirmPassword">
                <Form.Label column sm="4">Confirm Password</Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    autoComplete="new-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    readOnly={!isPasswordChanged}
                  />
                </Col>
              </Form.Group>
            )}
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextMoney">
              <Form.Label column sm="4">Money</Form.Label>
              <Col sm="8" className="d-flex">
                <Col sm="5" className="p-0">
                  <Form.Control
                    plaintext
                    readOnly
                    value={money}
                  />
                </Col>
                {!isEditing && (
                  <Col sm="3" className="p-0">
                    <Button variant="success" onClick={addMoney} className="me-2">
                      +50
                    </Button>
                  </Col>
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextAvatar">
              <Form.Label column sm="4">Avatar</Form.Label>
              <Col sm="8">
                {!avatar ? (
                  <Spinner animation="border"/>
                ) : (
                  <Image src={avatar} roundedCircle className={styles.avatar}/>
                )}
                {isEditing && (
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="mt-2"
                  />
                )}
              </Col>
            </Form.Group>
            <div className={styles.button}>
              {isEditing && (
                <Button variant="secondary" onClick={handleCancelClick} className="me-2">
                  返回
                </Button>
              )}
              <Button variant="primary" onClick={isEditing ? handleSaveClick : () => {
                setIsEditing(true);
              }}>
                {isEditing ? "儲存" : "修改"}
              </Button>
              {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
