import React from 'react'
import PropTypes from 'prop-types'
    import { Map, View, Feature, Graticule, control, geom, layer, Overlay } from '../src'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import { Converter } from 'usng/usng';
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

    handleEvent = (e) => {
        console.log("Map.handleEvent", e)
        //e.stopPropagation(); // this stops draw interaction
    }

    render() {
        const coordFormatter = (coord) => {
            const zoom = 6;
            return usngConverter.LLtoUSNG(coord[1], coord[0], usngPrecision[zoom]);
        }
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

        return (
            <>
                <h2>{ this.props.title }</h2>

                I am adding history and this example will eventually
                demonstate that too.

                <h4>Vector tiles</h4>
                    <ul>
                    <li> Graticule </li>
                    <li> Taxlots from geoserver</li>
                    <li> Tile source: OSM</li>
                    </ul>

                <Map
                    view=<View zoom={ 10 } center={ astoria_wm }
                            minZoom={8} maxZoom={18} />
                    useDefaultControls={ false }
                    onMoveEnd={ this.handleEvent }
                >
                    <Graticule
                        showLabels={ true }
                        maxLines={ 100 }
                        targetSize={ 50 }
                    />
                    <layer.Tile source="OSM"
                        opacity={ 1 }
                    />

                    <layer.VectorTile format="MVT"
                        url={ taxlots_url }
                    />
	    
	    <Overlay id={ 42 } >
	           </Overlay>

                    <control.MousePosition
                        projection={ wgs84 }
                        coordinateFormat={ coordFormatter }
                    />
                </Map>
            </>
        );
    }
}
