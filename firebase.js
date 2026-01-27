// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2uc-dmGDYG4IDnq4tHj7a1vfk9-CJbQo",
  authDomain: "todolist-d4f9d.firebaseapp.com",
  projectId: "todolist-d4f9d",
  storageBucket: "todolist-d4f9d.appspot.com",
  messagingSenderId: "843678169332",
  appId: "1:843678169332:web:9a37593a0faec5603186a1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;
// End of firebase.js