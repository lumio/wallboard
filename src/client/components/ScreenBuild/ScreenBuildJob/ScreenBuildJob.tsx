import * as React from 'react';

import {
  ScreenBuildJobWithProgressStateType,
} from './types';

import {
  ScreenBuildJobStyled,
  ScreenBuildJobProgressStyled,
} from './styles';

class ScreenBuildJobWithProgress extends React.Component<any, ScreenBuildJobWithProgressStateType> {
  timer : any;

  constructor( props : any ) {
    super( props );
    this.state = {
      currentTimestamp: Date.now(),
    };

    this.timer = setInterval( () => {
      this.setState( { currentTimestamp: Date.now() } );
    }, 1500 );
  }

  componentWillUnmount() {
    if ( this.timer ) {
      clearInterval( this.timer );
    }
  }

  render() {
    return <ScreenBuildJobStateless { ...this.props } />;
  }
}

const ScreenBuildJobStateless : React.StatelessComponent<any> = ( props : any ) => {
  const job = props.data;

  let buildProcess = '';
  let percentage = 0;
  const { building, build } = job;
  if ( job.status !== 'notbuilt'
    && building
    && build
    && build.timestamp
    && build.estimatedDuration
  ) {
    const elapsedTime = Date.now() - job.build.timestamp;
    percentage = Math.min( ( elapsedTime / job.build.estimatedDuration ) * 100, 100 );
    buildProcess = `(${ percentage.toFixed( 0 ) }%)`;
  }

  return (
    <ScreenBuildJobStyled
      { ...job }
      extraMargin={ props.extraMargin }
    >
      <div className='job-name-container'>
        <span className='job-name'>{ job.name } <small>{ buildProcess }</small></span>
        <span className='job-name-health'>
          <span className='job-name-health-bar' />
          <span className='job-name-health-bar-invert' />
        </span>
      </div>
      <ScreenBuildJobProgressStyled
        visible={ job.building }
        progress={ percentage }
        enabled={ job.enabled }
        health={ job.health }
        lastBuildFailed={ job.lastBuildFailed }
        status={ job.status }
      />
    </ScreenBuildJobStyled>
  );
};

const ScreenBuildJob : React.StatelessComponent<any> = ( props : any ) => {
  if ( props.data && props.data.building ) {
    return <ScreenBuildJobWithProgress { ...props } />;
  }

  return <ScreenBuildJobStateless { ...props } />;
};

export default ScreenBuildJob;
