import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import App from './App';

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:400');

  :root {
    font-size: 2vmax;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    background: #000;
    color: #ccc;
    font: 1em/1.3 'Open Sans', sans-serif;
  }
`;

ReactDOM.render(
  <App />,
  document.getElementById( 'root' ) as HTMLElement
);
