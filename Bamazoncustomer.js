var inquirer = require('inquirer');
var mysql = require('mysql');
require('console.table');
var custID;
var howMany;
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
	/*console.log('connected as id ' + connection.threadId);*/
});

//show products available in Bamazon database Products table
var start = function(){
	connection.query('SELECT * FROM `Products`', function(error, results, fields){
		if(error){
			console.log("error: " + error);
		}
		//log Bamazon table using console.table npm
		console.table(results);
		idQuery();
	});
	
}

var idQuery = function(){
	inquirer.prompt([{type: 'input',
					  name: 'userID',
					  message: 'Choose the ID of the product you would like to purchase'}]).then(function(answers){
		if(isNaN(answers.userID)){
			console.log('pick a number dummy')
			idQuery();
		} else{
		console.log('ID: ' + answers.userID);
	}

	})
}

var amountQuery = function() {
	inquirer.prompt([{type: 'input',
					  name: 'userAmount',
					  message: 'How many units would you like to purchase?'}]).then(function(answers){
		console.log('Amount: ' + answers.userAmount);
	})
}

start();

/*
showProducts();*/

//prompt user with 2 questions


//check to see if store has quantity, if not reply Insufficient quantity!
//else update SQL database to reflect the remaining quantity 
//show the customer the total cost of their purchase
/*connection.query('UPDATE Products SET ')*/




 
