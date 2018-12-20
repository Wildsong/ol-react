import React, { Component } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import {Map, View, Feature, control, geom, interaction, layer, source} from './src';
import apiKeys from './apikeys';
import {ATTRIBUTION as osmAttribution} from 'ol/source/OSM';
import {transform} from 'ol/proj';
import './App.css';

const wgs84 = "EPSG:4326";
const wm = "EPSG:3857";

const astoria_wm = transform([-123.834,46.187], wgs84,wm)

let transformfn = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += astoria_wm[0];
        coordinates[i+1] += astoria_wm[1];
    }
    return coordinates
}

let attributions = [
    osmAttribution,
    'and ESRI too.'
];

let pi = 3.1416;

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
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

            <h2>Sources</h2>
                <ul>
                    <li>Tile Source: ArcGIS REST sample: United States map</li>
                    <li>Source OSM: OpenStreetMap of the world</li>
                    <li>XYZ tiles: ESRI world street map</li>
                </ul>
                <ul>
                    <li>Vector source</li>
                        <ul>
                        <li> Point: small green circle near Astor Column</li>
                        <li> Circle: big circle around Astoria </li>
                        <li> LineString: yellow line near Astoria</li>
                        <li> Polygon: triangle with a triangle hole inside it</li>
                        </ul>
                </ul>

            <Map view=<View rotation={pi*.25} zoom={10} center={astoria_wm}/> useDefaultControls={false}>

{/*
                <layer.Tile opacity={0.5}>
                    <source.OSM attributions={attributions}/>
                </layer.Tile>

                <layer.Tile opacity={0.3}>
                    <source.XYZ
                        url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                        attributions={attributions}
                     />
                </layer.Tile>

                <layer.Tile opacity={0.5}>
                    <source.TileWMS
                        url="http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=GEBCO_LATEST&format=image/png&STYLE=default"
                        attributions={attributions}
                    />
                </layer.Tile>

                <layer.Tile opacity={0.1}>
                    <source.TileArcGISRest
                        url="https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer"
                        attributions={attributions} />
                </layer.Tile>
*/}
                <layer.Vector style={polyStyle}>
                    <source.Vector>
                    {/*
                        <Feature id="test-line" style={lineStyle}>
                            <geom.LineString transform={transformfn} layout="XY">
                                { [[6000,6000], [-6000, 6000], [-6000, 6000], [-6000, -6000], [6000,-6000]] }
                            </geom.LineString>
                        </Feature>

                        <Feature id="test-circle" style={polyStyle}>
                            <geom.Circle>{[astoria_wm, 4000]}</geom.Circle>
                        </Feature>

                        <Feature id="test-circle-zeroradius" style={polyStyle}>
                            <geom.Circle transform={transformfn}>{[6000,0]}</geom.Circle>
                        </Feature>
*/}
                        <Feature id="test-polygon" style={polyStyle}>
                            <geom.Polygon transform={transformfn} modify={false}>
                                {[
                                    [[-3500, -2000], [3500, -2000], [0, 4000], [-3500, -2000]],
                                    [[0, -1000], [1000, 1000], [-1000, 1000], [0, -1000]],
                                ]}
                            </geom.Polygon>
                        </Feature>
{/*
                        <Feature id="test-point" style={pointStyle}>
                            <geom.Point transform={transformfn}>
                                {[1835, -910]}
                            </geom.Point>
                        </Feature>

                        <Feature id="test-multipoint" style={pointStyle}>
                            <geom.MultiPoint transform={transformfn}>
                                { [[-6000, -4000], [6000, -3000], [0, 6400]] }
                            </geom.MultiPoint>
                        </Feature>
*/}

                        {/*
    Implement and test...
                        Test MultiLineString
                        Test MultiPolygon
                        Test GeometryCollection
                        */}
                    </source.Vector>
                </layer.Vector>

                {/*

                <control.Attribution label={"<<"} collapsible={true} collapsed={true} />
                <control.FullScreen />
                <control.MousePosition projection={wgs84}/>
                <control.OverviewMap/>
                <control.Rotate autoHide={false}/>
                <control.ScaleLine units={control.ScaleLineUnits.US} />
                <control.Zoom />
                <control.ZoomSlider />
                <control.ZoomToExtent />

                <interaction.DoubleClickZoom />
                <interaction.DragBox />
                <interaction.DragPan />
                <interaction.DragRotate />
                <interaction.DragRotateAndZoom />
                <interaction.DragZoom />
                <interaction.Draw />
                <interaction.KeyboardPan />
                <interaction.KeyboardZoom />
                <interaction.MouseWheelZoom />
                <interaction.PinchRotate />
                <interaction.PinchZoom />

                No need to declare Modify explicitly.
                When you create a geometry and set modify=true on it
                then the ol-geometry will automatically set up a modify interaction
            <interaction.Modify features={selected_features}/>
            <interaction.Select/>
                */}

                {/*
         not planning on using Bing so have not tested it yet
            <h2>Source: BingMaps</h2>
            <Map view=<View resolution={10000} center={[0, 0]}/>>
                <layer.Tile>
                    <source.BingMaps apiKey={apiKeys['BingMaps']} />
                </layer.Tile>
        */}

            </Map>
            </div>
        );
    }
}

App.propTypes = {
    "title": PropTypes.string.isRequired
};

export default App;
