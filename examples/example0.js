import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Map, control, layer, source} from '../src'
import {Button} from 'reactstrap'
import {MapProvider} from '../src/map-context'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat} from 'ol/proj'
import {DEFAULT_CENTER, MINZOOM, wgs84} from '../src/constants'
import {defaultOverviewLayers as ovLayers} from '../src/map-layers'

const Example0 = () => {
    return (
        <>
        </>
    );
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
        loadTilesWhileAnimating:true, loadTilesWhileInteracting:true,
        //controls: [],
    }));
    const [zoom, setZoom] = useState(theMap.getView().getZoom());

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
        console.log("moveEnd",mapEvent.map.getView().getCenter());
        mapEvent.stopPropagation();
    };
    return (
    <>
        <h1>ol-react examples</h1>

        This is the simplest possible example of using ol-react to show a map.
        It is handy after big refactoring jobs to see if <em>anything</em> still works. :-)

        <h4>Tile source: OpenStreetMap</h4>
        <MapProvider map={theMap}>
            <Map onMoveEnd={handleMoveEnd}
                style={{backgroundColor:"black",width:460,height:265,position:'relative',left:15,top:5}}>

                <layer.Tile title="OpenStreetMap" opacity={1}> <source.OSM/> </layer.Tile>
            </Map>
            <Button onClick={incZoom}>+</Button>{zoom}
            <Button onClick={decZoom}>-</Button>
            <control.OverviewMap layers={ovLayers}/>
            <control.MousePosition projection={wgs84}/>
        </MapProvider>
    </>
    );
}
export default Example0;
