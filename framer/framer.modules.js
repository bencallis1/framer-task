require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Path":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.Path = (function(superClass) {
  var animate, animating, animations, bezier, close, path, point, points, quadratic;

  extend(Path, superClass);

  path = [];

  animating = [];

  point = [];

  animate = [];

  quadratic = [];

  bezier = [];

  close = [];

  animations = points = 0;

  function Path(options) {
    var pathBegin, pathEnd, svgEnd, svgStart;
    options = _.defaults(options, this.pointVisible = this.handleVisible = false, this.pointSize = 4, this.handleSize = 2, this.strokeWidth = 1, this.pointColor = this.handleColor = this.strokeColor = "white", this.fill, this.path = {
      animationOptions: {
        time: 1,
        curve: "bezier-curve"
      },
      draggable: false,
      point: (function(_this) {
        return function(p) {
          var cx, cy, i, j, obj, ref;
          point[points] = new Layer({
            name: "Point #" + points,
            backgroundColor: _this.pointColor,
            superLayer: _this,
            width: _this.pointSize,
            height: _this.pointSize,
            borderRadius: _this.pointSize / 2,
            x: p.x - _this.pointSize / 2,
            y: p.y - _this.pointSize / 2
          });
          animate[points] = new Animation;
          if (_this.pointVisible === false) {
            point[points].opacity = 0;
          }
          if (_this.path.draggable === true) {
            point[points].draggable = true;
          }
          if (p.quadratic === "first" || p.bezier === "first" || p.bezier === "second") {
            point[points].name = "Point #" + points + " (handle)";
            point[points].backgroundColor = _this.handleColor;
            point[points].width = _this.handleSize;
            point[points].height = _this.handleSize;
            if (_this.handleVisible === false) {
              point[points].opacity = 0;
            }
          }
          if (p.states !== void 0) {
            animations = points;
            if (Array.isArray(p.states.x) && Array.isArray(p.states.y)) {
              for (i = j = 0, ref = p.states.x.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                cx = p.states.x;
                cy = p.states.y;
                point[points].states.add((
                  obj = {},
                  obj["array " + i] = {
                    x: cx[i],
                    y: cy[i]
                  },
                  obj
                ));
              }
            }
            if (Array.isArray(p.states.x) === false && Array.isArray(p.states.y) === false) {
              point[points].states.add({
                second: {
                  x: p.states.x,
                  y: p.states.y
                }
              });
              animate[points] = new Animation({
                layer: point[points],
                properties: {
                  x: p.states.x,
                  y: p.states.y
                },
                time: _this.path.animationOptions.time,
                curve: _this.path.animationOptions.curve
              });
            }
            if (Array.isArray(p.states.x) && Array.isArray(p.states.y) === false) {
              print("Y values are not an array");
            }
            if (Array.isArray(p.states.x) === false && Array.isArray(p.states.y)) {
              print("X values are not an array");
            }
            point[points].states.animationOptions = _this.path.animationOptions;
          }
          if (p.quadratic === void 0 && p.bezier !== "first") {
            quadratic[points] = false;
            bezier[points] = false;
            if (p.close === true) {
              path.push('L' + p.x);
              close[points] = true;
            } else {
              path.push(p.x);
            }
          }
          if (p.quadratic === "first") {
            bezier[points] = false;
            quadratic[points] = true;
            path.push('Q' + p.x);
          }
          if (p.bezier === "first") {
            quadratic[points] = false;
            bezier[points] = true;
            path.push('C' + p.x);
          }
          path.push(p.y);
          _this.html = svgStart + pathBegin + path + pathEnd + svgEnd;
          return points++;
        };
      })(this),
      animate: (function(_this) {
        return function(t) {
          var execute, i, j, k, ref, ref1, results;
          for (i = j = 0, ref = point.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            if (t === void 0 || t === "states") {
              point[i].states.next();
            } else {
              animate[i].start();
            }
            execute = function() {
              var c, k, ref1;
              for (i = k = 0, ref1 = point.length; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
                c = i + i;
                animating[c] = point[i].x + _this.pointSize / 2;
                if (quadratic[i] === true) {
                  animating[c] = "Q" + animating[c];
                }
                if (bezier[i] === true) {
                  animating[c] = "C" + animating[c];
                }
                if (close[i] === true) {
                  animating[c] = "L" + animating[c];
                }
                animating[c + 1] = point[i].y + _this.pointSize / 2;
              }
              return _this.html = svgStart + pathBegin + animating + pathEnd + svgEnd;
            };
          }
          results = [];
          for (i = k = 0, ref1 = point.length; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
            results.push(point[i].on('change:point', function() {
              return execute();
            }));
          }
          return results;
        };
      })(this),
      quadratic: (function(_this) {
        return function(p) {
          var handle, quadraticPoint;
          if (p.states !== void 0) {
            handle = {
              x: p.x,
              y: p.y,
              states: {
                x: p.states.x,
                y: p.states.y
              },
              quadratic: "first"
            };
            quadraticPoint = {
              x: p.qx,
              y: p.qy,
              states: {
                x: p.states.qx,
                y: p.states.qy
              }
            };
          } else {
            handle = {
              x: p.x,
              y: p.y,
              quadratic: "first"
            };
            quadraticPoint = {
              x: p.qx,
              y: p.qy
            };
          }
          _this.path.point(handle);
          return _this.path.point(quadraticPoint);
        };
      })(this),
      cubic: (function(_this) {
        return function(p) {
          var bezierPoint, handleOne, handleTwo;
          if (p.states !== void 0) {
            handleOne = {
              x: p.cx1,
              y: p.cy1,
              states: {
                x: p.states.cx1,
                y: p.states.cy1
              },
              bezier: "first"
            };
            handleTwo = {
              x: p.cx2,
              y: p.cy2,
              states: {
                x: p.states.cx2,
                y: p.states.cy2
              },
              bezier: "second"
            };
            bezierPoint = {
              x: p.x,
              y: p.y,
              states: {
                x: p.states.x,
                y: p.states.y
              }
            };
          } else {
            handleOne = {
              x: p.cx1,
              y: p.cy1,
              bezier: "first"
            };
            handleTwo = {
              x: p.cx2,
              y: p.cy2,
              bezier: "second"
            };
            bezierPoint = {
              x: p.x,
              y: p.y
            };
          }
          _this.path.point(handleOne);
          _this.path.point(handleTwo);
          return _this.path.point(bezierPoint);
        };
      })(this),
      close: (function(_this) {
        return function(p) {
          p.close = true;
          return _this.path.point(p);
        };
      })(this)
    });
    Path.__super__.constructor.call(this, options);
    svgStart = '<svg height="' + this.height + '" width="' + this.width + '" stroke=' + this.strokeColor + ' stroke-width="' + this.strokeWidth + '" fill="' + this.fill + '">';
    pathBegin = '<path d="M';
    pathEnd = '">';
    svgEnd = '</svg>';
  }

  Path.define("path.animationOptions", {
    get: function() {
      return this._path.animationOptions;
    },
    set: function(value) {
      return this._path.animationOptions = value;
    }
  });

  Path.define("path.draggable", {
    get: function() {
      return this._path.draggable;
    },
    set: function(value) {
      return this._path.draggable = value;
    }
  });

  Path.define("pointVisible", {
    get: function() {
      return this._pointVisible;
    },
    set: function(value) {
      return this._pointVisible = value;
    }
  });

  Path.define("handleVisible", {
    get: function() {
      return this._handleVisible;
    },
    set: function(value) {
      return this._handleVisible = value;
    }
  });

  Path.define("pointSize", {
    get: function() {
      return this._pointSize;
    },
    set: function(value) {
      return this._pointSize = value;
    }
  });

  Path.define("handleSize", {
    get: function() {
      return this._handleSize;
    },
    set: function(value) {
      return this._handleSize = value;
    }
  });

  Path.define("pointColor", {
    get: function() {
      return this._pointColor;
    },
    set: function(value) {
      return this._pointColor = value;
    }
  });

  Path.define("handleColor", {
    get: function() {
      return this._handleColor;
    },
    set: function(value) {
      return this._handleColor = value;
    }
  });

  Path.define("strokeColor", {
    get: function() {
      return this._strokeColor;
    },
    set: function(value) {
      return this._strokeColor = value;
    }
  });

  Path.define("strokeWidth", {
    get: function() {
      return this._strokeWidth;
    },
    set: function(value) {
      return this._strokeWidth = value;
    }
  });

  Path.define("fill", {
    get: function() {
      return this._fill;
    },
    set: function(value) {
      return this._fill = value;
    }
  });

  return Path;

})(Layer);


},{}],"SVGLayer":[function(require,module,exports){
"SVGLayer class\n\nproperties\n- linecap <string> (\"round\" || \"square\" || \"butt\")\n- fill <string> (css color)\n- stroke <string> (css color)\n- strokeWidth <number>\n- dashOffset <number> (from -1 to 1, defaults to 0)";
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.SVGLayer = (function(superClass) {
  extend(SVGLayer, superClass);

  function SVGLayer(options) {
    var cName, d, footer, header, path, t;
    if (options == null) {
      options = {};
    }
    options = _.defaults(options, {
      dashOffset: 1,
      strokeWidth: 2,
      stroke: "#28affa",
      backgroundColor: null,
      clip: false,
      fill: "transparent",
      linecap: "round"
    });
    SVGLayer.__super__.constructor.call(this, options);
    if (options.fill === null) {
      this.fill = null;
    }
    this.width += options.strokeWidth / 2;
    this.height += options.strokeWidth / 2;
    d = new Date();
    t = d.getTime();
    cName = "c" + t;
    header = "<svg class='" + cName + "' x='0px' y='0px' width='" + this.width + "' height='" + this.height + "' viewBox='-" + (this.strokeWidth / 2) + " -" + (this.strokeWidth / 2) + " " + (this.width + this.strokeWidth / 2) + " " + (this.height + this.strokeWidth / 2) + "'>";
    path = options.path;
    footer = "</svg>";
    this.html = header + path + footer;
    Utils.domComplete((function(_this) {
      return function() {
        var domPath;
        domPath = document.querySelector('.' + cName + ' path');
        _this._pathLength = domPath.getTotalLength();
        _this.style = {
          "stroke-dasharray": _this.pathLength
        };
        return _this.dashOffset = options.dashOffset;
      };
    })(this));
  }

  SVGLayer.define("pathLength", {
    get: function() {
      return this._pathLength;
    },
    set: function(value) {
      return print("SVGLayer.pathLength is readonly");
    }
  });

  SVGLayer.define("linecap", {
    get: function() {
      return this.style.strokeLinecap;
    },
    set: function(value) {
      return this.style.strokeLinecap = value;
    }
  });

  SVGLayer.define("strokeLinecap", {
    get: function() {
      return this.style.strokeLinecap;
    },
    set: function(value) {
      return this.style.strokeLinecap = value;
    }
  });

  SVGLayer.define("fill", {
    get: function() {
      return this.style.fill;
    },
    set: function(value) {
      if (value === null) {
        value = "transparent";
      }
      return this.style.fill = value;
    }
  });

  SVGLayer.define("stroke", {
    get: function() {
      return this.style.stroke;
    },
    set: function(value) {
      return this.style.stroke = value;
    }
  });

  SVGLayer.define("strokeColor", {
    get: function() {
      return this.style.stroke;
    },
    set: function(value) {
      return this.style.stroke = value;
    }
  });

  SVGLayer.define("strokeWidth", {
    get: function() {
      return Number(this.style.strokeWidth.replace(/[^\d.-]/g, ''));
    },
    set: function(value) {
      return this.style.strokeWidth = value;
    }
  });

  SVGLayer.define("dashOffset", {
    get: function() {
      return this._dashOffset;
    },
    set: function(value) {
      var dashOffset;
      this._dashOffset = value;
      if (this.pathLength != null) {
        dashOffset = Utils.modulate(value, [0, 1], [this.pathLength, 0]);
        return this.style.strokeDashoffset = dashOffset;
      }
    }
  });

  return SVGLayer;

})(Layer);


},{}],"circleModule":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.Circle = (function(superClass) {
  extend(Circle, superClass);

  Circle.prototype.currentValue = null;

  function Circle(options) {
    var base, base1, base2, base3, base4, base5, base6, base7, base8, counter, numberDuration, numberEnd, numberInterval, numberNow, numberStart, self, style;
    this.options = options != null ? options : {};
    if ((base = this.options).circleSize == null) {
      base.circleSize = 300;
    }
    if ((base1 = this.options).strokeWidth == null) {
      base1.strokeWidth = 24;
    }
    if ((base2 = this.options).strokeColor == null) {
      base2.strokeColor = "#fc245c";
    }
    if ((base3 = this.options).topColor == null) {
      base3.topColor = null;
    }
    if ((base4 = this.options).bottomColor == null) {
      base4.bottomColor = null;
    }
    if ((base5 = this.options).hasCounter == null) {
      base5.hasCounter = null;
    }
    if ((base6 = this.options).counterColor == null) {
      base6.counterColor = "#fff";
    }
    if ((base7 = this.options).counterFontSize == null) {
      base7.counterFontSize = 60;
    }
    if ((base8 = this.options).hasLinearEasing == null) {
      base8.hasLinearEasing = null;
    }
    this.options.value = 2;
    this.options.viewBox = this.options.circleSize + this.options.strokeWidth;
    Circle.__super__.constructor.call(this, this.options);
    this.backgroundColor = "";
    this.height = this.options.viewBox;
    this.width = this.options.viewBox;
    this.rotation = -90;
    this.pathLength = Math.PI * this.options.circleSize;
    this.circleID = "circle" + Math.floor(Math.random() * 1000);
    this.gradientID = "circle" + Math.floor(Math.random() * 1000);
    if (this.options.hasCounter !== null) {
      counter = new Layer({
        parent: this,
        html: "",
        width: this.width,
        height: this.height,
        backgroundColor: "",
        rotation: 90,
        color: this.options.counterColor
      });
      style = {
        textAlign: "center",
        fontSize: this.options.counterFontSize + "px",
        lineHeight: this.height + "px",
        fontWeight: "600",
        fontFamily: "-apple-system, Helvetica, Arial, sans-serif",
        boxSizing: "border-box",
        height: this.height
      };
      counter.style = style;
      numberStart = 0;
      numberEnd = 100;
      numberDuration = 2;
      numberNow = numberStart;
      numberInterval = numberEnd - numberStart;
    }
    this.html = "<svg viewBox='-" + (this.options.strokeWidth / 2) + " -" + (this.options.strokeWidth / 2) + " " + this.options.viewBox + " " + this.options.viewBox + "' >\n	<defs>\n	    <linearGradient id='" + this.gradientID + "' >\n	        <stop offset=\"0%\" stop-color='" + (this.options.topColor !== null ? this.options.bottomColor : this.options.strokeColor) + "'/>\n	        <stop offset=\"100%\" stop-color='" + (this.options.topColor !== null ? this.options.topColor : this.options.strokeColor) + "' stop-opacity=\"1\" />\n	    </linearGradient>\n	</defs>\n	<circle id='" + this.circleID + "'\n			fill='none'\n			stroke-linecap='round'\n			stroke-width      = '" + this.options.strokeWidth + "'\n			stroke-dasharray  = '" + this.pathLength + "'\n			stroke-dashoffset = '0'\n			stroke=\"url(#" + this.gradientID + ")\"\n			stroke-width=\"10\"\n			cx = '" + (this.options.circleSize / 2) + "'\n			cy = '" + (this.options.circleSize / 2) + "'\n			r  = '" + (this.options.circleSize / 2) + "'>\n</svg>";
    self = this;
    Utils.domComplete(function() {
      return self.path = document.querySelector("#" + self.circleID);
    });
    this.proxy = new Layer({
      opacity: 0
    });
    this.proxy.on(Events.AnimationEnd, function(animation, layer) {
      return self.onFinished();
    });
    this.proxy.on('change:x', function() {
      var offset;
      offset = Utils.modulate(this.x, [0, 500], [self.pathLength, 0]);
      self.path.setAttribute('stroke-dashoffset', offset);
      if (self.options.hasCounter !== null) {
        numberNow = Utils.round(self.proxy.x / 5);
        return counter.html = numberNow;
      }
    });
    Utils.domComplete(function() {
      return self.proxy.x = 0.1;
    });
  }

  Circle.prototype.changeTo = function(value, time) {
    var customCurve;
    if (time === void 0) {
      time = 2;
    }
    if (this.options.hasCounter === true && this.options.hasLinearEasing === null) {
      customCurve = "linear";
    } else {
      customCurve = "ease-in-out";
    }
    this.proxy.animate({
      properties: {
        x: 500 * (value / 100)
      },
      time: time,
      curve: customCurve
    });
    return this.currentValue = value;
  };

  Circle.prototype.startAt = function(value) {
    this.proxy.animate({
      properties: {
        x: 500 * (value / 100)
      },
      time: 0.001
    });
    return this.currentValue = value;
  };

  Circle.prototype.hide = function() {
    return this.opacity = 0;
  };

  Circle.prototype.show = function() {
    return this.opacity = 1;
  };

  Circle.prototype.onFinished = function() {};

  return Circle;

})(Layer);


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvQmVuL0Rlc2t0b3AvZnJhbWVyL25ldy1kZXYtZGFzaC5mcmFtZXIvbW9kdWxlcy9QYXRoLmNvZmZlZSIsIi9Vc2Vycy9CZW4vRGVza3RvcC9mcmFtZXIvbmV3LWRldi1kYXNoLmZyYW1lci9tb2R1bGVzL1NWR0xheWVyLmNvZmZlZSIsIi9Vc2Vycy9CZW4vRGVza3RvcC9mcmFtZXIvbmV3LWRldi1kYXNoLmZyYW1lci9tb2R1bGVzL2NpcmNsZU1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvQmVuL0Rlc2t0b3AvZnJhbWVyL25ldy1kZXYtZGFzaC5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOzs7QUFBTSxPQUFPLENBQUM7QUFFYixNQUFBOzs7O0VBQUEsSUFBQSxHQUFPOztFQUFJLFNBQUEsR0FBWTs7RUFBSSxLQUFBLEdBQVE7O0VBQUksT0FBQSxHQUFVOztFQUFJLFNBQUEsR0FBWTs7RUFBSSxNQUFBLEdBQVM7O0VBQUksS0FBQSxHQUFROztFQUMxRixVQUFBLEdBQWEsTUFBQSxHQUFTOztFQUlULGNBQUMsT0FBRDtBQUdaLFFBQUE7SUFBQSxPQUFBLEdBQVUsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxPQUFYLEVBRVQsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsS0FGeEIsRUFJVCxJQUFDLENBQUEsU0FBRCxHQUFhLENBSkosRUFLVCxJQUFDLENBQUEsVUFBRCxHQUFjLENBTEwsRUFNVCxJQUFDLENBQUEsV0FBRCxHQUFlLENBTk4sRUFRVCxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFdBQUQsR0FBYyxPQVJsQyxFQVVULElBQUMsQ0FBQSxJQVZRLEVBWVQsSUFBQyxDQUFBLElB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b3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIGV4cG9ydHMuUGF0aCBleHRlbmRzIExheWVyXHRcblxuXHRwYXRoID0gW107IGFuaW1hdGluZyA9IFtdOyBwb2ludCA9IFtdOyBhbmltYXRlID0gW107IHF1YWRyYXRpYyA9IFtdOyBiZXppZXIgPSBbXTsgY2xvc2UgPSBbXVxuXHRhbmltYXRpb25zID0gcG9pbnRzID0gMFxuXHRcblxuXHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuXHRcdFxuXHRcdFxuXHRcdG9wdGlvbnMgPSBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XG5cdFx0XHRAcG9pbnRWaXNpYmxlID0gQGhhbmRsZVZpc2libGUgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRAcG9pbnRTaXplID0gNFxuXHRcdFx0QGhhbmRsZVNpemUgPSAyXG5cdFx0XHRAc3Ryb2tlV2lkdGggPSAxXG5cdFx0XHRcblx0XHRcdEBwb2ludENvbG9yID0gQGhhbmRsZUNvbG9yID0gQHN0cm9rZUNvbG9yPSBcIndoaXRlXCJcblxuXHRcdFx0QGZpbGxcblx0XHRcdFxuXHRcdFx0QHBhdGggPSBcblx0XHRcdFx0XG5cdFx0XHRcdGFuaW1hdGlvbk9wdGlvbnM6IHt0aW1lOjE7IGN1cnZlOlwiYmV6aWVyLWN1cnZlXCJ9XG5cdFx0XHRcdFxuXHRcdFx0XHRkcmFnZ2FibGU6IGZhbHNlXG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdHBvaW50OiAocCkgPT5cblxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHBvaW50W3BvaW50c10gPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRcdFx0bmFtZTogXCJQb2ludCAjXCIrcG9pbnRzXG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQHBvaW50Q29sb3Jcblx0XHRcdFx0XHRcdFx0c3VwZXJMYXllcjogQFxuXHRcdFx0XHRcdFx0XHR3aWR0aDogQHBvaW50U2l6ZVxuXHRcdFx0XHRcdFx0XHRoZWlnaHQ6IEBwb2ludFNpemVcblx0XHRcdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiBAcG9pbnRTaXplLzJcblx0XHRcdFx0XHRcdFx0eDogcC54IC0gQHBvaW50U2l6ZS8yXG5cdFx0XHRcdFx0XHRcdHk6IHAueSAtIEBwb2ludFNpemUvMlxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRhbmltYXRlW3BvaW50c10gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdFx0XG5cdFx0XHRcdCBpZiBAcG9pbnRWaXNpYmxlID09IGZhbHNlXG5cdFx0XHRcdFx0XHRwb2ludFtwb2ludHNdLm9wYWNpdHkgPSAwXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0IGlmIEBwYXRoLmRyYWdnYWJsZSA9PSB0cnVlXG5cdFx0XHRcdFx0XHRwb2ludFtwb2ludHNdLmRyYWdnYWJsZSA9IHRydWVcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHQgaWYgcC5xdWFkcmF0aWMgPT0gXCJmaXJzdFwiIG9yIHAuYmV6aWVyID09IFwiZmlyc3RcIiBvciBwLmJlemllciA9PSBcInNlY29uZFwiXG5cdFx0XHRcdCBcdFx0cG9pbnRbcG9pbnRzXS5uYW1lID0gXCJQb2ludCAjXCIrcG9pbnRzK1wiIChoYW5kbGUpXCJcblx0XHRcdFx0IFx0XHRwb2ludFtwb2ludHNdLmJhY2tncm91bmRDb2xvciA9IEBoYW5kbGVDb2xvclxuXHRcdFx0XHQgXHRcdHBvaW50W3BvaW50c10ud2lkdGggPSBAaGFuZGxlU2l6ZVxuXHRcdFx0XHQgXHRcdHBvaW50W3BvaW50c10uaGVpZ2h0ID0gQGhhbmRsZVNpemVcblx0XHRcdFx0IFx0XHRcblx0XHRcdFx0IFx0XHRpZiBAaGFuZGxlVmlzaWJsZSA9PSBmYWxzZVxuXHRcdFx0XHQgXHRcdFx0cG9pbnRbcG9pbnRzXS5vcGFjaXR5ID0gMFxuXG5cdFx0XHRcdFx0aWYgcC5zdGF0ZXMgIT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGFuaW1hdGlvbnMgPSBwb2ludHNcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZiBBcnJheS5pc0FycmF5KHAuc3RhdGVzLngpICYmIEFycmF5LmlzQXJyYXkocC5zdGF0ZXMueSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Zm9yIGkgaW4gWzAuLi5wLnN0YXRlcy54Lmxlbmd0aF1cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRjeCA9IHAuc3RhdGVzLnhcblx0XHRcdFx0XHRcdFx0XHRjeSA9IHAuc3RhdGVzLnlcblx0XHRcdFx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdFx0XHRcdHBvaW50W3BvaW50c10uc3RhdGVzLmFkZFxuXHRcdFx0XHRcdFx0XHRcdFx0XCJhcnJheSAje2l9XCI6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0eDogY3hbaV1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR5OiBjeVtpXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmIEFycmF5LmlzQXJyYXkocC5zdGF0ZXMueCk9PWZhbHNlICYmIEFycmF5LmlzQXJyYXkocC5zdGF0ZXMueSk9PWZhbHNlXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0cG9pbnRbcG9pbnRzXS5zdGF0ZXMuYWRkXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWNvbmQ6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHg6IHAuc3RhdGVzLnhcblx0XHRcdFx0XHRcdFx0XHRcdFx0eTogcC5zdGF0ZXMueVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0YW5pbWF0ZVtwb2ludHNdID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0XHRcdFx0XHRcdGxheWVyOiBwb2ludFtwb2ludHNdXG5cdFx0XHRcdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdFx0XHRcdHg6IHAuc3RhdGVzLnhcblx0XHRcdFx0XHRcdFx0XHRcdHk6IHAuc3RhdGVzLnlcblx0XHRcdFx0XHRcdFx0XHR0aW1lOiBALnBhdGguYW5pbWF0aW9uT3B0aW9ucy50aW1lXG5cdFx0XHRcdFx0XHRcdFx0Y3VydmU6IEAucGF0aC5hbmltYXRpb25PcHRpb25zLmN1cnZlXG5cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XG5cdFxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQjIEluIGNhc2UgaWYgbm90IGJvdGggdmFsdWVzIGFyZSBhcnJheXNcdFxuXHRcdFx0XHRcdFx0aWYgQXJyYXkuaXNBcnJheShwLnN0YXRlcy54KSAmJiBBcnJheS5pc0FycmF5KHAuc3RhdGVzLnkpPT1mYWxzZVxuXHRcdFx0XHRcdFx0XHRwcmludCBcIlkgdmFsdWVzIGFyZSBub3QgYW4gYXJyYXlcIlxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZiBBcnJheS5pc0FycmF5KHAuc3RhdGVzLngpPT1mYWxzZSAmJiBBcnJheS5pc0FycmF5KHAuc3RhdGVzLnkpXG5cdFx0XHRcdFx0XHRcdHByaW50IFwiWCB2YWx1ZXMgYXJlIG5vdCBhbiBhcnJheVwiXG5cdFx0XHRcdFxuXG5cdFx0XHRcdFx0XG5cdFx0XHRcdCBcdHBvaW50W3BvaW50c10uc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPSBAcGF0aC5hbmltYXRpb25PcHRpb25zXG5cdFx0XHRcdCBcblx0XHRcdFx0IFx0XHRcdFx0XHQgXHRcblx0XHRcdFx0XHRpZiBwLnF1YWRyYXRpYyA9PSB1bmRlZmluZWQgJiYgcC5iZXppZXIgIT0gXCJmaXJzdFwiXG5cdFx0XHRcdFx0XHQgcXVhZHJhdGljW3BvaW50c10gPSBmYWxzZVxuXHRcdFx0XHRcdFx0IGJlemllcltwb2ludHNdID0gZmFsc2Vcblx0XHRcdFx0XHRcdCBcblx0XHRcdFx0XHRcdCBpZiBwLmNsb3NlID09IHRydWVcblx0XHRcdFx0XHRcdCBcdHBhdGgucHVzaCgnTCcrcC54KVxuXHRcdFx0XHRcdFx0IFx0Y2xvc2VbcG9pbnRzXSA9IHRydWVcblx0XHRcdFx0XHRcdCBlbHNlXG5cdFx0XHRcdFx0XHQgXHRwYXRoLnB1c2gocC54KVx0XG5cdFx0XHRcdFx0XHQgXG5cdFx0XHRcdCBcblx0XHRcdFx0IFx0aWYgcC5xdWFkcmF0aWMgPT0gXCJmaXJzdFwiXHRcblx0XHRcdFx0IFx0XHRiZXppZXJbcG9pbnRzXSA9IGZhbHNlXG5cdFx0XHRcdCBcdFx0XG5cdFx0XHRcdCBcdFx0cXVhZHJhdGljW3BvaW50c10gPSB0cnVlXG5cdFx0XHRcdCBcdFx0cGF0aC5wdXNoKCdRJytwLngpXG5cdFx0XHRcdCBcdFx0XG5cdFx0XHRcdCBcdGlmIHAuYmV6aWVyID09IFwiZmlyc3RcIlxuXHRcdFx0XHQgXHRcdHF1YWRyYXRpY1twb2ludHNdID0gZmFsc2Vcblx0XHRcdFx0IFx0XHRcblx0XHRcdFx0IFx0XHRiZXppZXJbcG9pbnRzXSA9IHRydWVcblx0XHRcdFx0IFx0XHRwYXRoLnB1c2goJ0MnK3AueClcblx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0cGF0aC5wdXNoKHAueSlcblx0XHRcdFx0XHRcbiMgXHRcdFx0XHRcdHByaW50IHBvaW50cytcIjogXCIrcXVhZHJhdGljW3BvaW50c11cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRAaHRtbCA9IHN2Z1N0YXJ0ICsgcGF0aEJlZ2luICsgcGF0aCArIHBhdGhFbmQgKyBzdmdFbmRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRwb2ludHMrK1xuXHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0YW5pbWF0ZTogKHQpID0+XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdFx0XHRmb3IgaSBpblswLi4ucG9pbnQubGVuZ3RoXVxuXHRcdFx0XHRcdFx0aWYgdCA9PSB1bmRlZmluZWQgfHwgdCA9PSBcInN0YXRlc1wiXG5cdFx0XHRcdFx0XHRcdHBvaW50W2ldLnN0YXRlcy5uZXh0KClcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0YW5pbWF0ZVtpXS5zdGFydCgpXG4gXHRcdFx0XHRcdFxuIFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0ZXhlY3V0ZSA9ID0+XG5cdFx0XHRcdFx0XHRcbiBcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRmb3IgaSBpbiBbMC4uLnBvaW50Lmxlbmd0aF1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdGMgPSBpK2lcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdFx0XHRcdGFuaW1hdGluZ1tjXSA9IHBvaW50W2ldLnggKyBAcG9pbnRTaXplLzJcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRpZiBxdWFkcmF0aWNbaV0gPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW5nW2NdID0gXCJRXCIgKyBhbmltYXRpbmdbY11cblx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdGlmIGJlemllcltpXSA9PSB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0XHRhbmltYXRpbmdbY10gPSBcIkNcIiArIGFuaW1hdGluZ1tjXVxuXHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0aWYgY2xvc2VbaV0gPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW5nW2NdID0gXCJMXCIgKyBhbmltYXRpbmdbY11cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRhbmltYXRpbmdbYysxXSA9IHBvaW50W2ldLnkgKyBAcG9pbnRTaXplLzJcblx0XHRcdFx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0QGh0bWwgPSBzdmdTdGFydCArIHBhdGhCZWdpbiArIGFuaW1hdGluZyArIHBhdGhFbmQgKyBzdmdFbmRcdFx0XHRcbiMgXHRcdFx0XHRcdFx0XHRwcmludCBAaHRtbFxuXHRcdFxuXHRcdFx0XHRcdGZvciBpIGluWzAuLi5wb2ludC5sZW5ndGhdXG5cdFx0XHRcdFx0XHRcdHBvaW50W2ldLm9uICdjaGFuZ2U6cG9pbnQnLCA9PiBcblx0XHRcdFx0XHRcdFx0XHRleGVjdXRlKClcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblxuXHRcdFx0XG5cdFx0XHRcdHF1YWRyYXRpYzogKHApID0+XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGlmIHAuc3RhdGVzICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0aGFuZGxlID1cblx0XHRcdFx0XHRcdFx0eDogcC54XG5cdFx0XHRcdFx0XHRcdHk6IHAueVxuXHRcdFx0XHRcdFx0XHRzdGF0ZXM6IFxuXHRcdFx0XHRcdFx0XHRcdHg6IHAuc3RhdGVzLnhcblx0XHRcdFx0XHRcdFx0XHR5OiBwLnN0YXRlcy55XG5cdFx0XHRcdFx0XHRcdHF1YWRyYXRpYzogXCJmaXJzdFwiXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHF1YWRyYXRpY1BvaW50ID1cblx0XHRcdFx0XHRcdFx0eDogcC5xeFxuXHRcdFx0XHRcdFx0XHR5OiBwLnF5XG5cdFx0XHRcdFx0XHRcdHN0YXRlczogXG5cdFx0XHRcdFx0XHRcdFx0eDogcC5zdGF0ZXMucXhcblx0XHRcdFx0XHRcdFx0XHR5OiBwLnN0YXRlcy5xeVxuXHRcdFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGhhbmRsZSA9XG5cdFx0XHRcdFx0XHRcdHg6IHAueFxuXHRcdFx0XHRcdFx0XHR5OiBwLnlcblx0XHRcdFx0XHRcdFx0cXVhZHJhdGljOiBcImZpcnN0XCJcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRxdWFkcmF0aWNQb2ludCA9XG5cdFx0XHRcdFx0XHRcdHg6IHAucXhcblx0XHRcdFx0XHRcdFx0eTogcC5xeVxuXHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdEBwYXRoLnBvaW50KGhhbmRsZSlcblx0XHRcdFx0XHRAcGF0aC5wb2ludChxdWFkcmF0aWNQb2ludClcblx0XHRcdFx0XHRcblx0XHRcblx0XHRcdFx0XHRcblxuXHRcdFx0XHRjdWJpYzogKHApID0+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYgcC5zdGF0ZXMgIT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRoYW5kbGVPbmUgPSBcblx0XHRcdFx0XHRcdFx0eDogcC5jeDFcblx0XHRcdFx0XHRcdFx0eTogcC5jeTFcblx0XHRcdFx0XHRcdFx0c3RhdGVzOlxuXHRcdFx0XHRcdFx0XHRcdHg6IHAuc3RhdGVzLmN4MVxuXHRcdFx0XHRcdFx0XHRcdHk6IHAuc3RhdGVzLmN5MVxuXHRcdFx0XHRcdFx0XHRiZXppZXI6IFwiZmlyc3RcIlxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGhhbmRsZVR3byA9IFxuXHRcdFx0XHRcdFx0XHR4OiBwLmN4MlxuXHRcdFx0XHRcdFx0XHR5OiBwLmN5MlxuXHRcdFx0XHRcdFx0XHRzdGF0ZXM6XG5cdFx0XHRcdFx0XHRcdFx0eDogcC5zdGF0ZXMuY3gyXG5cdFx0XHRcdFx0XHRcdFx0eTogcC5zdGF0ZXMuY3kyXG5cdFx0XHRcdFx0XHRcdGJlemllcjogXCJzZWNvbmRcIlxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGJlemllclBvaW50ID1cblx0XHRcdFx0XHRcdFx0eDogcC54XG5cdFx0XHRcdFx0XHRcdHk6IHAueVxuXHRcdFx0XHRcdFx0XHRzdGF0ZXM6XG5cdFx0XHRcdFx0XHRcdFx0eDogcC5zdGF0ZXMueFxuXHRcdFx0XHRcdFx0XHRcdHk6IHAuc3RhdGVzLnlcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRoYW5kbGVPbmUgPSBcblx0XHRcdFx0XHRcdFx0eDogcC5jeDFcblx0XHRcdFx0XHRcdFx0eTogcC5jeTFcblx0XHRcdFx0XHRcdFx0YmV6aWVyOiBcImZpcnN0XCJcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGhhbmRsZVR3byA9IFxuXHRcdFx0XHRcdFx0XHR4OiBwLmN4MlxuXHRcdFx0XHRcdFx0XHR5OiBwLmN5MlxuXHRcdFx0XHRcdFx0XHRiZXppZXI6IFwic2Vjb25kXCJcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRiZXppZXJQb2ludCA9XG5cdFx0XHRcdFx0XHRcdHg6IHAueFxuXHRcdFx0XHRcdFx0XHR5OiBwLnlcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRAcGF0aC5wb2ludChoYW5kbGVPbmUpXG5cdFx0XHRcdFx0QHBhdGgucG9pbnQoaGFuZGxlVHdvKVx0XG5cdFx0XHRcdFx0QHBhdGgucG9pbnQoYmV6aWVyUG9pbnQpXHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0Y2xvc2U6IChwKSA9PlxuXHRcdFx0XHRcdHAuY2xvc2UgPSB0cnVlXG5cdFx0XHRcdFx0QHBhdGgucG9pbnQocClcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFxuXHRcdFx0XG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdFxuXHRcdHN2Z1N0YXJ0ID0gJzxzdmcgaGVpZ2h0PVwiJytAaGVpZ2h0KydcIiB3aWR0aD1cIicrQHdpZHRoKydcIiBzdHJva2U9JytAc3Ryb2tlQ29sb3IrJyBzdHJva2Utd2lkdGg9XCInK0BzdHJva2VXaWR0aCsnXCIgZmlsbD1cIicrQGZpbGwrJ1wiPidcblx0XHRwYXRoQmVnaW4gPSAnPHBhdGggZD1cIk0nXG5cdFx0cGF0aEVuZCA9ICdcIj4nXG5cdFx0c3ZnRW5kID0gJzwvc3ZnPidcdFxuXHRcblx0XHRcblx0XHRcblx0XHRcblx0QGRlZmluZSBcInBhdGguYW5pbWF0aW9uT3B0aW9uc1wiLFxuXHRcdGdldDogLT4gQF9wYXRoLmFuaW1hdGlvbk9wdGlvbnNcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAX3BhdGguYW5pbWF0aW9uT3B0aW9ucyA9IHZhbHVlXG5cdFx0XG5cdEBkZWZpbmUgXCJwYXRoLmRyYWdnYWJsZVwiLFxuXHRcdGdldDogLT4gQF9wYXRoLmRyYWdnYWJsZVxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBfcGF0aC5kcmFnZ2FibGUgPSB2YWx1ZVxuXHRcdFxuXHRAZGVmaW5lIFwicG9pbnRWaXNpYmxlXCIsXG5cdFx0Z2V0OiAtPiBAX3BvaW50VmlzaWJsZVxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBfcG9pbnRWaXNpYmxlID0gdmFsdWVcblx0XHRcdFxuXHRAZGVmaW5lIFwiaGFuZGxlVmlzaWJsZVwiLFxuXHRcdGdldDogLT4gQF9oYW5kbGVWaXNpYmxlXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QF9oYW5kbGVWaXNpYmxlID0gdmFsdWVcblx0XHRcdFxuXHRAZGVmaW5lIFwicG9pbnRTaXplXCIsXG5cdFx0Z2V0OiAtPiBAX3BvaW50U2l6ZVxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBfcG9pbnRTaXplID0gdmFsdWVcblx0XHRcdFxuXHRAZGVmaW5lIFwiaGFuZGxlU2l6ZVwiLFxuXHRcdGdldDogLT4gQF9oYW5kbGVTaXplXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QF9oYW5kbGVTaXplID0gdmFsdWVcblx0XHRcdFxuXHRAZGVmaW5lIFwicG9pbnRDb2xvclwiLFxuXHRcdGdldDogLT4gQF9wb2ludENvbG9yXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QF9wb2ludENvbG9yID0gdmFsdWVcblx0XHRcdFxuXHRAZGVmaW5lIFwiaGFuZGxlQ29sb3JcIixcblx0XHRnZXQ6IC0+IEBfaGFuZGxlQ29sb3Jcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAX2hhbmRsZUNvbG9yID0gdmFsdWVcblx0XHRcdFxuXHRAZGVmaW5lIFwic3Ryb2tlQ29sb3JcIixcblx0XHRnZXQ6IC0+IEBfc3Ryb2tlQ29sb3Jcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAX3N0cm9rZUNvbG9yID0gdmFsdWVcblx0XHRcdFxuXHRAZGVmaW5lIFwic3Ryb2tlV2lkdGhcIixcblx0XHRnZXQ6IC0+IEBfc3Ryb2tlV2lkdGhcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAX3N0cm9rZVdpZHRoID0gdmFsdWVcblx0XHRcblx0QGRlZmluZSBcImZpbGxcIixcblx0XHRnZXQ6IC0+IEBfZmlsbFxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBfZmlsbCA9IHZhbHVlIiwiXCJcIlwiXG5TVkdMYXllciBjbGFzc1xuXG5wcm9wZXJ0aWVzXG4tIGxpbmVjYXAgPHN0cmluZz4gKFwicm91bmRcIiB8fCBcInNxdWFyZVwiIHx8IFwiYnV0dFwiKVxuLSBmaWxsIDxzdHJpbmc+IChjc3MgY29sb3IpXG4tIHN0cm9rZSA8c3RyaW5nPiAoY3NzIGNvbG9yKVxuLSBzdHJva2VXaWR0aCA8bnVtYmVyPlxuLSBkYXNoT2Zmc2V0IDxudW1iZXI+IChmcm9tIC0xIHRvIDEsIGRlZmF1bHRzIHRvIDApXG5cIlwiXCJcblxuY2xhc3MgZXhwb3J0cy5TVkdMYXllciBleHRlbmRzIExheWVyXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG5cdFx0b3B0aW9ucyA9IF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGRhc2hPZmZzZXQ6IDFcblx0XHRcdHN0cm9rZVdpZHRoOiAyXG5cdFx0XHRzdHJva2U6IFwiIzI4YWZmYVwiXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdGNsaXA6IGZhbHNlXG5cdFx0XHRmaWxsOiBcInRyYW5zcGFyZW50XCJcblx0XHRcdGxpbmVjYXA6IFwicm91bmRcIlxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdGlmIG9wdGlvbnMuZmlsbCA9PSBudWxsXG5cdFx0XHRAZmlsbCA9IG51bGxcblxuXHRcdEB3aWR0aCArPSBvcHRpb25zLnN0cm9rZVdpZHRoIC8gMlxuXHRcdEBoZWlnaHQgKz0gb3B0aW9ucy5zdHJva2VXaWR0aCAvIDJcblxuXHRcdCMgSFRNTCBmb3IgdGhlIFNWRyBET00gZWxlbWVudCwgbmVlZCB1bmlxdWUgY2xhc3MgbmFtZXNcblx0XHRkID0gbmV3IERhdGUoKVxuXHRcdHQgPSBkLmdldFRpbWUoKVxuXHRcdGNOYW1lID0gXCJjXCIgKyB0XG5cdFx0aGVhZGVyID0gXCI8c3ZnIGNsYXNzPScje2NOYW1lfScgeD0nMHB4JyB5PScwcHgnIHdpZHRoPScje0B3aWR0aH0nIGhlaWdodD0nI3tAaGVpZ2h0fScgdmlld0JveD0nLSN7QHN0cm9rZVdpZHRoLzJ9IC0je0BzdHJva2VXaWR0aC8yfSAje0B3aWR0aCArIEBzdHJva2VXaWR0aC8yfSAje0BoZWlnaHQgKyBAc3Ryb2tlV2lkdGgvMn0nPlwiXG5cdFx0cGF0aCA9IG9wdGlvbnMucGF0aFxuXHRcdGZvb3RlciA9IFwiPC9zdmc+XCJcblx0XHRAaHRtbCA9IGhlYWRlciArIHBhdGggKyBmb290ZXJcblxuXHRcdCMgd2FpdCB3aXRoIHF1ZXJ5aW5nIHBhdGhsZW5ndGggZm9yIHdoZW4gZG9tIGlzIGZpbmlzaGVkXG5cdFx0VXRpbHMuZG9tQ29tcGxldGUgPT5cblx0XHRcdGRvbVBhdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJytjTmFtZSsnIHBhdGgnKVxuXHRcdFx0QF9wYXRoTGVuZ3RoID0gZG9tUGF0aC5nZXRUb3RhbExlbmd0aCgpXG5cdFx0XHRAc3R5bGUgPSB7XCJzdHJva2UtZGFzaGFycmF5XCI6QHBhdGhMZW5ndGg7fVxuXHRcdFx0QGRhc2hPZmZzZXQgPSBvcHRpb25zLmRhc2hPZmZzZXRcblxuXHRAZGVmaW5lIFwicGF0aExlbmd0aFwiLFxuXHRcdGdldDogLT4gQF9wYXRoTGVuZ3RoXG5cdFx0c2V0OiAodmFsdWUpIC0+IHByaW50IFwiU1ZHTGF5ZXIucGF0aExlbmd0aCBpcyByZWFkb25seVwiXG5cblx0QGRlZmluZSBcImxpbmVjYXBcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5zdHJva2VMaW5lY2FwXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAc3R5bGUuc3Ryb2tlTGluZWNhcCA9IHZhbHVlXG5cblx0QGRlZmluZSBcInN0cm9rZUxpbmVjYXBcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5zdHJva2VMaW5lY2FwXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAc3R5bGUuc3Ryb2tlTGluZWNhcCA9IHZhbHVlXG5cblx0QGRlZmluZSBcImZpbGxcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5maWxsXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRpZiB2YWx1ZSA9PSBudWxsXG5cdFx0XHRcdHZhbHVlID0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0XHRAc3R5bGUuZmlsbCA9IHZhbHVlXG5cblx0QGRlZmluZSBcInN0cm9rZVwiLFxuXHRcdGdldDogLT4gQHN0eWxlLnN0cm9rZVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc3R5bGUuc3Ryb2tlID0gdmFsdWVcblxuXHRAZGVmaW5lIFwic3Ryb2tlQ29sb3JcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5zdHJva2Vcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHN0eWxlLnN0cm9rZSA9IHZhbHVlXG5cblx0QGRlZmluZSBcInN0cm9rZVdpZHRoXCIsXG5cdFx0Z2V0OiAtPiBOdW1iZXIoQHN0eWxlLnN0cm9rZVdpZHRoLnJlcGxhY2UoL1teXFxkLi1dL2csICcnKSlcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBzdHlsZS5zdHJva2VXaWR0aCA9IHZhbHVlXG5cblx0QGRlZmluZSBcImRhc2hPZmZzZXRcIixcblx0XHRnZXQ6IC0+IEBfZGFzaE9mZnNldFxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QF9kYXNoT2Zmc2V0ID0gdmFsdWVcblx0XHRcdGlmIEBwYXRoTGVuZ3RoP1xuXHRcdFx0XHRkYXNoT2Zmc2V0ID0gVXRpbHMubW9kdWxhdGUodmFsdWUsIFswLCAxXSwgW0BwYXRoTGVuZ3RoLCAwXSlcblx0XHRcdFx0QHN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBkYXNoT2Zmc2V0XG4iLCJjbGFzcyBleHBvcnRzLkNpcmNsZSBleHRlbmRzIExheWVyXG5cdGN1cnJlbnRWYWx1ZTogbnVsbFxuXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cblx0XHRAb3B0aW9ucy5jaXJjbGVTaXplID89IDMwMFxuXHRcdEBvcHRpb25zLnN0cm9rZVdpZHRoID89IDI0XG5cblx0XHRAb3B0aW9ucy5zdHJva2VDb2xvciA/PSBcIiNmYzI0NWNcIlxuXHRcdEBvcHRpb25zLnRvcENvbG9yID89IG51bGxcblx0XHRAb3B0aW9ucy5ib3R0b21Db2xvciA/PSBudWxsXG5cblx0XHRAb3B0aW9ucy5oYXNDb3VudGVyID89IG51bGxcblx0XHRAb3B0aW9ucy5jb3VudGVyQ29sb3IgPz0gXCIjZmZmXCJcblx0XHRAb3B0aW9ucy5jb3VudGVyRm9udFNpemUgPz0gNjBcblx0XHRAb3B0aW9ucy5oYXNMaW5lYXJFYXNpbmcgPz0gbnVsbFxuXG5cdFx0QG9wdGlvbnMudmFsdWUgPSAyXG5cblx0XHRAb3B0aW9ucy52aWV3Qm94ID0gKEBvcHRpb25zLmNpcmNsZVNpemUpICsgQG9wdGlvbnMuc3Ryb2tlV2lkdGhcblxuXHRcdHN1cGVyIEBvcHRpb25zXG5cblx0XHRALmJhY2tncm91bmRDb2xvciA9IFwiXCJcblx0XHRALmhlaWdodCA9IEBvcHRpb25zLnZpZXdCb3hcblx0XHRALndpZHRoID0gQG9wdGlvbnMudmlld0JveFxuXHRcdEAucm90YXRpb24gPSAtOTBcblxuXG5cdFx0QC5wYXRoTGVuZ3RoID0gTWF0aC5QSSAqIEBvcHRpb25zLmNpcmNsZVNpemVcblxuXHRcdEAuY2lyY2xlSUQgPSBcImNpcmNsZVwiICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwMDApXG5cdFx0QC5ncmFkaWVudElEID0gXCJjaXJjbGVcIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDAwKVxuXG5cdFx0IyBQdXQgdGhpcyBpbnNpZGUgbGluZWFyZ3JhZGllbnRcblx0XHQjIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG5cdFx0IyAgICB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiNTAlXCIgeTI9XCIwJVwiIGdyYWRpZW50VHJhbnNmb3JtPVwicm90YXRlKDEyMClcIlxuXG5cblx0XHRpZiBAb3B0aW9ucy5oYXNDb3VudGVyIGlzbnQgbnVsbFxuXHRcdFx0Y291bnRlciA9IG5ldyBMYXllclxuXHRcdFx0XHRwYXJlbnQ6IEBcblx0XHRcdFx0aHRtbDogXCJcIlxuXHRcdFx0XHR3aWR0aDogQC53aWR0aFxuXHRcdFx0XHRoZWlnaHQ6IEAuaGVpZ2h0XG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0XHRyb3RhdGlvbjogOTBcblx0XHRcdFx0Y29sb3I6IEBvcHRpb25zLmNvdW50ZXJDb2xvclxuXG5cdFx0XHRzdHlsZSA9IHtcblx0XHRcdFx0dGV4dEFsaWduOiBcImNlbnRlclwiXG5cdFx0XHRcdGZvbnRTaXplOiBcIiN7QG9wdGlvbnMuY291bnRlckZvbnRTaXplfXB4XCJcblx0XHRcdFx0bGluZUhlaWdodDogXCIje0AuaGVpZ2h0fXB4XCJcblx0XHRcdFx0Zm9udFdlaWdodDogXCI2MDBcIlxuXHRcdFx0XHRmb250RmFtaWx5OiBcIi1hcHBsZS1zeXN0ZW0sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWZcIlxuXHRcdFx0XHRib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiXG5cdFx0XHRcdGhlaWdodDogQC5oZWlnaHRcblx0XHRcdH1cblxuXHRcdFx0Y291bnRlci5zdHlsZSA9IHN0eWxlXG5cblx0XHRcdG51bWJlclN0YXJ0ID0gMFxuXHRcdFx0bnVtYmVyRW5kID0gMTAwXG5cdFx0XHRudW1iZXJEdXJhdGlvbiA9IDJcblxuXHRcdFx0bnVtYmVyTm93ID0gbnVtYmVyU3RhcnRcblx0XHRcdG51bWJlckludGVydmFsID0gbnVtYmVyRW5kIC0gbnVtYmVyU3RhcnRcblxuXG5cdFx0QC5odG1sID0gXCJcIlwiXG5cdFx0XHQ8c3ZnIHZpZXdCb3g9Jy0je0BvcHRpb25zLnN0cm9rZVdpZHRoLzJ9IC0je0BvcHRpb25zLnN0cm9rZVdpZHRoLzJ9ICN7QG9wdGlvbnMudmlld0JveH0gI3tAb3B0aW9ucy52aWV3Qm94fScgPlxuXHRcdFx0XHQ8ZGVmcz5cblx0XHRcdFx0ICAgIDxsaW5lYXJHcmFkaWVudCBpZD0nI3tAZ3JhZGllbnRJRH0nID5cblx0XHRcdFx0ICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9JyN7aWYgQG9wdGlvbnMudG9wQ29sb3IgaXNudCBudWxsIHRoZW4gQG9wdGlvbnMuYm90dG9tQ29sb3IgZWxzZSBAb3B0aW9ucy5zdHJva2VDb2xvcn0nLz5cblx0XHRcdFx0ICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj0nI3tpZiBAb3B0aW9ucy50b3BDb2xvciBpc250IG51bGwgdGhlbiBAb3B0aW9ucy50b3BDb2xvciBlbHNlIEBvcHRpb25zLnN0cm9rZUNvbG9yfScgc3RvcC1vcGFjaXR5PVwiMVwiIC8+XG5cdFx0XHRcdCAgICA8L2xpbmVhckdyYWRpZW50PlxuXHRcdFx0XHQ8L2RlZnM+XG5cdFx0XHRcdDxjaXJjbGUgaWQ9JyN7QGNpcmNsZUlEfSdcblx0XHRcdFx0XHRcdGZpbGw9J25vbmUnXG5cdFx0XHRcdFx0XHRzdHJva2UtbGluZWNhcD0ncm91bmQnXG5cdFx0XHRcdFx0XHRzdHJva2Utd2lkdGggICAgICA9ICcje0BvcHRpb25zLnN0cm9rZVdpZHRofSdcblx0XHRcdFx0XHRcdHN0cm9rZS1kYXNoYXJyYXkgID0gJyN7QC5wYXRoTGVuZ3RofSdcblx0XHRcdFx0XHRcdHN0cm9rZS1kYXNob2Zmc2V0ID0gJzAnXG5cdFx0XHRcdFx0XHRzdHJva2U9XCJ1cmwoIyN7QGdyYWRpZW50SUR9KVwiXG5cdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg9XCIxMFwiXG5cdFx0XHRcdFx0XHRjeCA9ICcje0BvcHRpb25zLmNpcmNsZVNpemUvMn0nXG5cdFx0XHRcdFx0XHRjeSA9ICcje0BvcHRpb25zLmNpcmNsZVNpemUvMn0nXG5cdFx0XHRcdFx0XHRyICA9ICcje0BvcHRpb25zLmNpcmNsZVNpemUvMn0nPlxuXHRcdFx0PC9zdmc+XCJcIlwiXG5cblx0XHRzZWxmID0gQFxuXHRcdFV0aWxzLmRvbUNvbXBsZXRlIC0+XG5cdFx0XHRzZWxmLnBhdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiIyN7c2VsZi5jaXJjbGVJRH1cIilcblxuXHRcdEBwcm94eSA9IG5ldyBMYXllclxuXHRcdFx0b3BhY2l0eTogMFxuXG5cdFx0QHByb3h5Lm9uIEV2ZW50cy5BbmltYXRpb25FbmQsIChhbmltYXRpb24sIGxheWVyKSAtPlxuXHRcdFx0c2VsZi5vbkZpbmlzaGVkKClcblxuXHRcdEBwcm94eS5vbiAnY2hhbmdlOngnLCAtPlxuXG5cdFx0XHRvZmZzZXQgPSBVdGlscy5tb2R1bGF0ZShALngsIFswLCA1MDBdLCBbc2VsZi5wYXRoTGVuZ3RoLCAwXSlcblxuXHRcdFx0c2VsZi5wYXRoLnNldEF0dHJpYnV0ZSAnc3Ryb2tlLWRhc2hvZmZzZXQnLCBvZmZzZXRcblxuXHRcdFx0aWYgc2VsZi5vcHRpb25zLmhhc0NvdW50ZXIgaXNudCBudWxsXG5cdFx0XHRcdG51bWJlck5vdyA9IFV0aWxzLnJvdW5kKHNlbGYucHJveHkueCAvIDUpXG5cdFx0XHRcdGNvdW50ZXIuaHRtbCA9IG51bWJlck5vd1xuXG5cdFx0VXRpbHMuZG9tQ29tcGxldGUgLT5cblx0XHRcdHNlbGYucHJveHkueCA9IDAuMVxuXG5cdGNoYW5nZVRvOiAodmFsdWUsIHRpbWUpIC0+XG5cdFx0aWYgdGltZSBpcyB1bmRlZmluZWRcblx0XHRcdHRpbWUgPSAyXG5cblx0XHRpZiBAb3B0aW9ucy5oYXNDb3VudGVyIGlzIHRydWUgYW5kIEBvcHRpb25zLmhhc0xpbmVhckVhc2luZyBpcyBudWxsICMgb3ZlcnJpZGUgZGVmYXVsdCBcImVhc2UtaW4tb3V0XCIgd2hlbiBjb3VudGVyIGlzIHVzZWRcblx0XHRcdGN1c3RvbUN1cnZlID0gXCJsaW5lYXJcIlxuXHRcdGVsc2Vcblx0XHRcdGN1c3RvbUN1cnZlID0gXCJlYXNlLWluLW91dFwiXG5cblx0XHRAcHJveHkuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogNTAwICogKHZhbHVlIC8gMTAwKVxuXHRcdFx0dGltZTogdGltZVxuXHRcdFx0Y3VydmU6IGN1c3RvbUN1cnZlXG5cblxuXG5cdFx0QGN1cnJlbnRWYWx1ZSA9IHZhbHVlXG5cblx0c3RhcnRBdDogKHZhbHVlKSAtPlxuXHRcdEBwcm94eS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiA1MDAgKiAodmFsdWUgLyAxMDApXG5cdFx0XHR0aW1lOiAwLjAwMVxuXG5cdFx0QGN1cnJlbnRWYWx1ZSA9IHZhbHVlXG5cblxuXG5cdGhpZGU6IC0+XG5cdFx0QC5vcGFjaXR5ID0gMFxuXG5cdHNob3c6IC0+XG5cdFx0QC5vcGFjaXR5ID0gMVxuXG5cdG9uRmluaXNoZWQ6IC0+XG5cbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iXX0=
