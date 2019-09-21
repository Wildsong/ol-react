import React, {useState, useEffect, useRef} from 'react';  // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars
import {CollectionProvider} from '../src/collection-context' // eslint-disable-line no-unused-vars
import {Container, Row, Col, Button} from 'reactstrap' // eslint-disable-line no-unused-vars
import BootstrapTable from 'react-bootstrap-table-next' // eslint-disable-line no-unused-vars
import {Map as olMap, View as olView, Collection} from 'ol'
import {toStringXY} from 'ol/coordinate'
import {platformModifierKeyOnly} from 'ol/events/condition'
import Style from 'ol/style/Style'
import {Fill, Stroke} from 'ol/style'
import {fromLonLat} from 'ol/proj'
import {Map, source, Feature, control, interaction, layer} from '../src'; // eslint-disable-line no-unused-vars
import Popup from 'ol-ext/overlay/Popup'

import {myGeoServer, workspace, astoria_ll} from './constants'
import {WGS84} from '../src/constants'
const DEFAULT_CENTER = astoria_ll
const DEFAULT_ZOOM = 14;

const taxlotsKey      = 'taxlotkey';
const taxlotsColumns  = [
    {dataField: 'taxlotkey',  text: 'Taxlot Key'},
    {dataField: 'account_id', text: 'Account'},
    {dataField: 'taxlot',     text: 'Taxlot'},
    {dataField: 'owner_line', text: 'Owner'},
    {dataField: 'situs_addr', text: 'Situs Address'},
]
const taxlotPopupField = 'situs_addr';

// CC service only works inside firewall
// Adding a CORS compliant header, which does not seem to have helped.
// https://www.paulleasure.com/ajax-web-design/cors-how-to-set-http-response-header-on-iis-windows-server-2012-r2-to-access-control-allow-origin/
// const taxlots = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Assessment_and_Taxation/Taxlots_3857/FeatureServer/"
/*
const taxlotsService  = "https://cc-gis.clatsop.co.clatsop.or.us/arcgis/rest/services/Taxlots/FeatureServer"
const taxlotsLabels   = taxlotsService + "/0";
const taxlotsFeaturesUrl = taxlotsService + "/1";
const taxlotsFormat   = 'esrijson';
*/

// To generate this URL, go into GeoServer Layer Preview,
// and in All Formats, select "WFS GeoJSON(JSONP)" then paste here and
// clip off the outpu\rmat and maxFeatures attributes (maxFeatures=50&outputFormat=text%2Fjavascript
const taxlotsUrl = myGeoServer + '/ows?service=WFS&version=1.0.0&request=GetFeature'
    + '&typeName=' + workspace + '%3Ataxlots'
const taxlotsFormat = 'geojson'

//const esriService = "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/" +
    //"Specialty/ESRI_StateCityHighway_USA/MapServer"

const astoriagis = "https://gis.astoria.or.us/cgi-bin/mapserv.exe?SERVICE=WMS&VERSION=1.1.1"
    + "&MAP=%2Fms4w%2Fapps%2Fastoria31_Public%2Fhtdocs%2Fastoria31%2Fmaps%2F.%2Fair_2015.map&LAYERS=air_2015";

const taxlotStyle = new Style({ // pink w black outline
    stroke: new Stroke({color: 'rgba(255, 0, 0, 1.0)', width:1}),
    fill:   new Fill({color: 'rgba(255, 0, 0, .1)'}), // no fill = not selectable
});
const selectedStyle = new Style({ // yellow
    stroke: new Stroke({color: 'rgba(255, 255, 0, 1.0)', width:2}),
    fill:   new Fill({color: 'rgba(255, 255, 0, .001)'}),
});

const Example2 = () => {
    const [mapLayers] = useState(new Collection());
    const [theMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: DEFAULT_ZOOM}),
        layers: mapLayers,
        //controls: [],
    }));

    const [taxlotsVisible, setTaxlotsVisible] = useState(false);
    const [selectCount, setSelectCount] = useState(0);
