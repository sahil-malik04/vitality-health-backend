module.exports = { generateTimeIntervals };

function generateTimeIntervals(intervalMinutes) {
  const intervals = [];
  let currentHour = 0;
  let currentMinute = 0;

  while (currentHour < 24 || (currentHour === 24 && currentMinute === 0)) {
    const intervalStartTime = `${currentHour
      .toString()
      .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    currentMinute += intervalMinutes;
    if (currentMinute >= 60) {
      currentHour++;
      currentMinute -= 60;
    }

    if (currentHour === 24 && currentMinute === 0) {
      intervals.push(`${intervalStartTime}-00:00`);
      break;
    }

    const intervalEndTime = `${currentHour
      .toString()
      .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
    intervals.push(`${intervalStartTime}-${intervalEndTime}`);
  }

  return intervals;
}
