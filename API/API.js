import express from "express";
import mysql from "mysql";
import cors from "cors";
const app = express( );

app.use( express.json( ) );
// app.use( cors( { origin: 'http://localhost' , credentials :	true} ) );
app.use( cors() );

const db = mysql.createConnection( {
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'KK_4P_API'
});

db.connect( ( err ) => { err ? console.error( err ) : console.log( "Succesful connection." ); })

// Creating a table
{
	const createProductsQuery = `
		CREATE TABLE IF NOT EXISTS products (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR( 255 ) NOT NULL,
			description TEXT,
			price DECIMAL( 10, 2 ) NOT NULL
		);`,
		createSalesQuery = `
		CREATE TABLE IF NOT EXISTS sales_and_acquisitions (
				id int(11) NOT NULL,
				products_id int(11) NOT NULL,
				acquisitions int(11) NOT NULL,
				storage int(11) NOT NULL,
				sales int(11) NOT NULL,
				date datetime DEFAULT NULL
		)`;
	db.query( createProductsQuery, ( err ) => {
		if( err ) throw err;
		else console.log( 'Tabel "products" has been created.' );
	});
	db.query( createSalesQuery, ( err ) => {
		if( err ) throw err;
		else console.log( 'Tabel "sales_and_acquisitions" has been created.' );
	});
}

//#region API
//#region Products
app.get( '/products', ( req, res ) => {
	console.log( req, res );
	const query = 'SELECT * FROM products';
	db.query( query, ( err, results ) => {
		if( err ) res.status( 500 ).send( err.message );
		res.json( results );
	});
});

app.get( '/products/:id', ( req, res ) => {
	console.log( req, res );
	const query = 'SELECT * FROM products WHERE id = ?';
	db.query( query, [req.params.id], ( err, results ) => {
		if( err ) res.status( 500 ).send( err.message );
		else if( results.length === 0 ) res.status( 404 ).send( 'Produkt nie został znaleziony.' );
		else res.json( results[0] );
	});
});

app.post( '/products', ( req, res ) => {
	console.log( req, res );
	const { name, description, price } = req.body;
	const query = 'INSERT INTO products ( name, description, price ) VALUES ( ?, ?, ? )';
	db.query( query, [ name, description, price ], ( err, result ) => {
		if( err ) res.status( 500 ).send( err.message );
		else res.status( 201 ).send( { id: result.insertId, name, description, price });
	});
});

app.put( '/products/:id', ( req, res ) => {
	console.log( req, res );
	const { name, description, price } = req.body;
	const query = 'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?';
	db.query( query, [ name, description, price, req.params.id ], ( err, result ) => {
		if( err ) res.status( 500 ).send( err.message );
		else if( result.affectedRows === 0 ) res.status( 404 ).send( 'Produkt nie został znaleziony.' );
		else res.send( 'Produkt został zaktualizowany.' );
	});
});

app.delete( '/products/:id', ( req, res ) => {
	console.log( req, res );
	const query = 'DELETE FROM products WHERE id = ?';
	db.query( query, [ req.params.id ], ( err, result ) => {
		if( err ) res.status( 500 ).send( err.message );
		else if( result.affectedRows === 0 ) res.status( 404 ).send( 'Produkt nie został znaleziony.' );
		else es.send( 'Produkt został usunięty.' );
	});
});
//#endregion Products

//#region Sales_and_Acquisitions
app.get( '/sales_and_acquisitions', ( req, res ) => {
	console.log( req, res );
	const query = 'SELECT * FROM sales_and_acquisitions';
	db.query( query, ( err, results ) => {
		if( err ) res.status( 500 ).send( err.message );
		res.json( results );
	});
});

app.get( '/sales_and_acquisitions/:id', ( req, res ) => {
	console.log( req, res );
	const query = 'SELECT * FROM sales_and_acquisitions WHERE id = ?';
	db.query( query, [ req.params.id ], ( err, results ) => {
		if( err ) res.status( 500 ).send( err.message );
		else if( results.length === 0 ) res.status( 404 ).send( 'Zmiana nie została znaleziona.' );
		else res.json( results[0] );
	});
});

app.post( '/sales_and_acquisitions', ( req, res ) => {
	console.log( req, res );
	const { productId, acquisition, storage, sale, date } = req.body;
	console.log( productId, acquisition, storage, sale, date );
	const query = 'INSERT INTO `sales_and_acquisitions`(`products_id`, `acquisitions`, `storage`, `sales`, `date`) VALUES ( ?, ?, ?, ?, ? )';
	db.query( query, [ productId, acquisition, storage, sale, date ], ( err, result ) => {
		if( err ) res.status( 500 ).send( err.message );
		else res.status( 201 ).send( { id: result.insertId, productId, acquisition, storage, sale, date });
	});
});

app.put( '/sales_and_acquisitions/:id', ( req, res ) => {
	console.log( req, res );
	const { productId, acquisition, storage, sale, date } = req.body;
	console.log( productId, acquisition, storage, sale, date );
	const query = 'UPDATE sales_and_acquisitions SET name = ?, description = ?, price = ? WHERE id = ?';
	db.query( query, [ productId, acquisition, storage, sale, date, req.params.id ], ( err, result ) => {
		if( err ) res.status( 500 ).send( err.message );
		else if( result.affectedRows === 0 ) res.status( 404 ).send( 'Zmiana nie została znaleziona.' );
		else res.send( 'Zmiana został zaktualizowana.' );
	});
});

app.delete( '/sales_and_acquisitions/:id', ( req, res ) => {
	console.log( req, res );
	const query = 'DELETE FROM sales_and_acquisitions WHERE id = ?';
	db.query( query, [ req.params.id ], ( err, result ) => {
		if( err ) res.status( 500 ).send( err.message );
		else if( result.affectedRows === 0 ) res.status( 404 ).send( 'Zmiana nie został znaleziona.' );
		else res.send( 'Zmiana została usunięta.' );
	});
});
//#endregion sales_and_acquisitions
//SELECT * FROM `sales_and_acquisitions` WHERE 1
//#endregion API

//#region Server Startup
const PORT = 3000;
app.listen( PORT, ( ) => { console.log( `Server created on PORT: ${PORT}` )});
//#endregion