import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
// 	apiKey: 'AIzaSyDkVhiNAhOvQ0Cy1Him-2KYDwRHI2dgEtU',
// 	authDomain: 'cluster-2dcc1.firebaseapp.com',
// 	projectId: 'cluster-2dcc1',
// 	storageBucket: 'cluster-2dcc1.appspot.com',
// 	messagingSenderId: '762247224471',
// 	appId: '1:762247224471:web:a1e6fc464d4a03dbe15dd2',
// 	measurementId: 'G-FVZBVCWLKC',
// };

const firebaseConfig = {
	apiKey: 'AIzaSyCLVIXPu5WMmj-ZC6E0f_44PSewK7lGaC8',
	authDomain: 'cluster-5bccb.firebaseapp.com',
	projectId: 'cluster-5bccb',
	storageBucket: 'cluster-5bccb.firebasestorage.app',
	messagingSenderId: '360849530451',
	appId: '1:360849530451:web:d710a0fb1f763759d0f0a6',
};

const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app);
