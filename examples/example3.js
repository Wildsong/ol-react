import React, {useState} from 'react';  // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars
import {Style, Fill, Icon, Stroke} from 'ol/style'
import {Converter} from 'usng.js'
// Bootstrap (reactstrap in this case)
import {Button} from 'reactstrap' // eslint-disable-line no-unused-vars
import OpacitySlider from '../src/control/opacity-slider' // eslint-disable-line no-unused-vars
import {Map, Feature, control, geom, interaction, layer, source} from '../src' // eslint-disable-line no-unused-vars
import 'bootstrap/dist/css/bootstrap.min.css'

import {Map as olMap, View as olView} from 'ol'
import {fromLonLat} from 'ol/proj'
import {defaultOverviewLayers as ovLayers} from '../src/map-layers'

import {astoria_ll, MINZOOM} from './constants'
import {wgs84} from '../src/constants'
const DEFAULT_CENTER = astoria_ll;

import Collection from 'ol/Collection'

const geocacheIcon = require('../assets/traditional.png'); // eslint-disable-line no-undef

const esriClarityUrl = 'https://clarity.maptiles.arcgis.com/arcgis/rest/services/' +
                    'World_Imagery/MapServer/tile/{z}/{y}/{x}'

const esriWorldStreetsUrl = "https://services.arcgisonline.com/ArcGIS/rest/services/" +
                    "World_Street_Map/MapServer/tile/{z}/{y}/{x}"

const esriUSStatesUrl = "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/" +
                    "Specialty/ESRI_StateCityHighway_USA/MapServer"

const ccgisBasemap = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/" +
                    "Clatsop_County_basemap/MapServer/tile/{z}/{y}/{x}"

const Example3 = () => {
    const [theMap] = useState(new olMap({
        view: new olView({
            center: fromLonLat(DEFAULT_CENTER),
            zoom: MINZOOM,
            minZoom: 8,
            maxZoom: 18,
        }),
        //controls: [],
    }));

    const [opacityLayer1, setOpacityLayer1] = useState(.20);
    const changeOpacity1 = (value) => { setOpacityLayer1(value); }

    const [opacityLayer2, setOpacityLayer2] = useState(.20);
    const changeOpacity2 = (value) => { setOpacityLayer2(value); }

    const [opacityLayer3, setOpacityLayer3] = useState(1.0);
    const changeOpacity3 = (value) => { setOpacityLayer3(value); }

    const onPermalink = (e) => {
        console.log('permalinked', e);
    }

    // TODO: I'd like to control how the points appear
    // at different levels and cluster them when we're
    // zoomed out and of course there is more than one type
    // of point in the file and I need to address that too.

    // TODO: I'd like a style that shows arrow heads on lines

    const gpxFeatures = new Collection()
    const [gpxFeatureCount, setGpxFeatureCount] = useState(0);
    const gpxStyle = new Style({
        image: new Icon({src: geocacheIcon}),
        stroke: new Stroke({color: "magenta", width: 4}),
        fill: new Fill({color: 'rgba(0,0,255, 0.8)'}),
    });
    const onAddFeature = (e) => {
        //console.log("Example3: feature added to gpx source", e);
        // TODO: implement a progress bar when the GPX file is big.
        setGpxFeatureCount(gpxFeatures.getLength())
    }

    const usngConverter = new Converter;
    const coordFormatter = (coord) => {
        return usngConverter.LLtoUSNG(coord[1], coord[0], 5);
    }

    return (
        <>
        <MapProvider map={theMap}>
            <h2>Example 3</h2>
            <ul>
            <li>Vector: gpx | json | kml drag and drop</li>
            <li>Image: ESRI US States</li>
            <li>Tile Stamen: watercolor</li>
            <li>Tile XYZ: ESRI Streets</li>
            <li>Tile XYZ: Clatsop County</li>
            <li>Tile XYZ: ESRI Clarity</li>
            <li>Tile Stamen: toner</li>
            </ul>
            Controls:
            sliders, fullscreen, scaleline, overviewmap, permalink, layerswitcher, attributions,
            MousePosition
            <br />
            Interactions: draganddrop
            <b>{gpxFeatureCount? " Features: " + gpxFeatureCount : ''}</b>
                <OpacitySlider
                    onChange={ changeOpacity1 }
                    title="ESRI streets tiles"
                    value={ opacityLayer3 }
                />
                <OpacitySlider
                    onChange={ changeOpacity3 }
                    title="US Map Tiles"
                    value={ opacityLayer1 }
                />
                <OpacitySlider
                    onChange={ changeOpacity2 }
                    title="Stamen Watercolor"
                    value={ opacityLayer2 }
                />

            <Map>
                <layer.Tile title="Stamen Toner" baseLayer={true} visible={false} permalink="Toner">
                    <source.Stamen layer="toner"/>
                </layer.Tile>

                <layer.Tile title="ESRI Clarity" baseLayer={true} visible={false} permalink="Aerial">
                    <source.XYZ url={esriClarityUrl} attributions="ESRI Clarity"/>
                </layer.Tile>

                <layer.Tile title="Clatsop County" baseLayer={true} visible={true} permalink="Clatsop">
                    <source.XYZ url={ccgisBasemap} attributions="Clatsop County" opaque={true}/>
                </layer.Tile>

                <layer.Tile title="ESRI Streets" opacity={opacityLayer1} permalink="Streets">
                    <source.XYZ url={esriWorldStreetsUrl} attributions="ESRI Streets"/>
                </layer.Tile>

                <layer.Tile title="Stamen Watercolor" opacity={opacityLayer2} visible={false} permalink="Watercolor">
                    <source.Stamen layer="watercolor"/>
                </layer.Tile>

                <layer.Image title="ESRI US States" opacity={opacityLayer3} visible={false} permalink="States">
                    <source.ImageArcGISRest url={esriUSStatesUrl} attributions="ESRI States"/>
                </layer.Image>

                <layer.Vector title="GPX Drag and drop" style={gpxStyle}>
                    <source.Vector features={gpxFeatures} addFeature={onAddFeature}>
                    <interaction.DragAndDrop fit={true}/>
                    </source.Vector>
                </layer.Vector>

                <control.FullScreen/>
                <control.ScaleLine units="us"/>
                <control.OverviewMap layers={ovLayers}/>
                <control.Permalink urlReplace={true} onclick={onPermalink}/>
                <control.LayerSwitcher show_progress={true} collapsed={false} collapsible={false}/>
                <control.Attribution tipLabel="Credits"/>
            </Map>
            <control.MousePosition  projection={wgs84} coordinateFormat={coordFormatter} />
        </MapProvider>
        </>
    );
}
export default Example3;
