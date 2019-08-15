import React, {useState} from 'react';  // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars
import Style from 'ol/style/Style'
import {Circle, Fill, Stroke, Icon} from 'ol/style'
import {Map, Feature, geom, control, layer, source} from '../src' // eslint-disable-line no-unused-vars

import {Map as olMap, View as olView} from 'ol'
import {fromLonLat} from 'ol/proj'

import {myGeoServer, myArcGISServer, workspace, astoria_ll, astoria_wm, DEFAULT_CENTER, XMIN,YMIN,XMAX,YMAX, EXTENT} from './constants'
const STARTZOOM=15;

import {wgs84, wm} from '../src/constants'
import {transformExtent} from 'ol/proj';
const extent_wm = transformExtent(EXTENT, wgs84, wm);

const schoolIcon = require('../assets/school.png'); // eslint-disable-line no-undef

// Clatsop County services
const ccPLSSUrl = myArcGISServer + "/PLSS/MapServer"
const ccgisBasemap = myArcGISServer + "/Clatsop_County_basemap/MapServer/tile/{z}/{y}/{x}"

const wfsSource = myGeoServer + "/ows?" + "service=WFS&version=2.0.0&request=GetFeature"
const web_markers = wfsSource + '&typeNames=' + workspace + '%3Aweb_markers'

const wmsImageUrl = "https://gis.dogami.oregon.gov/arcgis/services/Public/BareEarthHS/ImageServer/WMSServer?Layers=0"
const featureUrl = "https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/Elementary_Schools/FeatureServer/0"

const xform = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        [coordinates[i], coordinates[i+1]] = fromLonLat([coordinates[i], coordinates[i+1]]);
    }
    return coordinates
}

const Example6 = () => {
    const [theMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: STARTZOOM}),
    }));

    const plssStyle = new Style({
        stroke: new Stroke({color: [0, 0, 0, 1], width:1}),
        //fill: new Fill({color: [255, 0, 0, .250]}),
    });

    const yellowStyle = new Style({
        stroke: new Stroke({color: 'yellow', width: 1})
    });
    const greenStyle = new Style({
        stroke: new Stroke({color: 'green', width: 1})
    });

    const pointStyle = new Style({
        image: new Circle({
            radius: 12,
            fill: new Fill({color: 'rgba(100,100,255, .5)'}),
            stroke: new Stroke({color: 'blue', width: 1})
        })
    });
    const markerStyle = new Style({
        image: new Circle({
            radius: 4,
            fill: new Fill({color: 'rgba(200,10,10, 0.5)'}),
            stroke: new Stroke({color: 'red', width: 1})
        })
    });
    const schoolStyle = new Style({
        image: new Icon({src: schoolIcon}),
    });
    return (
        <>
            <h2>Example 6</h2>

            <ul>
            <li>Vector extent box (yellow)</li>
            <li>WFS-T GeoServer "web markers" (firewalled); editing not done yet</li>
            <li>ESRIjson FeatureServer of elementary schools, courtesy of ArcGIS Online.</li>
            <li>Tiles ArcGIS: Clatsop County PLSS (firewalled)</li>
            <li>Tiles ArcGIS: Clatsop County basemap (firewalled)</li>
            <li>Tiles: OSM layer</li>
            <li>Image WMS: DOGAMI hillshade</li>
            </ul>

            <MapProvider map={theMap}>
                <Map>
                    <control.LayerSwitcher show_progress={true}/>
                    <control.FullScreen/>

                    <layer.Image title="Bare Earth HS">
                        <source.ImageWMS url={wmsImageUrl}/>
                    </layer.Image>

                    <layer.Tile title="Clatsop County" baseLayer={true} visible={true}
                        permalink="Clatsop">
                        <source.XYZ url={ccgisBasemap} transition={0} opaque={true}
                            attributions="Clatsop County" extent={extent_wm}/>
                    </layer.Tile>

                    <layer.Tile title="OpenStreetMap" opacity={.70} baseLayer={true} visible={false}>
                        <source.OSM/>
                    </layer.Tile>

                    <layer.Vector title="Elementary schools" style={schoolStyle}>
                        <source.JSON url={featureUrl} loader="esrijson"/>
                    </layer.Vector>

                    <layer.Tile title="PLSS (Clatsop County)" style={plssStyle} reordering={false}>
                        <source.TileArcGISRest url={ccPLSSUrl} loader="esrijson"/>
                    </layer.Tile>

                    <layer.Vector title="Extent rectangle" opacity={1}>
                        <source.Vector>
                            <Feature id="Rect1" style={yellowStyle}>
                                <geom.LineString transform={xform}>
                                    { [[XMIN,YMIN],[XMIN,YMAX],[XMAX,YMAX],[XMAX,YMIN],[XMIN,YMIN]] }
                                </geom.LineString>
                            </Feature>
                        </source.Vector>
                    </layer.Vector>

                    <layer.Vector title="WFS-T web markers" style={markerStyle}>
                        <source.JSON url={web_markers} loader="geojson"/>
                    </layer.Vector>
                </Map>
            </MapProvider>
        </>
    );
}
export default Example6
