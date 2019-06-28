import React, { useState } from 'react'
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

// this should really go away
import { Tile as TileLayer } from 'ol/layer'
import { OSM, Stamen } from 'ol/source'

const usngConverter = new Converter

const taxlotslayer = 'clatsop_wm%3Ataxlots'
const taxlotsUrl = myGeoServer + '/gwc/service/tms/1.0.0/'
        + taxlotslayer
        + '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';

const Example8 = ({ title }) => {
    const [ popupPosition, setPopupPosition ] = useState([0,0]);
    const [ popupText, setPopupText ] = useState("here");
    const [ osmOpacity, setOpacity ] = useState(50);
    const [ slidoVisible, setSlido ] = useState(true);
    const popupElement = React.createElement('div', { className:"ol-popup" }, popupText );
    const selectedFeatures = new Collection();
    const coordFormatter = (coord, zoom=6) => {
        const ll = toLonLat(coord)
        return usngConverter.LLtoUSNG(ll[1], ll[0], usngPrecision[zoom]);
    };

    // FIXME -- this is just a kludge so I can test overview maps
    // I want to be able to pass layer components as children but the control does not
    // have an addlayer method. So I have to build a list of layers first
    const overviewLayers = [
        new TileLayer({
            //source: new OSM()
            source: new Stamen({layer: "toner"})
        })
    ]

    const changeOpacity = (value) => {
        console.log("Opacity ", value);
        setOpacity(value);
    }

    const handleMapClick = (e) => {
        const lonlat = toLonLat(e.coordinate)
        const zoom = e.map.getView().getZoom();
        setPopupPosition(e.coordinate)
        setPopupText(coordFormatter(lonlat, zoom));
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
            <h2>{ title }</h2>
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

            <SliderControl title="Streets" onChange={ changeOpacity } value={ osmOpacity }/>

            <Button onClick={() => {setSlido(!slidoVisible)}}>Toggle SLIDO</Button>

            <Map
                view=<View zoom={ 15 } center={ astoria_wm } minZoom={8} maxZoom={18} />
                useDefaultControls={ false }
                onClick={ handleMapClick }
            >

            <layer.Image source="ArcGISRest" url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/BareEarthHS/ImageServer"/>
            <layer.Tile source="OSM" opacity={ osmOpacity / 100 }/>
            <layer.Image source="ArcGISRest" visible={ slidoVisible }
            url="https://gis.dogami.oregon.gov/arcgis/rest/services/Public/SLIDO3_4/MapServer"/>

                <layer.VectorTile source="MVT" url={ taxlotsUrl }>
                </layer.VectorTile>

                <Overlay id="popups"
                    element={ popupElement }
                    position={ popupPosition }
                    positioning="center-center"
                />

                <control.MousePosition
                    projection={ wgs84 }
                    coordinateFormat={ coordFormatter }
                />

                <control.OverviewMap layers={overviewLayers}/>
            </Map>
        </>
    );
}
Example8.propTypes = {
    title: PropTypes.string
};
export default Example8;
