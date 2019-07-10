import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'redux-first-router-link'
import { connect } from 'react-redux'
import { Navbar, Nav, NavItem } from 'reactstrap'

import 'bootstrap/dist/css/bootstrap.css'
import 'ol-ext/dist/ol-ext.css'
import './App.css';

import * as components from './examples'

const App = ({page}) => {
    const Example = components[page]
    console.log("App page =", page);
    return (
        <>
            <Navbar className="map46-navbar" expand="md">
                <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink to="/">Home</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/example1">1 Draw</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/example2">2 REST/WMS</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/example3">3 ESRI Stamen</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/example4">4 XYZ Tiles</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/example5">5 Bookmarks</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/example6">6 WFS-T</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/example7">7 VecTile</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/example8">8 Overlay</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>

            <Example />
        </>
    );
}
App.propTypes = {
    "title": PropTypes.string.isRequired
};
const mapStateToProps = (state) => ({
    page:   state.page,
});
export default connect(mapStateToProps)(App);
