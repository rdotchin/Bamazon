var inquirer = require('inquirer');
var mysql = require('mysql');
require('console.table');

//connect to the database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'Bamazon'
})

connection.connect(function(err){
	if(err) {
		console.error('error connecting: ' + err.stack);
	}
	
});

//show products available in Bamazon database Products table
var start = function(){
	connection.query('SELECT * FROM `Products`', function(error, results, fields){
		if(error){
			console.log("error: " + error);
		}
		//log Bamazon table using console.table npm
		console.table(results);
		//call function to ask customr which product they would like
		idQuery();
	});
	
}

//ask the customer which item they would like to purchase
var idQuery = function(){
	inquirer.prompt([{name: 'userID',
				      type: 'input',
					  message: 'Choose the ID of the product you would like to purchase',
					  validate: function(value){
					  	if(!isNaN(value)){
					  		return true
					  	} 
					  	else {
					  		console.log('\nError, please enter an itemID number\n');
					  	}
					    }}]).then(function(answers){
		/*call function asking the customer for the amount they would like and passing in the 
		product ID they selected*/
		amountQuery(Math.floor(answers.userID));
	})

}

//ask the customer how many of the item they selected they would like to purchase
var amountQuery = function(productID) {
	inquirer.prompt([{type: 'input',
					  name: 'userAmount',
					  message: 'How many units would you like to purchase?',
					  validate: function(value){
					  	if(!isNaN(value)){
					  		return true
					  	} 
					  	else {
					  		console.log('\nError, please enter a number\n');
					  	}
					  	}}]).then(function(answers){
		/*call function to select the item in the MySQL table, update the quantity and
		provide the total price passing in the product ID and amount chosen*/
		selectItem(productID, Math.floor(answers.userAmount));
	})
}

/*select the item from MySQL table, update the table with the quanttity after purchase, notify
customer of total price*/
var selectItem = function(productID, amount){
	connection.query('SELECT * FROM Products WHERE itemID = ?', [productID], function(error, results, fields){
		if(error){console.log(error);} 
		//if out of stock it will notify the customer and ask them to make a new purchase
		else if(amount > results[0].StockQuantity){
			console.log("Insufficient quantity!");
			return start();
		} 
		else {
		var deptName = results[0].DepartmentName;
		var price = results[0].Price * amount;
		var updatedQuant = results[0].StockQuantity - amount;

		//receipt for customer
		var receipt = '\nItem: ' + results[0].ProductName + '\nAmount: ' + amount + '\nTotal purchase: $' + price;
		console.log(receipt);
		}
		//connect to MySQL tabl and update the stock quantity then ending connection
		connection.query('UPDATE Products SET StockQuantity = ? WHERE itemID = ?', [updatedQuant, productID], function(error, results, fields){
			if(error){console.log(error);}

			console.log("Thank you for your business!\n");
			calcTotalSales(price, deptName);
			/*connection.destroy();*/
		})
		
	})

}

//calculate the TotalSales from the department table with the amount purchased
var calcTotalSales = function(amount, department){
	connection.query('SELECT TotalSales FROM Departments WHERE DepartmentName = ?', [department], function(error, results, fields){
		if(error){console.log(error);}
		var amountPlusSales = amount + results[0].TotalSales;
		addTotalSales(amountPlusSales, department);

	})
}

//update the table with the calculated total sales number
var addTotalSales = function(amount, department){
	connection.query('UPDATE Departments SET TotalSales = ? WHERE DepartmentName = ?', [amount, department], function(error, results, fields){
		if(error){console.log(error);}
		connection.destroy();
	})
}
//calling the start function to begin the purchase process
start();






 
