const fullYearsCalculate = async (data) => {
  const dataNow = Date.now();
  const dataBirth = Date.parse(data);
  const fullYears = await Math.floor((dataNow - dataBirth) / 3.156e10);
  return fullYears;
};

module.exports = fullYearsCalculate;
