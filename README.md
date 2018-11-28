This code started out as richardhills/ol-react for ol3
and brian32768 forked it and adapted it for ol5

A thin wrapper for [OpenLayers5](http://openlayers.org/) in [React](https://reactjs.org/).

The goal is to be able to write applications using OpenLayers maps in a declarative way. For example, the following is JSX, which can be returned by the render() method on a React component, to generate a map with a red square near the equator.

    <Map view=<View resolution={10000} center={[0, 0]}/>>
      <layer.Tile>
        <source.OSM />
      </layer.Tile>
      <layer.Vector>
        <source.Vector>
          <Feature style={{stroke: {color: [255, 0, 0, 1]}}}>
            <geom.LineString>
              {[[0, 0], [100000, 0], [100000, 100000], [0, 100000]]}
            </geom.LineString>
          </Feature>
        </source.Vector>
      </layer.Vector>
    </Map>

To understand what each element does, read the [OpenLayers API documentation](http://openlayers.org/en/latest/apidoc/).

It's early days! If you're familiar with react and/or openlayers and are interested in helping, please get in touch.

Original OL3 version available on [github](https://github.com/richardhills/ol-react) and [npm](https://www.npmjs.com/package/ol-react).

Forked OL5 version at [github](https://github.com/brian32768/ol-react) 

Richard says he is especially interested in assistance with having each component be optionally [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components). This would allow binding of the components with, say, Redux and for sophisticated state management outside of OpenLayers.
Brian says "This means nothing to me today, maybe tomorrow? :-)"
