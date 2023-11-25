module.exports = {
  parseJwt,
  getJoinsData,
  generateUniqueSessionId,
  generateRandomPassword,
  formatDate,
  sortData,
};

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

function getJoinsData(joinTable, firstCond, operator, secondCond) {
  const data = {
    joinTable: joinTable,
    firstCond: firstCond,
    operator: operator,
    secondCond: secondCond,
  };
  return data;
}

function generateUniqueSessionId() {
  const randomString = Math.random().toString(36).substr(2, 10);
  const timestamp = Date.now();
  // Combine the random string and timestamp to form the session ID
  const sessionId = randomString + timestamp;

  return sessionId;
}

function generateRandomPassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars.charAt(randomIndex);
  }

  return password;
}

function formatDate(filterData, key) {
  if (filterData.length > 0) {
    const formattedData = filterData.map((item) => {
      const updatedDate = new Date(item[key].getTime() + (5 * 60 + 30) * 60000);
      const splitDates = updatedDate.toISOString().split("T");

      const dateWithoutTime = splitDates[0];
      return { ...item, [key]: dateWithoutTime };
    });
    return formattedData;
  } else {
    if (filterData[key]) {
      const updatedDate = new Date(
        filterData[key].getTime() + (5 * 60 + 30) * 60000
      );

      const splitDates = updatedDate.toISOString().split("T");
      const dateWithoutTime = splitDates[0];
      return { ...filterData, [key]: dateWithoutTime };
    } else {
      return [];
    }
  }
}

function sortData(data) {
  const result = data.sort((x, y) => y.createdAt - x.createdAt);
  return result;
}
