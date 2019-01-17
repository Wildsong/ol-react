import React from 'react'
import PropTypes from 'prop-types'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style } from 'ol/style'
import { createXYZ } from 'ol/tilegrid'
import { tile as tileStrategy } from 'ol/loadingstrategy'
import { EsriJSON } from 'ol/format'
import OLLayer from './ol-layer'
//import { Collection} from 'ol'
import { buildLayerProps, baseLayerPropTypes } from './'
import { buildStyle } from '../style'

// THIS IS TEMPORARY!!
// only using ajax not accessing DOM so should be okay for now.
import jquery from 'jquery'

let esrijsonFormat = new EsriJSON();

class OLVector extends OLLayer {
    constructor(props) {
        super(props);

        this.dictLayer.push('declutter');
        this.dictLayer.push('updateWhileAnimating');
        this.dictLayer.push('updateWhileInteracting');

        this.dictSource.push('format');
        //this.dictSource.push('features'); // gets created below

        let layerProps  = this.buildProps(this.dictLayer);
        let sourceProps = this.buildProps(this.dictSource);

        // FIXME
        // This is a data loader that will be called from OpenLayers
        // and it obviously belongs elsewhere
        // All we know about right now is esrijson

        console.log("props", this.props, "sourceProps", sourceProps);
        if (this.props.url) {
            let source = new VectorSource(
                Object.assign(
                    {
                        strategy: tileStrategy( createXYZ({ tileSize: 512 }) ),
                        loader: (extent, resolution, projection) => {
                            let url = this.props.url  + '0' + '/query/?f=json&' +
                               'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                                encodeURIComponent(    '{"xmin":' + extent[0] + ',"ymin":' + extent[1]
                                                     + ',"xmax":' + extent[2] + ',"ymax":' + extent[3])
                                                     + '&geometryType=esriGeometryEnvelope&outFields=*';
                            console.log("loader", url, extent, resolution, projection);
                            jquery.ajax({url: url, dataType: 'jsonp', success: function(response) {
                                if (response.error) {
                                    console.log(response.error.message + response.error.details + ' IS IT SHARED? I can\'t do auth!');
                                } else {
                                    // dataProjection will be read from document
                                    let features = esrijsonFormat.readFeatures(response, {
                                        featureProjection: projection
                                    });
                                    console.log("Adding features.", features.length);
                                    if (features.length > 0) {
                                        source.addFeatures(features);
                                    }
                                }
                            }})
                        }
                    },
                    sourceProps
                )
            )
            this.state.source = source
        } else {
        // There used to be a feature collection added here
        // but it does not seem to matter at this time so I took it out
            this.state.source = new VectorSource(
//          Object.assign({features: new Collection()}, sourceProps)
                sourceProps
            )
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

OLVector.propTypes = {
    updateWhileAnimating: PropTypes.bool,
    updateWhileInteracting: PropTypes.bool,
    loader: PropTypes.func,
    style: PropTypes.oneOfType([
            PropTypes.instanceOf(Style),
            PropTypes.object,
            PropTypes.arrayOf(PropTypes.oneOfType([
                PropTypes.instanceOf(Style),
                PropTypes.object
            ]))
    ])
}

export default OLVector
