function EventsHandler( config : any, jobName : string, building : boolean, status : string ) {
  const eventName = building ? 'build-start' : 'build-finish';
  if ( !config.events || !config.events[ eventName ] || !config.events[ eventName ][ status ] ) {
    return;
  }

  console.log( 'OIIIIDAAAA', config.events[ eventName ][ status ] );
}
export default EventsHandler;
