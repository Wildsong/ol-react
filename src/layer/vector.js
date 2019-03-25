import React from 'react'
import PropTypes from 'prop-types'
import { Vector as VectorLayer } from 'ol/layer'
import { Cluster, Vector as VectorSource } from 'ol/source'
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
        let source;
        if (typeof this.props.source == 'object') {
            source = this.props.source

        } else if (this.props.source == 'geojson' || this.props.source == 'esrijson') {
            source = new VectorSource({
                loader:  DataLoader(this.props.source, this.props.url, source, style),
                strategy: bboxStrategy }
            //     Object.assign({
            //         strategy: bboxStrategy,
            //     }, sourceProps)
            );
            source.addEventListener("addfeature",
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
            source = new VectorSource(
                Object.assign({
                    //features: new Collection()},
                    // I wonder if using the tile strategy ever makes sense
                    strategy: tileStrategy( createXYZ({ tileSize: 512 })),
                    url: this.props.url // I need to test this
                }, sourceProps)
            )
        }

        this.state.source = source;

        // FIXME add a test for this feature, it will almost certainly fail!
        // I think this needs to be a boolean and not a source type
        if (this.props.source === 'cluster') {
            console.log("cluster", sourceProps);
            this.state.source = new Cluster(
                Object.assign({
                    //features: new Collection(),
                    //geometryFunction: func
                    //strategy: tileStrategy( createXYZ({ tileSize: 512 })),
                        source: source
                    },
                    sourceProps
                )
            )
        }

        this.state.layer = new VectorLayer({
            ...layerProps,
            style: style,
            updateWhileAnimating: props.updateWhileAnimating,
            updateWhileInteracting: props.updateWhileInteracting,
            source: this.state.source
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
