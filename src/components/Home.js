import React from "react";
import { Link } from "react-router-dom";
import cover from '../images/cover.jpg';

const Home = () => {
	return (
		<div id="home">
			<img id="cover" src={cover} alt="" />
			<div id="play-btn"><Link to="/game">Play Game</Link></div>
		</div>
	);
}

export default Home;