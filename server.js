const path = require( 'path' );
const fs = require( 'fs-extra' );
const fetch = require( 'node-fetch' );
const express = require( 'express' );
const app = express();

app.use( express.static( path.join( __dirname, 'build' ) ) );
app.get( '/api/config', ( req, res ) => {
  fs.readFile( path.join( __dirname, 'config.json' ), { encoding: 'utf-8' } )
    .then( data => {
      res.send( JSON.parse( data ) );
    } )
    .catch( err => res.status( 500 ).send( err.toString() ) );
} );
app.get( '/api/get', ( req, res ) => {
  if ( !req.query || !req.query.url ) {
    return res.status( 400 ).send( { error: 'Missing url' } );
  }

  fetch( req.query.url )
    .then( fetchReq => fetchReq.text() )
    .then( data => res.send( data ) )
    .catch( err => {
      console.error( req.query, err );
      res.status( 400 ).send( err )
    } );
} );
app.listen( 5000, () => console.log( 'Started server on localhost:5000' ) );
