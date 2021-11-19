// Format seconds as HH:MM:SS
const formatTime = (s) => {
	s = parseInt(s, 10); // Convert from decimal to integer
	let hours = Math.floor(s / 3600);
	let minutes = Math.floor((s - (hours * 3600)) / 60);
	let seconds = s - (hours * 3600) - (minutes * 60);

	if (hours < 10) { hours = '0' + hours; }
	if (minutes < 10) { minutes = '0' + minutes; }
	if (seconds < 10) { seconds = '0' + seconds; }

	// Optionally display hour
	// return(hours + ':' + minutes + ':' + seconds);
	return(minutes + ':' + seconds);
};

export default formatTime;