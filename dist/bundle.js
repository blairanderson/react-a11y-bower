var ReactA11y =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var a11y = __webpack_require__(1);

	module.exports = ally;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _toConsumableArray = __webpack_require__(2)['default'];

	var _Set = __webpack_require__(22)['default'];

	var assertions = __webpack_require__(36);
	var after = __webpack_require__(37);

	var shouldRunTest = function shouldRunTest(testName, options) {
	  var exclude = options.exclude || [];

	  if (options.device == 'mobile') {
	    exclude = new _Set(exclude.concat(assertions.mobileExclusions));
	    exclude = [].concat(_toConsumableArray(exclude));
	  }

	  return exclude.indexOf(testName) == -1;
	};

	var runTagTests = function runTagTests(tagName, props, children, options, onFailure) {
	  var key;
	  var tagTests = assertions.tags[tagName] || [];

	  for (key in tagTests) {
	    var testFailed = shouldRunTest(key, options) && !tagTests[key].test(tagName, props, children);

	    if (tagTests[key] && testFailed) onFailure(tagName, props, tagTests[key].msg);
	  }
	};

	var runPropTests = function runPropTests(tagName, props, children, options, onFailure) {
	  var key;
	  var propTests;

	  for (var propName in props) {
	    if (props[propName] === null || props[propName] === undefined) continue;

	    propTests = assertions.props[propName] || [];

	    for (key in propTests) {
	      var testTailed = shouldRunTest(key, options) && !propTests[key].test(tagName, props, children);

	      if (propTests[key] && testTailed) onFailure(tagName, props, propTests[key].msg);
	    }
	  }
	};

	var runLabelTests = function runLabelTests(tagName, props, children, options, onFailure) {
	  var key;
	  var renderTests = assertions.render;

	  for (key in renderTests) {
	    if (shouldRunTest(key, options) && renderTests[key]) {
	      var failureCB = onFailure.bind(undefined, tagName, props, renderTests[key].msg);

	      renderTests[key].test(tagName, props, children, failureCB);
	    }
	  }
	};

	var runTests = function runTests(tagName, props, children, options, onFailure) {
	  var tests = [runTagTests, runPropTests, runLabelTests];
	  tests.map(function (test) {
	    test(tagName, props, children, options, onFailure);
	  });
	};

	var shouldShowError = function shouldShowError(failureInfo, options) {
	  var filterFn = options.filterFn;
	  if (filterFn) return filterFn(failureInfo.tagName, failureInfo.id);

	  return true;
	};

	var throwError = function throwError(failureInfo, options) {
	  if (!shouldShowError(failureInfo, options)) return;

	  var error = [failureInfo.tagName, failureInfo.msg];

	  if (options.includeSrcNode) error.push(failureInfo.id);

	  throw new Error(error.join(' '));
	};

	var logAfterRender = function logAfterRender(component, log) {
	  after(component, 'componentDidMount', log);
	  after(component, 'componentDidUpdate', log);
	};

	var logWarning = function logWarning(component, failureInfo, options) {
	  var includeSrcNode = options.includeSrcNode;

	  var warn = function warn() {
	    if (!shouldShowError(failureInfo, options)) return;

	    var warning = [failureInfo.tagName, failureInfo.msg];

	    if (includeSrcNode && component) {
	      // TODO:
	      // 1) Consider using React.findDOMNode() over document.getElementById
	      //    https://github.com/rackt/react-a11y/issues/54
	      // 2) Consider using ref to expand element element reference logging
	      //    to all element (https://github.com/rackt/react-a11y/issues/55)
	      var srcNode = document.getElementById(failureInfo.id);

	      // Guard against logging null element references should render()
	      // return null or false.
	      // https://facebook.github.io/react/docs/component-api.html#getdomnode
	      if (srcNode) warning.push(srcNode);
	    }

	    console.warn.apply(console, warning);
	  };

	  if (includeSrcNode && component)
	    // Cannot log a node reference until the component is in the DOM,
	    // so defer the document.getElementById call until componentDidMount
	    // or componentDidUpdate.
	    logAfterRender(component._instance, warn);else warn();
	};

	var handleFailure = function handleFailure(options, reactEl, type, props, failureMsg) {
	  var includeSrcNode = options && !!options.includeSrcNode;
	  var reactComponent = reactEl._owner;

	  // If a Component instance, use the component's name,
	  // if a ReactElement instance, use the tag name + id (e.g. div#foo)
	  var name = reactComponent && reactComponent.getName() || type + '#' + props.id;

	  var failureInfo = {
	    'tagName': name,
	    'id': props.id,
	    'msg': failureMsg
	  };

	  var notifyOpts = {
	    'includeSrcNode': includeSrcNode,
	    'filterFn': options && options.filterFn
	  };

	  if (options && options['throw']) throwError(failureInfo, notifyOpts);else logWarning(reactComponent, failureInfo, notifyOpts);
	};

	var _createElement;

	var createId = (function () {
	  var nextId = 0;
	  return function (props) {
	    return props.id || 'a11y-' + nextId++;
	  };
	})();

	var reactA11y = function reactA11y(React, options) {
	  if (!React && !React.createElement) {
	    throw new Error('Missing parameter: React');
	  }

	  assertions.setReact(React);

	  _createElement = React.createElement;

	  React.createElement = function (type, _props) {
	    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      children[_key - 2] = arguments[_key];
	    }

	    var props = _props || {};
	    options = options || {};

	    props.id = createId(props);
	    var reactEl = _createElement.apply(undefined, [type, props].concat(children));
	    var failureCB = handleFailure.bind(undefined, options, reactEl);

	    if (typeof type === 'string') runTests(type, props, children, options, failureCB);

	    return reactEl;
	  };
	};

	module.exports = reactA11y;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Array$from = __webpack_require__(3)["default"];

	exports["default"] = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return _Array$from(arr);
	  }
	};

	exports.__esModule = true;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	__webpack_require__(18);
	module.exports = __webpack_require__(6).core.Array.from;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var set   = __webpack_require__(6).set
	  , $at   = __webpack_require__(8)(true)
	  , ITER  = __webpack_require__(9).safe('iter')
	  , $iter = __webpack_require__(10)
	  , step  = $iter.step;

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(15)(String, 'String', function(iterated){
	  set(this, ITER, {o: String(iterated), i: 0});
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var iter  = this[ITER]
	    , O     = iter.o
	    , index = iter.i
	    , point;
	  if(index >= O.length)return step(1);
	  point = $at(O, index);
	  iter.i += point.length;
	  return step(0, point);
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global = typeof self != 'undefined' ? self : Function('return this')()
	  , core   = {}
	  , defineProperty = Object.defineProperty
	  , hasOwnProperty = {}.hasOwnProperty
	  , ceil  = Math.ceil
	  , floor = Math.floor
	  , max   = Math.max
	  , min   = Math.min;
	// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
	var DESC = !!function(){
	  try {
	    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
	  } catch(e){ /* empty */ }
	}();
	var hide = createDefiner(1);
	// 7.1.4 ToInteger
	function toInteger(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	}
	function desc(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	}
	function simpleSet(object, key, value){
	  object[key] = value;
	  return object;
	}
	function createDefiner(bitmap){
	  return DESC ? function(object, key, value){
	    return $.setDesc(object, key, desc(bitmap, value));
	  } : simpleSet;
	}

	function isObject(it){
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	}
	function isFunction(it){
	  return typeof it == 'function';
	}
	function assertDefined(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	}

	var $ = module.exports = __webpack_require__(7)({
	  g: global,
	  core: core,
	  html: global.document && document.documentElement,
	  // http://jsperf.com/core-js-isobject
	  isObject:   isObject,
	  isFunction: isFunction,
	  that: function(){
	    return this;
	  },
	  // 7.1.4 ToInteger
	  toInteger: toInteger,
	  // 7.1.15 ToLength
	  toLength: function(it){
	    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	  },
	  toIndex: function(index, length){
	    index = toInteger(index);
	    return index < 0 ? max(index + length, 0) : min(index, length);
	  },
	  has: function(it, key){
	    return hasOwnProperty.call(it, key);
	  },
	  create:     Object.create,
	  getProto:   Object.getPrototypeOf,
	  DESC:       DESC,
	  desc:       desc,
	  getDesc:    Object.getOwnPropertyDescriptor,
	  setDesc:    defineProperty,
	  setDescs:   Object.defineProperties,
	  getKeys:    Object.keys,
	  getNames:   Object.getOwnPropertyNames,
	  getSymbols: Object.getOwnPropertySymbols,
	  assertDefined: assertDefined,
	  // Dummy, fix for not array-like ES3 string in es5 module
	  ES5Object: Object,
	  toObject: function(it){
	    return $.ES5Object(assertDefined(it));
	  },
	  hide: hide,
	  def: createDefiner(0),
	  set: global.Symbol ? simpleSet : hide,
	  each: [].forEach
	});
	/* eslint-disable no-undef */
	if(typeof __e != 'undefined')__e = core;
	if(typeof __g != 'undefined')__g = global;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function($){
	  $.FW   = false;
	  $.path = $.core;
	  return $;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// true  -> String#at
	// false -> String#codePointAt
	var $ = __webpack_require__(6);
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String($.assertDefined(that))
	      , i = $.toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l
	      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	        ? TO_STRING ? s.charAt(i) : a
	        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var sid = 0;
	function uid(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++sid + Math.random()).toString(36));
	}
	uid.safe = __webpack_require__(6).g.Symbol || uid;
	module.exports = uid;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $                 = __webpack_require__(6)
	  , cof               = __webpack_require__(11)
	  , classof           = cof.classof
	  , assert            = __webpack_require__(14)
	  , assertObject      = assert.obj
	  , SYMBOL_ITERATOR   = __webpack_require__(12)('iterator')
	  , FF_ITERATOR       = '@@iterator'
	  , Iterators         = __webpack_require__(13)('iterators')
	  , IteratorPrototype = {};
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	setIterator(IteratorPrototype, $.that);
	function setIterator(O, value){
	  $.hide(O, SYMBOL_ITERATOR, value);
	  // Add iterator for FF iterator protocol
	  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
	}

	module.exports = {
	  // Safari has buggy iterators w/o `next`
	  BUGGY: 'keys' in [] && !('next' in [].keys()),
	  Iterators: Iterators,
	  step: function(done, value){
	    return {value: value, done: !!done};
	  },
	  is: function(it){
	    var O      = Object(it)
	      , Symbol = $.g.Symbol;
	    return (Symbol && Symbol.iterator || FF_ITERATOR) in O
	      || SYMBOL_ITERATOR in O
	      || $.has(Iterators, classof(O));
	  },
	  get: function(it){
	    var Symbol = $.g.Symbol
	      , getIter;
	    if(it != undefined){
	      getIter = it[Symbol && Symbol.iterator || FF_ITERATOR]
	        || it[SYMBOL_ITERATOR]
	        || Iterators[classof(it)];
	    }
	    assert($.isFunction(getIter), it, ' is not iterable!');
	    return assertObject(getIter.call(it));
	  },
	  set: setIterator,
	  create: function(Constructor, NAME, next, proto){
	    Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
	    cof.set(Constructor, NAME + ' Iterator');
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(6)
	  , TAG      = __webpack_require__(12)('toStringTag')
	  , toString = {}.toString;
	function cof(it){
	  return toString.call(it).slice(8, -1);
	}
	cof.classof = function(it){
	  var O, T;
	  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
	};
	cof.set = function(it, tag, stat){
	  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
	};
	module.exports = cof;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(6).g
	  , store  = __webpack_require__(13)('wks');
	module.exports = function(name){
	  return store[name] || (store[name] =
	    global.Symbol && global.Symbol[name] || __webpack_require__(9).safe('Symbol.' + name));
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var $      = __webpack_require__(6)
	  , SHARED = '__core-js_shared__'
	  , store  = $.g[SHARED] || ($.g[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(6);
	function assert(condition, msg1, msg2){
	  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
	}
	assert.def = $.assertDefined;
	assert.fn = function(it){
	  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
	  return it;
	};
	assert.obj = function(it){
	  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};
	assert.inst = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};
	module.exports = assert;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var $def            = __webpack_require__(16)
	  , $redef          = __webpack_require__(17)
	  , $               = __webpack_require__(6)
	  , cof             = __webpack_require__(11)
	  , $iter           = __webpack_require__(10)
	  , SYMBOL_ITERATOR = __webpack_require__(12)('iterator')
	  , FF_ITERATOR     = '@@iterator'
	  , KEYS            = 'keys'
	  , VALUES          = 'values'
	  , Iterators       = $iter.Iterators;
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
	  $iter.create(Constructor, NAME, next);
	  function createMethod(kind){
	    function $$(that){
	      return new Constructor(that, kind);
	    }
	    switch(kind){
	      case KEYS: return function keys(){ return $$(this); };
	      case VALUES: return function values(){ return $$(this); };
	    } return function entries(){ return $$(this); };
	  }
	  var TAG      = NAME + ' Iterator'
	    , proto    = Base.prototype
	    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , _default = _native || createMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if(_native){
	    var IteratorPrototype = $.getProto(_default.call(new Base));
	    // Set @@toStringTag to native iterators
	    cof.set(IteratorPrototype, TAG, true);
	    // FF fix
	    if($.FW && $.has(proto, FF_ITERATOR))$iter.set(IteratorPrototype, $.that);
	  }
	  // Define iterator
	  if($.FW || FORCE)$iter.set(proto, _default);
	  // Plug for library
	  Iterators[NAME] = _default;
	  Iterators[TAG]  = $.that;
	  if(DEFAULT){
	    methods = {
	      keys:    IS_SET            ? _default : createMethod(KEYS),
	      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
	      entries: DEFAULT != VALUES ? _default : createMethod('entries')
	    };
	    if(FORCE)for(key in methods){
	      if(!(key in proto))$redef(proto, key, methods[key]);
	    } else $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
	  }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(6)
	  , global     = $.g
	  , core       = $.core
	  , isFunction = $.isFunction;
	function ctx(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	}
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	function $def(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {}).prototype
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && !isFunction(target[key]))exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp.prototype = C.prototype;
	    }(out);
	    else exp = isProto && isFunction(out) ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports.prototype || (exports.prototype = {}))[key] = out;
	  }
	}
	module.exports = $def;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6).hide;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var $     = __webpack_require__(6)
	  , ctx   = __webpack_require__(19)
	  , $def  = __webpack_require__(16)
	  , $iter = __webpack_require__(10)
	  , call  = __webpack_require__(20);
	$def($def.S + $def.F * !__webpack_require__(21)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = Object($.assertDefined(arrayLike))
	      , mapfn   = arguments[1]
	      , mapping = mapfn !== undefined
	      , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
	      , index   = 0
	      , length, result, step, iterator;
	    if($iter.is(O)){
	      iterator = $iter.get(O);
	      // strange IE quirks mode bug -> use typeof instead of isFunction
	      result   = new (typeof this == 'function' ? this : Array);
	      for(; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, f, [step.value, index], true) : step.value;
	      }
	    } else {
	      // strange IE quirks mode bug -> use typeof instead of isFunction
	      result = new (typeof this == 'function' ? this : Array)(length = $.toLength(O.length));
	      for(; length > index; index++){
	        result[index] = mapping ? f(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// Optional / simple context binding
	var assertFunction = __webpack_require__(14).fn;
	module.exports = function(fn, that, length){
	  assertFunction(fn);
	  if(~length && that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  } return function(/* ...args */){
	      return fn.apply(that, arguments);
	    };
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var assertObject = __webpack_require__(14).obj;
	function close(iterator){
	  var ret = iterator['return'];
	  if(ret !== undefined)assertObject(ret.call(iterator));
	}
	function call(iterator, fn, value, entries){
	  try {
	    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
	  } catch(e){
	    close(iterator);
	    throw e;
	  }
	}
	call.close = close;
	module.exports = call;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var SYMBOL_ITERATOR = __webpack_require__(12)('iterator')
	  , SAFE_CLOSING    = false;
	try {
	  var riter = [7][SYMBOL_ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	module.exports = function(exec){
	  if(!SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[SYMBOL_ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[SYMBOL_ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(23), __esModule: true };

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(30);
	__webpack_require__(5);
	__webpack_require__(31);
	__webpack_require__(24);
	__webpack_require__(34);
	module.exports = __webpack_require__(6).core.Set;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(25);

	// 23.2 Set Objects
	__webpack_require__(28)('Set', function(get){
	  return function Set(){ return get(this, arguments[0]); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value){
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $        = __webpack_require__(6)
	  , ctx      = __webpack_require__(19)
	  , safe     = __webpack_require__(9).safe
	  , assert   = __webpack_require__(14)
	  , forOf    = __webpack_require__(26)
	  , step     = __webpack_require__(10).step
	  , $has     = $.has
	  , set      = $.set
	  , isObject = $.isObject
	  , hide     = $.hide
	  , isExtensible = Object.isExtensible || isObject
	  , ID       = safe('id')
	  , O1       = safe('O1')
	  , LAST     = safe('last')
	  , FIRST    = safe('first')
	  , ITER     = safe('iter')
	  , SIZE     = $.DESC ? safe('size') : 'size'
	  , id       = 0;

	function fastKey(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!$has(it, ID)){
	    // can't set id to frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add id
	    if(!create)return 'E';
	    // add missing object id
	    hide(it, ID, ++id);
	  // return object id with prefix
	  } return 'O' + it[ID];
	}

	function getEntry(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that[O1][index];
	  // frozen object case
	  for(entry = that[FIRST]; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	}

	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      assert.inst(that, C, NAME);
	      set(that, O1, $.create(null));
	      set(that, SIZE, 0);
	      set(that, LAST, undefined);
	      set(that, FIRST, undefined);
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    __webpack_require__(27)(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that[FIRST] = that[LAST] = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that[O1][entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that[FIRST] == entry)that[FIRST] = next;
	          if(that[LAST] == entry)that[LAST] = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        var f = ctx(callbackfn, arguments[1], 3)
	          , entry;
	        while(entry = entry ? entry.n : this[FIRST]){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if($.DESC)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return assert.def(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that[LAST] = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that[LAST],          // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that[FIRST])that[FIRST] = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that[O1][index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  // add .keys, .values, .entries, [@@iterator]
	  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	  setIter: function(C, NAME, IS_MAP){
	    __webpack_require__(15)(C, NAME, function(iterated, kind){
	      set(this, ITER, {o: iterated, k: kind});
	    }, function(){
	      var iter  = this[ITER]
	        , kind  = iter.k
	        , entry = iter.l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
	        // or finish the iteration
	        iter.o = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
	  }
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var ctx  = __webpack_require__(19)
	  , get  = __webpack_require__(10).get
	  , call = __webpack_require__(20);
	module.exports = function(iterable, entries, fn, that){
	  var iterator = get(iterable)
	    , f        = ctx(fn, that, entries ? 2 : 1)
	    , step;
	  while(!(step = iterator.next()).done){
	    if(call(iterator, f, step.value, entries) === false){
	      return call.close(iterator);
	    }
	  }
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var $redef = __webpack_require__(17);
	module.exports = function(target, src){
	  for(var key in src)$redef(target, key, src[key]);
	  return target;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $     = __webpack_require__(6)
	  , $def  = __webpack_require__(16)
	  , $iter = __webpack_require__(10)
	  , BUGGY = $iter.BUGGY
	  , forOf = __webpack_require__(26)
	  , assertInstance = __webpack_require__(14).inst
	  , INTERNAL = __webpack_require__(9).safe('internal');

	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = $.g[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  if(!$.DESC || !$.isFunction(C) || !(IS_WEAK || !BUGGY && proto.forEach && proto.entries)){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    __webpack_require__(27)(C.prototype, methods);
	  } else {
	    C = wrapper(function(target, iterable){
	      assertInstance(target, C, NAME);
	      target[INTERNAL] = new Base;
	      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
	      var chain = KEY == 'add' || KEY == 'set';
	      if(KEY in proto)$.hide(C.prototype, KEY, function(a, b){
	        var result = this[INTERNAL][KEY](a === 0 ? 0 : a, b);
	        return chain ? this : result;
	      });
	    });
	    if('size' in proto)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return this[INTERNAL].size;
	      }
	    });
	  }

	  __webpack_require__(11).set(C, NAME);

	  O[NAME] = C;
	  $def($def.G + $def.W + $def.F, O);
	  __webpack_require__(29)(C);

	  if(!IS_WEAK)common.setIter(C, NAME, IS_MAP);

	  return C;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var $       = __webpack_require__(6)
	  , SPECIES = __webpack_require__(12)('species');
	module.exports = function(C){
	  if($.DESC && !(SPECIES in C))$.setDesc(C, SPECIES, {
	    configurable: true,
	    get: $.that
	  });
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(11)
	  , tmp = {};
	tmp[__webpack_require__(12)('toStringTag')] = 'z';
	if(__webpack_require__(6).FW && cof(tmp) != 'z'){
	  __webpack_require__(17)(Object.prototype, 'toString', function toString(){
	    return '[object ' + cof.classof(this) + ']';
	  }, true);
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(32);
	var $           = __webpack_require__(6)
	  , Iterators   = __webpack_require__(10).Iterators
	  , ITERATOR    = __webpack_require__(12)('iterator')
	  , ArrayValues = Iterators.Array
	  , NL          = $.g.NodeList
	  , HTC         = $.g.HTMLCollection
	  , NLProto     = NL && NL.prototype
	  , HTCProto    = HTC && HTC.prototype;
	if($.FW){
	  if(NL && !(ITERATOR in NLProto))$.hide(NLProto, ITERATOR, ArrayValues);
	  if(HTC && !(ITERATOR in HTCProto))$.hide(HTCProto, ITERATOR, ArrayValues);
	}
	Iterators.NodeList = Iterators.HTMLCollection = ArrayValues;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(6)
	  , setUnscope = __webpack_require__(33)
	  , ITER       = __webpack_require__(9).safe('iter')
	  , $iter      = __webpack_require__(10)
	  , step       = $iter.step
	  , Iterators  = $iter.Iterators;

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	__webpack_require__(15)(Array, 'Array', function(iterated, kind){
	  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var iter  = this[ITER]
	    , O     = iter.o
	    , kind  = iter.k
	    , index = iter.i++;
	  if(!O || index >= O.length){
	    iter.o = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	setUnscope('keys');
	setUnscope('values');
	setUnscope('entries');

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	__webpack_require__(35)('Set');

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $def  = __webpack_require__(16)
	  , forOf = __webpack_require__(26);
	module.exports = function(NAME){
	  $def($def.P, NAME, {
	    toJSON: function toJSON(){
	      var arr = [];
	      forOf(this, false, arr.push, arr);
	      return arr;
	    }
	  });
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Set = __webpack_require__(22)['default'];

	var after = __webpack_require__(37);

	var React;

	exports.setReact = function (R) {
	  React = R;
	};

	var INTERACTIVE = {
	  'button': true,
	  'input': function input(props) {
	    return props.type != 'hidden';
	  },
	  'textarea': true,
	  'select': true,
	  'option': true,
	  'a': function a(props) {
	    var hasHref = typeof props.href === 'string';
	    var hasTabIndex = props.tabIndex != null;
	    return hasHref || !hasHref && hasTabIndex;
	  }
	};

	var presentationRoles = new _Set(['presentation', 'none']);

	var isHiddenFromAT = function isHiddenFromAT(props) {
	  return props['aria-hidden'] == 'true';
	};

	var hasAlt = function hasAlt(props) {
	  return typeof props.alt === 'string';
	};

	var isInteractive = function isInteractive(tagName, props) {
	  var tag = INTERACTIVE[tagName];
	  return typeof tag === 'function' ? tag(props) : tag;
	};

	var getComponents = function getComponents(children) {
	  var childComponents = [];
	  React.Children.forEach(children, function (child) {
	    if (child && typeof child.type === 'function') childComponents.push(child);
	  });
	  return childComponents;
	};

	var hasLabel = function hasLabel(node) {
	  var text = node.tagName.toLowerCase() == 'img' ? node.alt : node.textContent;
	  var hasTextContent = text.trim().length > 0;

	  var images = node.querySelectorAll('img[alt]');
	  images = Array.prototype.slice.call(images);

	  var hasAltText = images.filter(function (image) {
	    return image.alt.length > 0;
	  }).length > 0;

	  return hasTextContent || hasAltText;
	};

	var assertLabel = function assertLabel(node, context, failureCB) {
	  if (context.passed) return;

	  context.passed = hasLabel(node);

	  if (!context.passed && context.totalChildren == ++context.childrenTested) failureCB();
	};

	var hasChildTextNode = function hasChildTextNode(props, children, failureCB) {
	  var hasText = false;
	  var childComponents = getComponents(children);
	  var nChildComponents = childComponents.length;
	  var hasChildComponents = nChildComponents > 0;
	  var nCurrentComponent = 0;
	  var context;

	  if (hasChildComponents) context = { totalChildren: childComponents.length, childrenTested: 0 };

	  React.Children.forEach(children, function (child) {
	    if (hasText) return;else if (child === null) return;else if (typeof child === 'undefined') return;else if (typeof child === 'string' || typeof child === 'number') hasText = true;else if (child.type === 'img' && child.props.alt) hasText = true;else if (child.props && child.props.children) hasText = hasChildTextNode(child.props, child.props.children, failureCB);else if (typeof child.type === 'function') {
	      // There can be false negatives if one of the children is a Component,
	      // as Components' children are inaccessible until it's is rendered.
	      // To account for this, check each Component's HTML after it's
	      // been mounted.
	      after(child.type.prototype, 'componentDidMount', function () {
	        assertLabel(React.findDOMNode(this), context, failureCB);
	      });

	      // Return true because the label check is now going to be async
	      // (due to the componentDidMount listener) and we want to avoid
	      // pre-maturely calling the failure callback.
	      hasText = nChildComponents == ++nCurrentComponent;
	    }
	  });
	  return hasText;
	};

	exports.mobileExclusions = ['NO_TABINDEX', 'BUTTON_ROLE_SPACE', 'BUTTON_ROLE_ENTER', 'TABINDEX_REQUIRED_WHEN_ARIA_HIDDEN'];

	exports.props = {
	  onClick: {
	    NO_ROLE: {
	      msg: 'You have a click handler on a non-interactive element but no `role` DOM property. It will be unclear what this element is supposed to do to a screen-reader user. http://www.w3.org/TR/wai-aria/roles#role_definitions',
	      test: function test(tagName, props, children) {
	        if (isHiddenFromAT(props)) return true;

	        return !(!isInteractive(tagName, props) && !props.role);
	      }
	    },

	    NO_TABINDEX: {
	      msg: 'You have a click handler on a non-interactive element but no `tabIndex` DOM property. The element will not be navigable or interactive by keyboard users. http://www.w3.org/TR/wai-aria-practices/#focus_tabindex',
	      test: function test(tagName, props, children) {
	        if (isHiddenFromAT(props)) return true;

	        return !(!isInteractive(tagName, props) && props.tabIndex == null // tabIndex={0} is valid
	        );
	      }
	    },

	    BUTTON_ROLE_SPACE: {
	      msg: 'You have `role="button"` but did not define an `onKeyDown` handler. Add it, and have the "Space" key do the same thing as an `onClick` handler.',
	      test: function test(tagName, props, children) {
	        if (isHiddenFromAT(props)) return true;

	        return !(props.role === 'button' && !props.onKeyDown);
	      }
	    },

	    BUTTON_ROLE_ENTER: {
	      msg: 'You have `role="button"` but did not define an `onKeyDown` handler. Add it, and have the "Enter" key do the same thing as an `onClick` handler.',
	      test: function test(tagName, props, children) {
	        if (isHiddenFromAT(props)) return true;

	        return !(props.role === 'button' && !props.onKeyDown);
	      }
	    }
	  },

	  'aria-hidden': {
	    'TABINDEX_REQUIRED_WHEN_ARIA_HIDDEN': {
	      msg: 'You have `aria-hidden="true"` applied to an interactive element but have not removed it from the tab flow. This could result in a hidden tab stop for users of screen readers.',
	      test: function test(tagName, props, children) {
	        return !((isInteractive(tagName, props) || tagName == 'a' && !props.href) && props['aria-hidden'] == 'true' && props.tabIndex != '-1');
	      }
	    }
	  }
	};

	exports.tags = {
	  a: {
	    HASH_HREF_NEEDS_BUTTON: {
	      msg: 'You have an anchor with `href="#"` and no `role` DOM property. Add `role="button"` or better yet, use a `<button/>`.',
	      test: function test(tagName, props, children) {
	        if (isHiddenFromAT(props)) return true;

	        return !(!props.role && props.href === '#');
	      }
	    },
	    TABINDEX_NEEDS_BUTTON: {
	      msg: 'You have an anchor with a tabIndex, no `href` and no `role` DOM property. Add `role="button"` or better yet, use a `<button/>`.',
	      test: function test(tagName, props, children) {
	        if (isHiddenFromAT(props)) return true;

	        return !(!props.role && props.tabIndex != null && !props.href);
	      }
	    }
	  },

	  img: {
	    MISSING_ALT: {
	      msg: 'You forgot an `alt` DOM property on an image. Screen-reader users will not know what it is.',
	      test: function test(tagName, props, children) {
	        if (isHiddenFromAT(props)) return true;

	        return hasAlt(props);
	      }
	    },

	    REDUNDANT_ALT: {
	      // TODO: have some way to set localization strings to match against
	      msg: 'Screen-readers already announce `img` tags as an image, you don\'t need to use the word "image" in the description',
	      test: function test(tagName, props, children) {
	        if (isHiddenFromAT(props)) return true;

	        return !(hasAlt(props) && props.alt.match('image'));
	      }
	    }
	  }
	};

	exports.render = {
	  NO_LABEL: {
	    msg: 'You have an unlabled element or control. Add `aria-label` or `aria-labelled-by` attribute, or put some text in the element.',
	    test: function test(tagName, props, children, failureCB) {
	      if (isHiddenFromAT(props) || presentationRoles.has(props.role)) return;

	      if (!(isInteractive(tagName, props) || tagName == 'a' && !props.href || props.role)) return;

	      var failed = !(props['aria-label'] || props['aria-labelled-by'] || tagName === 'img' && props.alt || hasChildTextNode(props, children, failureCB));

	      if (failed) failureCB();
	    }
	  }

	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";

	var after = function after(host, name, cb) {
	  var originalFn = host[name];

	  if (originalFn) {
	    host[name] = function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      originalFn.apply(this, args);
	      cb.apply(this, args);
	    };
	  } else {
	    host[name] = cb;
	  }
	};

	module.exports = after;

/***/ }
/******/ ]);