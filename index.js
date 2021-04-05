const axios = require("axios");
const CircularJSON = require('circular-json');
const fetch = require('node-fetch');
const fs = require('fs');

/**
 * @description Meant to fetch data from the CDC proivded API
 *              to retrieve data from certain parameters
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
   
    //Keeps lookinf for data if data from submission date contained none
    while(data.length == 0){
        //Sets date to one day prior to one the one its at right now
        date.setDate(date.getDate()-1);
        submission_date = await date.toISOString().slice(0, -14);

        console.log('New Date: ' + submission_date);
        //fetches data from new submission date
        cdcResponse = await fetch(url + submission_date + param);
        data = await cdcResponse.json();
        }
    
    console.log("found data for this date: " + submission_date);
    
    //return the JSON object 
    return data;
    }

    const pfizerURL = 'https://data.cdc.gov/resource/saz5-9hgg.json?week_of_allocations=2021-04-05T00:00:00.000';
    const modernaURL = 'https://data.cdc.gov/resource/b7pe-5nws.json?week_of_allocations=2021-04-05T00:00:00.000';
    const jansUrl = 'https://data.cdc.gov/resource/w9zu-fywh.json?week_of_allocations=2021-04-05T00:00:00.000';

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

        
  
        // while(cdcData.length == 0){
        //     console.log('NO DATA');
        // }
    
        //console.log(pfizerData);
        //Returns JSON with data 
        //return ;

    }


module.exports.getVac = getVacData;
module.exports.getAPIData = getCDCdata;

