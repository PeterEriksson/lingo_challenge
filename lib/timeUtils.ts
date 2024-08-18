function formatTime(seconds: number) {
  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format minutes and seconds with leading zero if needed
  let formattedMinutes = String(minutes);
  if (minutes > 10) {
    formattedMinutes = formattedMinutes.padStart(2, "0");
  }
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  // Return formatted time as a string
  return formattedMinutes + ":" + formattedSeconds;
}

export { formatTime };
