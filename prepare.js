const connection = require('./Database.js');
const endConnection = connection.endConnection;
const insertStatement = connection.insertStatement;
const fetch = require('node-fetch');


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
 * @description Meant to fetch data from the CDC proivded API
 *              with certain parameters
 *              This includes total cases, new cases, total deaths, and new deaths 
 * 
 * @return Json object called data
 */
 async function getCDCdata(){
    //CDC Rest API url
    const url = 'https://data.cdc.gov/resource/9mfq-cb36.json?submission_date=';
    //Paramaters we want from JSON
    const param = '&$select=submission_date,state,tot_cases,new_case,tot_death,new_death';


    //Creates date from todays date
    const date = new Date();
    let submission_date = date.toISOString().slice(0, -14);

    //Fetches data from API from todays date
    let cdcResponse = await fetch(url + submission_date + param);
    let data = await cdcResponse.json();

    let days = 0;
    //Keeps lookinf for data if data from submission date contained none
    while(data.length == 0 && days <= 6){
    //Sets date to one day prior to one the one its at right now
    date.setDate(date.getDate()-1);
    submission_date = await date.toISOString().slice(0, -14);

    console.log('New Date: ' + submission_date);
    //fetches data from new submission date
    cdcResponse = await fetch(url + submission_date + param);
    data = await cdcResponse.json();

    days = days + 1;
    }

    console.log("found data for this date: " + submission_date);

    //return the JSON object 
    return data;
    }


/**
 * @description Takes data from APIs, does formatting on data,
 *              and then sends data to Database through set connection
 *              and then ends connection. Code that needs to be executed on
 *              a daily basis is put here
 */
async function insertCovid(){

    console.log('Executing');
    //retreives data that was fetched from CDC API
    var data = await getCDCdata();
    
    console.log('Begining Insertion of Data');
    //Inserts each row of data into the mySQL
    for(var row in data){
      //Skips location if is list of undesired locations
      if(!skipLoc.includes(data[row].state)){

        let onlyDate = data[row].submission_date.slice(0, -13);
        let dateFormat = onlyDate.substring(5,7) + '/' + onlyDate.substring(8,10) + '/' + onlyDate.substring(0,4);
        let loc = nameConv[data[row].state];
       
        let dataToInsert = {
            ID: onlyDate + data[row].state,
            date: dateFormat,
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

endConnection();

}

insertCovid();


