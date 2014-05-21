var application_root = __dirname,
    express = require("express"),
    path = require("path"),
	ejs = require("ejs");
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");
var cache = require('./cache');

var title = 'EJS template with Node.JS';
var data = 'Data from node';

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	
	app.use(express.static(path.join(application_root, "")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use(express.cookieParser());
	app.use(express.session({secret: "LP1988"}));
	app.use(app.router);
});

function getHome(req, res, session, category_id)
{
	//if(cache.get(category_id) == null || cache.get(category_id) == undefined)
	//{
		mysql.getProducts(function(err,results){
			if(err){
				throw err;
			}else{
				//cache.put(category_id, results);
				ejs.renderFile('home.ejs',
						{session : session, products : results, category : results[0].category_name, desc : results[0].category_desc},
						function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
		},category_id);
	/*}
	else
	{
		console.log("In cache");
		var resultProduct = cache.get(category_id);
		ejs.renderFile('home.ejs',
				{session : session, products : cache.get(category_id), category : resultProduct[0].category_name, desc : resultProduct[0].category_desc},
				function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});
	}*/
}


app.get('/', function (req, res) {
	if(req.session.name == undefined)
	{
		req.session.name = "";
	}
	if(req.session.userid == undefined)
	{
		req.session.userid = -1;
	}
	if(req.session.last_time == undefined)
	{
		req.session.last_time = new Date();
	}
	getHome(req, res, req.session, 1);
});

app.get('/viewcart', function (req, res) {
	ejs.renderFile('viewcart.ejs',
		{session : req.session},
			function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
	});		
});


app.post('/addtocart', function (req, res) {
	var id = req.body.id;
	
	if(req.session.cart == undefined)
	{
		req.session.cart = [];
	}
	if(req.session.total == undefined)
	{
		req.session.total = 0.0;
	}
	mysql.getAddedProduct(function(err,results){
		if(err){
			throw err;
		}else{
			var addProduct = results[0];
			req.session.cart.push(addProduct);
			req.session.total = Math.round(req.session.total + results[0].product_cost);			
			ejs.renderFile('viewcart.ejs',
					{session : req.session},
					function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
	},id);
});

app.post('/removefromcart', function (req, res) {
	var id = req.param('deleteid');
	console.log("Removed " + id);
	var cart = req.session.cart;
	delete req.session.cart;
	delete req.session.total;
	req.session.cart = [];
	req.session.total = 0.0;
	console.log("Cart " + req.session.cart);
	for(var i = 0; i < cart.length; i++)
	{
		if(cart[i].product_id != id)
		{
			req.session.cart.push(cart[i]);
			req.session.total = req.session.total + cart[i].product_cost;
		}
	}
	console.log("Cart " + req.session.cart);
	ejs.renderFile('viewcart.ejs',
			{session : req.session},
				function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
		});
});

app.post('/checkout', function (req, res) {
	if(req.session.name == "")
	{
		if(req.session.lastpage == undefined)
		{
			req.session.lastpage = "/viewcart";
		}
		var msg = "You need to sign in before checkout";
		ejs.renderFile('login.ejs',
				{msg : msg},
				function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});
	}
	else
	{
		ejs.renderFile('checkout.ejs',
				{session : req.session},
					function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
			});
	}
});	

app.get('/books', function (req, res) {
	if(req.session.name == undefined)
	{
		req.session.name = "";
	}
	if(req.session.userid == undefined)
	{
		req.session.userid = -1;
	}
	if(req.session.last_time == undefined)
	{
		req.session.last_time = new Date();
	}
	getHome(req, res, req.session, 1);
});

app.get('/electronics', function (req, res) {
	if(req.session.name == undefined)
	{
		req.session.name = "";
	}
	if(req.session.userid == undefined)
	{
		req.session.userid = -1;
	}
	if(req.session.last_time == undefined)
	{
		req.session.last_time = new Date();
	}
	getHome(req, res, req.session, 2);
});

app.get('/grocery', function (req, res) {
	if(req.session.name == undefined)
	{
		req.session.name = "";
	}
	if(req.session.userid == undefined)
	{
		req.session.userid = -1;
	}
	if(req.session.last_time == undefined)
	{
		req.session.last_time = new Date();
	}
	getHome(req, res, req.session, 3);
});

