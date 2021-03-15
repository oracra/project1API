let LeagueAPI = require('leagueapiwrapper');

const championListParsed = {};
const champIDArray = {};
let championMasteryList = {};
const imageURLs = {};
const leagueAPIKey = 'RGAPI-88f4b674-e1d9-470a-983b-d9e2e870b42b';
const users = {};

LeagueAPI = new LeagueAPI(leagueAPIKey, 'na1');

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/jason',
  };
  response.writeHead(status, headers);
  response.end();
};

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

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const parseChampionList = (htmlList) => {
  const champsList = htmlList;
  const keys = Object.keys(champsList);
  keys.forEach((key) => {
    championListParsed[champsList[key].key] = {
      championId: key,
    };
    // console.log(championListParsed[key.key].id);
  });
};

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
  LeagueAPI.getSummonerByName(summonerName)

    .then((accountObj) => LeagueAPI.getChampionMastery(accountObj))
    .then((championMasteryListPromise) => {
      championMasteryList = championMasteryListPromise;
      return setTop3Mastery();
    }).then(() => {
      const responseJSON = {
        message: 'masteryObject gotten SuccessFully',
        imageURLs,
        champIDArray,
      };
      return respondJSON(request, response, 200, responseJSON);
    })
    .catch(() => {
      const responseJSONError = { message: 'Summoner Not Found' };

      return respondJSON(request, response, 404, responseJSONError);
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
