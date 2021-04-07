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

    const pfizerURL = 'https://data.cdc.gov/resource/saz5-9hgg.json?$limit=63';
    const modernaURL = 'https://data.cdc.gov/resource/b7pe-5nws.json?$limit=63';
    const jansUrl = 'https://data.cdc.gov/resource/w9zu-fywh.json?$limit=63';

    /**
     * @description Get Data From Data CDC API to retreive
     *              data relating to Coid-19 vaccine
     *              this included infromation on the Moderna,
     *              Pfizer, and Janssen vaccine
     * 
     * 
     * 
     * 
     */
    async function getVacData(){


        //Fetch Data 
        let pResponse = await fetch(pfizerURL);
        let pfizerData = await pResponse.json();

        let mResponse = await fetch(modernaURL);
        let modernaData = await mResponse.json();

        let jResponse = await fetch(jansUrl);
        let jansData = await jResponse.json();


        console.log('Inserting Pfizer Data');

        for(var row in pfizerData){

            var loc = nameConv[pfizerData[row].jurisdiction.replace(/\s/g,"")];
            if(typeof loc !== 'undefined'){

            var onlyDate = pfizerData[row].week_of_allocations.slice(0,-13);
            var dateFormat = onlyDate.substring(5,7) + '/' + onlyDate.substring(8,10) + '/' + onlyDate.substring(0,4);
            var totalVac = pfizerData[row]._1st_dose_allocations + pfizerData[row]._2nd_dose_allocations;
    
        

            let pfizerInsert = {
            vacID : 'pf' + onlyDate + loc,
            location : pfizerData[row].jurisdiction,
            week_of_allocation : dateFormat,
            vaccine_amount : totalVac,
            vaccine_type : 'Pfizer'
            
            }


            insertVac(pfizerInsert);
        }
    }
        console.log('Inserting Moderna Data');
    for(var row in modernaData){

        var loc = nameConv[modernaData[row].jurisdiction.replace(/\s/g,"")];
        if(typeof loc !== 'undefined'){

        var onlyDate = modernaData[row].week_of_allocations.slice(0,-13);
        let dateFormat = onlyDate.substring(5,7) + '/' + onlyDate.substring(8,10) + '/' + onlyDate.substring(0,4);
        var totalVac = modernaData[row]._1st_dose_allocations + modernaData[row]._2nd_dose_allocations;


        let modernaInsert = {
        vacID : 'mo' + onlyDate + loc,
        location : modernaData[row].jurisdiction,
        week_of_allocation : dateFormat,
        vaccine_amount : totalVac,
        vaccine_type : 'Moderna'
        
        }

    

        insertVac(modernaInsert);
        }
    }
    console.log('Inserting Janssen Data');
    for(var row in jansData){

        var loc = nameConv[jansData[row].jurisdiction.replace(/\s/g,"")];
        if(typeof loc !== 'undefined'){

        var onlyDate = jansData[row].week_of_allocations.slice(0,-13);
        let dateFormat = onlyDate.substring(5,7) + '/' + onlyDate.substring(8,10) + '/' + onlyDate.substring(0,4);

        let jansInsert = {
        vacID : 'ja' + onlyDate + loc,
        location : jansData[row].jurisdiction,
        week_of_allocation : dateFormat,
        vaccine_amount : jansData[row]._1st_dose_allocations,
        vaccine_type : 'Janssen'
        
        }

    
    
        insertVac(jansInsert);
        }
    }

    endConnection();

}

    getVacData();


