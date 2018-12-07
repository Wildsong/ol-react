// So far this is used in feature.js and layer/vector.js

import {
    Atlas as AtlasStyle,
    Circle as CircleStyle,
    Fill as FillStyle,
    Icon as IconStyle,
    IconImage as IconImageStyle,
    IconImageCache as IconImageCacheStyle,
    ImageStyle,
    RegularShape as RegularShapeStyle,
    Stroke as StrokeStyle,
    Style,
    Text as TextStyle,
    TextPlacement as TextPlacementStyle,
    Geometry as GeometryStyle,
} from 'ol/style';

const STYLE_KEY_FACTORIES = {
    geometry: (value) => new GeometryStyle(value),
    image:    (value) => new buildImage(value),
    text:     (value) => new buildText(value),
    zIndex:   (value) => value,

    fill:     (value) => new FillStyle(value),
    stroke:   (value) => new StrokeStyle(value)
};

export function buildStyle(style) {
    if (!style) {
        console.log('buildStyle(null)');
        return null;
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
    evaluateKeys(style, result);
    return new Style(result);
}

function evaluateKeys(style, result) {
    Object.keys(STYLE_KEY_FACTORIES)
    .filter((key) => !!style[key])
    .forEach((key) => {
        result[key] = STYLE_KEY_FACTORIES[key](style[key]);
    });
    return result;
}

function buildText(style) {
    if (!style) {
        return null;
    }
    if (typeof style === "function") {
        return style;
    }

    // Prevent an infinite loop..
    let textContent = style.text;
    delete style.text;
    let textStyle = style;
    evaluateKeys(style, textStyle);
    textStyle.text = textContent;
    return new TextStyle(textStyle);
}

function buildImage(style) {
    if (!style) {
        return null;
    }
    if (typeof style === "function") {
        return style;
    }

    let imageStyle = style;
    evaluateKeys(style, imageStyle);
    switch (style.type) {

    case 'circle':
      return new CircleStyle(imageStyle);

    case 'icon':
      return new IconStyle(imageStyle);

    case 'regular-shape':
      return new RegularShapeStyle(imageStyle);
    }
}
