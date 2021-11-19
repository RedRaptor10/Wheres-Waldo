import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div id="header">
			<h1 id="header-title"><Link to="/">Where's Waldo?</Link></h1>
			<h3 id="header-leaderboard"><Link to="/leaderboard">Leaderboard</Link></h3>
		</div>
	);
}

export default Header;