import React, {useState} from 'react';  // eslint-disable-line no-unused-vars
import {Map, layer, source, control, interaction, overlay} from '../src' // eslint-disable-line no-unused-vars
import {Container, Row, Col, Button, Tooltip, ListGroup, ListGroupItem } from 'reactstrap' // eslint-disable-line no-unused-vars
import BootstrapTable from 'react-bootstrap-table-next' // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars
import {CollectionProvider} from '../src/collection-context' // eslint-disable-line no-unused-vars

import {Map as olMap, View as olView, Collection} from 'ol'
import {fromLonLat} from 'ol/proj'
import {Point} from 'ol/geom'
import {Vector as VectorSource} from 'ol/source'
import Style from 'ol/style/Style'
import {Fill, Stroke} from 'ol/style'
import {Circle as olCircle} from 'ol/geom'
import {click, platformModifierKeyOnly} from 'ol/events/condition'
import Feature from 'ol/Feature'

import {myGeoServer, workspace, astoria_ll, astoria_wm, MINZOOM, MAXZOOM} from './constants'
const DEFAULT_ZOOM = 14;

// These are for testing passing an OL VectorSource in as a property

const taxlotsKey      = 'taxlotkey';
const taxlotsColumns  = [
    {dataField: 'taxlotkey',  text: 'Taxlot Key'},
    {dataField: 'account_id', text: 'Account'},
    {dataField: 'taxlot',     text: 'Taxlot'},
    {dataField: 'owner_line', text: 'Owner'},
    {dataField: 'situs_addr', text: 'Situs Address'},
]


// const taxlotsUrl = "https://delta.co.clatsop.or.us/arcgis/rest/services/Taxlots/FeatureServer/"

// To generate this URL, go into GeoServer Layer Preview,
// and in All Formats, select "WFS GeoJSON(JSONP)" then paste here and
// clip off the outputFormat and maxFeatures attributes (maxFeatures=50&outputFormat=text%2Fjavascript
const taxlotsUrl = myGeoServer + '/ows?service=WFS&version=1.0.0&request=GetFeature'
    + '&typeName=' + workspace + '%3Ataxlots'

// Without the key you get maps with a watermark
// see https://www.thunderforest.com/
const thunderforestKey = process.env.THUNDERFOREST_KEY;
const tflayername = 'Cycle' // outdoors | cycle | transport | landscape | ....
const thunderforestUrl = 'https://tile.thunderforest.com/' + tflayername + '/{z}/{x}/{y}.png'
      + ((typeof thunderforestKey === 'undefined')? '' : "?apikey=" + thunderforestKey)
//console.log("url=",thunderforest_url);

