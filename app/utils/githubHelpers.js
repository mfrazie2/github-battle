var axios = require('axios');

var id = 'MY_CLIENT_ID';
var sec = 'MY_SECRET';
var param = '?client_id=' + id + '&client_secret=' + sec;

function getUserInfo(username) {
  return axios.get('https://api.github.com/users/' + username + param)
}

function getRepos(username) {
  // fetch username's repos
  return axios.get('https://api.github.com/users/' + username + '/repos' + param + '&per_page=100')
}

function getTotalStars(repos) {
  // calculate total stars for user
  return repos.data.reduce(function(prev, curr) {
    return prev + curr.stargazers_count;
  }, 0);
}

function getPlayersData(player) {
  // get repos
  return getRepos(player.login)
  // getTotalStars
    .then(getTotalStars)
  // return obj with data
    .then(function(totalStars) {
      return {
        followers: player.followers,
        totalStars: totalStars
      }
    })
}

function calculateScores(players) {
  console.log('calculateScores: ', players);
  // return array of scores
  return [
    players[0].followers * 3 + players[0].totalStars,
    players[1].followers * 3 + players[1].totalStars
  ]
}


var helpers = {
  getPlayersInfo: function(players) {
    return axios.all(players.map(function(username) {
      return getUserInfo(username); // returns a promise
    })).then(function(info) { // modifies the data
      return info.map(function(user) {
        return user.data; // returns a promise
      })
    }).catch(function(err) {
      console.warn('Error in getPlayersInfo!', err);
    });
  },
  
  battle: function(players) {
    var playerOneData = getPlayersData(players[0]);
    var playerTwoData = getPlayersData(players[1]);
    
    return axios.all([playerOneData, playerTwoData])
      .then(calculateScores)
      .catch(function(err) {
        console.warn('Something is wrong in getPlayersInfo: ', err);
      })
  }
  
};

module.exports = helpers;