// * Create a new Node application called `bamazonManager.js`. Running this application will:
//Set package requirements
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

//Establish database connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Pet2nia!",
  database: "bamazonDB"
});

//Connect to database then call functions
connection.connect(function (err) {
  if (err) throw err;

  var tableHeading = new Table({ head: 
  ["                       Welcome To Bamazon!\n                   Database Shopping Made Easy\n             You have accessed the Manager Terminal"], 
  colWidths: [68] })
  
  console.log(tableHeading.toString());
  managerOptions();
});

//   * List a set of menu options:
//     * View Products for Sale
//     * View Low Inventory
//     * Add to Inventory
//     * Add New Product

function managerOptions() {

  inquirer
    .prompt([{
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }])
    .then(function (answer) {

      switch (answer.choice) {
        case "View Products for Sale":
          showTable();
          setTimeout(managerOptions, 1000);
          break;

        case "View Low Inventory":
          lowInventory()
          setTimeout(managerOptions, 1000);
          break;

        case "Add to Inventory":
          updateInventory()
          break;

        case "Add New Product":
          newProduct()
          break;
      }
   });
}

//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

function showTable() {
  var table = new Table({ head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'] })

  var query = "SELECT * FROM products";
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.log(table.toString());
  });
}

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

function lowInventory() {
  var table = new Table({ head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'] })

  var query = "SELECT * FROM products WHERE stock_quantity < 5";
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.log(table.toString());
  });
}

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

function updateInventory() {

  inquirer
    .prompt([{
      name: "id",
      message: "What is the id of the item you are adjusting inventory for?"
    },
    {
      name: "qty",
      message: "How much inventory do you want to add?"
    }])
    .then(function (answer) {

      var query = "SELECT stock_quantity FROM products WHERE item_id =" + answer.id;
      connection.query(query, function (err, res) {
        var item_qty = JSON.stringify(res[0].stock_quantity);

        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: parseInt(item_qty) + parseInt(answer.qty)
            },
            {
              item_id: answer.id
            }
          ],
          function (err, res) {
            console.log("Inventory Adjustment Successful!")
            // Call deleteProduct AFTER the UPDATE completes
            setTimeout(showTable,2000);
            setTimeout(managerOptions, 3000);
            item_qty = 0;
          }
        );
    });
  });
}

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

function newProduct() {

  inquirer
    .prompt([{
      name: "product",
      message: "What is the name of the product you would like to add?"
    },
    {
      name: "department",
      message: "What department would you like to add the item to?"
    },
    {
      name: "price",
      message: "What is the price of this item?"
    },
    {
      name: "qty",
      message: "How many do you have in stock?"
    }])
    .then(function (answer) {

      var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
      var values = [[answer.product, answer.department, answer.price, answer.qty]];
      connection.query(query, [values], function (err, res) {
        if (err) throw err;
        console.log("Number of records inserted: " + res.affectedRows);
        showTable();
        setTimeout(managerOptions, 1000);
      });
  });
}