const Example5 = () => {
    const [mapLayers] = useState(new Collection());
    const [theMap] = useState(new olMap({
        view: new olView({ center: astoria_wm, zoom: DEFAULT_ZOOM}),
        //controls: [], // don't use default controls.
        layers: mapLayers,
    }));
    const [zoom, setZoom] = useState(DEFAULT_ZOOM);
    const [resolution, setResolution] = useState(0)
    const [lats] = useState(astoria_ll[1].toString());
    const [lons] = useState(astoria_ll[0].toString());
    const [selectCount, setSelectCount] = useState(0);
    const [rotation, setRotation] = useState(0.00);
    const [animate, setAnimate] = useState(true);
    const view = theMap.getView();

    const bookmarks = {
        1 : { location: astoria_ll,          zoom: 13, title: "Astoria"},
        2 : { location: [-123.969,45.893],   zoom: 13, title: "Cannon Beach"},
        3 : { location: [-123.9188,46.026],  zoom: 13, title: "Gearhart",},
        4 : { location: [-123.9520,46.2000], zoom: 14, title: "Hammond",},
        5 : { location: [-123.5032,45.9345], zoom: 14, title: "Jewell",},
        6 : { location: [-123.9407,45.7297], zoom: 13, title: "Neahkahnie Beach",},
        7 : { location: [-123.920,45.994],   zoom: 12, title: "Seaside"},
        8 : { location: [-123.924,46.165],   zoom: 13, title: "Warrenton"}
    }

// Set the new view and let OpenLayers generate a moveend event.
// Then use the new view settings to update state in this component.

    const zoomClick = (e) => {
        const { target: { name, value }} = e;
        let z = zoom;
        switch (name) {
        case 'zoomin':
            z += 1
            break;
        case 'zoomout':
            z -= 1;
            break;
        }
        if (z <= MAXZOOM && z >= MINZOOM) {
            if (animate)
                view.animate({zoom: z});
            else
                view.setZoom(z);
        }
        e.preventDefault();
    }

    const rotateClick = (e) => {
        const { target: { name, value }} = e;
        let r = rotation;
        switch (name) {
        case 'anticlockwise':
            r -= Math.PI/10;
            break;
        case 'clockwise':
            r += Math.PI/10;
            break;
        }
        if (animate)
            view.animate({rotation: r});
        else
            view.setRotation(r);
        e.preventDefault();
    }

    const toggleAnimate = (e) => {
        const { target: { name, value }} = e;
        let aState = !animate;
        setAnimate(aState);
        e.preventDefault();
    }

    const gotoXY = (center, zoom) => {
        if (center[0]==0 || center[1]==0 || zoom==0)
            return;
        console.log('Example5.gotoXY', center, zoom);
        if (animate)
            view.animate({center, zoom});
        else
            view.setCenter(center);
    }

    const gotoBookmark = (e) => {
        const bookmarkId = e.target.name;

        // Bookmarks are stored in lat,lon
        const bookmark_wgs84 = bookmarks[bookmarkId]
        const coord = fromLonLat(bookmark_wgs84.location)

	//setDisplayPoint(bookmark_wgs84.location);
	//setDisplayZoom(bookmark_wgs84.zoom);

        gotoXY(coord, bookmark_wgs84.zoom);
    }

    const handleMove = (mapEvent) => {
        console.log("Map.onMoveEnd",view.getCenter());
/*
 	    setCenter(view.getCenter());
*/
        setRotation(view.getRotation())
        setZoom(Math.round(view.getZoom()));
        setResolution(view.getResolution().toFixed(2));
        mapEvent.stopPropagation();
    };

    // Show a list of bookmarks
    const keys = Object.keys(bookmarks);
    const bookmarkTitles = keys.map(k => [k, bookmarks[k].title]);

    // Test for issue #2, accept an external data source
    // Create an OpenLayers vector source, and add a
    // styled feature to it, and pass it into a source.Vector component
    const bigdot_style = new Style({
        geometry: new olCircle(astoria_wm, 500),
        fill: new Fill({color: 'rgba(0,255,0,0.7)'}),
        stroke: new Stroke({color:"green", width:1}),
        //text: new olText({text:"ASTORIA IS RIGHT HERE", font:"36px sans-serif"}),
        //zIndex: ???,
    })
    const point = new Point(astoria_wm);
    const pointFeature = new Feature(point);
    pointFeature.setStyle(bigdot_style);
    const myVectorSource = new VectorSource();
    myVectorSource.addFeatures([pointFeature]);

    const taxlotStyle = new Style({
        fill: new Fill({color:"rgba(128,0,0,0.1)"}),
        stroke: new Stroke({color:"rgba(0,0,0,1.0)", width:1}),
    })
    const selectedStyle = new Style({
        fill: new Fill({color:"rgba(255,40,40,0.8)"}),
        stroke: new Stroke({color:"rgba(255,0,0,1.0)", width:1.5}),
    })

    const [rows, setRows] = useState([]);
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
        console.log("selectEvent", e)
        setSelectCount(selectedFeatures.getLength());
        copyFeaturesToTable(selectedFeatures);
    }

    return (
        <>
        <MapProvider map={theMap}>
        <Container>
            <Row><Col>
                <h2>Example 5</h2>
                Thunderforest {tflayername} map <b>{thunderforestKey==="undefined"?"no API key!":""}</b><br />
                WFS GeoServer taxlots<br />
                Vector layer (display only, no external data source) (The big green dot.)<br />
                Demonstrates passing an OpenLayers Vector source object directly into the Layer component.

                <p>
                Demonstrates that I can keep the map center
                and zoom in component state and update the map using setState.
                </p>

                Interaction: Select <b>{selectCount>0?(selectCount + " selected"):""}</b> - select taxlots using click or ctl-drag
            </Col></Row>

            <Row><Col>
                {lats}, {lons} resolution: {resolution}
                <p>
                    Zoom
                    <button name="zoomin"  onClick={zoomClick}>+</button>
                    {zoom}
                    <button name="zoomout" onClick={zoomClick}>-</button>
                    Rotate
                    <button name="clockwise"     onClick={rotateClick}>+</button>
                    {rotation.toFixed(2)}
                    <button name="anticlockwise" onClick={rotateClick}>-</button>
                    Animate
                    <button name="animate" onClick={toggleAnimate}>{ animate? "on" : "off" }</button>
                </p>
                <Map onMoveEnd={handleMove}>
                    <CollectionProvider collection={mapLayers}>
                        <layer.Tile title="Thunderforest" displayInLayerSwitcher={false}>
                            <source.XYZ url={thunderforestUrl} apikey={thunderforestKey}/>
                        </layer.Tile>

                        <layer.Vector title="Taxlots" style={taxlotStyle} maxResolution={9}>
                            <source.JSON url={taxlotsUrl} loader="geojson"/>
                            <interaction.Select features={selectedFeatures} style={selectedStyle} condition={click} selected={onSelectEvent}/>
                            <interaction.SelectDragBox features={selectedFeatures} style={selectedStyle} condition={platformModifierKeyOnly} selected={onSelectEvent}/>
                        </layer.Vector>

                        {/*
                        <layer.Vector title="Custom taxlot source">
                            <source.Vector url={completeUrl} strategy={bbox}/>
                        </layer.Vector>
                        */}

                        <layer.Vector title="Custom vectors">
                            <source.Vector source={myVectorSource}/>
                        </layer.Vector>
                    </CollectionProvider>
                </Map>
                <control.LayerSwitcher show_progress={true} collapsed={false}/>
                <control.GeoBookmark/>
                </Col><Col>
                <ListGroup flush={true}>Click to recenter map
                { bookmarkTitles.map(item =>
                    <ListGroupItem tag="button" key={item[0]} name={item[0]}
                    onClick={gotoBookmark} className="geobookmark"
                    action>{item[0]} {item[1]}</ListGroupItem>
                )}
                </ListGroup>
                </Col></Row>
                <Row><Col>
                <BootstrapTable bootstrap4 condensed
                    keyField={taxlotsKey} columns={taxlotsColumns} data={rows} />
                </Col></Row>
        </Container>
        </MapProvider>
        </>
    );
}
export default Example5;
