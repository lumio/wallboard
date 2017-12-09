/*
 * @TODO: This file needs some better type defs!
 */

import { URL } from 'url';
import * as Immutable from 'immutable';
import * as EventEmitter from 'events';

import {
  JenkinsConfigType,
  JenkinsJobInfoType,
} from './types';
import CronWorker from '../../lib/CronWorker';

import LogTimers from '../../lib/LogTimers';

const timeouts = {
  root: 60000,
  folder: 60000,
  job: 5000,
  runningJob: 2000,
};

const trimLeadingSlash = ( pathname : string ) => (
  pathname.substr( -1 ) === '/' ? pathname.substr( 0, pathname.length - 1 ) : pathname
);

const statusMap = {
  blue: 'successful',
  blue_anime: 'successful',
  red: 'failed',
  red_anime: 'failed',
  yellow: 'unstable',
  yellow_anime: 'unstable',
  aborted: 'aborted',
  aborted_anime: 'aborted',
  disabled: 'disabled',
  disabled_anime: 'disabled',
  notbuilt: 'notbuilt',
  notbuilt_anime: 'notbuilt',
};

export default class PluginJenkins extends EventEmitter {
  url : string;
  baseUrlObject : URL;
  cron : any;
  collection : Immutable.Map<string, any>;
  config : JenkinsConfigType;

  constructor( url : string, config : JenkinsConfigType ) {
    super();

    this.url = url;
    this.cron = CronWorker;
    this.config = config;
    this.collection = Immutable.fromJS( {
      type: 'folder',
      name: '',
      url,
      jobs: {},
    } );

    this.cron.on( 'data', ( data : any, config : any ) => {
      this.processResponse( data, config );
    } );
    this.cron.on( 'error', ( error : any, config : any ) => {
      const isFetchError = error && error.name === 'FetchError';
      const isJob = config.data && config.data.isJob;
      if ( isFetchError && isJob ) {
        this.deleteItem( config.data.reference );
        this.emitChange();
      }
      else {
        this.emit( 'error', error );
      }
    } );

    this.addItem( {
      url,
      nextRun: timeouts.root,
      data: {
        reference: [],
        isRoot: true,
      },
    } );

  }

  get() {
    return this.collection.toJS();
  }

  private processResponse( data : any, config : any ) {
    let timerName = data.name || 'root';

    if ( data.jobs ) {
      this.processJobs( data, config );
    }
    if ( data._class && data._class.match( /hudson\.model\..*?build/i ) ) {
      this.collectBuildInfo( data, config );
      timerName = data.fullDisplayName;
    }
    else {
      this.collectItemInfo( data, config );
    }

    LogTimers( timerName );
  }

  private collectItemInfo( data : any, config : any ) {
    const lastBuildNumber = ( data.lastBuild || {} ).number || 0;
    const lastCompletedBuild = ( data.lastCompletedBuild || {} ).number || 0;
    const lastSuccessfulBuild = ( data.lastSuccessfulBuild || {} ).number || -1;
    const lastFailedBuild = ( data.lastFailedBuild || {} ).number || -1;

    const jobInfo : JenkinsJobInfoType = {
      building: lastBuildNumber > lastCompletedBuild,
      enabled: data.buildable,
      name: data.name,
      displayName: data.displayName,
      status: ( data.color && statusMap[ data.color ] ) || 'unknown',
      health: this.calculateHealth( data.healthReport ),
      inQueue: data.inQueue,
      lastBuildFailed: lastFailedBuild === lastBuildNumber,
      lastBuildSucceeded: lastSuccessfulBuild === lastBuildNumber,
      type: this.checkIfFolder( data ) ? 'folder' : 'job',
    };

    this.createReferenceIfNeeded( config.data.reference );
    const oldJobInfo = this.collection.getIn( config.data.reference );
    this.mergeValues( config.data.reference, jobInfo );
    this.addBuildWatchIfNeeded( data, config, jobInfo );

    if ( this.checkIfFolder( data ) === false ) {
      const oldJobBuilding = oldJobInfo.get( 'building' );
      if ( oldJobBuilding !== jobInfo.building ) {
        this.emitChange();
        this.emit( 'build-status', jobInfo.name, jobInfo.building, jobInfo.status );
      }
      this.updateInterval( config.url, jobInfo.building );
    }
  }

