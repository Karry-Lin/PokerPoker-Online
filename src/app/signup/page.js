"use client";
import styles from "./Page.module.css";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { database, storage } from "@/utils/firebase.js";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref as refFS, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  const submit = async(event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);
    setError('');
    if (password.length < 6) {
      setError('密碼長度不可小於6');
      return;
    }
    const checkUsernameExists = async (username) => {
      const usersCollection = collection(database, 'user');
      const userList = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(userList);
      return !querySnapshot.empty;
    };
    if (await checkUsernameExists(username)) {
      setError("username已存在");
      return;
    }
    const checkEmailExists = async (email) => {
      const usersCollection = collection(database, 'user');
      const userList = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(userList);
      return !querySnapshot.empty;
    };
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setError("此email已被註冊");
      return;
    }
    const storageRef = refFS(storage, `userAvatar/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    const userId = uuidv4();
    const userRef = doc(database, `user/${userId}`);
    await setDoc(userRef, {
      email,
      username,
      password,
      avatar: url,
      money: 0
    });
    alert('註冊成功');
    router.push('/login');
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
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
