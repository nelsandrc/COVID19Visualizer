const mysql = require('mysql');

//Creates connection to our mySQL databse
const connection = mysql.createConnection({
    host: 'covid-database.cnj4vtrjfe9w.us-east-2.rds.amazonaws.com',
    user: 'covidAdmin',
    password: 'Hmd43gy7TtEn',
    database: 'Covid',

    });

//Enables Created mySQL connnection
connection.connect(function(err) {
    if (err) {
       console.log("Got Error: " + err.stack);
   }
        console.log("Connection Succesful!");
        console.log("Connected as id " + connection.threadId);
       connectSuccess = true;
       
    });


    exports.getConnection = function() {
        return connection;
    }

        
/**
 * @description Inserts Array of data into into Database
 *              into Covid_report table 
 * 
 * 
 * @param {Array} data 
 */
exports.insertStatement = function(data){

    connection.query('INSERT INTO Covid_report SET ?', data, (err,results)=> {
        if(err)  console.log(err);
        
            return true;
        //console.log('Inserting Row');

    })

};

//Retrieves data from our mySQL database
exports.getStatement = connection.query('SELECT * FROM Covid_report', function (error, results, fields) {
        if(error){
            throw error;
        }

    
    })

//Ends connecion to our database
exports.endConnection = function() {
        connection.end();
    }

/* connection.connect(function(err) {
if (err) {
    console.log("Got Error: " + err.stack);
}
    console.log("Connection Succesful!");
    console.log("Connected as id " + connection.threadId);

});

const dataToInsert = {
    ID: '20211003WI',
    date: '2021-10-03',
    location: 'Wisconsin',
    totaltest: 32323,
    n_recover: 23233,
    totalconfirm: 2323,
    recoverrate: 3,
    n_death: 2323,
    deathrate: 353323
};

connection.query('INSERT INTO Covid_report SET ?', dataToInsert, (err,results) => {
    if(err) throw err;

    console.log('Last insert ID: ', results.insertId);
} )

connection.query('SELECT * FROM Covid_report', function (error, results, fields) {
    if(error){
        throw error;
    }

    results.forEach(result => {
        console.log(result);
    })

});

connection.end(); */
