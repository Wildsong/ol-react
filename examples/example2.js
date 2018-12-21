// example2.js ol-react
//
import React, { Component } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import {ATTRIBUTION as osmAttribution} from 'ol/source/OSM'
import {transform} from 'ol/proj'
// Bootstrap (reactstrap in this case)
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Button
} from 'reactstrap'

import {Map, View, Feature, control, geom, interaction, layer, source} from '../src';

import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css';

const wgs84 = "EPSG:4326";
const wm = "EPSG:3857";

const astoria_wm = transform([-123.834,46.187], wgs84,wm)

let transformfn = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += astoria_wm[0];
        coordinates[i+1] += astoria_wm[1];
    }
    return coordinates
}

let attributions = [
    osmAttribution,
    'and ESRI too.'
];

let pi = 3.1416;

export default class Example extends Component {
    constructor(props) {
        super(props)
        this.state = {
            enableModify: true // can't change this in the app yet
        }
    }

    render(props) {
        let pointStyle = {
            image: {
                type: 'circle',
                radius: 10,
                fill: { color: [100,100,100, 0.5] },
                stroke: { color: 'green', width: 1 }
            }
        };
        let lineStyle = {
            stroke: {
                color: [255, 255, 0, 1],
                width: 3
            }
        };
        let polyStyle = {
            stroke: {color: [0, 0, 0, 1], width:4},
            fill: {color: [255, 0, 0, .250]},
        };

        return (
            <div>
                <h2>{this.props.title}</h2>
                    Sources
                    <ul>
                        <li>Tile Source: ArcGIS REST sample: United States map</li>
                        <li>Source OSM: OpenStreetMap of the world</li>
                        <li>XYZ tiles: ESRI world street map</li>
                    </ul>
                    Controls
                    <ul>
                        <li>Attribution</li>
                        <li>Rotate</li>
                        <li>MousePosition</li>
                    </ul>

            <Map view=<View rotation={pi*.25} zoom={10} center={astoria_wm}/> useDefaultControls={false}>

                <layer.Tile opacity={0.3}>
                    <source.XYZ
                        url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                        attributions={attributions}
                     />
                </layer.Tile>

                <layer.Tile opacity={0.5}>
                    <source.TileWMS
                        url="http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=GEBCO_LATEST&format=image/png&STYLE=default"
                        attributions={attributions}
                    />
                </layer.Tile>

                <layer.Tile opacity={0.1}>
                    <source.TileArcGISRest
                        url="https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer"
                        attributions={attributions} />
                </layer.Tile>

                <control.Attribution label={"<<"} collapsible={true} collapsed={true} />
                <control.Rotate autoHide={false}/>
                <control.MousePosition projection={wgs84}/>

                {/*
                <control.FullScreen />
                <control.OverviewMap/>
                <control.ScaleLine units={control.ScaleLineUnits.US} />
                <control.Zoom />
                <control.ZoomSlider />
                <control.ZoomToExtent />

                <interaction.DoubleClickZoom />
                <interaction.DragBox />
                <interaction.DragPan />
                <interaction.DragRotate />
                <interaction.DragRotateAndZoom />
                <interaction.DragZoom />
                <interaction.Draw />
                <interaction.KeyboardPan />
                <interaction.KeyboardZoom />
                <interaction.MouseWheelZoom />
                <interaction.PinchRotate />
                <interaction.PinchZoom />

                No need to declare Modify explicitly.
                When you create a geometry and set modify=true on it
                then the ol-geometry will automatically set up a modify interaction
            <interaction.Modify features={selected_features}/>
                */}

            </Map>
            </div>
        );
    }
}

Example.propTypes = {
    title: PropTypes.string
};
