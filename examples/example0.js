import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Map, control, layer, source} from '../src'
import {Container, Row, Col, Button} from 'reactstrap'
import {MapProvider} from '../src/map-context'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat} from 'ol/proj'
import {defaultOverviewLayers as ovLayers} from '../src/map-layers'
import {OpenLayersVersion} from '../src'

import {astoria_wm, DEFAULT_CENTER, MINZOOM} from './constants'
import {wgs84} from '../src/constants'

const Example0 = () => {
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
        //controls: [],
    }));
    const [center, setCenter] = useState(astoria_wm);
    const [zoom, setZoom] = useState(MINZOOM);

    const updateZoom = (step=0) => {
        const view = theMap.getView();
        const newzoom = view.getZoom() + step
        if (newzoom !== zoom) {
            console.log("Zooming from", zoom, " to", newzoom);
            setZoom(newzoom);
            view.setZoom(newzoom);
        }
    }
    const decZoom = (e) => { updateZoom(-1); }
    const incZoom = (e) => { updateZoom(1); }

    const handleMoveEnd = (mapEvent) => {
        const view = mapEvent.map.getView()
        setCenter(view.getCenter());
        setZoom(view.getZoom());
        console.log("moveEnd", center, zoom)
        mapEvent.stopPropagation();
    };
    return (
    <>
        <h1>ol-react examples</h1>
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
            <Row><Col>
                    <Map onMoveEnd={handleMoveEnd} center={center} zoom={zoom} animate={true}
                        style={{backgroundColor:"black",width:460,height:265,position:'relative',left:15,top:5}}>

                        <layer.Tile title="OpenStreetMap" opacity={1}> <source.OSM/> </layer.Tile>
                        <control.MousePosition projection={wgs84}/>
                    </Map>
                    <Button onClick={incZoom}>+</Button>{zoom}
                    <Button onClick={decZoom}>-</Button>
            </Col><Col>
                <control.OverviewMap layers={ovLayers} collapsible={false} collapsed={false}/>
            </Col></Row>
        </Container>
        </MapProvider>
    </>
    );
}
export default Example0;
