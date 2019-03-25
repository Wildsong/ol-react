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
// because it's not cached. example7 tests vector tiles
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
                This example will demonstrate WFS-T read/write
                but I don't have time to work on it right now.
                </p>

                <Map useDefaultControls={false}
                    view=<View projection={wm}
                        zoom={ this.state.zoom }
                        center={ ll }
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
            </>
        );
    }
}
