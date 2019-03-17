import React from 'react'
import PropTypes from 'prop-types'
import { Vector as VectorLayer } from 'ol/layer'
import { Cluster, Vector as VectorSource } from 'ol/source'
import { Style } from 'ol/style'
import OLLayer from './ol-layer'
import { createXYZ } from 'ol/tilegrid'
import { tile as tileStrategy, bbox as bboxStrategy} from 'ol/loadingstrategy'
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
        loader: PropTypes.string,
        style:  PropTypes.oneOfType([
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

        // There used to be a feature collection added here
        // but it does not seem to matter so it's commented out

        // "strategy" is a function that takes extent and resolution
        // and returns an array of extents that need to be loaded.

        let style = buildStyle(this.props.style);
        let options;

        // THIS POOR CODE DESPERATELY NEEDS REAFACTORING

        // Allow passing in an openlayers source directly here
        let vectorSource;

        if (typeof this.props.source == 'object') {
            vectorSource = this.props.source
        }

        else if (this.props.source == 'geojson' || this.props.source == 'esrijson') {
            options = Object.assign({
                    strategy: bboxStrategy
                },
                sourceProps
            )
            vectorSource = new VectorSource(options)

        } else {
            // Not sure when we come through here
            // I guess for WMS vector layers?
            options = sourceProps;
            //Object.assign({
            //        //features: new Collection()},
            //        strategy: tileStrategy( createXYZ({ tileSize: 512 })),
            //    },
            //    sourceProps
            //)
            vectorSource = new VectorSource(options)
        }

        let source;
        switch (this.props.source) {
            case 'cluster':

            // FIXME add a test for this feature

                console.log("cluster", sourceProps);
                source = new Cluster(
                    Object.assign({
                            //features: new Collection(),
                            //geometryFunction: func
                            //strategy: tileStrategy( createXYZ({ tileSize: 512 })),
                            source: vectorSource
                        },
                        sourceProps
                    )
                )
                break;

            default:
                source = vectorSource;
                source.addEventListener("addfeature",
                    (evt) => {
                        if (this.props.addfeature) {
                            console.log("Vector.addfeature", evt);
                            this.props.addfeature(evt);
                        }
                    }
                );

                break;
        }
        this.state.source = source;

        if (this.props.source == 'geojson' || this.props.source == 'esrijson') {
            let dl = DataLoader(this.props.source, this.props.url, this.state.source, style);
            this.state.source.setLoader(dl);
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
