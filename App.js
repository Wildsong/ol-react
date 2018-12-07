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
        let pointStyle = {
            stroke: {color: [0, 0, 0, 1], width:1},
            fill: {color: [0, 255, 255, .250]},
        };
        let lineStyle = {
            stroke: {
                color: [255, 255, 0, 1],
                width: 3
            }
        };
        let polyStyle = {
            stroke: {color: [0, 0, 0, 1], width:4},
            fill: {color: [255, 0, 0, .250]},
        };
        return (
            <div>
            <h1>{this.props.title}</h1>
            <ul>
                <li>Tile Source: ArcGIS sample: United States map</li>
                <li>Source OSM: OpenStreetMap</li>
            </ul>
            <ul>
                <li>Vector source</li>
                <ul>
                <li> Point: small circle near Null Island </li>
                <li> Circle: circle south of Null Island </li>
                <li> LineString: yellow line near Null Island</li>
                </ul>
            </ul>

            <Map view=<View resolution={2500} center={[0, 0]}/>>

                <layer.Tile>
                    <source.OSM />
                </layer.Tile>
                <layer.Tile opacity={0.5}>
                        <source.TileArcGISRest
                        extent={[-13884991, 2870341, -7455066, 6338219]}
                        url="https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer" />
                </layer.Tile>

                <layer.Vector style={polyStyle}>
                    <source.Vector>
                        <Feature id="test-line" style={lineStyle}>
                            <geom.LineString layout="XY">
                                { [[-70000,200000], [0, 30000], [100000, 0], [200000, 140000], [1000, 80000]] }
                            </geom.LineString>
                        </Feature>

                        <Feature id="test-circle" style={polyStyle}>
                            <geom.Circle>{[[0,-100000], 60000]}</geom.Circle>
                        </Feature>

                        <Feature id="test-polygon" style={polyStyle}>
                            <geom.Polygon>{[[1000, 0], [40000, 0], [100000, 100000], [0, 100000], [1000, 0]]}</geom.Polygon>
                        </Feature>

                        <Feature id="test-point" style={pointStyle}>
                            <geom.Point>
                                {[0, 0]}
                            </geom.Point>
                        </Feature>
                    </source.Vector>
                </layer.Vector>

            </Map>
        {/*

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
