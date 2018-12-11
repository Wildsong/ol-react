import React from 'react';
import PropTypes from 'prop-types';
import {Collection} from 'ol';
import {Vector} from 'ol/source';
import OLSourceComponent from './ol-source-component';
//?? import * as interaction from '../interaction';

class OLVector extends OLSourceComponent {
    _createSourceFromProps(props) {
        let vectorSource = new Vector(
            Object.assign({
                features: new Collection()
            }, props)
        );
        console.log("vectorSource = ", vectorSource);
        return vectorSource;
    }
}

OLVector.propTypes = {
}

OLVector.defaultProps = {
}

export default OLVector;
