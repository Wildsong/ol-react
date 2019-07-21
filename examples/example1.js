import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {ATTRIBUTION as osmAttribution} from 'ol/source/OSM'
import OpacitySlider from '../src/control/opacity-slider'
import {Map, Feature, geom, control, interaction, layer, source} from '../src'
import Select from 'react-select'
import {buildStyle} from '../src/style'
import {setMapCenter} from '../src/actions'
import {MapProvider} from '../src/map-context'

import './style.css'
import './css/fontmaki.css'
import './css/fontmaki2.css'

import {myGeoServer, astoria_wm} from '../src/constants'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {MINZOOM, astoria_ll} from '../src/constants'
const DEFAULT_CENTER = astoria_ll;

import olSearchNominatim from 'ol-ext/control/SearchNominatim'

import {Collection} from 'ol'

const geoserverWMS = myGeoServer + "/wms?"
const geoserverLayers = "taxlots"

const initialGeoBookmarks = {
    "Astoria": { pos: fromLonLat([-123.836,46.182]), zoom: 13, permanent:true },
	"Cannon Beach": { pos: fromLonLat([-123.969,45.893]), zoom: 13, permanent:true },
    "Gearhart": { pos: fromLonLat([-123.9188,46.026]), zoom: 13, permanent:true },
    "Hammond": { pos: fromLonLat([-123.9520,46.2000]), zoom: 14, permanent:true },
    "Jewell": { pos: fromLonLat([-123.5032,45.9345]), zoom: 14, permanent:true },
    "Seaside": { pos: fromLonLat([-123.920,45.994]), zoom: 12, permanent:true },
    "Warrenton": { pos: fromLonLat([-123.924,46.165]), zoom: 13, permanent:true },
};

const transformfn = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += astoria_wm[0];
        coordinates[i+1] += astoria_wm[1];
    }
    return coordinates
}

// This controls what kind of features we are drawing.
const typeSelect = [
    { index: 0,  label: "Point" },
    { index: 1,  label: "LineString" },
    { index: 2,  label: "Polygon" },
    { index: 3,  label: "Circle" },
];

const EventList = (props) => {
    let keyval=0; // Some weird react rule, each row needs a unique key.
    return (
        <ol>
        { props.events.slice(0).reverse().map( (listVal) => <li key={ keyval++ }>{ listVal }</li> )}
        </ol>
    );
}

/* ============================================================================= */

const Example1 = ({setMapCenter}) => {
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
        loadTilesWhileAnimating:true, loadTilesWhileInteracting:true,
    }));
    const [center, setCenter] = useState(astoria_wm);
    const [zoom, setZoom] = useState(10);
    const [drawType, setDrawType] = useState("Point");

    const [enableModify, setModify] = useState(false); // no button yet!
    const [opacityOSM, setOpacityOSM] = useState(.80);
    const [opacityDraw, setOpacityDraw] = useState(1);
    const [typeIndex, setTypeIndex] = useState(0); // index into draw typeSelect
    const [pointer, setPointer] = useState('');
    const [markerId, setMarker] = useState(1);

    const selectDrawType = (e) => {
        console.log("draw type set to ", e);
        setDrawType(e.label);
    }

    const changeOpacityOSM = (value) => {
        setOpacityOSM(value); // this triggers a render
    }
    const changeOpacityDraw = (value) => {
        setOpacityDraw(value); // this triggers a render
        drawLayer.setOpacity(value);
    }

    const onGeocode = (e) => {
        setCenter(e.coordinate);
        setZoom(18);
        theMap.getView().setCenter(e.coordinate);
        theMap.getView().setZoom(18);
    }

    // Comes up in the wrong place, hence it needs styling.
    //  This is the search widget that comes up on the map.
    const searchWidget = new olSearchNominatim();
    searchWidget.on('select', onGeocode);
    theMap.addControl(searchWidget);

    const handleAddFeature = (e) => {
        console.log("handleAddFeature", e, e.feature);
    }

    const handleMapEvent = (mapEvent) => {
        console.log("Map event", mapEvent);
        mapEvent.stopPropagation();
    }

