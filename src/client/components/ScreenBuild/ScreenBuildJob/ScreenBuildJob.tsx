import * as React from 'react';

import {
  ScreenBuildJobStyled,
  ScreenBuildJobProgressStyled,
} from './styles';

const ScreenBuildJob : React.StatelessComponent<any> = ( props : any ) => {
  const job = props.data;

  let buildProcess = '';
  let percentage = 100;
  if ( job.building && job.build && job.build.timestamp && job.build.estimatedDuration ) {
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

export default ScreenBuildJob;
