import React, {useState} from 'react';  // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars
import Style from 'ol/style/Style'
import {Circle, Fill, Stroke, Icon} from 'ol/style'
import {Map, Feature, geom, control, layer, source} from '../src' // eslint-disable-line no-unused-vars

import {Map as olMap, View as olView} from 'ol'
import {fromLonLat} from 'ol/proj'

import {myGeoServer, workspace, DEFAULT_CENTER, MINZOOM} from './constants'

const schoolIcon = require('../assets/school.png'); // eslint-disable-line no-undef

const wfsSource = myGeoServer + "/ows?" + "service=WFS&version=2.0.0&request=GetFeature"
const web_markers = wfsSource + '&typeNames=' + workspace + '%3Aweb_markers'

const wmsImageUrl = "https://gis.dogami.oregon.gov/arcgis/services/Public/BareEarthHS/ImageServer/WMSServer?Layers=0"
const featureUrl = "https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/Elementary_Schools/FeatureServer/0"

const Example6 = () => {
    const [theMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
    }));

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

            <p>
            This example will demonstrate WFS-T read/write
            but I don't have time to work on that part right now.
            </p>

            <p>
            It tests a GeoServer WFS-T service that's firewalled,
            and a FeatureServer of elementary schools hosted on ArcGIS Online.
            </p>

            <MapProvider map={theMap}>
                <Map>
                <control.LayerSwitcher show_progress={true}/>
                    <layer.Image title="Bare Earth HS"> <source.ImageWMS url={wmsImageUrl}/> </layer.Image>
                    <layer.Tile title="OpenStreetMap" opacity={.5}> <source.OSM/> </layer.Tile>
                    <layer.Vector title="Elementary schools" style={schoolStyle}>
                        <source.JSON url={featureUrl} loader="esrijson"/>
                    </layer.Vector>
                    <layer.Vector title="Web markers" style={markerStyle}>
                        <source.JSON url={web_markers} loader="geojson"/>
                    </layer.Vector>
                </Map>
            </MapProvider>
        </>
    );
}
export default Example6
