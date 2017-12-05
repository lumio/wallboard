import * as fs from 'fs';
import * as path from 'path';
import * as minimist from 'minimist';
import * as stripJsonComments from 'strip-json-comments';

const args = minimist( process.argv.slice( 1 ) );
const mandatoryProperties = {
  ci: 'string',
};

class Config {
  load() : any {
    const config = this.readConfigFile();
    const mandatoryKeys : any = Object.keys( mandatoryProperties );

    for ( const key of mandatoryKeys ) {
      if ( !config[ key ] || typeof config[ key ] !== mandatoryProperties[ key ] ) {
        console.error( `Config key "${ key }" is required and needs to be of type ${ mandatoryProperties[ key ] }` );
        return process.exit( 1 );
      }
    }

    return config;
  }

  private readConfigFile() : any {
    const configFile = path.resolve( args.c || args.config
      || ( process.env.NODE_ENV === 'development' ? './config.json' : './wallboard.json' ) );
    const exists = fs.existsSync( configFile );

    if ( !exists ) {
      console.error( `Config file ${ configFile } is missing.` );
      return process.exit( 1 );
    }

    const raw = fs.readFileSync( configFile, { encoding: 'utf-8' } );
    let config = {};
    try { 
      config = JSON.parse( stripJsonComments( raw ) );
    }
    catch ( e ) {
      console.error( `Error loading ${ configFile }:` );
      console.error( e );
      return process.exit( 1 );
    }

    return config;
  }
}

const ConfigInstance = new Config();
export default ConfigInstance;
