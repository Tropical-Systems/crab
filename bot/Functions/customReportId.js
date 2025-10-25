function randomId(length, chars) {
  let result = '';
  Array.from({ length }).forEach(() => {
    result += chars[Math.floor(Math.random() * chars.length)];
  });
  return result;
}
module.exports = randomId
