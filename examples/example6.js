import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { transform } from 'ol/proj'
import {Map, View, Feature, geom, layer} from '../src'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'

import { wgs84, wm, astoria_ll } from '../src/utils'

const wfsSource = "http://maps.wildsong.biz/geoserver/clatsop-wfs/ows?"
    + "service=WFS&version=2.0.0&request=GetFeature"

const web_markers = wfsSource + "&typeNames=web_markers"

// I am having a problem here where it won't load two WFS layers at the same
// time so I stuck the ESRI version in and that works...
// ALmost like there's a global getting overwritten or there can only be one
// WFS layer at a time???

// I think this layer is slower than the equivalent WMS layer (see sample #1)
// because it's not cached. I wonder how vector tiles compare?
//const taxlots = wfsSource + "&typeNames=taxlots"
//const taxlotFormat = 'geojson'
const taxlots = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/Taxlots_3857/FeatureServer/"
const taxlotFormat = 'esrijson'

export default class Example6 extends Component {
    static propTypes = {
        title: PropTypes.string
    }
    state = {
        address: '',
        geocoderesults: [],
        lats: "46.187",
        lons: "-123.834",
        lat: 46.187,
        lon: -123.834,
        zoom: 17,
        rotation: 0.00
    }

// I know, I know, this should really be a separate component
// but at the moment I am testing ol-react and not my programming skills
// so for the time being it's embedded here. I am going to start
// using Redux now in react-axios-test and did not see a reason to
// embed redux in the ol-react package.. yet.

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

    render() {
        const pointStyle = {
            image: {
                type: 'circle',
                radius: 4,
                fill: { color: [200,10,10, 0.5] },
                stroke: { color: 'red', width: 1 }
            }
        };
        const polyStyle = {
            stroke: {color: [0, 0, 0, 1], width:1},
            fill: {color: [255, 0, 0, .250]},
        };

        let ll = transform([this.state.lon, this.state.lat], wgs84, wm);

        return (
            <>
                <h2>{ this.props.title }</h2>

                <p>
                This form demonstrates that I can keep the map center<br />
                and zoom in component state and update the map using setState.
                </p>
                <form onSubmit={ this.submit }>
                  <input name="lats"  value={ this.state.lats }  onChange={ this.change }/>
                  <input name="lons"  value={ this.state.lons }  onChange={ this.change }/>
                  <input type="submit"/>
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
                >
                    <layer.Tile source="OSM" />

                    <layer.Vector name="Taxlots"
                        source={ taxlotFormat }
                        url={ taxlots }
                        style={ polyStyle }
                    />
                    
                    <layer.Vector name="Web markers"
                        source="geojson"
                        url={ web_markers }
                        style={ pointStyle }
                    />

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
