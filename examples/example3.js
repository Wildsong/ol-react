import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {MapProvider} from '../src/map-context'
import {ATTRIBUTION as osmAttribution} from 'ol/source/OSM'
import {toStringXY} from 'ol/coordinate'
import {Style, Circle, Fill, Icon, Stroke, Text} from 'ol/style'
import {Converter} from 'usng.js'
// Bootstrap (reactstrap in this case)
import {Button} from 'reactstrap'
import OpacitySlider from '../src/control/opacity-slider'
import {Map, Feature, control, geom, interaction, layer, source} from '../src'
import {astoria_wm, wgs84} from '../src/constants'
import 'bootstrap/dist/css/bootstrap.min.css'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {astoria_ll, MINZOOM} from '../src/constants'
const DEFAULT_CENTER = astoria_ll;

import olSearchNominatim from 'ol-ext/control/SearchNominatim'
import {Collection} from 'ol'

let transformfn = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += astoria_wm[0];
        coordinates[i+1] += astoria_wm[1];
    }
    return coordinates
}

let attributions = [
    osmAttribution,
    'and ESRI too.'
];

const Example3 = () => {
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
        //controls: [],
    }));
    const [center, setCenter] = useState(astoria_wm);
    const [zoom, setZoom] = useState(10);

    const [hasError, setHasError] = useState(false);
    const [opacityLayer1, setOpacityLayer1] = useState(.20);
    const [opacityLayer2, setOpacityLayer2] = useState(.20);
    const [opacityLayer3, setOpacityLayer3] = useState(1.0);

    const changeOpacity1 = (value) => {
        setOpacityLayer1(value);
    }

    const changeOpacity2 = (value) => {
        setOpacityLayer2(value);
    }

    const changeOpacity3 = (value) => {
        setOpacityLayer3(value);
    }

    const handleDragBox = (e) => {
        console.log("You dragged a box.", e);
    }

        // FIXME: I'd like to control how the points appear
        // at different levels and cluster them when we're
        // zoomed out and of course there is more than one type
        // of point in the file and I need to address that too.
        let geocacheIcon = require('../assets/traditional.png');
        //  currently this draws a blue 5 pointed star
        let gpxMarker = new Style({ image: new Icon({src: geocacheIcon}) });
        let styleCache = {};
        let clusterStyle = (feature) => {
            let size = 0;
            let style;
            try {
                size = feature.get('features').length;
            } catch {
            }
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
                <h2>Example 3</h2>
                    Street and map tiles,
                    Stamen watercolor and toner,
                    Vector layer with clustered features

                    <OpacitySlider
                        onChange={ changeOpacity3 }
                        title="ESRI streets tiles"
                        value={ opacityLayer3 }
                    />
                    <OpacitySlider
                        onChange={ changeOpacity1 }
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
                        <br />
                    Interactions tested here:
                        DragBox,
                        DragAndDrop (drop a GPX or KML file onto the map)
                        <br />
                    Using zIndex to control order of layers.

            <MapProvider map={theMap}>
                <Map zoom={8} center={astoria_wm} minZoom={8} maxZoom={18}>
                    <layer.Tile title="Stamen Toner" opacity={1}><source.Stamen layer="toner"/></layer.Tile>

                    <layer.Tile title="ESRI Streets" opacity={opacityLayer1} attributions={attributions}>
                        <source.XYZ url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"/>
                    </layer.Tile>

                    <layer.Tile title="Stamen Watercolor" opacity={opacityLayer2}><source.Stamen layer="watercolor"/></layer.Tile>

                    <layer.Image title="ESRI US States" opacity={opacityLayer3}>
                        <source.ImageArcGISRest
                            url="https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer"
                        />
                    </layer.Image>

                    <layer.Vector title="GPX Drag and drop"
                    cluster={true} distance={40} style={clusterStyle}>
                        <source.Vector features={features}>
                        <interaction.DragAndDrop />
                        </source.Vector>
                    </layer.Vector>

                    {/* This interaction has to be inside a vector layer. */}
                    <interaction.DragBox onBoxEnd={handleDragBox}/>

                    <control.FullScreen/>
                    <control.MousePosition  projection={wgs84} coordinateFormat={coordFormatter} />
                </Map>
                <control.OverviewMap/>
            </MapProvider>
            </>
        );
}
export default Example3;
