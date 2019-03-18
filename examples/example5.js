import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { transform } from 'ol/proj'
import { Map, View, layer } from '../src'
import { Point } from 'ol/geom'
import { Feature } from 'ol'
import { Vector as VectorSource } from 'ol/source'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'

import { wgs84, wm, astoria_ll } from '../src/utils'

// We're querying the Nomiatim geocoder (OpenStreetMap) via Axios
// to find addresses in Clatsop county.

const geocodeServer = "https://nominatim.openstreetmap.org/search?format=json"

// CC service only works inside firewall
// const taxlots = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/Taxlots_3857/FeatureServer/"

// To generate this URL,
// go into GeoServer Layer Preview,
// and in All Formats, select "WFS GeoJSON(JSONP)"
// then paste here and
// clip off the outputFormat and maxFeatures attributes (maxFeatures=50&outputFormat=text%2Fjavascript
const taxlots = 'http://maps.wildsong.biz/geoserver/clatsop-wfs/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=clatsop-wfs%3Ataxlots'

export default class Example5 extends Component {
    static propTypes = {
        title: PropTypes.string
    }
    state = {
        address: '',
        geocoderesults: [],
        lats: astoria_ll[1].toString(),
        lons: astoria_ll[0].toString(),
        lat: astoria_ll[1],
        lon: astoria_ll[0],
        zoom: 16,
        rotation: 0.00
    }

    change = (e) => {
        const { target: { name, value }} = e;
        //console.log('change', e, name, value);
        this.setState({
            [name]: value,
        });
        e.preventDefault();
    }

    click = (e) => {
        const { target: { name, value }} = e;
        //console.log('click', e, name, value);
        let z = this.state.zoom;
        let r = this.state.rotation;
        switch (name) {
        case 'zoomin':
            z += 1;
            break;
        case 'zoomout':
            z -= 1;
            break;
        case 'anticlockwise':
            r -= Math.Pi/10;
            break;
        case 'clockwise':
            r += Math.Pi/10;
            break;
        }
        if (z < 1) z = 1;
        else if (z > 20) z = 20;
        this.setState({
            zoom: z,
            rotation: r
        });
        e.preventDefault();
    }

    submit = (e) => {
        this.setState({
            lon: parseFloat(this.state.lons),
            lat: parseFloat(this.state.lats),
        });
        //console.log("goto", this.state.lat, this.state.lon, this.state.zoom);
        e.preventDefault();
    }

    handleEvent = (e) => {
        console.log("Map.handleEvent", e.map)
        //e.stopPropagation(); // this stops draw interaction
    }

    render() {
        let polyStyle = {
            stroke: {color: [0, 0, 0, 1], width:4},
            fill: {color: [255, 0, 0, .250]},
        };

        // Create an OpenLayers source/Vector source,
        // and add a feature to it, then pass it into a
        // Layer component as its source attribute
        var style = {
            image: {
                type: 'circle',
                radius: 10,
                fill: { color: [100,100,100, 0.8] },
                stroke: { color: 'green', width: 3 }
            }
        }
        var point = new Point(
            transform(astoria_ll, 'EPSG:4326', 'EPSG:3857')
        );
        var pointFeature = new Feature(point);
        var vectorSource = new VectorSource({ projection: 'EPSG:4326' });
        vectorSource.addFeatures([pointFeature]);

        let ll = transform([this.state.lon, this.state.lat], wgs84, wm);

        return (
            <>
                <h2>{ this.props.title }</h2>

<em>2019-03-17 I AM WORKING ON THIS EXAMPLE RIGHT NOW SO IT'S BUGGY!
There is actually no Nominatim code here yet. LOL.</em>
                <p>
                1. Demonstrates passing an OpenLayers Vector source object directly into the Layer component.
                That's what makes the green circle at the map center.
                </p>
                <p>
                2. Demonstrates that I can keep the map center<br />
                and zoom in component state and update the map using setState.
                </p>
                { this.state.lats }, { this.state.lons } { this.state.zoom }
                <form onSubmit={ this.submit }>
                  <input name="addr"  onChange={ this.change }/>
                  <input type="submit" value="Geocode" />
                </form>
                Zoom
                <button name="zoomin"  onClick={ this.click }>+</button>
                <button name="zoomout" onClick={ this.click }>-</button>
                Rotate
                <button name="clockwise"     onClick={ this.click }>+</button>
                <button name="anticlockwise" onClick={ this.click }>-</button>

                <Map useDefaultControls={false}
                    view=<View projection={wm}
                        zoom={ this.state.zoom }
                        center={ ll }
                        rotation={ this.state.rotation }
                    />
                    onMoveEnd={ this.handleEvent }
                >
                    <layer.Tile source="OSM" />
                    <layer.Vector name="Taxlots"
                        source="geojson"
                        url={ taxlots }
                        style={ polyStyle }
                    />

                    test for issue #2
                    <layer.Vector name="Display" source={vectorSource} style={style}/>
                </Map>

                <table>
                    { this.state.geocoderesults.map(gc =>
                        <tr key={ gc.place_id }><td>{ gc.display_name }</td></tr>
                    )}
                </table>
            </>
        );
    }
}
