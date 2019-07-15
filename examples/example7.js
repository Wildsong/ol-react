import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Map, Feature, Graticule, control, geom, layer} from '../src'
import stylefunction from 'ol-mapbox-style/stylefunction'
import {Fill, Icon, Stroke, Style, Text} from 'ol/style'
import {Converter} from 'usng.js'
import {myGeoServer, astoria_wm, usngPrecision, wm, wgs84} from '../src/constants'
import {MapProvider} from '../src/map-context'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {DEFAULT_CENTER, MINZOOM} from '../src/constants'
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
const mymap = new olMap({
    view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
    controls: olControls, interactions: olInteractions,
    loadTilesWhileAnimating:true,loadTilesWhileInteracting:true,
})

const usngConverter = new Converter

const mapbox_key = process.env.MAPBOX_KEY;
if (typeof mapbox_key === 'undefined') console.log("The mapbox key is undefined!");
const mapbox_url = 'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/'
                    + '{z}/{x}/{y}.vector.pbf?access_token=' + mapbox_key
const taxlotslayer = 'clatsop%3Ataxlots'
const taxlots_url = myGeoServer + '/gwc/service/tms/1.0.0/'
        + taxlotslayer
        + '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';

const Example7 = ({}) => {
    const [theMap, setTheMap] = useState(mymap);

    const handleEvent = (e) => {
        console.log("Map.handleEvent", e)
        //e.stopPropagation(); // this stops draw interaction
    }

        const coordFormatter = (coord) => {
            const zoom = 6;
            const ll = toLonLat(coord)
            return usngConverter.LLtoUSNG(ll[1], ll[0], usngPrecision[zoom]);
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
            <h2>Example7</h2>

            <p>TODO
            I am adding history and this example will eventually
            demonstate that too.
            </p>
            <p>FIXME
                This demo fails because I don't have mapbox styles
                working yet.
                </p>

                <h4>Vector tiles</h4>
                    <ul>
                    <li> Graticule </li>
                    <li> Taxlots from geoserver</li>
                    <li> Tile source: Mapbox</li>
                    </ul>

                <MapProvider map={theMap}>
                <Map zoom={ 10 } center={ astoria_wm } minZoom={8} maxZoom={18}
                    onMoveEnd={handleEvent}>
                    <Graticule
                        showLabels={ true }
                        maxLines={ 100 }
                        targetSize={ 50 }
                    />
                    {/*
                    <layer.VectorTile source="MVT"
                        url={mapbox_url}
                        style={stylefunction}
                    />
                    <layer.VectorTile source="MVT" url={taxlots_url}/>
                    <control.MousePosition projection={wgs84} coordinateFormat={coordFormatter}/>
*/}
                </Map>
                </MapProvider>
        </>
    );
}
export default Example7;
