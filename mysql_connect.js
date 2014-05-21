/**
 * New node file
 */

var mysql = require('mysql');
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'Popguitar@88',
  port: '3306',
  database: 'test'
});


function insertUser(callback,firstname,lastname,email,password){
	var sql = "INSERT INTO user (password, firstname, lastname, email) VALUES('"+ password + "','" + firstname + "','" + lastname + "','" + email + "')";
	console.log(sql);
	pool.getConnection(function(err, connection){
		connection.query(sql, function(err, results) {
			if (err) {
	           throw err;
	        }
			else
			{
				callback(err, results);
			}
			console.log(results);
		});
		connection.release();
	});	
}

function insertProduct(callback,category,name,desc,cost,qty){
	var sql = "INSERT INTO products (product_name, category_id, product_desc, product_cost, product_qty) VALUES('"+ name + "', " + category + ", '" + desc + "', " + cost + ", " + qty + ")";
	console.log(sql);
	pool.getConnection(function(err, connection){
		connection.query(sql, function(err, results) {
			if (err) {
	           throw err;
	        }
			else
			{
				callback(err, results);
			}
			console.log(results);
		});
		connection.release();
	});	
}

function insertCategory(callback,name,desc){
	var sql = "INSERT INTO categories (category_name, category_desc) VALUES('"+ name + "','" + desc + "')";
	console.log(sql);
	pool.getConnection(function(err, connection){
		connection.query(sql, function(err, results) {
			if (err) {
	           throw err;
	        }
			else
			{
				console.log(results);
				callback(err, results);
			}
		});
		connection.release();
	});	
}

function validateUser(callback,email,password){
	console.log("Email: " + email + "Password: " + password);
	var sql = "SELECT * FROM user where email = '" + email + "'" + "and password = '" + password + "'";
	pool.getConnection(function(err, connection){
		  connection.query( sql,  function(err, rows){
		  	if(err)	{
		  		throw err;
		  	}else{		  		
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);		  		
		  	}
		  });		  
		  connection.release();
		});	
}

function getProducts(callback, category){
	console.log("Category: " + category);
	var sql = "SELECT * FROM products,categories where categories.id = products.category_id and categories.id = " + category;
	pool.getConnection(function(err, connection){
		  connection.query( sql,  function(err, rows){
		  	if(err)	{
		  		throw err;
		  	}else{
		  		if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
		  		}
		  	}
		  });		  
		  connection.release();
		});
}

function getAddedProduct(callback, product_id){
	console.log("Product Id: " + product_id);
	var sql = "SELECT * FROM products WHERE products.product_id = " + product_id;
	pool.getConnection(function(err, connection){
		  connection.query( sql,  function(err, rows){
		  	if(err)	{
		  		throw err;
		  	}else{
		  		if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
		  		}
		  	}
		  });		  
		  connection.release();
		});
}

function getCategories(callback){
	var sql = "SELECT * FROM categories";
	pool.getConnection(function(err, connection){
		  connection.query( sql,  function(err, rows){
		  	if(err)	{
		  		throw err;
		  	}else{
		  		if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
		  		}
		  	}
		  });		  
		  connection.release();
		});
}

function updateQty(callback, deleteString){
	console.log("Updated qtys for: " + deleteString);
	var sql = "UPDATE products SET product_qty = product_qty - 1 WHERE products.product_id IN( " + deleteString + ")";
	pool.getConnection(function(err, connection){
		  connection.query( sql,  function(err, rows){
		  	if(err)	{
		  		throw err;
		  	}else{
		  		if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
		  		}
		  	}
		  });		  
		  connection.release();
		});
}

function updateLogoutTime(callback, id, time){
	console.log("Updated time for: " + id);
	var sql = "UPDATE user SET last_logged_in_time = '" + time +"' WHERE id = " + id;
	pool.getConnection(function(err, connection){
		  connection.query( sql,  function(err, rows){
		  	if(err)	{
		  		throw err;
		  	}else{
		  		if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
		  		}
		  	}
		  });		  
		  connection.release();
		});
}

exports.insertUser = insertUser;
exports.validateUser = validateUser;
exports.getProducts = getProducts;
exports.getAddedProduct = getAddedProduct;
exports.updateQty = updateQty;
exports.insertProduct = insertProduct;
exports.insertCategory = insertCategory;
exports.getCategories = getCategories;
exports.updateLogoutTime = updateLogoutTime;