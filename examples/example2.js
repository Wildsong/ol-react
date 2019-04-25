import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import BootstrapTable from 'react-bootstrap-table-next'
import { transform } from 'ol/proj'
import { toStringXY } from 'ol/coordinate'
import { Collection } from 'ol'
import { Map, View, Feature, control, geom, interaction, layer} from '../src';
import { Vector as VectorSource } from 'ol/source'
import { bbox as bboxStrategy } from 'ol/loadingstrategy'
import { myGeoServer,workspace, wgs84, wm, astoria_ll } from '../src/utils'
import { buildStyle } from '../src/style'
import { DataLoader } from '../src/layer/dataloaders'
import '../App.css';

const astoria_wm = transform(astoria_ll, wgs84,wm)

const taxlotsWFS = myGeoServer
    + "/ows?service=WFS&version=2.0.0&request=GetFeature"
    + "&typeName=" + workspace + "%3Ataxlots"
const taxlotColumns = [
    {dataField: 'ogc_fid',    text: 'key'},
    {dataField: 'account_id', text: 'Account'},
    {dataField: 'owner_line', text: 'Owner'},
    {dataField: 'situs_addr', text: 'Situs'},
    {dataField: 'situs_city', text: 'Situs City'},
    {dataField: 'mapnum',     text: 'Map Number'},
]

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
        rows : []
    };
    static propTypes = {
        title: PropTypes.string
    };

    constructor(props) {
        super(props);
        // I create the source here so I don't have to go searching around
        // for it later when I need to access its features.
        this.taxlotSource = new VectorSource({ strategy: bboxStrategy });
        this.taxlotSource.setLoader(DataLoader('geojson', taxlotsWFS, this.taxlotSource));
        this.selectedFeatures = new Collection();
    }

    // You can change from the default click to other conditions...
    handleCondition = (e) => {
         return (e.type == 'click');
        // return (e.type == 'pointermove'); // this would be hover
        // return (e.type == 'dblclick'); // another example
    }

    addFeaturesToTable(features) {
        const rows = [];
        if (features.getLength()) {
            features.forEach( (feature) => {
                const attributes = {};
                feature.setStyle(selectedSt); // SIDE EFFECT tsk tsk
                // Copy the data from each feature into a list
                taxlotColumns.forEach ( (column) => {
                    attributes[column.dataField] = feature.get(column.dataField);
                });
                rows.push(attributes)
            });
        }
        this.setState({rows: rows});
    }

    onSelectInteraction = (e) => {
        e.deselected.forEach( (feature) => {
            feature.setStyle(tlSt);
        })
        this.addFeaturesToTable(this.selectedFeatures)
    }

    handleDragBox = (e) => {
        const extent = e.target.getGeometry().getExtent();
        console.log("You dragged a box", e);

        // Clear selected features
        this.selectedFeatures.forEach( (feature) => {
            feature.setStyle(tlSt);
        })
        this.selectedFeatures.clear();

/* This works if you don't have a table to populate.
        this.taxlotSource.forEachFeatureIntersectingExtent(extent,
            (feature) => {
                this.selectedFeatures.push(feature);
                feature.setStyle(selectedSt);
            }
        );
        */
        this.selectedFeatures.extend(this.taxlotSource.getFeaturesInExtent(extent));
        this.addFeaturesToTable(this.selectedFeatures);
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
                    FIXME -- needs better CSS for MousePosition.
                    The DragBox highlight/table load is a bit slow too.
                    <ul>
                        <li>Image ArcGIS REST: United States map</li>
                        <li>Image WMS: City of Astoria aerial photos</li>
                        <li>Taxlots WFS</li>
                    </ul>
                    Controls: Rotate, MousePosition, ZoomSlider <br />
                    Interactions: Select, DragBox <br />

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
                        source={ this.taxlotSource }
                        style={ taxlotStyle }
                        editStyle={ selectedStyle }
                    >
                        <interaction.Select
                            select={ this.onSelectInteraction }
                            condition={ this.handleCondition }
                            features={ this.selectedFeatures } />

                        <interaction.DragBox boxend={ this.handleDragBox }/>

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

                <BootstrapTable bootstrap4 striped condensed
                    keyField="ogc_fid"
                    columns={ taxlotColumns }
                    data={ this.state.rows }
                />
            </>
        );
    }
}
