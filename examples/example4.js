import React, { Component} from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { ATTRIBUTION as osmAttribution } from 'ol/source/OSM'
import { Style, Text as TextStyle, Fill as FillStyle, Stroke as StrokeStyle } from 'ol/style'
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
import { Map, View, Feature, control, geom, interaction, layer } from '../src';

import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css';

import { wgs84, wm } from '../src/utils'
const defaultCenter_wm = transform([-123.961,45.86], wgs84,wm);
const defaultZoom = 16;

const bingmaps_key = process.env.BINGMAPS_KEY;
if (typeof bingmaps_key === 'undefined') console.log("BINGMAPS_KEY is undefined")

const taxmapAnnoFeatureServer = "http://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/taxmap_annomask/FeatureServer/"
const taxlotFeatureServer = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/Taxlots_3857/FeatureServer/"

let transformfn = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += defaultCenter_wm[0];
        coordinates[i+1] += defaultCenter_wm[1];
    }
    return coordinates
}

let attributions = [
    osmAttribution,
    'and ESRI, and maybe even Microsoft!'
];

let n = 0

const getTextStyle = (feature, resolution) => {
    var baseline = 'middle';
    var placement = 'line'; // point | line
    var overflow = true;
    let attributes = feature.getProperties();

    //const font = weight + ' ' + size + ' ' + 20;

    let font, fillColor, outlineColor, outlineWidth;
    const lut = {
        41: { // Subdivision
            font: 'arial',
            fillColor: 'rgb(221,171,23, 1)',
            outlineColor: 'rgba(0,0,0, 0.60)',
            outlineWidth: 2,
        },
        45: { // Section#
            font: 'arial',
            fillColor: 'rgb(221,171,23, 1)',
            outlineColor: 'rgba(0,0,0, 0.60)',
            outlineWidth: 2,
        }
    }
    try {
        const f = lut[attributes.SYMBOL]
        font         = f.font
        fillColor    = f.fillColor
        outlineColor = f.outlineColor
        outlineWidth = f.outlineWidth
    } catch {
        console.log("default", attributes.SYMBOL)
        // Default is black text with a translucent white halo
        font         = 'arial'
        fillColor    = 'rgba(0,0,0, 1)';
        outlineColor = 'rgba(255,255,255, 0.60)';
        outlineWidth = 2;
    }
    let fontsize = (attributes.FontSize>0 ? attributes.FontSize.toString() : '16') + 'px';
    font = (attributes.Bold? "bold ":' ') + (attributes.Italic? "italic ":' ') + fontsize + ' ' + font
    console.log(attributes, font)
    const s = new TextStyle({
        scale: 2,
        font: font,
        overflow: overflow,
        placement: placement,
        textBaseline: baseline,
        text: attributes.TextString,
        fill: new FillStyle({color: fillColor}),
        stroke: new StrokeStyle({color: outlineColor, width: outlineWidth}),
    })
    n += 1;
    return new Style({ text:s });
};

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
        let feat = undefined
        let res = 9000
        let dom = undefined
        let fontStyle = getTextStyle;

        return (
            <>
                <h2>{this.props.title}</h2>
                    <ul>
                    <li>anno: ArcGIS ESRIjson featureserver using XYZ</li>
                    <li>taxlots: ArcGIS ESRIjson featureserver using XYZ</li>
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

                <Map view=<View projection={wm} zoom={defaultZoom} center={defaultCenter_wm}/> useDefaultControls={false}>

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

                    <layer.Vector name="Taxmap annotation"
                        declutter={ true }
                        source="esrijson"
                        url={ taxmapAnnoFeatureServer }
                        style={ fontStyle }
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

                </Map>
            </>
        );
    }
}
