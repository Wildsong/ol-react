import React, {useState, useEffect, useRef} from 'react';  // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars
import {CollectionProvider} from '../src/collection-context' // eslint-disable-line no-unused-vars
import {Container, Row, Col, Button} from 'reactstrap' // eslint-disable-line no-unused-vars
import BootstrapTable from 'react-bootstrap-table-next' // eslint-disable-line no-unused-vars
import {Map as olMap, View as olView, Collection} from 'ol'
import {toStringXY} from 'ol/coordinate'
import {platformModifierKeyOnly} from 'ol/events/condition'
import Style from 'ol/style/Style'
import {Fill, Stroke, RegularShape, Circle, Text} from 'ol/style'
import {fromLonLat} from 'ol/proj'
import {Map, source, Feature, control, interaction, layer} from '../src'; // eslint-disable-line no-unused-vars
import Popup from 'ol-ext/overlay/Popup'

import {myGeoServer, myArcGISServer, workspace, astoria_ll} from './constants'
import {WGS84} from '../src/constants'
const DEFAULT_CENTER = astoria_ll
const DEFAULT_ZOOM = 14;

const taxlotsKey      = 'OBJECTID';
const taxlotsColumns  = [
    {dataField: 'OBJECTID',   text: 'Id'},
    {dataField: 'TAXLOTKEY',  text: 'Taxlot Key'},
    {dataField: 'ACCOUNT_ID', text: 'Account'},
    {dataField: 'TAXLOT',     text: 'Taxlot'},
    {dataField: 'OWNER_LINE', text: 'Owner'},
    {dataField: 'SITUS_ADDR', text: 'Situs Address'},
]

// CC service
// https://www.paulleasure.com/ajax-web-design/cors-how-to-set-http-response-header-on-iis-windows-server-2012-r2-to-access-control-allow-origin/
const taxlotsService  = myArcGISServer + "/Taxlots/FeatureServer"
const taxlotsLabels   = taxlotsService + "/0";
const taxlotsFeaturesUrl = taxlotsService + "/1";
const taxlotsFormat   = 'esrijson';
const TAXLOT_POPUP_FIELD = 'SITUS_ADDR'
const TAXLOT_KEY_FIELD = 'TAXLOTKEY'

/*
// To generate this URL, go into GeoServer Layer Preview,
// and in All Formats, select "WFS GeoJSON(JSONP)" then paste here and
// clip off the outpu\rmat and maxFeatures attributes (maxFeatures=50&outputFormat=text%2Fjavascript
const taxlotsFeaturesUrl = myGeoServer + '/ows?service=WFS&version=1.0.0&request=GetFeature'
    + '&typeName=' + workspace + '%3Ataxlots'
const taxlotsFormat = 'geojson'
const TAXLOT_POPUP_FIELD = 'taxlot'
*/
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

/* ============================================================================= */

const Example2 = () => {
    const [mapLayers] = useState(new Collection());
    const [theMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: DEFAULT_ZOOM}),
        layers: mapLayers,
        //controls: [],
    }));
    const [popup] = useState(new Popup());
    const [drawType, setDrawType] = useState('LineString');

    const [taxlotsVisible, setTaxlotsVisible] = useState(false);
    const [selectCount, setSelectCount] = useState(0);
    const [rows, setRows] = useState([]) // rows in table
    const view = theMap.getView();

// Measure is the same as Draw, but with a tooltip.
    const [measureToolActive, setMeasureToolActive] = useState(false);

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

    const taxlotPopup = (e) => {
        // roll over - show taxlot popup
        //console.log("POPUP", e);
        const features = taxlotLayerRef.current.getSource().getFeaturesAtCoordinate(e.coordinate)
        if (features.length > 0) {
            const text = features[0].get(TAXLOT_POPUP_FIELD).trim()
            const taxlot = features[0].get(TAXLOT_KEY_FIELD)
            popup.show(e.coordinate, (text !== undefined && text.length > 0)? text: taxlot);
            return false;
        } else {
            popup.hide();
        }
    }

   const selectCondition = (e) => {
        switch(e.type) {
            case 'click':
                console.log("CLICK");
                return true;

            case 'pointermove':
                taxlotPopup(e);
                return false; // don't do a selection!

//            case 'platformModifierKeyOnly':
//                return false;
        }
        console.log("unhandled in select", e);
        return false; // condition has not been met
    }

    const drawStyle = new Style({
    //    text: new Text({text: markerId.toString(),  offsetY: -10}),
    //  currently this draws a blue 5 pointed star
        image: new RegularShape({
            points: 5,
            radius: 5,
            radius1: 5,
            radius2: 2,
            stroke: new Stroke({color: 'blue', width: 1.5}),
        }),
        stroke: new Stroke({color: "black", width: 4}),
        fill: new Fill({color: 'rgba(0,0,255, 0.8)'}),
    })

    const drawCondition = (e) => {
        switch (e.type) {
            case 'pointerdown':
                console.log('pointerdown');
                return true;
        }
        console.log('unhandled in draw', e);
        return false;
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
                console.log(feature);
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
        popup.hide()

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
                <b>{(selectCount>0)? (" Selected features: " + selectCount) :""}</b>
                <control.MousePosition projection={WGS84} coordinateFormat={coordFormatter}/>
                <br />
                ol-ext controls: LayerSwitcher
                Note that you can use reordering=false on either individual layers or
                the entire switcher, as I have done here.

                <Container>
                    <Row><Col>
                        <Button onClick={() => {
                                setMeasureToolActive(!measureToolActive);
                                console.log("TOGGLED", measureToolActive);
                            }}>{measureToolActive? 'Select' : 'Measure'}</Button>

                        <Map onMoveEnd={handleMove} animate={false}>
                        <CollectionProvider collection={mapLayers}>
                            <layer.Tile title="OpenStreetMap" baseLayer={true}><source.OSM/></layer.Tile>

                            <layer.Image title="City of Astoria 2015" visible={false}>
                                <source.ImageWMS url={astoriagis} ttributions="City of Astoria, Oregon"/>
                            </layer.Image>

                            <layer.Vector title="Taxlots" style={taxlotStyle} maxResolution={10}>
                                <source.JSON url={taxlotsFeaturesUrl} loader={taxlotsFormat}>
                                    <interaction.Select features={selectedFeatures} style={selectedStyle} condition={selectCondition} selected={onSelectEvent} active={!measureToolActive}/>
                                    <interaction.SelectDragBox features={selectedFeatures} style={selectedStyle} condition={platformModifierKeyOnly} selected={onSelectEvent} active={!measureToolActive}/>
                                </source.JSON>
                            </layer.Vector>

                            <layer.Vector title="Vector Shapes" opacity={1} style={drawStyle}>
                                <source.Vector>
                                    <interaction.Draw type={drawType} condition={drawCondition} style={drawStyle} active={measureToolActive}/>
                                </source.Vector>
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
