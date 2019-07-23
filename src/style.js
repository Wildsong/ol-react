// I think this thing just adds more possibility for confusion and errors.
// Just pass actual OpenLayers styles into ol-react where needed instead.
// It's easier to debug.

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

// I think there must be a better way to do this

const STYLE_KEY_FACTORIES = {
    geometry: (value) => new GeometryStyle(value),
    zIndex:   (value) => value,

    fill:     (value) => new FillStyle(value),
    stroke:   (value) => new StrokeStyle(value),

    image:    (value) => new buildImage(value),
    text:     (value) => new buildText(value),
};

export function buildStyle(style) {
    if (!style) {
        console.log('buildStyle(null); will use defaults');
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

    //console.log("styling", style, "->", result);
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

    let s = null;
    switch (style.type) {
        case 'circle':
            s = new CircleStyle(imageStyle);
            break;
        case 'icon':
            s = new IconStyle(imageStyle);
            break;
        case 'regularShape':
            s = new RegularShapeStyle(imageStyle);
            break;
        default:
            console.log("Unrecognized style type '" + style.type + "'");
            s = new CircleStyle({radius:20}); // default!!
    }
    return s
}
