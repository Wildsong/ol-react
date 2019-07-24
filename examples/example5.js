import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Map, layer, source, control, interaction} from '../src'
import {Container, Row, Col, Button, Tooltip, ListGroup, ListGroupItem } from 'reactstrap'
import {Point} from 'ol/geom'
import {click, platformModifierKeyOnly} from 'ol/events/condition'
import {Feature, Collection} from 'ol'
import {MapProvider} from '../src/map-context'

// These are for testing passing an OL VectorSource in as a property
import {Vector as VectorSource} from 'ol/source'
import {Style, Circle, Fill, Stroke, Text} from 'ol/style'
import {Circle as olCircle} from 'ol/geom'
import {bbox} from 'ol/loadingstrategy'
import { EsriJSON, GeoJSON } from 'ol/format'
import jsonp from 'jsonp' // using jsonp instead of json avoids CORS problems

import {myGeoServer, workspace, astoria_ll, astoria_wm, wgs84} from '../src/constants'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {DEFAULT_CENTER, MINZOOM, MAXZOOM} from '../src/constants'
const DEFAULT_ZOOM = 14;

// CC service only works inside firewall
// const taxlots = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/Taxlots_3857/FeatureServer/"

// To generate this URL, go into GeoServer Layer Preview,
// and in All Formats, select "WFS GeoJSON(JSONP)" then paste here and
// clip off the outputFormat and maxFeatures attributes (maxFeatures=50&outputFormat=text%2Fjavascript
const taxlotsUrl = myGeoServer + '/ows?service=WFS&version=1.0.0&request=GetFeature'
    + '&typeName=' + workspace + '%3Ataxlots'
const taxlotsFormat = 'geojson'

// Without the key you get maps with a watermark
// see https://www.thunderforest.com/
const thunderforestKey = process.env.THUNDERFOREST_KEY;
const tflayername = 'Cycle' // outdoors | cycle | transport | landscape | ....
const thunderforestUrl = 'https://tile.thunderforest.com/' + tflayername + '/{z}/{x}/{y}.png'
      + ((typeof thunderforestKey === 'undefined')? '' : "?apikey=" + thunderforestKey)
//console.log("url=",thunderforest_url);

