let LeagueAPI = require('leagueapiwrapper');


const champIDArray = {};
let championMasteryList = {};
const imageURLs = {};
let champsListParsed = {};
const leagueAPIKey = 'RGAPI-8cf6f70c-a43d-4527-895f-a74ba947f8ad';
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

const getChampionList = (request, response, htmlList) => {
  const responseJSON = {
    message: 'List received Sucsessfully',
  };
    console.log(htmlList);
    let champsList = htmlList;
    console.log(champsList);
    const keys = Object.keys(champsList);
    for(const key of keys){
      
      champsListParsed[key.key] = {
        championId: key.id,
      };
      console.log(champsListParsed[key.key]);
    };
    
  
  return respondJSON(request, response, 200, responseJSON);
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
    .then((accountObj) => LeagueAPI.getChampionMastery(accountObj))
    .then((championMasteryListPromise) => {
      championMasteryList = championMasteryListPromise;
    })
    .catch(console.error);
  console.log(championMasteryList);
};

const setTop3Mastery = () => {
  
  for (let i = 0; i < 3; i++) {
    console.log(champsListParsed);
    champIDArray[i] = champsListParsed[championMasteryList.championId].id;  
  }
  for (let i = 0; i < 3; i++) {
    imageURLs[i] = (`http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${champIDArray[i]}_0.jpg`);
  }
};
// Gets top 3 champions
const getMastery = async (request, response) => {
  const responseJSON = {
    message: 'masteryObject gotten SuccessFully',
    imageURLs,
    champIDArray,
  };
  LeagueAPI.getSummonerByName('Oracra')
    .then((accountObj) => LeagueAPI.getChampionMastery(accountObj))
     .then((championMasteryListPromise) => {
      championMasteryList = championMasteryListPromise;
      return setTop3Mastery();
    }).then(() => {
    })
    .catch(console.error);
  

  return respondJSON(request, response, 200, responseJSON);
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

};
