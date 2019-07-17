import React, {useState, useEffect} from 'react'
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
import {myGeoServer, astoria_wm, usngPrecision, wgs84, wm} from '../src/constants'
import {MapProvider} from '../src/map-context'

// abandoning hope of this test of WMTS
//import {getWidth, getTopLeft} from 'ol/extent'
//import {get as getProjection} from 'ol/proj.js'
//import WMTSTileGrid from 'ol/tilegrid/WMTS'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {DEFAULT_CENTER, MINZOOM} from '../src/constants'
import {defaultOverviewLayers as ovLayers} from '../src/map-layers'
import {defaultControls as olControls, defaultInteractions as olInteractions} from '../src/map-widgets'
import {Tile as olTileLayer} from 'ol/layer'
import {Vector as olVectorLayer} from 'ol/layer'

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

const key = process.env.MAPBOX_KEY;
const mapboxStreetsUrl = 'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/' +
'{z}/{x}/{y}.vector.pbf?access_token=' + key

const taxlotslayer = 'clatsop_wm:taxlots'
const taxlotsUrl = myGeoServer + '/gwc/service/tms/1.0.0/'
        + taxlotslayer
        + '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'

//const taxlotsWMTSUrl = myGeoServer + '/gwc/service/wmts/'
//const taxlotsFormat = "image/png"

const Example8 = (props) => {
    const [popupPosition, setPopupPosition] = useState([0,0]);
    const [popupText, setPopupText] = useState("here");
    const [osmOpacity, setOpacity] = useState(.90);
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

    // Call this AFTER the render
    useEffect(() => {
        console.log("OSM opacity changed", osmOpacity);
    }, [osmOpacity]);

    return (
        <>
        <h2>Example 8</h2>
            <p>TODO Selection is mostly working, I need to change the taxlot polygon
            style to fill so that clicking in the taxlot works. But I am
            not sure if we are ever going to use Vector Tiles so... later...</p>

            <h4>Vector tiles</h4>
                <ul>
                <li> Overlay (popups) </li>
                <li> Taxlots GeoServer WMTS </li>
                <li> DOGAMI SLIDO MapServer </li>
                <li> DOGAMI Oregon Canopy HS ImageServer </li>
                <li> Tile source: OSM </li>
                </ul>

            <OpacitySlider title="Streets" onChange={(value)=>setOpacity(value)} value={osmOpacity}/>
            <Button onClick={() => {setSlido(!slidoVisible)}}>Toggle SLIDO</Button>

            <MapProvider map={theMap}>
            <Map zoom={15} center={astoria_wm} minZoom={8} maxZoom={18} onClick={handleMapClick}>
                <layer.Image opacity={.20}>
                    <source.ImageArcGISRest url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/BareEarthHS/ImageServer"/>
                </layer.Image>
                <layer.VectorTile declutter={true} opacity={osmOpacity}>
                    <source.VectorTile url={mapboxStreetsUrl}/>
                </layer.VectorTile>
                <layer.Image visible={slidoVisible} opacity={.90}>
                    <source.ImageArcGISRest url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/SLIDO3_4/MapServer"/>
                </layer.Image>
                <layer.VectorTile declutter={true}>
                    <source.VectorTile url={taxlotsUrl}/>
                </layer.VectorTile>
                {/*
                    <layer.Tile opacity={osmOpacity}> <source.OSM/> </layer.Tile>
                    <layer.Tile>
                        <source.WMTS url={taxlotsWMTSUrl}
                    format={taxlotsFormat}
                    layer="clatsop_wm:taxlots"
                    tileGrid={tileGrid}
                    matrixSet={"EPSG:90013"}
                    />
                    </layer.Tile>
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
