import React, { Component } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import {Map, View, layer, source, Feature, geom} from './src';
import apiKeys from './apikeys';
import {transform} from 'ol/proj';

const wgs84 = "EPSG:4326";
const wm = "EPSG:3857";

const astoria = transform([-123.834,46.187], wgs84,wm)

function transformfn(coordinates) {
    console.log("input=", coordinates)
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += astoria[0];
        coordinates[i+1] += astoria[1];
    }
    console.log("output=", coordinates)
    return coordinates
}

class App extends Component {
    render(props) {
        let pointStyle = {
            image: {
                type: 'circle',
                radius: 10,
                fill: { color: [100,100,100, 0.5] },
                stroke: { color: 'green', width: 1 }
            }
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

            <h2>Transformations</h2>

            <h2>Sources</h2>
            <ul>
                <li>Tile Source: ArcGIS REST sample: United States map</li>
                <li>Source OSM: OpenStreetMap of the world</li>
                <li>XYZ tiles: ESRI world street map</li>
            </ul>
            <ul>
                <li>Vector source</li>
                    <ul>
                    <li> Point: small green circle near Astoria </li>
                    <li> Circle: circle around Astoria </li>
                    <li> LineString: yellow line near Astoria</li>
                    </ul>
            </ul>

            <Map view=<View zoom={12} center={astoria}/>>
                <layer.Tile opacity={1.0}>
                    <source.TileWMS
                    url="http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=GEBCO_LATEST&format=image/png&STYLE=default"
                    />
                </layer.Tile>
                <layer.Tile opacity={1.0}>
                    <source.XYZ
                    url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                    />
                </layer.Tile>
                <layer.Tile opacity={0.1}>
                    <source.OSM />
                </layer.Tile>
                <layer.Tile opacity={0.1}>
                        <source.TileArcGISRest
                        url="https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer" />
                </layer.Tile>

                <layer.Vector style={polyStyle}>
                    <source.Vector>
                        <Feature id="test-line" style={lineStyle}>
                            <geom.LineString transform={transformfn} layout="XY">
                                { [[6000,6000], [-6000, 6000], [-6000, 6000], [-6000, -6000], [6000,-6000]] }
                            </geom.LineString>
                        </Feature>

                        <Feature id="test-circle" style={polyStyle}>
                            <geom.Circle>{[astoria, 4000]}</geom.Circle>
                        </Feature>

                        <Feature id="test-circle-zeroradius" style={polyStyle}>
                            <geom.Circle transform={transformfn}>{[6000,0]}</geom.Circle>
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
