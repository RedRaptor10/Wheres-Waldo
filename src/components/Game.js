import React, { useState, useEffect } from "react";
import Results from "./Results";
import gameImage from "../images/game.jpg";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import formatTime from '../functions/formatTime';

const Game = () => {
	const [characters, setCharacters] = useState([
		{
			id: 0,
			name: 'Waldo',
			found: false,
		},
		{
			id: 1,
			name: 'Odlaw',
			found: false,
		},
		{
			id: 2,
			name: 'Wizard',
			found: false,
		}
	]);
	const [message, setMessage] = useState('');
	const [timer, setTimer] = useState();
	const [elapsedTime, setElapsedTime] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const images = {
		image: gameImage,
	};

	// Set timer on componentDidMount and update every second
	useEffect(() => {
		let startTime = Date.now(); // Set start time

		setTimer(setInterval(() => {
			// Get time difference between current time and start time
			let difference = Date.now() - startTime;
			setElapsedTime(difference / 1000); // Update elapsed time
		}, 1000));

		// Remove message and timer on componentDidUnmount
		return () => {
			const messageEl = document.getElementById('message');
			const timerEl = document.getElementById('timer');
			if (messageEl) { messageEl.remove(); }
			if (timerEl) { timerEl.remove(); }
		};
	}, []);

	useEffect(() => {
		const messageEl = document.getElementById('message');

		// Create message on mount
		if (!messageEl) {
			const headerTitle = document.getElementById('header-title');
			const messageEl = document.createElement('h3');
			messageEl.id = 'message';
			headerTitle.parentNode.insertBefore(messageEl, headerTitle.nextSibling);
		}

		if (messageEl) {
			messageEl.innerHTML = message;
		}
	});

	// Display Timer on componentDidMount and componentDidUpdate
	useEffect(() => {
		const timerEl = document.getElementById('timer');

		// Create timer on mount
		if (!timerEl) {
			const headerLeaderboard = document.getElementById('header-leaderboard');
			const timerEl = document.createElement('h3');
			timerEl.id = 'timer';
			headerLeaderboard.parentNode.insertBefore(timerEl, headerLeaderboard);
		}

		// Update timmer on update
		if (timerEl) {
			timerEl.innerHTML = formatTime(elapsedTime);
		}
	});

	// Check win condition with useEffect hook on componentDidUpdate
	useEffect(() => {
		const checkGameOver = () => {
			let foundAll = true;

			characters.forEach(character => {
				if (!character.found) {
					foundAll = false;
				}
			});

			if (foundAll) {
				clearInterval(timer); // Stop timer				
				setGameOver(true);
			}
		};

		checkGameOver();
	}, [characters, timer, elapsedTime]);

	const showTarget = (event) => {
		const imageContainer = document.getElementById('image-container');
		const target = document.getElementById('target');
		const dropdownMenu = document.getElementById('dropdown-menu');


		// If target already created then remove target, else create target
		if (target) {
			target.remove();
			dropdownMenu.remove();
		} else {
			const target = document.createElement('div');
			const dropdownMenu = document.createElement('div');
			target.id = 'target';
			dropdownMenu.id = 'dropdown-menu';
			imageContainer.append(target, dropdownMenu);

			// Get target size
			const targetStyle = getComputedStyle(target);
			const w = parseInt(targetStyle.getPropertyValue('width'));
			const h = parseInt(targetStyle.getPropertyValue('height'));
			const b = parseInt(targetStyle.getPropertyValue('border-left-width'));

			// Position of mouse click
			const x = event.clientX + window.pageXOffset;
			const y = event.clientY + window.pageYOffset;

			// Position relative to image, regardless of resizing window
			const rect = event.target.getBoundingClientRect();
			const x_rel = event.clientX - rect.left;
			const y_rel = event.clientY - rect.top;

			// Set position of target and dropdown menu at mouse coordinates
			target.style.top = y - (h / 2) + 'px';
			target.style.left = x - (w / 2) + 'px';
			dropdownMenu.style.top = y + 'px';
			dropdownMenu.style.left = x + (w / 2) + (b * 2) + 'px';

			// Create menu items
			characters.forEach(character => {
				const item = document.createElement('div');
				item.classList.add('dropdown-menu-character');
				item.innerHTML = character.name;

				// Check if character not found previously
				if (!character.found) {
					item.addEventListener('click', () => {
						checkCoordinates(character.id, x, y, x_rel, y_rel);
					});
				} else {
					item.style.cursor = 'default';
				}

				dropdownMenu.append(item);
			});
		}
	};

	/* Check Firestore database backend to see if coordinates are within range
	Character Coordinates:
	Name: Waldo, x: 635, y: 450
	Name: Odlaw, x: 290, y: 450
	Name: Wizard, x: 750, y: 450 */
	const checkCoordinates = async (id, x, y, x_rel, y_rel) => {
		try {
			// Get document from database
			const db = getFirestore();
			const characterDoc = doc(db, 'characters', id.toString());
			const characterSnap = await getDoc(characterDoc);

			// Set range
			const target = document.getElementById('target');
			const targetStyle = getComputedStyle(target);
			const range = parseInt(targetStyle.getPropertyValue('width')) / 2;
			const leftBound = characterSnap.data().x - range;
			const rightBound = characterSnap.data().x + range;
			const upBound = characterSnap.data().y - range;
			const downBound = characterSnap.data().y + range;

			// If coordinates are in range, mark position
			if (x_rel > leftBound && x_rel < rightBound && y_rel > upBound && y_rel < downBound) {
				setMessage('You found ' + characterSnap.data().Name + '!');

				const imageContainer = document.getElementById('image-container');
				const marker = document.createElement('div');
				marker.classList.add('marker');
				marker.innerHTML = characterSnap.data().Name;
				marker.style.left = x + 'px';
				marker.style.top = y + 'px';
				imageContainer.append(marker);

				// Set character to found in state
				let temp = characters.slice(); // Clone array because cannot directly modify state
				temp[id].found = true;
				setCharacters(temp);
			} else {
				setMessage('You missed.');
			}

			// Remove target and dropdown menu
			const dropdownMenu = document.getElementById('dropdown-menu');
			target.remove();
			dropdownMenu.remove();
		} catch (error) {
			console.log(error);
		}
	};


	return (
		<div id="game">
			<div id="image-container">
				<img id="image" src={images['image']} alt="" onClick={(event) => {if (!gameOver) { showTarget(event); }}} />
			</div>
			{gameOver ?
				<Results elapsedTime={elapsedTime} />
			: null}
		</div>
	);
}

export default Game;