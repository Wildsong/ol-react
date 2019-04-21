import React from 'react'
import PropTypes from 'prop-types'
import { Vector as VectorLayer } from 'ol/layer'
import { Cluster as ClusterSource, Vector as VectorSource } from 'ol/source'
import { Style } from 'ol/style'
import OLLayer from './ol-layer'
import { createXYZ } from 'ol/tilegrid'
import { tile as tileStrategy, bbox as bboxStrategy } from 'ol/loadingstrategy'
//import { Collection} from 'ol'
import { DataLoader } from './dataloaders'
import { buildStyle } from '../style'

export default class OLVector extends OLLayer {
    static propTypes = {
        source: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        cluster: PropTypes.bool,
        updateWhileAnimating: PropTypes.bool,
        updateWhileInteracting: PropTypes.bool,
        loader: PropTypes.func,
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
    }
    static defaultProps = {
        cluster: false
    }

    state = {
        layer: null,
        source: null
    };

    constructor(props) {
        super(props);

        this.dictLayer.push('declutter');
        this.dictLayer.push('updateWhileAnimating');
        this.dictLayer.push('updateWhileInteracting');

        this.dictSource.push('format');   // { esrijson|geojson|topojson }
        this.dictSource.push('distance'); // for cluster
        //this.dictSource.push('features');
        this.dictSource.push('addfeature');

        let layerProps  = this.buildProps(this.dictLayer);
        let sourceProps = this.buildProps(this.dictSource);

        let style = buildStyle(this.props.style);

        // Allow passing in an openlayers source directly here
        let vectorSource;
        if (typeof this.props.source == 'object') {
            vectorSource = this.props.source

        } else if (this.props.source == 'geojson' || this.props.source == 'esrijson') {
            vectorSource = new VectorSource({
                strategy: bboxStrategy }
            //     Object.assign({
            //         strategy: bboxStrategy,
            //     }, sourceProps)
            );
            vectorSource.setLoader(
                DataLoader(this.props.source, this.props.url, vectorSource)
            );
            vectorSource.addEventListener("addfeature",
                (evt) => {
                    if (this.props.addfeature) {
                        console.log("Vector.addfeature", evt);
                        this.props.addfeature(evt);
                    }
                }
            );

        } else {
            // A Vector layer can just draw a collection of graphics (example1)
            // in which case it does not need any source prop or any DataLoader
            // If url prop is set, it will use the default XHR loader
            vectorSource = new VectorSource(
                Object.assign({
                    //features: new Collection()},
                    // I wonder if tile strategy ever makes sense here
                    //strategy: tileStrategy( createXYZ({ tileSize: 512 })),
                    strategy: bboxStrategy,
                    url: this.props.url // I need to test this
                }, sourceProps)
            )
        }

        this.state.source = vectorSource;
        let layerSource = vectorSource;

        // Tested in example 3 with drag and drop of GPX files
        if (this.props.cluster) {
            layerSource = new ClusterSource({
                source: vectorSource,
                distance: this.props.distance
            })
        }

        this.state.layer = new VectorLayer({
            ...layerProps,
            style: style,
            updateWhileAnimating: props.updateWhileAnimating,
            updateWhileInteracting: props.updateWhileInteracting,
            source: layerSource
        })
    }

/* I think the super class handles all of this???
    componentDidUpdate(prevProps) {
        console.log("layer.OLVector.componentDidUpdate()");
        super.componentDidUpdate(prevProps);
        // I think I need to see if style changed first...
        this.state.layer.setStyle(buildStyle(this.props.style));
    }
    */
}
