import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import Example1 from './examples/test'

class App extends Component {
    render() {
        return (
            <Fragment>
                <h1>{ this.props.title }</h1>
                This loads an example to confirm there is a loadable ol-react package.
                <Example1 />
            </Fragment>
        );
    }
}

render(
    <App title="ol-react package test"/>, document.getElementById("app")
);
