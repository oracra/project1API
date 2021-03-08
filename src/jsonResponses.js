let LeagueAPI = require('leagueapiwrapper');
const clientHandler= require('../client/client.html');
const champsListParsed = {};
const leagueAPIKey = 'RGAPI-ef3f0e2a-bc23-49f4-b70c-c344a45b4d9e';
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
//Gets the users summoner name and profile
const getSummoner = (name) => {
  LeagueAPI.getSummonerByName('Oracra')
    .then(function (accountInfo) {
      // do something with accountInfo
      console.log(accountInfo);
    })
    .catch(console.error);
}
//Gets top 3 champions
const getMastery = () => {
  const imageURLs = {};
  const champIDArray = [];
  const responseJSON = {
    imageURLs,
  };
  LeagueAPI.getSummonerByName('Oracra')
    .then(function (accountObj) {
      // Returns a list of every single champion played by the account, along with mastery details
      return LeagueAPI.getChampionMastery(accountObj);
      //image url http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/Aatrox_0.jpg
    })
    .then(function (championMasteryList) {
      //get champion images/id
      
      for (let i = 0; i < 3; i++) {
        champIDArray.push(championMasteryList[i].championId);
      }

    }).then( getChampionList())
    .then(function (champIDArray = [], champsListParsed) {
      const urlFormat = 'http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/Aatrox_0.jpg'
     
      for(let i = 0; i < 3; i++){
        imageURLs.push(`http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${champIDArray[i]}_0.jpg`)
      }
      
      return respondJSON(request, response, 200, responseJSON);

    })
    .catch(console.error);
}

const getChampionList= ()=>{
  const responseJSON = {
    message: "List retrieved",
  };    
  
  const champsData = clientHandler.champsList;
  for (const champ in champsData) {
    console.log(champ);
    champsListParsed[champ] = {
      championKey: champ.key,  
      championId: champ.id,
    } 
  }
  return respondJSON(request, response, 200, responseJSON);

}

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
