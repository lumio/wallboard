import styled, { keyframes } from 'styled-components';
import * as polished from 'polished';
import colors from '../../../colors';
import { ScreenBuildJobStyledPropsType } from './types';

const pulseKeyframes = keyframes`
  from {
    transform: scale( .98 );
  }

  to {
    transform: scale( 1.1 );
  }
`;

export const ScreenBuildJobStyled = styled.div`
  min-width: 25vw;
  width: 100%;
  border-radius: .25em;
  margin-bottom: .75em;
  padding: 1em;
  transition: transform .25s ease, background .5s, box-shadow .5s;

  ${ ( props : ScreenBuildJobStyledPropsType ) => {
    const baseColor = ( () => {
      if ( !props.enabled ) {
        return colors.gray;
      }
      else if ( props.lastBuildFailed || props.status === 'failed' ) {
        return colors.red;
      }

      return polished.mix( props.health / 100, colors.green, colors.red );
    } )();
    let color = baseColor;

    if ( props.building ) {
      color = polished.lighten( .075, color );
    }

    let namePrefix = '';
    let namePrefixColor = '';
    if ( props.lastBuildFailed ) {
      namePrefix = '✗';
      namePrefixColor = colors.red;
    }
    else if ( props.lastBuildSucceeded ) {
      namePrefix = '✓';
      namePrefixColor = colors.green;
    }
    if ( !props.enabled ) {
      namePrefix = '';
    }

    return `
      background: ${ color };
      box-shadow: 0 .25em 0 ${ polished.shade( .8, color ) };

      .job-name-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #fff;
      }

      .job-name {
        word-break: break-all;
        text-shadow: 1px 2px 5px rgba( 0, 0, 0, .5 );
        width: 100%;
      }

      .job-name-health {
        position: relative;
        display: inline-block;
        width: 110px;
        min-width: 110px;
        height: 30px;

        .job-name-health-bar {
          position: relative;
          z-index: 10;
          filter: drop-shadow( 0 .15em 0 ${ polished.shade( .8, colors.red ) } );
        }

        .job-name-health-bar::before {
          content: '';
          display: inline-block;
          float: left;
          width: ${ props.health }%;
          height: 1.5em;
          background: ${ polished.lighten( .1, colors.red ) };
          clip-path: url( #hearts );
          transition: width .5s ease;
        }

        .job-name-health-bar-invert {
          position: absolute;
          z-index: 0;
          left: 0;
          top: 0;
          width: 100%;
          height: 1.5em;
          filter: drop-shadow( 0 .15em 0 ${ polished.shade( .5, color ) } );
        }

        .job-name-health-bar-invert::before {
          content: '';
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 1.5em;
          background: ${ polished.shade( .8, color ) };
          clip-path: url( #hearts );
        }
      }

      ${ namePrefix ? `
        .job-name::before {
          content: '${ namePrefix }';
          background: ${ polished.lighten( .55, namePrefixColor ) };
          color: ${ polished.darken( .2, namePrefixColor ) };
          text-shadow: none;
          box-shadow: 1px 1px .125em rgba( 0, 0, 0, .25 ) inset, -1px -1px 0 rgba( 255, 255, 255, .25 ) inset;

          display: inline-flex;
          justify-content: center;
          align-items: center;
          font-size: .9em;
          width: 1.1em;
          height: 1.1em;
          margin-right: .25em;
          border-radius: 50%;
        }
      ` : '' }
    `;
  } }

  .job-status {
    display: none;
  }


  ${ ( props : ScreenBuildJobStyledPropsType ) => props.building ? `
    animation: ${ pulseKeyframes } 2s ease-in-out infinite alternate;
  ` : '' }
`;
