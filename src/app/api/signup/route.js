import { database, storage } from "@/utils/firebase.js";
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { ref as refFS, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  const formData = await request.formData();
  const email = formData.get('email');
  const username = formData.get('username');
  const password = formData.get('password');
  const file = formData.get('file');
  const checkEmailExists = async (email) => {
    const usersCollection = collection(database, 'user');
    const userList = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userList);
    return !querySnapshot.empty;
  };
  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    return Response.json({ error: "此email已被註冊" }, { status: 400 });
  }
  const checkUsernameExists = async (username) => {
    const usersCollection = collection(database, 'user');
    const userList = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(userList);
    return !querySnapshot.empty;
  };
  if (await checkUsernameExists(username)) {
    return Response.json({ error: "username已存在" }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: '密碼長度不可小於6' }, { status: 400 });
  }
  const timestamp = Date.now();
  const storageRef = refFS(storage, `userAvatar/${timestamp}_${file.name}`);
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
  return Response.json({ message: '註冊成功' }, { status: 201 });
}
