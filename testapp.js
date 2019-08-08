import React from 'react';  // eslint-disable-line no-unused-vars
import {render} from 'react-dom'
import Example1 from './examples/test' // eslint-disable-line no-unused-vars

const App = () => {  // eslint-disable-line no-unused-vars
    return (
        <>
            <h1>{ this.props.title }</h1>
            This loads an example to confirm there is a loadable ol-react package.
            <Example1 />
        </>
    );
}

render(
    <App title="ol-react package test"/>, document.getElementById("app")
);
