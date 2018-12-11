import React from 'react';
import PropTypes from 'prop-types';
import {OSM} from 'ol/source';
import BaseLayer from 'ol/layer/Base';
import OLSourceComponent from './ol-source-component';

class OLOSM extends OLSourceComponent {
    _createSourceFromProps(props) {
        return new OSM(Object.assign({}, props));
    }
}

OLOSM.propTypes = {
}

export default OLOSM;
