import React from 'react';
import PropTypes from 'prop-types';
import {OSM} from 'ol/source';
import BaseLayer from 'ol/layer/Base';
import OLSource from './ol-source';

class OLOSM extends OLSource {
    constructor(props) {
        super(props);
        this.state = { source: new OSM(this.props) };
    }
}

OLOSM.propTypes = {
}

export default OLOSM;
