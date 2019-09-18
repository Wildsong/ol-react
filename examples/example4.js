import React, {useState} from 'react';  // eslint-disable-line no-unused-vars
import {Button} from 'reactstrap' // eslint-disable-line no-unused-vars
import {Map, Feature, control, geom, interaction, layer, source} from '../src'; // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars
import {LayerGroupProvider} from '../src/layer-group-context' // eslint-disable-line no-unused-vars

import {Map as olMap, View as olView} from 'ol'
import LayerGroup from 'ol/layer/Group'
import {fromLonLat} from 'ol/proj'
import Style from 'ol/style/Style'
import {Stroke, Fill} from 'ol/style'

import {astoria_ll} from './constants'
const DEFAULT_CENTER = astoria_ll;
const DEFAULT_ZOOM = 13;

const bingmaps_key = (process.env.BINGMAPS_KEY !== undefined)? process.env.BINGMAPS_KEY : "";

// Supported formats: JSON, GeoJSON, PBF
const oregonAGOL = "https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services"
const zoning2017FeatureServer = oregonAGOL + "/Oregon_Zoning_2017/FeatureServer/0";   // 2017
const zoning2014FeatureServer = oregonAGOL + "/Zoning/FeatureServer/0";  // 2014
const zoningStyle = new Style({
    stroke: new Stroke({color: [0, 0, 0, 1], width:1}),
    fill: new Fill({color: [76,129,205, .75]}),
});

const tileServer = 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer';

const dogamiServer = "https://gis.dogami.oregon.gov/arcgis/rest/services/Public"
const dogamiLandslideUrl = dogamiServer + "/Landslide_Susceptibility/ImageServer"
const dogamiSlidoUrl = dogamiServer + "/SLIDO3_4/MapServer"

// FEMA https://hazards.fema.gov/femaportal/wps/portal/NFHLWMS
const FEMA_NFHL_arcgisREST = "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer"
const femaPLSSUrl = FEMA_NFHL_arcgisREST + '/5';
const plssStyle = new Style({
    stroke: new Stroke({color: [0, 0, 0, 1], width:1}),
    //fill: new Fill({color: [255, 0, 0, .250]}),
});

const esriClarityUrl = 'https://clarity.maptiles.arcgis.com/arcgis/rest/services/' +
                    'World_Imagery/MapServer/tile/{z}/{y}/{x}'

// DOGAMI "https://gis.dogami.oregon.gov/arcgis/rest/services/Public"
const bareEarthHSUrl = "https://gis.dogami.oregon.gov/arcgis/services/Public/BareEarthHS/ImageServer/WMSServer?Layers=0"

// OSIP = Oregon State Imagery Program
const osipServer = "https://imagery.oregonexplorer.info/arcgis/rest/services"
const osipImageryUrl = osipServer + '/OSIP_2018/OSIP_2018_WM/ImageServer/tile/{z}/{y}/{x}'
const naipImageryUrl = osipServer + '/NAIP_2016/NAIP_2016_WM/ImageServer/tile/{z}/{y}/{x}'

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
    const [aerialGroup] = useState(new LayerGroup());

    const [bingVisible, setBingVisible] = useState(false);

    const toggleLayer = () => {
        setBingVisible(!bingVisible);
    }

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

                    <layer.Tile title="Aerial, ESRI Clarity" baseLayer={true} reordering={false} visible={false}>
                        <source.XYZ url={esriClarityUrl}/>
                    </layer.Tile>

                    <layer.Tile title="Aerial, NAIP 2016" baseLayer={true} reordering={false} visible={false}>
                        <source.XYZ url={naipImageryUrl}/>
                    </layer.Tile>

                    <layer.Tile title="Aerial, Oregon 2018" baseLayer={true} reordering={false} visible={false}>
                        <source.XYZ url={osipImageryUrl}/>
                    </layer.Tile>


                    <layer.Tile title="ESRI StateCityHighway USA" visible={false}>
                        <source.TileArcGISRest url={tileServer} />
                    </layer.Tile>

                    <layer.Image title="DOGAMI Landslide Susceptibility">
                        <source.ImageArcGISRest url={dogamiLandslideUrl}/>
                    </layer.Image>

                    <layer.Image title="DOGAMI Slides">
                        <source.ImageArcGISRest url={dogamiSlidoUrl}/>
                    </layer.Image>

                    <layer.Vector title="Oregon Zoning 2017" style={zoningStyle}>
                    <source.JSON url={zoning2017FeatureServer} loader="esrijson"/>
                    </layer.Vector>

                    <layer.Vector title="Oregon Zoning 2014" style={zoningStyle}>
                        <source.JSON url={zoning2014FeatureServer} loader="esrijson"/>
                    </layer.Vector>

                    <layer.Vector title="PLSS (FEMA)" style={plssStyle}>
                    <source.JSON url={femaPLSSUrl} loader="esrijson"/>
                    </layer.Vector>

                    <control.ScaleLine units={control.ScaleLineUnits.US} />
                </Map>
                <control.LayerSwitcher collapsed={false}/>
                <control.ScaleLine units={control.ScaleLineUnits.METRIC} />
                <control.Attribution />
                </MapProvider>
            </>
        );
}
export default Example4;
