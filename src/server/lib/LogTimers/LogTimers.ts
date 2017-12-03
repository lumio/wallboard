const charm = require( 'charm' )();

const lastTimers : { [ key : string ] : number } = {};
let logInterval : any;

function iterateTimers() {
  if ( process.env.LOG_TIMERS_EXCLUSIVELY ) {
    charm.reset();
  }

  const now = Date.now();
  const timerNames = Object.keys( lastTimers );
  let maxName = 0;
  for ( const t of timerNames ) {
    if ( t.length > maxName ) {
      maxName = t.length;
    }
  }

  console.log( 'Last checked...' );
  console.log( '' );

  for ( const t of timerNames ) {
    const seconds = ( ( now - lastTimers[ t ] ) / 1000 ).toFixed( 0 );
    const parts = [ t + ':' ];
    parts.push( ' '.repeat( maxName - t.length + 1 ) );
    parts.push( seconds + 's ago' );
    console.log( parts.join( ' ' ) );
  }

  console.log( '---------------' );
};

function initLog() {
  if ( logInterval ) {
    return;
  }

  charm.pipe( process.stdout );
  logInterval = setInterval( () => {
    // iterateTimers();
  }, 1000 );
}

export default function LogTimers( key : string ) {
  if ( process.env.NODE_ENV === 'development' ) {
    initLog();
    lastTimers[ key ] = Date.now();
  }
}
