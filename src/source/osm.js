import React from 'react';
import PropTypes from 'prop-types';
import {Source, OSM} from 'ol/source';
import BaseLayer from 'ol/layer/Base';
import OLSourceComponent from './ol-source-component';

class OLOSM extends OLSourceComponent {
    constructor(props) {
        super(props);
    }

    _createSourceFromProps(props) {
        return new OSM(Object.assign({}, props));
    }

    getChildContext() {
      return {
        source: this.source
      }
    }
}

OLOSM.propTypes = {
}

export default OLOSM;
