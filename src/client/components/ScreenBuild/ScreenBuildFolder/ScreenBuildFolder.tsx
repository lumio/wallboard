import * as React from 'react';
import ScreenBuildJob from '../ScreenBuildJob';

import { ScreenBuildFolderStyled } from './styles';

function separateFoldersFromJobs( list : any ) {
  const data = {
    folders: {},
    jobs: {},
  };

  const itemNames = Object.keys( list );
  for ( const key of itemNames ) {
    let target = 'jobs';
    if ( list[ key ].type === 'folder' ) {
      target = 'folders';
    }

    data[ target ][ key ] = list[ key ];
  }

  return data;
}

const ScreenBuildFolder : React.StatelessComponent<any> = ( props : any ) => {
  if ( !props.data.jobs ) {
    return null;
  }

  const list = separateFoldersFromJobs( props.data.jobs );
  const hasFolders = Object.keys( list.folders ).length > 0;
  return (
    <ScreenBuildFolderStyled name={ props.data.name }>
      <div className='folder-name'>{ props.data.name }</div>

      { Object.values( list.folders ).map( ( folder : any ) => (
        <ScreenBuildFolder key={ folder.name || 'unknown' } data={ folder } />
      ) ) }
      { Object.values( list.jobs ).map( ( job : any ) => (
        <ScreenBuildJob extraMargin={ hasFolders } key={ job.name } data={ job } />
      ) ) }
    </ScreenBuildFolderStyled>
  );
};

export default ScreenBuildFolder;
