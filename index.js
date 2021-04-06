const fetch = require('node-fetch');
const connection = require('./Database.js');
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
     * @description Get Data From Data USA API to retreive
     *              data with certain parameters which include,
     *              the Median Household Income of each state and 
     *              will retrieve the latest data  
     * 
     * 
     * @returns JSON Object with 
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

        console.log(pfizerData[0]);
        console.log(modernaData[0]);
        console.log(jansData[0]);



        for(var row in pfizerData){

            var loc = nameConv[pfizerData[row].jurisdiction];
            if(typeof loc !== 'undefined'){

            var date = pfizerData[row].week_of_allocations.slice(0,-13);
            var totalVac = pfizerData[row]._1st_dose_allocations + pfizerData[row]._2nd_dose_allocations;
    
        

            let pfizerInsert = {
            vacID : 'pf' + date + loc,
            location : pfizerData[row].jurisdiction,
            week_of_allocation : date,
            vaccine_amount : totalVac,
            vaccine_type : 'Pfizer'
            
            }

            console.log(pfizerInsert);

            insertVac(pfizerInsert);
        }
    }

    for(var row in modernaData){

        var loc = nameConv[modernaData[row].jurisdiction];
        if(typeof loc !== 'undefined'){

        var date = modernaData[row].week_of_allocations.slice(0,-13);
        var totalVac = modernaData[row]._1st_dose_allocations + modernaData[row]._2nd_dose_allocations;


        let modernaInsert = {
        vacID : 'mo' + date + loc,
        location : modernaData[row].jurisdiction,
        week_of_allocation : date,
        vaccine_amount : totalVac,
        vaccine_type : 'Moderna'
        
        }

        console.log(modernaInsert);

        //insertVAc(modernaInsert);
        }
    }

    for(var row in jansData){

        var loc = nameConv[jansData[row].jurisdiction];
        if(typeof loc !== 'undefined'){

        var date = jansData[row].week_of_allocations.slice(0,-13);


        let jansInsert = {
        vacID : 'ja' + date + loc,
        location : jansData[row].jurisdiction,
        week_of_allocation : date,
        vaccine_amount : jansData[row]._1st_dose_allocations,
        vaccine_type : 'Janssen'
        
        }

        console.log(jansInsert);
        }
    }


    }

    getVacData();


