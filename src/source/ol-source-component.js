import React from 'react';
import PropTypes from 'prop-types';
import OLComponent from '../ol-component';

class OLSourceComponent extends OLComponent {
    constructor(props) {
        super(props)
        this.source = this._createSourceFromProps(props)
        console.log("new OLSource: props=",props," source=",this.source)
    }

    componentDidMount() {
    }

    componentWillReceiveProps(newProps) {
        this.source = this._createSourceFromProps(newProps)
        //LayerContext.source = this.source
        //LayerContext.layer.setSource(this.source)
    }

    _createSourceFromProps(props) {
        throw new Error("_createSouceFromProps() must be overridden in subclasses")
    }

    render() {
        console.log("OLSource props", this.props)
        return '<div></div>';
    }
}

export default OLSourceComponent
