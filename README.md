This code started out as richardhills/ol-react for ol3
and brian32768 forked it and adapted it for ol5

## Overview

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

## How to use it

### Test

In theory, ````npm start```` will launch the test setup in a browser,
but I have not written it yet. :-)

### Deploy

The original version can be installed in your project with ````npm install ol-react````.
I haven't gotten past testing yet so I don't have a plan for deployment yet.

## The cry for help

It's early days! If you're familiar with react and/or openlayers and are interested in helping, please get in touch.

Original OL3 version available on [github](https://github.com/richardhills/ol-react) and [npm](https://www.npmjs.com/package/ol-react).
Brian's fork for OL5 at [github](https://github.com/brian32768/ol-react)

Richard says he is especially interested in assistance with having each component be optionally [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components). This would allow binding of the components with, say, Redux and for sophisticated state management outside of OpenLayers.

Brian says "This means nothing to me today, maybe tomorrow? :-) Every day is like Monday to me at this stage."
