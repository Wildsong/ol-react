// App.js ol-react
//
import React, { Component, Fragment } from 'react'
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
import {Example1, Example2, Example3} from './examples'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

const SampleMap1 = () => ( <Example1 title="Sample Map 1" /> );
const SampleMap2 = () => ( <Example2 title="Sample Map 2" /> );
const SampleMap3 = () => ( <Example3 title="Sample Map 3" /> );

class PrimaryLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true
        };
    }

    render(props) {
        return (
            <Fragment>
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
                      <NavLink href="/">SampleMap1</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/sample2">SampleMap2</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/sample3">SampleMap3</NavLink>
                    </NavItem>
                    </Nav>
                  </Collapse>
                </Navbar>

                <Switch>
                <Route exact path="/" component={SampleMap1} />
                <Route path="/sample2" component={SampleMap2} />
                <Route path="/sample3" component={SampleMap3} />
                </Switch>
            </Fragment>
        );
    }
}

PrimaryLayout.propTypes = {
    "title": PropTypes.string.isRequired
};

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
            <PrimaryLayout title={this.props.title}/>
            </BrowserRouter>
        );
    }
}
