"use client";
import styles from "./Page.module.css";
import Link from 'next/link';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useUserStore} from "@/app/stores/userStore.js";

export default function Page() {
  const userStore = useUserStore();
  const router = useRouter();
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = async (email, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data.userId;
  };
  const submit = async(event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setError('');
    try {
      const id = await login(email, password);
      userStore.login(id);
      router.push('/lobby');
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
            <div className={styles.title}>Login</div>
            <Form noValidate validated={ validated } onSubmit={ submit }>
              <FloatingLabel className={ styles.floatingLabel } controlId="floatingInput" label="Email address">
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
              <FloatingLabel className={ styles.floatingLabel } controlId="floatingPassword" label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </FloatingLabel>
              <button className={styles.button} type="submit">
                Login
              </button>
              <Link href="/signup">
                <Button variant="light" size="lg">Signup</Button>
              </Link>
              {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
