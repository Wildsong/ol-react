import React from 'react';
import PropTypes from 'prop-types';
import {Map, Collection} from 'ol';
import {Source, Vector} from 'ol/source';
import BaseLayer from 'ol/layer/Base';
import OLSourceComponent from './ol-source-component';
//?? import * as interaction from '../interaction';

class OLVector extends OLSourceComponent {
    constructor(props) {
        super(props);
    }

    _createSourceFromProps(props) {
        return new Vector(
            Object.assign({
                features: new Collection()
            }, props)
        );
    }

    getChildContext() {
        return {
            source: this.source
        }
    }

    componentDidMount() {
        this.context.layer.setSource(this.source)
    }

    componentWillUnmount () {
    }
}

OLVector.propTypes = {
}

OLVector.defaultProps = {
}

export default OLVector;
