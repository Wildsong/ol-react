import React from 'react'
import PropTypes from 'prop-types'
import {fromLonLat, toLonLat} from 'ol/proj'
import {Map, Feature, geom, layer} from '../src'
import {myGeoServer, workspace, wm} from '../src/constants'

const wfsSource = myGeoServer + "/ows?" + "service=WFS&version=2.0.0&request=GetFeature"
const web_markers = wfsSource + '&typeNames=' + workspace + '%3Aweb_markers'

const wmsImageUrl = "https://gis.dogami.oregon.gov/arcgis/services/Public/BareEarthHS/ImageServer/WMSServer?Layers=0"
const featureUrl = "https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/Elementary_Schools/FeatureServer/0"

const Example6 = () => {
    /*
    state = {
        lat: 46.184,
        lon: -123.83,
        zoom: 14,
        rotation: 0.00
    }
    */

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

        let ll = toLonLat([this.state.lon, this.state.lat]);

        return (
            <>
                <h2>{ this.props.title }</h2>

                <p>
                This example will demonstrate WFS-T read/write
                but I don't have time to work on that part right now.
                </p>

                <p>
                It tests a GeoServer WFS-T service that's firewalled,
                and a FeatureServer of elementary schools hosted on ArcGIS Online.
                </p>

                <Map map={theMap} zoom={ this.state.zoom } center={ ll }>
                    <layer.Image source="WMS" url={wmsImageUrl} />
                    <layer.Tile source="OSM" opacity={.5}/>
                    <layer.Vector source="esrijson" url={featureUrl} style={pointStyle}/>
                    <layer.Vector name="Web markers" source="geojson" url={web_markers} style={markerStyle}/>
                </Map>
            </>
        );
}
export default Example6
