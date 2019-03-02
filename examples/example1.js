import React from 'react'
import PropTypes from 'prop-types'
import { ATTRIBUTION as osmAttribution } from 'ol/source/OSM'
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
import { Map, View, Feature, control, geom, interaction, layer } from '../src'
import Select from 'react-select'
import { buildStyle } from '../src/style';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'

import { transform } from 'ol/proj'
import { wgs84, wm } from '../src/utils'

const astoria_wm = transform([-123.834,46.187], wgs84,wm)

const transformfn = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += astoria_wm[0];
        coordinates[i+1] += astoria_wm[1];
    }
    return coordinates
}

const attributions = [
    osmAttribution,
];

// This controls what kind of features we are drawing.
const typeSelect = [
    { index: 0,  label: "Point" },
    { index: 1,  label: "LineString" },
    { index: 2,  label: "Polygon" },
    { index: 3,  label: "Circle" },
];

const EventList = (props) => {
    let keyval=0; // Some weird react rule, each row needs a unique key.
    return (
        <ol>
        { props.events.slice(0).reverse().map( (listVal) => <li key={ keyval++ }>{ listVal }</li> )}
        </ol>
    );
}

export default class Example1 extends React.Component {
    static propTypes = {
        title: PropTypes.string
    };

    state = {
        enableModify: true, // can't change this in the app yet
        opacityOSM : 98,
        opacityVector : 100,
        typeIndex : 0, // index into typeSelect
        events : [],
        pointer : '',
        markerId: 1,
    }

    changeOpacity1 = (value) => {
        this.setState({opacityOSM : value});
    }

    changeOpacity2 = (value) => {
        this.setState({opacityVector : value});
    }

    changeType = (o) => {
        this.setState({ typeIndex : o.index });
    }

    handleMapEvent = (e) => {
        if (this.state.events.length > 5) {
            this.state.events.shift();
        }
        this.state.events.push(e.type);
        this.setState({
            events : this.state.events,
            markerId : ++this.state.markerId,
        });
        //event.stopPropagation(); // this stops draw interaction
    }

    handlePointerMove = (e) => {
//        console.log(e.type);
        this.setState({ pointer: e.coordinate });
        //event.stopPropagation(); // this stops the other events!
    }

    handleAddFeature = (e) => {
        console.log("handleAddFeature", e, e.feature);
    }

// This version makes ALL the point markers increment at the same time.
    clickMarker = (feature, resolution) => {
        let s = buildStyle({
            text: {
                text: this.state.markerId.toString(),
                offsetY: -10,
            },
        //  currently this draws a blue 5 pointed star
            image: {
                type: 'regularShape',
                points: 5,
                radius: 5,
                radius1: 5,
                radius2: 2,
                stroke: { color: 'blue', width: 1.5 }
            }
        })
        return s;
    }

    render() {
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
                Tile source: OpenStreetMap
                <h4>Vector source</h4>
                    <ul>
                        <li> Point: small green circle near Astor Column</li>
                        <li> Circle: big circle around Astoria </li>
                        <li> LineString: yellow line near Astoria</li>
                        <li> Polygon: triangle with a triangle hole inside it</li>
                    </ul>

                There are two vector layers, one display only
                and one that can be editted.
                Interactions: DRAW into "draw" layer.
                Controls: Sliders, Full screen, Zoom (range 8...12)

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

                <p>
                    Handling map events:
                    pointermove, singleclick, changesize, moveend
                </p>

                <Map
                    view=<View zoom={ 10 } center={ astoria_wm }
                            minZoom={8} maxZoom={12} />
                    useDefaultControls={ false }

                    onPointerMove={ this.handlePointerMove }
                    onChangeSize={ this.handleMapEvent }
                    onMoveEnd={ this.handleMapEvent }
                >
                    <control.FullScreen />
                    <control.Zoom />

                    <layer.Tile source="OSM"
                        attributions={ attributions }
                        opacity={ this.state.opacityOSM/100 }
                    />

                    <layer.Vector name="Display" opacity={ this.state.opacityVector/100 } >

                        <Feature id="test-line" style={ lineStyle }>
                            <geom.LineString transform={transformfn} layout="XY">
                                { [[6000,6000], [-6000, 6000], [-6000, 6000], [-6000, -6000], [6000,-6000]] }
                            </geom.LineString>
                        </Feature>

                        <Feature id="test-circle" style={ pointStyle }>
                            <geom.Circle modify={ this.state.enableModify } >{[astoria_wm, 100]}</geom.Circle>
                        </Feature>

                        <Feature id="test-circle-zeroradius" style={ polyStyle }>
                            <geom.Circle transform={ transformfn } >{[6000,0]}</geom.Circle>
                        </Feature>

                        <Feature id="test-polygon" style={ polyStyle }>
                            <geom.Polygon transform={ transformfn }>
                                {[
                                    [[-3500, -2000], [3500, -2000], [0, 4000], [-3500, -2000]],
                                    [[0, -1000], [1000, 1000], [-1000, 1000], [0, -1000]],
                                ]}
                            </geom.Polygon>
                        </Feature>

                        <Feature id="test-point" style={ pointStyle }>
                            <geom.Point transform={ transformfn } >
                                {[1835, -910]}
                            </geom.Point>
                        </Feature>

                        <Feature id="test-multipoint" style={ multipointStyle }>
                            <geom.MultiPoint transform={ transformfn } >
                                { [[-6000, -4000], [6000, -3000], [0, 6400]] }
                            </geom.MultiPoint>
                        </Feature>
                    </layer.Vector>

                    <layer.Vector name="Draw" style={ this.clickMarker }
                        addfeature={ this.handleAddFeature }>
                        <interaction.Draw type={ typeSelect[this.state.typeIndex].label }
                            drawend={ this.handleAddFeature }
                        />
                    </layer.Vector>
                </Map>

                <EventList events={ this.state.events }/>
                <p> { this.state.pointer[0] + ', ' + this.state.pointer[1] } </p>
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
