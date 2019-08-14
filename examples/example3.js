import React, {useState} from 'react';  // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars
import {ATTRIBUTION as osmAttribution} from 'ol/source/OSM'
import {Style, Circle, Fill, Icon, Stroke, Text} from 'ol/style'
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

let attributions = [
    osmAttribution,
    'and ESRI too.'
];

const esriClarityUrl = 'https://clarity.maptiles.arcgis.com/arcgis/rest/services/' +
                    'World_Imagery/MapServer/tile/{z}/{y}/{x}'
const esriWorldStreetsUrl = "https://services.arcgisonline.com/ArcGIS/rest/services/" +
                    "World_Street_Map/MapServer/tile/{z}/{y}/{x}"
const esriUSStatesUrl = "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/" +
                    "Specialty/ESRI_StateCityHighway_USA/MapServer"

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

    // FIXME: I'd like to control how the points appear
    // at different levels and cluster them when we're
    // zoomed out and of course there is more than one type
    // of point in the file and I need to address that too.
    let geocacheIcon = require('../assets/traditional.png');
    let gpxMarker = new Style({ image: new Icon({src: geocacheIcon}) });
    let styleCache = {};
    let clusterStyle = (feature) => {
        let style;
        const size = feature === undefined? 0 : feature.get('features').length;
//            console.log("clusterStyle", size);
        if (size <= 1) {
            style = gpxMarker;
        } else {
            style = styleCache[size];
            if (!style) {
                style = new Style({
                  image: new Circle({
                    radius: 10,
                    stroke: new Stroke({color: '#fff'}),
                    fill: new Fill({color: '#3399CC'})
                  }),
                  text: new Text({text: size.toString(),
                    fill: new Fill({color: '#fff'})
                  })
                });
                styleCache[size] = style;
            }
        }
        return style;
    }
    const usngConverter = new Converter;
    const coordFormatter = (coord) => {
        return usngConverter.LLtoUSNG(coord[1], coord[0], 5);
    }

    // This is just here to test passing a feature collection down to the Vector source,
    // if you don't explicitly create one, it will be done for you.
    const features = new Collection()

    return (
        <>
        <MapProvider map={theMap}>
            <h2>Example 3</h2>
                Street and map tiles,
                Stamen watercolor and toner,
                Vector layer with clustered features

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

                Controls tested here:
                    FullScreen
                    OverviewMap
                    ScaleLine
                    LayerSwitcher
                    MousePosition
                    <br />
                Interactions tested here:
                    DragAndDrop (drop a GPX or KML file onto the map)
                    <br />
                Using zIndex to control order of layers.

            <Map>
                <layer.Tile title="Stamen Toner" baseLayer={true} visible={false} permalink="Toner">
                    <source.Stamen layer="toner"/>
                </layer.Tile>

                <layer.Tile title="ESRI Clarity" baseLayer={true} permalink="Aerial">
                    <source.XYZ url={esriClarityUrl}/>
                </layer.Tile>

                <layer.Tile title="ESRI Streets" opacity={opacityLayer1} attributions={attributions} permalink="Streets">
                    <source.XYZ url={esriWorldStreetsUrl}/>
                </layer.Tile>

                <layer.Tile title="Stamen Watercolor" opacity={opacityLayer2} visible={false} permalink="Watercolor">
                    <source.Stamen layer="watercolor"/>
                </layer.Tile>

                <layer.Image title="ESRI US States" opacity={opacityLayer3} visible={false} permalink="States">
                    <source.ImageArcGISRest url={esriUSStatesUrl}/>
                </layer.Image>

                <layer.Vector title="GPX Drag and drop"
                  cluster={true} distance={40} style={clusterStyle}>
                    <source.Vector features={features}>
                    <interaction.DragAndDrop />
                    </source.Vector>
                </layer.Vector>

                <control.FullScreen/>
                <control.OverviewMap layers={ovLayers}/>
                <control.Permalink urlReplace={true} onclick={onPermalink}/>
            </Map>
            <control.LayerSwitcher show_progress={true} collapsed={false} collapsible={false}/>
            <control.MousePosition  projection={wgs84} coordinateFormat={coordFormatter} />
        </MapProvider>
        </>
    );
}
export default Example3;
