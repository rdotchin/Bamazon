var prompt = require('prompt');
var mysql = require('mysql');
require('console.table');

//connect to the database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'sigepfenderp',
	database: 'Bamazon'
})

connection.connect(function(err){
	if(err) {
		console.error('error connecting: ' + err.stack);
	}
	console.log('connected as id ' + connection.threadId);
});

//show products available in Bamazon database Products table
function showProducts(){
	connection.query('SELECT * FROM `Products`', function(error, results, fields){
		if(error){
			console.log("error: " + error);
		}
		//log Bamazon table using console.table npm
		console.table(results);
		
	});
}

showProducts();


 
