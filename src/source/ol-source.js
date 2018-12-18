import React from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {SourceContext} from '../source-context'
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
        // Issue a callback to set the source on the parent Layer object
        this.context.onSetSource(this.state.source);
    }

    componentWillReceiveProps(newProps) {
        console.log("OLSource.componentWillReceiveProps() newprops", newProps)
        this.state.source = this._createSourceFromProps(newProps)
    }

    _createSourceFromProps(props) {
        throw new Error("OLSource._createSouceFromProps() must be overridden in subclasses")
    }

    render() {
        console.log("OLSource.render() props", this.props)
// Pass the source down to our child geometry object they can add themselves to this Feature
        return (
            <div>
            <SourceContext.Provider value={this.state.source}>
            {this.props.children}
            </SourceContext.Provider>
            </div>
        );
    }
}
OLSource.contextType = LayerContext;

export default OLSource
