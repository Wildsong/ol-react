import React, {useState} from 'react';  // eslint-disable-line no-unused-vars
import {Button} from 'reactstrap' // eslint-disable-line no-unused-vars
import {Map, Feature, control, geom, interaction, layer, source} from '../src'; // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars

import {Map as olMap, View as olView} from 'ol'
import {fromLonLat} from 'ol/proj'
import {Stroke} from 'ol/style'

import {astoria_ll} from './constants'
const DEFAULT_CENTER = astoria_ll;
const DEFAULT_ZOOM = 13;

const bingmaps_key = (process.env.BINGMAPS_KEY !== undefined)? process.env.BINGMAPS_KEY : "";

// Supported formats: JSON, GeoJSON, PBF
const featureServer = "https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/Oregon_Zoning_2017/FeatureServer/0"
//&returnExceededLimitFeatures=false&maxRecordCountFactor=3&outSR=102100&resultType=tile
//&quantizationParameters=%7B%22mode%22%3A%22view%22%2C%22originPosition%22%3A%22upperLeft%22%2C%22tolerance%22%3A1222.992452562501%2C%22extent%22%3A%7B%22xmin%22%3A-14401959.121378995%2C%22ymin%22%3A5635549.22141099%2C%22xmax%22%3A-13775786.985666994%2C%22ymax%22%3A6261721.35712299%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D%7D"

const Example4 = () => {
    const [theMap] = useState(new olMap({
        view: new olView({
            center: fromLonLat(DEFAULT_CENTER),
            zoom: DEFAULT_ZOOM,
            minZoom: 10,
            maxZoom: 20,
        }),
        //controls: [],
    }));
    const [bingVisible, setBingVisible] = useState(false);

    const toggleLayer = () => {
        setBingVisible(!bingVisible);
    }
    const polyStyle = new Stroke({
        stroke: new Stroke({color: [0, 255, 0, 1], width:2}),
        //fill: new Fill({color: [255, 0, 0, .250]}),
    });

    return (
        <>
            <h2>Example 4</h2>
                <b>{bingmaps_key? "BINGMAPS_KEY is undefined":""}</b>
                <ul>
                <li> Zoning: ArcGIS FeatureServer JSON format </li>
                <li> BingMaps aerial </li>
                <li> BingMaps CanvasLight (roads) </li>
                </ul>

                <Button onClick={toggleLayer}>Toggle Bing aerial</Button>

                <p>
                    Controls: ScaleLine <br />
                </p>

                <MapProvider map={theMap}>
                <Map>
                    <layer.Tile title="Bing Road" baseLayer={true}>
                        <source.BingMaps imagerySet="CanvasLight" apikey={bingmaps_key}/>
                    </layer.Tile>
                    <layer.Tile title="Bing Aerial" visible={bingVisible} baseLayer={true}>
                        <source.BingMaps imagerySet="Aerial" apikey={bingmaps_key}/>
                    </layer.Tile>
                    <layer.Vector title="Oregon Zoning">
                        <source.JSON url={featureServer} loader="esrijson" style={polyStyle}/>
                    </layer.Vector>

                    <control.ScaleLine units={control.ScaleLineUnits.US} />
                </Map>
                <control.LayerSwitcher/>
                <control.ScaleLine units={control.ScaleLineUnits.METRIC} />
                <control.Attribution />
                </MapProvider>
            </>
        );
}
export default Example4;
