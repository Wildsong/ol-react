"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionProvider = exports.CollectionContext = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-line no-unused-vars
// Currently I use this to create groupings of layers,
// in theory it works for any collection (?)
// https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react
var CollectionContext = _react["default"].createContext();

exports.CollectionContext = CollectionContext;

var CollectionProvider = function CollectionProvider(props) {
  return _react["default"].createElement(CollectionContext.Provider, {
    value: props.collection
  }, props.children);
};

exports.CollectionProvider = CollectionProvider;
//# sourceMappingURL=collection-context.js.map