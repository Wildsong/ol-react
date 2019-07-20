import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { Button } from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import { toStringXY } from 'ol/coordinate'
import {MapProvider} from '../src/map-context'
import {Map, Feature, Overlay, control, geom, interaction, layer, source} from '../src';
import { Collection } from 'ol'
import { platformModifierKeyOnly } from 'ol/events/condition'
import { toStringHDMS } from 'ol/coordinate'
import { Vector as VectorSource } from 'ol/source'
import { bbox as bboxStrategy } from 'ol/loadingstrategy'
import { buildStyle } from '../src/style'
import { DataLoader } from '../src/source/dataloaders'

import { myGeoServer,workspace, astoria_wm, wgs84 } from '../src/constants'
import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat, transform} from 'ol/proj'
import {astoria_ll, MINZOOM} from '../src/constants'
const DEFAULT_CENTER = astoria_ll
const DEFAULT_ZOOM = 12;

/*
const taxlotsFeaturesUrl = myGeoServer
    + "/ows?service=WFS&version=2.0.0&request=GetFeature"
    + "&typeName=" + workspace + "%3Ataxlots"
const taxlotsFormat = 'geojson';
const taxlotsKey = 'account_id';
const taxlotsColumns = [
    {dataField: 'account_id', text: 'Account'},
    {dataField: 'owner_line', text: 'Owner'},
    {dataField: 'situs_addr', text: 'Situs'},
    {dataField: 'situs_city', text: 'Situs City'},
    {dataField: 'mapnum',     text: 'Map Number'},
]
const taxlotPopupField = 'situs_addr';
*/
const taxlotsService  = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Taxlots/FeatureServer"
const taxlotsLabels   = taxlotsService + "/0";
const taxlotsFeaturesUrl = taxlotsService + "/1";
const taxlotsFormat   = 'esrijson';
const taxlotsKey      = 'MapTaxlot';
const taxlotsColumns  = [
    {dataField: 'MapTaxlot', text: 'Map Taxlot'},
    {dataField: 'MapNumber', text: 'Map Number'},
    {dataField: 'Taxlot',    text: 'Taxlot'},
]
const taxlotPopupField = 'MapTaxlot';

const esriService = "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/" +
    "Specialty/ESRI_StateCityHighway_USA/MapServer"

let transformfn = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += astoria_wm[0];
        coordinates[i+1] += astoria_wm[1];
    }
    return coordinates
}

const astoriagis = "https://gis.astoria.or.us/cgi-bin/mapserv.exe?SERVICE=WMS&VERSION=1.1.1";
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

const Example2 = ({}) => {
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: DEFAULT_ZOOM}),
        loadTilesWhileAnimating:true, loadTilesWhileInteracting:true,
        //controls: [],
    }));
    const [aerial, setAerial] = useState(aerials[0].value); // 1966
    const [aerialVisible, setAerialVisible] = useState(false)
    const [enableModify, setEnableModify] = useState(false) // not implemented yet
    const [popupPosition, setPopupPosition] = useState([0,0]) // location on screen
    const [popupText, setPopupText] = useState("HERE") // text for popup
    const [rows, setRows] = useState([]) // search results I guess

    const selectedFeatures = new Collection();

// IMPROVEMENT
// https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-Select.html
// I need to look at this code to make adding and removing features
// in the current selection set.

   const handleCondition = (e) => {
        moved = false;
        switch(e.type) {
            case 'click':
                return true;
            case 'pointermove':
                const lonlat = toLonLat(e.coordinate)
                const features = taxlotSource.getFeaturesAtCoordinate(e.coordinate)
                if (features.length>0) {
                    const text = features[0].get(taxlotPopupField)
                    if (text!=null && text.length>0) {
                        setPopupPosition(e.coordinate);
                        setPopupText(text);
                        return false;
                    }
                }
                setPopupPosition(undefined); // hide popup
                return false; // don't do a selection!
/*            case 'platformModifierKeyOnly':
                console.log("CTL", e);
                return false;
*/
        }
        return false; // pass event along I guess
    }

    const addFeaturesToTable = (features) => {
        const rows = [];
        if (features.getLength()) {
            features.forEach( (feature) => {
                const attributes = {};
                // Copy the data from each feature into a list
                taxlotsColumns.forEach ( (column) => {
                    attributes[column.dataField] = feature.get(column.dataField);
                });
                rows.push(attributes)
            });
        }
        setRows(rows);
    }

    const onSelectInteraction = (e) => {
        console.log('onSelectInteraction', e, moved);
        if (!moved) {
            addFeaturesToTable(selectedFeatures)
        }
    }

    const onBoxStart = (e) => {
        selectedFeatures.clear();
    }

    const onBoxEnd = (e) => {
        const extent = e.target.getGeometry().getExtent();
        selectedFeatures.extend(taxlotSource.getFeaturesInExtent(extent));
        addFeaturesToTable(selectedFeatures);
    }

    const changeAerial = (e) => {
        if (e.value) {
            setAerial(e.value);
            setAerialVisible(true);
        } else {
            setAerialVisible(false);
        }
    }

    const popup = React.createElement('div',
            { className:"ol-popup" },
            popupText
        );
    return (
        <>
            <h2>Example 2</h2>
                FIXME -- needs better CSS for MousePosition.<br />
                FIXME -- shift-click and shift-drag to change selection
                <ul>
                    <li>Image ArcGIS REST: United States map</li>
                    <li>Image WMS: City of Astoria aerial photos</li>
                    <li>Taxlots Feature Server (WFS or ESRI Rest)</li>
                </ul>
                Controls: Rotate, MousePosition, ZoomSlider <br />
                Interactions: Select, DragBox <br />

                <Button>Drag to select</Button>
                <Select options={ aerials } onChange={ changeAerial } />

                <MapProvider map={theMap}>
    	        <Map center={astoria_wm}>
                    <layer.Tile title="OpenStreetMap"><source.OSM/></layer.Tile>

                    <layer.Image title="City of Astoria" visible={aerialVisible}>
                        <source.ImageWMS url={aerial}/>
                    </layer.Image>

                    <layer.Vector title="Taxlots" style={taxlotStyle}>
                        <source.JSON loader="esrijson" url={taxlotsFeaturesUrl} crossOrigin="anonymous"/>
                    </layer.Vector>
    {/*
                        editStyle={selectedStyle}>
                        <interaction.Select
                            select={ onSelectInteraction }
                            condition={ handleCondition }
                            features={ selectedFeatures }
                            style={ selectedSt }
                            active={ true }
                        />

                        <interaction.DragBox
                            boxstart={ onBoxStart }
                            boxend={ onBoxEnd }
                            active={ true }
                        />

	                <Overlay id="popups"
                        element={popup}
                        position={popupPosition}
                        positioning="center-center"
                    />
                    <control.Rotate autoHide={false}/>
                    <control.ZoomSlider />
*/}
                    <control.MousePosition projection={wgs84}
                        coordinateFormat={(coord) => {return toStringXY(coord, 3)}}
                    />
                </Map>
                </MapProvider>

                <BootstrapTable bootstrap4 striped condensed
                    keyField={taxlotsKey}
                    columns={taxlotsColumns}
                    data={rows}
                />
            </>
        );
}
export default Example2;
