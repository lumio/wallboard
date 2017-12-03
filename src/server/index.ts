import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

if ( process.env.NODE_ENV === 'development' ) {
  process.on( 'unhandledRejection', r => console.log( r ) );
}

import PluginJenkins from './plugins/Jenkins';

const jenkinsUrl = 'fix me';
const jenkins = new PluginJenkins( jenkinsUrl );

const app = express();
const server = http.createServer( app );

const wss = new WebSocket.Server( { server } );
const broadcast = ( data : any ) => {
  wss.clients.forEach( ( client : any ) => {
    if ( client.readyState === WebSocket.OPEN ) {
      client.send( data );
    }
  } );
};

jenkins.on( 'change', ( data ) => {
  broadcast( JSON.stringify( { type: 'change', data } ) );
} );

jenkins.on( 'build-status', ( type: 'build-status', name, building, status ) => {
  broadcast( JSON.stringify( { name, building, status } ) );
} );

jenkins.on( 'error', ( error ) => {
  broadcast( JSON.stringify( { type: 'error', error } ) );
} );

wss.on( 'connection', ( ws : WebSocket ) => {
  ws.on( 'message', ( data : any ) => {
    if ( data.update ) {
      ws.send( JSON.stringify( { type: 'change', data: jenkins.get() } ) );
    }
  } );

  ws.send( JSON.stringify( { type: 'change', data: jenkins.get() } ) );
} );


server.listen( process.env.PORT || 5000, () => {
  console.log( `Server started on port ${ server.address().port }` );
} );

