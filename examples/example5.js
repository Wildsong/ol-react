import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Map, layer, source, control, interaction} from '../src'
import {Point} from 'ol/geom'
import {Feature} from 'ol'
import {Vector as VectorSource} from 'ol/source'
import {Container, Row, Col, Button, Tooltip, ListGroup, ListGroupItem } from 'reactstrap'
import {MapProvider} from '../src/map-context'

import {myGeoServer, workspace, astoria_ll, wgs84} from '../src/constants'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {DEFAULT_CENTER, MINZOOM, MAXZOOM} from '../src/constants'
const DEFAULT_ZOOM = 11;

// CC service only works inside firewall
// const taxlots = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/Taxlots_3857/FeatureServer/"

// To generate this URL, go into GeoServer Layer Preview,
// and in All Formats, select "WFS GeoJSON(JSONP)" then paste here and
// clip off the outputFormat and maxFeatures attributes (maxFeatures=50&outputFormat=text%2Fjavascript
const taxlotsUrl = myGeoServer + '/ows?service=WFS&version=1.0.0&request=GetFeature'
    + '&typeName=' + workspace + '%3Ataxlots'
const taxlotsSource = 'geojson'

// Without the key you get maps with a watermark
// see https://www.thunderforest.com/
const thunderforestKey = process.env.THUNDERFOREST_KEY;
const tflayername = 'Cycle' // outdoors | cycle | transport | landscape | ....
const thunderforestUrl = 'https://tile.thunderforest.com/' + tflayername + '/{z}/{x}/{y}.png'
      + ((typeof thunderforestKey === 'undefined')? '' : "?apikey=" + thunderforestKey)
//console.log("url=",thunderforest_url);

const Example5 = () => {
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: DEFAULT_ZOOM}),
        loadTilesWhileAnimating:true,loadTilesWhileInteracting:true,
        controls: [] // don't use default controls.
    }));
    const [address, setAddress] = useState('');
    const [geocoderesults, setGeocoderesults] = useState([]);
    const [lats, setLats] = useState(astoria_ll[1].toString());
    const [lons, setLons] = useState(astoria_ll[0].toString());
    const [center, setCenter] = useState(fromLonLat(astoria_ll));
    const [zoom, setZoom] = useState(DEFAULT_ZOOM);
    const [rotation, setRotation] = useState(0.00);
    const [animate, setAnimate] = useState(true);

    const bookmarks = {
        1 : {
    	    location: astoria_ll,
            zoom: 13,
    	    title: "Astoria",
    	},
    	2 : {
    	    location: [-123.969,45.893],
            zoom: 13,
    	    title: "Cannon Beach",
        },
        3 : {
    	    location: [-123.9188,46.026],
            zoom: 13,
    	    title: "Gearhart",
        },
        4 : {
            location: [-123.9520,46.2000],
            zoom: 14,
            title: "Hammond",
        },
        5 : {
            location: [-123.5032,45.9345],
            zoom: 14,
    	    title: "Jewell",
        },
        6 : {
    	    location: [-123.9407,45.7297],
            zoom: 13,
    	    title: "Neahkahnie Beach",
    	},
        7 : {
    	    location: [-123.920,45.994],
            zoom: 12,
    	    title: "Seaside",
    	},
        8 : {
    	    location: [-123.924,46.165],
            zoom: 13,
    	    title: "Warrenton",
    	}
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

    const handleEvent = (mapEvent) => {
        const v = mapEvent.map.getView()
        console.log("Map.onMoveEnd",v.getCenter());
/*
 	    setCenter(v.getCenter());
        setZoom(v.getZoom());
        setRotation(v.getRotation())
    */
        mapEvent.stopPropagation();
    };

    // Show a list of bookmarks
    const keys = Object.keys(bookmarks);
    const bookmarkTitles = keys.map(k => [k, bookmarks[k].title]);

    const polyStyle = {
        stroke: {color: [0, 0, 0, 1], width:4},
        fill: {color: [255, 0, 0, .250]},
    };
    // Create an OpenLayers source/Vector source,
    // and add a feature to it, then pass it into a
    // Layer component as its source attribute
    const style = {
        image: {
            type: 'circle',
            radius: 10,
            fill: { color: [100,100,100, 0.8] },
            stroke: { color: 'green', width: 3 }
        }
    }
    const point = new Point(fromLonLat(astoria_ll));

    // test for issue #2, external data source
    var pointFeature = new Feature(point);
    var vectorSource = new VectorSource({ projection: wgs84 });
    vectorSource.addFeatures([pointFeature]);

    return (
        <><Container>
            <Row><Col>
                <h2>Example 5</h2>
                Thunderforest {tflayername} map <b>{thunderforestKey==="undefined"?"no API key!":""}</b><br />
                WFS GeoServer taxlots<br />
                Vector layer (display only, no external data source) <br />
                <p>
                1. Demonstrates passing an OpenLayers Vector source object directly into the Layer component.
                That is what makes the green circle at the map center.
                </p>
                <p>
                2. Demonstrates that I can keep the map center
                and zoom in component state and update the map using setState.
                </p>
            </Col></Row>

            <Row><Col>
                { lats }, { lons }
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
                <Map zoom={zoom} center={center} rotation={rotation} onMoveEnd={handleEvent}>
                    <layer.Tile title="Thunderforest">
                        <source.XYZ url={thunderforestUrl} apikey={thunderforestKey}/>
                    </layer.Tile>
                    <layer.Vector title="Taxlots" style={polyStyle}>
                        <source.JSON url={taxlotsUrl} loader="geojson" crossOrigin="anonymous"/>
                    </layer.Vector>
                    <layer.Vector title="Display" style={style}>
                        <source.Vector/>
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
