import * as React from 'react';
import ScreenBuildFolder from './ScreenBuildFolder';
import { ScreenBuildPropsType } from './types';

import * as hearts from './hearts.svg';
// tslint:disable-next-line
const SVGInline = require( 'react-svg-inline' ).default;
import { ScreenBuildWrapperStyled } from './styles';

const ScreenBuild : React.StatelessComponent<ScreenBuildPropsType> = ( props : ScreenBuildPropsType ) => {
  if ( !props.data.jobs ) {
    return (
      <div>no jobs</div>
    );
  }

  return (
    <ScreenBuildWrapperStyled>
      <SVGInline svg={ hearts } />
      <ScreenBuildFolder data={ props.data } root />
    </ScreenBuildWrapperStyled>
  );
};

export default ScreenBuild;
