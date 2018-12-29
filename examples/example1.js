import React, { Component } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import {ATTRIBUTION as osmAttribution} from 'ol/source/OSM'
import {transform} from 'ol/proj'
// Bootstrap (reactstrap in this case)
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
import SliderControl from './slider-control'
import {Map, View, Feature, control, geom, interaction, layer, source} from '../src'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'

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
];

let pi = 3.1416;

export default class Example extends Component {
    constructor(props) {
        super(props)
        this.changeOpacity1 = this.changeOpacity1.bind(this);
        this.changeOpacity2 = this.changeOpacity2.bind(this);
        this.state = {
            enableModify: true, // can't change this in the app yet
            opacityOSM : 100,
            opacityVector : 100,
        }
    }

    changeOpacity1(value) {
        this.setState({opacityOSM : value});
    }

    changeOpacity2(value) {
        this.setState({opacityVector : value});
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
                <h2>{this.props.title}</h2>
                    <h3>Tile source: OpenStreetMap</h3>

                    <h3>Vector source</h3>
                        <ul>
                            <li> Point: small green circle near Astor Column</li>
                            <li> Circle: big circle around Astoria </li>
                            <li> LineString: yellow line near Astoria</li>
                            <li> Polygon: triangle with a triangle hole inside it</li>
                        </ul>

                    Interactions tested here: DRAW

                    <SliderControl
                        onChange={this.changeOpacity1}
                        title="OSM"
                        value={this.state.opacityOSM}
                    />
                    <SliderControl
                        onChange={this.changeOpacity2}
                        title="Vectors"
                        value={this.state.opacityVector}
                    />

                <Map view=<View rotation={pi*.25} zoom={10} center={astoria_wm}/> useDefaultControls={false}>

                    <layer.Tile source="OSM"
                        attributions={attributions}
                        opacity={this.state.opacityOSM/100}
                    />

                    <layer.Vector
                        style={polyStyle}
                        opacity={this.state.opacityVector/100} >

                        <Feature id="test-line" style={lineStyle}>
                            <geom.LineString transform={transformfn} modify={this.state.enableModify} layout="XY">
                                { [[6000,6000], [-6000, 6000], [-6000, 6000], [-6000, -6000], [6000,-6000]] }
                            </geom.LineString>
                        </Feature>

                        <Feature id="test-circle" style={polyStyle}>
                            <geom.Circle modify={this.state.enableModify} >{[astoria_wm, 4000]}</geom.Circle>
                        </Feature>

                        <Feature id="test-circle-zeroradius" style={polyStyle}>
                            <geom.Circle transform={transformfn} modify={this.state.enableModify} >{[6000,0]}</geom.Circle>
                        </Feature>

                        <Feature id="test-polygon" style={polyStyle}>
                            <geom.Polygon transform={transformfn} modify={this.state.enableModify} insertVertexCondition={ ()=>{return true;} }>
                                {[
                                    [[-3500, -2000], [3500, -2000], [0, 4000], [-3500, -2000]],
                                    [[0, -1000], [1000, 1000], [-1000, 1000], [0, -1000]],
                                ]}
                            </geom.Polygon>
                        </Feature>

                        <Feature id="test-point" style={pointStyle}>
                            <geom.Point transform={transformfn} modify={this.state.enableModify} >
                                {[1835, -910]}
                            </geom.Point>
                        </Feature>

                        <Feature id="test-multipoint" style={pointStyle}>
                            <geom.MultiPoint transform={transformfn} modify={this.state.enableModify} >
                                { [[-6000, -4000], [6000, -3000], [0, 6400]] }
                            </geom.MultiPoint>
                        </Feature>
                    </layer.Vector>

                    <interaction.Draw />
                </Map>

    Implement and test...
    <ul>
            <li>            MultiLineString </li>
                <li>        MultiPolygon</li>
                    <li>    GeometryCollection</li>
                        <li>ANimation</li>
                        <li>Overlay</li>
        </ul>


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

                <interaction.Select/>
                <interaction.DoubleClickZoom />
                <interaction.DragBox />
                <interaction.DragPan />
                <interaction.DragRotate />
                <interaction.DragRotateAndZoom />
                <interaction.DragZoom />
                <interaction.KeyboardPan />
                <interaction.KeyboardZoom />
                <interaction.MouseWheelZoom />
                <interaction.PinchRotate />
                <interaction.PinchZoom />

                No need to declare Modify explicitly.
                When you create a geometry and set modify=true on it
                then the ol-geometry will automatically set up a modify interaction
            <interaction.Modify features={selected_features}/>
                */}

            </div>
        );
    }
}

Example.propTypes = {
    title: PropTypes.string
};
