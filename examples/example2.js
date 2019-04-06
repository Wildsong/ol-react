import React from 'react'
import PropTypes from 'prop-types'
import { transform } from 'ol/proj'
import { toStringXY } from 'ol/coordinate'
import {Map, View, Feature, control, geom, interaction, layer} from '../src';

import '../App.css';

import { myGeoServer,workspace, wgs84, wm, astoria_ll } from '../src/utils'
import { buildStyle } from '../src/style'

const astoria_wm = transform(astoria_ll, wgs84,wm)

const geoserverWFS = myGeoServer 
    + "/ows?service=WFS&version=2.0.0&request=GetFeature"
    + "&typeName=" + workspace + "%3Ataxlots"

const esriService = "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/" +
    "Specialty/ESRI_StateCityHighway_USA/MapServer"
let transformfn = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += astoria_wm[0];
        coordinates[i+1] += astoria_wm[1];
    }
    return coordinates
}

let attributions = [
    'GEBCO',
    'and ESRI too.'
];

const polyStyle = {
    stroke: {color: [0, 0, 0, 1], width:1},
    fill: {color: [255, 0, 0, .250]},
};
const editStyle = {
    stroke: {color: [255, 255, 0, 1], width:1},
    fill: {color: [255, 255, 0, .250]},
};

export default class Example extends React.Component {
    state = {
        enableModify: true // can't change this in the app yet
    };
    static propTypes = {
        title: PropTypes.string
    };

    handleSelect(e) {
        const features = e.target.getFeatures();
        const deselected = e.deselected;
        console.log(features)
        const msg = features.getLength() +
                ' selected features (last operation selected ' + e.selected.length +
                ' and deselected ' + deselected.length + ' features)';
        console.log(msg);

        const pst = buildStyle(polyStyle)
        const est = buildStyle(editStyle)

        features.forEach( (f) => {
            //f.setStyle(est);
        })

        deselected.forEach( (f) => {
            f.setStyle(pst);
        })

    }

    render(props) {
        let bbPolyStyle = {
            stroke: {color: [255, 255, 0, 1], width:4},
            fill: {color: [255, 255, 0, .750]},
        };
<<<<<<< HEAD
        const editStyle = {
            stroke: {color: [255, 255, 0, 1], width:1},
            fill: {color: [255, 255, 0, .250]},
        };
=======
/* Can I select/query from WMS? It is set "queryable" in geoserver
        <layer.Tile source="WMS"
            url={ geoserverWMS }
            params={{LAYERS: geoserverLayers,
                STYLES: "redline", // WMS style, from GeoServer in this case
                TILED: true}}
            selectable={ true } onSelect={ this.handleSelect }
        />*/


//        <layer.Image source="ArcGISRest"  url={ esriService } opacity={ .50 }/>
>>>>>>> refs/remotes/origin/master

        return (
            <>
                <h2>{this.props.title}</h2>
                    Sources
                    <ul>
                        <li>Image ArcGIS REST: United States map</li>
                        <li>Image WMS: <a href="https://www.gebco.net/data_and_products/gebco_web_services/">GEBCO</a> bathymetry</li>
                        <li>Taxlots WFS</li>
                    </ul>
                    Controls
                    <ul>
                        <li>Attribution</li>
                        <li>Rotate</li>
                        <li>MousePosition</li>
                        <li>ZoomSlider</li>
                    </ul>

                <Map
                    view=<View rotation={ Math.PI * 0 }
                        zoom={ 16 } center={ astoria_wm }/>
                    useDefaultControls={ false }>

                    <layer.Tile source="OSM" />

                    <layer.Image source="WMS"
                        url="https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?"
                        params={{LAYERS:"GEBCO_LATEST"}}
                        projection={ wm }
                    />

                    <layer.Vector name="Taxlots"
                        source="geojson"
                        url={ geoserverWFS }
                        style={ polyStyle }
                        editStyle={ editStyle }
                        selectable={ true } onSelect={ this.handleSelect }
                    />

                    <control.Attribution label={"<<"} collapsible={true} collapsed={true} />
                    <control.Rotate autoHide={false}/>
                    <control.MousePosition
                        projection={ wgs84 }
                        coordinateFormat={ (coord) => {
                                return toStringXY(coord, 3)
                        } }
                    />
                    <control.ZoomSlider />
                </Map>
            </>
        );
    }
}
