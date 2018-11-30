import {
    Style,
    Geometry as GeometryStyle,
    Fill as FillStyle,
    Image as ImageStyle,
    Stroke as StrokeStyle,
    Text as TexStyle
} from 'ol/style';

const STYLE_KEY_FACTORIES = {
  geometry: (value) => new GeometryStyle(value),
  fill: (value) => new FillStyle(value),
  image: (value) => new ImageStyle(value),
  stroke: (value) => new StrokeStyle(value),
  text: (value) => new TextStyle(value),
  zIndex: (value) => value
};

export function buildStyle(style) {
  if (!style) {
    return null;
  }

  if (Array.isArray(style)) {
    return style.map(buildStyle);
  }

  if (typeof style === "function") {
    return style;
  }

  if (Style.prototype.isPrototypeOf(style)) {
    return style;
  }

  const result = {};

  Object.keys(STYLE_KEY_FACTORIES)
        .filter((key) => !!style[key])
        .forEach((key) => {
    result[key] = STYLE_KEY_FACTORIES[key](style[key]);
  });

  return new Style(result);
}
