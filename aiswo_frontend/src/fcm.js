import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAJTIg5kZ2ZN2m6TCi5E_tDY6CLl5ja6Ig",
  authDomain: "aiswo-simple.firebaseapp.com",
  databaseURL: "https://aiswo-simple-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aiswo-simple",
  storageBucket: "aiswo-simple.firebasestorage.app",
  messagingSenderId: "262136356446",
  appId: "1:262136356446:web:94295993702cf3ef2d9ecf"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export function requestFcmToken() {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      getToken(messaging, { vapidKey: "BCM_tXHBhaTJSicyaEn2Y4GbR7CoG20a-o01DGmVNZozHBtWUhJ2F8uvecwXlFHoxo0mGtnjlaTS37EV2ivftss" }).then((currentToken) => {
        if (currentToken) {
          console.log("FCM Token:", currentToken);
          // Copy this token and use it in your backend
        } else {
          console.log("No registration token available.");
        }
      }).catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
    } else {
      console.log("Notification permission denied.");
    }
  });
}
