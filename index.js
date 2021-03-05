
const axios = require("axios");
const fs = require('fs');
const CircularJSON = require('circular-json');

/**
 * @description Meant to fetch data from the CDC proivded API
 *              to retrieve data from certain parameters 
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
    let {data} = await axios.get(url + submission_date + param);

    //Keeps lookinf for data if data from submission date contained none
    while(CircularJSON.stringify(data.data) == '[]' || data.data == null){
        //Sets date to one day prior to one the one its at right now
        date.setDate(date.getDate()-1);
        submission_date = await date.toISOString().slice(0, -14);

        console.log('New Date: ' + submission_date);
        //fetches data from new submission date
        data = await axios.get(url + submission_date + param);
    }
    
    console.log("found data for this date: " + submission_date);

    //return the JSON object 
    return data;

}

const writeFile = fs.createWriteStream('data.txt');


async function getAPIData(){

  
    const {data} = await getCDCdata();

    console.log("Got URL data");

    //writes data to file (temporary)
   data.forEach(element => writeFile.write(JSON.stringify(element) + '\n'));

};



getAPIData();