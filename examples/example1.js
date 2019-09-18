import React, {useState, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars
import {CollectionProvider} from '../src/collection-context' // eslint-disable-line no-unused-vars

import Style from 'ol/style/Style'
import {RegularShape, Circle, Text, Fill, Stroke} from 'ol/style'
import OpacitySlider from '../src/control/opacity-slider' // eslint-disable-line no-unused-vars
import {Map, Feature, geom, control, interaction, layer, source} from '../src' // eslint-disable-line no-unused-vars
import Select from 'react-select' // eslint-disable-line no-unused-vars

import './css/fontmaki.css'
import './css/fontmaki2.css'

import {Map as olMap, View as olView, Collection} from 'ol'
import {fromLonLat, toLonLat} from 'ol/proj'

import {myGeoServer, astoria_wm, astoria_ll, MINZOOM} from './constants'
const DEFAULT_CENTER = astoria_ll;

const geoserverWMS = myGeoServer + "/wms?"
const geoserverLayers = "taxlots"

/*
const initialGeoBookmarks = {
    "Astoria": { pos: fromLonLat([-123.836,46.182]), zoom: 13, permanent:true },
	"Cannon Beach": { pos: fromLonLat([-123.969,45.893]), zoom: 13, permanent:true },
    "Gearhart": { pos: fromLonLat([-123.9188,46.026]), zoom: 13, permanent:true },
    "Hammond": { pos: fromLonLat([-123.9520,46.2000]), zoom: 14, permanent:true },
    "Jewell": { pos: fromLonLat([-123.5032,45.9345]), zoom: 14, permanent:true },
    "Seaside": { pos: fromLonLat([-123.920,45.994]), zoom: 12, permanent:true },
    "Warrenton": { pos: fromLonLat([-123.924,46.165]), zoom: 13, permanent:true },
};
*/

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

/* ============================================================================= */

const Example1 = () => {
    const [mapLayers] = useState(new Collection());
    const [theMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
        layers: mapLayers,
        //controls: [],
    }));
    const [drawType, setDrawType] = useState("LineString");

    const [enableModify] = useState(false); // no button yet!
    const [opacityOSM, setOpacityOSM] = useState(.80);
    const [pointer, setPointer] = useState([0,0]);
    const [markerId] = useState(1);

    const onPointerMove = (e) => {
//        console.log("onPointerMove", e.coordinate)
        setPointer(toLonLat(e.coordinate));
        return false;
    }

    const selectDrawType = (e) => {
        setDrawType(e.label);
    }

    const changeOpacityOSM = (value) => {
        setOpacityOSM(value); // this triggers a render
    }

    const onGeocode = (e) => {
        const view = theMap.getView();
        view.setCenter(e.coordinate);
        view.setZoom(18);
    }

    const handleAddFeature = (e) => {
        console.log("handleAddFeature", e, e.feature);
    }

    const drawStyle = new Style({
        text: new Text({text: markerId.toString(),  offsetY: -10}),
    //  currently this draws a blue 5 pointed star
        image: new RegularShape({
            points: 5,
            radius: 5,
            radius1: 5,
            radius2: 2,
            stroke: new Stroke({color: 'blue', width: 1.5}),
        }),
        stroke: new Stroke({color: "black", width: 4}),
        fill: new Fill({color: 'rgba(0,0,255, 0.8)'}),
    })
    const pointStyle = new Style({
        image: new Circle({
            radius: 5,
            fill: new Fill({color: 'rgba(100,100,100, 0.75)'}),
            stroke: new Stroke({color: 'green', width: 5}),
        })
    });
    const multipointStyle = new Style({
        image: new Circle({
            radius: 10,
            fill: new Fill({color: 'rgba(0,0,255, 0.8)'}),
            stroke: new Stroke({color: 'red', width: 3})
        })
    })
    const lineStyle = new Style({
        stroke: new Stroke({color: 'rgba(255, 255, 0, 1)', width: 3})
    });
    const polyStyle = new Style({
        stroke: new Stroke({color: 'rgba(0, 0, 0, 1)', width: 4}),
        fill: new Fill({color: 'rgba(255, 0, 0, .250)'}),
    });

    // This is just here to test passing a feature collection down to the Vector source,
    // if you don't explicitly create one, it will be done for you.
    const drawFeatures = new Collection()

    return (
        <>
            <h2>Example 1 - Vector draw tools</h2>
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
                    Controls: Sliders, Full screen, Zoom (range 8...12)<br />
                    Ol-ext controls: Geobookmarks,
                    Layer switcher, Search Nominatim,
                    Scale, Scale Line
                </p>

            <OpacitySlider title="OSM" onChange={changeOpacityOSM}  value={opacityOSM}/>

            <p>
                Handling map events:
                pointermove, click, changesize, moveend
            </p>

            <MapProvider map={theMap}>
            <Map style={{position:'relative',left:50,top:0}} onPointerMove={onPointerMove}>
                <CollectionProvider collection={mapLayers}>
                    <layer.Tile title="Toner" baseLayer={true}>
                        <source.Stamen layer="toner"/>
                    </layer.Tile>

                    <layer.Tile title="OpenStreetMap" opacity={opacityOSM} baseLayer={true}>
                        <source.OSM/>
                    </layer.Tile>

                    <layer.Tile title="Taxlots" maxResolution={10}>
                        <source.TileWMS url={geoserverWMS}
                            params={{
                                LAYERS: geoserverLayers,
                                STYLES: "redline", // WMS style, from GeoServer in this case
                                TILED: true}}
                        />
                    </layer.Tile>

                    <layer.Vector title="Vector Shapes" opacity={1}>
                        <source.Vector>
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
                            <Feature id="Pt5" style={pointStyle}>
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
                                <geom.MultiPoint transform={transformfn}>
                                    { [[-6000, -4000], [6000, -3000], [0, 6400]] }
                                </geom.MultiPoint>
                            </Feature>
                        </source.Vector>
                    </layer.Vector>

                    <layer.Vector title="Draw" opacity={1} style={drawStyle}>
                        <source.Vector features={drawFeatures}>
                            <interaction.Draw type={drawType} drawend={handleAddFeature}/>
                        </source.Vector>
                    </layer.Vector>
                </CollectionProvider>

                <control.Graticule showLabels={true} maxLines={100} targetSize={50}/>
                <control.Scale/>
                <control.ScaleLine/>
                <control.FullScreen tipLabel="go full screen"/>
                <control.SearchNominatim onGeocode={onGeocode}/>
                <control.Attribution />
{/*
                <control.LayerPopup/>
                <control.GeoBookmarkControl className="bookmark" marks={ initialGeoBookmarks }/>
*/}

            </Map>
            </MapProvider>
            <p> { pointer[0] + ', ' + pointer[1] } </p>
            Select vector type to draw
            <Select defaultValue={typeSelect[0]} options={typeSelect} onChange={selectDrawType}/>

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
