// So far this is used in feature.js and layer/vector.js

import {
    Atlas as AtlasStyle,
    Circle,
    Fill,
    Icon as IconStyle,
    IconImage as IconImageStyle,
    IconImageCache as IconImageCacheStyle,
    ImageStyle,
    RegularShape as RegularShapeStyle,
    Stroke,
    Style,
    Text as TextStyle,
    TextPlacement as TextPlacementStyle,
    Geometry as GeometryStyle,
} from 'ol/style';

const STYLE_KEY_FACTORIES = {
    geometry: (value) => new GeometryStyle(value),
    image:    (value) => new ImageStyle(value),
    text:     (value) => new TextStyle(value),
    zIndex:   (value) => value,

    fill:     (value) => new Fill(value),
    stroke:   (value) => new Stroke(value)
};

let defaultStyle = {
    'Point': new Style({
        image: new Circle({
            fill: new Fill({
        	       color: 'rgba(0,128,128,0.5)'
            }),
            radius: 5,
            stroke: new Stroke({
        	       color: '#ff0',
        	       width: 1
            })
        })
    }),
    'LineString': new Style({
        stroke: new Stroke({
            color: '#f00',
            width: 3
        })
    }),
    'Polygon': new Style({
        fill: new Fill({
            color: 'rgba(0,255,128,0.5)'
        }),
        stroke: new Stroke({
            color: '#0ff',
            width: 1
        })
    }),
    'MultiPoint': new Style({
        image: new Circle({
            fill: new Fill({
        	       color: 'rgba(255,0,255,0.5)'
            }),
            radius: 5,
            stroke: new Stroke({
        	       color: '#f0f',
        	       width: 1
            })
        })
    }),
    'MultiLineString': new Style({
        stroke: new Stroke({
            color: '#0f0',
            width: 3
        })
    }),
    'MultiPolygon': new Style({
        fill: new Fill({
            color: 'rgba(0,0,255,0.5)'
        }),
        stroke: new Stroke({
            color: '#00f',
            width: 1
        })
    })
};

export function buildStyle(style) {
    if (!style) {
        style = defaultStyle;
        console.log("buildStyle: using default: ", style);
        //return null;
    } else {
        console.log("buildStyle: style: ", style);
    }

    if (Array.isArray(style)) {
        console.log("buildStyle: RECURSION: ", style);
        return style.map(buildStyle);
    }

    if (typeof style === "function") {
        console.log("buildStyle: function: ", style);
        return style;
    }

    if (Style.prototype.isPrototypeOf(style)) {
        console.log("buildStyle: proto: ", style);
        return style;
    }

    const result = {};

    Object.keys(STYLE_KEY_FACTORIES)
        .filter((key) => !!style[key])
        .forEach((key) => {
    result[key] = STYLE_KEY_FACTORIES[key](style[key]);
    });

    let s = new Style(result);
    console.log("buildStyle: proto: ", style, result, " =====> ", s);
    return s;
}
