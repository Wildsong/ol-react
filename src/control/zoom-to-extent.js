import React from 'react';
import PropTypes from 'prop-types';
import OLPropTypes from '../ol-proptypes'
import {ZoomToExtent} from 'ol/control';
import OLControl from './ol-control';

class OLZoomToExtent extends OLControl {
    createControl (props) {
        return new ZoomToExtent({
            className: props.className,
            extent: props.extent,
            label: props.label,
            tipLabel: props.tipLabel
        })
    }
}

OLZoomToExtent.propTypes = Object.assign({}, OLControl.propTypes, {
    className: PropTypes.string,
    extent: OLPropTypes.Extent,
    label: PropTypes.node,
    tipLabel: PropTypes.string
})

export default OLZoomToExtent
