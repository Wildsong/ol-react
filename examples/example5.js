import React from 'react'
import PropTypes from 'prop-types'
import {fromLonLat} from 'ol/proj'
import {Map, layer} from '../src'
import {Point} from 'ol/geom'
import {Feature} from 'ol'
import {Vector as VectorSource} from 'ol/source'
import {Container, Row, Col, Button, Tooltip, ListGroup, ListGroupItem } from 'reactstrap'

import { myGeoServer, workspace, astoria_ll } from '../src/constants'

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
    /*    state = {
        address: '',
        geocoderesults: [],
        lats: astoria_ll[1].toString(),
        lons: astoria_ll[0].toString(),
        center: fromLonLat(astoria_ll),
        zoom: 16,
        rotation: 0.00,
        animate: true
    }
    */
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

    const change = (e) => {
        const { target: { name, value }} = e;
        //console.log('change', e, name, value);
        this.setState({
            [name]: value,
        });
        e.preventDefault();
    }

    const buttonClick = (e) => {
        const { target: { name, value }} = e;
        //console.log('click', e, name, value);
        let z = this.state.zoom;
        let r = this.state.rotation;
        let aState = this.state.animate;
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
            aState = !this.state.animate;
        }
        if (z < 1) z = 1;
        else if (z > 20) z = 20;
        this.setState({
            zoom: z,
            rotation: r,
            animate: aState
        });
        e.preventDefault();
    }

    const submit = (e) => {
        console.log("Geocode request", e);
        this.setState({
            lon: parseFloat(this.state.lons),
            lat: parseFloat(this.state.lats),
        });
        //console.log("goto", this.state.lat, this.state.lon, this.state.zoom);
        e.preventDefault();
    }

    const gotoXY = (coord,zoom) => {
        if (coord[0]==0 || coord[1]==0 || zoom==0) return;
        console.log('Example5.gotoXY', coord, zoom);
        this.setState({
            center: coord,
            zoom: zoom
        });
    }

    const gotoBookmark = (e) => {
        const bookmarkId = e.target.name;

        // Bookmarks are stored in lat,lon
        const bookmark_wgs84 = this.bookmarks[bookmarkId]
        const coord = fromLonLat(bookmark_wgs84.location)

        this.setState({
            displayPoint: bookmark_wgs84.location,
            displayZoom: bookmark_wgs84.zoom
        });
        this.gotoXY(coord, bookmark_wgs84.zoom);
    }

    const onMoveEnd = (e) => {
        const v = e.map.getView()
        console.log("Map.onMoveEnd", v.getCenter(), v.getZoom(), v.getRotation())
        this.setState({
            center: v.getCenter(),
            zoom: v.getZoom(),
            rotation: v.getRotation()
        });
        //e.stopPropagation(); // this stops draw interaction
    }

    // Show a list of bookmarks
        const keys = Object.keys(this.bookmarks);
        const bookmarks = keys.map(k => [k, this.bookmarks[k].title]);

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

        let ll = fromLonLat([this.state.lon, this.state.lat]);

        return (
            <><Container>
                <Row><Col>
                    <h2>{ this.props.title }</h2>
                    Thunderforest OSM<br />
                    WFS GeoServer taxlots<br />
                    Vector layer (display only, no external data source) <br />
                    <p>
                    1. Demonstrates passing an OpenLayers Vector source object directly into the Layer component.
                    That's what makes the green circle at the map center.
                    </p>
                    <p>
                    2. Demonstrates that I can keep the map center
                    and zoom in component state and update the map using setState.
                    </p>
                </Col></Row>

                <Row><Col>
                    { this.state.lats }, { this.state.lons } { this.state.zoom } { this.state.rotation }
                    <p>
                        Zoom
                        <button name="zoomin"  onClick={ this.buttonClick }>+</button>
                        <button name="zoomout" onClick={ this.buttonClick }>-</button>
                        Rotate
                        <button name="clockwise"     onClick={ this.buttonClick }>+</button>
                        <button name="anticlockwise" onClick={ this.buttonClick }>-</button>
                        Animate
                        <button name="animate"       onClick={ this.buttonClick }>{ this.state.animate? "on" : "off" }</button>
                    </p>
                    <Map map={theMap} zoom={this.state.zoom} center={this.state.center} rotation={this.state.rotation}
                            animate={this.state.animate} onMoveEnd={ this.onMoveEnd }>
                            <layer.Tile source="XYZ" url={ thunderforest_url } apikey={ thunderforest_key }/>

                        <layer.Vector name="Taxlots" url={taxlots} source={taxlotsSource} style={polyStyle}/>

                        <layer.Vector name="Display" source={vectorSource} style={style}/>
                    </Map>
                </Col><Col>
                    <ListGroup>
                        { bookmarks.map(item =>
                              <ListGroupItem tag="button" key={ item[0] } name={ item[0] }
                              onClick={ this.gotoBookmark }
                              action>{item[0]} {item[1]}</ListGroupItem>
                        )}
                    </ListGroup>
                </Col></Row>
                <Row><Col>
                    <table>
                        { this.state.geocoderesults.map(gc =>
                            <tr key={ gc.place_id }><td>{ gc.display_name }</td></tr>
                        )}
                    </table>
                </Col></Row>
            </Container></>
        );
}
export default Example5;