  private collectBuildInfo( data : any, config : any ) {
    const url = this.getAPIUrl( data.url );
    const buildInfo = {
      name: config.data.name,
      building: data.building,
      timestamp: data.timestamp,
      estimatedDuration: data.estimatedDuration,
      realDuration: data.duration,
      buildNumber: data.number,
      changeSet: data.changeSet,
      actions: data.actions,
      status: data.result && data.result.toLowerCase(),
      url,
    };

    const selectOldBuildInfo = this.collection.getIn( config.data.reference );
    const oldBuildInfo = selectOldBuildInfo ? selectOldBuildInfo.toJS() : {};
    this.mergeValues( config.data.reference, buildInfo );

    if ( !selectOldBuildInfo
      || ( buildInfo.building !== oldBuildInfo.building )
      || ( buildInfo.status !== oldBuildInfo.status )
      || ( buildInfo.estimatedDuration !== oldBuildInfo.estimatedDuration ) ) {
      this.emitChange();
    }

    if ( !data.building ) {
      this.emit( 'build-completed', buildInfo.name, buildInfo );
      this.cron.remove( url );
      this.collection = this.collection.setIn( config.data.reference, Immutable.Map() );
    }
  }

  private addBuildWatchIfNeeded( data : any, config : any, jobInfo : JenkinsJobInfoType ) {
    if ( !data.lastBuild || !data.lastBuild.url ) {
      return;
    }

    const currentBuildInfoReference = [ ...config.data.reference, 'build' ];
    const currentBuildInfoMap = this.collection.getIn( currentBuildInfoReference )
    const currentBuildInfo = currentBuildInfoMap ? currentBuildInfoMap.toJS() : null;
    const watching = currentBuildInfo ? currentBuildInfo.watching : false;

    if (
      ( currentBuildInfo && currentBuildInfo.number !== data.lastBuild.number )
      || !jobInfo.building
    ) {
      if ( currentBuildInfo && currentBuildInfo.watching ) {
        this.removeBuildWatch( currentBuildInfoReference );
        currentBuildInfo.watching = false;
      }
    }

    this.mergeValues( currentBuildInfoReference, {
      number: data.lastBuild.number,
      url: this.getAPIUrl( data.lastBuild.url ),
    } );
    if ( jobInfo.building && !watching ) {
      this.collection = this.collection.setIn( [ ...currentBuildInfoReference, 'watching' ], true );
      const item = {
        url: data.lastBuild.url,
        nextRun: timeouts.runningJob,
        data: {
          reference: currentBuildInfoReference,
          isBuild: true,
          job: jobInfo,
        }
      };
      this.addItem( item );
    }
  }

  private removeBuildWatch( buildReference : string[] ) {
      // this.cron.remove( buildReference.url );
      this.collection = this.collection.setIn( [ ...buildReference, 'watching' ], false );
  }

  private updateInterval( url : string, isBuilding? : boolean ) {
    this.cron.updateInterval( url, isBuilding ? timeouts.runningJob : timeouts.job );
  }

  private calculateHealth( healthReport : any[] ) {
    if ( !healthReport || !healthReport.length ) {
      return undefined;
    }

    return healthReport.reduce( ( average : number | null, report : any ) => {
      const score = ( report && report.score ) || 100;

      if ( average === null ) {
        return score;
      }

      return ( average + score ) / 2;
    }, null );
  }

  private mergeValues( reference : string[], valueObj : any ) {
    this.createReferenceIfNeeded( reference );
    const valueKeys = Object.keys( valueObj )
    for ( const key of valueKeys ) {
      this.collection = this.collection.setIn( [ ...reference, key ], valueObj[ key ] );
    }
  }

