import React from "react";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "../firebase-config.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Game from "./Game";
import Leaderboard from "./Leaderboard";

const App = () => {
	const firebaseAppConfig = getFirebaseConfig();
	initializeApp(firebaseAppConfig);

	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/game" element={<Game />} />
				<Route exact path="/leaderboard" element={<Leaderboard />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
};

export default App;