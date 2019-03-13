import React from 'react'
import PropTypes from 'prop-types'
import { MapContext } from './map-context'
import Graticule from 'ol/Graticule'
import { Stroke } from 'ol/style'
import OLComponent from './ol-component'

export default class OLGraticule extends OLComponent {
    static contextType = MapContext;

    static propTypes = {
        maxLines: PropTypes.number,
        stroke: PropTypes.string,
        targetSize: PropTypes.number,
        showLabels: PropTypes.bool,
        lonLabelPosition: PropTypes.number,
        latLabelPosition: PropTypes.number,
        intervals: PropTypes.arrayOf(PropTypes.number)
    }
    static defaultProps = {
    	maxLines: 100,
        stroke: 'rgba(0,0,0,2)',
        targetSize: 100,
        showLabels: false,
        lonLabelPosition: 0.0,
        latLabelPosition: 1.0,
    }

    constructor(props) {
        super(props);
        let options = Object.assign(
            {
                strokeStyle: new Stroke({
                    color: this.props.stroke,
                    width:2,
                    lineDash: [0.5,4]
                })
            },
            this.props);
        console.log("cdm ", options)
        this.graticule = new Graticule(options);
    }

    componentDidMount() {
        this.graticule.setMap(this.context.map);
    }

    /*

    componentDidUpdate(prevProps) {
    }

    render() {
        return (
            <>
            </>
        )
    }
    */
}
