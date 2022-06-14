const urlValidator = (value) => {
  const regex = /^https?:\/{2}[www.]?[\w.~:/?%#[\]@!$&'()*+,;=-]+\/?#?/;
  return regex.test(value);
};

module.exports = urlValidator;
