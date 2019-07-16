import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {ATTRIBUTION as osmAttribution} from 'ol/source/OSM'
import {toStringXY} from 'ol/coordinate'
import {
    Circle as CircleStyle,
    Fill as FillStyle,
    Icon as IconStyle,
    Stroke as StrokeStyle,
    Style,
    Text as TextStyle
} from 'ol/style'
import {Converter} from 'usng.js'
// Bootstrap (reactstrap in this case)
import {Button } from 'reactstrap'
import OpacitySlider from '../src/control/opacity-slider'
import {Map, Feature, control, geom, interaction, layer, source} from '../src'
import {buildStyle} from '../src/style'
import 'bootstrap/dist/css/bootstrap.min.css'
import {astoria_wm, wgs84} from '../src/constants'
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
    const [center, setCenter] = useState(astoria_wm);
    const [zoom, setZoom] = useState(10);

    const [hasError, setHasError] = useState(false);
    const [opacityLayer1, setOpacityLayer1] = useState(.20);
    const [opacityLayer2, setOpacityLayer2] = useState(.20);
    const [opacityLayer3, setOpacityLayer3] = useState(.20);

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
        let gpxMarker = buildStyle({
            image: {
                type: 'icon',
                src: geocacheIcon,
            }
        });
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
                      image: new CircleStyle({
                        radius: 10,
                        stroke: new StrokeStyle({
                          color: '#fff'
                        }),
                        fill: new FillStyle({
                          color: '#3399CC'
                        })
                      }),
                      text: new TextStyle({
                        text: size.toString(),
                        fill: new FillStyle({
                          color: '#fff'
                        })
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
                    <layer.Tile opacity={1}><source.Stamen layer="toner"/></layer.Tile>
                    <layer.Tile opacity={opacityLayer1} attributions={attributions}>
                    <source.XYZ url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"/>
                    </layer.Tile>
                    <layer.Tile opacity={opacityLayer2}><source.Stamen layer="watercolor"/></layer.Tile>
            {/*
                    <layer.Tile>
                        attributions={ attributions }
                        opacity={ state.opacityLayer3/100 }
                        <source.ArcGISRest
                            url="https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer"
                        />
                    </layer.Tile>

                    <layer.Vector cluster={true} distance={40}
                        style={clusterStyle}>
                     This interaction has to be inside a vector layer.
                        <interaction.DragAndDrop />
                    </layer.Vector>

                    <control.OverviewMap/>

                    <interaction.DragBox boxend={handleDragBox}/>

                    <control.FullScreen />
            */}
                </Map>
                <control.MousePosition  projection={wgs84} coordinateFormat={coordFormatter} />
            </MapProvider>
            </>
        );
}
export default Example3;
