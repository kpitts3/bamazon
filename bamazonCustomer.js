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

  var tableHeading = new Table ({head:
    ["                       Welcome To Bamazon!\n                   Database Shopping Made Easy\n         Below Are Items Currently Available For Purchase"], 
    colWidths: [68]})

  console.log(tableHeading.toString());
  showTable();

  setTimeout(buyItem, 1000)
});


//Promote user for input regarding purchase
function buyItem() {

  inquirer
    .prompt([{
      name: "id",
      message: "What is the id of the item you would like to purchase?"
    },
    {
      name: "qty",
      message: "How many would you like to buy?"
    }])
    .then(function (answer) {

      if (isNaN(answer.id) || answer.id > 10) {
        console.log("You have selected an item that is not in the list.");
        buyItem()
      }
      else {
        updateProduct(answer.id, answer.qty);
      }
  });
}

//Populate database table
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

//Update item quantity
function updateProduct(id, qty) {

  var query = "SELECT stock_quantity FROM products WHERE item_id =" + id;
  connection.query(query, function (err, res) {
    var item_qty = JSON.stringify(res[0].stock_quantity);

    if (parseInt(qty) > parseInt(item_qty)) {
      console.log("Insufficient quantity!");
      setTimeout(buyItem, 1000)
    }
    else {
      console.log("Your in luck we have have that item in stock!");
      console.log("You have successfully purchased " + qty + "Units of item # " + id);

      connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: item_qty - qty
          },
          {
            item_id: id
          }
        ],
        function (err, res) {

          // Call deleteProduct AFTER the UPDATE completes
          showTable();
          setTimeout(buyItem, 1000)
          item_qty = 0;
        }
      );
    }
  });
}