export const setUsernameToCookie = (username) => {
  // 設定 cookie 的過期時間（此例為一天）
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);

  // 將 username 存入 cookie
  document.cookie = `username=${username}; expires=${expirationDate.toUTCString()}; path=/`;
};
export const getUsernameFromCookie = () => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'username') {
      return value;
    }
  }
  return null;
};


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomUniqueNumbers(count, minRange, maxRange) {
  const selectedNumbers = new Set();

  while (selectedNumbers.size < count) {
    const randomNumber = getRandomInt(minRange, maxRange);
    selectedNumbers.add(randomNumber);
  }

  return Array.from(selectedNumbers);
}

export { getRandomUniqueNumbers };