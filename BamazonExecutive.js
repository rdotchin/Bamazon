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
				      choices: ['View Product Sales by Department', 'Create New Department', 'Exit']}
				      ]).then(function(answers){
				      	switch(answers.executiveChoice){
				      		case 'View Product Sales by Department':
				      		viewProducts();
				      		break;
				      		case 'Create New Department':
				      		createDepartment();
				      		break;
				      		case 'Exit':
				      		connection.destroy();
				      	}
				      })
}

var viewProducts = function(){
	//Select statement that subtracts sales from costs and shows them as a temporary column called TotalProfit
	var query = 'SELECT *, `TotalSales` - `OverHeadCosts` AS `TotalProfit` FROM Departments;'
	connection.query(query, function(error, results, fields){
		console.table(results);
		executiveStart();
	})
}

//allows executive to create a department in the Departments table
var createDepartment = function(){
	inquirer.prompt([{name: 'department',
					type: 'input',
					message: 'Name of the department'},
					{name: 'overhead',
					type: 'input',
					message: 'What is the overhead cost',
					validate: function(value){
					  	if(!isNaN(value)){
					  		return true
					  	} 
					  	else {
					  		console.log('\nenter a number\n');
					  	}
					}},
					{name: 'sales',
					type: 'input',
					message: 'What are the products total sales',
					validate: function(value){
					  	if(!isNaN(value)){
					  		return true
					  	} 
					  	else {
					  		console.log('\nenter a number\n');
						}
					}}]).then(function(answers){

					  		var query = 'INSERT INTO `Departments` SET ?'
					  		connection.query(query, {
					  			DepartmentName: answers.department,
					  			OverHeadCosts: answers.overhead,
					  			TotalSales: answers.sales
					  		}, function(err, res){
					  			if(err){console.log(err);}
					  			console.log('\nNew Department Successfully Added\n');
					  			executiveStart();
					  		})
					  	})
}
executiveStart();