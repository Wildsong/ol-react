import React from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import OLComponent from '../ol-component'

class OLSource extends OLComponent {
    constructor(props) {
        super(props)
        this.state = {
            source: this._createSourceFromProps(props)
        }
//        console.log("OLSource.new(): props=",props, " source=",this.state.source)
    }

    componentDidMount() {
        console.log("OLSource.componentDidMount() context=", this.context);
        this.context.onSetSource(this.state.source);
    }

    componentWillReceiveProps(newProps) {
        console.log("OLSource.componentWillReceiveProps() newprops", newProps)
        this.source = this._createSourceFromProps(newProps)
        //LayerContext.source = this.source
        //LayerContext.layer.setSource(this.source)
    }

    _createSourceFromProps(props) {
        throw new Error("OLSource._createSouceFromProps() must be overridden in subclasses")
    }

    render() {
//        console.log("OLSource.render() props", this.props, " context=", this.context)
        return (
            <div>
            {this.props.children}
            </div>
        );
    }
}
OLSource.contextType = LayerContext;

export default OLSource
