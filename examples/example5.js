import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { transform } from 'ol/proj'
import {Map, View, Feature, geom, layer} from '../src'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'

const wgs84 = "EPSG:4326";
const wm = "EPSG:3857";
const astoria = [-123.834,46.187]

const taxlotFeatureServer = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/Taxlots_3857/FeatureServer/"

export default class Example5 extends Component {
    static propTypes = {
        title: PropTypes.string
    }
    state = {
        address: '',
        geocoderesults: [],
        lats: "46.187",
        lons: "-123.834",
        zooms: "10",
        lat: 46.187,
        lon: -123.834,
        zoom: 10
    }

// I know, I know, this should really be a separate component
// but at the moment I am testing ol-react and not my programming skills
// so for the time being it's embedded here. I am going to start
// using Redux now in react-axios-test and did not see a reason to
// embed redux in the ol-react package.

    change = (e) => {
        const { target: { name, value }} = e;
        console.log('change', e, name, value);
        this.setState({
            [name]: value,
        });
        e.preventDefault();
    }

    submit = (e) => {
        let z = parseInt(this.state.zooms);
        if (z < 1) z = 1;
        if (z > 20) z = 20;
        this.setState({
            zooms: z.toString(),
            lon: parseFloat(this.state.lons),
            lat: parseFloat(this.state.lats),
            zoom: z
        });
        console.log("goto", this.state.lat, this.state.lon, this.state.zoom);
        e.preventDefault();
    }

    componentDidUpdate() {
        console.log("didUpdate", this.state);
    }

    render() {
        let polyStyle = {
            stroke: {color: [0, 0, 0, 1], width:4},
            fill: {color: [255, 0, 0, .250]},
        };

        let ll = transform([this.state.lon, this.state.lat], wgs84, wm);
        console.log("ll=",ll, "zoom=",this.state.zoom);

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
                  <input name="zooms" value={ this.state.zooms } onChange={ this.change }/>
                  <input type="submit"/>
                </form>

                <Map useDefaultControls={false}
                    view=<View projection={wm}
                        zoom={ this.state.zoom }
                        center={ ll }
                />
                >
                    <layer.Tile source="OSM" />
                    <layer.Vector name="Taxlots"
                        source="esrijson"
                        url={ taxlotFeatureServer }
                        style={ polyStyle }
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
