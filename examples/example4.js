import React, { Component} from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { ATTRIBUTION as osmAttribution } from 'ol/source/OSM'
import { transform } from 'ol/proj'
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

import { wgs84, wm } from '../src/utils'

const astoria_wm = transform([-123.834,46.187], wgs84,wm)

const bingmaps_key = process.env.BINGMAPS_KEY;
if (typeof bingmaps_key === 'undefined') console.log("BINGMAPS_KEY is undefined")

let transformfn = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += astoria_wm[0];
        coordinates[i+1] += astoria_wm[1];
    }
    return coordinates
}

let attributions = [
    osmAttribution,
    'and ESRI, and maybe even Microsoft!'
];

export default class Example4 extends Component {
    state = {
        bingVisible : true,
        xyzVisible: true,
        xyzOpacity: 50,
    }

    static propTypes = {
        title: PropTypes.string
    };

    toggleLayer = () => {
        this.setState({
            bingVisible : !this.state.bingVisible,
        });
    }

    changeOpacity = (value) => {
        this.setState({xyzOpacity : value});
    }

    changeOpacity2 = (value) => {
        this.setState({opacityBing : value});
    }

    render(props) {
        let polyStyle = {
            stroke: {color: [0, 0, 0, 1], width:4},
            //fill: {color: [255, 0, 0, .250]},
        };

        const taxlotFeatureServer = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/Taxlots_3857/FeatureServer/"

        return (
            <>
                <h2>{this.props.title}</h2>
                    <ul>
                        <li>ArcGIS ESRIjson featureserver using XYZ</li>
                        <li>ESRI World Streets (XYZ)</li>
                        <li>BingMaps aerial</li>
                        <li>BingMaps CanvasLight (roads)</li>
                    </ul>

                    <SliderControl
                        onChange={this.changeOpacity}
                        title="ArcGIS streets"
                        value={this.state.xyzOpacity}
                    />

                    <Button onClick={this.toggleLayer}>Toggle Aerial</Button>

                    <p>
                        Controls: ScaleLine <br />
                        Interactions:<br />
                        KeyboardPan (does not work yet! or I don't know the keys)<br />
                        DoubleClickZoom (works more or less)<br />
                    </p>

                <Map view=<View projection={wm} zoom={15} center={astoria_wm}/> useDefaultControls={false}>

                <layer.Tile name="Bing Road"
                    source="BingMaps" imagerySet="CanvasLight"
                    apikey={ bingmaps_key }
                />

                <layer.Tile name="Bing Aerial"
                    source="BingMaps" imagerySet="Aerial"
                    visible={ this.state.bingVisible }
                    apikey={ bingmaps_key }
                />

                    <layer.Tile name="ESRI World Streets"
                        source="XYZ"
                        url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                        attributions={attributions}
                        visible={this.state.xyzVisible}
                        opacity={this.state.xyzOpacity/100}
                    />

                    <layer.Vector name="Taxlots"
                        source="esrijson"
                        url={ taxlotFeatureServer }
                        style={ polyStyle }
                    />

                    <control.ScaleLine units={control.ScaleLineUnits.US} />
                    <interaction.KeyboardPan
                        condition={ () => { return true; } }
                        duration={ 750 }
                        pixelDelta={ 100 }
                    />

                    <interaction.DoubleClickZoom
                        duration={ 750 }
                        delta={ 1 }
                    />

                    {/*
                    <control.FullScreen />
                    <control.OverviewMap/>
                    <control.ScaleLine units={control.ScaleLineUnits.US} />

                    <control.Zoom />
                    <control.ZoomToExtent />

                    <interaction.DragBox />
                    <interaction.DragPan />
                    <interaction.DragRotate />
                    <interaction.DragRotateAndZoom />
                    <interaction.DragZoom />
                    <interaction.KeyboardZoom />
                    <interaction.MouseWheelZoom />
                    <interaction.PinchRotate />
                    <interaction.PinchZoom />
                    */}

                </Map>
            </>
        );
    }
}