//    const [enableModify, setEnableModify] = useState(false) // not implemented yet
    const [rows, setRows] = useState([]) // rows in table
    const view = theMap.getView();

    const [popup] = useState(new Popup());
    /*
    const [popupPosition, setPopupPosition] = useState([0,0]) // location on screen
    const [popupText, setPopupText] = useState("HERE") // text for popup
    */
    // Find the taxlot layer so we can query it for popups.
    const layers = theMap.getLayers();
    const taxlotLayerRef = useRef(null);
    useEffect(() => {
        theMap.addOverlay(popup);
        layers.forEach(layer => {
            if (layer.get("title") == 'Taxlots') taxlotLayerRef.current = layer;
        })
        console.log("taxlotLayerRef = ", taxlotLayerRef)
    }, []);

   const myCondition = (e) => {
        switch(e.type) {
            case 'click':
                return true;

            case 'pointermove':
                // roll over - just show taxlot popup
                {
                    const features = taxlotLayerRef.current.getSource().getFeaturesAtCoordinate(e.coordinate)
                    if (features.length > 0) {
                        const text = features[0].get(taxlotPopupField)
                        if (text != null && text.length > 0) {
                            popup.show(e.coordinate, text);
                            return false;
                        }
                    }
                }
                popup.hide();
                return false; // don't do a selection!

//            case 'platformModifierKeyOnly':
//                return false;
        }
//        console.log("mystery", e);
        return false; // condition has not been met
    }

    const handleMove = () => {
        const viewres = view.getResolution().toFixed(2)
//        setResolution(viewres);
        try {
            let maxres = taxlotLayerRef.current.get("maxResolution");
            setTaxlotsVisible(maxres >= viewres);
        } catch (err) {
            // this probably means that taxlot Layer was not found
            console.error(err, "taxlot layer not found, perhaps?")
        }
        return false; // stop event propagation
    };

    const copyFeaturesToTable = (features) => {
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

    const selectedFeatures = new Collection()
    const onSelectEvent = (e) => {
        console.log("onSelectEvent", e.mapBrowserEvent.coordinate)
        const s = selectedFeatures.getLength();
        setSelectCount(s);
        if (s) {
            popup.show(e.mapBrowserEvent.coordinate, selectedFeatures.item(0).get("taxlot").trim());
        } else {
            popup.hide()
        }
        copyFeaturesToTable(selectedFeatures)
        return false;
    }

    const coordFormatter = (coord) => {
		return toStringXY(coord, 4);
	}

    return (
        <>
            <MapProvider map={theMap}>
            <h2>Example 2</h2>
                <ul>
                    <li>Taxlots Feature Server (WFS or ESRI Rest) <b>{taxlotsVisible?"":"Zoom in to see taxlots"}</b></li>
                    <li>Image WMS: City of Astoria aerial photos</li>
                    <li>OpenStreetMap</li>
                </ul>
                This example uses ol-ext popups, for another way see example 8.<br />
                Controls: MousePosition, GeoBookmark, Attribution <br />
                Interactions: Select, SelectDragBox
                <b>{(selectCount>0)? (selectCount + " selected features") :""}</b>
                <control.MousePosition projection={WGS84} coordinateFormat={coordFormatter}/>
                <br />
                ol-ext controls: LayerSwitcher
                Note that you can use reordering=false on either individual layers or
                the entire switcher, as I have done here.

                <Container>
                    <Row><Col>
                        <Map onMoveEnd={handleMove} animate={false}>
                        <CollectionProvider collection={mapLayers}>
                            <layer.Tile title="OpenStreetMap" baseLayer={true}><source.OSM/></layer.Tile>

                            <layer.Image title="City of Astoria 2015" visible={false}>
                                <source.ImageWMS url={astoriagis} ttributions="City of Astoria, Oregon"/>
                            </layer.Image>

                            <layer.Vector title="Taxlots" style={taxlotStyle} maxResolution={10}>
                                <source.JSON url={taxlotsUrl} loader={taxlotsFormat}>
                                    <interaction.Select features={selectedFeatures} style={selectedStyle} condition={myCondition} selected={onSelectEvent}/>
                                    <interaction.SelectDragBox features={selectedFeatures} style={selectedStyle} condition={platformModifierKeyOnly} selected={onSelectEvent}/>
                                </source.JSON>
                            </layer.Vector>
                        </CollectionProvider>
                        <control.GeoBookmark/>
                        <control.Attribution/>
                    </Map>
                    </Col><Col>
                    {/* Override the class with switcherClass property to allow the collapse button to be hidden in App.css.
                        add ol-layerswitcher so that the other properties are used to style the layer controls instead
                        of duplicating them in App.css. */}
                        <control.LayerSwitcher switcherClass="ex2switcher ol-layerswitcher" reordering={false} show_progress={true} collapsed={false} collapsible={false}/>
                    </Col></Row>
                    <Row><Col>
                        <BootstrapTable bootstrap4 striped condensed
                            keyField={taxlotsKey} columns={taxlotsColumns} data={rows}/>
                    </Col></Row>
                </Container>

            </MapProvider>
        </>
    );
}
export default Example2;
