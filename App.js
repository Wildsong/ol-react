import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {BrowserRouter, Link, Route, Redirect, Switch} from 'react-router-dom'
import {
    Container, Row, Col,
    Navbar,
    Nav,
    NavItem,
    NavLink,
    Button
} from 'reactstrap'
import {Example1, Example2, Example3, Example4, Example5, Example6, Example7, Example8} from './examples'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'ol-ext/dist/ol-ext.css'
import './App.css';

const SampleMap1 = () => ( <Example1 title="Sample 1 OSM and Draw" /> );
const SampleMap2 = () => ( <Example2 title="Sample 2 Rest and WMS" /> );
const SampleMap3 = () => ( <Example3 title="Sample 3 ESRI and Stamen" /> );
const SampleMap4 = () => ( <Example4 title="Sample 4 XYZ Tiles" /> );
const SampleMap5 = () => ( <Example5 title="Sample 5 Bookmarks" /> );
const SampleMap6 = () => ( <Example6 title="Sample 6 GeoServer WFS test" /> );
const SampleMap7 = () => ( <Example7 title="Sample 7 vector tiles" /> );
const SampleMap8 = () => ( <Example8 title="Sample 8 overlay" /> );

class PrimaryLayout extends Component {
    state = {
        isOpen: true
    };
    static propTypes = {
        "title": PropTypes.string.isRequired
    };

    render(props) {
        return (
            <Container fluid={ true }><Row>
                <Col sm="2">
                    <Navbar color="light" light expand="md">
                        <Nav vertical={ true } className="ml-auto" navbar>
                            <NavItem>
                              <NavLink href="/">1 Draw</NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink href="/sample2">2 REST/WMS</NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink href="/sample3">3 ESRI Stamen</NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink href="/sample4">4 XYZ Tiles</NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink href="/sample5">5 Bookmarks</NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink href="/sample6">6 WFS-T</NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink href="/sample7">7 VecTile</NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink href="/sample8">8 Overlay</NavLink>
                            </NavItem>
                        </Nav>
                    </Navbar>
                </Col>
                <Col sm="10">
                    <Switch>
                        <Route path="/sample2" component={SampleMap2} />
                        <Route path="/sample3" component={SampleMap3} />
                        <Route path="/sample4" component={SampleMap4} />
                        <Route path="/sample5" component={SampleMap5} />
                        <Route path="/sample6" component={SampleMap6} />
                        <Route path="/sample7" component={SampleMap7} />
                        <Route path="/sample8" component={SampleMap8} />
                        <Route exact path="/"  component={SampleMap1} />
                    </Switch>
                </Col>
            </Row></Container>
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
