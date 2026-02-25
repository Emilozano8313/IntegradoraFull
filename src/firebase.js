import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDxY9uTcbgT_FS7RNXhHOyRtr4sWLs5kx8",
    authDomain: "restaurante-autopedido.firebaseapp.com",
    projectId: "restaurante-autopedido",
    storageBucket: "restaurante-autopedido.firebasestorage.app",
    messagingSenderId: "458040704495",
    appId: "1:458040704495:web:d517aeb7cc9df941398a1a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
