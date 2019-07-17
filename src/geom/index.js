// Every supported OL5 geometry is documented here but commented out until it's implemented.
// When you implement a new geometry, add a test to App.js.

export {default as Circle} from './circle'
//export {default as GeometryCollection} from './GeometryCollection'
export {default as LineString} from './line-string'
//export {default as MultiLineString} from './MultiLineString'
export {default as MultiPoint} from './MultiPoint'
//export {default as MultiPolygon} from './MultiPolygon'
export {default as Point} from './Point'
export {default as Polygon} from './Polygon'

// I think this is an abstract base class so it should not be a component
//export {default as Geometry} from './Geometry'
