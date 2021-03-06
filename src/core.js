/**
 * @module Core
 */

import { doc, quickExpr, rneedsContext } from './config/const';
import { getExpando } from './config/var';
import ys from './tools/ys';
import extend from './tools/extend';
import merge from './tools/merge';
import { trimLeft } from './tools/string';
import parseHTML from './lib/parseHTML';
import { qsa, matchSelector, contains } from './lib/qsa';
import { closest } from './lib/selector';
import { removeAttr, attr, prop, hasAttr, value } from './lib/attributes';
import { uniqueSort } from './jquery/core';
import { winnow } from './jquery/findFilter';
import { remove } from './lib/manipulation';
import { on, one, off, trigger } from './jquery/events';

function isHTML(str) {
  // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
  if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

  // Run the regex
  var match = quickExpr.exec(str);
  return !!(match && match[1]);
}

/**
 * Remake the list
 *
 * @param {String|ELement|context} context
 * @return {List}
 * @api private
 */
function List(els = [], selector = '') {
  els = uniqueSort(els);
  const len = (this.length = els.length);
  for (let i = 0; i < len; i++) {
    this[i] = els[i];
  }
  this.selector = selector;
}
List.fn = List.prototype;
List.fn.length = 0;
List.fn.toArray = function() {
  return Array.prototype.slice.call(this);
};
List.fn.splice = Array.prototype.splice;
List.fn.slice = function() {
  return this.pushStack(Array.prototype.slice.apply(this, arguments), 'slice', Array.prototype.slice.call(arguments).join(','));
};
List.fn.push = Array.prototype.push;
List.fn.forEach = List.fn.each = function(callback) {
  const l = this.length;
  let t;
  for (let i = 0; i < l; i++) {
    t = this[i];

    if (callback && callback.call(t, i, t) === false) {
      return this;
    }
  }
  return this;
};

// add attributes
List.fn.removeAttr = removeAttr;
List.fn.hasAttr = hasAttr;
List.fn.attr = attr;
List.fn.prop = prop;
List.fn.val = value;

List.fn.pushStack = function(els, name = '', selector = '') {
  let ret = new List(els, els.selector || '');
  if (name === 'find') {
    ret.selector = this.selector + (this.selector ? ' ' : '') + selector;
  } else if (name) {
    ret.selector = `${this.selector}.${name}(${selector})`;
  }
  return ret;
};

List.fn.get = function(num) {
  // eslint-disable-next-line eqeqeq
  return num == null
    ? this.toArray()
    : // Return just the object
      num < 0
      ? this[this.length + num]
      : this[num];
};

List.fn.is = function(selector) {
  return !!winnow(
    this,
    // If this is a positional/relative selector, check membership in the returned set
    // so $("p:first").is("p:last") won't return true for a doc with two "p".
    typeof selector === 'string' && rneedsContext.test(selector) ? dom(selector) : selector || [],
    false
  ).length;
};

List.fn.not = function(selector) {
  return this.pushStack(uniqueSort(winnow(this, selector || [], true)));
};

List.fn.filter = function(selector) {
  return this.pushStack(uniqueSort(winnow(this, selector || [], false)));
};

List.fn.find = function(selector) {
  const self = this;
  let ret = null;

  if (ys.str(selector)) {
    return dom(selector).filter(function() {
      for (let i = 0, l = self.length; i < l; i++) {
        if (dom.contains(self[i], this)) {
          return true;
        }
      }
    });
  }

  ret = this.pushStack('', 'find', selector);

  for (let i = 0, l = this.length; i < l; i++) {
    const length = ret.length;
    ret = merge(ret, dom(selector, this[i]));

    if (i > 0) {
      // Make sure that the results are unique
      for (let n = length; n < ret.length; n++) {
        for (let r = 0; r < length; r++) {
          if (ret[r] === ret[n]) {
            ret.splice(n--, l);
            break;
          }
        }
      }
    }
  }

  return ret;
};

List.fn.has = function(target) {
  const targets = [];
  this.forEach(function() {
    merge(targets, dom(target, this));
  });
  return this.filter(function() {
    for (let i = 0; i < targets.length; i++) {
      if (dom.contains(this, targets[i])) {
        return true;
      }
    }
  });
};

List.fn.add = function(selector, context = doc) {
  return this.pushStack(uniqueSort(merge(this.get(), dom(selector, context))));
};

List.fn.eq = function(i) {
  const len = this.length;
  let j = i + (i < 0 ? len : 0);
  return this.pushStack(j >= 0 && j < len ? [this[j]] : [], 'eq:', `${i}`);
};

List.fn.first = function() {
  return this.eq(0);
};

List.fn.last = function() {
  return this.length ? this.eq(this.length - 1) : new this.constructor();
};

List.fn.remove = function(selector) {
  return remove(this, selector);
};

