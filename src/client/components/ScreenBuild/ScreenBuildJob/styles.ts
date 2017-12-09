import styled, { keyframes } from 'styled-components';
import * as polished from 'polished';
import colors from '../../../colors';
import {
  ScreenBuildJobStyledPropsType,
  ScreenBuildJobProgressStyledPropsType,
} from './types';

const getBaseColor = ( props : any ) => {
  if ( !props.enabled || !props.status || props.status === 'unknown' || !props.health ) {
    return colors.gray;
  }
  else if ( props.lastBuildFailed || props.status === 'failed' ) {
    return colors.red;
  }

  return polished.mix( props.health / 100, colors.green, colors.red );
};

const pulseKeyframes = keyframes`
  from {
    transform: scale( .98 );
  }

  to {
    transform: scale( 1.1 );
  }
`;

// Defining the width of the hearts
// Everything under 20% should get 0 hearts.
const healthGroupWidth = [
  0,
  35,
  51.65,
  70,
  85.45,
  100,
];

const ScreenBuildJobProgressStyled = styled.div`
  border-radius: .25em;
  overflow: hidden;
  position: relative;

  transition: height .5s ease, opacity .25s, margin .5s ease, box-shadow .25s;
  ${ ( props : ScreenBuildJobProgressStyledPropsType ) => (
    props.visible ? `
      opacity: 1;
      height: 1em;
      margin-top: .5em;
      box-shadow: .1em .1em 1em rgba( 0, 0, 0, .1 );
    ` : `
      opacity: 0;
      height: 0;
      margin-top: 0;
      box-shadow: none;
    `
  ) }

  ${ ( props : ScreenBuildJobProgressStyledPropsType ) => {
    const baseColor = getBaseColor( props );
    const progressBaseColor = polished.tint( .85, polished.lighten( .1, baseColor ) );
    return `
      background: ${ polished.shade( .6, baseColor ) };

      &::before {
        content: '';
        display: block;
        height: 1em;
        background: ${ progressBaseColor };
        width: ${ props.progress }%;
        transition: width .5s ease-out;
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 1em;
        box-shadow: 0 0 1em rgba( 0, 0, 0, .15 ) inset;
      }
    `;
  } }
`;

const ScreenBuildJobStyled = styled.div`
  min-width: 25vw;
  border-radius: .25em;
  margin-bottom: .75em;
  padding: 1em;
  transform: scale( 1 );
  transition: transform .25s ease, background .5s, box-shadow .5s;

  small {
    opacity: .6;
    font-weight: bold;
  }

  ${ ( props : ScreenBuildJobStyledPropsType ) => (
    props.extraMargin ? `
      width: calc( 100% - 1em - 4px );
      margin-left: calc( .5em + 2px );
    ` : `
      width: 100%;
    `
  ) }

  ${ ( props : ScreenBuildJobStyledPropsType ) => {
    const baseColor = getBaseColor( props );
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

    const healthGroup = Math.round( ( props.health - ( props.health % 20 ) ) / 20 );
    const healthWidth = healthGroupWidth[ healthGroup ];

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
          width: ${ healthWidth }%;
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

  ${ ( props : ScreenBuildJobStyledPropsType ) => props.building ? `
    animation: ${ pulseKeyframes } 2s ease-in-out infinite alternate;
  ` : '' }
`;

export {
  ScreenBuildJobStyled,
  ScreenBuildJobProgressStyled,
};
