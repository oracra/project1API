let LeagueAPI = require('leagueapiwrapper');

const championListParsed = {};
const champIDArray = {};
let championMasteryList = {};
const imageURLs = {};
const leagueAPIKey = 'RGAPI-02e23f92-b408-47a1-89a6-1d77a8c5f56c';
const users = {};
//This registers a new API when the server is launched
LeagueAPI = new LeagueAPI(leagueAPIKey, 'na1');

//This handles all JSON response
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};
//Headers
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/jason',
  };
  response.writeHead(status, headers);
  response.end();
};
//404
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for isnt here!',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};
//This will return the list of users
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

//This functions parses the massive file down to only the parts I need
const parseChampionList = (htmlList) => {
  const champsList = htmlList;
  const keys = Object.keys(champsList);
  keys.forEach((key) => { //for each champion grab its name
    championListParsed[champsList[key].key] = {
      championId: key,
    };
  });
};
//Adds a new summoner
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };

  console.dir(body);

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
    users[body.name].name = body.name;
  }

  if (responseCode === 201) {
    responseJSON.message = 'Created SuccessFully!';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// Gets the users summoner name and profile
const getSummoner = () => {
  LeagueAPI.getSummonerByName('Oracra')
    .then((accountObj) => LeagueAPI.getChampionMastery(accountObj))
    .then((championMasteryListPromise) => {
      championMasteryList = championMasteryListPromise;
    })
    .catch(console.error);
};
//This function sets the top 3 champions names and images for getMastery
const setTop3Mastery = () => {
  let champKey;
  for (let i = 0; i < 3; i++) {
    champKey = championMasteryList[i].championId;

    imageURLs[i] = (`http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${championListParsed[champKey].championId}_0.jpg`);
    champIDArray[i] = championListParsed[champKey];
  }

  // console.log(imageURLs);
};
// Gets top 3 champions
const getMastery = async (request, response, summonerName) => {
  //This is the promise chain
  //Gets the user name
  LeagueAPI.getSummonerByName(summonerName) 
    //Gets that users championMastery Summary
    .then((accountObj) => LeagueAPI.getChampionMastery(accountObj))
    .then((championMasteryListPromise) => {
      //Sets the array = to the response
      championMasteryList = championMasteryListPromise;
      return setTop3Mastery();
    }).then(() => {
      const responseJSON = {
        message: 'masteryObject gotten SuccessFully',
        imageURLs,
        champIDArray,
      };
      return respondJSON(request, response, 200, responseJSON);
      //returns all the data
    })
    .catch(() => {
      const responseJSONError = { message: 'Summoner Not Found' };

      return respondJSON(request, response, 404, responseJSONError);
      //If the summoner isnt found it will return this message
    });

  // return respondJSON(request, response, 200, responseJSON);
};

module.exports = {
  getUsers,
  getUsersMeta,
  addUser,
  notFound,
  notFoundMeta,
  getSummoner,
  getMastery,
  parseChampionList,

};
