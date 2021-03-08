let LeagueAPI = require('leagueapiwrapper');

leagueAPIKey = 'RGAPI-ef3f0e2a-bc23-49f4-b70c-c344a45b4d9e';

LeagueAPI = new LeagueAPI(leagueAPIKey, Region.NA);

const getSummoner = (name) => {
    LeagueAPI.getSummonerByName('Oracra')
    .then((accountInfo) => {
        // do something with accountInfo
	console.log(accountInfo);
    })
    .catch(console.error);
};

const getMastery = () => {
    LeagueAPI.getSummonerByName('Oracra')
	.then((accountObj) => {
		// Returns a list of every single champion played by the account, along with mastery details
		return LeagueAPI.getChampionMastery(accountObj);
        // image url http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/Aatrox_0.jpg
	})
	.then((championMasteryList)
	=> {
		console.log(championMasteryList[0], championMasteryList[1], championMasteryList[2]);
	})
    .then((championMasteryList)
	=> {
		// get champion images/id
        const champIDArray = [];
        for (let i = 0; i < 3; i++) {
            champIDArray.push(championMasteryList[i].championId);
        }


        
	})
	.catch(console.error);
};

module.exports = {
    getSummoner,
    getMastery,
  };
  
