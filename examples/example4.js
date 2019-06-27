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
import { Map, View, Feature, control, geom, interaction, layer } from '../src';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css';
import { astoria_wm, wgs84, wm } from '../src/constants'
const defaultCenter_wm = astoria_wm;
const defaultZoom = 10;

const bingmaps_key = process.env.BINGMAPS_KEY;
if (typeof bingmaps_key === 'undefined') console.log("BINGMAPS_KEY is undefined")

// Supported formats: JSON, GeoJSON, PBF
const featureServer = "https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/Oregon_Zoning_2017/FeatureServer/0"
//&returnExceededLimitFeatures=false&maxRecordCountFactor=3&outSR=102100&resultType=tile
//&quantizationParameters=%7B%22mode%22%3A%22view%22%2C%22originPosition%22%3A%22upperLeft%22%2C%22tolerance%22%3A1222.992452562501%2C%22extent%22%3A%7B%22xmin%22%3A-14401959.121378995%2C%22ymin%22%3A5635549.22141099%2C%22xmax%22%3A-13775786.985666994%2C%22ymax%22%3A6261721.35712299%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D%7D"
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
        opacityBing: 50,
    }

    static propTypes = {
        title: PropTypes.string
    };

    toggleLayer = () => {
        this.setState({
            bingVisible : !this.state.bingVisible,
        });
    }

    render(props) {
        let polyStyle = {
            stroke: {color: [0, 255, 0, 1], width:2},
            //fill: {color: [255, 0, 0, .250]},
        };
        let polylineStyle = {
            stroke: {color: [0, 0, 0, 1], width:44},
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
                    <li> Zoning: ArcGIS FeatureServer JSON format </li>
                    <li> BingMaps aerial </li>
                    <li> BingMaps CanvasLight (roads) </li>
                    </ul>

                    <Button onClick={this.toggleLayer}>Toggle Bing aerial</Button>

                    <p>
                        Controls: ScaleLine <br />
                        Interactions:<br />
                        KeyboardPan (does not work yet! or I don't know the keys)<br />
                        DoubleClickZoom (works more or less)<br />
                    </p>

                <Map view=<View projection={wm}
                    minZoom={ 10 } maxZoom={ 20 }
                    zoom={ defaultZoom }
                    center={defaultCenter_wm}/> useDefaultControls={false}>

                    <layer.Tile name="Bing Road"
                        source="BingMaps" imagerySet="CanvasLight"
                        apikey={ bingmaps_key }
                    />

                    <layer.Tile name="Bing Aerial"
                        source="BingMaps" imagerySet="Aerial"
                        visible={ this.state.bingVisible }
                        apikey={ bingmaps_key }
                    />

                    <layer.Vector name="Oregon Zoning"
                        source="esrijson"
                        url={ featureServer }
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

                </Map>
            </>
        );
    }
}
