import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { ATTRIBUTION as osmAttribution } from 'ol/source/OSM'
import SliderControl from './slider-control'
import {Map, Feature, geom} from '../src'
import Select from 'react-select'
import {buildStyle} from '../src/style'
import {setMapCenter} from '../src/actions'

const OpacitySlider = () => {
    const [opacity, setOpacity] = useState();
    return (
        <>
        <SliderControl title="OSM" onChange={setOpacity} value={opacity} />
        </>
    );
}
