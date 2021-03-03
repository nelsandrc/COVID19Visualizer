//Javascript library to make HTTP requests
// supports error handling so we dont have to. 
const axios = require('axios');
const cherrio = require('cheerio');
const fs = require('fs');

//example of just getting website data
const url = 'https://www.bls.gov/web/laus/laumstrk.htm';


const writeStream = fs.createWriteStream('data.csv');


async function getUnemploymentRate() {
    //leads website data into cheerio 
    const { data } = await axios.get(url);
    const $ = cherrio.load(data);
    
    //gets table containing Unemployment rate data
    const table = $('caption:contains("Unemployment Rates for States")').parent().find('tbody');

    //prints out html data from website
    console.log(table.html());

    //table for data
    let tableData = [["State", "Unemployment Rate"]];

    writeStream.write('State, Unemployment Rate \n');

    table.find('tr').each((i, element) => {
        //takes each table row
        let el = $(element);    
        //finds state which have distinct p element
        const state = el.find('p').text().trim();
        //finds states rate which has distinct text segment. 
        const rate = el.find('td[headers*="laumstrk.h.2"]').text().trim();
        //adds it to table
        tableData.push([state, rate]);

        writeStream.write(state + ', ' + rate + '\n');
        
    })
    console.log(tableData);
    }


getUnemploymentRate();