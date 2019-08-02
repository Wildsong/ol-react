import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {MapProvider} from '../src/map-context'
import {Map, Feature, Graticule, control, interaction, geom, layer, source} from '../src'
import {Collection} from 'ol'
import stylefunction from 'ol-mapbox-style/stylefunction'
import {Style, Circle, Fill, Icon, Stroke, Text} from 'ol/style'
import {click, platformModifierKeyOnly} from 'ol/events/condition'
import {Converter} from 'usng.js'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {defaultOverviewLayers as ovLayers} from '../src/map-layers'

import {myGeoServer, astoria_wm, astoria_ll, MINZOOM, MAXZOOM} from './constants'
import {usngPrecision, wm, wgs84} from '../src/constants'
const DEFAULT_CENTER = astoria_ll;
const DEFAULT_ZOOM = 12;

const usngConverter = new Converter

import {createMapboxStreetsV6Style} from '../src/mapbox-streets-v6-style'
const mapbox_key = process.env.MAPBOX_KEY;
const mapboxStreetsUrl = 'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/'
        + '{z}/{x}/{y}.vector.pbf?access_token=' + mapbox_key
const mapboxStyle = createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text);

const taxlotsLayer = 'clatsop_wm%3Ataxlots'
const taxlotsUrl = myGeoServer + '/gwc/service/tms/1.0.0/'
        + taxlotsLayer
        + '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';

const Example7 = ({}) => {
    const [theMap, setTheMap] = useState(new olMap({
            view: new olView({center: fromLonLat(DEFAULT_CENTER), zoom: DEFAULT_ZOOM}),
            //interactions:[] // this map is not slippy so we can use drag select
        })
    );
    const [selectCount, setSelectCount] = useState(0);

    const coordFormatter = (coord) => {
        const zoom = 6;
        const ll = toLonLat(coord)
        return usngConverter.LLtoUSNG(ll[1], ll[0], usngPrecision[zoom]);
    }

    const handleEvent = (e) => {
        console.log("handleEvent", e)
        //e.stopPropagation(); // this stops draw interaction
    }

    const taxlotStyle = new Style({
        fill: new Fill({color:"rgba(128,0,0,0.1)"}),
        stroke: new Stroke({color:"rgba(0,0,0,1.0)", width:1}),
    })
    const selectedStyle = new Style({
        fill: new Fill({color:"rgba(255,40,40,0.8)"}),
        stroke: new Stroke({color:"rgba(255,0,0,1.0)", width:1.5}),
    })
    const selectedFeatures = new Collection();
    const onSelectEvent = (e) => {
        console.log("selectEvent", e, selectedFeatures)
        setSelectCount(selectedFeatures.getLength());
        e.stopPropagation(); // this stops draw interaction
    }

    return (
        <>
            <h2>Example7</h2>
                <b>{(typeof mapbox_key === 'undefined')? "The mapbox key is undefined!" : ""}</b>

                <h4>Vector tiles</h4>
                    <ul>
                    <li> Graticule </li>
                    <li> Taxlots from geoserver as vector tiles</li>
                    <li> Tile source: Mapbox</li>
                    </ul>
                    Interaction: Select <b>{selectCount>0?(selectCount + " selected"):""}</b> - select taxlots using click or shift drag

                <MapProvider map={theMap}>
                <Map zoom={DEFAULT_ZOOM} center={astoria_wm} minZoom={MINZOOM} maxZoom={MAXZOOM} onMoveEnd={handleEvent}>
                <control.LayerSwitcher show_progress={true}/>
                    <Graticule showLabels={true} maxLines={100} targetSize={50}/>
                    <control.MousePosition projection={wgs84} coordinateFormat={coordFormatter}/>

                    <layer.VectorTile title="Mapbox Streets" style={mapboxStyle} declutter={true}>
                        <source.VectorTile url={mapboxStreetsUrl}/>
                    </layer.VectorTile>

                    <layer.VectorTile title="Taxlots" declutter={true} crossOrigin="anonymous" style={taxlotStyle}>
                        <source.VectorTile url={taxlotsUrl}>
                            <interaction.Select features={selectedFeatures} style={selectedStyle} condition={click} selected={onSelectEvent}/>
                            <interaction.SelectDragBox condition={platformModifierKeyOnly} selected={onSelectEvent}/>
                        </source.VectorTile>
                    </layer.VectorTile>
                </Map>
                </MapProvider>
        </>
    );
}
export default Example7;
