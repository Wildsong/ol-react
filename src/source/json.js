import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import { Cluster as ClusterSource, Vector as VectorSource } from 'ol/source'
import { createXYZ } from 'ol/tilegrid'
import { bbox as bboxStrategy } from 'ol/loadingstrategy'
import {DataLoader} from './dataloaders'
import {LayerContext} from '../layer-context'

const JSONSource = (props) => {
    const layer = useContext(LayerContext)
    console.log("JSON", props);
    const source = new VectorSource({ strategy: bboxStrategy });
    source.setLoader(DataLoader(props.loader, props.url, source));
    layer.setSource(source)
    return null;
}
JSONSource.propTypes = {
    url: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),
    loader: PropTypes.string.isRequired, // "geojson" || "esrijson"
};
export default JSONSource;
