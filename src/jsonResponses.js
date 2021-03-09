let LeagueAPI = require('leagueapiwrapper');

let champsList = {};
let champIDArray = {};
let championMasteryList = {};
let imageURLs = {};
const champsListParsed = {};
const leagueAPIKey = 'RGAPI-99585707-192d-4b6e-bbb7-7e4dd71a2e4b';
const users = {};

LeagueAPI = new LeagueAPI(leagueAPIKey, Region.NA);

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

const getChampionList = () => {
  if (champsList) {
    Object.keys(champsList).forEach((key) => {
      console.log(key);
      champsListParsed[key] = {
        championKey: key.key,
        championId: key.id,
      };
    });
  }
  // return respondJSON(request, response, 200, responseJSON);
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };

  console.dir(body);

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
    users[body.name].name = body.name;
  }

  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created SuccessFully!';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};
// Gets the users summoner name and profile
const getSummoner = () => {
  LeagueAPI.getSummonerByName('Oracra')
    .then((accountObj) => {
      return LeagueAPI.getChampionMastery(accountObj);
      
    }).then((championMasteryListPromise) =>{
      championMasteryList = championMasteryListPromise;
    })
    .catch(console.error);
    console.log(championMasteryList);
};


// Gets top 3 champions
const getMastery = async(request, response) => {
  const responseJSON = {
    message: "masteryObject gotten SuccessFully",
    imageURLs, champIDArray
  }
  LeagueAPI.getSummonerByName('Oracra')
    .then((accountObj) => {
      return LeagueAPI.getChampionMastery(accountObj);
      
    }).then((championMasteryListPromise) =>{
      championMasteryList = championMasteryListPromise
      return setTop3Mastery();
    }).then(() =>{
      console.log(imageURLs);
      console.log(champIDArray);
    })
    .catch(console.error);
    console.log(championMasteryList);

  return respondJSON(request, response, 200, responseJSON);
};

const setTop3Mastery= ()=>{   
  
  for (let i = 0; i < 3; i++) {
    champIDArray[i] = championMasteryList[i].championId;
    console.log(championMasteryList[i].championId);
  }
  for (let i = 0; i < 3; i++) {
    imageURLs[i] = (`http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${champIDArray[i]}_0.jpg`);
  }
  return;
}


const setChampList = (htmlList) => {
  champsList = htmlList;
};

module.exports = {
  getUsers,
  getUsersMeta,
  addUser,
  notFound,
  notFoundMeta,
  getSummoner,
  getMastery,
  getChampionList,
  setChampList,

};
