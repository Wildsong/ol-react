// index.js ol-react
//
import React from 'react';
import { render } from 'react-dom';
import {Map} from './src';

const App = () => (
    <div>
    <p>here's my declarative map app</p>

    <Map view=<View resolution={10000} center={[0, 0]}/>>
      <layer.Tile>
        <source.OSM />
      </layer.Tile>
      <layer.Vector>
        <source.Vector>
          <Feature style={{stroke: {color: [255, 0, 0, 1]}}}>
            <geom.LineString>
              {[[0, 0], [100000, 0], [100000, 100000], [0, 100000]]}
            </geom.LineString>
          </Feature>
        </source.Vector>
      </layer.Vector>
    </Map>

    </div>
);

render(
    <App />, document.getElementById("app")
);

console.log('index.js loaded');
