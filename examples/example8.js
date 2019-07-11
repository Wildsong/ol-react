import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Map, Feature, Overlay, control, geom, layer} from '../src'
import {Fill, Icon, Stroke, Style, Text} from 'ol/style'
import {fromLonLat, toLonLat} from 'ol/proj'
import {toStringHDMS} from 'ol/coordinate'
import {Collection} from 'ol'
import {Converter} from 'usng.js'
import {interaction} from '../src'
import {OverviewMap} from '../src/control'
import SliderControl from './slider-control'
import {Button} from 'reactstrap'
import {myGeoServer, astoria_wm, usngPrecision, wgs84} from '../src/constants'

import { Tile as TileLayer } from 'ol/layer'
import { OSM, Stamen } from 'ol/source'
import { DEFAULT_CENTER,MINZOOM } from '../src/constants'

const usngConverter = new Converter

const taxlotslayer = 'clatsop_wm%3Ataxlots'
const taxlotsUrl = myGeoServer + '/gwc/service/tms/1.0.0/'
        + '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';
        + taxlotslayer

const Example8 = () => {
    const popupElement = React.createElement('div', { className:"ol-popup" }, popupText );
    const selectedFeatures = new Collection();
    const usngCoordFormatter = (coord, zoom=6) => {
        const ll = toLonLat(coord)
        return usngConverter.LLtoUSNG(ll[1], ll[0], usngPrecision[zoom]);
    };

    const handleMapClick = (e) => {
        const lonlat = toLonLat(e.coordinate)
        const zoom = e.map.getView().getZoom();
        setPopupPosition(e.coordinate)
        setPopupText(usngCoordFormatter(lonlat, zoom));
    }

    const pointStyle = {
        image: {
            type: 'circle',
            radius: 4,
            fill: { color: [100,100,100, 0.5] },
            stroke: { color: 'green', width: 1 }
        }
    };
    const multipointStyle = {
        image: {
            type: 'circle',
            radius: 4,
            fill: { color: [0,0,255, 0.4] },
            stroke: { color: 'red', width: 1 }
        }
    };
    const lineStyle = {
        stroke: {
            color: [255, 255, 0, 1],
            width: 3
        }
    };
    const polyStyle = {
        stroke: {color: [0, 0, 0, 1], width:4},
        fill: {color: [255, 0, 0, .250]},
    };

    const [popupPosition, setPopupPosition ] = useState([0,0]);
    const [popupText, setPopupText ] = useState("here");
    const [osmOpacity, setOpacity ] = useState(50);
    const [slidoVisible, setSlido ] = useState(true);

    return (
        <>
        <h2>Example 8</h2>
            <p>TODO Selection is mostly working, I need to change the taxlot polygon
            style to fill so that clicking in the taxlot works. But I am
            not sure if we're ever going to use Vector Tiles so... later...</p>

            <h4>Vector tiles</h4>
                <ul>
                <li> Overlay (popups) </li>
                <li> Taxlots GeoServer vector tiles </li>
                <li> DOGAMI SLIDO MapServer </li>
                <li> DOGAMI Oregon Canopy HS ImageServer </li>
                <li> Tile source: OSM </li>
                </ul>

            <SliderControl title="Streets" onChange={(value)=>setOpacity(value)} value={osmOpacity}/>
            <Button onClick={() => {setSlido(!slidoVisible)}}>Toggle SLIDO</Button>

            <Map zoom={15} center={astoria_wm} minZoom={8} maxZoom={18} onClick={handleMapClick}>
                <layer.Image source="ArcGISRest" url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/BareEarthHS/ImageServer"/>
                <layer.Tile source="OSM" opacity={ osmOpacity / 100 }/>
                <layer.Image source="ArcGISRest" visible={ slidoVisible }
                    url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/SLIDO3_4/MapServer"/>
                <layer.VectorTile source="MVT" url={ taxlotsUrl } />
                <Overlay id="popups"
                    element={ popupElement }
                    position={ popupPosition }
                    positioning="center-center"
                />
                <control.MousePosition coordinateFormat={usngCoordFormatter}/>
            </Map>

            <control.OverviewMap/>
        </>
    );
}
export default Example8;
