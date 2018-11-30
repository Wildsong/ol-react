// index.js ol-react
//
import React from 'react';
import { render } from 'react-dom';
import {Map, View, layer, source, Feature, geom} from './src';
import apiKeys from './apikeys';

const App = () => (
    <div>
    <h2>Source tests</h2>
    <h3>OpenStreetMap</h3>
    *Also tests Vector source by drawing a red box around Null Island
    <Map view=<View resolution={10000} center={[0, 0]}/>>
        <layer.Tile>
            <source.OSM />
        </layer.Tile>
        <layer.Vector>
            <source.Vector>
                <Feature style={{stroke: {color: [255, 0, 0, 1]}}}>
    {/*            <geom.LineString>
                  {[[0, 0], [100000, 0], [100000, 100000], [0, 100000], [0, 0]]}
                </geom.LineString>*/}
                </Feature>
            </source.Vector>
        </layer.Vector>
    </Map>

    <h3>ArcGIS image source</h3>
    <Map view=<View resolution={10000} center={[0, 0]}/>>
        <layer.Tile>
            <source.ImageArcGISRest />
        </layer.Tile>
    </Map>

    <h3>BingMaps</h3>
    <Map view=<View resolution={10000} center={[0, 0]}/>>
        <layer.Tile>
            <source.BingMaps apiKey={apiKeys['BingMaps']} />
        </layer.Tile>
    </Map>

    </div>
);

render(
    <App />, document.getElementById("app")
);
