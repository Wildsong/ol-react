import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { Button } from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import { transform } from 'ol/proj'
import { toStringXY } from 'ol/coordinate'
import { Collection } from 'ol'
import { Map, View, Feature, Overlay, control, geom, interaction, layer} from '../src';
import { platformModifierKeyOnly } from 'ol/events/condition'
import { toLonLat } from 'ol/proj'
import { toStringHDMS } from 'ol/coordinate'
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
    {dataField: 'account_id', text: 'Account'},
    {dataField: 'owner_line', text: 'Owner'},
    {dataField: 'situs_addr', text: 'Situs'},
    {dataField: 'situs_city', text: 'Situs City'},
    {dataField: 'mapnum',     text: 'Map Number'},
]
const taxlotPopupField = 'situs_addr';

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

export default class Example2 extends React.Component {
    state = {
        aerial : aerials[0].value, // 1966
        aerialVisible: false,
        enableModify: true, // can't change this in the app yet
        popupPosition: undefined, // where it will show up on screen
        popupText: 'HERE', // text to display in popup
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


// IMPROVEMENT
// https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-Select.html
// I need to look at this code to make adding and removing features
// in the current selection set.

    handleCondition = (e) => {
        this.moved = false;
        switch(e.type) {
            case 'click':
                return true;
            case 'pointermove':
                const lonlat = toLonLat(e.coordinate)
                const features = this.taxlotSource.getFeaturesAtCoordinate(e.coordinate)
                if (features.length>0) {
                    const text = features[0].get(taxlotPopupField)
                    if (text!=null && text.length>0) {
                        this.setState({
                            popupPosition: e.coordinate,
                            popupText: text
                        });
                        return false;
                    }
                }
                this.setState({popupPosition: undefined}); // hide popup
                return false; // don't do a selection!
/*            case 'platformModifierKeyOnly':
                console.log("CTL", e);
                return false;
*/
        }
        return false; // pass event along I guess
    }

    addFeaturesToTable(features) {
        const rows = [];
        if (features.getLength()) {
            features.forEach( (feature) => {
                const attributes = {};
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
        console.log('onSelectInteraction', e, this.moved);
        if (!this.moved) {
            this.addFeaturesToTable(this.selectedFeatures)
        }
    }

    onBoxStart = (e) => {
        this.selectedFeatures.clear();
    }

    onBoxEnd = (e) => {
        const extent = e.target.getGeometry().getExtent();
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
        const popup = React.createElement('div',
            { className:"ol-popup" },
            this.state.popupText
        );
        return (
            <>
                <h2>{this.props.title}</h2>
                    FIXME -- needs better CSS for MousePosition.<br />
                    FIXME -- shift-click and shift-drag to change selection
                    <ul>
                        <li>Image ArcGIS REST: United States map</li>
                        <li>Image WMS: City of Astoria aerial photos</li>
                        <li>Taxlots WFS</li>
                    </ul>
                    Controls: Rotate, MousePosition, ZoomSlider <br />
                    Interactions: Select, DragBox <br />

                    <Button>Drag to select</Button>
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
                            features={ this.selectedFeatures }
                            style={ selectedSt }
                            active={ true }
                        />

                        <interaction.DragBox
                            boxstart={ this.onBoxStart }
                            boxend={ this.onBoxEnd }
                            active={ true }
                        />
                    </layer.Vector>

	                <Overlay id="popups"
                        element={ popup }
                        position={ this.state.popupPosition }
                        positioning="center-center"
                    />

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
                    keyField="account_id"
                    columns={ taxlotColumns }
                    data={ this.state.rows }
                />
            </>
        );
    }
}
