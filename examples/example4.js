import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {ATTRIBUTION as osmAttribution } from 'ol/source/OSM'
import {Style, Text, Fill, Stroke} from 'ol/style'
import {Button} from 'reactstrap'
import {Map, Feature, control, geom, interaction, layer, source} from '../src';
import {astoria_ll, wgs84, wm} from '../src/constants'
import {MapProvider} from '../src/map-context'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {MINZOOM} from '../src/constants'

const DEFAULT_CENTER = astoria_ll;
const DEFAULT_ZOOM = 13;

const bingmaps_key = process.env.BINGMAPS_KEY;

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
    const s = new Text({
        scale: 2,
        font: font,
        overflow: overflow,
        placement: placement,
        textBaseline: baseline,
        text: attributes.TextString,
        fill: new Fill({color: fillColor}),
        stroke: new Stroke({color: outlineColor, width: outlineWidth}),
    })
    n += 1;
    return new Style({ text:s });
};

const Example4 = (props) => {
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({center: fromLonLat(DEFAULT_CENTER), zoom: DEFAULT_ZOOM}),
        loadTilesWhileAnimating:true, loadTilesWhileInteracting:true,
        //controls: [],
    }));
    const [bingVisible, setBingVisible] = useState(false);
    const [opacityBing, setOpacityBing] = useState(.50);

    const toggleLayer = () => {
        setBingVisible(!bingVisible);
    }
    const polyStyle = new Stroke({
        stroke: new Stroke({color: [0, 255, 0, 1], width:2}),
        //fill: new Fill({color: [255, 0, 0, .250]}),
    });
    const polylineStyle = new Stroke({
        stroke: new Stroke({color: [0, 0, 0, 1], width:44}),
        //fill: new Fill({color: [255, 0, 0, .250]}),
    });
    let feat = undefined
    let res = 9000
    let dom = undefined
    let fontStyle = getTextStyle;

    return (
        <>
            <h2>Example 4</h2>
                <b>{(typeof bingmaps_key === 'undefined')? "BINGMAPS_KEY is undefined":""}</b>
                <ul>
                <li> Zoning: ArcGIS FeatureServer JSON format </li>
                <li> BingMaps aerial </li>
                <li> BingMaps CanvasLight (roads) </li>
                </ul>

                <Button onClick={toggleLayer}>Toggle Bing aerial</Button>

                <p>
                    Controls: ScaleLine <br />
                </p>

                <MapProvider map={theMap}>
                <Map minZoom={10} maxZoom={20} zoom={DEFAULT_ZOOM} center={fromLonLat(DEFAULT_CENTER)}>
                    <layer.Tile title="Bing Road">
                        <source.BingMaps imagerySet="CanvasLight" apikey={bingmaps_key}/>
                    </layer.Tile>
                    <layer.Tile title="Bing Aerial" visible={bingVisible}>
                        <source.BingMaps imagerySet="Aerial" apikey={bingmaps_key}/>
                    </layer.Tile>
                    <layer.Vector title="Oregon Zoning">
                        <source.JSON url={featureServer} loader="esrijson" style={polyStyle}/>
                    </layer.Vector>

                    <control.ScaleLine units={control.ScaleLineUnits.US} />
                </Map>
                <control.ScaleLine units={control.ScaleLineUnits.METRIC} />
                </MapProvider>
            </>
        );
}
export default Example4;
