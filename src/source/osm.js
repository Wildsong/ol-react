import React from 'react';
import PropTypes from 'prop-types';
import {OSM} from 'ol/source';
import BaseLayer from 'ol/layer/Base';
import OLSource from './ol-source';

class OLOSM extends OLSource {
    _createSourceFromProps(props) {
        return new OSM(Object.assign({}, props));
    }
}

OLOSM.propTypes = {
}

export default OLOSM;
