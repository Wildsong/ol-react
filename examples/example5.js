import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { transform } from 'ol/proj'
import {Map, View, Feature, geom, layer} from '../src'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'

const wgs84 = "EPSG:4326";
const wm = "EPSG:3857";
const astoria_wm = transform([-123.834,46.187], wgs84,wm)

const taxlotFeatureServer = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/Taxlots_3857/FeatureServer/"

class Geocode extends Component {
    static propTypes = {
    }
    state = {
        city: ''
    }

    onTextChange = (evt) => {
        this.setState({
            city: evt.target.value
        });
        return true;
    }

    onTextSubmit = (evt) => {
        if (evt.key == 'Enter') {
            console.log("Go to:", this.state.city);
            return true; // key handled!
        }
        return false;
    }

    render() {
        return (
            <>
                <input type="text" name="city" placeholder="City" value={ this.state.city }
                    onChange={ this.onTextChange }
                    onKeyDown={ this.onTextSubmit }
                />
            </>
        )
    }
}

export default class Example5 extends Component {
    static propTypes = {
        title: PropTypes.string
    }

    render() {
        let polyStyle = {
            stroke: {color: [0, 0, 0, 1], width:4},
            fill: {color: [255, 0, 0, .250]},
        };

        return (
            <>
                <h2>{ this.props.title }</h2>
                <Geocode />

                <Map view=<View projection={wm} zoom={15} center={astoria_wm}/> useDefaultControls={false}>

                    <layer.Tile source="OSM" />

                    <layer.Vector name="Taxlots"
                        source="esrijson"
                        url={ taxlotFeatureServer }
                        style={ polyStyle }
                    />

                </Map>
            </>
        );
    }
}
