import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { ATTRIBUTION as osmAttribution } from 'ol/source/OSM'
import { transform } from 'ol/proj'
import { toStringXY } from 'ol/coordinate'
import usng from 'usng/usng'
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
import {Map, View, Feature, control, geom, interaction, layer} from '../src';

import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css';

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

export default class Example3 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            // Note we override draw order using zIndex, as a test
            opacityLayer1 : 50,
            opacityLayer2 : 100,
            opacityLayer3 : 50,
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.log("We have a problem.", error, info)
    }

    render(props) {
        let changeOpacity1 = (value) => {
            this.setState({ opacityLayer1 : value });
        }
        let changeOpacity2 = (value) => {
            this.setState({ opacityLayer2 : value });
        }
        let changeOpacity3 = (value) => {
            this.setState({ opacityLayer3 : value });
        }
        //  currently this draws a blue 5 pointed star
        let gpxMarker = {
            image: {
                type: 'regularShape',
                points: 5,
                radius: 5,
                radius1: 5,
                radius2: 2,
                stroke: { color: 'blue', width: 1.5 }
            }
        }
        let usngc = new usng.Converter();
        let coordFormatter = (coord) => {
            return usngc.LLtoUSNG(coord[1], coord[0], 5);
        }
        return (
            <Fragment>
                <h2>{ this.props.title }</h2>
                    A mix of tile and image layers

                    <SliderControl
                        onChange={ changeOpacity3 }
                        title="ESRI streets tiles"
                        value={ this.state.opacityLayer3 }
                    />
                    <SliderControl
                        onChange={ changeOpacity1 }
                        title="US Map Tiles"
                        value={ this.state.opacityLayer1 }
                    />
                    <SliderControl
                        onChange={ changeOpacity2 }
                        title="GEBCO Bathymetry Image"
                        value={ this.state.opacityLayer2 }
                    />

                    Controls tested here:
                        FullScreen
                        OverviewMap
                        ScaleLine
                        <br />
                    Interactions tested here:
                        DragBox,
                        DragAndDrop (drop a GPX or KML file onto the map)
                        <br />
                    Using zIndex to control order of layers.

            <Map view=<View zoom={4} center={ astoria_wm }/> useDefaultControls={false}>
                <layer.Tile source="XYZ"
                    url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                    attributions={ attributions }
                    opacity={ this.state.opacityLayer1/100 }
                    zIndex={1}
                />
                <layer.Image source="WMS"
                    url="https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?"
                    params={ {LAYERS:"GEBCO_LATEST"} }
                    opacity={ this.state.opacityLayer2/100 }
                    zIndex={0}
                />
                <layer.Tile source="ArcGISRest"
                    url="https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer"
                    attributions={ attributions }
                    opacity={ this.state.opacityLayer3/100 }
                    zIndex={2}
                />

                <layer.Vector style={ gpxMarker }>
                    {/* This interaction has to be inside a vector layer. */}
                    <interaction.DragAndDrop />
                </layer.Vector>

                <control.OverviewMap/>
                <control.FullScreen />
                <interaction.DragBox />

                {/*
                <control.Zoom />
                <control.ZoomToExtent />

                <interaction.DoubleClickZoom />
                <interaction.DragPan />
                <interaction.DragRotate />
                <interaction.DragRotateAndZoom />
                <interaction.DragZoom />
                <interaction.KeyboardZoom />
                <interaction.MouseWheelZoom />
                <interaction.PinchRotate />
                <interaction.PinchZoom />
                */}

                <control.MousePosition
                    projection={wgs84}
                    coordinateFormat={ coordFormatter }
                />
            </Map>
            </Fragment>
        );
    }
}

Example3.propTypes = {
    title: PropTypes.string
};
