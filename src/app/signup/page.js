"use client";
import styles from "./Page.module.css";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function Page() {
  const router = useRouter();
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const fileState = useState(null);
  /** @type {File | null} */
  const file = fileState[0];
  /** @type {(file: File | null) => void} */
  const setFile = fileState[1];
  const [error, setError] = useState('');
  const registerUser = async (email, username, password, file) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('file', file);
    const response = await fetch('/api/signup', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data.message;
  };
  const submit = async(event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError('');
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    try {
      const message = await registerUser(email, username, password, file);
      alert(message);
      router.push('/login');
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className={styles.body}>
      <img src="/loginsignup-background.jpg" alt="background" className={styles.background} />
      <div>
        <Card className={styles.card}>
          <Card.Body>
            <div className={styles.title}>Signup</div>
            <Form noValidate validated={ validated } onSubmit={ submit }>
              <FloatingLabel className={ styles.floatingLabel } controlId="floatingEmail" label="Email address">
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your email.
                </Form.Control.Feedback>
              </FloatingLabel>
                <FloatingLabel className={ styles.floatingLabel } controlId="floatingUsername" label="Username">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                <Form.Control.Feedback type="invalid">
                  Please enter username.
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel className={ styles.floatingLabel } controlId="floatingPassword" label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your password.
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel className={ styles.floatingLabel } controlId="floatingAvatar" label="avatar">
                <Form.Control
                  placeholder="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please upload your avatar.
                </Form.Control.Feedback>
              </FloatingLabel>
              <button className={styles.button} type="submit">
                Signup
              </button>
              {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
