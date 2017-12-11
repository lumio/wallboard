import * as fetch from 'node-fetch';
import { exec } from 'child_process';
import * as debug from 'debug';
const log = debug( 'wallboard:events-handler' );
const logShell = debug( 'wallboard:events-handler:shell' );
const logFetch = debug( 'wallboard:events-handler:fetch' );

function isUrl( s : string ) {
  let check = true;
  try {
    new URL( s );
  }
  catch( e ) {
    check = false;
  }

  return check;
}

function fetchUrl( url : string ) {

}

function runSingleCommand( command : string ) {
  if ( isUrl( command ) ) {
    return fetchUrl( command );
  }

  exec( command, ( error, stdout, stderr ) => {
    if ( stdout ) {
      logShell( 'stdout', stdout );
    }

    if ( stderr ) {
      logShell( 'stderr', stderr );
    }

    if ( error && ( error as any ).code ) {
      return logShell( 'Process exited with error code %d', ( error as any ).code );
    }
    else if ( error ) {
      return logShell( 'Process exited with error', error );
    }

    return logShell( 'Process was ok!' );
  } );
}

function runCommandBlock( block : any, status : string ) {
  if ( block.all ) {
    runSingleCommand( block.all );
  }

  if ( block[ status ] ) {
    runSingleCommand( block[ status ] );
  }
}

function EventsHandler( config : any, jobName : string, building : boolean, status : string ) {
  const eventName = building ? 'build-start' : 'build-finish';
  const eventNameJobSpecific = `${ eventName }:${ jobName }`;
  const oneEventExists = (
    config.events
    && (
      ( config.events[ eventNameJobSpecific ] )
      || ( config.events[ eventName ] )
    )
  );

  if ( !oneEventExists ) {
    return;
  }

  const specificCommands = config.events[ eventNameJobSpecific ];
  const genericCommands = config.events[ eventName ];

  if ( specificCommands ) {
    runCommandBlock( specificCommands, status );
  }

  if ( genericCommands ) {
    runCommandBlock( genericCommands, status );
  }
}
export default EventsHandler;
