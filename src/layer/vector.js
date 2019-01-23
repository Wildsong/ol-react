import React from 'react'
import PropTypes from 'prop-types'
import { Vector as VectorLayer } from 'ol/layer'
import { Cluster, Vector as VectorSource } from 'ol/source'
import { Style } from 'ol/style'
import OLLayer from './ol-layer'
import { createXYZ } from 'ol/tilegrid'
import { tile as tileStrategy } from 'ol/loadingstrategy'
//import { Collection} from 'ol'
import { buildLayerProps, baseLayerPropTypes } from './'
import { DataLoader } from './dataloaders'
import { buildStyle } from '../style'

export default class OLVector extends OLLayer {
    static propTypes = {
        updateWhileAnimating: PropTypes.bool,
        updateWhileInteracting: PropTypes.bool,
        loader: PropTypes.string,
        style:  PropTypes.oneOfType([
                    PropTypes.instanceOf(Style),
                    PropTypes.object,
                    PropTypes.arrayOf(PropTypes.oneOfType([
                        PropTypes.instanceOf(Style),
                        PropTypes.object
                ]))
        ])
    }

    constructor(props) {
        super(props);

        this.dictLayer.push('declutter');
        this.dictLayer.push('updateWhileAnimating');
        this.dictLayer.push('updateWhileInteracting');

        this.dictSource.push('format');   // { esrijson|geojson|topojson }
        this.dictSource.push('distance'); // for cluster
        //this.dictSource.push('features');

        let layerProps  = this.buildProps(this.dictLayer);
        let sourceProps = this.buildProps(this.dictSource);

        // There used to be a feature collection added here
        // but it does not seem to matter so it's commented out

        // Using the tileStrategy here all the time does not seem
        // to matter but I think I only want it for EsriJSON
        // Maybe there should be a "source=esrijson"

        let vectorsource = new VectorSource(
                Object.assign({
                    //features: new Collection()},
                    strategy: tileStrategy( createXYZ({ tileSize: 512 })),
                },
                sourceProps
            )
        )
        let source;
        switch (this.props.source) {
            case 'cluster':
                console.log("cluster", sourceProps);
                source = new Cluster(
                    Object.assign({
                            //features: new Collection(),
                            //geometryFunction: func
                            //strategy: tileStrategy( createXYZ({ tileSize: 512 })),
                            source: vectorsource
                        },
                        sourceProps
                    )
                )
                break;

            default:
                source = vectorsource;
                break;
        }
        this.state.source = source;

        //console.log("props", this.props, "sourceProps", sourceProps);
        if (this.props.source) {
            let dl = DataLoader(this.props.source, this.props.url, this.state.source);
            //console.log("What is dl", dl);
            this.state.source.setLoader(dl);
        }

        let style = buildStyle(this.props.style);

        //console.log("layerProps", layerProps);
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
