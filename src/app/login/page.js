"use client";
import styles from "./Page.module.css";
import Link from 'next/link';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import initializeFirebase from "@/utils/firebase.js";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firebase, setFirebase] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const initFirebase = async () => {
      const firebaseApp = await initializeFirebase();
      setFirebase(firebaseApp);
    };
    initFirebase().then();
  }, []);
  const isEmailValid = (email) => {
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regex.test(email);
  };
  const submit = async() => {
    setError('');
    if (!isEmailValid(email)) {
      setError('無效的帳號');
      return;
    }
    const db = firebase.firestore();
    const userQuery = await db.collection('user').where('email', '==', email).where('password', '==', password).get();
    if (!userQuery.empty) {
      router.push('/lobby');
    }
    else{
      setError('帳號或密碼錯誤');
      return;
    }
  };
  return (
    <div className={styles.body}>
      <img src="/loginsignup-background.jpg" alt="background" className={styles.background} />
      <div>
        <Card className={styles.card}>
          <Card.Body>
            <div className={styles.title}>Login</div>
            <FloatingLabel controlId="floatingInput" label="Email address">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FloatingLabel>

            <button className={styles.button} type="submit" onClick={submit}>
              Log in
            </button>
            <Link href="/signup">
              <Button variant="light" size="lg">Signup</Button>
            </Link>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
