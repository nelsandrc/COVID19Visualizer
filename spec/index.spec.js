var getConnection = require('../Database.js').getConnection;
const fetch = require('node-fetch');


describe("Covid Data Retrival Functionality", () => {
    it("Checks to seee if returns data from specified date", async () => {
        const url = 'https://data.cdc.gov/resource/9mfq-cb36.json?submission_date=2021-04-06';
        //Paramaters we want from JSON
        const param = '&$select=submission_date,state,tot_cases,new_case,tot_death,new_death';

        const response = await fetch(url+param);
        const data = await response.json();
        expect(data[0].submission_date).toEqual('2021-04-06T00:00:00.000');

        expect(data[0].state).toBeDefined();
        expect(data[0].tot_cases).toBeDefined();
        expect(data[0].new_case).toBeDefined();
        expect(data[0].tot_death).toBeDefined();
        expect(data[0].new_death).toBeDefined();
    })
})

describe("Test Vaccine Data Retrival Functionality", () => {
    it('Checks to see if there is data for specified date', async () => {
        var data = await fetch('https://data.cdc.gov/resource/saz5-9hgg.json?$limit=63');
        expect(typeof data).toBeDefined();
        var vacData = await data.json();

        expect(vacData[0].jurisdiction).toBeDefined();
        expect(vacData[0].week_of_allocations).toBeDefined();
        expect(vacData[0]._1st_dose_allocations).toBeGreaterThan(0);
        expect(vacData[0]._2nd_dose_allocations).toBeGreaterThan(0);
    })
})

describe('Database Functionality', () => {
    it('Checks if connection exists', () => {
        var connection = getConnection();
        expect(typeof connection).toEqual(typeof JSON);

    })

    })

 