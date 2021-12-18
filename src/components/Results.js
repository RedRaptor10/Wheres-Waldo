import React, { useState, useEffect } from "react";
import { getFirestore, collection, doc, addDoc, deleteDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import formatTime from '../functions/formatTime';

const Results = ({elapsedTime}) => {
	const [isHighScore, setIsHighScore] = useState(false);
	const [formName, setFormName] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [showScores, setShowScores] = useState(false);

	// Check if high score on componentDidMount
	useEffect(() => {
		const checkScores = async (score) => {
			try {
				let highScore = false;
				const scoresLimit = 10;
				const db = getFirestore();
				const scoresRef = collection(db, "scores");
				const q = query(scoresRef, orderBy("score"), limit(scoresLimit));
				const highScoresSnapshot = await getDocs(q);

				/* If less than number of high scores, set as a high score,
				else check if score is higher than any high score */
				if (highScoresSnapshot.docs.length < scoresLimit) {
					highScore = true;
				} else {
					highScoresSnapshot.forEach((doc) => {
						if (score < doc.data().score) {
							highScore = true;
						}
					});
				}

				return highScore ? true : false;
			} catch (error) {
				console.log(error);
			}
		};

		(async function() {
			if (await checkScores(elapsedTime)) {
				setIsHighScore(true);
			}
		})();
	});

	// Dynamically change state from form input
	const handleChange = (event) => {
		setFormName(event.target.value);
	};

	const submitScore = async () => {
		try {
			const db = getFirestore();

			// Sign-in anonymously to temporary account
			const auth = getAuth();
			signInAnonymously(auth)
			.then(async () => {
				// Delete lowest high score from database
				const scoresLimit = 10;
				const scoresRef = collection(db, "scores");
				const q = query(scoresRef, orderBy("score"), limit(scoresLimit));
				const highScoresSnapshot = await getDocs(q);
				let index = 0;
				highScoresSnapshot.forEach((d) => {
					if (index === scoresLimit - 1) {
						deleteDoc(doc(db, "scores", d.ref.id));
					}
					index++;
				});

				// Add a new document with a generated id
				await addDoc(collection(db, "scores"), {
					name: formName,
					score: elapsedTime
				});

				setSubmitted(true);
			});
		} catch (error) {
			console.log(error);
		}
	};

	// Get scores on componentDidUpdate
	useEffect(() => {
		const getScores = async () => {
			try {
				const scoresTable = document.getElementById('scores-table');
				const scoresLimit = 10;
				const db = getFirestore();
				const scoresRef = collection(db, "scores");
				const q = query(scoresRef, orderBy("score"), limit(scoresLimit));
				const highScoresSnapshot = await getDocs(q);
				highScoresSnapshot.forEach((doc) => {
					const row = document.createElement('tr');
					const name = document.createElement('td');
					const score = document.createElement('td');
					name.innerHTML = doc.data().name;
					score.innerHTML = formatTime(doc.data().score);

					row.append(name, score);
					scoresTable.append(row);
				});
			} catch (error) {
				console.log(error);
			}
		};

		if (showScores) {
			getScores();
		}
	}, [showScores]);

	return (
		<div>
			{ submitted ?
				<div id="score-submitted">
					<h1>Score Submitted!</h1>
					<button id="play-again-btn" type="button" onClick={() => {window.location.reload()}}>Play Again</button>
				</div>
			:
				showScores ?
					<div id="results-leaderboard">
						<h1>Leaderboard</h1>
						<table id="scores-table">
							<tbody>
								<tr>
									<th>Name</th><th>Time</th>
								</tr>
							</tbody>
						</table>
						<button id="results-back-btn" onClick={() => {setShowScores(false);}}>Back</button>
					</div>
				:
					<div id="results-screen">
						<h1>Your Time</h1>
						<div id="score">{formatTime(elapsedTime)}</div>
						{ isHighScore ?
							<div id="submit-form-container">
								<div id="high-score-label">New High Score!</div>
								<div id="submit-form">
									<input id="submit-name" type="text" placeholder="Name" onChange={handleChange} />
									<button id="submit-btn" type="button" onClick={submitScore}>Submit</button>
								</div>
								<div id="results-btns">
									<button id="leaderboard-btn" type="button" onClick={() => {setShowScores(true)}}>Leaderboard</button>
									<button id="play-again-btn" type="button" onClick={() => {window.location.reload()}}>Play Again</button>
								</div>
							</div>
						:
							<div id="results-btns">
								<button id="leaderboard-btn" type="button" onClick={() => {setShowScores(true)}}>Leaderboard</button>
								<button id="play-again-btn" type="button" onClick={() => {window.location.reload()}}>Play Again</button>
							</div>
						}
					</div>
			}
		</div>
	);
}

export default Results;