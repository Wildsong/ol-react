import React, {useState, useEffect} from 'react'
import {MapProvider} from '../src/map-context'
import {ATTRIBUTION as osmAttribution} from 'ol/source/OSM'
import {transform} from 'ol/proj'

import {Map, View, Feature, control, geom, interaction, layer, VERSION} from '../build/@map46/ol-react'
import Select from 'react-select'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'

const wgs84 = "EPSG:4326";
const wm = "EPSG:3857";
const astoria_wm = transform([-123.834,46.187], wgs84,wm)

let transformfn = (coordinates) => {
    for (let i = 0; i < coordinates.length; i+=2) {
        coordinates[i]   += astoria_wm[0];
        coordinates[i+1] += astoria_wm[1];
    }
    return coordinates
}

let attributions = [
    osmAttribution,
];

// This controls what kind of features we are drawing.
const typeSelect = [
    { index: 0,  label: "Point" },
    { index: 1,  label: "LineString" },
    { index: 2,  label: "Polygon" },
    { index: 3,  label: "Circle" },
];

const Example1 = () => {
    const [theMap, setTheMap] = useState(new olMap({
        view: new olView({ center: fromLonLat(DEFAULT_CENTER), zoom: MINZOOM}),
    }));
    const [center, setCenter] = useState(astoria_wm);
    const [zoom, setZoom] = useState(10);
    const [enableModify, setEnableModify] = useState(true); // can't change this in the app yet
    const [typeIndex, setTypeIndex] = useState(0); // index into typeSelect

    const changeType = (o) => {
        console.log("example1.changeType from", typeIndex, " to", o.index);
        setTypeIndex(o.index);
    }

    const textMarker = new Style({
        text: new Text({ text: 'Hee' })
    });
    const drawStyle = new Style({
        text: new Text({text: markerId.toString(),  offsetY: -10}),
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
    const pointStyle = new Style({
        image: new Circle({
            radius: 5,
            fill: new Fill({color: 'rgba(100,100,100, 0.75)'}),
            stroke: new Stroke({color: 'green', width: 5}),
        })
    });
    const multipointStyle = new Style({
        image: new Circle({
            radius: 10,
            fill: new Fill({color: 'rgba(0,0,255, 0.8)'}),
            stroke: new Stroke({color: 'red', width: 3})
        })
    })
    const lineStyle = new Style({
        stroke: new Stroke({color: 'rgba(255, 255, 0, 1)', width: 3})
    });
    const polyStyle = new Style({
        stroke: new Stroke({color: 'rgba(0, 0, 0, 1)', width: 4}),
        fill: new Fill({color: 'rgba(255, 0, 0, .250)'}),
    });

    return (
        <>
            <h2> version { VERSION }</h2>

            This is a minimal test of the ol-react package.
            <MapProvider map={theMap}>
            <Map zoom={zoom} center={center}>
            {/*

                <layer.Tile opacity={this.state.opacityOSM/100}>
                    <source.OSM attributions={attributions}/>
                </layer.Tile>

                <layer.Vector style={ pointMarker } opacity={ this.state.opacityVector/100 }>
                    <source.Vector>

                    <Feature id="test-line" style={ lineStyle }>
                        <geom.LineString transform={transformfn} modify={enableModify} layout="XY">
                            { [[6000,6000], [-6000, 6000], [-6000, 6000], [-6000, -6000], [6000,-6000]] }
                        </geom.LineString>
                    </Feature>

                    <Feature id="test-circle" style={pointStyle}>
                        <geom.Circle modify={enableModify}>{[astoria_wm, 100]}</geom.Circle>
                    </Feature>

                    <Feature id="test-circle-zeroradius" style={polyStyle}>
                        <geom.Circle transform={ transformfn } modify={enableModify} >{[6000,0]}</geom.Circle>
                    </Feature>

                    <Feature id="test-polygon" style={polyStyle}>
                        <geom.Polygon transform={transformfn} modify={enableModify } insertVertexCondition={ ()=>{return true;} }>
                            {[
                                [[-3500, -2000], [3500, -2000], [0, 4000], [-3500, -2000]],
                                [[0, -1000], [1000, 1000], [-1000, 1000], [0, -1000]],
                            ]}
                        </geom.Polygon>
                    </Feature>

                    <Feature id="test-point" style={pointStyle}>
                        <geom.Point transform={transformfn} modify={enableModify}>
                            {[1835, -910]}
                        </geom.Point>
                    </Feature>

                    <Feature id="test-multipoint" style={multipointStyle}>
                        <geom.MultiPoint transform={transformfn} modify={enableModify}>
                            { [[-6000, -4000], [6000, -3000], [0, 6400]] }
                        </geom.MultiPoint>
                    </Feature>
                    </source.Vector>

                    <interaction.Draw type={ typeSelect[typeIndex].label } />

                </layer.Vector>

                <control.FullScreen/>
                <control.LayerSwitcher/>
                */}
            </Map>
            </MapProvider>
            Select vector type to draw
            <Select className="select" defaultValue={ typeSelect[0] }
                options={typeSelect} onChange={changeType}
            />
        </>
    );
}
export default Example1;
