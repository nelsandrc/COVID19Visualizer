var covidData = require('../index.js').getAPIData;
var getConnection = require('../Database.js').getConnection;
const insertStatement = require('../Database.js').insertStatement;


describe("Covid Data Retrival Functionality", () => {
    it("Checks to seee if theres data from specified date", async () => {
        var {data} = await covidData();
        expect(data[0].submission_date).toEqual('2021-03-14T00:00:00.000');
    })
})

describe('Database Functionality', () => {
    it('Checks if connection exists', () => {
        var connection = getConnection();
        expect(typeof connection).toEqual(typeof JSON);

    })
    it('Checks if data was inserted into Database', () => {
        var data =  {
        ID: '20211003WI',
        date: '2021-14-03',
        location: 'Wisconsin',
        totaltest: 32323,
        n_cases: 23233,
        totalconfirm: 2323,
        recoverrate: 3,
        n_death: 2323,
        totaldeath: 353323
        }    
        var status = insertStatement(data);
        expect(status).toBeTrue;
    })
})

 