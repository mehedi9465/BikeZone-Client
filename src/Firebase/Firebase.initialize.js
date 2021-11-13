import { initializeApp } from "firebase/app";
import firebaseConfig from "./Firebase.config";

const initializeAuth = () => {
    initializeApp(firebaseConfig);
}

export default initializeAuth;