// This version makes ALL the point markers increment at the same time. Unfortunately
    const clickMarker = (feature, resolution) => {
        const s = buildStyle({
            text: {
                text: markerId.toString(),
                offsetY: -10,
            },
        //  currently this draws a blue 5 pointed star
            image: {
                type: 'regularShape',
                points: 5,
                radius: 5,
                radius1: 5,
                radius2: 2,
                stroke: { color: 'blue', width: 1.5 }
            }
        })
        return s;
    }

    const pointStyle = {
        image: {
            type: 'circle',
            radius: 4,
            fill: { color: [100,100,100, 0.75] },
            stroke: { color: 'green', width: 3 }
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
    const sbstyle = {
        width: 50,
        height: 50,
    }

    // This is just here to test passing a feature collection down to the Vector source,
    // if you don't explicitly create one, it will be done for you.
    const features = new Collection()

    return (
        <>
            <h1>Example 1 - Vector draw tools</h1>
            Tile source: OpenStreetMap<br />
            WMS source: taxlots from GeoServer
            <h4>Vector source</h4>
                <ul>
                    <li> Point: small green circle near Astor Column</li>
                    <li> Circle: big circle around Astoria </li>
                    <li> LineString: yellow line near Astoria</li>
                    <li> Polygon: triangle with a triangle hole inside it</li>
                </ul>

                <p>
                    There are two vector layers, one display only
                    and one that can be edited.
                    <br />
                    Interactions: DRAW into "draw" layer.
                    Controls: Sliders, Full screen, Zoom (range 8...12)
                    Ol-ext controls: Geobookmarks
                    Layer switcher (doesn't quite work)
                    Search Nominatim
                </p>

            <OpacitySlider title="OSM" onChange={changeOpacityOSM}  value={opacityOSM}/>
            <OpacitySlider title="Draw" onChange={changeOpacityDraw} value={opacityDraw}/>

            FIXME I can change the Vector Type now but the style does not update
            so after drawing (eg) a linestring, there is no defined line style so the line poof! disappears.
            Not high on my priorities right now.

            <p>
                Handling map events:
                pointermove, click, changesize, moveend
            </p>

            <MapProvider map={theMap}>
            <Map center={center} zoom={zoom} style={{position:'relative',left:50,top:0}}
                onPointerMove={ (e) => { setPointer(e.coordinate); } }
                onChangeSize={ handleMapEvent }
                onMoveEnd={ handleMapEvent }
            >
                <layer.Tile title="Toner" baseLayer={true} attributions="Stamen">
                    <source.Stamen layer="toner"/>
                </layer.Tile>

                <layer.Tile title="OpenStreetMap" attributions="OpenStreetMap" opacity={opacityOSM}>
                    <source.OSM/>
                </layer.Tile>

                <layer.Tile title="Taxlots">
                    <source.TileWMS url={geoserverWMS}
                        params={{
                            LAYERS: geoserverLayers,
                            STYLES: "redline", // WMS style, from GeoServer in this case
                            TILED: true}}
                    />
                </layer.Tile>

                <layer.Vector title="Vector Shapes" opacity={1}>
                    <source.Vector features={features}>
                        <Feature id="L1" style={lineStyle}>
                            <geom.LineString transform={transformfn}>
                                { [[6000,6000], [-6000, 6000], [-6000, 6000], [-6000, -6000], [6000,-6000]] }
                            </geom.LineString>
                        </Feature>
                        <Feature id="C2" style={polyStyle}>
                            <geom.Circle transform={ transformfn } >{[6000,0]}</geom.Circle>
                        </Feature>
                        <Feature id="C4" style={polyStyle}>
                            <geom.Circle modify={enableModify}>{[astoria_wm, 2000]}</geom.Circle>
                        </Feature>
                        <Feature id="Pt5" style={ pointStyle }>
                            <geom.Point transform={ transformfn }>{[1835, -910]}</geom.Point>
                        </Feature>
                        <Feature id="P2" style={polyStyle}>
                            <geom.Polygon transform={transformfn}>
                                {[
                                    [[-3500, -2000], [3500, -2000], [0, 4000], [-3500, -2000]],
                                    [[0, -1000], [1000, 1000], [-1000, 1000], [0, -1000]],
                                ]}
                            </geom.Polygon>
                        </Feature>
                        <Feature id="MP3" style={multipointStyle}>
                            <geom.MultiPoint transform={transformfn} >
                                { [[-6000, -4000], [6000, -3000], [0, 6400]] }
                            </geom.MultiPoint>
                        </Feature>
                    </source.Vector>
                </layer.Vector>
                <layer.Vector title="Draw" style={clickMarker} opacity={opacityDraw} addfeature={handleAddFeature}>
                    <source.Vector>
                        <interaction.Draw type={drawType} drawend={handleAddFeature} />
                    </source.Vector>
                </layer.Vector>
                    {/*
                */}
                <control.FullScreen tipLabel="Like totally go full screen"/>
                    {/*
                        <control.GeoBookmarkControl className="bookmark" marks={ initialGeoBookmarks }/>
                        <control.LayerPopupSwitcher/>
                        */}
            </Map>
            </MapProvider>

            <p> { pointer[0] + ', ' + pointer[1] } </p>
            Select vector type to draw
            <Select
                className="select"
                defaultValue={ typeSelect[0] }
                options={ typeSelect }
                onChange={ selectDrawType }
            />

            Implement and test...
            <ul>
                <li> MultiLineString </li>
                <li> MultiPolygon</li>
                <li> GeometryCollection</li>
                <li> Animation</li>
                <li> Overlay</li>
            </ul>
        </>
    );
}
export default Example1;
