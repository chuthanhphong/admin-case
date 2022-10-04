import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBbMpDfvdJhX0EQxfab_jYZ6mmLBVXtlM4",
  authDomain: "bssd-econtract.firebaseapp.com",
  projectId: "bssd-econtract",
  storageBucket: "bssd-econtract.appspot.com",
  messagingSenderId: "380325577672",
  appId: "1:380325577672:web:2ecb48d37468c431d876fd",
  measurementId: "G-ZG0M46EMCB"
};

const PUBLIC_KEY = "BO1kSkLZfJLwcRcaz-IV9RHRKFCUZPKfPaLHYfPWwzgovOK6RnBkOcr2xR3iwoNhHPd9YQkoqGWuO25wnT3Ev8c"
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, onMessage, getToken, PUBLIC_KEY };
