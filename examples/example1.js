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
import {Map, View, Feature, control, geom, interaction, layer} from '../src'
import Select from 'react-select'

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

// This controls what kind of features we are drawing.
const typeSelect = [
    { index: 0,  label: "Point" },
    { index: 1,  label: "LineString" },
    { index: 2,  label: "Polygon" },
    { index: 3,  label: "Circle" },
];

class EventList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let rows = [];
//        for(let i=0; i<this.children.length; i++) {
//            rows.push(<ObjectRow key={ "hi" } />);
//        }
        return (
            <ol> <li> { this.children } </li> </ol>
        );
    }
}

export default class Example1 extends Component {
    state = {
        enableModify: true, // can't change this in the app yet
        opacityOSM : 98,
        opacityVector : 100,
        typeIndex : 0, // index into typeSelect
        events : []
    }

    changeOpacity1 = value => {
        this.setState({opacityOSM : value});
    }

    changeOpacity2 = (value) => {
        this.setState({opacityVector : value});
    }

    changeType = (o) => {
        console.log("example1.changeType from", this.state.typeIndex,
                    " to", o.index);
        this.setState({ typeIndex : o.index });
    }

    handleMapEvent = (event) => {
        console.log(event)
        this.state.events.push(
            event.type
        );
        this.setState({ events : this.state.events });
    }

    render(props) {
        let textMarker = {
            text: {
                text: 'Hee',
            }
        }
        //  currently this draws a blue 5 pointed star
        let pointMarker = {
            image: {
                type: 'regularShape',
                points: 5,
                radius: 5,
                radius1: 5,
                radius2: 2,
                stroke: { color: 'blue', width: 1.5 }
            }
        }
        let pointStyle = {
            image: {
                type: 'circle',
                radius: 4,
                fill: { color: [100,100,100, 0.5] },
                stroke: { color: 'green', width: 1 }
            }
        };
        let multipointStyle = {
            image: {
                type: 'circle',
                radius: 4,
                fill: { color: [0,0,255, 0.4] },
                stroke: { color: 'red', width: 1 }
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
            <>
                <h2>{ this.props.title }</h2>
                <h3>Tile source: OpenStreetMap</h3>

                <h3>Vector source</h3>
                    <ul>
                        <li> Point: small green circle near Astor Column</li>
                        <li> Circle: big circle around Astoria </li>
                        <li> LineString: yellow line near Astoria</li>
                        <li> Polygon: triangle with a triangle hole inside it</li>
                    </ul>

                Interactions: DRAW
                Controls: Sliders, Full screen, Zoom

                <SliderControl
                    onChange={ this.changeOpacity1 }
                    title="OSM"
                    value={ this.state.opacityOSM }
                />
                <SliderControl
                    onChange={ this.changeOpacity2 }
                    title="Vectors"
                    value={ this.state.opacityVector }
                />

                FIXME I can change the Vector Type now but the style does not update
                so after drawing (eg) a linestring, there is no defined line style so the line poof! disappears.
                Not high on my priorities right now.

                <Map
                    view=<View zoom={ 10 } center={ astoria_wm }/>
                    useDefaultControls={ false }
                    onMoveEnd={ this.handleMapEvent }
                >

                    <layer.Tile source="OSM"
                        attributions={ attributions }
                        opacity={ this.state.opacityOSM/100 }
                    />

                    <layer.Vector
                        style={ pointMarker }
                        opacity={ this.state.opacityVector/100 } >

                        <Feature id="test-line" style={ lineStyle }>
                            <geom.LineString transform={transformfn} modify={this.state.enableModify} layout="XY">
                                { [[6000,6000], [-6000, 6000], [-6000, 6000], [-6000, -6000], [6000,-6000]] }
                            </geom.LineString>
                        </Feature>

                        <Feature id="test-circle" style={ pointStyle }>
                            <geom.Circle modify={ this.state.enableModify } >{[astoria_wm, 100]}</geom.Circle>
                        </Feature>

                        <Feature id="test-circle-zeroradius" style={ polyStyle }>
                            <geom.Circle transform={ transformfn } modify={this.state.enableModify} >{[6000,0]}</geom.Circle>
                        </Feature>

                        <Feature id="test-polygon" style={ polyStyle }>
                            <geom.Polygon transform={ transformfn } modify={ this.state.enableModify } insertVertexCondition={ ()=>{return true;} }>
                                {[
                                    [[-3500, -2000], [3500, -2000], [0, 4000], [-3500, -2000]],
                                    [[0, -1000], [1000, 1000], [-1000, 1000], [0, -1000]],
                                ]}
                            </geom.Polygon>
                        </Feature>

                        <Feature id="test-point" style={ pointStyle }>
                            <geom.Point transform={ transformfn } modify={ this.state.enableModify } >
                                {[1835, -910]}
                            </geom.Point>
                        </Feature>

                        <Feature id="test-multipoint" style={ multipointStyle }>
                            <geom.MultiPoint transform={ transformfn } modify={ this.state.enableModify } >
                                { [[-6000, -4000], [6000, -3000], [0, 6400]] }
                            </geom.MultiPoint>
                        </Feature>

                        <interaction.Draw type={ typeSelect[this.state.typeIndex].label } />

                    </layer.Vector>

                    <control.FullScreen />
                    <control.Zoom />
                </Map>

                <EventList>{ this.state.events }</EventList>

                Select vector type to draw
                <Select
                    className="select"
                    defaultValue={ typeSelect[ 0 ] }
                    options={ typeSelect }
                    onChange={ this.changeType }
                />

                Implement and test...
                <ul>
                    <li> MultiLineString </li>
                    <li> MultiPolygon</li>
                    <li> GeometryCollection</li>
                    <li> Animation</li>
                    <li> Overlay</li>
                </ul>

                {/*
                <control.ZoomSlider />
                <control.ZoomToExtent />

                <interaction.Select/>
                <interaction.DragBox />
                <interaction.DragPan />
                <interaction.DragRotate />
                <interaction.DragRotateAndZoom />
                <interaction.DragZoom />
                <interaction.KeyboardZoom />
                <interaction.MouseWheelZoom />
                <interaction.PinchRotate />
                <interaction.PinchZoom />

                No need to declare Modify explicitly.
                When you create a geometry and set modify=true on it
                then the ol-geometry will automatically set up a modify interaction
                <interaction.Modify features={selected_features}/>
                */}

            </>
        );
    }
}

Example1.propTypes = {
    title: PropTypes.string
};
