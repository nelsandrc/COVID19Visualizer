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

    })

};

/**
 * @description Inserts Array of Vaccine data into into Database
 *              into Vaccine_report table 
 * 
 * 
 * @param {Array} data 
 */
 exports.insertVaccine = function(data){

    connection.query('INSERT INTO Vaccine_Report SET ?', data, (err,results)=> {
        if(err)  console.log(err);

    })

};


//Ends connecion to our database
exports.endConnection = function() {
        connection.end();
    }

