import React from 'react'
import PropTypes from 'prop-types'
import { Vector as olVector } from 'ol/source'

const Vector = (props) => {
    source = new olVector({
        strategy: bboxStrategy,
        url: props.url // I need to test this
    })
    return null;
}
Vector.propTypes = {
    ...OLLayer.propTypes,
    source: PropTypes.oneOfType([
        PropTypes.object, // An OpenLayers ol/source object
        PropTypes.string, // WMS | ArcGISRest
    ]), // Not required, because a vector layer can be used to display internal shapes
    cluster: PropTypes.bool,
    updateWhileAnimating: PropTypes.bool,
    updateWhileInteracting: PropTypes.bool,
    loader: PropTypes.func,
    addfeature: PropTypes.func,
    url: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),
    style:  PropTypes.oneOfType([
        PropTypes.instanceOf(Style),
        PropTypes.object,
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.instanceOf(Style),
            PropTypes.object
        ]
    ))
]),
editStyle:  PropTypes.oneOfType([
    PropTypes.instanceOf(Style),
    PropTypes.object,
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.instanceOf(Style),
        PropTypes.object
    ]
))
])
this.dictSource.push('source');   // { esrijson|geojson|topojson }
this.dictSource.push('distance'); // for cluster
//this.dictSource.push('features');
this.dictSource.push('addfeature');

};
export default connect(mapStateToProps)(OLVector);
