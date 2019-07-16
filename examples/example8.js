import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Map, Feature, Overlay, control, geom, layer, source} from '../src'
import {Fill, Icon, Stroke, Style, Text} from 'ol/style'
import {toStringHDMS} from 'ol/coordinate'
import {Collection} from 'ol'
import {Converter} from 'usng.js'
import {interaction} from '../src'
import {OverviewMap} from '../src/control'
import OpacitySlider from '../src/control/opacity-slider'
import {Button} from 'reactstrap'
import {myGeoServer, astoria_wm, usngPrecision, wgs84} from '../src/constants'
import {MapProvider} from '../src/map-context'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {DEFAULT_CENTER, MINZOOM} from '../src/constants'
import {defaultMapLayers as mapLayers} from '../src/map-layers'
import {defaultOverviewLayers as ovLayers} from '../src/map-layers'
import {defaultControls as olControls, defaultInteractions as olInteractions} from '../src/map-widgets'
import {Tile as olTileLayer} from 'ol/layer'
import {Vector as olVectorLayer} from 'ol/layer'
import {OSM, Stamen} from 'ol/source'

// These controls will show up on the map.
import {FullScreen as olFullScreen} from 'ol/control'
import olSearchNominatim from 'ol-ext/control/SearchNominatim'

// A new instance of 'map' loads each time we come to this page.
// If I want to persist any state in the map it has to be done
// outside the component, either in redux or in some parent component.
// I wonder if I should persist the entire olMap or just its properties.
const theMap = new olMap({
    view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
    controls: olControls, interactions: olInteractions,
    loadTilesWhileAnimating:true,loadTilesWhileInteracting:true,
//    layers: mapLayers
})


const usngConverter = new Converter

const taxlotslayer = 'clatsop%3Ataxlots'
const taxlotsUrl = myGeoServer + '/gwc/service/tms/1.0.0/'
        + taxlotslayer
        + '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'

const Example8 = (props) => {
    const [popupPosition, setPopupPosition] = useState([0,0]);
    const [popupText, setPopupText] = useState("here");
    const [osmOpacity, setOpacity] = useState(.50);
    const [slidoVisible, setSlido] = useState(true);

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

    return (
        <>
        <h2>Example 8</h2>
            <p>TODO Selection is mostly working, I need to change the taxlot polygon
            style to fill so that clicking in the taxlot works. But I am
            not sure if we are ever going to use Vector Tiles so... later...</p>

            <h4>Vector tiles</h4>
                <ul>
                <li> Overlay (popups) </li>
                <li> Taxlots GeoServer vector tiles </li>
                <li> DOGAMI SLIDO MapServer </li>
                <li> DOGAMI Oregon Canopy HS ImageServer </li>
                <li> Tile source: OSM </li>
                </ul>

            <OpacitySlider title="Streets" onChange={(value)=>setOpacity(value)} value={osmOpacity}/>
            <Button onClick={() => {setSlido(!slidoVisible)}}>Toggle SLIDO</Button>

            <MapProvider map={theMap}>
            <Map zoom={15} center={astoria_wm} minZoom={8} maxZoom={18} onClick={handleMapClick}>
                <layer.Image>
                <source.ImageArcGISRest url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/BareEarthHS/ImageServer"/>
                </layer.Image>
                <layer.Tile opacity={osmOpacity}> <source.OSM/> </layer.Tile>
                <layer.Image visible={slidoVisible}>
                    <source.ImageArcGISRest url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/SLIDO3_4/MapServer"/>
                </layer.Image>
                <layer.VectorTile crossOrigin="anonymous">
                    <source.MVT url={taxlotsUrl}/>
                </layer.VectorTile>
                {/*
                <Overlay id="popups"
                    element={ popupElement }
                    position={ popupPosition }
                    positioning="center-center"
                />
                */}
                <control.MousePosition coordinateFormat={usngCoordFormatter}/>
            </Map>
            <OverviewMap layers={ovLayers}/>
            </MapProvider>
        </>
    );
}
export default Example8;
