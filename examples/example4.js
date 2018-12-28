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
        this.toggleLayer = this.toggleLayer.bind(this);
        this.state = {
            bingVisible : true,
            xyzVisible: true,
            xyzOpacity: 50,
        }
    }

    toggleLayer() {
        this.setState({
            bingVisible : !this.state.bingVisible,
        });
    }

    changeOpacity2(value) {
        this.setState({opacityBing : value});
    }


    render(props) {
        let changeOpacity = (value) => {
            this.setState({xyzOpacity : value});
        }

        return (
            <div>
                <h2>{this.props.title}</h2>
                    <h3>Tile and XYZ Sources</h3>
                    <ul>
                    <li>ArcGIS using XYZ</li>
                    <li>BingMaps aerial
                    ** It would be nice to add a selector here for other BingMaps</li>
                    </ul>

                    <SliderControl
                        onChange={changeOpacity}
                        title="ArcGIS streets"
                        value={this.state.xyzOpacity}
                    />

                    <Button onClick={this.toggleLayer}>Toggle Aerial</Button>

                <Map view=<View zoom={4} center={astoria_wm}/> useDefaultControls={false}>

                    <layer.Tile source="BingMaps"
                        visible={this.state.bingVisible}
                    />

                    <layer.Tile source="XYZ"
                        url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                        attributions={attributions}
                        visible={this.state.xyzVisible}
                        opacity={this.state.xyzOpacity/100}
                    />

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
