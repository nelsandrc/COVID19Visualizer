const fetch = require('node-fetch');
const connection = require('./Database.js');
const endConnection = connection.endConnection;
const insertVac = connection.insertVaccine;


const nameConv = {
    Alabama: 'AL',
    Alaska: 'AK',
   Arizona: 'AZ',
   Arkansas: 'AR',
   California: 'CA',
   Colorado: 'CO',
   Connecticut: 'CT',
   Delaware: 'DE',
   Florida: 'FL',
   Georgia: 'GA',
   Hawaii: 'HI',
   Idaho: 'ID',
   Illinois: 'IL',
   Indiana: 'IN',
   Iowa: 'IA',
   Kansas: 'KS',
   Kentucky: 'KY',
   Louisiana: 'LA',
   Maine: 'ME',
   Maryland: 'MD',
   Massachusetts: 'MA',
   Michigan: 'MI',
   Minnesota: 'MN',
   Mississippi: 'MS',
   Missouri: 'MO',
   Montana: 'MT',
   Nebraska: 'NE',
   Nevada: 'NV',
   NewHampshire: 'NH',
   NewJersey: 'NJ',
   NewMexico: 'NM',
   NewYork: 'NY',
   NorthCarolina: 'NC',
   NorthDakota: 'ND',
   Ohio: 'OH',
   Oklahoma: 'OK',
   Oregon: 'OR',
   Pennsylvania: 'PA',
   RhodeIsland: 'RI',
   SouthCarolina: 'SC',
   SouthDakota: 'SD',
   Tennessee: 'TN',
   Texas: 'TX',
   Utah: 'UT',
   Vermont: 'VT',
   Virginia: 'VA',
   Washington: 'WA',
   WestVirginia: 'WV',
   Wisconsin: 'WI',
   Wyoming: 'WY'
   };



    /**
     * @description Get Data From Data CDC API to retreive
     *              data relating to Coid-19 vaccine
     *              this included infromation on the Moderna,
     *              Pfizer, and Janssen vaccine. Then calls function
     *              to insert data
     * 
     */
    async function getVacData(){

        //API URLS
        const pfizerURL = 'https://data.cdc.gov/resource/saz5-9hgg.json?$limit=63';
        const modernaURL = 'https://data.cdc.gov/resource/b7pe-5nws.json?$limit=63';
        const jansUrl = 'https://data.cdc.gov/resource/w9zu-fywh.json?$limit=63';


        //Fetch Data 
        let pResponse = await fetch(pfizerURL);
        let pfizerData = await pResponse.json();

        await vacInsert(pfizerData,'Pfizer');

        let mResponse = await fetch(modernaURL);
        let modernaData = await mResponse.json();

        await vacInsert(modernaData,'Moderna');

        let jResponse = await fetch(jansUrl);
        let jansData = await jResponse.json();

        await vacInsert(jansData,'Janssen');

        endConnection();


}

/**
 * @description This is a function that takes Vaccine data, 
 *              formats the data to make it approriate for our 
 *              database, and then inserts the data
 * 
 * 
 * @param {Object} vacData Data retrieved from Json from CDC API
 * @param {String} type Type of vaccine (ie. Moderna, Pfizer, Janssen)
 */
function vacInsert(vacData, type){

    console.log('INSERTING '+ type + ' VACCINE DATA' )

    for(var row in vacData){
        //gets state abbriveation for row ID
        var loc = nameConv[vacData[row].jurisdiction.replace(/\s/g,"")];
        //gets vaccine variable to put into row ID
        var ID = type.substring(0,2).toLowerCase();

        //If state is not defined in our 50 states then it wont format and insert it
        if(typeof loc !== 'undefined'){
        //gets date without time stamp
        var onlyDate = vacData[row].week_of_allocations.slice(0,-13);
        //puts date into fomrat wanted (MM/DD/YYYY)
        let dateFormat = onlyDate.substring(5,7) + '/' + onlyDate.substring(8,10) + '/' + onlyDate.substring(0,4);

        //Janssen only has 1 dose allocation and checks for it. 
        var totalVac = 0;
        if(type === 'Janssen'){
            totalVac = vacData[row]._1st_dose_allocations;
        }
        else
            totalVac = vacData[row]._1st_dose_allocations + vacData[row]._2nd_dose_allocations;
       
        //sets up row of data to isnert
        let vacInsert = {
        vacID : ID + onlyDate + loc,
        location : vacData[row].jurisdiction,
        week_of_allocation : dateFormat,
        vaccine_amount : totalVac,
        vaccine_type : type
        }
        
        //executs insertion of data
        insertVac(vacInsert);
        }
    }
}

    getVacData();


