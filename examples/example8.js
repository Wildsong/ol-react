import React from 'react'
import PropTypes from 'prop-types'
import { Map, View, Feature, Overlay, control, geom, layer } from '../src'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import { fromLonLat, toLonLat } from 'ol/proj'
import { toStringHDMS } from 'ol/coordinate'
import { Collection } from 'ol'
import { Converter } from 'usng.js'
import { interaction } from '../src'
import { OverviewMap } from '../src/control'
import SliderControl from './slider-control'
import { Button } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'
import { myGeoServer, astoria_wm, usngPrecision, wgs84 } from '../src/constants'

const usngConverter = new Converter

const taxlotslayer = 'clatsop_wm%3Ataxlots'
const taxlotsUrl = myGeoServer + '/gwc/service/tms/1.0.0/'
        + taxlotslayer
        + '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';

export default class Example8 extends React.Component {
    static propTypes = {
        title: PropTypes.string
    };
    state = {
        popup: [0,0], // where it will show up on screen
        popup_text: 'HERE',
        osmOpacity: 50,
        slidoVisible: true
    }

    constructor(props) {
        super(props);
        this.selectedFeatures = new Collection();
    }

    coordFormatter = (coord, zoom=6) => {
        const ll = toLonLat(coord)
        return usngConverter.LLtoUSNG(ll[1], ll[0], usngPrecision[zoom]);
    }

    changeOpacity = (value) => {
        this.setState({ osmOpacity : value});
    }

    toggleLayer = () => {
        this.setState({
            slidoVisible : !this.state.slidoVisible,
        });
    }

    onClick = (e) => {
        console.log("click", e.map.getView())
        const zoom = e.map.getView().getZoom();
        const lonlat = toLonLat(e.coordinate)
        this.setState({
            popup:      e.coordinate,
            popup_text: this.coordFormatter(lonlat, zoom)
        });
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

                <p>TODO Selection is mostly working, I need to change the taxlot polygon
                style to fill so that clicking in the taxlot works. But I am
                not sure if we're ever going to use Vector Tiles so... later...</p>

                <h4>Vector tiles</h4>
                    <ul>
                    <li> Overlay (popups) </li>
                    <li> Taxlots GeoServer vector tiles </li>
                    <li> DOGAMI SLIDO MapServer </li>
                    <li> DOGAMI Oregon Canopy HS ImageServer </li>
                    <li> Tile source: OSM </li>
                    </ul>

                <SliderControl title="Streets"
                    onChange={ this.changeOpacity }
                    value={ this.state.osmOpacity }
                />

                <Button onClick={this.toggleLayer}>Toggle SLIDO</Button>

                <Map
                    view=<View zoom={ 10 } center={ astoria_wm }
                            minZoom={8} maxZoom={18} />
                    useDefaultControls={ false }
                    onClick={ this.onClick }
                >
                    <layer.Image source="ArcGISRest" url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/BareEarthHS/ImageServer"/>
                    <layer.Tile source="OSM" opacity={ this.state.osmOpacity / 100 }/>
                    <layer.Image source="ArcGISRest" visible={ this.state.slidoVisible }
                        url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/SLIDO3_4/MapServer"/>

                    <layer.VectorTile source="MVT" url={ taxlotsUrl }>
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

                    <control.OverviewMap>
                        <layer.Tile source="OSM"/>
                    </control.OverviewMap>
                </Map>
            </>
        );
    }
}