  private createReferenceIfNeeded( reference : string[] ) {
    const partialReference = [];
    for ( const key of reference ) {
      partialReference.push( key );
      const refObj = this.collection.getIn( partialReference );
      if ( refObj === undefined ) {
        this.collection = this.collection.setIn( partialReference, Immutable.Map() );
      }
    }

    return this.collection.getIn( reference );
  }

  private isJobAllowed( name : string ) {
    const whitelist = typeof this.config.whitelist === 'string' ? [ this.config.whitelist ] : this.config.whitelist || [];
    const blacklist = typeof this.config.blacklist === 'string' ? [ this.config.blacklist ] : this.config.blacklist || [];
    const lowerName = name.toLowerCase();

    for ( const pattern of whitelist ) {
      if ( lowerName.indexOf( pattern.toLowerCase() ) === -1 ) {
        return false;
      }
    }

    for ( const pattern of blacklist ) {
      if ( lowerName.indexOf( pattern.toLowerCase() ) === -1 ) {
        return true;
      }
    }

    return true;
  }

  private processJobs( data : any, config : any ) {
    const reference = [ ...config.data.reference ];
    reference.push( 'jobs' );
    const refObj = this.createReferenceIfNeeded( reference );
    this.collection = this.collection.setIn( [ ...config.data.reference, 'type' ], 'folder' );

    const formerJobList = refObj && refObj.toJS ? refObj.toJS() : {};
    const formerJobNames = Object.keys( formerJobList );

    const newJobList = this.prepareRawJobs( data.jobs );
    const newJobNames = Object.keys( newJobList );

    let jobsRemoved = false;

    // Remove stale jobs
    for ( const name of formerJobNames ) {
      if ( !newJobList[ name ] ) {
        this.deleteItem( [ ...reference, name ] );
        jobsRemoved = true;
      }
    }

    // Add fetch job to new jobs
    for ( const name of newJobNames ) {
      if ( !this.isJobAllowed( name ) ) {
        continue;
      }

      if ( !formerJobList[ name ] ) {
        const jobItem = newJobList[ name ];
        const isJob = jobItem.jobs === undefined;
        const item = {
          url: jobItem.url,
          nextRun: timeouts[ jobItem.type ],
          data: {
            reference: [ ...reference, name ],
            isJob,
          }
        };
        this.addItem( item );
      }
    }

    if ( jobsRemoved ) {
      this.emitChange();
    }
  }

  private addItem( item : any ) {
    const url = this.getAPIUrl( item.url );
    const clonedItem = { ...item, url };
    this.cron.push( url, clonedItem );
    this.collection = this.collection.setIn( [ ...item.data.reference, 'url' ], url );
  }

  private deleteItem( reference : string[] ) {
    const item = this.collection.getIn( reference );
    this.cron.remove( item.get( 'url' ) );
    this.collection = this.collection.deleteIn( reference );
  }

  private emitChange() {
    this.emit( 'change', this.collection.toJS() );
  }

  private prepareRawJobs( jobs : any ) {
    const jobList = {};
    for ( const job of jobs ) {
      const type = this.checkIfFolder( job ) ? 'folder' : 'job';
      jobList[ job.name ] = {
        type,
        name: job.name,
        url: job.url,
      }

      if ( type === 'folder' ) {
        jobList[ job.name ].jobs = {};
      }
    }

    return jobList;
  }

  private checkIfFolder( job : any ) {
    if ( !job || !job._class ) {
      return;
    }

    return job._class.indexOf( 'plugins.folder' ) > -1 || job._class === 'hudson.model.Hudson';
  }

  private getAPIUrl( url : string ) {
    if ( !this.baseUrlObject ) {
      this.baseUrlObject = new URL( this.url );
    }
    const urlObject = new URL( url );
    const keepProperties = {
      pathname: urlObject.pathname,
      search: urlObject.search,
      hash: urlObject.hash,
    };

    if ( keepProperties.pathname.substr( -9 ) !== '/api/json' ) {
      keepProperties.pathname = trimLeadingSlash( keepProperties.pathname ) + '/api/json';
    }
    const newUrl = Object.assign( urlObject, this.baseUrlObject, keepProperties );
    return newUrl.toString();
  }
}
