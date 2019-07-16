import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { Vector as VectorLayer } from 'ol/layer'
import { Cluster as ClusterSource, Vector as VectorSource } from 'ol/source'
import { Style } from 'ol/style'
import OLLayer from './ol-layer'
import { createXYZ } from 'ol/tilegrid'
import { tile as tileStrategy, bbox as bboxStrategy } from 'ol/loadingstrategy'
//import { Collection} from 'ol'
import { DataLoader } from './dataloaders'
import { buildStyle } from '../style'

class OLVector extends OLLayer {
    static propTypes = {
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
    };
    static defaultProps = {
        visible: true,
        cluster: false
    }

    constructor(props) {
        super(props);

        this.dictLayer.push('declutter');
        this.dictLayer.push('updateWhileAnimating');
        this.dictLayer.push('updateWhileInteracting');

        this.dictSource.push('source');   // { esrijson|geojson|topojson }
        this.dictSource.push('distance'); // for cluster
        //this.dictSource.push('features');
        this.dictSource.push('addfeature');

        let layerProps  = this.buildProps(this.dictLayer);
        let sourceProps = this.buildProps(this.dictSource);

        let style = buildStyle(this.props.style);

        // Allow passing in an openlayers source directly here
        let vectorSource;
        if (typeof this.props.source === 'object') {
            vectorSource = this.props.source
        } else {
            switch (this.props.source) {
                case 'geojson':
                case 'esrijson':
                    //console.log("JSON source =", this.props.source, this.props.url);
                    vectorSource = new VectorSource({ strategy: bboxStrategy });
                    vectorSource.setLoader(
                        DataLoader(this.props.source, this.props.url, vectorSource)
                    );
                    break;

                case 'pbf':
                    console.log('PBF url = ', this.props.url);
                    vectorSource = new VectorSource({
                        strategy: tileStrategy( createXYZ({ tileSize: 512 })),
                    });
                    vectorSource.setLoader(
                        DataLoader(this.props.source, this.props.url, vectorSource)
                    );
                    break;

                default:
                    console.log("Other vector source =", this.props.source, this.props.url);
                    // A Vector layer can just draw a collection of graphics (example1)
                    // in which case it does not need any source prop or any DataLoader
                    // If url prop is set, it will use the default XHR loader
                    vectorSource = new VectorSource(
                        Object.assign({
                            strategy: bboxStrategy,
                            url: this.props.url // I need to test this
                        }, sourceProps)
                    )
                    break;
            }

            //  This is used for a DRAW Interaction, see example1
            if (typeof this.props.addfeature !== 'undefined') {
                vectorSource.addEventListener("addfeature",
                (e) => {
                    console.log("Vector.addfeature", e);
                    this.props.addfeature(e);
                });
            }
        }
        let layerSource = vectorSource;

        // Tested in example 3 with drag and drop of GPX files
        if (this.props.cluster) {
            layerSource = new ClusterSource({
                source: vectorSource,
                distance: this.props.distance
            })
        }

        this.layer = new VectorLayer({
            ...layerProps,
            style: style,
            updateWhileAnimating: props.updateWhileAnimating,
            updateWhileInteracting: props.updateWhileInteracting,
            source: layerSource
        })
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLVector);
