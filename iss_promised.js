const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const data = JSON.parse(body);
  return request(`https://ipvigilante.com/${data.ip}`)
};

const fetchISSFlyOverTimes = function(body) {
  return request(`http://api.open-notify.org/iss-pass.json?lat=${JSON.parse(body).data.latitude}&lon=${JSON.parse(body).data.longitude}`)
};

const nextISSTimesForMyLocation = function() {
  fetchMyIP()
    .then((body) => fetchCoordsByIP(body))
    .then((body) => fetchISSFlyOverTimes(body))
    .then((body) => {
      const passTimes = JSON.parse(body).response;
      for (const pass of passTimes) {
        const datetime = new Date(0);
        datetime.setUTCSeconds(pass.risetime);
        const duration = pass.duration;
        console.log(`Next time is ${datetime} for: ${duration}.`);
      }
    })
    .catch((error => {
      console.log("It didn't work: ", error.message);
    }));
};

module.exports = { nextISSTimesForMyLocation };