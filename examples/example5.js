import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Map, layer} from '../src'
import {Point} from 'ol/geom'
import {Feature} from 'ol'
import {Vector as VectorSource} from 'ol/source'
import {Container, Row, Col, Button, Tooltip, ListGroup, ListGroupItem } from 'reactstrap'

import {myGeoServer, workspace, astoria_ll} from '../src/constants'

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
const mymap = new olMap({
    view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
    controls: olControls, interactions: olInteractions,
    loadTilesWhileAnimating:true,loadTilesWhileInteracting:true,
    layers: mapLayers
})


// CC service only works inside firewall
// const taxlots = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/Taxlots_3857/FeatureServer/"

// To generate this URL, go into GeoServer Layer Preview,
// and in All Formats, select "WFS GeoJSON(JSONP)" then paste here and
// clip off the outputFormat and maxFeatures attributes (maxFeatures=50&outputFormat=text%2Fjavascript
const taxlots = myGeoServer + '/ows?service=WFS&version=1.0.0&request=GetFeature'
    + '&typeName=' + workspace + '%3Ataxlots'
const taxlotsSource = 'geojson'

// Without the key you get maps with a watermark
// see https://www.thunderforest.com/
const thunderforest_key = process.env.THUNDERFOREST_KEY;
//console.log("key=",thunderforest_key);
const tflayername = 'transport' // outdoors | cycle | transport | landscape | ....
const thunderforest_url = 'https://tile.thunderforest.com/' + tflayername + '/{z}/{x}/{y}.png'
      + ((typeof thunderforest_key === 'undefined')? '' : "?apikey=" + thunderforest_key)
//console.log("url=",thunderforest_url);

const Example5 = () => {
    const [theMap, setTheMap] = useState(mymap);
    const [address, setAddress] = useState('');
    const [geocoderesults, setGeocoderesults] = useState([]);
    const [lats, setLats] = useState(astoria_ll[1].toString());
    const [lons, setLons] = useState(astoria_ll[0].toString());
    const [center, setCenter] = useState(fromLonLat(astoria_ll));
    const [zoom, setZoom] = useState(16);
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

    const buttonClick = (e) => {
        const { target: { name, value }} = e;
        console.log('click', e, name, value);
        let z = zoom;
        let r = rotation;
        let aState = animate;
        switch (name) {
        case 'zoomin':
            z += 1;
            break;
        case 'zoomout':
            z -= 1;
            break;
        case 'anticlockwise':
            r -= Math.PI/10;
            break;
        case 'clockwise':
            r += Math.PI/10;
            break;
        case 'animate':
            aState = !animate;
        }
        if (z < 1) z = 1;
        else if (z > 20) z = 20;
	setZoom(z);
	setRotation(r);
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

    const gotoXY = (coord,zoom) => {
        if (coord[0]==0 || coord[1]==0 || zoom==0) return;
        console.log('Example5.gotoXY', coord, zoom);
	setCenter(coord);
	setZoom(zoom);
    }

    const gotoBookmark = (e) => {
        const bookmarkId = e.target.name;

        // Bookmarks are stored in lat,lon
        const bookmark_wgs84 = this.bookmarks[bookmarkId]
        const coord = fromLonLat(bookmark_wgs84.location)

	setDisplayPoint(bookmark_wgs84.location);
	setDisplayZoom(bookmark_wgs84.zoom);

        gotoXY(coord, bookmark_wgs84.zoom);
    }

    theMap.on('moveend', (e) => {
        const v = e.map.getView()
        console.log("Map.onMoveEnd",v.getCenter())
            /*
    	    setCenter(v.getCenter());
            setZoom(v.getZoom());
            setRotation(v.getRotation())
            e.stopPropagation(); // this stops draw interaction
        */
        }
    );

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
    var vectorSource = new VectorSource({ projection: 'EPSG:4326' });
    vectorSource.addFeatures([pointFeature]);

    return (
        <><Container>
            <Row><Col>
                <h2>Example 5</h2>
                Thunderforest OSM<br />
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
                { lats }, { lons } { zoom } { rotation }
                <p>
                    Zoom
                    <button name="zoomin"  onClick={ buttonClick }>+</button>
                    <button name="zoomout" onClick={ buttonClick }>-</button>
                    Rotate
                    <button name="clockwise"     onClick={ buttonClick }>+</button>
                    <button name="anticlockwise" onClick={ buttonClick }>-</button>
                    Animate
                    <button name="animate"       onClick={ buttonClick }>{ animate? "on" : "off" }</button>
                </p>
                <Map map={theMap} zoom={zoom} center={center} rotation={rotation}>
                        {/*
                        <layer.Tile source="XYZ" url={ thunderforest_url } apikey={ thunderforest_key }/>

                    <layer.Vector name="Taxlots" url={taxlots} source={taxlotsSource} style={polyStyle}/>

                    <layer.Vector name="Display" source={vectorSource} style={style}/>
*/}
                </Map>
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
