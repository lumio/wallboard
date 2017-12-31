import * as path from 'path';
import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

if ( process.env.NODE_ENV === 'development' ) {
  process.on( 'unhandledRejection', r => console.log( r ) );
}

if ( !process.env.DEBUG ) {
  process.env.DEBUG = 'wallboard*';
}

import eventsHandler from './lib/EventsHandler';
import Config from './lib/Config';
import PluginJenkins from './plugins/Jenkins';

const config = Config.load();

const app = express();
app.use( '/', express.static( path.join( __dirname, './static' ) ) );
const server = http.createServer( app );

const wss = new WebSocket.Server( { server } );
const broadcast = ( data : any ) => {
  wss.clients.forEach( ( client : any ) => {
    if ( client.readyState === WebSocket.OPEN ) {
      client.send( data );
    }
  } );
};

const jenkins = config.error ? false : new PluginJenkins( config.ci, {
  whitelist: config.whitelist,
  blacklist: config.blacklist,
} );

const jenkinsWrapper = {
  get: () => {
    if ( config.error ) {
      return config;
    }

    return jenkins ? jenkins.get() : null;
  },

  on: ( t : string, c : any ) => jenkins ? jenkins.on( t, c ) : null,
};

const sendUpdate = ( ws : WebSocket ) => {
  const data = jenkinsWrapper.get();

  if ( data.error ) {
    return ws.send( JSON.stringify( { type: 'error', message: data.message, error: data.error } ) );
  }
  ws.send( JSON.stringify( { type: 'change', data } ) );
};

jenkinsWrapper.on( 'change', ( data : any ) => {
  broadcast( JSON.stringify( { type: 'change', data } ) );
} );

jenkinsWrapper.on( 'build-status-change', ( name : string, building : boolean, status : string ) => {
  eventsHandler( config, name, building, status );
  broadcast( JSON.stringify( { type: 'build-status-change', name, building, status } ) );
} );

jenkinsWrapper.on( 'error', ( error : any ) => {
  broadcast( JSON.stringify( { type: 'error', error } ) );
} );

wss.on( 'connection', ( ws : WebSocket ) => {
  ws.on( 'message', ( data : any ) => {
    if ( data === 'update' ) {
      sendUpdate( ws );
    }
  } );

  sendUpdate( ws );
} );

server.listen( process.env.PORT || 5000, () => {
  console.log( `Server started on port ${ server.address().port }` );
} );

