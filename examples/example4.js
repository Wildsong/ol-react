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
    'and ESRI, and maybe even Microsoft!'
];

export default class Example4 extends Component {
    constructor(props) {
        super(props)
        this.changeOpacity1 = this.changeOpacity1.bind(this);
        this.changeOpacity2 = this.changeOpacity2.bind(this);
        this.state = {
            opacityXYZ : 100,
            opacityWMS : 100,
        }
    }

    changeOpacity1(value) {
        this.setState({opacityXYZ : value});
    }

    changeOpacity2(value) {
        this.setState({opacityWMS : value});
    }


    render(props) {
        return (
            <div>
                <h2>{this.props.title}</h2>
                    <h3>Sources</h3>

                    BingMaps aerial
                    ** It would be nice to add a selector here

                    <SliderControl
                        onChange={this.changeOpacity1}
                        title="XYZ"
                        value={this.state.opacityXYZ}
                    />
                    <SliderControl
                        onChange={this.changeOpacity2}
                        title="WMS"
                        value={this.state.opacityWMS}
                    />

                <Map view=<View zoom={4} center={astoria_wm}/> useDefaultControls={false}>

                    <layer.Tile source="BingMaps" />

                    <layer.Tile source="XYZ"
                        url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                        attributions={attributions}
                        opacity={this.state.opacityXYZ/100}
                        opaque={false}
                    />
                    {/*
                    <layer.Tile source="WMS"
                        url="http://www.WMS.net/data_and_products/WMS_web_services/web_map_service/mapserv?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=WMS_LATEST&format=image/png&STYLE=default"
                        attributions={attributions}
                        opacity={this.state.opacityWMS/100}
                    />
                    */}

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
                    */}

                </Map>
            </div>
        );
    }
}

Example4.propTypes = {
    title: PropTypes.string
};
