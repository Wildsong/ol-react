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
        // Set the source on the parent Layer object
        this.context.layer.setSource(this.state.source);
    }

    componentWillReceiveProps(newProps) {
        console.log("OLSource.componentWillReceiveProps() newprops", newProps)
        this.state.source = this._createSourceFromProps(newProps)
    }

    _createSourceFromProps(props) {
        throw new Error("OLSource._createSouceFromProps() must be overridden in subclasses")
    }

    render() {
        //console.log("OLSource.render() props", this.props)
        return (
            <div>
            <SourceContext.Provider value={{
                source: this.state.source,
                map: this.context.map
            }}>
            {this.props.children}
            </SourceContext.Provider>
            </div>
        );
    }
}
OLSource.contextType = LayerContext;

export default OLSource
