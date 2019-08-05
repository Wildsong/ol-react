import React from 'react'
import PropTypes from 'prop-types'
import {BrowserRouter as Router, Route, NavLink} from "react-router-dom"

import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import './App.css';

import {Example0, Example1, Example2, Example3, Example4, Example5, Example6, Example7, Example8} from './examples'

const App = ({title}) => {
    return (
        <>
        <h1>{title}</h1>
        <Router>
            <div>
                <NavLink to="/">Starting Page</NavLink>
                <NavLink to="/example1">1 Draw</NavLink>
                <NavLink to="/example2">2 REST/WMS</NavLink>
                <NavLink to="/example3">3 Stamen</NavLink>
                <NavLink to="/example4">4 XYZ Tiles</NavLink>
                <NavLink to="/example5">5 Bookmarks</NavLink>
                <NavLink to="/example6">6 WFS-T</NavLink>
                <NavLink to="/example7">7 VecTile</NavLink>
                <NavLink to="/example8">8 VecTile Overlay</NavLink>
                <Route path="/" exact component={Example0} />
                <Route path="/example1" exact component={Example1} />
                <Route path="/example2" exact component={Example2} />
                <Route path="/example3" exact component={Example3} />
                <Route path="/example4" exact component={Example4} />
                <Route path="/example5" exact component={Example5} />
                <Route path="/example6" exact component={Example6} />
                <Route path="/example7" exact component={Example7} />
                <Route path="/example8" exact component={Example8} />
            </div>
        </Router>
        </>
    );
}
App.propTypes = {
    "title": PropTypes.string.isRequired
};
export default App;
