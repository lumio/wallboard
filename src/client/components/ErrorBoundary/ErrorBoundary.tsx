import * as React from 'react';

interface ErrorBoundaryPropsType {
  children? : React.ReactNode;
}

interface ErrorBoundaryStateType {
  error : any;
  errorInfo : any;
  errorProps? : any;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryPropsType, ErrorBoundaryStateType> {
  constructor( props : ErrorBoundaryPropsType ) {
    super( props );

    this.state = {
      error: null,
      errorInfo: null,
      errorProps: null,
    };
  }

  componentDidCatch( errObj : any, errorInfo : any ) {
    let error = errObj;
    let errorProps = null;

    if ( errObj && errObj.err ) {
      error = errObj.err;
    }

    if ( errObj && errObj.props ) {
      errorProps = errObj.props;
    }

    this.setState( {
      error,
      errorInfo,
      errorProps,
    } );
  }

  renderErrorMessage() {
    if ( typeof this.state.error === 'string' ) {
      return <p>{ this.state.error }</p>;
    }

    return (
      <pre>
        { JSON.stringify( this.state.error, null, 2 ) }
      </pre>
    );
  }

  render() {
    if ( this.state.error || this.state.errorInfo || this.state.errorProps ) {
      return (
        <div className='error failed-component'>
          <h1>Oops!</h1>
          { this.renderErrorMessage() }
          { this.state.errorProps ? (
              <pre>{ JSON.stringify( this.state.errorProps, null, 2 ) }</pre>
            ) : null }
          { this.state.errorInfo ? (
              <pre>{ JSON.stringify( this.state.errorInfo, null, 2 ).replace( /\\n/g, '\n' ) }</pre>
            ) : null }
        </div>
      );
    }

    return this.props.children;
  }
}