app.get('/addproduct', function (req, res) {
	req.session.categories = [];	
	mysql.getCategories(function(err,results){
		if(err){
			throw err;
		}else{
			for(var i = 0; i < results.length; i++)
			{
				req.session.categories.push(results[i]);
			}
			ejs.renderFile('addProduct.ejs',
					{session : req.session},
					function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
	});	
});

app.get('/login', function (req, res) {
	var msg = "Sign In to your account";
	ejs.renderFile('login.ejs',
			{msg : msg},
			function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
});

function formatDate(d) {
 var dd = d.getDate();
 if ( dd < 10 )
	 dd = '0' + dd;
var mm = d.getMonth()+1;
 if ( mm < 10 )
	 mm = '0' + mm;
var yyyy = d.getFullYear();
var hh = d.getHours();
if ( hh < 10 )
	 hh = '0' + hh;
var MM = d.getMinutes();
if ( MM < 10 )
	MM = '0' + MM;
var ss = d.getSeconds();
if ( ss < 10 )
	ss = '0' + ss;
	  return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + MM + ":" +ss;

	}

app.get('/logout', function (req, res) {
	var now = new Date();
	mysql.updateLogoutTime(function(err,results){
		if(err){
			throw err;
			console.log(err);
		}else{			
		}
	},req.session.userid, formatDate(now));
	req.session.name = "";
	req.session.userid = -1;
	getHome(req, res, req.session, 1);
});

app.get('/createAccount', function (req, res) {
	ejs.renderFile('createAccount.ejs',
			function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
});

app.post('/createUser', function (req, res) {
	if(!req.body.hasOwnProperty('firstname') ||!req.body.hasOwnProperty('lastname') 
			||!req.body.hasOwnProperty('email') ||!req.body.hasOwnProperty('password')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	
	mysql.insertUser(function(err,results){
		if(err){
			throw err;
			console.log(err);
		}else{
			req.session.name = req.param('firstname');
			req.session.userid = results.insertId;
			req.session.last_time = formatDate(new Date());			
			console.log("Inserted");
			getHome(req, res, req.session, 1);
		}
	},req.param('firstname'),req.param('lastname'), req.param('email'), req.param('password'));

});

app.post('/insertProduct', function (req, res) {	
	mysql.insertProduct(function(err,results){
		if(err){
			throw err;
			console.log(err);
		}else{
			getHome(req, res, req.session, req.param('selectedCat'));
		}
	},req.param('selectedCat'), req.param('prodname'),req.param('desc'), req.param('cost'), req.param('qty'));

});

app.post('/addCategory', function (req, res) {
	mysql.insertCategory(function(err,results){
				if(err){
					throw err;
					console.log(err);
				}else{
					req.session.categories = [];
				
						mysql.getCategories(function(err,results){
							if(err){
								throw err;
							}else{
								for(var i = 0; i < results.length; i++)
								{
									req.session.categories.push(results[i]);
								}
								ejs.renderFile('addProduct.ejs',
										{session : req.session},
										function(err, result) {
									// render on success
									if (!err) {
										res.end(result);
									}
									// render or error
									else {
										res.end('An error occurred');
										console.log(err);
									}
								});
							}
						});	
					}
			},req.param('othername'),req.param('otherdesc'));	
});

app.post('/order', function (req, res) {
	if(!req.body.hasOwnProperty('street') ||!req.body.hasOwnProperty('city') 
			||!req.body.hasOwnProperty('pcode') ||!req.body.hasOwnProperty('state')
			||!req.body.hasOwnProperty('ccno')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	
	var address = req.param('street') + ", \n" + req.param('city') + ", \n" + req.param('state') + ", " + req.param('pcode');
	var ccno = req.param('ccno');
	var cart = req.session.cart;
	var total = req.session.total;
	var deleteString = "";
	var deleteArray = [];
	for(var i = 0; i < cart.length; i++)
	{
		deleteArray.push(cart[i].product_id);
	}
	deleteString = deleteArray.join(',');
	mysql.updateQty(function(err,results){
		if(err){
			throw err;
			console.log(err);
		}else{			
		}
	},deleteString);

	delete req.session.cart;
	delete req.session.total;
	req.session.total = 0.0;
	req.session.cart = [];
	ejs.renderFile('orderPlaced.ejs',
			{session : req.session, addr : address, total : total, cart: cart, ccno : ccno},
				function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
		});
});

app.post('/validate', function (req, res) {
	if(!req.body.hasOwnProperty('email') ||!req.body.hasOwnProperty('password')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	
	mysql.validateUser(function(err,results){
		if(err){
			throw err;
		}else{
			if(results.length == 0)
			{
				var msg = "Your credentials don't match. Please try again.";
				ejs.renderFile('login.ejs',
						{msg : msg},
						function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
			else
			{
				req.session.name = results[0].firstname;
				req.session.userid = results[0].id;
				req.session.last_time = results[0].last_logged_in_time;
				res.cookie('userid', results[0].id);
				if(req.session.lastpage != undefined)
				{
					ejs.renderFile('viewcart.ejs',
							{session : req.session},
								function(err, result) {
								// render on success
								if (!err) {
									res.end(result);
								}
								// render or error
								else {
									res.end('An error occurred');
									console.log(err);
								}
						});
				}
				else
				{
					getHome(req, res, req.session, 1);
				}
			}
		}
	},req.param('email'),req.param('password'));
	
});

app.listen(4242);