importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js')

const firebaseConfig = {
  apiKey: "AIzaSyBbMpDfvdJhX0EQxfab_jYZ6mmLBVXtlM4",
  authDomain: "bssd-econtract.firebaseapp.com",
  projectId: "bssd-econtract",
  storageBucket: "bssd-econtract.appspot.com",
  messagingSenderId: "380325577672",
  appId: "1:380325577672:web:2ecb48d37468c431d876fd",
  measurementId: "G-ZG0M46EMCB"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