const Example5 = () => {
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({ center: astoria_wm, zoom: DEFAULT_ZOOM}),
        controls: [] // don't use default controls.
    }));
    const [address, setAddress] = useState('');
    const [geocoderesults, setGeocoderesults] = useState([]);
    const [lats, setLats] = useState(astoria_ll[1].toString());
    const [lons, setLons] = useState(astoria_ll[0].toString());
    const [center, setCenter] = useState(fromLonLat(astoria_ll));
    const [zoom, setZoom] = useState(DEFAULT_ZOOM);
    const [resolution, setResolution] = useState(0)
    const [selectCount, setSelectCount] = useState(0);
    const [rotation, setRotation] = useState(0.00);
    const [animate, setAnimate] = useState(true);
    const view = theMap.getView();

    const bookmarks = {
        1 : {   location: astoria_ll,            zoom: 13,   title: "Astoria"},
    	2 : {   location: [-123.969,45.893],     zoom: 13,   title: "Cannon Beach",},
        3 : {   location: [-123.9188,46.026],    zoom: 13,   title: "Gearhart",},
        4 : {   location: [-123.9520,46.2000],  zoom: 14,   title: "Hammond",},
        5 : {   location: [-123.5032,45.9345],  zoom: 14,  title: "Jewell",},
        6 : {   location: [-123.9407,45.7297],  zoom: 13, title: "Neahkahnie Beach",},
        7 : {   location: [-123.920,45.994],  zoom: 12, title: "Seaside"},
        8 : {   location: [-123.924,46.165], zoom: 13,   title: "Warrenton"}
    }

    const zoomClick = (e) => {
        const { target: { name, value }} = e;
        let z = zoom;
        switch (name) {
        case 'zoomin':
            z += 1
            break;
        case 'zoomout':
            z -= 1;
            break;
        }
        if (z <= MAXZOOM && z >= MINZOOM) {
            setZoom(z);
            const view = theMap.getView();
            if (animate)
                view.animate({zoom: z});
            else
                view.setZoom(z);
        }
        e.preventDefault();
    }

    const rotateClick = (e) => {
        const { target: { name, value }} = e;
        let r = rotation;
        switch (name) {
        case 'anticlockwise':
            r -= Math.PI/10;
            break;
        case 'clockwise':
            r += Math.PI/10;
            break;
        }
        setRotation(r);
        const view = theMap.getView();
        if (animate)
            view.animate({rotation: r});
        else
            view.setRotation(r);
        e.preventDefault();
    }

    const toggleAnimate = (e) => {
        const { target: { name, value }} = e;
        let aState = !animate;
	    setAnimate(aState);
        e.preventDefault();
    }

    const submit = (e) => {
        console.log("Geocode request", e);
        setLons(parseFloat(lons));
	    setLats(parseFloat(lats));
        console.log("goto", lats, lons, zoom);
        e.preventDefault();
    }

    const gotoXY = (center,zoom) => {
        if (center[0]==0 || center[1]==0 || zoom==0)
            return;
        console.log('Example5.gotoXY', center, zoom);
	    setCenter(toLonLat(center));
	    setZoom(zoom);
        const view = theMap.getView();
        if (animate)
            view.animate({center, zoom});
        else
            view.setCenter(center);
    }

    const gotoBookmark = (e) => {
        const bookmarkId = e.target.name;

        // Bookmarks are stored in lat,lon
        const bookmark_wgs84 = bookmarks[bookmarkId]
        const coord = fromLonLat(bookmark_wgs84.location)

	//setDisplayPoint(bookmark_wgs84.location);
	//setDisplayZoom(bookmark_wgs84.zoom);

        gotoXY(coord, bookmark_wgs84.zoom);
    }

    const handleMove = (mapEvent) => {
        const view = mapEvent.map.getView()
        console.log("Map.onMoveEnd",view.getCenter());
/*
 	    setCenter(view.getCenter());
        setZoom(view.getZoom());
        setRotation(view.getRotation())
    */
        setResolution(view.getResolution().toFixed(2));
        mapEvent.stopPropagation();
    };

    // Show a list of bookmarks
    const keys = Object.keys(bookmarks);
    const bookmarkTitles = keys.map(k => [k, bookmarks[k].title]);

    const polyStyle = new Style({
        stroke: new Stroke({color: 'rgba(0, 0, 0, 1)', width:4}),
        fill: new Fill({color: 'rgba(255, 0, 0, .250)'})
    });

    // Test building an URL from a function and using it in a Vector source.
    // See https://openlayers.org/en/latest/apidoc/module-ol_featureloader.html#~FeatureUrlFunction
