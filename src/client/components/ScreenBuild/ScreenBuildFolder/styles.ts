import styled from 'styled-components';
import { ScreenBuildFolderStyledPropsType } from './types';

export const ScreenBuildFolderStyled = styled.div`
  border-radius: .25em;
  padding: .5em .5em .25em;
  margin-bottom: 1em;
  margin-right: .5em;
  width: 100%;

  ${ ( props : ScreenBuildFolderStyledPropsType ) => `
    ${ props.name ? `
      border: 2px solid rgba( 180, 180, 180, .25 );
      background: #222;
    ` :
    ` border: 2px solid transparent;` }

    .folder-name {
      display: ${ props.name !== '' ? 'block' : 'none' };
      color: rgba( 180, 180, 180, .5 );
      margin-bottom: .5em;
      text-align: center;
      word-break: break-all;
    }
  ` }
`;
