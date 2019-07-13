import React from 'react'
import PropTypes from 'prop-types'
import {Source as olSource} from 'ol'
import {OSM as olOSM} from 'ol/source'

const OSM = (props) => {
    console.log("OSM", props);
    const source = new olOSM();
    context.layer.addSource(source)
    return (
        <>
        </>
    );
}
//OSM.propTypes = {
//};
OSM.contextTypes = {
    layer: PropTypes.instanceOf(olSource).isRequired,
}
export default OSM;
