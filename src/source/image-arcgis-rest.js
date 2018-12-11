import React from 'react';
import PropTypes from 'prop-types';
import {ImageArcGISRest} from 'ol/source';
import OLSourceComponent from './ol-source-component'
//???? import * as interaction from '../interaction'

class OLImageArcGISRest extends OLSourceComponent {
    _createSourceFromProps(props) {
        return new ImageArcGISRest(Object.assign({}, props))
    }
}

OLImageArcGISRest.propTypes = {
  ratio: PropTypes.number,
  url: PropTypes.string.isRequired
}

OLImageArcGISRest.defaultProps = {
  ratio: 1
}

export default OLImageArcGISRest;
