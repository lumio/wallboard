import * as React from 'react';
import ScreenBuildJob from '../ScreenBuildJob';

import {
  ScreenBuildFolderStyled,
} from './styles';

const ScreenBuildFolder : React.StatelessComponent<any> = ( props : any ) => {
  if ( !props.data.jobs ) {
    return null;
  }

  return (
    <ScreenBuildFolderStyled name={ props.data.name }>
      <div className='folder-name'>{ props.data.name }</div>

      { Object.keys( props.data.jobs ).map( ( jobName ) => {
        const job = props.data.jobs[ jobName ];
        if ( job.type === 'folder' ) {
          return <ScreenBuildFolder key={ jobName } data={ job } />;
        }

        return <ScreenBuildJob key={ jobName } data={ job } />;
      } ) }
    </ScreenBuildFolderStyled>
  );
};

export default ScreenBuildFolder;
