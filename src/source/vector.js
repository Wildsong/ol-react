import React from 'react'
import PropTypes from 'prop-types'
import {Collection} from 'ol';
import {Vector} from 'ol/source'
import OLSource from './ol-source'
//?? import * as interaction from '../interaction'

class OLVector extends OLSource {
    _createSourceFromProps(props) {
        let vectorSource = new Vector(
            Object.assign({
                features: new Collection()
            }, props)
        );
//        console.log("vectorSource = ", vectorSource);
        return vectorSource;
    }
}

OLVector.propTypes = {
}

OLVector.defaultProps = {
}

export default OLVector
