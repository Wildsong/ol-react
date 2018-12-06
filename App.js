// App.js ol-react
//
import React, { Component } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import {Map, View, layer, source, Feature, geom} from './src';
import apiKeys from './apikeys';

// For pedagogy,
// title is a required prop
//

class App extends Component {
    render(props) {
        return (
            <div>
            <h1>{this.props.title}</h1>
            <h2>Source: OpenStreetMap</h2>
            <ul>
                <li>Vector source</li>
                <ul>
                <li> Point: circle near Null Island </li>
                <li> Circle: circle near Null Island </li>
                <li> LineString: partial red box around Null Island</li>
                </ul>
            </ul>
            <Map view=<View resolution={2500} center={[0, 0]}/>>
                <layer.Tile>
                    <source.OSM />
                </layer.Tile>

                <layer.Vector>
                    <source.Vector>
                        <Feature id="test-point">
                            <geom.Point>
                                {[0, 0]}
                            </geom.Point>
                        </Feature>

                        <Feature id="test-line" style={{stroke: {color: [255, 0, 0, 1]}}}>
                            <geom.LineString layout="XY">
                                { [[0, 0], [100000, 0], [100000, 100000], [0, 100000]] }
                            </geom.LineString>
                        </Feature>

                        <Feature id="test-circle">
                            <geom.Circle> { [[0,0], 1000] }</geom.Circle>
                        </Feature>

                        <Feature id="test-polygon">
                            <geom.Polygon>
                                {[[1000, 0], [40000, 0], [100000, 100000], [0, 100000], [1000, 0]]}
                            </geom.Polygon>
                        </Feature>

                        {/*
                            <Feature style={{image: {circle: {fill: {color: [255, 0, 0, 1]}}, radius:5,stroke:{color:"#ff0",width:1}}}}>
                                <geom.Point>
                                    {[0, 0]}
                                </geom.Point>
                            </Feature>

        */}
                    </source.Vector>
                </layer.Vector>

            </Map>
        {/*
            <h2>Source: ArcGIS image source</h2>
            <Map view=<View resolution={10000} center={[0, 0]}/>>
                <layer.Tile>
                    <source.ImageArcGISRest />
                </layer.Tile>
            </Map>

            <h2>Source: BingMaps</h2>
            <Map view=<View resolution={10000} center={[0, 0]}/>>
                <layer.Tile>
                    <source.BingMaps apiKey={apiKeys['BingMaps']} />
                </layer.Tile>
            </Map>
        */}
            </div>
        );
    }
}

App.propTypes = {
    "title": PropTypes.string.isRequired
};


export default App;
