import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {Map, layer} from '../src'

const Example0 =({ title }) => (
    <>
        <h1>{ title }</h1>

        This is the simplest possible example of using ol-react to show a map.
        It is handy after big refactoring jobs to see if <em>anything</em> still works. :-)

        <h4>Tile source: OpenStreetMap</h4>

        <Map style={{backgroundColor:"black",width:460,height:265,position:'relative',left:15,top:5}} useDefaultControls={ true }>
            <layer.Tile source="OSM" title="OpenStreetMap" />
        </Map>
    </>
);
Example0.propTypes = {
    title: PropTypes.string
};
export default Example0;
