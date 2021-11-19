import React, { useEffect } from "react";
import { getFirestore, collection, doc, deleteDoc, query, getDocs, orderBy, limit } from "firebase/firestore";
import formatTime from '../functions/formatTime';

const Leaderboard = () => {
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

	const resetLeaderboard = async () => {
		// Delete all high scores from database
		const db = getFirestore();
		const highScoresSnapshot = await getDocs(collection(db, "scores"));
		highScoresSnapshot.forEach((d) => {
			deleteDoc(doc(db, "scores", d.ref.id));
		});
	};

	// Get scores on componentDidMount & componentDidUpdate
	useEffect(() => {
		getScores();
	});

	return (
		<div id="leaderboard">
			<table id="scores-table">
				<tbody>
					<tr>
						<th>Name</th><th>Time</th>
					</tr>
				</tbody>
			</table>
			{/*<button id="reset-leaderboard-btn" onClick={resetLeaderboard}>Reset Leaderboard</button>*/}
		</div>
	);
}

export default Leaderboard;