import React, {useState, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import {Map, control, layer, source} from '../src' // eslint-disable-line no-unused-vars
import {Container, Row, Col, Button} from 'reactstrap' // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars

import {Map as olMap, View as olView} from 'ol'
import {fromLonLat} from 'ol/proj'
import {defaultOverviewLayers as ovLayers} from '../src/map-layers'
import {OpenLayersVersion} from '../src' // eslint-disable-line no-unused-vars

import {DEFAULT_CENTER, MINZOOM} from './constants'
import {wgs84} from '../src/constants'

const Example0 = () => {
    const [theMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
        //controls: [],
    }));
    const [zoom, setZoom] = useState(theMap.getView().getZoom());
    const updateZoom = (step=0) => {
        const view = theMap.getView();
        const newZoom = view.getZoom() + step
        setZoom(newZoom)
        view.setZoom(newZoom);
    }
    const decZoom = () => { updateZoom(-1); }
    const incZoom = () => { updateZoom(1); }
    const onMove = () => {
        const newZoom = theMap.getView().getZoom();
        if (newZoom !== zoom) {
            setZoom(newZoom);
        }
    }
    return (
    <>
        <h2>ol-react examples</h2>
        <MapProvider map={theMap}>
        <Container>
            <Row><Col>
            <em>Currently using OpenLayers version <OpenLayersVersion/></em>
            <p>
            This is the simplest possible example of using ol-react to show a map.
            It is handy after big refactoring jobs to see if <em>anything</em> still works. :-)
            </p>
            <p>Tile source: OpenStreetMap</p>
            </Col></Row>
            <Row><Col sm="9">
                    <Map onMoveEnd={onMove} style={{backgroundColor:"black",width:460,height:265,position:'relative',left:15,top:5}}>
                        <layer.Tile title="OpenStreetMap" opacity={1}> <source.OSM/> </layer.Tile>
                        <control.MousePosition projection={wgs84}/>
                    </Map>
                    <Button onClick={incZoom}>+</Button>{zoom}
                    <Button onClick={decZoom}>-</Button>
            </Col><Col sm="3">
                <control.OverviewMap layers={ovLayers} collapsible={false} collapsed={false}/>
            </Col></Row>
        </Container>
        </MapProvider>
    </>
    );
}
export default Example0;
