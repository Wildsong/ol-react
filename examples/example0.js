import React, {useState, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import {Map, control, layer, source} from '../src' // eslint-disable-line no-unused-vars
import {Button} from 'reactstrap' // eslint-disable-line no-unused-vars
import {MapProvider} from '../src/map-context' // eslint-disable-line no-unused-vars
import {CollectionProvider} from '../src/collection-context' // eslint-disable-line no-unused-vars

import {Map as olMap, View as olView, Collection} from 'ol'
import {fromLonLat} from 'ol/proj'
import {defaultOverviewLayers as ovLayers} from '../src/map-layers'
import {OpenLayersVersion} from '../src' // eslint-disable-line no-unused-vars

import {DEFAULT_CENTER, MINZOOM} from './constants'
import {wgs84} from '../src/constants'

const Example0 = () => {
    const [mapLayers] = useState(new Collection());
    const [theMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
        //controls: [],
        layers: mapLayers,
    }));
    const [zoom, setZoom] = useState(theMap.getView().getZoom());
    const updateZoom = (step=0) => {
        const view = theMap.getView();
        const newZoom = view.getZoom() + step
        setZoom(newZoom)
        view.setZoom(newZoom);
    }
    const decZoom = () => {updateZoom(-1);}
    const incZoom = () => {updateZoom(1);}
    const onMove = () => {
        const newZoom = theMap.getView().getZoom();
        if (newZoom !== zoom) {
            setZoom(Math.round(newZoom));
        }
    }
    return (
    <>
        <h2>Simple map</h2>
        <MapProvider map={theMap}>

            <em>OpenLayers version <OpenLayersVersion/></em>
            <p>
                Simple example using ol-react to show a map.
                It is handy after big refactoring jobs to see if <em>anything</em> still works. :-)
            </p>
            <p>Tile source: OpenStreetMap</p>

            <div className="mappage">
                <div className="mapitem">
                    <Map onMoveEnd={onMove} style={{backgroundColor:"black",width:460,height:265,position:'relative',left:15,top:5}}>
                        <CollectionProvider collection={mapLayers}>
                            <layer.Tile title="OpenStreetMap" opacity={1}> <source.OSM/> </layer.Tile>
                        </CollectionProvider>
                    </Map>
                </div>
                <div className="mapitem">
                    <Button className="zoom" onClick={incZoom}>+</Button>
                    <Button className="zoom">{zoom}</Button>
                    <Button className="zoom" onClick={decZoom}>-</Button>

                    <control.OverviewMap layers={ovLayers} collapsible={false} collapsed={false}/>
                    <control.MousePosition projection={wgs84}/>
                </div>
            </div>
        </MapProvider>
    </>
    );
}
export default Example0;
