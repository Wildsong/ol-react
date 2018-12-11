import React from 'react';
import PropTypes from 'prop-types';
import LayerContext from '../layer-context';
import OLComponent from '../ol-component';

class OLSourceComponent extends OLComponent {
    constructor(props) {
        super(props)
        this.source = this._createSourceFromProps(props)
        console.log("new source: props=",props," source=",this.source)
    }

    componentDidMount() {
        console.log("source: cdm layer=", LayerContext.layer)
        LayerContext.layer.setSource(this.source)
    }

    componentWillReceiveProps(newProps) {
        this.source = this._createSourceFromProps(newProps)
        console.log("source: cwrp layer=", LayerContext.layer)
        LayerContext.layer.setSource(this.source)
    }

    _createSourceFromProps(props) {
        throw new Error("_createSouceFromProps() must be overridden in subclasses")
    }
}

export default OLSourceComponent
