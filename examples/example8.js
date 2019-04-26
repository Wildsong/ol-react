import React from 'react'
import PropTypes from 'prop-types'
import { Map, View, Feature, Overlay, control, geom, layer } from '../src'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import { toLonLat } from 'ol/proj'
import { toStringHDMS } from 'ol/coordinate'
import { Converter } from 'usng/usng'
import { interaction } from '../src'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'

import { transform } from 'ol/proj'
import { myGeoServer, wgs84, wm, astoria_ll, usngPrecision } from '../src/utils'

const usngConverter = new Converter
const astoria_wm = transform(astoria_ll, wgs84,wm)

const taxlotslayer = 'clatsop_wm%3Ataxlots'
const taxlots_url = myGeoServer + '/gwc/service/tms/1.0.0/'
        + taxlotslayer
        + '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';

export default class Example8 extends React.Component {
    static propTypes = {
        title: PropTypes.string
    };
    state = {
        popup: [0,0], // where it will show up on screen
        popup_text: 'HERE'
    }

    constructor(props) {
        super(props);
    }

    coordFormatter = (coord, zoom=6) => {
        return usngConverter.LLtoUSNG(coord[1], coord[0], usngPrecision[zoom]);
    }

    onClick = (e) => {
        console.log("click", e.map.getView())
        const zoom = e.map.getView().getZoom();
        console.log(zoom);
        const lonlat = toLonLat(e.coordinate)
        this.setState({
            popup:      e.coordinate,
            popup_text: this.coordFormatter(lonlat, zoom)
        });
        //e.stopPropagation(); // this stops draw interaction
    }

    render() {
        const pointStyle = {
            image: {
                type: 'circle',
                radius: 4,
                fill: { color: [100,100,100, 0.5] },
                stroke: { color: 'green', width: 1 }
            }
        };
        const multipointStyle = {
            image: {
                type: 'circle',
                radius: 4,
                fill: { color: [0,0,255, 0.4] },
                stroke: { color: 'red', width: 1 }
            }
        };
        const lineStyle = {
            stroke: {
                color: [255, 255, 0, 1],
                width: 3
            }
        };
        const polyStyle = {
            stroke: {color: [0, 0, 0, 1], width:4},
            fill: {color: [255, 0, 0, .250]},
        };

        const popup = React.createElement('div',
            { className:"ol-popup" },
            this.state.popup_text
        );

        return (
            <>
                <h2>{ this.props.title }</h2>

                I am adding history and this example will eventually
                demonstate that too.

                <h4>Vector tiles</h4>
                    <ul>
                    <li> Overlay (popups) </li>
                    <li> Taxlots from geoserver</li>
                    <li> Tile source: OSM</li>
                    </ul>

                <Map
                    view=<View zoom={ 10 } center={ astoria_wm }
                            minZoom={8} maxZoom={18} />
                    useDefaultControls={ false }
                    onClick={ this.onClick }
                >
                    <layer.Tile source="OSM" opacity={ 1 }/>

                    <layer.VectorTile format="MVT" url={ taxlots_url }>
                    </layer.VectorTile>

	                <Overlay id="popups"
                        element={ popup }
                        position={ this.state.popup }
                        positioning="center-center"
                    />

                    <control.MousePosition
                        projection={ wgs84 }
                        coordinateFormat={ this.coordFormatter }
                    />
                </Map>
            </>
        );
    }
}
