import * as React from 'react';

import { ScreenBuildJobStyled } from './styles';

const ScreenBuildJob : React.StatelessComponent<any> = ( props : any ) => {
  const job = props.data;

  return (
    <ScreenBuildJobStyled
      { ...job }
      extraMargin={ props.extraMargin }
    >
      <div className='job-status'>{ job.building ? 'building' : 'idle' }</div>
      <div className='job-name-container'>
        <span className='job-name'>{ job.name }</span>
        <span className='job-name-health'>
          <span className='job-name-health-bar' />
          <span className='job-name-health-bar-invert' />
        </span>
      </div>
    </ScreenBuildJobStyled>
  );
};

export default ScreenBuildJob;
