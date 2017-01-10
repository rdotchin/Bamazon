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

inquirer.prompt([{name: 'managerChoice',
				   type: 'rawlist',
				   message: 'Manager Options',
				   choices: ['Veiw Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']	
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
		console.log(4);
		break;
	}
})

//list every available item
var allInventory = function(){
	connection.query('SELECT * FROM `Products`', function(error, results, fields){
		if(error){console.log(error);}
		console.table(results);
		connection.destroy();
	})
}


//list all items with an inventory count lower than 5
var lowInventory = function(){
	connection.query('SELECT * FROM `Products` WHERE `StockQuantity` < 5', function(error, results, fields){
		if(error){console.log(error);}
		//add in if there is no low inventory
		console.table(results);
		connection.destroy();
	})
}

//display a prompt that will let the manager "add more" of any item currently in the store
var addInventory = function(){
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
					  			allInventory();
					  	})
					  })
}

//allow the manager to add a completely new product to the store.