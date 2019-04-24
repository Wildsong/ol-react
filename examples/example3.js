import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ATTRIBUTION as osmAttribution } from 'ol/source/OSM'
import {
    Circle as CircleStyle,
    Fill as FillStyle,
    Icon as IconStyle,
    Stroke as StrokeStyle,
    Style,
    Text as TextStyle
} from 'ol/style'

import { transform } from 'ol/proj'
import { toStringXY } from 'ol/coordinate'
import { Converter } from 'usng/usng'
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
import { buildStyle } from '../src/style'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css';

import { wgs84, wm, astoria_ll } from '../src/utils'

const astoria_wm = transform(astoria_ll, wgs84,wm)

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
    state = {
        hasError: false,
        // Note we override draw order using zIndex, as a test
        opacityLayer1 : 20,
        opacityLayer2 : 30,
        opacityLayer3 : 20,
    }

    static propTypes = {
        title: PropTypes.string
    };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    };

    componentDidCatch(error, info) {
        console.log("We have a problem.", error, info)
    }

    changeOpacity1 = (value) => {
        this.setState({ opacityLayer1 : value });
    }

    changeOpacity2 = (value) => {
        this.setState({ opacityLayer2 : value });
    }

    changeOpacity3 = (value) => {
        this.setState({ opacityLayer3 : value });
    }

    handleDragBox = (e) => {
        console.log("You dragged a box.", e);
    }

    render() {
        // FIXME: I'd like to control how the points appear
        // at different levels and cluster them when we're
        // zoomed out and of course there is more than one type
        // of point in the file and I need to address that too.
        let geocacheIcon = require('../assets/traditional.png');
        //  currently this draws a blue 5 pointed star
        let gpxMarker = buildStyle({
            image: {
                type: 'icon',
                src: geocacheIcon,
            }
        });
        let styleCache = {};
        let clusterStyle = (feature) => {
            let size = 0;
            let style;
            try {
                size = feature.get('features').length;
            } catch {
            }
//            console.log("clusterStyle", size);
            if (size <= 1) {
                style = gpxMarker;
            } else {
                style = styleCache[size];
                if (!style) {
                    style = new Style({
                      image: new CircleStyle({
                        radius: 10,
                        stroke: new StrokeStyle({
                          color: '#fff'
                        }),
                        fill: new FillStyle({
                          color: '#3399CC'
                        })
                      }),
                      text: new TextStyle({
                        text: size.toString(),
                        fill: new FillStyle({
                          color: '#fff'
                        })
                      })
                    });
                    styleCache[size] = style;
                }
            }
            return style;
        }
        const usngConverter = new Converter;
        const coordFormatter = (coord) => {
            return usngConverter.LLtoUSNG(coord[1], coord[0], 5);
        }

        return (
            <>
                <h2>{ this.props.title }</h2>
                    Street and map tiles,
                    Stamen watercolor and toner,
                    Vector layer with clustered features

                    <SliderControl
                        onChange={ this.changeOpacity3 }
                        title="ESRI streets tiles"
                        value={ this.state.opacityLayer3 }
                    />
                    <SliderControl
                        onChange={ this.changeOpacity1 }
                        title="US Map Tiles"
                        value={ this.state.opacityLayer1 }
                    />
                    <SliderControl
                        onChange={ this.changeOpacity2 }
                        title="Stamen Watercolor"
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

            <Map view=<View
                    zoom={ 8 } center={ astoria_wm }
                    minZoom={ 8 } maxZoom={ 18 }/>
                useDefaultControls={false}>
                <layer.Tile source="XYZ"
                    url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                    attributions={ attributions }
                    opacity={ this.state.opacityLayer1/100 }
                    zIndex={ 2 }
                />
                <layer.Tile source="Stamen" layer="watercolor"
                    opacity={ this.state.opacityLayer2/100 }
                    zIndex={ 1 }
                />
                <layer.Tile source="Stamen" layer="toner"
                    opacity={ 1 }
                    zIndex={ 0 }
                />
                <layer.Tile source="ArcGISRest"
                    url="https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer"
                    attributions={ attributions }
                    opacity={ this.state.opacityLayer3/100 }
                    zIndex={ 3 }
                />

                <layer.Vector
                    cluster={ true }
                    distance={ 40 }
                    style={ clusterStyle }
                    zIndex={ 4 }
                >
                    {/* This interaction has to be inside a vector layer. */}
                    <interaction.DragAndDrop />
                </layer.Vector>

                <control.OverviewMap/>
                <control.FullScreen />
                <interaction.DragBox boxend={ this.handleDragBox }/>

                <control.MousePosition
                    projection={ wgs84 }
                    coordinateFormat={ coordFormatter }
                />
            </Map>
            </>
        );
    }
}
