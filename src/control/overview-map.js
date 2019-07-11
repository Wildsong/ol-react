import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Map, View, Collection} from 'ol'
import {Layer, Tile} from 'ol/layer'
import {OSM, Stamen} from 'ol/source'
import OLControl from './ol-control'

// Two options for the actual control: OpenLayers or ol-ext.
import {OverviewMap as Overview} from 'ol/control'
// ol-ext control is not working for me 2019-06-28
//import Overview from 'ol-ext/control/Overview'

class OLOverviewMap extends OLControl {
    static propTypes = {
        ...OLControl.propTypes,
    	className: PropTypes.string,
    	collapsed: PropTypes.bool,
    	collapseLabel: PropTypes.string,
    	collapsible: PropTypes.bool,
    	label: PropTypes.node,
    	layers: PropTypes.oneOfType([
    	    PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
    	    PropTypes.instanceOf(Collection)
    	]),
    	tipLabel: PropTypes.string,
    	view: PropTypes.instanceOf(View)
    }
    static defaultProps = {
        collapsed: false,
        collapsible: false,
    }

    constructor(props) {
        super(props);
        this.overview = new Overview({
            //className: props.className,
            collapsed: false, //this.props.collapsed,
            //collapseLabel: this.props.collapseLabel,
            collapsible: false, //this.props.collapsible,
            //label: this.props.label,
            layers: [
                new Tile({
                    //source: new OSM()
                    source: new Stamen({layer: "toner"})
                }),
            ],
            //tipLabel: this.props.tipLabel,
            //view: this.props.view,
            // defaults
            //minZoom: 0, maxZoom: 18, rotation: 0,
            //projection: wm,
            //style:
            //align: 'right',
            //panAnimation: "elastic"
        })
        this.setOverviewTarget = element => {
            console.log("setOverviewTarget");
            this.overview.setTarget(element)
            this.props.map.addControl(this.overview);
        }
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        console.log("update. Am i collapsed? ", this.props.collapsed);
        this.overviewmap.setCollapsed(this.props.collapsed);
    }

    render() {
        console.log("overviewmap render");
        return (
            <div ref={this.setOverviewTarget} style={{position:"relative",top:0,width:200,height:200}}></div>
        )
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLOverviewMap);
