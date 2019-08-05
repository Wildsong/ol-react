import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapProvider} from '../src/map-context'
import {Map, Feature, Overlay, control, geom, layer, source} from '../src'
import {Style, Fill, Icon, Stroke, Text} from 'ol/style'
import {toStringHDMS} from 'ol/coordinate'
import {Collection} from 'ol'
import {Converter} from 'usng.js'
import {interaction} from '../src'
import {OverviewMap} from '../src/control'
import {Button} from 'reactstrap'

// abandoning hope of this test of WMTS
//import {getWidth, getTopLeft} from 'ol/extent'
//import {get as getProjection} from 'ol/proj.js'
//import WMTSTileGrid from 'ol/tilegrid/WMTS'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {defaultOverviewLayers as ovLayers} from '../src/map-layers'

import {myGeoServer, astoria_wm, astoria_ll, MINZOOM} from './constants'
import {usngPrecision, wgs84, wm} from '../src/constants'
const DEFAULT_CENTER = astoria_ll;
const DEFAULT_ZOOM = 12;

const usngConverter = new Converter

import {createMapboxStreetsV6Style} from '../src/mapbox-streets-v6-style'
const mapbox_key = process.env.MAPBOX_KEY;
const mapboxStreetsUrl = 'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/'
        + '{z}/{x}/{y}.vector.pbf?access_token=' + mapbox_key
const mapboxStyle = createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text);

const taxlotslayer = 'clatsop_wm:taxlots'
const taxlotsUrl = myGeoServer + '/gwc/service/tms/1.0.0/'
        + taxlotslayer
        + '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'
const taxlotVectorStyle = new Style({
    fill: new Fill({color:"rgba(255,0,0,0.1)"}),
    stroke: new Stroke({color:"rgba(0,0,0,1.0)", width:1}),
})

//const taxlotsWMTSUrl = myGeoServer + '/gwc/service/wmts/'
//const taxlotsFormat = "image/png"

const Example8 = (props) => {
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({center: fromLonLat(DEFAULT_CENTER), zoom: DEFAULT_ZOOM}),
    }));
    const [popupPosition, setPopupPosition] = useState([0,0]);
    const [popupText, setPopupText] = useState("here");
    const popupElement = React.createElement('div', {className:"ol-popup"}, popupText);

    const [slidoVisible, setSlido] = useState(true);

    const usngCoordFormatter = (coord, zoom=6) => {
        const ll = toLonLat(coord)
        return usngConverter.LLtoUSNG(ll[1], ll[0], usngPrecision[zoom]);
    };

    const handleMapClick = (mapEvent) => {
        console.log("mapEvent=", mapEvent);
        const lonlat = toLonLat(mapEvent.coordinate)
        const zoom = mapEvent.map.getView().getZoom();
        setPopupPosition(mapEvent.coordinate)
        setPopupText(usngCoordFormatter(lonlat, zoom));
    }

/* WMTS failure
    const projection = getProjection(wm);
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent) / 256;
    const resolutions = new Array(14);
    const matrixIds = new Array(14);
    for (var z = 0; z < 14; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = z;
    }
    const tileGrid = new WMTSTileGrid({origin: getTopLeft(projectionExtent), resolutions, matrixIds});
*/

    return (
        <>
        <MapProvider map={theMap}>
            <h2>Example 8</h2>
            <h4>Vector tiles</h4>
                <ul>
                    <li> Overlay (popups) </li>
                    <li> Taxlots GeoServer WMTS </li>
                    <li> DOGAMI SLIDO MapServer </li>
                    <li> DOGAMI Oregon Canopy HS ImageServer </li>
                    <li> Tile source: OSM </li>
                </ul>
                <p>
                <control.MousePosition coordinateFormat={usngCoordFormatter}/>
                </p>
            <Button onClick={() => {setSlido(!slidoVisible)}}>Toggle SLIDO</Button>
            <Map zoom={15} center={astoria_wm} minZoom={8} maxZoom={18} onClick={handleMapClick}>
                <layer.Image title="Bare Earth HS" opacity={.60}
                    displayInLayerSwitcher={false}>
                    <source.ImageArcGISRest url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/BareEarthHS/ImageServer"/>
                </layer.Image>

                <layer.Tile title="OpenStreetMap" baseLayer={true}>
                    <source.OSM/>
                </layer.Tile>
                <layer.VectorTile title="Mapbox Streets" declutter={true} baseLayer={true} style={mapboxStyle} visible={false}>
                    <source.VectorTile url={mapboxStreetsUrl}/>
                </layer.VectorTile>

                <layer.Image title="DOGAMI Slides" opacity={.90} visible={slidoVisible}>
                    <source.ImageArcGISRest url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/SLIDO3_4/MapServer"/>
                </layer.Image>
                <layer.VectorTile title="Taxlots vector tiles" declutter={true} style={taxlotVectorStyle}
                    allwaysOnTop={true}>
                    <source.VectorTile url={taxlotsUrl}/>
                </layer.VectorTile>
                {/*
                    <layer.Tile title="Taxlots">
                        <source.WMTS url={taxlotsWMTSUrl}
                            format={taxlotsFormat}
                    layer="clatsop_wm:taxlots"
                    tileGrid={tileGrid}
                    matrixSet={"EPSG:90013"}
                    />
                    </layer.Tile>
                    */}
                <Overlay id="popups" position={popupPosition} positioning="center-center" element={popupElement} offset={[0,0]}/>
                <OverviewMap layers={ovLayers}/>
                <control.LayerSwitcher show_progress={true} />
            </Map>
        </MapProvider>
        </>
    );
}
export default Example8;
