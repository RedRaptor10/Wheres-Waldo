// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyD9gc6CERvp2Arq5QmTe12IWdvDha0F5Yo",
	authDomain: "where-s-waldo-e5ad3.firebaseapp.com",
	projectId: "where-s-waldo-e5ad3",
	storageBucket: "where-s-waldo-e5ad3.appspot.com",
	messagingSenderId: "925971963151",
	appId: "1:925971963151:web:53e1d7d8f654add671727a"
};

export function getFirebaseConfig() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error('No Firebase configuration object provided.');
  } else {
    return firebaseConfig;
  }
}