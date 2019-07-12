import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {ATTRIBUTION as osmAttribution} from 'ol/source/OSM'
import OpacitySlider from '../src/control/opacity-slider'
import {Map, Feature, geom} from '../src'
import Select from 'react-select'
import {buildStyle} from '../src/style'
import {setMapCenter} from '../src/actions'

import './style.css'
import './css/fontmaki.css'
import './css/fontmaki2.css'

import {myGeoServer, astoria_wm} from '../src/constants'

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

const attributions = [
    osmAttribution,
];

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
    const [theMap, setTheMap] = useState(mymap);
    const [center, setCenter] = useState(astoria_wm);
    const [zoom, setZoom] = useState(10);

    const [enableModify, setModify] = useState(true); // no button yet!
    const [opacityOSM, setOpacityOSM] = useState(.80);
    const [opacityDraw, setOpacityDraw] = useState(1);
    const [typeIndex, setTypeIndex] = useState(0); // index into draw typeSelect
    const [pointer, setPointer] = useState('');
    const [markerId, setMarker] = useState(1);

    // Add map layers
    const osmLayer = new olTileLayer({
        source: new OSM(),
        opacity: opacityOSM,
    })
    theMap.addLayer(osmLayer);
    const drawLayer = new olVectorLayer({
        opacity: opacityDraw,
    })
    theMap.addLayer(drawLayer);
    const changeOpacityOSM = (value) => {
        setOpacityOSM(value); // this triggers a render
        osmLayer.setOpacity(value);
        theMap.render();
        console.log(value);
    }
    const changeOpacityDraw = (value) => {
        setOpacityDraw(value); // this triggers a render
        drawLayer.setOpacity(value);
        //theMap.render();
        console.log(value);
    }
    // Add widgets specific to this page.

    theMap.addControl(new olFullScreen());

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

    const handleMapEvent = (e) => {
        console.log("Map event", e);
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
    const sbstyle = {
        width: 50,
        height: 50,
    }
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

            <Map map={theMap} style={{position:'relative',left:50,top:0}}
                onPointerMove={ (e) => { setPointer(e.coordinate); } }
                onChangeSize={ handleMapEvent }
                onMoveEnd={ handleMapEvent }
            >
            {/*
                <control.GeoBookmarkControl className="bookmark" marks={ initialGeoBookmarks }/>
                <control.LayerPopupSwitcher/>

                <layer.Tile source="Stamen"
                    title="Toner"
                    attributions={ attributions } layer="toner"
                    //visible={ true }
                    baseLayer={ true }
                />

                <layer.Tile source="OSM"
                    title="OpenStreetMap"
                    attributions={attributions}
                    baseLayer={true}
                    opacity={opacityOSM/100}
                />

                <layer.Tile source="WMS"
                    title="Taxlots"
                    url={ geoserverWMS }
                    params={{LAYERS: geoserverLayers,
                        STYLES: "redline", // WMS style, from GeoServer in this case
                        TILED: true}}
                />

                <layer.Vector title="Vector Shapes" opacity={ opacityVector/100 } >
                    <Feature id="test-line" style={ lineStyle }>
                        <geom.LineString transform={transformfn} layout="XY">
                            { [[6000,6000], [-6000, 6000], [-6000, 6000], [-6000, -6000], [6000,-6000]] }
                        </geom.LineString>
                    </Feature>

                    <Feature id="test-circle" style={ pointStyle }>
                        <geom.Circle modify={ enableModify } >{[astoria_wm, 100]}</geom.Circle>
                    </Feature>

                    <Feature id="test-circle-zeroradius" style={ polyStyle }>
                        <geom.Circle transform={ transformfn } >{[6000,0]}</geom.Circle>
                    </Feature>

                    <Feature id="test-polygon" style={ polyStyle }>
                        <geom.Polygon transform={ transformfn }>
                            {[
                                [[-3500, -2000], [3500, -2000], [0, 4000], [-3500, -2000]],
                                [[0, -1000], [1000, 1000], [-1000, 1000], [0, -1000]],
                            ]}
                        </geom.Polygon>
                    </Feature>

                    <Feature id="test-point" style={ pointStyle }>
                        <geom.Point transform={ transformfn } >
                            {[1835, -910]}
                        </geom.Point>
                    </Feature>

                    <Feature id="test-multipoint" style={ multipointStyle }>
                        <geom.MultiPoint transform={ transformfn } >
                            { [[-6000, -4000], [6000, -3000], [0, 6400]] }
                        </geom.MultiPoint>
                    </Feature>
                </layer.Vector>

                <layer.Vector title="Draw" style={ clickMarker }
                    addfeature={ handleAddFeature }>
                    <interaction.Draw type={ typeSelect[typeIndex].label }
                        drawend={ handleAddFeature }
                    />
                </layer.Vector>
                */}
            </Map>

            <p> { pointer[0] + ', ' + pointer[1] } </p>
            Select vector type to draw
            <Select
                className="select"
                defaultValue={ typeSelect[0] }
                options={ typeSelect }
                onChange={ (o) => { setTypeIndex(o.index); } }
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
Example1.propTypes = {
};
/*
const mapStateToProps = ({
})
const mapDispatchToProps = {
    setMapCenter
}
export default connect(mapStateToProps, mapDispatchToProps)(Example1);
*/
export default Example1;
