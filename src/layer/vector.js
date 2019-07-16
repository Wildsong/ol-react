import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Style as olStyle} from 'ol/style'
import {Vector as olVectorLayer} from 'ol/layer'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'
import {buildStyle} from '../style'

const Vector = (props) => {
    const map = useContext(MapContext);
    const olstyle = buildStyle(props.style)
    console.log("layer.Vector", olstyle);
    const layer = new olVectorLayer({
        style: olstyle,
    })
    map.addLayer(layer);
    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
/*
Vector.propTypes = {
//    source: PropTypes.object, // directly pass in an Openlayers object OR use a child
    style:  PropTypes.oneOfType([
        PropTypes.instanceOf(olStyle),
        PropTypes.object,
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.instanceOf(olStyle),
            PropTypes.object
        ]))
    ]),
    editStyle:  PropTypes.oneOfType([
        PropTypes.instanceOf(olStyle),
        PropTypes.object,
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.instanceOf(olStyle),
            PropTypes.object
        ]))
    ]),

    declutter: PropTypes.bool,
    cluster: PropTypes.bool,
    updateWhileAnimating: PropTypes.bool,
    updateWhileInteracting: PropTypes.bool,
};
*/
export default Vector;
