import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {BrowserRouter, Link, Route, Redirect, Switch} from 'react-router-dom'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Button
} from 'reactstrap'
import {Example1, Example2, Example3, Example4, Example5} from './examples'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

const SampleMap1 = () => ( <Example1 title="Sample 1: OSM and Draw" /> );
const SampleMap2 = () => ( <Example2 title="Sample 2: Rest and WMS" /> );
const SampleMap3 = () => ( <Example3 title="Sample 3: ESRI and Stamen" /> );
const SampleMap4 = () => ( <Example4 title="Sample 4: Tile and XYZ" /> );
const SampleMap5 = () => ( <Example5 title="Sample 5: Nominatim" /> );

class PrimaryLayout extends Component {
    state = {
        isOpen: true
    };
    static propTypes = {
        "title": PropTypes.string.isRequired
    };

    render(props) {
        return (
            <>
                <Navbar color="light" light expand="md">
                  <NavbarBrand href="/">
                    <span id="sitelogo"></span>
                    <span id="sitename"></span>
                    {this.props.title}
                  </NavbarBrand>
                  <NavbarToggler onClick={this.toggle} />
                  <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink href="/">Sample 1</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/sample2">Sample 2</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/sample3">Sample 3</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/sample4">Sample 4</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/sample5">Sample 5</NavLink>
                    </NavItem>
                    </Nav>
                  </Collapse>
                </Navbar>

                <Switch>
                    <Route path="/sample2" component={SampleMap2} />
                    <Route path="/sample3" component={SampleMap3} />
                    <Route path="/sample4" component={SampleMap4} />
                    <Route path="/sample5" component={SampleMap5} />
                    <Route exact path="/"  component={SampleMap1} />
                </Switch>
            </>
        );
    }
}


export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
            <PrimaryLayout title={this.props.title}/>
            </BrowserRouter>
        );
    }
}
