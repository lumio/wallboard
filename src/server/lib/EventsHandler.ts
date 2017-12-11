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

function runCommandBlock( block : any, status : string ) {
  if ( block.all ) {
    console.log( 'all', block.all );
  }

  if ( block[ status ] ) {
    console.log( status, block[ status ] );
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
