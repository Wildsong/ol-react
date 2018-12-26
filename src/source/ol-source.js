import React from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {SourceContext} from '../source-context'
import OLComponent from '../ol-component'

class OLSource extends OLComponent {
    constructor(props) {
        super(props)
//        console.log("OLSource.new(): props=",props, " source=",this.state.source)
    }

    componentDidMount() {
        //console.log("OLSource.componentDidMount() context=", this.context);
        // Set the source on the parent Layer object
        this.context.layer.setSource(this.state.source);
    }

    componentDidUpdate(prevProps) {
//        console.log("OLSource.componentDidUpdate() prevProps", prevProps, " context=", this.context)
        //this.state.source = this._createSourceFromProps(newProps)
        if (this.props.opacity != prevProps.opacity) {
            console.log("Opacity", prevProps.opacity, " =>", this.props.opacity)
            this.context.layer.setOpacity(this.props.opacity)
        }
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
