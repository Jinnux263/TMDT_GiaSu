const { initializeApp } = require('firebase/app');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDMqiWhJPBfXmxyT8aMKsXiW1tBXCWvFJo',
  authDomain: 'boardgame-ecommerce-64387.firebaseapp.com',
  databaseURL: 'https://boardgame-ecommerce-64387-default-rtdb.firebaseio.com',
  projectId: 'boardgame-ecommerce-64387',
  storageBucket: 'boardgame-ecommerce-64387.appspot.com',
  messagingSenderId: '1021646571445',
  appId: '1:1021646571445:web:4368cf08e61cf6a47fbbfc',
  measurementId: 'G-G2LERTTYML',
};

const app = initializeApp(firebaseConfig);

module.exports = app;
// export default app
