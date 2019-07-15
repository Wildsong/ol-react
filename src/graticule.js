import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Map, Graticule as olGraticule} from 'ol'
import {Stroke} from 'ol/style'
import OLComponent from './ol-component'
import {MapProvider} from '../src/map-context'

const Graticule = (props) => {
    const control = new olGraticule(props);
    return null;
}

Graticule.propTypes = {
    maxLines: PropTypes.number,
    stroke: PropTypes.string,
    targetSize: PropTypes.number,
    showLabels: PropTypes.bool,
    lonLabelFormatter: PropTypes.func,
    latLabelFormatter: PropTypes.func,
    lonLabelPosition: PropTypes.number,
    latLabelPosition: PropTypes.number,
    intervals: PropTypes.arrayOf(PropTypes.number)
}
export default Graticule;
