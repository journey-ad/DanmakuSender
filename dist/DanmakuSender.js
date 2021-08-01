(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DanmakuSender = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var Utils = {
    uint32: function uint32(num) {
      return num >>> 0;
    }
  };
  var utils = Utils;

  var DanmakuSender = /*#__PURE__*/function () {
    function DanmakuSender() {
      _classCallCheck(this, DanmakuSender);

      DanmakuSender.createTable();
    }

    _createClass(DanmakuSender, [{
      key: "parse",
      value: function parse(userId) {
        var deepCheckData = new Array(2);
        var index = new Array(4);
        var ht = utils.uint32(parseInt("0x".concat(userId), 16));
        ht ^= 0xffffffff;
        var i;

        for (i = 3; i > -1; i--) {
          index[3 - i] = DanmakuSender.getCrcIndex(ht >>> i * 8);
          var snum = utils.uint32(DanmakuSender.crctable[index[3 - i]]);
          ht ^= snum >>> (3 - i) * 8;
        }

        for (i = 0; i < 1000000000; i++) {
          var lastindex = utils.uint32(DanmakuSender.crc32LastIndex(String(i)));

          if (lastindex === index[3]) {
            deepCheckData = DanmakuSender.deepCheck(i, index);

            if (deepCheckData[0] !== 0) {
              break;
            }
          }
        }

        if (i === 1000000000) {
          return "-1";
        }

        return "".concat(i).concat(deepCheckData[1]);
      }
    }], [{
      key: "createTable",
      value: function createTable() {
        for (var i = 0; i < 256; i++) {
          var crcreg = utils.uint32(i);

          for (var j = 0; j < 8; j++) {
            if ((crcreg & 1) != 0) {
              crcreg = utils.uint32(this.CRCPOLYNOMIAL ^ crcreg >>> 1);
            } else {
              crcreg >>>= 1;
            }
          }

          this.crctable[i] = crcreg;
        }
      }
    }, {
      key: "crc32",
      value: function crc32(userId) {
        var crcstart = 0xFFFFFFFF;

        for (var i = 0; i < userId.length; i++) {
          var index = utils.uint32((crcstart ^ userId.charCodeAt(i)) & 255);
          crcstart = crcstart >>> 8 ^ this.crctable[index];
        }

        return crcstart;
      }
    }, {
      key: "crc32LastIndex",
      value: function crc32LastIndex(userId) {
        var index = 0;
        var crcstart = 0xFFFFFFFF;

        for (var i = 0; i < userId.length; i++) {
          index = utils.uint32((crcstart ^ userId.charCodeAt(i)) & 255);
          crcstart = crcstart >>> 8 ^ this.crctable[index];
        }

        return index;
      }
    }, {
      key: "getCrcIndex",
      value: function getCrcIndex(t) {
        for (var i = 0; i < 256; i++) {
          if (this.crctable[i] >>> 24 === t) {
            return i;
          }
        }

        return -1;
      }
    }, {
      key: "deepCheck",
      value: function deepCheck(i, index) {
        var resultArray = new Array(2);
        var result = "";
        var tc; // = 0x00;

        var hashcode = this.crc32(String(i));
        tc = utils.uint32(hashcode & 0xff ^ index[2]);

        if (!(tc <= 57 && tc >= 48)) {
          resultArray[0] = 0;
          return resultArray;
        }

        result += String(tc - 48);
        hashcode = this.crctable[index[2]] ^ hashcode >>> 8;
        tc = utils.uint32(hashcode & 0xff ^ index[1]);

        if (!(tc <= 57 && tc >= 48)) {
          resultArray[0] = 0;
          return resultArray;
        }

        result += String(tc - 48);
        hashcode = this.crctable[index[1]] ^ hashcode >>> 8;
        tc = utils.uint32(hashcode & 0xff ^ index[0]);

        if (!(tc <= 57 && tc >= 48)) {
          resultArray[0] = 0;
          return resultArray;
        }

        result += String(tc - 48); //hashcode = this.crctable[index[0]] ^ (hashcode >>> 8);

        resultArray[0] = 1;
        resultArray[1] = result;
        return resultArray;
      }
    }]);

    return DanmakuSender;
  }();

  _defineProperty(DanmakuSender, "CRCPOLYNOMIAL", 0xEDB88320);

  _defineProperty(DanmakuSender, "crctable", new Array(256));

  return DanmakuSender;

})));