/*
    const completeUrl = "https://geoserver.wildsong.biz/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=clatsop%3Ataxlots&outputFormat=text/javascript&count=1000&BBOX=-124.1,45.77,-123.9,46,EPSG:4326&SRSNAME=EPSG:3857"
    const customUrl = (extent, resolution, projection) => {
        console.log("customUrl ", extent, resolution);
        return completeUrl;
    }
*/
    const taxlotsSource = new VectorSource({
        format: new GeoJSON(),
        loader: (extent, resolution, projection) => {
            const baseUrl = taxlotsUrl
            const bb = "&BBOX=" + extent.join(',').toString()  // BBOX SRS optional + ',EPSG:3857'
            console.log("bbox=", bb);
            if (!(isFinite(extent[0]) && isFinite(extent[1]) && isFinite(extent[2]) && isFinite(extent[3]))) {
                console.log("Meaningless bounding box");
                return;
            }
            const fsUrl = baseUrl + "&outputFormat=text/javascript"
                //+ "&count=1000" // count appears to do nothing
                + bb + '&SRSNAME=EPSG:3857'
            console.log("geojson custom dataloader url=", baseUrl, fsUrl);
            jsonp(fsUrl, {name:"parseResponse", timeout:60000 },
                (err, data) => {
                    if (err) {
                        console.log("DataLoader failed:", err);
                    } else {
                        console.log("DataLoader completed.")
                        const features = taxlotSource.getFormat().readFeatures(data, {
                            featureProjection: projection
                        });
                        if (features.length > 0) {
                            console.log("DataLoader added", features.length, " features to", taxlotSource);
                            taxlotSource.addFeatures(features);
                        }
                    }
                }
            );
        }
    });

    // Test for issue #2, accept an external data source
    // Create an OpenLayers vector source, and add a
    // styled feature to it, and pass it into a source.Vector component
    const bigdot_style = new Style({
        geometry: new olCircle(astoria_wm, 500),
        fill: new Fill({color: 'rgba(0,255,0,0.7)'}),
        stroke: new Stroke({color:"green", width:1}),
        //text: new olText({text:"ASTORIA IS RIGHT HERE", font:"36px sans-serif"}),
        //zIndex: ???,
    })
    const point = new Point(astoria_wm);
    const pointFeature = new Feature(point);
    pointFeature.setStyle(bigdot_style);
    const myVectorSource = new VectorSource();
    myVectorSource.addFeatures([pointFeature]);

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
        console.log("selectEvent", e)
        setSelectCount(selectedFeatures.getLength());
        e.stopPropagation(); // this stops draw interaction
    }

    return (
        <><Container>
            <Row><Col>
                <h2>Example 5</h2>
                Thunderforest {tflayername} map <b>{thunderforestKey==="undefined"?"no API key!":""}</b><br />
                WFS GeoServer taxlots<br />
                Vector layer (display only, no external data source) (The big green dot.)<br />
                Demonstrates passing an OpenLayers Vector source object directly into the Layer component.

                <p>
                Demonstrates that I can keep the map center
                and zoom in component state and update the map using setState.
                </p>

                Interaction: Select <b>{selectCount>0?(selectCount + " selected"):""}</b> - select taxlots using click or shift drag
            </Col></Row>

            <Row><Col>
                { lats }, { lons } resolution: {resolution}
                <p>
                    Zoom
                    <button name="zoomin"  onClick={zoomClick}>+</button>
                    {zoom}
                    <button name="zoomout" onClick={zoomClick}>-</button>
                    Rotate
                    <button name="clockwise"     onClick={rotateClick}>+</button>
                    {rotation.toFixed(2)}
                    <button name="anticlockwise" onClick={rotateClick}>-</button>
                    Animate
                    <button name="animate" onClick={toggleAnimate}>{ animate? "on" : "off" }</button>
                </p>
                <MapProvider map={theMap}>
                <control.LayerSwitcher show_progress={true}/>
                <Map zoom={zoom} center={center} rotation={rotation} onMoveEnd={handleMove}>
                    <layer.Tile title="Thunderforest">
                        <source.XYZ url={thunderforestUrl} apikey={thunderforestKey}/>
                    </layer.Tile>

                    <layer.Vector title="Taxlots" style={taxlotStyle} maxResolution={9}>
                        <source.JSON url={taxlotsUrl} loader="geojson">
                            <interaction.Select features={selectedFeatures} style={selectedStyle} condition={click} selected={onSelectEvent}/>
                            <interaction.SelectDragBox features={selectedFeatures} style={selectedStyle} condition={platformModifierKeyOnly} selected={onSelectEvent}/>
                        </source.JSON>
                    </layer.Vector>
                    {/*

                    <layer.Vector title="Custom URL source">
                        <source.Vector url={completeUrl} strategy={bbox}/>
                    </layer.Vector>

                    <layer.Vector title="Taxlots">
                    <source.Vector source={taxlotsSource} strategy={bbox}/>
                    </layer.Vector>
                    */}
                    <layer.Vector title="Custom vectors">
                        <source.Vector source={myVectorSource}/>
                    </layer.Vector>
                </Map>
                </MapProvider>
            </Col><Col>
                <ListGroup>
                    { bookmarkTitles.map(item =>
                          <ListGroupItem tag="button" key={ item[0] } name={ item[0] }
                          onClick={ gotoBookmark }
                          action>{item[0]} {item[1]}</ListGroupItem>
                    )}
                </ListGroup>
            </Col></Row>
            <Row><Col>
                <table>
                    { geocoderesults.map(gc =>
                        <tr key={ gc.place_id }><td>{ gc.display_name }</td></tr>
                    )}
                </table>
            </Col></Row>
        </Container></>
    );
}

export default Example5;
