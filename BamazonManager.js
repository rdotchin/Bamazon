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
	/*console.log('connected as id ' + connection.threadId);*/
});

var managerStart = function(){
		inquirer.prompt([{name: 'managerChoice',
						   type: 'rawlist',
						   message: 'Manager Options',
						   choices: ['Veiw Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit program']	
		}]).then(function(answers){
			switch(answers.managerChoice) {
				case 'Veiw Products for Sale':
				allInventory();
				break;
				case 'View Low Inventory':
				lowInventory();
				break;
				case 'Add to Inventory':
				addInventory();
				break;
				case 'Add New Product':
				addProduct();
				break;
				case 'Exit program':
				connection.destroy();
				break;
			}
		})
}
//list every available item
var allInventory = function(){
	connection.query('SELECT * FROM `Products`', function(error, results, fields){
		if(error){console.log(error);}
		console.table(results);
		managerStart();
	})
}


//list all items with an inventory count lower than 5
var lowInventory = function(){
	connection.query('SELECT * FROM `Products` WHERE `StockQuantity` < 5', function(error, results, fields){
		if(error){console.log(error);}
		//add in if there is no low inventory
		console.table(results);
		managerStart();
	})
}

var updateInventory = function(newQuant, productID){
	console.log(newQuant, productID);
	connection.query('UPDATE Products SET ? WHERE ?', [{StockQuantity: newQuant}, 
					  								    {itemID: productID}], function(err, res){
					  								    if(err){console.log(err);}
					  								    console.log('Successfully updated inventory');
					  								    managerStart();
					  									})
}
//display a prompt that will let the manager "add more" of any item currently in the store
var addInventory = function(){
	inquirer.prompt([{name: 'productChoice',
					 type: 'input',
					 message: 'Choose an itemID'},
					 {name: 'quantIncrease',
					  type: 'input',
					  message: 'Enter number of quantity to add'}]).then(function(answers){
					  		connection.query('SELECT StockQuantity FROM Products WHERE itemID = ?', [answers.productChoice], function(err, res){
					  			if(err){console.log(err);}
					  			//change user increase choice from sting to number using parseInt() then added to current stock
					  			var quantTotal = parseInt(answers.quantIncrease) + res[0].StockQuantity;
					  			var parseID = parseInt(answers.productChoice);
					  			updateInventory(quantTotal, parseID);
					  		})					  	
					  })
}



//allow the manager to add a completely new product to the store.
var addProduct = function(){
	inquirer.prompt([{name: 'product',
					  type: 'input',
					  message: 'What product would you like to add?'},
					 {name: 'department',
					  type: 'input',
					  message: 'What department?'},
					 {name: 'price',
					  type: 'input',
					  message: 'Price for this product?'},
					 {name: 'quantity',
					  type: 'input',
					  message: 'Quantity for this product?'}
					  ]).then(function(answers){
					  	//insert the new product into the Products table
					  	connection.query('INSERT INTO `Products` SET ?', {
					  		ProductName: answers.product,
					  		DepartmentName: answers.department,
					  		Price: answers.price,
					  		StockQuantity: answers.quantity}, function(err, res){
					  			if(err){console.log(err);}
					  			console.log(answers.product + ' was successfully added to the inventory: ');
					  			managerStart();
					  	})
					  })
}

//begin application
managerStart();

//allow the manager to add a completely new product to the store.