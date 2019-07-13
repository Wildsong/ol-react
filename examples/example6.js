import React, {useState} from 'react'
import PropTypes from 'prop-types'

import {Map, Feature, geom, layer, source} from '../src'
import {myGeoServer, workspace, wm} from '../src/constants'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {DEFAULT_CENTER, MINZOOM} from '../src/constants'
import {defaultMapLayers as mapLayers} from '../src/map-layers'
import {defaultOverviewLayers as ovLayers} from '../src/map-layers'
import {defaultControls as olControls, defaultInteractions as olInteractions} from '../src/map-widgets'
import {Tile as olTileLayer} from 'ol/layer'
import {Vector as olVectorLayer} from 'ol/layer'
import {OSM, Stamen} from 'ol/source'

// These controls will show up on the map.
import {FullScreen as olFullScreen} from 'ol/control'
import olSearchNominatim from 'ol-ext/control/SearchNominatim'

// A new instance of 'map' loads each time we come to this page.
// If I want to persist any state in the map it has to be done
// outside the component, either in redux or in some parent component.
// I wonder if I should persist the entire olMap or just its properties.
const mymap = new olMap({
    view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
    controls: olControls, interactions: olInteractions,
    loadTilesWhileAnimating:true,loadTilesWhileInteracting:true,
    layers: mapLayers
})

const wfsSource = myGeoServer + "/ows?" + "service=WFS&version=2.0.0&request=GetFeature"
const web_markers = wfsSource + '&typeNames=' + workspace + '%3Aweb_markers'

const wmsImageUrl = "https://gis.dogami.oregon.gov/arcgis/services/Public/BareEarthHS/ImageServer/WMSServer?Layers=0"
const featureUrl = "https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/Elementary_Schools/FeatureServer/0"

const Example6 = () => {
    const [theMap, setTheMap] = useState(mymap);
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

            <Map map={theMap} zoom={zoom} center={ll}>
                <layer.Tile opacity={.5}>
                </layer.Tile>
            {/*
                <layer.Image source="WMS" url={wmsImageUrl} />
                <layer.Vector source="esrijson" url={featureUrl} style={pointStyle}/>
                <layer.Vector name="Web markers" source="geojson" url={web_markers} style={markerStyle}/>
            */}
            </Map>
        </>
    );
}
export default Example6
