import fetch from 'node-fetch';
import * as EventEmitter from 'events';
import {
  CronWorkerConfigType,
  CronWorkerCollectionType,
} from './types';

export default class CronWorker extends EventEmitter {
  collection : CronWorkerCollectionType = {};

  push( id : string, config : CronWorkerConfigType ) {
    const isNew = this.createNewIfNeeded( id, config );
    if ( isNew && !config.skipFirstRun ) {
      this.run( id );
    }

    this.setNextRun( id );

    return this;
  }

  updateInterval( id : string, nextRun : number ) : boolean {
    if ( !nextRun || !this.collection[ id ] ) {
      return false;
    }

    if ( this.collection[ id ].config.nextRun === nextRun ) {
      return true;
    }

    this.collection[ id ].config.nextRun = nextRun;
    this.setNextRun( id );

    return true;
  }

  remove( id : string ) {
    this.clearTimer( id );
    delete this.collection[ id ];

    return this;
  }

  private clearTimer( id : string ) {
    const timer = this.collection[ id ] && this.collection[ id ].timer;
    if ( timer ) {
      clearInterval( timer );
    }
  }

  private setNextRun( id : string ) {
    this.clearTimer( id );
    this.collection[ id ].timer = setInterval(
      () => this.run( id ),
      this.collection[ id ].config.nextRun
    );
  }

  private run( id : string ) {
    const item = this.collection[ id ];
    if ( !item ) {
      return;
    }

    if ( item.config.callback ) {
      item.config.callback();
    }

    if ( item.config.url ) {
      this.fetchUrl( item.config.url, id );
    }
  }

  private fetchUrl( url : string, id : string ) {
    const item = this.collection[ id ];
    if ( !item || item.busy ) {
      return;
    }

    this.collection[ id ].busy = true;
    const responseFormat = item.config.urlResponseFormat || 'json';
    fetch( url )
      .then( ( response : any ) => response[ responseFormat ]() )
      .then( ( data : any ) => this.emit( 'data', data, item.config ) )
      .catch( ( error : any ) => this.emit( 'error', error, item.config ) )
      .then( () => {
        if ( this.collection[ id ] ) {
          this.collection[ id ].busy = false;
        }
      } );
  }

  private createNewIfNeeded( id : string, config : CronWorkerConfigType ) : boolean {
    if ( !this.collection[ id ] ) {
      this.collection[ id ] = {
        config,
        busy: false,
      };
      return true;
    }

    this.collection[ id ].config = Object.assign( this.collection[ id ].config, config );
    return false;
  }
}
