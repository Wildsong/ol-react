import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { transform } from 'ol/proj'
import { toStringXY } from 'ol/coordinate'
import { click, pointermove } from 'ol/events/condition'
import {Map, View, Feature, control, geom, interaction, layer} from '../src';
import { myGeoServer,workspace, wgs84, wm, astoria_ll } from '../src/utils'
import { buildStyle } from '../src/style'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import '../App.css';

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

const astoriagis = "http://gis.astoria.or.us/cgi-bin/mapserv.exe?SERVICE=WMS&VERSION=1.1.1";
const aerials = [
    { label: "none", value: "" },
    { label: "1966", value: astoriagis + "&MAP=%2Fms4w%2Fapps%2Fastoria31_Public%2Fhtdocs%2Fastoria31%2Fmaps%2F.%2Fastoria_aerial_bw_1966.map&LAYERS=aerials1966" },
    { label: "1976", value: astoriagis + "&MAP=%2Fms4w%2Fapps%2Fastoria31_Public%2Fhtdocs%2Fastoria31%2Fmaps%2F.%2Fastoria_aerial_bw_1976.map&LAYERS=aerials1976" },
    { label: "1987", value: astoriagis + "&MAP=%2Fms4w%2Fapps%2Fastoria31_Public%2Fhtdocs%2Fastoria31%2Fmaps%2F.%2Fastoria_aerial_bw_1987.map&LAYERS=aerials1987" },
    { label: "1994", value: astoriagis + "&MAP=%2Fms4w%2Fapps%2Fastoria31_Public%2Fhtdocs%2Fastoria31%2Fmaps%2F.%2Fastoria_aerial_bw_1994.map&LAYERS=aerials1994" },
    { label: "2004", value: astoriagis + "&MAP=%2Fms4w%2Fapps%2Fastoria31_Public%2Fhtdocs%2Fastoria31%2Fmaps%2F.%2Fastoria_aerial_hires_2004.map&LAYERS=aerials2004" },
    { label: "2010", value: astoriagis + "&MAP=%2Fms4w%2Fapps%2Fastoria31_Public%2Fhtdocs%2Fastoria31%2Fmaps%2F.%2Fastoria_aerial_hires_2010.map&LAYERS=aerials2010" },
    { label: "2015", value: astoriagis + "&MAP=%2Fms4w%2Fapps%2Fastoria31_Public%2Fhtdocs%2Fastoria31%2Fmaps%2F.%2Fair_2015.map&LAYERS=air_2015"},
];

const taxlotStyle = { // pink w black outline
    stroke: {color: [255, 0, 0, 1.00], width:1},
    fill:   {color: [255, 0, 0, .000]}, // no fill = not selectable
};
const selectedStyle = { // yellow
    stroke: {color: [255, 255, 0, 1.00], width:2},
    fill:   {color: [255, 255, 0, .001]},
};
const tlSt = buildStyle(taxlotStyle);
const selectedSt = buildStyle(selectedStyle);

export default class Example extends React.Component {
    state = {
        aerial : aerials[0].value, // 1966
        aerialVisible: false,
        enableModify: true, // can't change this in the app yet
        columns: [],  rows : []
    };
    static propTypes = {
        title: PropTypes.string
    };

    // You can change from the default click to other conditions...
    handleCondition = (e) => {
         return (e.type == 'click');
        // return (e.type == 'pointermove'); // this would be hover
        // return (e.type == 'dblclick'); // another example
    }

    onSelectInteraction = (e) => {
        console.log("Example2.onSelectInteraction", e);
        const features   = e.target.getFeatures(); // this is the entire selection
        const selected   = e.selected;      // this is just what was added
        const deselected = e.deselected;
        const headers = [];
        const rows = [];

        deselected.forEach( (feature) => {
            feature.setStyle(tlSt);
        })

        if (selected.length > 0) {
            console.log("selected=",selected);
            let columns = selected[0].getKeys()
            features.forEach( (feature) => {
                feature.setStyle(selectedSt);
                // Copy the data from each feature into a list
                let s = {}
                columns.forEach ( (column) => {
                    if (column !== 'geometry') {
                        s[column] = feature.get(column);
                        headers.push({ Header : column, accessor: column })
                    }
                });
                rows.push(s)
            });
        }

        this.setState({
            columns: headers,
            rows: rows
        });
    }

    changeAerial = (e) => {
        if (e.value) {
            this.setState({
                "aerial": e.value,
                "aerialVisible": true
            });
        } else {
            this.setState({"aerialVisible": false});
        }
    }

    render(props) {

        return (
            <>
                <h2>{this.props.title}</h2>
                    Sources
                    <ul>
                        <li>Image ArcGIS REST: United States map</li>
                        <li>Image WMS: City of Astoria aerial photos</li>
                        <li>Taxlots WFS</li>
                    </ul>
                    Controls: Rotate, MousePosition, ZoomSlider <br />
                    Interactions: Select <br />

                    <Select options={ aerials } onChange={ this.changeAerial } />

                <Map useDefaultControls={ false }
                    view=<View zoom={ 16 } center={ astoria_wm }/>
                >
                    <layer.Tile source="OSM" />

                    <layer.Image name="City of Astoria"
                        source="WMS"
                        url={ this.state.aerial }
                        visible={ this.state.aerialVisible }
                    />

                    <layer.Vector name="Taxlots"
                        source="geojson"
                        url={ geoserverWFS }
                        style={ taxlotStyle }
                        editStyle={ selectedStyle }
                    >
                        <interaction.Select
                            select={ this.onSelectInteraction }
                            condition={ this.handleCondition } />
                    </layer.Vector>

                    <control.Rotate autoHide={false}/>
                    <control.MousePosition
                        projection={ wgs84 }
                        coordinateFormat={ (coord) => {
                                return toStringXY(coord, 3)
                        } }
                    />
                    <control.ZoomSlider />
                </Map>

                <ReactTable data={ this.state.rows } columns={ this.state.columns }/>
            </>
        );
    }
}
