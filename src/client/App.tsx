import * as React from 'react';
import styled from 'styled-components';
import * as polished from 'polished';
import colors from './colors';

import ScreenBuild from './components/ScreenBuild';

interface AppStateType {
  pending? : boolean;
  error? : any;
  data? : any;
}

const wsAddress = ( process.env.NODE_ENV && process.env.NODE_ENV === 'development' )
  ? 'ws://localhost:5000' : 'ws://' + window.location.host;

const AppStyled = styled.div`
  &.error {
    padding: 2em;

    h1 {
      color: ${ polished.lighten( .2, colors.red ) };
    }
  }

  &.loading {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100vh;
    color: #555;
  }
`;

class App extends React.Component<{}, AppStateType> {
  socket : WebSocket;
  constructor( props : {} ) {
    super( props );

    this.state = {
      pending: true,
    };
  }

  componentDidMount() {
    this.socket = new WebSocket( wsAddress );
    this.socket.onmessage = ( event ) => {
      try {
        const data = JSON.parse( event.data );
        if ( data.type === 'error' ) {
          throw new Error( data.error );
        }

        this.readData( data );
      }
      catch ( e ) {
        this.setState( {
          error: e,
          pending: false,
        } );
      }
    };

    this.socket.onerror = ( error ) => {
      this.setState( {
        error: JSON.stringify( error ),
        pending: false,
      } );
    };

    this.socket.onopen = ( event ) => {
      this.setState( {
        pending: true,
      } );
    };
  }

  componentWillUnmount() {
    this.socket.close();
  }

  readData( data : any ) {
    if ( data.type !== 'change' ) {
      return;
    }

    this.setState( {
      pending: false,
      error: false,
      data: data.data,
    } );
  }

  render() {
    if ( this.state.error ) {
      return (
        <AppStyled className='error'>
          <h1>Error</h1>
          <pre>{ this.state.error }</pre>
        </AppStyled>
      );
    }

    if ( this.state.pending ) {
      return (
        <AppStyled className='loading'>Loading</AppStyled>
      );
    }

    return (
      <div>
        <ScreenBuild data={ this.state.data } />
      </div>
    );
  }
}

export default App;