/* classes */
List.fn.addClass = function(className) {
  if (!name) {
    return this;
  }
  return this.forEach(function() {
    this.classList.add(className);
  });
};

List.fn.removeClass = function(className) {
  return this.forEach(function() {
    this.classList.remove(className);
  });
};

List.fn.toggleClass = function(className) {
  return this.forEach(function() {
    this.classList.toggle(className);
  });
};

List.fn.hasClass = function(className) {
  if (this[0]) {
    return this[0].classList.contains(className);
  }
  return false;
};

// add dom operator
List.fn.closest = List.fn.parent = closest;

/**
 * @name on
 * @param {string, object} event
 * @param {string} [selector]
 * @param {function} [fn]
 * @param {object} [options]
 */
List.fn.on = function(event, selector, fn, options) {
  /**
   * @description Event can be a map of types/handlers
   * @argument event = { type1: fn1, type2: fn2 }
   * @argument selector = fn || selector
   * @argument options = fn || options
   */
  if (ys.obj(event)) {
    // ( types-Object, selector, options)
    if (ys.str(selector)) {
      options = fn;
    }

    if (ys.obj(selector)) {
      options = selector;
      selector = undefined;
    }

    fn = undefined;

    for (let name in event) {
      on(this, name, selector, event[name], options);
    }

    return this;
  }

  /**
   * @argument {string} event
   * @argument {string} [selector]
   * @argument {function} fn
   */
  if (!ys.str(selector)) {
    options = fn;
    fn = selector;
    selector = undefined;
  }
  on(this, event, selector, fn, options);
  return this;
};

List.fn.one = List.fn.once = function(event, selector, fn, options) {
  /**
   * @description Event can be a map of types/handlers
   * @argument event = { type1: fn1, type2: fn2 }
   * @argument selector = fn || selector
   * @argument options = fn || options
   */
  if (ys.obj(event)) {
    // ( types-Object, selector, options)
    if (ys.str(selector)) {
      options = fn;
    }

    if (ys.obj(selector)) {
      options = selector;
      selector = undefined;
    }

    fn = undefined;

    for (let name in event) {
      one(this, name, selector, event[name], options);
    }

    return this;
  }

  /**
   * @argument {string} event
   * @argument {string} [selector]
   * @argument {function} fn
   */
  if (!ys.str(selector)) {
    options = fn;
    fn = selector;
    selector = undefined;
  }

  one(this, event, selector, fn, options);
  return this;
};

List.fn.off = function(event, selector, fn) {
  off(this, event, selector, fn);
  return this;
};

List.fn.trigger = function(event, data) {
  return this.forEach(function() {
    trigger(event, data, this);
  });
};

/**
 * Return a dom `List` for the given
 * `html`, selector, or element.
 *
 * @param {String|Element|List} selector
 * @param {String|ELement|context} context
 * @return {List}
 * @api public
 */
function dom(selector, context = doc) {
  // ready function
  if (ys.func(selector)) {
    return dom.ready(selector);
  }
  // array like
  if (ys.array(selector)) {
    return new List(selector);
  }

  // List
  if (selector instanceof List) {
    return selector;
  }

  // nodeName
  if (selector.nodeName) {
    return new List([selector]);
  }

  if (!ys.str(selector)) {
    throw new TypeError('invalid selector');
  }

  // html
  const htmlSelector = trimLeft(selector);
  if (isHTML(htmlSelector)) {
    return new List([parseHTML(htmlSelector)], htmlSelector);
  }

  // selector
  const _context = context ? (context instanceof List ? context[0] : context) : doc;

  return new List(dom.qsa(selector, _context), selector);
}

dom.ready = function(fn) {
  const fns = [],
    hack = doc && doc.documentElement.doScroll,
    domContentLoaded = 'DOMContentLoaded';
  let listener;
  let loaded = doc && (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);
  if (!loaded && doc) {
    doc.addEventListener(
      domContentLoaded,
      (listener = function() {
        doc.removeEventListener(domContentLoaded, listener);
        loaded = 1;
        while ((listener = fns.shift())) listener();
      })
    );
  }
  return loaded ? setTimeout(fn, 0) : fns.push(fn);
};

dom.fn = List.fn;

dom.fn.extend = function(plugins) {
  extend(List.prototype, plugins);
};

dom.List = List;

dom.isHTML = isHTML;

dom.expando = List.expando = getExpando();

dom.contains = contains;
/**
 * @description 根据选择符查询dom集合
 * @override 可由第三方重写覆盖
 */
dom.query = dom.qsa = dom.find = qsa;

/**
 * @description 检测给定的元素是否匹配给定的选择符
 * @override 可由第三方重写覆盖
 */
dom.match = dom.matches = dom.matchSelector = matchSelector;

export default dom;
