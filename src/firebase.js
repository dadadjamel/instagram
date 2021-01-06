import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAOJfB7MaEvUV9mCh6ijn2fS23xCaO_A00",
    authDomain: "instagram-clone-3d976.firebaseapp.com",
    databaseURL: "https://instagram-clone-3d976.firebaseio.com",
    projectId: "instagram-clone-3d976",
    storageBucket: "instagram-clone-3d976.appspot.com",
    messagingSenderId: "602580428237",
    appId: "1:602580428237:web:cc7d1d89d1f891eaf69084",
    measurementId: "G-6YDYGDDLYG"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db,auth,storage}