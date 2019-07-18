import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Map, Feature, geom, control, layer, source} from '../src'
import {myGeoServer, workspace, wm} from '../src/constants'
import {MapProvider} from '../src/map-context'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {DEFAULT_CENTER, MINZOOM} from '../src/constants'

const wfsSource = myGeoServer + "/ows?" + "service=WFS&version=2.0.0&request=GetFeature"
const web_markers = wfsSource + '&typeNames=' + workspace + '%3Aweb_markers'

const wmsImageUrl = "https://gis.dogami.oregon.gov/arcgis/services/Public/BareEarthHS/ImageServer/WMSServer?Layers=0"
const featureUrl = "https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/Elementary_Schools/FeatureServer/0"

const Example6 = () => {
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
        loadTilesWhileAnimating:true, loadTilesWhileInteracting:true,
    }));

    const [lat, setLat] = useState(46.184);
    const [lon, setLon] = useState(-123.83);
    const [zoom, setZoom] = useState(14);
    const [rotation, setRotation] = useState(0.0);

    const pointStyle = {
        image: {
            type: 'circle',
            radius: 12,
            fill: { color: [100,100,255, .5] },
            stroke: { color: 'blue', width: 1 }
        }
    };
    const markerStyle = {
        image: {
            type: 'circle',
            radius: 4,
            fill: { color: [200,10,10, 0.5] },
            stroke: { color: 'red', width: 1 }
        }
    };

    let ll = toLonLat([lon, lat]);

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
                <Map center={ll} zoom={zoom}>
                    <layer.Image title=""> <source.ImageWMS url={wmsImageUrl}/> </layer.Image>
                    <layer.Tile title="OpenStreetMap" opacity={.5}> <source.OSM/> </layer.Tile>
                    <layer.Vector title="Elementary schools" style={pointStyle}>
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
