import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import Source from 'ol/source/Source';
import BaseLayer from 'ol/layer/Base';
import OLComponent from '../ol-component';

class OLSourceComponent extends OLComponent {
    constructor(props) {
        super(props)
        this.source = this._createSourceFromProps(props)
    }

    componentDidMount() {
        this.context.layer.setSource(this.source)
    }

    componentWillReceiveProps(newProps) {
        this.source = this._createSourceFromProps(newProps)
        this.context.layer.setSource(this.source)
    }

    _createSourceFromProps(props) {
        throw new Error("_createSouceFromProps() must be overridden in subclasses")
    }
}

OLSourceComponent.contextTypes = {
    layer: PropTypes.instanceOf(BaseLayer),
    map: PropTypes.instanceOf(Map)
}

OLSourceComponent.childContextTypes = {
    source: PropTypes.instanceOf(Source)
}

export default OLSourceComponent
