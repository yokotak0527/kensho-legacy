var Kensho = (function () {
	'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, basedir, module) {
		return module = {
			path: basedir,
			exports: {},
			require: function (path, base) {
				return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
			}
		}, fn(module, module.exports), module.exports;
	}

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	}

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function __param(paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	}

	function __metadata(metadataKey, metadataValue) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
	}

	function __awaiter(thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	var __createBinding = Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	});

	function __exportStar(m, o) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
	}

	function __values(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	function __spreadArrays() {
	    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	    for (var r = Array(s), k = 0, i = 0; i < il; i++)
	        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
	            r[k] = a[j];
	    return r;
	}
	function __await(v) {
	    return this instanceof __await ? (this.v = v, this) : new __await(v);
	}

	function __asyncGenerator(thisArg, _arguments, generator) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var g = generator.apply(thisArg, _arguments || []), i, q = [];
	    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
	    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
	    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
	    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
	    function fulfill(value) { resume("next", value); }
	    function reject(value) { resume("throw", value); }
	    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
	}

	function __asyncDelegator(o) {
	    var i, p;
	    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
	    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
	}

	function __asyncValues(o) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var m = o[Symbol.asyncIterator], i;
	    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
	    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
	    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
	}

	function __makeTemplateObject(cooked, raw) {
	    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
	    return cooked;
	}
	var __setModuleDefault = Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	};

	function __importStar(mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	}

	function __importDefault(mod) {
	    return (mod && mod.__esModule) ? mod : { default: mod };
	}

	function __classPrivateFieldGet(receiver, privateMap) {
	    if (!privateMap.has(receiver)) {
	        throw new TypeError("attempted to get private field on non-instance");
	    }
	    return privateMap.get(receiver);
	}

	function __classPrivateFieldSet(receiver, privateMap, value) {
	    if (!privateMap.has(receiver)) {
	        throw new TypeError("attempted to set private field on non-instance");
	    }
	    privateMap.set(receiver, value);
	    return value;
	}

	var tslib_es6 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		__extends: __extends,
		get __assign () { return __assign; },
		__rest: __rest,
		__decorate: __decorate,
		__param: __param,
		__metadata: __metadata,
		__awaiter: __awaiter,
		__generator: __generator,
		__createBinding: __createBinding,
		__exportStar: __exportStar,
		__values: __values,
		__read: __read,
		__spread: __spread,
		__spreadArrays: __spreadArrays,
		__await: __await,
		__asyncGenerator: __asyncGenerator,
		__asyncDelegator: __asyncDelegator,
		__asyncValues: __asyncValues,
		__makeTemplateObject: __makeTemplateObject,
		__importStar: __importStar,
		__importDefault: __importDefault,
		__classPrivateFieldGet: __classPrivateFieldGet,
		__classPrivateFieldSet: __classPrivateFieldSet
	});

	var rule_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ruleBook = void 0;
	exports.ruleBook = new Map();
	const rule = {
	    add(name, callback) {
	        exports.ruleBook.set(name, callback);
	    },
	    get(name) {
	        const callback = exports.ruleBook.get(name);
	        if (callback === undefined)
	            throw new Error(`Rule "${name}" is not found.`);
	        return callback;
	    },
	    delete(name) {
	        exports.ruleBook.delete(name);
	    }
	};
	exports.default = rule;
	});

	var plugin = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.plugin = exports.pluginBox = void 0;
	exports.pluginBox = new Map();
	exports.plugin = {
	    add(name, method) {
	        exports.pluginBox.set(name, method);
	    },
	    get(name) {
	        const method = exports.pluginBox.get(name);
	        if (method === undefined)
	            throw new Error(`Plugin "${name}" is not found.`);
	        return method;
	    },
	    delete(name) {
	        exports.pluginBox.delete(name);
	    }
	};
	});

	var config_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const config = {
	    customAttrPrefix: 'k-',
	    errorMessageWrapper: 'span',
	    verbose: true,
	    errorClassName: 'kensho-has-error',
	    autocomplete: false,
	    HTML5novalidate: true
	};
	exports.default = config;
	});

	var rules = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.letters = exports.equal = exports.age = exports.zero = exports.negativeNumber = exports.positiveNumber = exports.naturalNumber = exports.integer = exports.number = exports.list = exports.email = exports.regexp = exports.empty = exports.required = void 0;
	const required = value => {
	    if (typeof value === 'string')
	        return value.trim() !== '';
	    if (typeof value === 'number')
	        return true;
	    if (Array.isArray(value))
	        return value.length !== 0;
	    if (typeof value === 'object' && value !== null)
	        return Object.keys(value).length !== 0;
	    if (value === undefined || value === null)
	        return false;
	    return true;
	};
	exports.required = required;
	const empty = (value) => {
	    if (typeof value === 'string')
	        return value === '';
	    if (typeof value === 'number')
	        return false;
	    if (Array.isArray(value))
	        return value.length === 0;
	    if (typeof value === 'object' && value !== null)
	        return Object.keys(value).length === 0;
	    if (value === undefined)
	        return true;
	    return false;
	};
	exports.empty = empty;
	const regexp = (value, { regexp }) => {
	    return regexp.test(value);
	};
	exports.regexp = regexp;
	const email = (value, option, Kensho) => {
	    return Kensho.validate('regexp', value, { regexp: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ });
	};
	exports.email = email;
	const list = (value, { list }, Kensho) => {
	    let hit = false;
	    for (let i = 0, l = list.length; i < l; i++) {
	        if (value instanceof RegExp) {
	            hit = Kensho.validate('regexp', list[i], { regexp: value });
	            if (hit)
	                break;
	        }
	        else if (value === list[i]) {
	            hit = true;
	            break;
	        }
	    }
	    return hit;
	};
	exports.list = list;
	const number = value => {
	    if (typeof value === 'number')
	        return true;
	    if (value.trim() === '')
	        return false;
	    return !Number.isNaN(value * 1);
	};
	exports.number = number;
	const integer = (value, option, Kensho) => {
	    if (!Kensho.validate('number', value))
	        return false;
	    if (typeof value === 'string') {
	        value = parseInt(value, 10);
	    }
	    return value % 1 === 0;
	};
	exports.integer = integer;
	const naturalNumber = (value, { zero = false }, Kensho) => {
	    if (!Kensho.validate('integer', value))
	        return false;
	    if (typeof value === 'string') {
	        value = parseInt(value, 10);
	    }
	    if (zero && value === 0)
	        return true;
	    return value > 0;
	};
	exports.naturalNumber = naturalNumber;
	const positiveNumber = (value, option, Kensho) => {
	    if (!Kensho.validate('number', value))
	        return false;
	    if (typeof value === 'string') {
	        value = parseInt(value, 10);
	    }
	    return value > 0;
	};
	exports.positiveNumber = positiveNumber;
	const negativeNumber = (value, option, Kensho) => {
	    if (!Kensho.validate('number', value))
	        return false;
	    if (typeof value === 'string') {
	        value = parseInt(value, 10);
	    }
	    return value < 0;
	};
	exports.negativeNumber = negativeNumber;
	const zero = (value, option, Kensho) => {
	    if (!Kensho.validate('number', value))
	        return false;
	    if (typeof value === 'string') {
	        value = parseInt(value, 10);
	    }
	    return value === 0;
	};
	exports.zero = zero;
	const age = (value, { max = 125 }, Kensho) => {
	    if (!Kensho.validate('naturalNumber', value, { zero: true }))
	        return false;
	    if (typeof value === 'string') {
	        value = parseInt(value, 10);
	    }
	    return value <= max;
	};
	exports.age = age;
	const equal = (value, { others, isInput = true }) => {
	    let result = true;
	    if (typeof others === 'string')
	        others = [others];
	    for (const other of others) {
	        let otherValue;
	        if (isInput) {
	            const element = document.querySelector(other);
	            if (!element) {
	                result = false;
	                break;
	            }
	            otherValue = element.value;
	        }
	        else {
	            otherValue = other;
	        }
	        if (value !== otherValue) {
	            result = false;
	            break;
	        }
	    }
	    return result;
	};
	exports.equal = equal;
	const letters = (value, { range = {} }) => {
	    const fixRange = Object.assign({ min: -1, max: -1 }, range);
	    fixRange.min = typeof fixRange.min === 'string' ? parseInt(fixRange.min, 10) : fixRange.min;
	    fixRange.max = typeof fixRange.max === 'string' ? parseInt(fixRange.max, 10) : fixRange.max;
	    if (fixRange.min < 0 && fixRange.max < 0)
	        throw new Error('To use the letters rule, you need to specify number that is 0 or more for either `range.min` or `range.max`');
	    if (fixRange.min < 0 && fixRange.max >= 0)
	        return value.length <= fixRange.max;
	    if (fixRange.min >= 0 && fixRange.max < 0)
	        return value.length >= fixRange.min;
	    if (fixRange.min > fixRange.max)
	        throw new Error('You cannot specify a number larger than `range.max` in `range.min`');
	    if (fixRange.min >= 0 && fixRange.max >= 0)
	        return value.length >= fixRange.min && value.length <= fixRange.max;
	    return false;
	};
	exports.letters = letters;
	});

	var tslib_1 = /*@__PURE__*/getAugmentedNamespace(tslib_es6);

	var plugins = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.squash = exports.is2byte = exports.is1byte = exports.full2half = exports.half2full = exports.charWidthMapAssign = void 0;

	const Kensho_1$1 = tslib_1.__importDefault(Kensho_1);
	const charWidthMap = {};
	Object.assign(charWidthMap, {
	    '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
	    '５': '5', '６': '6', '７': '7', '８': '8', '９': '9'
	});
	Object.assign(charWidthMap, {
	    'ａ': 'a', 'ｂ': 'b', 'ｃ': 'c', 'ｄ': 'd', 'ｅ': 'e',
	    'ｆ': 'f', 'ｇ': 'g', 'ｈ': 'h', 'ｉ': 'i', 'ｊ': 'j',
	    'ｋ': 'k', 'ｌ': 'l', 'ｍ': 'm', 'ｎ': 'n', 'ｏ': 'o',
	    'ｐ': 'p', 'ｑ': 'q', 'ｒ': 'r', 'ｓ': 's', 'ｔ': 't',
	    'ｕ': 'u', 'ｖ': 'v', 'ｗ': 'w', 'ｘ': 'x', 'ｙ': 'y',
	    'ｚ': 'z'
	});
	Object.assign(charWidthMap, {
	    'Ａ': 'A', 'Ｂ': 'B', 'Ｃ': 'C', 'Ｄ': 'D', 'Ｅ': 'E',
	    'Ｆ': 'F', 'Ｇ': 'G', 'Ｈ': 'H', 'Ｉ': 'I', 'Ｊ': 'J',
	    'Ｋ': 'K', 'Ｌ': 'L', 'Ｍ': 'M', 'Ｎ': 'N', 'Ｏ': 'O',
	    'Ｐ': 'P', 'Ｑ': 'Q', 'Ｒ': 'R', 'Ｓ': 'S', 'Ｔ': 'T',
	    'Ｕ': 'U', 'Ｖ': 'V', 'Ｗ': 'W', 'Ｘ': 'X', 'Ｙ': 'Y',
	    'Ｚ': 'Z'
	});
	Object.assign(charWidthMap, {
	    '－': '-', '（': '(', '）': ')', '＿': '_', '／': '/',
	    '＋': '+', '：': ':', '；': ';', '］': ']', '［': '[',
	    '＠': '@', '！': '!', '＜': '<', '＞': '>', '？': '?',
	    '｛': '{', '｝': '}', '＊': '*', '”': '"', '’': "'",
	    '〜': '~', '＾': '^', '￥': '¥', '｜': '|', '＆': '&',
	    '％': '%', '＃': '#', '＄': '$', '　': ' ', '＝': '='
	});
	const charWidthMapAssign = function (map) {
	    Object.assign(charWidthMap, map);
	};
	exports.charWidthMapAssign = charWidthMapAssign;
	const half2full = function (str) {
	    return str.split('').map(char => {
	        let returnVal = char;
	        if (Kensho_1$1.default.use('is2byte', char))
	            return returnVal;
	        for (const [key, value] of Object.entries(charWidthMap)) {
	            if (value === char) {
	                returnVal = key;
	                break;
	            }
	        }
	        return returnVal;
	    }).join('');
	};
	exports.half2full = half2full;
	const full2half = function (str) {
	    return str.split('').map(char => {
	        let returnVal = char;
	        if (Kensho_1$1.default.use('is1byte', char))
	            return returnVal;
	        for (const [key, value] of Object.entries(charWidthMap)) {
	            if (key === char) {
	                returnVal = value;
	                break;
	            }
	        }
	        return returnVal;
	    }).join('');
	};
	exports.full2half = full2half;
	const _isNbyte = (half, char) => {
	    const code = char.charCodeAt(0);
	    const f = (code >= 0x0 && code < 0x81) || (code === 0xf8f0) || (code >= 0xff61 && code < 0xffa0) || (code >= 0xf8f1 && code < 0xf8f4);
	    return half ? f : !f;
	};
	const is1byte = (char) => {
	    return _isNbyte(true, char);
	};
	exports.is1byte = is1byte;
	const is2byte = function (char) {
	    return _isNbyte(false, char);
	};
	exports.is2byte = is2byte;
	const squash = function (str, linebreak = false) {
	    const regexp = linebreak ? /([^\S]|[\t\n])+/gm : /([^\S]|\t)+/gm;
	    return str.trim().replace(regexp, '');
	};
	exports.squash = squash;
	});

	var Kensho_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	const rule_1$1 = tslib_1.__importDefault(rule_1);

	const config_1$1 = tslib_1.__importDefault(config_1);
	const _rules = tslib_1.__importStar(rules);
	const _plugins = tslib_1.__importStar(plugins);
	const defaultRules = _rules;
	const _unitNameSeed_ = (() => {
	    const list = [];
	    const makeSeed = () => {
	        let seed = `k_${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
	        if (typeof list.find(elm => elm === seed) === 'string')
	            seed = makeSeed();
	        return seed;
	    };
	    return () => {
	        const seed = makeSeed();
	        list.push(seed);
	        return seed;
	    };
	})();
	class Kensho {
	    constructor(formSelector, option = {}) {
	        this.isDestroyed = false;
	        option = Object.assign({
	            search: true
	        }, option);
	        if (typeof formSelector === 'string') {
	            const _form = document.querySelector(formSelector);
	            if (_form === null)
	                throw new Error(`form "${formSelector}" is not found.`);
	            formSelector = _form;
	        }
	        this.form = formSelector;
	        {
	            this.defaultHasAutoCompleteAttr = this.form.getAttribute('autocomplete') !== null ? true : false;
	            this.defaultAutoComplete = this.form.autocomplete;
	            if (!Kensho.config.autocomplete) {
	                this.form.setAttribute('autocomplete', 'off');
	                this.form.autocomplete = 'off';
	            }
	        }
	        this.ruleUnits = new Map();
	        this.form.classList.add('kensho-form');
	        if (option.search) {
	            this.addFromUnitElements(this.search());
	        }
	        return this;
	    }
	    static validate(ruleName, ...args) {
	        if (args[1] === undefined) {
	            return rule_1$1.default.get(ruleName)(args[0], {}, Kensho);
	        }
	        else {
	            return rule_1$1.default.get(ruleName)(args[0], args[1], Kensho);
	        }
	    }
	    static use(pluginName, ...args) {
	        const plugin = Kensho.plugin.get(pluginName).bind(Kensho);
	        return plugin(...args);
	    }
	    destroy() {
	        this.form.autocomplete = this.defaultAutoComplete;
	        if (this.defaultHasAutoCompleteAttr) {
	            this.form.setAttribute('autocomplete', this.defaultAutoComplete);
	        }
	        else {
	            this.form.removeAttribute('autocomplete');
	        }
	        this.form.classList.remove('kensho-form');
	        this.removeAll();
	        this.isDestroyed = true;
	    }
	    addFromUnitElements(inputElmsData) {
	        const attrPrefix = Kensho.config.customAttrPrefix;
	        for (const [unitName, data] of Object.entries(inputElmsData)) {
	            if (this.ruleUnits.get(unitName) !== undefined)
	                throw new Error(`The "${unitName}" rule unit is already exsisted.`);
	            const _inputElm = data.input;
	            const name = unitName;
	            const errorElement = data.error;
	            const rawRule = _inputElm.getAttribute(`${attrPrefix}rule`);
	            if (rawRule === null)
	                throw new Error(`The \`k-rule\` attribute is not found in the element where \`k-name="${unitName}"\` is specified.`);
	            const rule = this.parseAttrString2Array(rawRule);
	            let inputElement = data.input;
	            const typeAttr = data.input.getAttribute('type');
	            if (typeAttr === 'radio') {
	                inputElement = this.form.querySelectorAll(`input[name="${data.input.getAttribute('name')}"]`);
	            }
	            const strEvents = _inputElm.getAttribute(`${attrPrefix}event`);
	            let rawEvent = strEvents !== null ? strEvents : undefined;
	            if (typeof rawEvent === 'string') {
	                rawEvent = this.parseAttrString2Array(rawEvent);
	            }
	            const event = rawEvent;
	            const strMessage = _inputElm.getAttribute(`${attrPrefix}message`);
	            let rawErrorMessage = strMessage !== null ? strMessage : undefined;
	            if (typeof rawErrorMessage === 'string') {
	                rawErrorMessage = rawErrorMessage
	                    .trim()
	                    .replace(/\n/gm, '')
	                    .replace(/'/g, '"');
	                if (/^{.+}$/.test(rawErrorMessage)) {
	                    rawErrorMessage = JSON.parse(rawErrorMessage);
	                }
	            }
	            const errorMessage = rawErrorMessage;
	            const strFilter = _inputElm.getAttribute(`${attrPrefix}filter`);
	            let rawFilter = strFilter !== null ? strFilter : '';
	            let valueFilter;
	            if (typeof rawFilter === 'string') {
	                rawFilter = this.parseAttrString2Array(rawFilter);
	                valueFilter = function (value, Kensho) {
	                    for (const filter of rawFilter) {
	                        if (typeof filter === 'string') {
	                            value = Kensho.use(filter, value);
	                        }
	                        else {
	                            value = Kensho.use(filter[0], value, ...filter[1]);
	                        }
	                    }
	                    return value;
	                };
	            }
	            this.add({
	                inputElement,
	                errorElement,
	                errorMessage,
	                rule,
	                event,
	                valueFilter,
	                name
	            });
	        }
	    }
	    search() {
	        const prefix = Kensho.config.customAttrPrefix;
	        const match = this.form.querySelectorAll(`*[${prefix}name]`);
	        const _list = {};
	        for (const item of match) {
	            let name = item.getAttribute(`${prefix}name`);
	            const type = /\.error$/.test(name) ? 'error' : 'input';
	            if (type === 'error') {
	                name = name.replace('.error', '');
	            }
	            if (_list[name] === undefined) {
	                _list[name] = {};
	            }
	            if (type === 'input') {
	                if (_list[name].input !== undefined) {
	                    throw new Error(`There are two or more \`k-name\` attributes of the same value. "${name}"`);
	                }
	                _list[name].input = item;
	            }
	            else if (type === 'error') {
	                if (_list[name].error !== undefined) {
	                    throw new Error(`There are two or more \`k-name\` attributes of the same value. "${name}.error"`);
	                }
	                _list[name].error = item;
	            }
	        }
	        const list = {};
	        for (const [name, obj] of Object.entries(_list)) {
	            if (obj.input !== undefined) {
	                list[name] = obj;
	            }
	            else {
	                throw new Error(`No \`k-name="${name}"\` attribute in HTML input form against \`k-name="${name}.error"\``);
	            }
	        }
	        return list;
	    }
	    add(param) {
	        if (typeof param.inputElement === 'string') {
	            const _elmSelector = param.inputElement;
	            param.inputElement = this.form.querySelectorAll(_elmSelector);
	            if (param.inputElement.length === 0)
	                throw new Error(`inputElement parameter "${_elmSelector}" is not found in the form.`);
	        }
	        if (param.inputElement instanceof HTMLInputElement) {
	            param.inputElement = [param.inputElement];
	        }
	        else if (param.inputElement instanceof HTMLSelectElement) {
	            param.inputElement = [param.inputElement];
	        }
	        else if (param.inputElement instanceof NodeList) {
	            if (param.inputElement.length === 0)
	                throw new Error('inputElement parameter length is 0');
	            const _arr = [];
	            param.inputElement.forEach(elm => { _arr.push(elm); });
	            param.inputElement = _arr;
	        }
	        if (typeof param.rule === 'string') {
	            param.rule = [[param.rule, {}]];
	        }
	        param.rule = param.rule.map(rule => {
	            return typeof rule === 'string' ? [rule, {}] : rule;
	        });
	        if (param.errorMessage === undefined) {
	            param.errorMessage = {};
	        }
	        else if (typeof param.errorMessage === 'string') {
	            param.errorMessage = { default: param.errorMessage };
	        }
	        param.errorMessage = Object.assign({ default: 'The value has error.' }, param.errorMessage);
	        if (param.errorElement === undefined) {
	            param.errorMessage = undefined;
	        }
	        else if (typeof param.errorElement === 'string') {
	            const _elmSelector = param.errorElement;
	            const _elm = this.form.querySelector(param.errorElement);
	            if (_elm === null)
	                throw new Error(`errorElement parameter "${_elmSelector}" is not found in the form.`);
	            param.errorElement = _elm;
	        }
	        if (param.event === undefined) {
	            param.event = [];
	        }
	        else if (typeof param.event === 'string') {
	            param.event = [param.event];
	        }
	        if (param.name === undefined)
	            param.name = _unitNameSeed_();
	        const tagName = param.inputElement[0].tagName.toLowerCase();
	        let type = '';
	        if (tagName === 'input') {
	            type = param.inputElement[0].getAttribute('type') || 'text';
	        }
	        else {
	            type = tagName;
	        }
	        if (type === 'password' || type === 'search' || type === 'tel' ||
	            type === 'email' || type === 'url' || type === 'number' ||
	            type === 'datetime' || type === 'date' || type === 'month' ||
	            type === 'week' || type === 'time' || type === 'datetime-local')
	            type = 'text';
	        const eventHandlers = [];
	        param.inputElement.forEach((elem, elemNum) => {
	            const events = param.event;
	            eventHandlers[elemNum] = {};
	            const handlers = eventHandlers[elemNum];
	            events.forEach(event => {
	                handlers[`kenshoEventHandler__${event}`] = () => {
	                    this.validate(param.name);
	                };
	                elem.addEventListener(event, handlers[`kenshoEventHandler__${event}`]);
	            });
	        });
	        const unit = Object.assign({}, param, {
	            tagName,
	            type,
	            error: [],
	            eventHandlers,
	            displayError: param.errorElement !== undefined
	        });
	        this.ruleUnits.set(unit.name, unit);
	        return unit;
	    }
	    remove(ruleUnitName) {
	        const unit = this.getRuleUnit(ruleUnitName);
	        unit.inputElement.forEach((elem, elemNum) => {
	            unit.event.forEach(eventName => {
	                elem.removeEventListener(eventName, unit.eventHandlers[elemNum][`kenshoEventHandler__${eventName}`]);
	            });
	        });
	        this.ruleUnits.delete(ruleUnitName);
	    }
	    removeAll() {
	        const names = [];
	        this.ruleUnits.forEach(unit => {
	            names.push(unit.name);
	        });
	        names.forEach(name => {
	            this.remove(name);
	        });
	    }
	    hasError() {
	        let hasError = false;
	        this.ruleUnits.forEach((val) => {
	            if (val.error.length > 0)
	                hasError = true;
	        });
	        return hasError;
	    }
	    getRuleUnit(ruleUnitName) {
	        const unit = this.ruleUnits.get(ruleUnitName);
	        if (unit === undefined)
	            throw new Error(`${ruleUnitName} is not found.`);
	        return unit;
	    }
	    getInputValue(unit) {
	        let value = '';
	        if (unit.type === 'text') {
	            value = unit.inputElement[0].value;
	        }
	        if (unit.type === 'radio') {
	            for (let i = 0, l = unit.inputElement.length; i < l; i++) {
	                const elem = unit.inputElement[i];
	                if (elem.checked) {
	                    value = elem.value;
	                    break;
	                }
	            }
	        }
	        if (unit.type === 'checkbox') {
	            const elem = unit.inputElement[0];
	            if (elem.checked) {
	                value = elem.value;
	            }
	        }
	        if (unit.type === 'select') {
	            const elem = unit.inputElement[0];
	            value = elem.options[elem.options.selectedIndex].value;
	        }
	        return value;
	    }
	    clear(unit) {
	        unit.error = [];
	        if (unit.displayError) {
	            if (unit.errorElement) {
	                unit.errorElement.innerHTML = '';
	            }
	        }
	    }
	    allClear() {
	        this.ruleUnits.forEach((val, key) => this.clear(this.getRuleUnit(key)));
	    }
	    validate(ruleUnitName) {
	        const unit = this.getRuleUnit(ruleUnitName);
	        let value = this.getInputValue(unit);
	        if (unit.valueFilter !== undefined)
	            value = unit.valueFilter.bind(this)(value, Kensho);
	        this.clear(unit);
	        for (const [ruleName, option] of unit.rule) {
	            if (!Kensho.validate(ruleName, value, option)) {
	                unit.error.push(ruleName);
	            }
	        }
	        if (unit.error.length > 0 && unit.displayError) {
	            this.displayError(unit);
	        }
	        return unit.error.length === 0;
	    }
	    allValidate() {
	        this.ruleUnits.forEach((val, key) => this.validate(key));
	    }
	    displayError(_a) {
	        var { errorElement, displayError, errorMessage } = _a, unit = tslib_1.__rest(_a, ["errorElement", "displayError", "errorMessage"]);
	        if (!errorElement || !displayError || unit.error.length === 0 || !errorMessage)
	            return;
	        const errors = [];
	        const wrapper = Kensho.config.errorMessageWrapper;
	        for (const ruleName of unit.error) {
	            if (ruleName === 'default')
	                continue;
	            const msg = errorMessage[ruleName] === undefined ? `The value failed "${ruleName}" validation rule.` : errorMessage[ruleName];
	            errors.push(`<${wrapper}>${msg}</${wrapper}>`);
	        }
	        const error = Kensho.config.verbose ? errors.join('') : `<${wrapper}>${errorMessage.default}</${wrapper}>`;
	        errorElement.innerHTML = error;
	    }
	    parseAttrString2Array(value) {
	        value = value.trim()
	            .replace(/\s*([0-9a-z\-_]+)\s*,/gmi, '\'$1\',')
	            .replace(/\s*([0-9a-zA-Z\-_]+)$/, '\'$1\'')
	            .replace(/\/(.+)\/([gimsuy]*)/, '"/$1/$2"');
	        value = `[${value}]`
	            .replace(/'/g, '"');
	        const returnVal = JSON.parse(value).map((elem) => this.parseString2RightType(elem));
	        return returnVal;
	    }
	    parseString2RightType(val) {
	        if (Array.isArray(val)) {
	            val = val.map(v => this.parseString2RightType(v));
	        }
	        else if (typeof val === 'object') {
	            for (const key in val) {
	                val[key] = this.parseString2RightType(val[key]);
	            }
	        }
	        else if (typeof val === 'string') {
	            const match = (val.match(/(\/.+\/)([gimsuy]*)/));
	            if (match !== null) {
	                match[1] = match[1].replace(/^\//, '').replace(/\/$/, '');
	                val = match[2] === '' ? new RegExp(match[1]) : new RegExp(match[1], match[2]);
	            }
	        }
	        return val;
	    }
	}
	Kensho.config = config_1$1.default;
	Kensho.rule = rule_1$1.default;
	Kensho.plugin = plugin.plugin;
	exports.default = Kensho;
	for (const [ruleName, callback] of Object.entries(defaultRules)) {
	    Kensho.rule.add(ruleName, callback);
	}
	for (const [pluginName, method] of Object.entries(_plugins)) {
	    Kensho.plugin.add(pluginName, method);
	}
	});

	var Kensho = /*@__PURE__*/getDefaultExportFromCjs(Kensho_1);

	return Kensho;

}());
