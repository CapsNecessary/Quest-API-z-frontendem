import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_Products = 'http://localhost:3000/products';
const API_Changes = 'http://localhost:3000/sales_and_acquisitions';

function App() {
	const [ products, setProducts ] = useState( [] );
	const [ name, setName ] = useState( '' );
	const [ description, setDescription ] = useState( '' );
	const [ price, setPrice ] = useState( '' );

	const [ changes, setChanges ] = useState( [] );
	const [ productId, setProductId ] = useState( '' );
	const [ acquisition, setAcquisition ] = useState( '' );
	const [ storage, setStorage ] = useState( '' );
	const [ sale, setSale ] = useState( '' );
	const [ date, setDate ] = useState( '' );

	useEffect( () => { fetchProducts(); }, [] );
	useEffect( () => { fetchChanges(); }, [] );

	const fetchProducts = async () => {
		try{
			const response = await axios.get( API_Products );
			setProducts( response.data );
		} catch( error ){
			console.error( 'Błąd podczas pobierania produktów:', error );
		}
	};

	const addProduct = async () => {
		if( !name || !price ) return;
		try{
			await axios.post( API_Products, { name, description, price });
			setName( '' );
			setDescription( '' );
			setPrice( '' );
			fetchProducts();
		} catch( error ){
			console.error( 'Błąd podczas dodawania produktu:', error );
		}
	};

	const fetchChanges = async () => {
		try{
			const response = await axios.get( API_Changes );
			setChanges( response.data );
		} catch( error ){
			console.error( 'Błąd podczas pobierania zmian:', error );
		}
	};

	const addChange = async () => {
		if( !productId || !acquisition || !storage || !sale || !date ) return;
		try{
			await axios.post( API_Changes, { productId, acquisition, storage, sale, date });
			setProductId( '' );
			setAcquisition( '' );
			setStorage( '' );
			setSale( '' );
			setDate( '' );
			fetchChanges();
		} catch( error ){
			console.error( 'Błąd podczas dodawania zmiany:', error );
		}
	};

	return (
		<div id="root">
			<div className="container mt-5">
				<h2 className="mb-4">Lista Produktów</h2>
				<ul className="list-group mb-4">
					{ products.map(( product ) => (
						<li key={ product.id } className="list-group-item">
							<strong>{ product.name }</strong> - { product.description } - ${ product.price }
						</li>
					))}
				</ul>
				<h3>Dodaj Produkt</h3>
				<div className="mb-3">
					<input type="text" className="form-control" placeholder="Nazwa" value={ name } onChange={( e ) => setName( e.target.value )} />
				</div>
				<div className="mb-3">
					<input type="text" className="form-control" placeholder="Opis" value={ description } onChange={( e ) => setDescription( e.target.value )} />
				</div>
				<div className="mb-3">
					<input type="number" className="form-control" placeholder="Cena" value={ price } onChange={( e ) => setPrice( e.target.value )} />
				</div>
				<button className="btn btn-primary" onClick={ addProduct }>Dodaj Produkt</button>
			</div>
			<div className="container mt-5">
				<h2 className="mb-4">Lista Zmian</h2>
				<ul className="list-group mb-4">
					<li className="list-group-item">
							<strong>ID Produktu</strong> - Zakup - Magazyn - Sprzedaż - Data
						</li>
					{ changes.map(( change ) => (
						<li key={ change.id } className="list-group-item">
							<strong>{ change.products_id }</strong> - { change.acquisitions } - { change.storage } - { change.sales } - <time dateTime={ change.date }>{ datetimeToReadeable( change.date ) }</time>
						</li>
					))}
				</ul>
				<h3>Dodaj Zmiane</h3>
				<div className="mb-3">
					<input type="text" className="form-control" placeholder="Id Produktu" value={ productId } onChange={( e ) => setProductId( e.target.value )} />
				</div>
				<div className="mb-3">
					<input type="number" className="form-control" placeholder="Dowóz" value={ acquisition } onChange={( e ) => setAcquisition( e.target.value )} />
				</div>
				<div className="mb-3">
					<input type="number" className="form-control" placeholder="Magazyn" value={ storage } onChange={( e ) => setStorage( e.target.value )} />
				</div>
				<div className="mb-3">
					<input type="number" className="form-control" placeholder="Sprzedaż" value={ sale } onChange={( e ) => setSale( e.target.value )} />
				</div>
				<div className="mb-3">
					<input type="datetime-local" className="form-control" placeholder="Data i godzina" value={ date } onChange={( e ) => setDate( e.target.value )} />
				</div>
				<button className="btn btn-primary" onClick={ addChange }>Dodaj Zmiane</button>
			</div>
		</div>
	);
}

function datetimeToReadeable( datetime ){
	const [ year, month, day, hour, second, milisecond ] = datetime.match( /(\d+)/gm );
	let monthRoman;
	if( 0 < +month && +month < 4 ) monthRoman = "I".repeat( +month );
	else if( +month == 4 ) monthRoman = "IV";
	else if( 4 < +month && +month < 9 ) monthRoman = "V" +"I".repeat( +month -5 );
	else if( +month == 9 ) monthRoman = "IX";
	else if( 9 < +month ) monthRoman = "X" +"I".repeat( +month -10 );
	return `${ +hour }:${ second },${ milisecond } ${ +day } ${ monthRoman } ${ year }`;
}

export default App;