var inquirer = require('inquirer');
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
});

/*prompt the executive with two choices to either view product sales by department or create a
new department*/
var executiveStart = function(){
	inquirer.prompt([{name: 'executiveChoice',
					  type: 'list',
					  message: 'Choose one of the following',
				      choices: ['View Product Sales by Department', 'Create New Department']}
				      ]).then(function(answers){
				      	console.log(answers);
				      	switch(answers.executiveChoice){
				      		case 'View Product Sales by Department':
				      		console.log('view');
				      		break;
				      		case 'Create New Department':
				      		console.log('create');
				      		break;
				      	}
				      })
}

executiveStart();