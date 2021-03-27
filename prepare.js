const covidData = require('./index.js').getAPIData;
const stateData = require('./index.js').getStateData;
const connection = require('./Database.js');
const endConnection = connection.endConnection;
const insertStatement = connection.insertStatement;
const getStatement = connection.getStatement;

//Location Name Conversions
const nameConv = {
 AL: 'Alabama'	,
	AK: 'Alaska',
AZ: 'Arizona',
AR: 'Arkansas',
CA: 'California',
CO: 'Colorado',
CT: 'Connecticut',
DE: 'Delaware',
FL: 'Florida',
GA: 'Georgia',
HI: 'Hawaii',
ID: 'Idaho',
IL: 'Illinois',
IN: 'Indiana',
IA: 'Iowa',
KS: 'Kansas',
KY: 'Kentucky',
LA: 'Louisiana',
ME: 'Maine',
MD: 'Maryland',
MA: 'Massachusetts',
MI: 'Michigan',
MN: 'Minnesota',
MS: 'Mississippi',
MO: 'Missouri',
MT: 'Montana',
NE: 'Nebraska',
NV: 'Nevada',
NH: 'New Hampshire',
NJ: 'New Jersey',
NM: 'New Mexico',
NY: 'New York',
NC: 'North Carolina',
ND: 'North Dakota',
OH: 'Ohio',
OK: 'Oklahoma',
OR: 'Oregon',
PA: 'Pennsylvania',
RI: 'Rhode Island',
SC: 'South Carolina',
SD: 'South Dakota',
TN: 'Tennessee',
TX: 'Texas',
UT: 'Utah',
VT: 'Vermont',
VA: 'Virginia',
WA: 'Washington',
WV: 'West Virginia',
WI: 'Wisconsin',
WY: 'Wyoming'
};

//Locations not to Include
const skipLoc = [ 'AS','DC','FSM','GU','MP','NYC','PR','PW','RMI','VI'];


/**
 * @description Takes data from APIs, does formatting on data,
 *              and then sends data to Database through set connection
 *              and then ends connection
 */
async function execute(){

    console.log('Executing');
    var {data} = await covidData();
    
    //console.log(data);

    //console.log('Gettign state data');
    //var {stateD} = await stateData();

    //console.log(stateD);
    console.log('Begining Insertion of Data');
    //Inserts each row of data into the mySQL
    for(var row in data){

      //Skips location if is list of undesired locations
      if(!skipLoc.includes(data[row].state)){

        let onlyDate = data[row].submission_date.slice(0, -13);
        let loc = nameConv[data[row].state];

        let dataToInsert = {
            ID: onlyDate + data[row].state,
            date: onlyDate,
            location: loc,
            totaltest: '0',
            n_cases: data[row].new_case,
            totalconfirm: data[row].tot_cases,
            recoverrate: '4',
            n_death: data[row].new_death,
            totaldeath: data[row].tot_death
        };

        insertStatement(dataToInsert);
        }
    }
    
    console.log('Completed Insertion of Data');

  let dbData = getStatement._results;

  //console.log(dbData);

endConnection();

}

execute();



