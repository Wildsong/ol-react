// example3.js ol-react
//
import React, { Component } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { ATTRIBUTION as osmAttribution } from 'ol/source/OSM'
import { transform } from 'ol/proj'
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
import SliderControl from './slider-control'
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

export default class Example extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opacityLayer1 : 100,
            opacityLayer2 : 100,
            opacityLayer3 : 100,
        }
    }

    render(props) {
        let changeOpacity1 = (value) => {
            this.setState({opacityLayer1 : value});
        }
        let changeOpacity2 = (value) => {
            this.setState({opacityLayer2 : value});
        }
        let changeOpacity3 = (value) => {
            this.setState({opacityLayer3 : value});
        }
        return (
            <div>
                <h2>{this.props.title}</h2>
                    Tile Sources

                    <SliderControl
                        onChange={changeOpacity1}
                        title="US Map"
                        value={this.state.opacityLayer1}
                    />
                    <SliderControl
                        onChange={changeOpacity2}
                        title="OSM"
                        value={this.state.opacityLayer2}
                    />
                    <SliderControl
                        onChange={changeOpacity3}
                        title="ESRI streets"
                        value={this.state.opacityLayer3}
                    />

                    Controls
                    <ul>
                        <li>FullScreen</li>
                        <li>OverviewMap</li>
                        <li>ScaleLine</li>
                    </ul>

            <Map view=<View zoom={4} center={astoria_wm}/> useDefaultControls={false}>

                <layer.Tile source="XYZ"
                    url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                    attributions={attributions}
                    opacity={this.state.opacityLayer1/100}
                />

                <layer.Tile source="WMS"
                    url="http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=GEBCO_LATEST&format=image/png&STYLE=default"
                    attributions={attributions}
                    opacity={this.state.opacityLayer2/100}
                />

                <layer.Tile source="ArcGISRest"
                    url="https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer"
                    attributions={attributions}
                    opacity={this.state.opacityLayer3/100}
                />

                <control.FullScreen />
                <control.OverviewMap/>
                <control.ScaleLine units={control.ScaleLineUnits.US} />

                {/*
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
                */}

            </Map>
            </div>
        );
    }
}

Example.propTypes = {
    title: PropTypes.string
};
