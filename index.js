"use strict";

/**
 * @param [Object] opts
 *   - {Object} rule default {} required
 *   - {String | Function} message default function(key){return `${key} is required`} optional
 */  

function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}

function isFunction(o) {
  return Object.prototype.toString.call(o) === "[object Function]";
}

function isString(o) {
  return Object.prototype.toString.call(o) === "[object String]";
}

function isUndefined(o) {
  return Object.prototype.toString.call(o) === "[object Undefined]";
}

function formatRule(o) {
  let ary = [];
  const keys = Object.keys(o);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const item = o[key];
    if (isObject(item)) {
      const itemKeys = Object.keys(item);
      for (let j = 0; j < itemKeys.length; j++) {
        const itemKey = itemKeys[j];
        const ele = item[itemKey];
        ary.push({
          ...ele,
          childKey: itemKey,
          parentKey: key,
        });
      }
    } else if (Array.isArray(item)) {
      for (let j = 0; j < item.length; j++) {
        const ele = item[j];
        if (typeof ele === "string") {
          ary.push({
            childKey: ele,
            parentKey: key,
          });
        } else if (isObject(ele)) {
          ary.push({
            ...ele,
            childKey: itemKey,
            parentKey: key,
          });
        }
      }
    }
  }
  return ary;
}

function formatMessage(o, key) {
  if (isFunction(o)) {
    return o(key);
  } else if (o && isString(o)) {
    return o;
  }
  return `${key} is required`
}

module.exports = function (opts) {
  const rule = opts.rule || {};
  const msg = opts.message;
  const defaultCode = opts.status || 400;
  /**
   * @param [Object] rule
   * @param [String,Function] message
   *
   * @example
   *   @param [Array] query
   *      @param query: [{
   *      id: {
   *      required: true,
   *      validator: function(value){  [Boolean or Promise]
   *        return value
   *      }
   *    }
   * }]
   */
  return async function (ctx, next) {
    let errItem = {};
    if (isObject(rule)) {
      const ary = formatRule(rule);
      for (let i = 0; i < ary.length; i++) {
        const item = ary[i];
        const itemCtx = ctx[item.parentKey];
        if (itemCtx && isObject(itemCtx)) {
          const ele = itemCtx[item.childKey];
          if (isUndefined(ele)) {
            errItem = item;
            break;
          } else if (itemCtx.validator && isFunction(itemCtx.validator)) {
            const res = await itemCtx.validator(ele);
            if (!res) {
              errItem = item;
              break;
            }
          }
        } else {
          throw Error(`context has not params ${item.parentKey}`);
        }
      }
      if (errItem.childKey) {
        ctx.body = {
          status: errItem.status || defaultCode,
          message: formatMessage( errItem.message || msg, errItem.childKey),
        };
      }
      return next();
    } else {
      throw Error(`rule must be a object`);
    }
  };
};
