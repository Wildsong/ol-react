import React from 'react'
import PropTypes from 'prop-types'
import { Map, View, Feature, geom, layer } from '../src'
import createMapboxStreetsStyle from './mapboxstyles'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'

import { transform } from 'ol/proj'
import { wgs84, wm, astoria_ll } from '../src/utils'

const astoria_wm = transform(astoria_ll, wgs84,wm)

const mapbox_key = process.env.MAPBOX_KEY;
if (typeof mapbox_key !== 'undefined') {
    console.log("The mapbox key is defined!");
}
const mapbox_url = 'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/'
                    + '{z}/{x}/{y}.vector.pbf?access_token=' + mapbox_key
const taxlotslayer = 'clatsop-wfs%3Ataxlots'
const taxlots_url = 'http://maps.wildsong.biz/geoserver/gwc/service/tms/1.0.0/'
        + taxlotslayer
        + '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';

export default class Example7 extends React.Component {
    static propTypes = {
        title: PropTypes.string
    };

    handleMapEvent = (e) => {
        if (this.state.events.length > 5) {
            this.state.events.shift();
        }
        this.state.events.push(e.type);
        this.setState({
            events : this.state.events,
            markerId : ++this.state.markerId,
        });
        //event.stopPropagation(); // this stops draw interaction
    }

    render() {
        let pointStyle = {
            image: {
                type: 'circle',
                radius: 4,
                fill: { color: [100,100,100, 0.5] },
                stroke: { color: 'green', width: 1 }
            }
        };
        let multipointStyle = {
            image: {
                type: 'circle',
                radius: 4,
                fill: { color: [0,0,255, 0.4] },
                stroke: { color: 'red', width: 1 }
            }
        };
        let lineStyle = {
            stroke: {
                color: [255, 255, 0, 1],
                width: 3
            }
        };
        let polyStyle = {
            stroke: {color: [0, 0, 0, 1], width:4},
            fill: {color: [255, 0, 0, .250]},
        };

        return (
            <>
                <h2>{ this.props.title }</h2>
                <h4>Vector tiles</h4>
                    <ul>
                    <li> taxlots from geoserver</li>
                    <li> Tile source: Mapbox</li>
                    </ul>

                <Map
                    view=<View zoom={ 10 } center={ astoria_wm }
                            minZoom={8} maxZoom={18} />
                    useDefaultControls={ false }
                >
                <layer.VectorTile format="MVT"
                    url={ mapbox_url }
                    style={ createMapboxStreetsStyle(Style, Fill, Stroke, Icon, Text) }
                />
                <layer.VectorTile format="MVT"
                    url={ taxlots_url }
                />
                </Map>
            </>
        );
    }
}
