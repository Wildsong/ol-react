import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Map, OverviewMap} from '../src'
import {Button} from 'reactstrap'

import {Map as olMap, View as olView} from 'ol'
import {toLonLat, fromLonLat} from 'ol/proj'
import { DEFAULT_CENTER,MINZOOM } from '../src/constants'
import {defaultMapLayers as mapLayers, defaultOverviewLayers as ovLayers} from '../src/map-layers'
import {defaultControls as olControls, defaultInteractions as olInteractions} from '../src/map-widgets'

// A new instance of 'map' loads each time we come to this page.
// If I want to persist any state in the map it has to be done
// outside the component, either in redux or in some parent component.
// I wonder if I should persist the entire olMap or just its properties.
const mymap = new olMap({
    view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
    layers: mapLayers,
    controls: olControls, interactions: olInteractions,
    loadTilesWhileAnimating:true,loadTilesWhileInteracting:true,
})

const Example0 = () => {
    const [theMap, setTheMap] = useState(mymap);
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
    theMap.on('moveend', (e)=>{
            console.log("moveEnd",e);
            updateZoom();
        }
    );
    return (
    <>
        <h1>ol-react examples</h1>

        This is the simplest possible example of using ol-react to show a map.
        It is handy after big refactoring jobs to see if <em>anything</em> still works. :-)

        <h4>Tile source: OpenStreetMap</h4>
        <Map map={theMap} style={{backgroundColor:"black",width:460,height:265,position:'relative',left:15,top:5}} useDefaultControls={ true }/>
        <Button onClick={incZoom}>+</Button>{zoom}
        <Button onClick={decZoom}>-</Button>
        <OverviewMap map={theMap} layers={ovLayers}/>
    </>
    );
}
export default Example0;
