const covidData = require('./index.js').getAPIData;
const stateData = require('./index.js').getStateData;
const connection = require('./Database.js');
const endConnection = connection.endConnection;
const insertStatement = connection.insertStatement;
const getStatement = connection.getStatement;


/**
 * @description Takes data from APIs, does formatting on data,
 *              and then sends data to Database through set connection
 *              and then ends connection
 */
async function execute(){

    console.log('Exectuing Code');
    var {data} = await covidData();
    
    //console.log(data);

    console.log('Gettign state data');
    var {stateD} = await stateData();

    //console.log(stateD);

    for(var row in data){
        let onlyDate = data[row].submission_date.slice(0, -13);
        let dataToInsert = {
            ID: onlyDate + data[row].state,
            date: onlyDate,
            location: data[row].state,
            totaltest: '0',
            n_cases: data[row]. new_case,
            totalconfirm: data[row].tot_cases,
            recoverrate: '4',
            n_death: data[row].new_death,
            totaldeath: data[row].tot_death

        };

        //console.log(dataToInsert);
        insertStatement(dataToInsert);
    }


  //insertStatement(dataToInsert);

  let dbData = getStatement._results;

  //console.log(dbData);

endConnection();

}

execute();



