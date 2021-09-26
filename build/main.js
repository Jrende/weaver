
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var tinycolor = createCommonjsModule(function (module) {
// TinyColor v1.4.2
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
        return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else {
    window.tinycolor = tinycolor;
}

})(Math);
});

function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function not_equal(a, b) {
    return a != a ? b == b : a !== b;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function set_store_value(store, ret, value) {
    store.set(value);
    return ret;
}
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty$1() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
    select.selectedIndex = -1; // no option should be selected
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail, bubbles = false) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, false, detail);
    return e;
}
class HtmlTag {
    constructor() {
        this.e = this.n = null;
    }
    c(html) {
        this.h(html);
    }
    m(html, target, anchor = null) {
        if (!this.e) {
            this.e = element(target.nodeName);
            this.t = target;
            this.c(html);
        }
        this.i(anchor);
    }
    h(html) {
        this.e.innerHTML = html;
        this.n = Array.from(this.e.childNodes);
    }
    i(anchor) {
        for (let i = 0; i < this.n.length; i += 1) {
            insert(this.t, this.n[i], anchor);
        }
    }
    p(html) {
        this.d();
        this.h(html);
        this.i(this.a);
    }
    d() {
        this.n.forEach(detach);
    }
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        // @ts-ignore
        callbacks.slice().forEach(fn => fn.call(this, event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush$1);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush$1() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush$1();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.0' }, detail), true));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = Math.random;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create$5() {
  var out = new ARRAY_TYPE(9);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create$4() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply$1(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale$1(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate$1(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$3() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length$1(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues$1(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize$3(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$1(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross$1(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len$1 = length$1;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$3();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
})();

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$2() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize$2(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$2();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create$1() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize$1 = normalize$2;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

(function () {
  var tmpvec3 = create$3();
  var xUnitVec3 = fromValues$1(1, 0, 0);
  var yUnitVec3 = fromValues$1(0, 1, 0);
  return function (out, a, b) {
    var dot = dot$1(a, b);

    if (dot < -0.999999) {
      cross$1(tmpvec3, xUnitVec3, a);
      if (len$1(tmpvec3) < 0.000001) cross$1(tmpvec3, yUnitVec3, a);
      normalize$3(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross$1(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize$1(out, out);
    }
  };
})();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

(function () {
  var temp1 = create$1();
  var temp2 = create$1();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
})();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

(function () {
  var matr = create$5();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize$1(out, fromMat3(out, matr));
  };
})();

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {ReadonlyVec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */

function clone(a) {
  var out = new ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */

function fromValues(x, y) {
  var out = new ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the source vector
 * @returns {vec2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */

function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to ceil
 * @returns {vec2} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
}
/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to floor
 * @returns {vec2} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
}
/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
}
/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
}
/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to round
 * @returns {vec2} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
}
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return x * x + y * y;
}
/**
 * Calculates the length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0],
      y = a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0],
      y = a[1];
  return x * x + y * y;
}
/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to negate
 * @returns {vec2} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to invert
 * @returns {vec2} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
}
/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to normalize
 * @returns {vec2} out
 */

function normalize(out, a) {
  var x = a[0],
      y = a[1];
  var len = x * x + y * y;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}
/**
 * Calculates the dot product of two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec2} out
 */

function lerp(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = RANDOM() * 2.0 * Math.PI;
  out[0] = Math.cos(r) * scale;
  out[1] = Math.sin(r) * scale;
  return out;
}
/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
}
/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2d} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2d(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat3} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat4(out, a, m) {
  var x = a[0];
  var y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
/**
 * Rotate a 2D vector
 * @param {vec2} out The receiving vec2
 * @param {ReadonlyVec2} a The vec2 point to rotate
 * @param {ReadonlyVec2} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec2} out
 */

function rotate(out, a, b, rad) {
  //Translate point to the origin
  var p0 = a[0] - b[0],
      p1 = a[1] - b[1],
      sinC = Math.sin(rad),
      cosC = Math.cos(rad); //perform rotation and translate to correct position

  out[0] = p0 * cosC - p1 * sinC + b[0];
  out[1] = p0 * sinC + p1 * cosC + b[1];
  return out;
}
/**
 * Get the angle between two 2D vectors
 * @param {ReadonlyVec2} a The first operand
 * @param {ReadonlyVec2} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var x1 = a[0],
      y1 = a[1],
      x2 = b[0],
      y2 = b[1],
      // mag is the product of the magnitudes of a and b
  mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2),
      // mag &&.. short circuits if mag == 0
  cosine = mag && (x1 * x2 + y1 * y2) / mag; // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1

  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec2 to zero
 *
 * @param {vec2} out the receiving vector
 * @returns {vec2} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec2} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec2(" + a[0] + ", " + a[1] + ")";
}
/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec2} a The first vector.
 * @param {ReadonlyVec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec2} a The first vector.
 * @param {ReadonlyVec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1];
  var b0 = b[0],
      b1 = b[1];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
}
/**
 * Alias for {@link vec2.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec2.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec2.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec2.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec2.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
}();

var vec2 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	create: create,
	clone: clone,
	fromValues: fromValues,
	copy: copy,
	set: set,
	add: add,
	subtract: subtract,
	multiply: multiply,
	divide: divide,
	ceil: ceil,
	floor: floor,
	min: min,
	max: max,
	round: round,
	scale: scale,
	scaleAndAdd: scaleAndAdd,
	distance: distance,
	squaredDistance: squaredDistance,
	length: length,
	squaredLength: squaredLength,
	negate: negate,
	inverse: inverse,
	normalize: normalize,
	dot: dot,
	cross: cross,
	lerp: lerp,
	random: random,
	transformMat2: transformMat2,
	transformMat2d: transformMat2d,
	transformMat3: transformMat3,
	transformMat4: transformMat4,
	rotate: rotate,
	angle: angle,
	zero: zero,
	str: str,
	exactEquals: exactEquals,
	equals: equals,
	len: len,
	sub: sub,
	mul: mul,
	div: div,
	dist: dist,
	sqrDist: sqrDist,
	sqrLen: sqrLen,
	forEach: forEach
});

function getAngle(v1, v2) {
  let v1n = normalize(create(), v1);
  let v2n = normalize(create(), v2);
  let dot$1 = dot(v1n, v2n);
  let det = v1n[0]*v2n[1] - v1n[1]*v2n[0];
  let rad = Math.atan2(det, dot$1);
  if(rad < 0) {
    rad += 2*Math.PI;
  }
  return rad;
}

var colorWheelVert = "attribute vec2 aVertexPosition;\nvarying vec2 uv;\nvoid main(void) {\n  uv = vec2(\n    clamp(aVertexPosition.x, 0.0, 1.0),\n    clamp(aVertexPosition.y, 0.0, 1.0)\n  );\n  gl_Position = vec4(vec3(aVertexPosition, 1.0), 1.0);\n}\n\n";

var colorWheelFrag = "precision highp float;\nuniform vec2 resolution;\n\n#define PI2 6.28318530718\n#define THICKNESS 0.2\n\nvec3 hsv2rgb(vec3 c) {\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nfloat getAngle(vec2 v1, vec2 v2) {\n  float det = v1.x*v2.y - v1.y * v2.x;\n  float rad = atan(dot(v1, v2), det);\n  if(rad < 0.0) {\n   rad += PI2;\n  }\n  return rad;\n}\n\nvoid main(void) {\n  vec2 pos = gl_FragCoord.xy / resolution.xy;\n  vec4 color = vec4(0.0, 0.0, 0.0, 0.0);\n  vec2 center = vec2(0.5, 0.5);\n  float dist = distance(pos, center);\n  if(dist > 0.4 && dist < (0.3 + THICKNESS)) {\n    vec2 dir = normalize(pos - center);\n    float hue = getAngle(dir, vec2(0.0, 1.0)) / PI2;\n    vec3 hsv = hsv2rgb(vec3(hue, 1.0, 1.0));\n    color = vec4(hsv, 1.0);\n  }\n  gl_FragColor = color;\n}\n";

var satValVert = "attribute vec2 aVertexPosition;\nattribute vec3 barycentric;\n\nvarying vec3 uvw;\nuniform mat4 mvp;\n\nvoid main(void) {\n  uvw = barycentric;\n  gl_Position = mvp * vec4(vec3(aVertexPosition, 1.0), 1.0);\n}\n\n";

var satValFrag = "precision highp float;\nvarying vec3 uvw;\nuniform float hue;\n\nvec3 hsv2rgb(vec3 c) {\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvoid main(void) {\n  float value = 1.0 - uvw.z;\n  float saturation = uvw.x / value;\n  vec3 color = hsv2rgb(vec3(hue, saturation, value));\n  gl_FragColor = vec4(color, 1.0);\n}\n";

var solidFrag$1 = "precision highp float;\nuniform vec4 color;\nvoid main(void) {\n  gl_FragColor = vec4(color);\n}\n";

var solidVert = "attribute vec2 aVertexPosition;\nuniform mat4 mvp;\nvoid main(void) {\n  gl_Position = mvp * vec4(vec3(aVertexPosition, 1.0), 1.0);\n}\n";

class VertexArray {
  constructor(gl, vertexData, indexData, attrs, drawMode = gl.TRIANGLES) {
    this.gl = gl;
    if (vertexData instanceof Float32Array) {
      this.vertexData = vertexData;
    } else {
      this.vertexData = new Float32Array(vertexData);
    }

    if (indexData instanceof Uint16Array) {
      this.indexData = indexData;
    } else {
      this.indexData = new Uint16Array(indexData);
    }

    this.drawMode = drawMode;
    this.attrs = attrs;
    this.initialize(gl);
  }

  initialize(gl) {
    this.vertBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
    if (this.indexData !== undefined) {
      this.indexBuf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
    }
    this.isInitialized = true;
  }

  bind() {
    if (this.isInitialized !== true) {
      console.error('Tried to use uninitialized VertexArray!');
      return;
    }
    const attrSum = this.attrs.reduce((a, b) => a + b);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertBuf);
    if (this.indexData !== undefined) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
    }
    let pointer = 0;
    for (let i = 0; i < this.attrs.length; i++) {
      this.gl.vertexAttribPointer(i, this.attrs[i], this.gl.FLOAT, false, attrSum * 4, pointer * 4);
      this.gl.enableVertexAttribArray(i);
      pointer += this.attrs[i];
    }
  }

  draw() {
    this.gl.drawElements(this.drawMode, this.indexData.length, this.gl.UNSIGNED_SHORT, 0);
  }

  unbind() {
    for (let i = 0; i < this.attrs.length; i++) {
      this.gl.disableVertexAttribArray(i);
    }
    if (this.indexData !== undefined) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  free() {
    this.gl.deleteBuffer(this.vertBuf);
    if(this.indexBuf) {
      this.gl.deleteBuffer(this.indexBuf);
    }
  }
}

class Shader {
  constructor(src) {
    this.vert = src.vert;
    this.frag = src.frag;
    this.attributes = this.getAttributes(src.vert);
  }

  getAttributes(source) {
    return source
      .split('\n')
      .filter(row => row.includes('attribute'))
      .map(a => a.substring(a.lastIndexOf(' ') + 1, a.length - 1));
  }

  bind() {
    if(!this.compiled) {
      throw new Error("Can't bind uncompiled shader");
    }
    this.gl.useProgram(this.program);
  }

  compile(gl) {
    this.gl = gl;
    if (!this.compiled) {
      this.uniforms = {};
      const vertProgram = this.compileShader(this.gl, this.vert, gl.VERTEX_SHADER);
      const fragProgram = this.compileShader(this.gl, this.frag, gl.FRAGMENT_SHADER);
      this.program = this.createShaderProgram(this.gl, vertProgram, fragProgram);
      this.compiled = true;
    }
  }

  isCompiled() {
    return this.compiled;
  }

  compileShader(gl, src, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Error when compiling shader: ${gl.getShaderInfoLog(shader)}`);
      console.groupCollapsed('Shader source');
      console.log(src);
      console.groupEnd();
      return null;
    }
    return shader;
  }

  createShaderProgram(gl, vertexShader, fragmentShader) {
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    for(let i = 0; i < this.attributes.length; i++) {
      gl.bindAttribLocation(shaderProgram, i, this.attributes[i]);
    }

    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      let info = gl.getProgramInfoLog(shaderProgram);
      console.error(`Error compiling shader: \n\n${info}`);
    }
    gl.useProgram(shaderProgram);
    return shaderProgram;
  }


  getUniformHandle(uniformName) {
    if(this.uniforms[uniformName] === undefined) {
      let handle = this.gl.getUniformLocation(this.program, uniformName);
      this.uniforms[uniformName] = handle;
    }
    return this.uniforms[uniformName];
  }

  setBool(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform1i(uniformHandle, value?1:0);
  }

  setInt(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform1i(uniformHandle, value);
  }

  setFloat(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform1f(uniformHandle, value);
  }

  setVec2(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform2fv(uniformHandle, value);
  }

  setVec3(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform3fv(uniformHandle, value);
  }

  setVec4(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform4fv(uniformHandle, value);
  }

  setMat3(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniformMatrix3fv(uniformHandle, false, value);
  }

  setMat4(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniformMatrix4fv(uniformHandle, false, value);
  }

  setSampler2D(uniformName, value) {
    this.setInt(uniformName, value);
  }

  unbind() {
    this.gl.useProgram(null);
  }
}

function generateGeometry(gl, numPoints, innerRadius) {
  let points = [0, 0, 0];
  let indices = [];
  for (let i = 0; i < (numPoints + 1) * 2; i++) {
    let rad = (Math.PI / numPoints) * i;
    let justify = [
      ((1.0 - innerRadius) / 2) * Math.sin(rad),
      ((1.0 - innerRadius) / 2) * Math.cos(rad),
    ];

    if (i % 2 === 0) {
      points.push(Math.sin(rad) + justify[0]);
      points.push(Math.cos(rad) + justify[1]);
    } else {
      points.push(Math.sin(rad) * innerRadius + justify[0]);
      points.push(Math.cos(rad) * innerRadius + justify[1]);
    }
    points.push(0);
  }

  for (let i = 0; i < numPoints; i++) {
    [3, 2, 1, 3, 4, 2].map((n) => n + i * 2).forEach((n) => indices.push(n));
  }
  return new VertexArray(gl, points, indices, [3], gl.TRIANGLES);
}

class Ring {
  constructor(gl, points = 6, innerRadius = 0.5) {
    this.points = points;
    this.geometry = generateGeometry(gl, points, innerRadius);
  }

  bind(gl) {
    this.geometry.bind(gl);
  }

  unbind(gl) {
    this.geometry.bind(gl);
  }

  draw(gl) {
    this.geometry.draw(gl);
  }
}

/* src/components/ColorPicker/ColorPicker.svelte generated by Svelte v3.43.0 */

const { console: console_1$5 } = globals;
const file$q = "src/components/ColorPicker/ColorPicker.svelte";

function create_fragment$q(ctx) {
	let div1;
	let div0;
	let canvas_1;
	let t;
	let input;
	let input_style_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			canvas_1 = element("canvas");
			t = space();
			input = element("input");
			attr_dev(canvas_1, "class", "color-input-canvas svelte-1ocz4nw");
			attr_dev(canvas_1, "width", "512");
			attr_dev(canvas_1, "height", "512");
			add_location(canvas_1, file$q, 434, 4, 11124);
			attr_dev(input, "type", "text");
			attr_dev(input, "spellcheck", "false");
			attr_dev(input, "maxlength", "7");
			attr_dev(input, "style", input_style_value = `color: ${/*color*/ ctx[2].isLight() ? 'black' : 'white'}; background-color: #${/*hexString*/ ctx[3]}`);
			input.value = /*hexString*/ ctx[3];
			attr_dev(input, "class", "svelte-1ocz4nw");
			add_location(input, file$q, 440, 4, 11238);
			attr_dev(div0, "class", "color-input-color");
			add_location(div0, file$q, 433, 2, 11088);
			attr_dev(div1, "class", "color-picker svelte-1ocz4nw");
			add_location(div1, file$q, 432, 0, 11043);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, canvas_1);
			/*canvas_1_binding*/ ctx[7](canvas_1);
			append_dev(div0, t);
			append_dev(div0, input);
			/*div1_binding*/ ctx[8](div1);

			if (!mounted) {
				dispose = [
					listen_dev(input, "input", /*onHexInputChange*/ ctx[4], false, false, false),
					listen_dev(input, "paste", /*onHexInputChange*/ ctx[4], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*color, hexString*/ 12 && input_style_value !== (input_style_value = `color: ${/*color*/ ctx[2].isLight() ? 'black' : 'white'}; background-color: #${/*hexString*/ ctx[3]}`)) {
				attr_dev(input, "style", input_style_value);
			}

			if (dirty[0] & /*hexString*/ 8 && input.value !== /*hexString*/ ctx[3]) {
				prop_dev(input, "value", /*hexString*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			/*canvas_1_binding*/ ctx[7](null);
			/*div1_binding*/ ctx[8](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$q.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$q($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ColorPicker', slots, []);
	let canvas;
	let root = document.body;
	let gl;
	let colorWheelShader;
	let satValShader;
	let solidShader;
	let quad;
	let triP;
	let triPT;
	let triangle;
	let ring;
	let triangleModel;

	function initCanvas() {
		gl = canvas.getContext('webgl', {
			premultipliedAlpha: true,
			preserveDrawingBuffer: true
		});

		gl.clearColor(0, 0, 0, 1.0);

		colorWheelShader = new Shader({
				frag: colorWheelFrag,
				vert: colorWheelVert
			});

		colorWheelShader.compile(gl);
		satValShader = new Shader({ frag: satValFrag, vert: satValVert });
		satValShader.compile(gl);
		solidShader = new Shader({ frag: solidFrag$1, vert: solidVert });
		solidShader.compile(gl);
		quad = new VertexArray(gl, [1, 1, -1, 1, -1, -1, 1, -1], [1, 0, 2, 2, 0, 3], [2]);
		let t = [[0, 1.0], [0.8660253882408142, -0.5], [-0.8660253882408142, -0.5]];
		triP = t;
		triPT = [create(), create(), create()];
		let uv = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]];

		triangle = new VertexArray(gl,
		[
				t[0][0],
				t[0][1],
				uv[0][0],
				uv[0][1],
				uv[0][2],
				t[1][0],
				t[1][1],
				uv[1][0],
				uv[1][1],
				uv[1][2],
				t[2][0],
				t[2][1],
				uv[2][0],
				uv[2][1],
				uv[2][2]
			],
		[1, 0, 2],
		[2, 3]);

		ring = new Ring(gl, 24, 0.6);
		triangleModel = create$4();
		canvas.addEventListener('pointerdown', onCanvasMouseDown);
		canvas.addEventListener('pointerup', onCanvasMouseUp);
	}

	let mouseDown = false;
	let colorWheelToggle = false;
	let triangleToggle = false;
	let state = {};

	function onHexInputChange(event) {
		let str = event.target.value;

		if (str[0] === '#') {
			str = str.substr(1);
		}

		let color = tinycolor(`#${str}`);

		if (str.length === 6 && color.isValid()) {
			let hsv = color.toHsv();
			updateColor(hsv.h / 360, hsv.s, hsv.v);
		}
	}

	function onCanvasMouseDown(event) {
		event.preventDefault();
		root.addEventListener('pointermove', onCanvasMouseMove);
		mouseDown = true;
		let rect = canvas.getBoundingClientRect();

		let coords = [
			2.0 * ((event.clientX - rect.x) / rect.width - 0.5),
			2.0 * (-(event.clientY - rect.y) / rect.height + 0.5)
		];

		let hsv = handleInput(coords);

		if (hsv === undefined) {
			return;
		} else {
			let { hue, saturation, value } = hsv;
			updateColor(hue, saturation, value);
		}
	}

	function onCanvasMouseMove(event) {
		event.preventDefault();

		if (mouseDown === true && event.buttons === 0) {
			mouseDown = false;
			colorWheelToggle = false;
			triangleToggle = false;
			root.removeEventListener('mousemove', onCanvasMouseMove);
			return;
		}

		if (mouseDown) {
			let rect = canvas.getBoundingClientRect();

			let coords = [
				2.0 * ((event.clientX - rect.x) / rect.width - 0.5),
				2.0 * (-(event.clientY - rect.y) / rect.height + 0.5)
			];

			let hsv = handleInput(coords);

			if (hsv === undefined) {
				return;
			} else {
				let { hue, saturation, value } = hsv;
				updateColor(hue, saturation, value);
			}
		}
	}

	function onCanvasMouseUp(event) {
		console.log('onCanvasMouseUp');
		event.preventDefault();
		root.removeEventListener('mousemove', onCanvasMouseMove);
		mouseDown = false;
		colorWheelToggle = false;
		triangleToggle = false;
	}

	onDestroy(() => {
		root.removeEventListener('mousemove', onCanvasMouseMove);
	});

	function handleInput(coords) {
		let { hue, saturation, value } = state;
		let positionInWheel = getPositionInWheel(coords);
		let positionInTriangle = getPositionInTriangle(coords);

		if (positionInWheel !== undefined) {
			hue = positionInWheel;
			colorWheelToggle = true;
			return { hue, saturation, value };
		} else if (positionInTriangle !== undefined) {
			let pos = positionInTriangle;

			if (pos.w + pos.v > 1.0 || pos.v < 0 || pos.w < 0) {
				pos = getClosestPointToTriangle(pos, coords);
			}

			value = Math.max(0, Math.min(1.0, 1.0 - pos.w));
			saturation = Math.max(0, Math.min(1.0, pos.u / value));

			// Still some weirdness when value is around zero
			if (Number.isNaN(saturation)) {
				saturation = 0.0;
			}

			triangleToggle = true;
			return { hue, saturation, value };
		} else {
			return undefined;
		}
	}

	function updateColor(hue, saturation, value, fireEvent = true) {
		let newColor = tinycolor.fromRatio({ h: hue, s: saturation, v: value });
		setState({ hue, saturation, value });
		let rgb = newColor.toRgb();

		let ratio = {
			r: rgb.r / 255,
			g: rgb.g / 255,
			b: rgb.b / 255,
			a: rgb.a
		};

		if (fireEvent) {
			emit(ratio);
		}
	}

	function getPositionInTriangle(coord) {
		let a = triPT[0];
		let b = sub(create(), triPT[1], a);
		let c = sub(create(), triPT[2], a);
		let p = sub(create(), coord, a);
		let d = b[0] * c[1] - c[0] * b[1];
		let u = (p[0] * (b[1] - c[1]) + p[1] * (c[0] - b[0]) + b[0] * c[1] - c[0] * b[1]) / d;
		let v = (p[0] * c[1] - p[1] * c[0]) / d;
		let w = (p[1] * b[0] - p[0] * b[1]) / d;

		if (!colorWheelToggle && (triangleToggle || u > 0.0 && u < 1.0 && v > 0.0 && v < 1.0 && w > 0.0 && w < 1.0)) {
			return { u, v, w };
		}

		return undefined;
	}

	function getTriangleCoordinateFromColor(color) {
		let v = 1.0 - color.value;
		let s = (1.0 - color.saturation) * color.value;
		let a = triPT[0];
		let b = triPT[1];
		let c = triPT[2];
		let v1 = sub(create(), b, a);
		let v2 = sub(create(), c, a);
		let r1 = mul(create(), v1, [s, s]);
		let r2 = mul(create(), v2, [v, v]);
		let res = add(create(), r1, r2);
		add(res, res, a);
		return res;
	}

	function getClosestPointToTriangle(pos, coords) {
		let from;
		let to;

		if (pos.w + pos.v > 1.0) {
			from = triPT[1];
			to = triPT[2];
		} else if (pos.v < 0) {
			from = triPT[0];
			to = triPT[2];
		} else if (pos.w < 0) {
			from = triPT[0];
			to = triPT[1];
		}

		let line = sub(create(), from, to);
		let len$1 = len(line);
		normalize(line, line);
		let v = sub(create(), coords, to);
		let d = dot(v, line);
		d = Math.max(0, Math.min(len$1, d));
		let res = scaleAndAdd(create(), to, line, d);
		return getPositionInTriangle(res);
	}

	function getPositionInWheel(p) {
		let center = [0, 0];
		let dist = distance(p, center);

		if (!triangleToggle && (colorWheelToggle || dist > 0.8 && dist < 1.0)) {
			return getAngle([1, 0], p) / (2.0 * Math.PI);
		}

		return undefined;
	}

	function render() {
		let color = tinycolor.fromRatio({
			h: state.hue,
			s: state.saturation,
			v: state.value
		});

		gl.clear(gl.COLOR_BUFFER_BIT);
		quad.bind();
		let resolution = [canvas.getAttribute('width'), canvas.getAttribute('height')];
		colorWheelShader.bind();
		colorWheelShader.setVec2('resolution', resolution);
		quad.draw();
		quad.unbind();
		colorWheelShader.unbind();
		satValShader.bind();
		triangle.bind();
		triangleModel = create$4();
		let rot = state.hue * Math.PI * 2.0 - Math.PI / 2.0;
		let hueRot = setAxisAngle(create$1(), [0, 0, 1], rot);
		fromRotationTranslationScale(triangleModel, hueRot, create$3(), [0.8, 0.8, 0.8]);
		transformMat4(triPT[0], triP[0], triangleModel);
		transformMat4(triPT[1], triP[1], triangleModel);
		transformMat4(triPT[2], triP[2], triangleModel);
		let mvp2 = create$4();
		translate(mvp2, mvp2, [0.5, 0.5, 0.0]);
		rotate$1(mvp2, mvp2, rot, [0, 0, 1.0]);
		scale$1(mvp2, mvp2, [0.8, 0.8, 0.8]);
		satValShader.setMat4('mvp', triangleModel);
		satValShader.setFloat('hue', state.hue);
		triangle.draw();
		triangle.unbind();
		satValShader.unbind();
		solidShader.bind();
		ring.bind();
		let pos = getTriangleCoordinateFromColor(state);

		let svMarkerColor = color.isLight()
		? [0.0, 0.0, 0.0, 1.0]
		: [1.0, 1.0, 1.0, 1.0];

		solidShader.setVec4('color', svMarkerColor);
		solidShader.setMat4('mvp', fromRotationTranslationScale(create$4(), create$1(), [pos[0], pos[1], 0], [0.03, 0.03, 1.0]));
		ring.draw();
		ring.unbind();
		let hue = tinycolor.fromRatio({ h: state.hue, s: 1.0, v: 1.0 });

		let hueMarkerColor = hue.isLight()
		? [0.0, 0.0, 0.0, 1.0]
		: [1.0, 1.0, 1.0, 1.0];

		let hueMarkerMatrix = create$4();
		let quatMat = fromQuat(create$4(), hueRot);
		multiply$1(hueMarkerMatrix, hueMarkerMatrix, quatMat);
		translate(hueMarkerMatrix, hueMarkerMatrix, [0, 0.9, 0]);
		scale$1(hueMarkerMatrix, hueMarkerMatrix, [0.015, 0.1, 1.0]);
		quad.bind();
		solidShader.setVec4('color', hueMarkerColor);
		solidShader.setMat4('mvp', hueMarkerMatrix);
		quad.draw();
		quad.unbind();
		solidShader.unbind();
	}

	function emit(inColor) {
		$$invalidate(2, color = tinycolor.fromRatio(inColor));
		$$invalidate(3, hexString = color.toHex());
		onChange(inColor);
	}

	function setState(newState) {
		state = newState;
		render();
	}

	let { value } = $$props;

	let { onChange = () => {
		
	} } = $$props;

	let elm;
	let color = tinycolor.fromRatio(value);
	let hsv = color.toHsv();
	let hexString = color.toHex();

	state = {
		hue: hsv.h / 360,
		value: hsv.v,
		saturation: hsv.s
	};

	onMount(() => {
		initCanvas();
		setState(state);
	});

	const writable_props = ['value', 'onChange'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<ColorPicker> was created with unknown prop '${key}'`);
	});

	function canvas_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			canvas = $$value;
			$$invalidate(0, canvas);
		});
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			elm = $$value;
			$$invalidate(1, elm);
		});
	}

	$$self.$$set = $$props => {
		if ('value' in $$props) $$invalidate(5, value = $$props.value);
		if ('onChange' in $$props) $$invalidate(6, onChange = $$props.onChange);
	};

	$$self.$capture_state = () => ({
		onMount,
		onDestroy,
		mat4FromRotationTranslationScale: fromRotationTranslationScale,
		mat4Create: create$4,
		mat4Translate: translate,
		mat4Rotate: rotate$1,
		mat4Scale: scale$1,
		mat4FromQuat: fromQuat,
		mat4Multiply: multiply$1,
		quatSetAxisAngle: setAxisAngle,
		quatCreate: create$1,
		vec3Create: create$3,
		vec2,
		tinycolor,
		getAngle,
		colorWheelVert,
		colorWheelFrag,
		satValVert,
		satValFrag,
		solidFrag: solidFrag$1,
		solidVert,
		VertexArray,
		Shader,
		Ring,
		canvas,
		root,
		gl,
		colorWheelShader,
		satValShader,
		solidShader,
		quad,
		triP,
		triPT,
		triangle,
		ring,
		triangleModel,
		initCanvas,
		mouseDown,
		colorWheelToggle,
		triangleToggle,
		state,
		onHexInputChange,
		onCanvasMouseDown,
		onCanvasMouseMove,
		onCanvasMouseUp,
		handleInput,
		updateColor,
		getPositionInTriangle,
		getTriangleCoordinateFromColor,
		getClosestPointToTriangle,
		getPositionInWheel,
		render,
		emit,
		setState,
		value,
		onChange,
		elm,
		color,
		hsv,
		hexString
	});

	$$self.$inject_state = $$props => {
		if ('canvas' in $$props) $$invalidate(0, canvas = $$props.canvas);
		if ('root' in $$props) root = $$props.root;
		if ('gl' in $$props) gl = $$props.gl;
		if ('colorWheelShader' in $$props) colorWheelShader = $$props.colorWheelShader;
		if ('satValShader' in $$props) satValShader = $$props.satValShader;
		if ('solidShader' in $$props) solidShader = $$props.solidShader;
		if ('quad' in $$props) quad = $$props.quad;
		if ('triP' in $$props) triP = $$props.triP;
		if ('triPT' in $$props) triPT = $$props.triPT;
		if ('triangle' in $$props) triangle = $$props.triangle;
		if ('ring' in $$props) ring = $$props.ring;
		if ('triangleModel' in $$props) triangleModel = $$props.triangleModel;
		if ('mouseDown' in $$props) mouseDown = $$props.mouseDown;
		if ('colorWheelToggle' in $$props) colorWheelToggle = $$props.colorWheelToggle;
		if ('triangleToggle' in $$props) triangleToggle = $$props.triangleToggle;
		if ('state' in $$props) state = $$props.state;
		if ('value' in $$props) $$invalidate(5, value = $$props.value);
		if ('onChange' in $$props) $$invalidate(6, onChange = $$props.onChange);
		if ('elm' in $$props) $$invalidate(1, elm = $$props.elm);
		if ('color' in $$props) $$invalidate(2, color = $$props.color);
		if ('hsv' in $$props) hsv = $$props.hsv;
		if ('hexString' in $$props) $$invalidate(3, hexString = $$props.hexString);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		canvas,
		elm,
		color,
		hexString,
		onHexInputChange,
		value,
		onChange,
		canvas_1_binding,
		div1_binding
	];
}

class ColorPicker extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$q, create_fragment$q, not_equal, { value: 5, onChange: 6 }, null, [-1, -1]);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ColorPicker",
			options,
			id: create_fragment$q.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*value*/ ctx[5] === undefined && !('value' in props)) {
			console_1$5.warn("<ColorPicker> was created without expected prop 'value'");
		}
	}

	get value() {
		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onChange() {
		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onChange(value) {
		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
        };
    });
}

let lastListenerId = 0;
let listenersSnapshot;

let listeners = writable({});
let isVisible = writable(false);
let position = writable([0, 0]);
let color = writable({ r: 1.0, g: 0.0, b: 0.0 });

listeners.subscribe((s) => (listenersSnapshot = s));

let colorPickerStore = {
  onColorChange: (listener) => {
    let id = lastListenerId++;
    listeners.update((l) => ({
      ...l,
      [id]: listener,
    }));
    return id;
  },
  removeListener: (id) => {
    listeners.update((s) => {
      let ls = { ...s };
      delete ls[id];
      return { ...ls };
    });
  },
  showColorPicker: (x, y, startColor) => {
    position.set([x, y]);
    isVisible.set(true);
    color.set(startColor);
  },
  emit: (color) => {
    console.log('emit');
    Object.values(listenersSnapshot).forEach((l) => l(color));
  },
  listeners,
  isVisible,
  position,
  color,
};

/* src/pages/Editor/ColorPickerDialog/ColorPickerDialog.svelte generated by Svelte v3.43.0 */
const file$p = "src/pages/Editor/ColorPickerDialog/ColorPickerDialog.svelte";

// (65:0) {#if $isVisible}
function create_if_block$e(ctx) {
	let div;
	let colorpicker;
	let div_style_value;
	let current;

	colorpicker = new ColorPicker({
			props: {
				value: /*$colorPickerColor*/ ctx[4],
				onChange: /*onColorChange*/ ctx[10]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(colorpicker.$$.fragment);
			attr_dev(div, "class", "dialog svelte-1xlfena");
			attr_dev(div, "style", div_style_value = `left: ${/*realX*/ ctx[0]}px; top: ${/*realY*/ ctx[1]}px`);
			add_location(div, file$p, 65, 2, 1648);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(colorpicker, div, null);
			/*div_binding*/ ctx[11](div);
			current = true;
		},
		p: function update(ctx, dirty) {
			const colorpicker_changes = {};
			if (dirty & /*$colorPickerColor*/ 16) colorpicker_changes.value = /*$colorPickerColor*/ ctx[4];
			colorpicker.$set(colorpicker_changes);

			if (!current || dirty & /*realX, realY*/ 3 && div_style_value !== (div_style_value = `left: ${/*realX*/ ctx[0]}px; top: ${/*realY*/ ctx[1]}px`)) {
				attr_dev(div, "style", div_style_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(colorpicker.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(colorpicker.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(colorpicker);
			/*div_binding*/ ctx[11](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$e.name,
		type: "if",
		source: "(65:0) {#if $isVisible}",
		ctx
	});

	return block;
}

function create_fragment$p(ctx) {
	let t;
	let if_block_anchor;
	let current;
	let mounted;
	let dispose;
	let if_block = /*$isVisible*/ ctx[3] && create_if_block$e(ctx);

	const block = {
		c: function create() {
			t = space();
			if (if_block) if_block.c();
			if_block_anchor = empty$1();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(document.body, "pointermove", /*bodyMouseMove*/ ctx[8], false, false, false),
					listen_dev(document.body, "pointerdown", /*bodyMouseDown*/ ctx[9], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*$isVisible*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$isVisible*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$e(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$p.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$p($$self, $$props, $$invalidate) {
	let $isVisible;
	let $position;
	let $colorPickerColor;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ColorPickerDialog', slots, []);
	let realX;
	let realY;
	let position = colorPickerStore.position;
	validate_store(position, 'position');
	component_subscribe($$self, position, value => $$invalidate(12, $position = value));
	let isVisible = colorPickerStore.isVisible;
	validate_store(isVisible, 'isVisible');
	component_subscribe($$self, isVisible, value => $$invalidate(3, $isVisible = value));
	let colorPickerColor = colorPickerStore.color;
	validate_store(colorPickerColor, 'colorPickerColor');
	component_subscribe($$self, colorPickerColor, value => $$invalidate(4, $colorPickerColor = value));
	let elm;

	afterUpdate(() => {
		let pos = $position;

		if ($isVisible) {
			setPosition(pos[0], pos[1]);
		}
	});

	function setPosition(x, y) {
		if (elm !== undefined && elm !== null) {
			let rect = elm.getBoundingClientRect();
			$$invalidate(0, realX = x - rect.width / 2);
			$$invalidate(1, realY = y + 10);

			if (realX < 0) {
				$$invalidate(0, realX = 0);
			}

			if (realX + rect.width > window.innerWidth) {
				$$invalidate(0, realX = window.innerWidth - rect.width);
			}
		}
	}

	function bodyMouseMove(event) {
		if ($isVisible) {
			let rect = elm.getBoundingClientRect();
			let centerX = rect.x + rect.width / 2;
			let centerY = rect.y + rect.height / 2;
			let distToCenter = sub(create(), [event.clientX, event.clientY], [centerX, centerY]);

			if (Math.abs(distToCenter[0]) > 220 || Math.abs(distToCenter[1]) > 220) {
				set_store_value(isVisible, $isVisible = false, $isVisible);
			}
		}
	}

	function bodyMouseDown(event) {
		if ($isVisible) {
			if (!elm.contains(event.target)) {
				set_store_value(isVisible, $isVisible = false, $isVisible);
			}
		}
	}

	function onColorChange(newColor) {
		colorPickerStore.emit(newColor);
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ColorPickerDialog> was created with unknown prop '${key}'`);
	});

	function div_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			elm = $$value;
			$$invalidate(2, elm);
		});
	}

	$$self.$capture_state = () => ({
		afterUpdate,
		vec2,
		ColorPicker,
		colorPickerStore,
		realX,
		realY,
		position,
		isVisible,
		colorPickerColor,
		elm,
		setPosition,
		bodyMouseMove,
		bodyMouseDown,
		onColorChange,
		$isVisible,
		$position,
		$colorPickerColor
	});

	$$self.$inject_state = $$props => {
		if ('realX' in $$props) $$invalidate(0, realX = $$props.realX);
		if ('realY' in $$props) $$invalidate(1, realY = $$props.realY);
		if ('position' in $$props) $$invalidate(5, position = $$props.position);
		if ('isVisible' in $$props) $$invalidate(6, isVisible = $$props.isVisible);
		if ('colorPickerColor' in $$props) $$invalidate(7, colorPickerColor = $$props.colorPickerColor);
		if ('elm' in $$props) $$invalidate(2, elm = $$props.elm);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		realX,
		realY,
		elm,
		$isVisible,
		$colorPickerColor,
		position,
		isVisible,
		colorPickerColor,
		bodyMouseMove,
		bodyMouseDown,
		onColorChange,
		div_binding
	];
}

class ColorPickerDialog extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$p, create_fragment$p, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ColorPickerDialog",
			options,
			id: create_fragment$p.name
		});
	}
}

const defaultFormats = {
    number: {
        scientific: { notation: 'scientific' },
        engineering: { notation: 'engineering' },
        compactLong: { notation: 'compact', compactDisplay: 'long' },
        compactShort: { notation: 'compact', compactDisplay: 'short' },
    },
    date: {
        short: { month: 'numeric', day: 'numeric', year: '2-digit' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { month: 'long', day: 'numeric', year: 'numeric' },
        full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    },
    time: {
        short: { hour: 'numeric', minute: 'numeric' },
        medium: { hour: 'numeric', minute: 'numeric', second: 'numeric' },
        long: {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
        },
        full: {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
        },
    },
};
const defaultOptions = {
    fallbackLocale: '',
    initialLocale: '',
    loadingDelay: 200,
    formats: defaultFormats,
    warnOnMissingMessages: true,
};
const options = defaultOptions;
let currentLocale;
function getCurrentLocale() {
    return currentLocale;
}
function setCurrentLocale(val) {
    return currentLocale = val;
}
function getOptions() {
    return options;
}
function getSubLocales(refLocale) {
    return refLocale
        .split('-')
        .map((_, i, arr) => arr.slice(0, i + 1).join('-'))
        .reverse();
}
function getPossibleLocales(refLocale, fallbackLocale = getOptions().fallbackLocale) {
    const locales = getSubLocales(refLocale);
    if (fallbackLocale) {
        return [...new Set([...locales, ...getSubLocales(fallbackLocale)])];
    }
    return locales;
}

// @ts-ignore
let dictionary;
const $dictionary = writable({});
function getLocaleDictionary(locale) {
    return dictionary[locale] || null;
}
function hasLocaleDictionary(locale) {
    return locale in dictionary;
}
function getMessageFromDictionary(locale, id) {
    if (hasLocaleDictionary(locale)) {
        const localeDictionary = getLocaleDictionary(locale);
        if (id in localeDictionary) {
            return localeDictionary[id];
        }
        const ids = id.split('.');
        let tmpDict = localeDictionary;
        for (let i = 0; i < ids.length; i++) {
            if (typeof tmpDict[ids[i]] !== 'object') {
                return tmpDict[ids[i]] || null;
            }
            tmpDict = tmpDict[ids[i]];
        }
    }
    return null;
}
function getClosestAvailableLocale(refLocale) {
    if (refLocale == null)
        return null;
    const relatedLocales = getPossibleLocales(refLocale);
    for (let i = 0; i < relatedLocales.length; i++) {
        const locale = relatedLocales[i];
        if (hasLocaleDictionary(locale)) {
            return locale;
        }
    }
    return null;
}
function addMessages(locale, ...partials) {
    $dictionary.update(d => {
        d[locale] = Object.assign(d[locale] || {}, ...partials);
        return d;
    });
}
$dictionary.subscribe(newDictionary => (dictionary = newDictionary));

// @ts-ignore
const $isLoading = writable(false);

const loaderQueue = {};
function removeLocaleFromQueue(locale) {
    delete loaderQueue[locale];
}
function getLocaleQueue(locale) {
    return loaderQueue[locale];
}
function getLocalesQueues(locale) {
    return getPossibleLocales(locale)
        .reverse()
        .map(localeItem => {
        const queue = getLocaleQueue(localeItem);
        return [localeItem, queue ? [...queue] : []];
    })
        .filter(([, queue]) => queue.length > 0);
}
function hasLocaleQueue(locale) {
    return getPossibleLocales(locale)
        .reverse()
        .some(getLocaleQueue);
}
const activeLocaleFlushes = {};
function flush(locale) {
    if (!hasLocaleQueue(locale))
        return Promise.resolve();
    if (locale in activeLocaleFlushes)
        return activeLocaleFlushes[locale];
    // get queue of XX-YY and XX locales
    const queues = getLocalesQueues(locale);
    // istanbul ignore if
    if (queues.length === 0)
        return Promise.resolve();
    const loadingDelay = setTimeout(() => $isLoading.set(true), getOptions().loadingDelay);
    // TODO what happens if some loader fails
    activeLocaleFlushes[locale] = Promise.all(queues.map(([locale, queue]) => {
        return Promise.all(queue.map(loader => loader())).then(partials => {
            removeLocaleFromQueue(locale);
            partials = partials.map(partial => partial.default || partial);
            addMessages(locale, ...partials);
        });
    })).then(() => {
        clearTimeout(loadingDelay);
        $isLoading.set(false);
        delete activeLocaleFlushes[locale];
    });
    return activeLocaleFlushes[locale];
}

const getLocaleFromNavigator = (ssrDefault) => {
    // istanbul ignore next
    if (typeof window === 'undefined') {
        return ssrDefault || null;
    }
    return window.navigator.language || window.navigator.languages[0];
};

const $locale = writable('');
$locale.subscribe((newLocale) => {
    setCurrentLocale(newLocale);
    if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('lang', newLocale);
    }
});
const localeSet = $locale.set;
$locale.set = (newLocale) => {
    if (getClosestAvailableLocale(newLocale) && hasLocaleQueue(newLocale)) {
        return flush(newLocale).then(() => localeSet(newLocale));
    }
    return localeSet(newLocale);
};
// istanbul ignore next
$locale.update = (fn) => {
    let currentLocale = getCurrentLocale();
    fn(currentLocale);
    localeSet(currentLocale);
};

function init(opts) {
    const { formats, ...rest } = opts;
    const initialLocale = opts.initialLocale || opts.fallbackLocale;
    const options = getOptions();
    Object.assign(options, rest, { initialLocale });
    if (formats) {
        if ('number' in formats) {
            Object.assign(options.formats.number, formats.number);
        }
        if ('date' in formats) {
            Object.assign(options.formats.date, formats.date);
        }
        if ('time' in formats) {
            Object.assign(options.formats.time, formats.time);
        }
    }
    return $locale.set(initialLocale);
}

const lookupCache = {};
const addToCache = (path, locale, message) => {
    if (!message)
        return message;
    if (!(locale in lookupCache))
        lookupCache[locale] = {};
    if (!(path in lookupCache[locale]))
        lookupCache[locale][path] = message;
    return message;
};
const lookup = (path, refLocale) => {
    if (refLocale == null)
        return undefined;
    if (refLocale in lookupCache && path in lookupCache[refLocale]) {
        return lookupCache[refLocale][path];
    }
    const locales = getPossibleLocales(refLocale);
    for (let i = 0; i < locales.length; i++) {
        const locale = locales[i];
        const message = getMessageFromDictionary(locale, path);
        if (message) {
            // Used the requested locale as the cache key
            // Ex: { en: { title: "Title" }}
            // lookup('title', 'en-GB') should cache with 'en-GB' instead of 'en'
            return addToCache(path, refLocale, message);
        }
    }
    return undefined;
};

const formatMessage = (optionsOrId, maybeOptions = {}) => {
    const id = typeof optionsOrId === 'string' ? optionsOrId : optionsOrId.id;
    const options = typeof optionsOrId === 'string' ? maybeOptions : optionsOrId;
    const { values, locale = getCurrentLocale(), default: defaultValue, } = options;
    if (locale == null) {
        throw new Error('[svelte-i18n] Cannot format a message without first setting the initial locale.');
    }
    let message = lookup(id, locale);
    if (typeof message === 'string') {
        return message;
    }
    if (typeof message === 'function') {
        return message(...Object.keys(options.values || {}).sort().map(k => (options.values || {})[k]));
    }
    if (getOptions().warnOnMissingMessages) {
        // istanbul ignore next
        console.warn(`[svelte-i18n] The message "${id}" was not found in "${getPossibleLocales(locale).join('", "')}".${hasLocaleQueue(getCurrentLocale())
            ? `\n\nNote: there are at least one loader still registered to this locale that wasn't executed.`
            : ''}`);
    }
    return defaultValue || id;
};
const $format = /*@__PURE__*/ derived([$locale, $dictionary], () => formatMessage);

var ScarfIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 55.213 85.096\"><path d=\"M41.563 6.96a1.506 1.506 0 000-2.123 1.513 1.513 0 00-2.122 0l-1.357 1.357-2.276-2.275 1.357-1.358a1.505 1.505 0 000-2.12 1.497 1.497 0 00-2.12 0L6.305 29.176c-.063.063-.12.134-.17.197-1.259 1.4-1.746 3.345-1.266 5.155a5.385 5.385 0 001.45 2.481l.077.078 10.925 10.953L.437 64.928a1.505 1.505 0 000 2.121 1.499 1.499 0 002.122 0l1.357-1.357L6.2 67.975l-1.357 1.358a1.496 1.496 0 000 2.121 1.497 1.497 0 002.121 0l1.357-1.357 2.277 2.277-1.357 1.357a1.504 1.504 0 000 2.121 1.497 1.497 0 002.121 0l1.357-1.357 2.285 2.284-1.357 1.357a1.496 1.496 0 000 2.121 1.497 1.497 0 002.121 0l1.357-1.357 2.283 2.284-1.357 1.357a1.495 1.495 0 00-.008 2.113 1.514 1.514 0 002.13.008L48.9 55.933c1.33-1.329 1.896-3.663 1.443-5.36a5.629 5.629 0 00-1.436-2.496l-11.02-11.023 16.885-16.886a1.497 1.497 0 000-2.12 1.506 1.506 0 00-2.122-.002l-1.357 1.357-2.277-2.276 1.358-1.357a1.505 1.505 0 00-.008-2.128 1.503 1.503 0 00-2.114.006l-1.357 1.357-2.284-2.283 1.358-1.357a1.505 1.505 0 000-2.12 1.504 1.504 0 00-2.122 0L42.49 10.6l-2.284-2.284zM11.914 38.39c1.626-.494 4.49-1.846 7.538-3.295 2.793-1.322 5.953-2.828 7.254-3.168a2.576 2.576 0 012.228.445c.425.34.75.807.898 1.365.212.764.092 1.704-.835 2.631l-9.553 9.553zm1.91 28.511h4.37l.006 4.377c0 .396.155.778.438 1.062.275.275.665.438 1.061.438l4.362-.007.008 3.755-2.539 2.538L6.038 63.57l2.538-2.539h3.747v4.37c.008.403.164.785.44 1.061.282.283.663.44 1.06.44zm4.95-4.95h4.37l.005 4.376c0 .396.156.778.44 1.062.274.275.663.438 1.06.438l4.362-.007.007 3.756-1.95 1.951v-2.263c0-.396-.157-.778-.439-1.06a1.51 1.51 0 00-1.06-.439l-4.363.007-.008-4.377a1.51 1.51 0 00-1.5-1.499H15.33l.007-4.363a1.541 1.541 0 00-.445-1.068 1.535 1.535 0 00-1.06-.438l-2.256.007 1.951-1.95 3.747-.002v4.37c.001.396.163.785.438 1.062a1.51 1.51 0 001.062.437zm28.015-11.753c.317.318.544.714.65 1.146.211.764.105 1.705-.828 2.64L32.017 68.575v-2.263c0-.396-.156-.778-.439-1.06a1.52 1.52 0 00-1.062-.439l-4.362.007v-4.37a1.523 1.523 0 00-1.507-1.507h-4.37l.008-4.362a1.541 1.541 0 00-.445-1.068 1.538 1.538 0 00-1.06-.438l-2.257.007 14.764-14.765a5.488 5.488 0 001.365-2.256zM35.764 34.933l-4.278-4.279c-1.336-1.336-3.23-2.24-5.544-1.625-1.568.41-4.588 1.845-7.785 3.358-2.785 1.33-5.96 2.835-7.262 3.175a2.559 2.559 0 01-2.468-.658 2.558 2.558 0 01-.657-1.152c-.234-.869-.007-1.789.842-2.637l14.58-14.58v2.248a1.51 1.51 0 001.5 1.5h4.368v4.37c0 .82.672 1.491 1.5 1.497h4.37v4.371c0 .82.671 1.492 1.5 1.5h2.247zm5.911-5.912H37.928v-4.37a1.491 1.491 0 00-1.499-1.499h-4.37v-4.369a1.462 1.462 0 00-.438-1.06 1.458 1.458 0 00-1.06-.44h-4.37v-3.747l1.95-1.95v2.248a1.509 1.509 0 001.5 1.498h4.37v4.37a1.51 1.51 0 001.498 1.5h4.37v4.37c0 .82.672 1.491 1.5 1.498h2.248zm7.496-7.495l-2.539 2.54-3.006.006h-.748v-4.37a1.49 1.49 0 00-1.499-1.499h-4.37v-4.37a1.46 1.46 0 00-.439-1.06 1.459 1.459 0 00-1.06-.439h-4.37V8.586l2.546-2.545 13.208 13.207z\"/></svg>\n";

var YarnIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64.84 64.62\"><path d=\"M58.32 6.52c7.43 7.44 8.62 15.86 3.02 21.46-4.3 4.3-13.4 4.34-17.6 4.1L32.1 43.72c.23 4.3.12 13.17-4.1 17.4-5.6 5.6-14.03 4.4-21.46-3.03C-.9 50.65-2.1 42.23 3.51 36.63c4.22-4.23 13.1-4.33 17.4-4.1l11.83-11.85c-.2-4.36-.04-13.02 4.12-17.18 5.6-5.6 14.02-4.4 21.46 3.02zm.9 19.34a8.46 8.46 0 002.41-8.03 13.9 13.9 0 00-1.55-4.09c-.39 3.87-1.4 9.5-3.99 14a8.8 8.8 0 003.13-1.88zm-1.9-16c-.35-.4-.73-.82-1.13-1.2v-.02a24.22 24.22 0 00-1.63-1.48c-.26 4.84-1.4 15.07-6.3 21.95 1.14-.05 2.27-.14 3.36-.3 4.34-4.7 5.62-13.8 5.7-18.96zM44.4 29.1c5.58-5.95 7.18-17.64 7.25-24.06a16.83 16.83 0 00-2.9-1.36c-.24 4.87-1.4 16.12-6.96 23.16l2.24 2.24.37.02zm1.37-26.07a8.36 8.36 0 00-8.23 4.71c2.51-.96 5.28-1.8 8.1-2.26.06-.86.11-1.68.13-2.45zm-1.09 9.12c.25-1.2.45-2.4.61-3.55a44.36 44.36 0 00-8.96 2.86 30.45 30.45 0 00-.47 3.28 43.33 43.33 0 018.82-2.59zm-1.59 5.81c.3-.84.57-1.7.82-2.57-2.82.6-5.63 1.57-8.22 2.68 0 .75.01 1.5.04 2.21a46.37 46.37 0 017.36-2.32zm-12.06 22.6l10.11-10.13-6.96-6.95-10.1 10.11L31 40.56zm8.6-15.88c.75-1 1.42-2.09 2.01-3.27-1.34.38-2.67.83-3.96 1.32zM29.16 46.53c0-.74 0-1.48-.04-2.2a44.98 44.98 0 01-7.36 2.31c-.3.85-.57 1.7-.8 2.57 2.8-.6 5.61-1.57 8.2-2.68zm-.64 6.61c.22-1.05.37-2.15.48-3.27a43.7 43.7 0 01-8.83 2.59 54.3 54.3 0 00-.6 3.54 43.9 43.9 0 008.95-2.86zm-.69-11.53l-2.2-2.2a20.16 20.16 0 00-2.42 3.78c1.57-.44 3.12-.98 4.62-1.58zM25.87 59a7.81 7.81 0 001.44-2.13 41.6 41.6 0 01-8.09 2.26c-.07.87-.1 1.68-.14 2.45a8.4 8.4 0 006.8-2.58zm-2.39-21.73l-1.73-1.73c-.12.02-.24.03-.37.03l-.92-.06c-5.58 5.95-7.18 17.65-7.25 24.06a16 16 0 002.9 1.36c.24-4.98 1.46-16.67 7.37-23.66zm-6.9-1.76c-1.13.05-2.26.15-3.36.3-4.33 4.7-5.62 13.81-5.7 18.96.36.41.73.81 1.13 1.2v.01c.53.53 1.08 1.02 1.63 1.48.27-4.84 1.41-15.07 6.3-21.95zM4.76 50.88c.4-3.88 1.41-9.5 4-14a8.8 8.8 0 00-3.13 1.87 8.47 8.47 0 00-2.42 8.03c.26 1.33.8 2.72 1.55 4.1z\"/></svg>\n";

var PatternBucket = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26.46 26.46\">\n  <g fill=\"none\">\n    <path d=\"M8.63 13.47a39.14 39.14 0 001.34 1.44s-1.3.65-2.68 1.1c-1.4.45-3.42.31-3.42.31s.05 6.97.03 8.41c.47.07 19.16.03 19.16.03L23 16.18s-6.75-.32-9.47-1.68c-1.21-.6-2.8-3.16-2.8-3.16\" stroke-linejoin=\"round\"/>\n    <path d=\"M1.74 6.7l4.37-4.8 7.75 5.75-5.7 6.08z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />\n    <path d=\"M11.67 8.53l2.34-5.3-.83-.68-2.36 2.84\" stroke-linejoin=\"round\"/>\n    <g transform=\"matrix(1 0 0 .98193 0 -265.35)\" stroke-width=\"0.5\">\n      <path d=\"M6.55 295.18v-7.65h14.1v7.72\" />\n      <path d=\"M17.1 287.55v7.7M10.02 287.57v7.63M13.51 287.53v7.84\" />\n      <path d=\"M6.52 290.53h14M6.5 293.34h14.05\" />\n      <path d=\"M7.02 287.98h2.54v2.12H7.02zM10.44 290.96h2.67v1.98h-2.67z\" fill=\"#E4E1D2\" />\n      <rect y=\"293.75\" x=\"13.94\" height=\"1.67\" width=\"2.73\" ry=\"0\" fill=\"#E4E1D2\" />\n    </g>\n  </g>\n</svg>\n";

var Repeat$1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><switch><g><path d=\"M73.4 73.3c-1.1-.1-2.1.2-2.9.9A31.7 31.7 0 0118.4 50v-1.9h4.3c1.3 0 2.4-.7 3.1-1.8.6-1.1.6-2.5-.1-3.5l-8.3-12.9c-.6-1-1.7-1.5-2.9-1.5s-2.3.6-2.9 1.5L3.1 42.8a3.4 3.4 0 00-.1 3.5 3.5 3.5 0 003.1 1.8h4.3V50a39.8 39.8 0 0065.5 30.3 4 4 0 00.5-5.7c-1-.7-1.9-1.3-3-1.3zM97.1 53.7a3.5 3.5 0 00-3.1-1.8h-4.3V50a39.8 39.8 0 00-65.5-30.4 4 4 0 00-.5 5.7 4 4 0 005.7.5A31.7 31.7 0 0181.5 50v1.8h-4.3c-1.3 0-2.4.7-3.1 1.8-.6 1.1-.6 2.5.1 3.5L82.5 70c.6 1 1.7 1.6 2.9 1.6s2.3-.6 2.9-1.6l8.3-12.9c1-1 1.1-2.3.5-3.4z\"/></g></switch></svg>\n";

var RepetitionIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-5 0 80 60\" width=\"50\" height=\"50\"><path fill-rule=\"evenodd\" d=\"M48.4 50.3A9 9 0 0 1 36 42c0-1 .1-1.8.4-2.7A9 9 0 0 1 24 31c0-1 .1-1.8.4-2.7A9 9 0 0 1 12 20c0-1 .1-1.8.4-2.7A9 9 0 0 1 0 9a9 9 0 1 1 17.6 2.7A9 9 0 0 1 30 20a9 9 0 0 1-.4 2.7A9 9 0 0 1 42 31a9 9 0 0 1-.4 2.7A9 9 0 0 1 54 42a9 9 0 0 1-.4 2.7A9 9 0 0 1 66 53a9 9 0 1 1-17.6-2.7zM21 27a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm24 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14z\"/></svg>\n";

var Mexp = function (parsed) {
  this.value = parsed;
};

Mexp.math = {
  isDegree: true, // mode of calculator
  acos: function (x) {
    return (Mexp.math.isDegree ? 180 / Math.PI * Math.acos(x) : Math.acos(x))
  },
  add: function (a, b) {
    return a + b
  },
  asin: function (x) {
    return (Mexp.math.isDegree ? 180 / Math.PI * Math.asin(x) : Math.asin(x))
  },
  atan: function (x) {
    return (Mexp.math.isDegree ? 180 / Math.PI * Math.atan(x) : Math.atan(x))
  },
  acosh: function (x) {
    return Math.log(x + Math.sqrt(x * x - 1))
  },
  asinh: function (x) {
    return Math.log(x + Math.sqrt(x * x + 1))
  },
  atanh: function (x) {
    return Math.log((1 + x) / (1 - x))
  },
  C: function (n, r) {
    var pro = 1;
    var other = n - r;
    var choice = r;
    if (choice < other) {
      choice = other;
      other = r;
    }
    for (var i = choice + 1; i <= n; i++) {
      pro *= i;
    }
    return pro / Mexp.math.fact(other)
  },
  changeSign: function (x) {
    return -x
  },
  cos: function (x) {
    if (Mexp.math.isDegree) x = Mexp.math.toRadian(x);
    return Math.cos(x)
  },
  cosh: function (x) {
    return (Math.pow(Math.E, x) + Math.pow(Math.E, -1 * x)) / 2
  },
  div: function (a, b) {
    return a / b
  },
  fact: function (n) {
    if (n % 1 !== 0) return 'NaN'
    var pro = 1;
    for (var i = 2; i <= n; i++) {
      pro *= i;
    }
    return pro
  },
  inverse: function (x) {
    return 1 / x
  },
  log: function (i) {
    return Math.log(i) / Math.log(10)
  },
  mod: function (a, b) {
    return a % b
  },
  mul: function (a, b) {
    return a * b
  },
  P: function (n, r) {
    var pro = 1;
    for (var i = Math.floor(n) - Math.floor(r) + 1; i <= Math.floor(n); i++) {
      pro *= i;
    }
    return pro
  },
  Pi: function (low, high, ex) {
    var pro = 1;
    for (var i = low; i <= high; i++) {
      pro *= Number(ex.postfixEval({
        n: i
      }));
    }
    return pro
  },
  pow10x: function (e) {
    var x = 1;
    while (e--) {
      x *= 10;
    }
    return x
  },
  sigma: function (low, high, ex) {
    var sum = 0;
    for (var i = low; i <= high; i++) {
      sum += Number(ex.postfixEval({
        n: i
      }));
    }
    return sum
  },
  sin: function (x) {
    if (Mexp.math.isDegree) x = Mexp.math.toRadian(x);
    return Math.sin(x)
  },
  sinh: function (x) {
    return (Math.pow(Math.E, x) - Math.pow(Math.E, -1 * x)) / 2
  },
  sub: function (a, b) {
    return a - b
  },
  tan: function (x) {
    if (Mexp.math.isDegree) x = Mexp.math.toRadian(x);
    return Math.tan(x)
  },
  tanh: function (x) {
    return Mexp.sinha(x) / Mexp.cosha(x)
  },
  toRadian: function (x) {
    return x * Math.PI / 180
  }
};
Mexp.Exception = function (message) {
  this.message = message;
};
var math_function = Mexp;

function inc (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    arr[i] += val;
  }
  return arr
}
var token = [
  'sin',
  'cos',
  'tan',
  'pi',
  '(',
  ')',
  'P',
  'C',
  ' ',
  'asin',
  'acos',
  'atan',
  '7',
  '8',
  '9',
  'int',
  'cosh',
  'acosh',
  'ln',
  '^',
  'root',
  '4',
  '5',
  '6',
  '/',
  '!',
  'tanh',
  'atanh',
  'Mod',
  '1',
  '2',
  '3',
  '*',
  'sinh',
  'asinh',
  'e',
  'log',
  '0',
  '.',
  '+',
  '-',
  ',',
  'Sigma',
  'n',
  'Pi',
  'pow'
];
var show = [
  'sin',
  'cos',
  'tan',
  '&pi;',
  '(',
  ')',
  'P',
  'C',
  ' ',
  'asin',
  'acos',
  'atan',
  '7',
  '8',
  '9',
  'Int',
  'cosh',
  'acosh',
  ' ln',
  '^',
  'root',
  '4',
  '5',
  '6',
  '&divide;',
  '!',
  'tanh',
  'atanh',
  ' Mod ',
  '1',
  '2',
  '3',
  '&times;',
  'sinh',
  'asinh',
  'e',
  ' log',
  '0',
  '.',
  '+',
  '-',
  ',',
  '&Sigma;',
  'n',
  '&Pi;',
  'pow'
];
var eva = [
  math_function.math.sin,
  math_function.math.cos,
  math_function.math.tan,
  'PI',
  '(',
  ')',
  math_function.math.P,
  math_function.math.C,
  ' '.anchor,
  math_function.math.asin,
  math_function.math.acos,
  math_function.math.atan,
  '7',
  '8',
  '9',
  Math.floor,
  math_function.math.cosh,
  math_function.math.acosh,
  Math.log,
  Math.pow,
  Math.sqrt,
  '4',
  '5',
  '6',
  math_function.math.div,
  math_function.math.fact,
  math_function.math.tanh,
  math_function.math.atanh,
  math_function.math.mod,
  '1',
  '2',
  '3',
  math_function.math.mul,
  math_function.math.sinh,
  math_function.math.asinh,
  'E',
  math_function.math.log,
  '0',
  '.',
  math_function.math.add,
  math_function.math.sub,
  ',',
  math_function.math.sigma,
  'n',
  math_function.math.Pi,
  Math.pow
];
var preced = {
  0: 11,
  1: 0,
  2: 3,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 11,
  8: 11,
  9: 1,
  10: 10,
  11: 0,
  12: 11,
  13: 0,
  14: -1 // will be filtered after lexer
}; // stores precedence by types
var type = [
  0, 0, 0, 3, 4, 5, 10, 10, 14, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 10, 0, 1, 1, 1, 2, 7, 0, 0, 2, 1, 1,
  1, 2, 0, 0, 3, 0, 1, 6, 9, 9, 11, 12, 13, 12, 8
];
/*
0 : function with syntax function_name(Maths_exp)
1 : numbers
2 : binary operators like * / Mod left associate and same precedence
3 : Math constant values like e,pi,Cruncher ans
4 : opening bracket
5 : closing bracket
6 : decimal
7 : function with syntax (Math_exp)function_name
8: function with syntax function_name(Math_exp1,Math_exp2)
9 : binary operator like +,-
10: binary operator like P C or ^
11: ,
12: function with , seperated three parameters and third parameter is a string that will be mexp string
13: variable of Sigma function
*/
var type0 = {
  0: true,
  1: true,
  3: true,
  4: true,
  6: true,
  8: true,
  9: true,
  12: true,
  13: true,
  14: true
}; // type2:true,type4:true,type9:true,type11:true,type21:true,type22
var type1 = {
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
  10: true,
  11: true,
  12: true,
  13: true
}; // type3:true,type5:true,type7:true,type23
var type1Asterick = {
  0: true,
  3: true,
  4: true,
  8: true,
  12: true,
  13: true
};
var empty = {};
var type3Asterick = {
  0: true,
  1: true,
  3: true,
  4: true,
  6: true,
  8: true,
  12: true,
  13: true
}; // type_5:true,type_7:true,type_23
var type6 = {
  1: true
};
var newAr = [
  [],
  [
    '1',
    '2',
    '3',
    '7',
    '8',
    '9',
    '4',
    '5',
    '6',
    '+',
    '-',
    '*',
    '/',
    '(',
    ')',
    '^',
    '!',
    'P',
    'C',
    'e',
    '0',
    '.',
    ',',
    'n',
    ' '
  ],
  ['pi', 'ln', 'Pi'],
  ['sin', 'cos', 'tan', 'Del', 'int', 'Mod', 'log', 'pow'],
  ['asin', 'acos', 'atan', 'cosh', 'root', 'tanh', 'sinh'],
  ['acosh', 'atanh', 'asinh', 'Sigma']
];

function match (str1, str2, i, x) {
  for (var f = 0; f < x; f++) {
    if (str1[i + f] !== str2[f]) {
      return false
    }
  }
  return true
}
math_function.addToken = function (tokens) {
  for (var i = 0; i < tokens.length; i++) {
    var x = tokens[i].token.length;
    var temp = -1;

    // newAr is a specially designed data structure index of 1d array = length of tokens
    newAr[x] = newAr[x] || [];
    for (var y = 0; y < newAr[x].length; y++) {
      if (tokens[i].token === newAr[x][y]) {
        temp = token.indexOf(newAr[x][y]);
        break
      }
    }
    if (temp === -1) {
      token.push(tokens[i].token);
      type.push(tokens[i].type);
      if (newAr.length <= tokens[i].token.length) {
        newAr[tokens[i].token.length] = [];
      }
      newAr[tokens[i].token.length].push(tokens[i].token);
      eva.push(tokens[i].value);
      show.push(tokens[i].show);
    } else {
      // overwrite
      token[temp] = tokens[i].token;
      type[temp] = tokens[i].type;
      eva[temp] = tokens[i].value;
      show[temp] = tokens[i].show;
    }
  }
};

function tokenize (string) {
  var nodes = [];
  var length = string.length;
  var key, x, y;
  for (var i = 0; i < length; i++) {
    if (i < length - 1 && string[i] === ' ' && string[i + 1] === ' ') {
      continue
    }
    key = '';
    for (
      x = string.length - i > newAr.length - 2 ? newAr.length - 1 : string.length - i;
      x > 0;
      x--
    ) {
      if (newAr[x] === undefined) continue
      for (y = 0; y < newAr[x].length; y++) {
        if (match(string, newAr[x][y], i, x)) {
          key = newAr[x][y];
          y = newAr[x].length;
          x = 0;
        }
      }
    }
    i += key.length - 1;
    if (key === '') {
      throw new math_function.Exception("Can't understand after " + string.slice(i))
    }
    var index = token.indexOf(key);
    nodes.push({
      index: index,
      token: key,
      type: type[index],
      eval: eva[index],
      precedence: preced[type[index]],
      show: show[index]
    });
  }
  return nodes
}

math_function.lex = function (inp, tokens) {

  var changeSignObj = {
    value: math_function.math.changeSign,
    type: 0,
    pre: 21,
    show: '-'
  };
  var closingParObj = {
    value: ')',
    show: ')',
    type: 5,
    pre: 0
  };
  var openingParObj = {
    value: '(',
    type: 4,
    pre: 0,
    show: '('
  };
  var str = [openingParObj];

  var ptc = []; // Parenthesis to close at the beginning is after one token
  var inpStr = inp;
  var allowed = type0;
  var bracToClose = 0;
  var asterick = empty;
  var prevKey = '';
  var i;
  if (typeof tokens !== 'undefined') {
    math_function.addToken(tokens);
  }
  var obj = {};
  var nodes = tokenize(inpStr);
  for (i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.type === 14) {
      if (
        i > 0 &&
        i < nodes.length - 1 &&
        nodes[i + 1].type === 1 &&
        (nodes[i - 1].type === 1 || nodes[i - 1].type === 6)
      ) { throw new math_function.Exception('Unexpected Space') }
      continue
    }
    var cToken = node.token;
    var cType = node.type;
    var cEv = node.eval;
    var cPre = node.precedence;
    var cShow = node.show;
    var pre = str[str.length - 1];
    var j;
    for (j = ptc.length; j--;) {
      // loop over ptc
      if (ptc[j] === 0) {
        if ([0, 2, 3, 4, 5, 9, 11, 12, 13].indexOf(cType) !== -1) {
          if (allowed[cType] !== true) {
            throw new math_function.Exception(cToken + ' is not allowed after ' + prevKey)
          }
          str.push(closingParObj);
          allowed = type1;
          asterick = type3Asterick;
          inc(ptc, -1).pop();
        }
      } else break
    }
    if (allowed[cType] !== true) {
      throw new math_function.Exception(cToken + ' is not allowed after ' + prevKey)
    }
    if (asterick[cType] === true) {
      cType = 2;
      cEv = math_function.math.mul;
      cShow = '&times;';
      cPre = 3;
      i = i - 1;
    }
    obj = {
      value: cEv,
      type: cType,
      pre: cPre,
      show: cShow
    };
    if (cType === 0) {
      allowed = type0;
      asterick = empty;
      inc(ptc, 2).push(2);
      str.push(obj);
      str.push(openingParObj);
    } else if (cType === 1) {
      if (pre.type === 1) {
        pre.value += cEv;
        inc(ptc, 1);
      } else {
        str.push(obj);
      }
      allowed = type1;
      asterick = type1Asterick;
    } else if (cType === 2) {
      allowed = type0;
      asterick = empty;
      inc(ptc, 2);
      str.push(obj);
    } else if (cType === 3) {
      // constant
      str.push(obj);
      allowed = type1;
      asterick = type3Asterick;
    } else if (cType === 4) {
      inc(ptc, 1);
      bracToClose++;
      allowed = type0;
      asterick = empty;
      str.push(obj);
    } else if (cType === 5) {
      if (!bracToClose) {
        throw new math_function.Exception('Closing parenthesis are more than opening one, wait What!!!')
      }
      bracToClose--;
      allowed = type1;
      asterick = type3Asterick;
      str.push(obj);
      inc(ptc, 1);
    } else if (cType === 6) {
      if (pre.hasDec) {
        throw new math_function.Exception('Two decimals are not allowed in one number')
      }
      if (pre.type !== 1) {
        pre = {
          value: 0,
          type: 1,
          pre: 0
        }; // pre needs to be changed as it will the last value now to be safe in later code
        str.push(pre);
        inc(ptc, -1);
      }
      allowed = type6;
      inc(ptc, 1);
      asterick = empty;
      pre.value += cEv;
      pre.hasDec = true;
    } else if (cType === 7) {
      allowed = type1;
      asterick = type3Asterick;
      inc(ptc, 1);
      str.push(obj);
    }
    if (cType === 8) {
      allowed = type0;
      asterick = empty;
      inc(ptc, 4).push(4);
      str.push(obj);
      str.push(openingParObj);
    } else if (cType === 9) {
      if (pre.type === 9) {
        if (pre.value === math_function.math.add) {
          pre.value = cEv;
          pre.show = cShow;
          inc(ptc, 1);
        } else if (pre.value === math_function.math.sub && cShow === '-') {
          pre.value = math_function.math.add;
          pre.show = '+';
          inc(ptc, 1);
        }
      } else if (
        pre.type !== 5 &&
        pre.type !== 7 &&
        pre.type !== 1 &&
        pre.type !== 3 &&
        pre.type !== 13
      ) {
        // changesign only when negative is found
        if (cToken === '-') {
          // do nothing for + token
          // don't add with the above if statement as that will run the else statement of parent if on Ctoken +
          allowed = type0;
          asterick = empty;
          inc(ptc, 2).push(2);
          str.push(changeSignObj);
          str.push(openingParObj);
        }
      } else {
        str.push(obj);
        inc(ptc, 2);
      }
      allowed = type0;
      asterick = empty;
    } else if (cType === 10) {
      allowed = type0;
      asterick = empty;
      inc(ptc, 2);
      str.push(obj);
    } else if (cType === 11) {
      allowed = type0;
      asterick = empty;
      str.push(obj);
    } else if (cType === 12) {
      allowed = type0;
      asterick = empty;
      inc(ptc, 6).push(6);
      str.push(obj);
      str.push(openingParObj);
    } else if (cType === 13) {
      allowed = type1;
      asterick = type3Asterick;
      str.push(obj);
    }
    inc(ptc, -1);
    prevKey = cToken;
  }
  for (j = ptc.length; j--;) {
    // loop over ptc
    if (ptc[j] === 0) {
      str.push(closingParObj);
      inc(ptc, -1).pop();
    } else break // if it is not zero so before ptc also cant be zero
  }
  if (allowed[5] !== true) {
    throw new math_function.Exception('complete the expression')
  }
  while (bracToClose--) {
    str.push(closingParObj);
  }

  str.push(closingParObj);
  //        console.log(str);
  return new math_function(str)
};
var lexer = math_function;

lexer.prototype.toPostfix = function () {
	var post = [], elem, popped, prep, pre, ele;
	var stack = [{ value: "(", type: 4, pre: 0 }];
	var arr = this.value;
	for (var i = 1; i < arr.length; i++) {
		if (arr[i].type === 1 || arr[i].type === 3 || arr[i].type === 13) {	//if token is number,constant,or n(which is also a special constant in our case)
			if (arr[i].type === 1)
				arr[i].value = Number(arr[i].value);
			post.push(arr[i]);
		}
		else if (arr[i].type === 4) {
			stack.push(arr[i]);
		}
		else if (arr[i].type === 5) {
			while ((popped = stack.pop()).type !== 4) {
				post.push(popped);
			}
		}
		else if (arr[i].type === 11) {
			while ((popped = stack.pop()).type !== 4) {
				post.push(popped);
			}
			stack.push(popped);
		}
		else {
			elem = arr[i];
			pre = elem.pre;
			ele = stack[stack.length - 1];
			prep = ele.pre;
			var flag = ele.value == 'Math.pow' && elem.value == 'Math.pow';
			if (pre > prep) stack.push(elem);
			else {
				while (prep >= pre && !flag || flag && pre < prep) {
					popped = stack.pop();
					ele = stack[stack.length - 1];
					post.push(popped);
					prep = ele.pre;
					flag = elem.value == 'Math.pow' && ele.value == 'Math.pow';
				}
				stack.push(elem);
			}
		}
	}
	return new lexer(post);
};
var postfix = lexer;

postfix.prototype.postfixEval = function (UserDefined) {
	UserDefined=UserDefined||{};
	UserDefined.PI=Math.PI;
	UserDefined.E=Math.E;
	var stack=[],pop1,pop2,pop3;
	var arr=this.value;
	var bool=(typeof UserDefined.n!=="undefined");
	for(var i=0;i<arr.length;i++){
		if(arr[i].type===1){
			stack.push({value:arr[i].value,type:1});
		}
		else if(arr[i].type===3){
			stack.push({value:UserDefined[arr[i].value],type:1});
		}
		else if(arr[i].type===0){
			if(typeof stack[stack.length-1].type==="undefined"){
				stack[stack.length-1].value.push(arr[i]);
			}
			else stack[stack.length-1].value=arr[i].value(stack[stack.length-1].value);
		}
		else if(arr[i].type===7){
			if(typeof stack[stack.length-1].type==="undefined"){
				stack[stack.length-1].value.push(arr[i]);
			}
			else stack[stack.length-1].value=arr[i].value(stack[stack.length-1].value);
		}
		else if(arr[i].type===8){
			pop1=stack.pop();
			pop2=stack.pop();
			stack.push({type:1,value:arr[i].value(pop2.value,pop1.value)});
		}
		else if(arr[i].type===10){
			pop1=stack.pop();
			pop2=stack.pop();
			if(typeof pop2.type==="undefined"){
				pop2.value=pop2.concat(pop1);
				pop2.value.push(arr[i]);
				stack.push(pop2);
			}
			else if (typeof pop1.type==="undefined") {
				pop1.unshift(pop2);
				pop1.push(arr[i]);
				stack.push(pop1);
			}
			else {
				stack.push({type:1,value:arr[i].value(pop2.value,pop1.value)});
            }
		}
		else if(arr[i].type===2||arr[i].type===9){
			pop1=stack.pop();
			pop2=stack.pop();
			if(typeof pop2.type==="undefined"){
				pop2=pop2.concat(pop1);
				pop2.push(arr[i]);
				stack.push(pop2);
			}
			else if (typeof pop1.type==="undefined") {
				pop1.unshift(pop2);
				pop1.push(arr[i]);
				stack.push(pop1);
			}
			else {
				stack.push({type:1,value:arr[i].value(pop2.value,pop1.value)});
			}
		}
		else if(arr[i].type===12){
			pop1=stack.pop();
			if (typeof pop1.type!=="undefined") {
				pop1=[pop1];
			}
			pop2=stack.pop();
			pop3=stack.pop();
			stack.push({type:1,value:arr[i].value(pop3.value,pop2.value,new postfix(pop1))});
		}
		else if(arr[i].type===13){
			if(bool){
				stack.push({value:UserDefined[arr[i].value],type:3});
			}
			else stack.push([arr[i]]);
		}
	}
	if (stack.length>1) {
		throw(new postfix.Exception("Uncaught Syntax error"));
	}
	return stack[0].value>1000000000000000?"Infinity":parseFloat(stack[0].value.toFixed(15));
};
postfix.eval=function(str,tokens,obj){
	if (typeof tokens==="undefined") {
		return this.lex(str).toPostfix().postfixEval();
	}
	else if (typeof obj==="undefined") {
		if (typeof tokens.length!=="undefined") 
			return this.lex(str,tokens).toPostfix().postfixEval();
		else
			return this.lex(str).toPostfix().postfixEval(tokens);
	}
	else
		return this.lex(str,tokens).toPostfix().postfixEval(obj);
};
var postfix_evaluator=postfix;

postfix_evaluator.prototype.formulaEval = function () {
	var pop1,pop2,pop3;
	var disp=[];
	var arr=this.value;
	for(var i=0;i<arr.length;i++){
		if(arr[i].type===1||arr[i].type===3){
			disp.push({value:arr[i].type===3?arr[i].show:arr[i].value,type:1});
		}
		else if(arr[i].type===13){
			disp.push({value:arr[i].show,type:1});
		}
		else if(arr[i].type===0){
			disp[disp.length-1]={value:arr[i].show+(arr[i].show!="-"?"(":"")+disp[disp.length-1].value+(arr[i].show!="-"?")":""),type:0};
		}
		else if(arr[i].type===7){
			disp[disp.length-1]={value:(disp[disp.length-1].type!=1?"(":"")+disp[disp.length-1].value+(disp[disp.length-1].type!=1?")":"")+arr[i].show,type:7};
		}
		else if(arr[i].type===10){
			pop1=disp.pop();
			pop2=disp.pop();
			if(arr[i].show==='P'||arr[i].show==='C')disp.push({value:"<sup>"+pop2.value+"</sup>"+arr[i].show+"<sub>"+pop1.value+"</sub>",type:10});
			else disp.push({value:(pop2.type!=1?"(":"")+pop2.value+(pop2.type!=1?")":"")+"<sup>"+pop1.value+"</sup>",type:1});
		}
		else if(arr[i].type===2||arr[i].type===9){
			pop1=disp.pop();
			pop2=disp.pop();
			disp.push({value:(pop2.type!=1?"(":"")+pop2.value+(pop2.type!=1?")":"")+arr[i].show+(pop1.type!=1?"(":"")+pop1.value+(pop1.type!=1?")":""),type:arr[i].type});
		}
		else if(arr[i].type===12){
			pop1=disp.pop();
			pop2=disp.pop();
			pop3=disp.pop();
			disp.push({value:arr[i].show+"("+pop3.value+","+pop2.value+","+pop1.value+")",type:12});
		}
	}
	return disp[0].value;
};
var formula_evaluator=postfix_evaluator;

/* src/components/NumberInput/NumberInput.svelte generated by Svelte v3.43.0 */
const file$o = "src/components/NumberInput/NumberInput.svelte";

// (62:4) {#if showArrows}
function create_if_block$d(ctx) {
	let button0;
	let t1;
	let button1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button0 = element("button");
			button0.textContent = "▲";
			t1 = space();
			button1 = element("button");
			button1.textContent = "▼";
			attr_dev(button0, "class", "arrow top svelte-736cov");
			attr_dev(button0, "type", "button");
			add_location(button0, file$o, 62, 6, 1293);
			attr_dev(button1, "class", "arrow bottom svelte-736cov");
			attr_dev(button1, "type", "button");
			add_location(button1, file$o, 64, 6, 1382);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button0, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, button1, anchor);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[10], false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[11], false, false, false)
				];

				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(button0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(button1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$d.name,
		type: "if",
		source: "(62:4) {#if showArrows}",
		ctx
	});

	return block;
}

function create_fragment$o(ctx) {
	let label_1;
	let t0;
	let t1;
	let div;
	let input;
	let t2;
	let mounted;
	let dispose;
	let if_block = /*showArrows*/ ctx[5] && create_if_block$d(ctx);

	const block = {
		c: function create() {
			label_1 = element("label");
			t0 = text(/*label*/ ctx[1]);
			t1 = space();
			div = element("div");
			input = element("input");
			t2 = space();
			if (if_block) if_block.c();
			attr_dev(input, "name", "number-input");
			attr_dev(input, "type", "text");
			attr_dev(input, "autocomplete", "off");
			attr_dev(input, "min", /*min*/ ctx[2]);
			attr_dev(input, "max", /*max*/ ctx[3]);
			input.disabled = /*disabled*/ ctx[4];
			attr_dev(input, "class", "svelte-736cov");
			add_location(input, file$o, 50, 4, 1073);
			attr_dev(div, "class", "svelte-736cov");
			add_location(div, file$o, 49, 2, 1063);
			attr_dev(label_1, "for", "number-input");
			attr_dev(label_1, "class", "svelte-736cov");
			toggle_class(label_1, "disabled", /*disabled*/ ctx[4]);
			add_location(label_1, file$o, 47, 0, 1009);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, label_1, anchor);
			append_dev(label_1, t0);
			append_dev(label_1, t1);
			append_dev(label_1, div);
			append_dev(div, input);
			set_input_value(input, /*value*/ ctx[0]);
			append_dev(div, t2);
			if (if_block) if_block.m(div, null);

			if (!mounted) {
				dispose = [
					listen_dev(input, "blur", /*evalMath*/ ctx[6], false, false, false),
					listen_dev(input, "keydown", /*keydown*/ ctx[7], false, false, false),
					listen_dev(input, "input", /*input_input_handler*/ ctx[9])
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

			if (dirty & /*min*/ 4) {
				attr_dev(input, "min", /*min*/ ctx[2]);
			}

			if (dirty & /*max*/ 8) {
				attr_dev(input, "max", /*max*/ ctx[3]);
			}

			if (dirty & /*disabled*/ 16) {
				prop_dev(input, "disabled", /*disabled*/ ctx[4]);
			}

			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
				set_input_value(input, /*value*/ ctx[0]);
			}

			if (/*showArrows*/ ctx[5]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$d(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*disabled*/ 16) {
				toggle_class(label_1, "disabled", /*disabled*/ ctx[4]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(label_1);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$o.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$o($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('NumberInput', slots, []);
	let { value } = $$props;
	let { label } = $$props;
	let { min = undefined } = $$props;
	let { max = undefined } = $$props;
	let { disabled = undefined } = $$props;
	let { showArrows = false } = $$props;
	let { evalExpr = true } = $$props;
	let lastValidValue = value;

	function evalMath() {
		if (evalExpr) {
			let result = value;

			try {
				result = formula_evaluator.eval(result);
			} catch(e) {
				
			} // sic

			$$invalidate(0, value = Math.floor(result));

			if (max !== undefined) {
				$$invalidate(0, value = Math.min(max, result));
			}

			if (min !== undefined) {
				$$invalidate(0, value = Math.max(min, result));
			}

			if (isNaN(value)) {
				$$invalidate(0, value = lastValidValue);
			} else {
				lastValidValue = value;
			}
		}
	}

	function keydown(e) {
		if (showArrows) {
			if (e.key === 'ArrowUp') {
				event.preventDefault();
				$$invalidate(0, value++, value);
			} else if (e.key === 'ArrowDown') {
				event.preventDefault();
				$$invalidate(0, value--, value);
			}
		}
	}

	const writable_props = ['value', 'label', 'min', 'max', 'disabled', 'showArrows', 'evalExpr'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NumberInput> was created with unknown prop '${key}'`);
	});

	function input_input_handler() {
		value = this.value;
		$$invalidate(0, value);
	}

	const click_handler = () => $$invalidate(0, value++, value);
	const click_handler_1 = () => $$invalidate(0, value--, value);

	$$self.$$set = $$props => {
		if ('value' in $$props) $$invalidate(0, value = $$props.value);
		if ('label' in $$props) $$invalidate(1, label = $$props.label);
		if ('min' in $$props) $$invalidate(2, min = $$props.min);
		if ('max' in $$props) $$invalidate(3, max = $$props.max);
		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
		if ('showArrows' in $$props) $$invalidate(5, showArrows = $$props.showArrows);
		if ('evalExpr' in $$props) $$invalidate(8, evalExpr = $$props.evalExpr);
	};

	$$self.$capture_state = () => ({
		mexp: formula_evaluator,
		value,
		label,
		min,
		max,
		disabled,
		showArrows,
		evalExpr,
		lastValidValue,
		evalMath,
		keydown
	});

	$$self.$inject_state = $$props => {
		if ('value' in $$props) $$invalidate(0, value = $$props.value);
		if ('label' in $$props) $$invalidate(1, label = $$props.label);
		if ('min' in $$props) $$invalidate(2, min = $$props.min);
		if ('max' in $$props) $$invalidate(3, max = $$props.max);
		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
		if ('showArrows' in $$props) $$invalidate(5, showArrows = $$props.showArrows);
		if ('evalExpr' in $$props) $$invalidate(8, evalExpr = $$props.evalExpr);
		if ('lastValidValue' in $$props) lastValidValue = $$props.lastValidValue;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		value,
		label,
		min,
		max,
		disabled,
		showArrows,
		evalMath,
		keydown,
		evalExpr,
		input_input_handler,
		click_handler,
		click_handler_1
	];
}

class NumberInput extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(this, options, instance$o, create_fragment$o, not_equal, {
			value: 0,
			label: 1,
			min: 2,
			max: 3,
			disabled: 4,
			showArrows: 5,
			evalExpr: 8
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "NumberInput",
			options,
			id: create_fragment$o.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
			console.warn("<NumberInput> was created without expected prop 'value'");
		}

		if (/*label*/ ctx[1] === undefined && !('label' in props)) {
			console.warn("<NumberInput> was created without expected prop 'label'");
		}
	}

	get value() {
		throw new Error("<NumberInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<NumberInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<NumberInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<NumberInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get min() {
		throw new Error("<NumberInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set min(value) {
		throw new Error("<NumberInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get max() {
		throw new Error("<NumberInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set max(value) {
		throw new Error("<NumberInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<NumberInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<NumberInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showArrows() {
		throw new Error("<NumberInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showArrows(value) {
		throw new Error("<NumberInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get evalExpr() {
		throw new Error("<NumberInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set evalExpr(value) {
		throw new Error("<NumberInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

function n(n){for(var r=arguments.length,t=Array(r>1?r-1:0),e=1;e<r;e++)t[e-1]=arguments[e];if("production"!==process.env.NODE_ENV){var i=Y[n],o=i?"function"==typeof i?i.apply(null,t):i:"unknown error nr: "+n;throw Error("[Immer] "+o)}throw Error("[Immer] minified error nr: "+n+(t.length?" "+t.map((function(n){return "'"+n+"'"})).join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function r(n){return !!n&&!!n[Q]}function t(n){return !!n&&(function(n){if(!n||"object"!=typeof n)return !1;var r=Object.getPrototypeOf(n);if(null===r)return !0;var t=Object.hasOwnProperty.call(r,"constructor")&&r.constructor;return "function"==typeof t&&Function.toString.call(t)===Z}(n)||Array.isArray(n)||!!n[L]||!!n.constructor[L]||s(n)||v(n))}function i(n,r,t){void 0===t&&(t=!1),0===o(n)?(t?Object.keys:nn)(n).forEach((function(e){t&&"symbol"==typeof e||r(e,n[e],n);})):n.forEach((function(t,e){return r(e,t,n)}));}function o(n){var r=n[Q];return r?r.i>3?r.i-4:r.i:Array.isArray(n)?1:s(n)?2:v(n)?3:0}function u(n,r){return 2===o(n)?n.has(r):Object.prototype.hasOwnProperty.call(n,r)}function a(n,r){return 2===o(n)?n.get(r):n[r]}function f(n,r,t){var e=o(n);2===e?n.set(r,t):3===e?(n.delete(r),n.add(t)):n[r]=t;}function c(n,r){return n===r?0!==n||1/n==1/r:n!=n&&r!=r}function s(n){return X&&n instanceof Map}function v(n){return q&&n instanceof Set}function p(n){return n.o||n.t}function l(n){if(Array.isArray(n))return Array.prototype.slice.call(n);var r=rn(n);delete r[Q];for(var t=nn(r),e=0;e<t.length;e++){var i=t[e],o=r[i];!1===o.writable&&(o.writable=!0,o.configurable=!0),(o.get||o.set)&&(r[i]={configurable:!0,writable:!0,enumerable:o.enumerable,value:n[i]});}return Object.create(Object.getPrototypeOf(n),r)}function d(n,e){return void 0===e&&(e=!1),y(n)||r(n)||!t(n)?n:(o(n)>1&&(n.set=n.add=n.clear=n.delete=h),Object.freeze(n),e&&i(n,(function(n,r){return d(r,!0)}),!0),n)}function h(){n(2);}function y(n){return null==n||"object"!=typeof n||Object.isFrozen(n)}function b(r){var t=tn[r];return t||n(18,r),t}function m(n,r){tn[n]||(tn[n]=r);}function _(){return "production"===process.env.NODE_ENV||U||n(0),U}function j(n,r){r&&(b("Patches"),n.u=[],n.s=[],n.v=r);}function g(n){O(n),n.p.forEach(S),n.p=null;}function O(n){n===U&&(U=n.l);}function w(n){return U={p:[],l:U,h:n,m:!0,_:0}}function S(n){var r=n[Q];0===r.i||1===r.i?r.j():r.g=!0;}function P(r,e){e._=e.p.length;var i=e.p[0],o=void 0!==r&&r!==i;return e.h.O||b("ES5").S(e,r,o),o?(i[Q].P&&(g(e),n(4)),t(r)&&(r=M(e,r),e.l||x(e,r)),e.u&&b("Patches").M(i[Q],r,e.u,e.s)):r=M(e,i,[]),g(e),e.u&&e.v(e.u,e.s),r!==H?r:void 0}function M(n,r,t){if(y(r))return r;var e=r[Q];if(!e)return i(r,(function(i,o){return A(n,e,r,i,o,t)}),!0),r;if(e.A!==n)return r;if(!e.P)return x(n,e.t,!0),e.t;if(!e.I){e.I=!0,e.A._--;var o=4===e.i||5===e.i?e.o=l(e.k):e.o;i(3===e.i?new Set(o):o,(function(r,i){return A(n,e,o,r,i,t)})),x(n,o,!1),t&&n.u&&b("Patches").R(e,t,n.u,n.s);}return e.o}function A(e,i,o,a,c,s){if("production"!==process.env.NODE_ENV&&c===o&&n(5),r(c)){var v=M(e,c,s&&i&&3!==i.i&&!u(i.D,a)?s.concat(a):void 0);if(f(o,a,v),!r(v))return;e.m=!1;}if(t(c)&&!y(c)){if(!e.h.F&&e._<1)return;M(e,c),i&&i.A.l||x(e,c);}}function x(n,r,t){void 0===t&&(t=!1),n.h.F&&n.m&&d(r,t);}function z(n,r){var t=n[Q];return (t?p(t):n)[r]}function I(n,r){if(r in n)for(var t=Object.getPrototypeOf(n);t;){var e=Object.getOwnPropertyDescriptor(t,r);if(e)return e;t=Object.getPrototypeOf(t);}}function k(n){n.P||(n.P=!0,n.l&&k(n.l));}function E(n){n.o||(n.o=l(n.t));}function R(n,r,t){var e=s(r)?b("MapSet").N(r,t):v(r)?b("MapSet").T(r,t):n.O?function(n,r){var t=Array.isArray(n),e={i:t?1:0,A:r?r.A:_(),P:!1,I:!1,D:{},l:r,t:n,k:null,o:null,j:null,C:!1},i=e,o=en$1;t&&(i=[e],o=on);var u=Proxy.revocable(i,o),a=u.revoke,f=u.proxy;return e.k=f,e.j=a,f}(r,t):b("ES5").J(r,t);return (t?t.A:_()).p.push(e),e}function D(e){return r(e)||n(22,e),function n(r){if(!t(r))return r;var e,u=r[Q],c=o(r);if(u){if(!u.P&&(u.i<4||!b("ES5").K(u)))return u.t;u.I=!0,e=F(r,c),u.I=!1;}else e=F(r,c);return i(e,(function(r,t){u&&a(u.t,r)===t||f(e,r,n(t));})),3===c?new Set(e):e}(e)}function F(n,r){switch(r){case 2:return new Map(n);case 3:return Array.from(n)}return l(n)}function T(){function e(n){if(!t(n))return n;if(Array.isArray(n))return n.map(e);if(s(n))return new Map(Array.from(n.entries()).map((function(n){return [n[0],e(n[1])]})));if(v(n))return new Set(Array.from(n).map(e));var r=Object.create(Object.getPrototypeOf(n));for(var i in n)r[i]=e(n[i]);return u(n,L)&&(r[L]=n[L]),r}function f(n){return r(n)?e(n):n}var c="add";m("Patches",{$:function(r,t){return t.forEach((function(t){for(var i=t.path,u=t.op,f=r,s=0;s<i.length-1;s++){var v=o(f),p=i[s];0!==v&&1!==v||"__proto__"!==p&&"constructor"!==p||n(24),"function"==typeof f&&"prototype"===p&&n(24),"object"!=typeof(f=a(f,p))&&n(15,i.join("/"));}var l=o(f),d=e(t.value),h=i[i.length-1];switch(u){case"replace":switch(l){case 2:return f.set(h,d);case 3:n(16);default:return f[h]=d}case c:switch(l){case 1:return f.splice(h,0,d);case 2:return f.set(h,d);case 3:return f.add(d);default:return f[h]=d}case"remove":switch(l){case 1:return f.splice(h,1);case 2:return f.delete(h);case 3:return f.delete(t.value);default:return delete f[h]}default:n(17,u);}})),r},R:function(n,r,t,e){switch(n.i){case 0:case 4:case 2:return function(n,r,t,e){var o=n.t,s=n.o;i(n.D,(function(n,i){var v=a(o,n),p=a(s,n),l=i?u(o,n)?"replace":c:"remove";if(v!==p||"replace"!==l){var d=r.concat(n);t.push("remove"===l?{op:l,path:d}:{op:l,path:d,value:p}),e.push(l===c?{op:"remove",path:d}:"remove"===l?{op:c,path:d,value:f(v)}:{op:"replace",path:d,value:f(v)});}}));}(n,r,t,e);case 5:case 1:return function(n,r,t,e){var i=n.t,o=n.D,u=n.o;if(u.length<i.length){var a=[u,i];i=a[0],u=a[1];var s=[e,t];t=s[0],e=s[1];}for(var v=0;v<i.length;v++)if(o[v]&&u[v]!==i[v]){var p=r.concat([v]);t.push({op:"replace",path:p,value:f(u[v])}),e.push({op:"replace",path:p,value:f(i[v])});}for(var l=i.length;l<u.length;l++){var d=r.concat([l]);t.push({op:c,path:d,value:f(u[l])});}i.length<u.length&&e.push({op:"replace",path:r.concat(["length"]),value:i.length});}(n,r,t,e);case 3:return function(n,r,t,e){var i=n.t,o=n.o,u=0;i.forEach((function(n){if(!o.has(n)){var i=r.concat([u]);t.push({op:"remove",path:i,value:n}),e.unshift({op:c,path:i,value:n});}u++;})),u=0,o.forEach((function(n){if(!i.has(n)){var o=r.concat([u]);t.push({op:c,path:o,value:n}),e.unshift({op:"remove",path:o,value:n});}u++;}));}(n,r,t,e)}},M:function(n,r,t,e){t.push({op:"replace",path:[],value:r}),e.push({op:"replace",path:[],value:n.t});}});}var G,U,W="undefined"!=typeof Symbol&&"symbol"==typeof Symbol("x"),X="undefined"!=typeof Map,q="undefined"!=typeof Set,B="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,H=W?Symbol.for("immer-nothing"):((G={})["immer-nothing"]=!0,G),L=W?Symbol.for("immer-draftable"):"__$immer_draftable",Q=W?Symbol.for("immer-state"):"__$immer_state",Y={0:"Illegal state",1:"Immer drafts cannot have computed properties",2:"This object has been frozen and should not be mutated",3:function(n){return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+n},4:"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",5:"Immer forbids circular references",6:"The first or second argument to `produce` must be a function",7:"The third argument to `produce` must be a function or undefined",8:"First argument to `createDraft` must be a plain object, an array, or an immerable object",9:"First argument to `finishDraft` must be a draft returned by `createDraft`",10:"The given draft is already finalized",11:"Object.defineProperty() cannot be used on an Immer draft",12:"Object.setPrototypeOf() cannot be used on an Immer draft",13:"Immer only supports deleting array indices",14:"Immer only supports setting array indices and the 'length' property",15:function(n){return "Cannot apply patch, path doesn't resolve: "+n},16:'Sets cannot have "replace" patches.',17:function(n){return "Unsupported patch operation: "+n},18:function(n){return "The plugin for '"+n+"' has not been loaded into Immer. To enable the plugin, import and call `enable"+n+"()` when initializing your application."},20:"Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available",21:function(n){return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '"+n+"'"},22:function(n){return "'current' expects a draft, got: "+n},23:function(n){return "'original' expects a draft, got: "+n},24:"Patching reserved attributes like __proto__, prototype and constructor is not allowed"},Z=""+Object.prototype.constructor,nn="undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(n){return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n))}:Object.getOwnPropertyNames,rn=Object.getOwnPropertyDescriptors||function(n){var r={};return nn(n).forEach((function(t){r[t]=Object.getOwnPropertyDescriptor(n,t);})),r},tn={},en$1={get:function(n,r){if(r===Q)return n;var e=p(n);if(!u(e,r))return function(n,r,t){var e,i=I(r,t);return i?"value"in i?i.value:null===(e=i.get)||void 0===e?void 0:e.call(n.k):void 0}(n,e,r);var i=e[r];return n.I||!t(i)?i:i===z(n.t,r)?(E(n),n.o[r]=R(n.A.h,i,n)):i},has:function(n,r){return r in p(n)},ownKeys:function(n){return Reflect.ownKeys(p(n))},set:function(n,r,t){var e=I(p(n),r);if(null==e?void 0:e.set)return e.set.call(n.k,t),!0;if(!n.P){var i=z(p(n),r),o=null==i?void 0:i[Q];if(o&&o.t===t)return n.o[r]=t,n.D[r]=!1,!0;if(c(t,i)&&(void 0!==t||u(n.t,r)))return !0;E(n),k(n);}return n.o[r]===t&&"number"!=typeof t||(n.o[r]=t,n.D[r]=!0,!0)},deleteProperty:function(n,r){return void 0!==z(n.t,r)||r in n.t?(n.D[r]=!1,E(n),k(n)):delete n.D[r],n.o&&delete n.o[r],!0},getOwnPropertyDescriptor:function(n,r){var t=p(n),e=Reflect.getOwnPropertyDescriptor(t,r);return e?{writable:!0,configurable:1!==n.i||"length"!==r,enumerable:e.enumerable,value:t[r]}:e},defineProperty:function(){n(11);},getPrototypeOf:function(n){return Object.getPrototypeOf(n.t)},setPrototypeOf:function(){n(12);}},on={};i(en$1,(function(n,r){on[n]=function(){return arguments[0]=arguments[0][0],r.apply(this,arguments)};})),on.deleteProperty=function(r,t){return "production"!==process.env.NODE_ENV&&isNaN(parseInt(t))&&n(13),en$1.deleteProperty.call(this,r[0],t)},on.set=function(r,t,e){return "production"!==process.env.NODE_ENV&&"length"!==t&&isNaN(parseInt(t))&&n(14),en$1.set.call(this,r[0],t,e,r[0])};var un=function(){function e(r){var e=this;this.O=B,this.F=!0,this.produce=function(r,i,o){if("function"==typeof r&&"function"!=typeof i){var u=i;i=r;var a=e;return function(n){var r=this;void 0===n&&(n=u);for(var t=arguments.length,e=Array(t>1?t-1:0),o=1;o<t;o++)e[o-1]=arguments[o];return a.produce(n,(function(n){var t;return (t=i).call.apply(t,[r,n].concat(e))}))}}var f;if("function"!=typeof i&&n(6),void 0!==o&&"function"!=typeof o&&n(7),t(r)){var c=w(e),s=R(e,r,void 0),v=!0;try{f=i(s),v=!1;}finally{v?g(c):O(c);}return "undefined"!=typeof Promise&&f instanceof Promise?f.then((function(n){return j(c,o),P(n,c)}),(function(n){throw g(c),n})):(j(c,o),P(f,c))}if(!r||"object"!=typeof r){if((f=i(r))===H)return;return void 0===f&&(f=r),e.F&&d(f,!0),f}n(21,r);},this.produceWithPatches=function(n,r){return "function"==typeof n?function(r){for(var t=arguments.length,i=Array(t>1?t-1:0),o=1;o<t;o++)i[o-1]=arguments[o];return e.produceWithPatches(r,(function(r){return n.apply(void 0,[r].concat(i))}))}:[e.produce(n,r,(function(n,r){t=n,i=r;})),t,i];var t,i;},"boolean"==typeof(null==r?void 0:r.useProxies)&&this.setUseProxies(r.useProxies),"boolean"==typeof(null==r?void 0:r.autoFreeze)&&this.setAutoFreeze(r.autoFreeze);}var i=e.prototype;return i.createDraft=function(e){t(e)||n(8),r(e)&&(e=D(e));var i=w(this),o=R(this,e,void 0);return o[Q].C=!0,O(i),o},i.finishDraft=function(r,t){var e=r&&r[Q];"production"!==process.env.NODE_ENV&&(e&&e.C||n(9),e.I&&n(10));var i=e.A;return j(i,t),P(void 0,i)},i.setAutoFreeze=function(n){this.F=n;},i.setUseProxies=function(r){r&&!B&&n(20),this.O=r;},i.applyPatches=function(n,t){var e;for(e=t.length-1;e>=0;e--){var i=t[e];if(0===i.path.length&&"replace"===i.op){n=i.value;break}}var o=b("Patches").$;return r(n)?o(n,t):this.produce(n,(function(n){return o(n,t.slice(e+1))}))},e}(),an=new un,fn=an.produce;an.produceWithPatches.bind(an);an.setAutoFreeze.bind(an);an.setUseProxies.bind(an);var pn=an.applyPatches.bind(an);an.createDraft.bind(an);an.finishDraft.bind(an);

let changes$1 = [];
let currentIndex = -1;
function undo() {
  if (currentIndex < 0) {
    console.log('nope undo');
    return undefined;
  }
  let changeSet = changes$1[currentIndex].inversePatches;
  currentIndex = Math.max(currentIndex - 1, 0);
  return changeSet;
}

function redo() {
  if (currentIndex >= changes$1.length) {
    console.log('nope redo');
    return undefined;
  }
  let changeSet = changes$1[currentIndex].patches;
  currentIndex = Math.min(currentIndex + 1, changes$1.length - 1);
  return changeSet;
}

function push(changeSet) {
  if (currentIndex < changes$1.length) {
    changes$1.length = currentIndex + 1;
  }
  changes$1.push(changeSet);
  currentIndex++;
}

let paths = new Set().add('clear');
let patches = {};

var changes = {
  paths,
  patches,
  clear: () => {
    paths.clear();
    Object.keys(patches).forEach((p) => {
      delete patches[p];
    });
  },
};

function addPatch(path, patch) {
  if (patches[path] === undefined) {
    patches[path] = [];
  }
  patches[path].push(patch);
}
function addChanges(changes) {
  for (let item of changes) {
    if (item.path[0] !== 'hoverCell' && item.path[0] !== 'isDragging') {
      paths.add(item.path[0]);
      addPatch(item.path[0], item);
    }
  }
}

let draft = {};
if (window.localStorage.getItem('draft')) {
  draft = JSON.parse(localStorage.getItem('draft'));
  if (draft.treadling !== undefined) {
    draft.treadleOrder = draft.treadling;
    delete draft.treadling;
  }
  if (draft.pickCount !== undefined) {
    draft.weftCount = draft.pickCount;
    delete draft.pickCount;
  }
  draft.warpColors = draft.warpColors.slice(0, draft.warpCount);
  draft.weftColors = draft.weftColors.slice(0, draft.weftCount);
  if (draft.yarn[0].id === undefined) {
    for (let i = 0; i < draft.yarn.length; i++) {
      draft.yarn[i].id = i;
    }
  }
} else {
  draft = {
    treadleOrder: [],
    threading: [],
    warpColors: new Array(30).fill(1),
    weftColors: new Array(30).fill(0),
    tieup: [
      [1, 0, 0, 1],
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
    ],
    shaftCount: 4,
    treadleCount: 4,
    warpCount: 100,
    weftCount: 100,
    yarn: [
      {
        id: 0,
        name: 'White yarn',
        color: { r: 0.8, g: 0.8, b: 0.8 },
      },
      {
        id: 1,
        name: 'Black yarn',
        color: { r: 0.72, g: 0.29, b: 0.13 },
      },
    ],
  };

  for (let i = 0; i < draft.warpCount; i++) {
    draft.threading.push(i % 4);
  }

  for (let i = 0; i < draft.weftCount; i++) {
    draft.treadleOrder.push(i % 4);
  }
}

function undoDraft() {
  let changes = undo();
  if (changes) {
    let newDraft = pn(draftSnapshot, changes);
    addChanges(changes);
    store$2.set(newDraft);
  }
}

function redoDraft() {
  let changes = redo();
  if (changes) {
    let newDraft = pn(draftSnapshot, changes);
    addChanges(changes);
    store$2.set(newDraft);
  }
}

const store$2 = writable(draft);
var draft$1 = {
  draft: store$2,
  update: function (func, storePatches = true) {
    store$2.set(
      fn(draftSnapshot, func, (patches, inversePatches) => {
        if (storePatches) {
          push({ patches, inversePatches });
        }
        addChanges(patches);
      })
    );
  },
  set: function (newState) {
    store$2.set(
      fn(
        draftSnapshot,
        () => newState,
        (patches, inversePatches) => {
          push({ patches, inversePatches });
          changes.paths.add('clear');
        }
      )
    );
  },
  subscribe: function (subscription) {
    return store$2.subscribe(subscription);
  },
  undo: undoDraft,
  redo: redoDraft,
};
let draftSnapshot;
store$2.subscribe((value) => {
  draftSnapshot = value;
  window.data = draftSnapshot;
  localStorage.setItem('draft', JSON.stringify(draftSnapshot));
});

window.drop = function () {
  localStorage.removeItem('draft');
};

window.update = function () {
  localStorage.setItem('draft', JSON.stringify(window.data));
};

document.body.addEventListener('keydown', (e) => {
  if (e.ctrlKey === true && e.key === 'z') {
    undoDraft();
  } else if (e.ctrlKey === true && e.key === 'y') {
    redoDraft();
  }
});

let ui = {
  selectedMenu: -1,
  selectedColor: 0,
  cellSize: 60,
  scrollX: 0,
  scrollY: 0,
  xStepDistance: 8,
  yStepDistance: 8,
  showTreadleOrder: true,
  showThreading: true,
  selectTo: 0,
  selectFrom: 0,
  isDragging: false,
  hoverCell: [0, 0],
  disableScroll: false,
};
if (window.localStorage.getItem('ui')) {
  let storedUI = JSON.parse(localStorage.getItem('ui'));
  ui = { ...ui, ...storedUI };
}

const store$1 = writable(ui);
let prevStore$1 = ui;
store$1.subscribe((s) => {
  prevStore$1 = s;
});

var ui$1 = {
  ui: store$1,
  update: function (func) {
    store$1.set(fn(prevStore$1, func, (patches) => addChanges(patches)));
  },
  subscribe: function (subscription) {
    return store$1.subscribe(subscription);
  },
};

window.dropUi = function () {
  localStorage.removeItem('ui');
};

store$1.subscribe((value) => {
  window.ui = value;
  localStorage.setItem(
    'ui',
    JSON.stringify({
      selectedColor: value.selectedColor,
      cellSize: value.cellSize,
    })
  );
});

function updateShaftCount(draft, shaftCount) {
  let oldLength = draft.tieup.length;
  draft.tieup.length = shaftCount;
  draft.tieup.fill([], oldLength);
  draft.shaftCount = shaftCount;
}

function updateTreadleCount(draft, treadleCount) {
  draft.tieup.forEach((t) => {
    let oldLength = t.length;
    t.length = treadleCount;
    t.fill(0, oldLength);
  });
  draft.treadleCount = treadleCount;
}

function updateWarpCount(draft, warpCount) {
  let amountToAdd = warpCount - draft.warpCount;
  if (amountToAdd === 0) {
    return draft;
  }
  draft.warpCount = warpCount;
  changeArraySize(draft.warpColors, warpCount);
  changeArraySize(draft.threading, warpCount);
}

function updateWeftCount(draft, weftCount) {
  let amountToAdd = weftCount - draft.weftCount;
  if (amountToAdd === 0) {
    return draft;
  }
  draft.weftCount = weftCount;
  changeArraySize(draft.weftColors, weftCount);
  changeArraySize(draft.treadleOrder, weftCount);
}

function applyPattern(
  draft,
  pattern,
  warpOrWeft,
  mirroredRepeat,
  start = 0,
  end = warpOrWeft === 'warp' ? draft.warpCount : draft.weftCount
) {
  let array = draft[warpOrWeft === 'warp' ? 'threading' : 'treadleOrder'];

  let offset = 0;
  let length = Math.min(end - start, array.length - start);
  for (let i = start; i < length; i++) {
    if (mirroredRepeat && i !== 0 && i % (pattern.length - 1) === 0) {
      offset += 1;
    }
    let j = i + offset;
    let v = j % pattern.length;
    if (mirroredRepeat && Math.floor(j / pattern.length) % 2 === 1) {
      v = pattern.length - (j % pattern.length) - 1;
    }
    array[i] = pattern[v];
  }
}

function changeArraySize(array, newSize) {
  let amountToAdd = newSize - array.length;
  if (amountToAdd > 0) {
    let originalSize = array.length;
    for (let i = 0; i < amountToAdd; i++) {
      array.push(array[i % originalSize]);
    }
  } else {
    array.splice(array.length + amountToAdd);
  }
}

function applyColor(
  draft,
  colors,
  warpOrWeft,
  start = 0,
  length = warpOrWeft === 'warp' ? draft.warpCount : draft.weftCount
) {
  let newColors = draft[warpOrWeft === 'warp' ? 'warpColors' : 'weftColors'];
  for (let i = start; i < length; i++) {
    newColors[i] = colors[i % colors.length];
  }
}

function removeYarn(draft, yarnToRemoveId) {
  let oldIndex = draft.yarn.findIndex((yarn) => yarn.id === yarnToRemoveId);
  let newYarnId;
  if (oldIndex === 0) {
    newYarnId = draft.yarn[1].id;
  } else {
    newYarnId = draft.yarn[oldIndex - 1].id;
  }

  draft.yarn.splice(oldIndex, 1);

  for (let i = 0; i < draft.warpColors.length; i++) {
    let yarnIndex = draft.warpColors[i];
    if (yarnIndex === yarnToRemoveId) {
      draft.warpColors[i] = newYarnId;
    }
  }
  for (let i = 0; i < draft.weftColors.length; i++) {
    let yarnIndex = draft.weftColors[i];
    if (yarnIndex === yarnToRemoveId) {
      draft.weftColors[i] = newYarnId;
    }
  }
}

function newYarn(draft, yarn) {
  let id = draft.yarn.map((a) => a.id).reduce((a, b) => Math.max(a, b)) + 1;
  draft.yarn.push({ ...yarn, id });
}

var draftUtil = /*#__PURE__*/Object.freeze({
	__proto__: null,
	updateShaftCount: updateShaftCount,
	updateTreadleCount: updateTreadleCount,
	updateWarpCount: updateWarpCount,
	updateWeftCount: updateWeftCount,
	applyPattern: applyPattern,
	changeArraySize: changeArraySize,
	applyColor: applyColor,
	removeYarn: removeYarn,
	newYarn: newYarn
});

/* src/pages/Editor/Sidebar/Subcomponents/WeaveSettings.svelte generated by Svelte v3.43.0 */
const file$n = "src/pages/Editor/Sidebar/Subcomponents/WeaveSettings.svelte";

function create_fragment$n(ctx) {
	let form;
	let numberinput0;
	let updating_value;
	let t0;
	let numberinput1;
	let updating_value_1;
	let t1;
	let numberinput2;
	let updating_value_2;
	let t2;
	let numberinput3;
	let updating_value_3;
	let t3;
	let button;
	let t4_value = /*$t*/ ctx[4]('terms.save') + "";
	let t4;
	let current;
	let mounted;
	let dispose;

	function numberinput0_value_binding(value) {
		/*numberinput0_value_binding*/ ctx[6](value);
	}

	let numberinput0_props = {
		label: /*$t*/ ctx[4]('page.weave_settings.shaft_count'),
		showArrows: true
	};

	if (/*shaftCount*/ ctx[0] !== void 0) {
		numberinput0_props.value = /*shaftCount*/ ctx[0];
	}

	numberinput0 = new NumberInput({
			props: numberinput0_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(numberinput0, 'value', numberinput0_value_binding));

	function numberinput1_value_binding(value) {
		/*numberinput1_value_binding*/ ctx[7](value);
	}

	let numberinput1_props = {
		label: /*$t*/ ctx[4]('page.weave_settings.treadle_count'),
		showArrows: true
	};

	if (/*treadleCount*/ ctx[1] !== void 0) {
		numberinput1_props.value = /*treadleCount*/ ctx[1];
	}

	numberinput1 = new NumberInput({
			props: numberinput1_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(numberinput1, 'value', numberinput1_value_binding));

	function numberinput2_value_binding(value) {
		/*numberinput2_value_binding*/ ctx[8](value);
	}

	let numberinput2_props = {
		label: /*$t*/ ctx[4]('page.weave_settings.warp_count')
	};

	if (/*warpCount*/ ctx[2] !== void 0) {
		numberinput2_props.value = /*warpCount*/ ctx[2];
	}

	numberinput2 = new NumberInput({
			props: numberinput2_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(numberinput2, 'value', numberinput2_value_binding));

	function numberinput3_value_binding(value) {
		/*numberinput3_value_binding*/ ctx[9](value);
	}

	let numberinput3_props = {
		label: /*$t*/ ctx[4]('page.weave_settings.weft_count')
	};

	if (/*weftCount*/ ctx[3] !== void 0) {
		numberinput3_props.value = /*weftCount*/ ctx[3];
	}

	numberinput3 = new NumberInput({
			props: numberinput3_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(numberinput3, 'value', numberinput3_value_binding));

	const block = {
		c: function create() {
			form = element("form");
			create_component(numberinput0.$$.fragment);
			t0 = space();
			create_component(numberinput1.$$.fragment);
			t1 = space();
			create_component(numberinput2.$$.fragment);
			t2 = space();
			create_component(numberinput3.$$.fragment);
			t3 = space();
			button = element("button");
			t4 = text(t4_value);
			attr_dev(button, "class", "submit svelte-i2e354");
			add_location(button, file$n, 54, 2, 1462);
			attr_dev(form, "class", "svelte-i2e354");
			add_location(form, file$n, 34, 0, 997);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, form, anchor);
			mount_component(numberinput0, form, null);
			append_dev(form, t0);
			mount_component(numberinput1, form, null);
			append_dev(form, t1);
			mount_component(numberinput2, form, null);
			append_dev(form, t2);
			mount_component(numberinput3, form, null);
			append_dev(form, t3);
			append_dev(form, button);
			append_dev(button, t4);
			current = true;

			if (!mounted) {
				dispose = listen_dev(form, "submit", /*submit*/ ctx[5], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			const numberinput0_changes = {};
			if (dirty & /*$t*/ 16) numberinput0_changes.label = /*$t*/ ctx[4]('page.weave_settings.shaft_count');

			if (!updating_value && dirty & /*shaftCount*/ 1) {
				updating_value = true;
				numberinput0_changes.value = /*shaftCount*/ ctx[0];
				add_flush_callback(() => updating_value = false);
			}

			numberinput0.$set(numberinput0_changes);
			const numberinput1_changes = {};
			if (dirty & /*$t*/ 16) numberinput1_changes.label = /*$t*/ ctx[4]('page.weave_settings.treadle_count');

			if (!updating_value_1 && dirty & /*treadleCount*/ 2) {
				updating_value_1 = true;
				numberinput1_changes.value = /*treadleCount*/ ctx[1];
				add_flush_callback(() => updating_value_1 = false);
			}

			numberinput1.$set(numberinput1_changes);
			const numberinput2_changes = {};
			if (dirty & /*$t*/ 16) numberinput2_changes.label = /*$t*/ ctx[4]('page.weave_settings.warp_count');

			if (!updating_value_2 && dirty & /*warpCount*/ 4) {
				updating_value_2 = true;
				numberinput2_changes.value = /*warpCount*/ ctx[2];
				add_flush_callback(() => updating_value_2 = false);
			}

			numberinput2.$set(numberinput2_changes);
			const numberinput3_changes = {};
			if (dirty & /*$t*/ 16) numberinput3_changes.label = /*$t*/ ctx[4]('page.weave_settings.weft_count');

			if (!updating_value_3 && dirty & /*weftCount*/ 8) {
				updating_value_3 = true;
				numberinput3_changes.value = /*weftCount*/ ctx[3];
				add_flush_callback(() => updating_value_3 = false);
			}

			numberinput3.$set(numberinput3_changes);
			if ((!current || dirty & /*$t*/ 16) && t4_value !== (t4_value = /*$t*/ ctx[4]('terms.save') + "")) set_data_dev(t4, t4_value);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(numberinput0.$$.fragment, local);
			transition_in(numberinput1.$$.fragment, local);
			transition_in(numberinput2.$$.fragment, local);
			transition_in(numberinput3.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(numberinput0.$$.fragment, local);
			transition_out(numberinput1.$$.fragment, local);
			transition_out(numberinput2.$$.fragment, local);
			transition_out(numberinput3.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(form);
			destroy_component(numberinput0);
			destroy_component(numberinput1);
			destroy_component(numberinput2);
			destroy_component(numberinput3);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$n.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$n($$self, $$props, $$invalidate) {
	let $draft;
	let $t;
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(10, $draft = $$value));
	validate_store($format, 't');
	component_subscribe($$self, $format, $$value => $$invalidate(4, $t = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('WeaveSettings', slots, []);
	let shaftCount = $draft.shaftCount;
	let treadleCount = $draft.treadleCount;
	let warpCount = $draft.warpCount;
	let weftCount = $draft.weftCount;

	function submit(event) {
		event.preventDefault();

		draft$1.update(
			temp => {
				if ($draft.shaftCount !== shaftCount) {
					updateShaftCount(temp, shaftCount);
				}

				if ($draft.treadleCount !== treadleCount) {
					updateTreadleCount(temp, treadleCount);
				}

				if ($draft.warpCount !== warpCount) {
					updateWarpCount(temp, warpCount);
				}

				if ($draft.weftCount !== weftCount) {
					updateWeftCount(temp, weftCount);
				}
			},
			false
		);

		ui$1.update(temp => {
			temp.selectedMenu = -1;
		});
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WeaveSettings> was created with unknown prop '${key}'`);
	});

	function numberinput0_value_binding(value) {
		shaftCount = value;
		$$invalidate(0, shaftCount);
	}

	function numberinput1_value_binding(value) {
		treadleCount = value;
		$$invalidate(1, treadleCount);
	}

	function numberinput2_value_binding(value) {
		warpCount = value;
		$$invalidate(2, warpCount);
	}

	function numberinput3_value_binding(value) {
		weftCount = value;
		$$invalidate(3, weftCount);
	}

	$$self.$capture_state = () => ({
		NumberInput,
		draft: draft$1,
		ui: ui$1,
		draftUtil,
		t: $format,
		shaftCount,
		treadleCount,
		warpCount,
		weftCount,
		submit,
		$draft,
		$t
	});

	$$self.$inject_state = $$props => {
		if ('shaftCount' in $$props) $$invalidate(0, shaftCount = $$props.shaftCount);
		if ('treadleCount' in $$props) $$invalidate(1, treadleCount = $$props.treadleCount);
		if ('warpCount' in $$props) $$invalidate(2, warpCount = $$props.warpCount);
		if ('weftCount' in $$props) $$invalidate(3, weftCount = $$props.weftCount);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		shaftCount,
		treadleCount,
		warpCount,
		weftCount,
		$t,
		submit,
		numberinput0_value_binding,
		numberinput1_value_binding,
		numberinput2_value_binding,
		numberinput3_value_binding
	];
}

class WeaveSettings extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$n, create_fragment$n, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "WeaveSettings",
			options,
			id: create_fragment$n.name
		});
	}
}

/* src/components/TextInput/TextInput.svelte generated by Svelte v3.43.0 */

const file$m = "src/components/TextInput/TextInput.svelte";

function create_fragment$m(ctx) {
	let label_1;
	let t0;
	let t1;
	let input;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			label_1 = element("label");
			t0 = text(/*label*/ ctx[1]);
			t1 = space();
			input = element("input");
			attr_dev(input, "type", "text");
			attr_dev(input, "autocomplete", "number");
			attr_dev(input, "id", "warp-count");
			input.disabled = /*disabled*/ ctx[2];
			attr_dev(input, "class", "svelte-1fqrv9k");
			add_location(input, file$m, 8, 2, 126);
			attr_dev(label_1, "class", "svelte-1fqrv9k");
			toggle_class(label_1, "disabled", /*disabled*/ ctx[2]);
			add_location(label_1, file$m, 6, 0, 91);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, label_1, anchor);
			append_dev(label_1, t0);
			append_dev(label_1, t1);
			append_dev(label_1, input);
			set_input_value(input, /*value*/ ctx[0]);

			if (!mounted) {
				dispose = [
					listen_dev(input, "input", /*input_handler*/ ctx[3], false, false, false),
					listen_dev(input, "input", /*input_input_handler*/ ctx[4])
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

			if (dirty & /*disabled*/ 4) {
				prop_dev(input, "disabled", /*disabled*/ ctx[2]);
			}

			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
				set_input_value(input, /*value*/ ctx[0]);
			}

			if (dirty & /*disabled*/ 4) {
				toggle_class(label_1, "disabled", /*disabled*/ ctx[2]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(label_1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$m.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$m($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('TextInput', slots, []);
	let { value } = $$props;
	let { label } = $$props;
	let { disabled = false } = $$props;
	const writable_props = ['value', 'label', 'disabled'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextInput> was created with unknown prop '${key}'`);
	});

	function input_handler(event) {
		bubble.call(this, $$self, event);
	}

	function input_input_handler() {
		value = this.value;
		$$invalidate(0, value);
	}

	$$self.$$set = $$props => {
		if ('value' in $$props) $$invalidate(0, value = $$props.value);
		if ('label' in $$props) $$invalidate(1, label = $$props.label);
		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
	};

	$$self.$capture_state = () => ({ value, label, disabled });

	$$self.$inject_state = $$props => {
		if ('value' in $$props) $$invalidate(0, value = $$props.value);
		if ('label' in $$props) $$invalidate(1, label = $$props.label);
		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [value, label, disabled, input_handler, input_input_handler];
}

class TextInput extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$m, create_fragment$m, not_equal, { value: 0, label: 1, disabled: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TextInput",
			options,
			id: create_fragment$m.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
			console.warn("<TextInput> was created without expected prop 'value'");
		}

		if (/*label*/ ctx[1] === undefined && !('label' in props)) {
			console.warn("<TextInput> was created without expected prop 'label'");
		}
	}

	get value() {
		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/pages/Editor/Sidebar/Subcomponents/YarnSettings.svelte generated by Svelte v3.43.0 */

const { Error: Error_1, Object: Object_1$2, console: console_1$4 } = globals;
const file$l = "src/pages/Editor/Sidebar/Subcomponents/YarnSettings.svelte";

function get_each_context$7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[22] = list[i];
	return child_ctx;
}

// (207:6) {#each $draft.yarn as yarn}
function create_each_block$7(ctx) {
	let button;
	let div0;
	let div0_style_value;
	let t0;
	let div1;
	let t1_value = /*yarn*/ ctx[22].name + "";
	let t1;
	let t2;
	let mounted;
	let dispose;

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[16](/*yarn*/ ctx[22], ...args);
	}

	const block = {
		c: function create() {
			button = element("button");
			div0 = element("div");
			t0 = space();
			div1 = element("div");
			t1 = text(t1_value);
			t2 = space();
			attr_dev(div0, "class", "color svelte-1gaaezq");
			attr_dev(div0, "style", div0_style_value = `background-color: ${/*colors*/ ctx[3][/*yarn*/ ctx[22].id].toHexString()};`);
			add_location(div0, file$l, 212, 10, 6084);
			attr_dev(div1, "class", "name svelte-1gaaezq");
			add_location(div1, file$l, 216, 10, 6212);
			attr_dev(button, "class", "yarn svelte-1gaaezq");
			toggle_class(button, "selected", /*yarnUnderModification*/ ctx[1] === /*yarn*/ ctx[22].id);
			add_location(button, file$l, 207, 8, 5906);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
			append_dev(button, div0);
			append_dev(button, t0);
			append_dev(button, div1);
			append_dev(div1, t1);
			append_dev(button, t2);

			if (!mounted) {
				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*colors, $draft*/ 12 && div0_style_value !== (div0_style_value = `background-color: ${/*colors*/ ctx[3][/*yarn*/ ctx[22].id].toHexString()};`)) {
				attr_dev(div0, "style", div0_style_value);
			}

			if (dirty & /*$draft*/ 4 && t1_value !== (t1_value = /*yarn*/ ctx[22].name + "")) set_data_dev(t1, t1_value);

			if (dirty & /*yarnUnderModification, $draft*/ 6) {
				toggle_class(button, "selected", /*yarnUnderModification*/ ctx[1] === /*yarn*/ ctx[22].id);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$7.name,
		type: "each",
		source: "(207:6) {#each $draft.yarn as yarn}",
		ctx
	});

	return block;
}

// (224:2) {:else}
function create_else_block$3(ctx) {
	let form;
	let input;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			form = element("form");
			input = element("input");
			attr_dev(input, "type", "text");
			add_location(input, file$l, 225, 6, 6441);
			add_location(form, file$l, 224, 4, 6398);
		},
		m: function mount(target, anchor) {
			insert_dev(target, form, anchor);
			append_dev(form, input);
			set_input_value(input, /*importData*/ ctx[5]);

			if (!mounted) {
				dispose = [
					listen_dev(input, "input", /*input_input_handler*/ ctx[18]),
					listen_dev(input, "blur", /*blur_handler*/ ctx[19], false, false, false),
					action_destroyer(focus.call(null, input)),
					listen_dev(form, "submit", /*addImportedColors*/ ctx[13], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*importData*/ 32 && input.value !== /*importData*/ ctx[5]) {
				set_input_value(input, /*importData*/ ctx[5]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(form);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(224:2) {:else}",
		ctx
	});

	return block;
}

// (222:2) {#if !showImport}
function create_if_block_1$4(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Paste";
			add_location(button, file$l, 222, 4, 6324);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[17], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$4.name,
		type: "if",
		source: "(222:2) {#if !showImport}",
		ctx
	});

	return block;
}

// (234:2) {#if yarnUnderModification !== -1}
function create_if_block$c(ctx) {
	let div1;
	let textinput;
	let t0;
	let div0;
	let label;
	let t1_value = /*$t*/ ctx[7]('terms.color') + "";
	let t1;
	let t2;
	let button;
	let button_style_value;
	let current;
	let mounted;
	let dispose;

	textinput = new TextInput({
			props: {
				label: /*$t*/ ctx[7]('page.yarn_settings.name'),
				value: /*selectedYarn*/ ctx[0]?.name
			},
			$$inline: true
		});

	textinput.$on("input", /*input_handler*/ ctx[20]);

	const block = {
		c: function create() {
			div1 = element("div");
			create_component(textinput.$$.fragment);
			t0 = space();
			div0 = element("div");
			label = element("label");
			t1 = text(t1_value);
			t2 = space();
			button = element("button");
			attr_dev(label, "for", "newYarnColor");
			add_location(label, file$l, 241, 8, 6842);
			attr_dev(button, "class", "yarn-color-change svelte-1gaaezq");
			attr_dev(button, "style", button_style_value = `background-color: ${/*selectedColor*/ ctx[6].toHexString()};`);
			add_location(button, file$l, 242, 8, 6904);
			add_location(div0, file$l, 240, 6, 6828);
			add_location(div1, file$l, 234, 4, 6633);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			mount_component(textinput, div1, null);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div0, label);
			append_dev(label, t1);
			append_dev(div0, t2);
			append_dev(div0, button);
			current = true;

			if (!mounted) {
				dispose = listen_dev(button, "click", /*showColorPicker*/ ctx[12], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			const textinput_changes = {};
			if (dirty & /*$t*/ 128) textinput_changes.label = /*$t*/ ctx[7]('page.yarn_settings.name');
			if (dirty & /*selectedYarn*/ 1) textinput_changes.value = /*selectedYarn*/ ctx[0]?.name;
			textinput.$set(textinput_changes);
			if ((!current || dirty & /*$t*/ 128) && t1_value !== (t1_value = /*$t*/ ctx[7]('terms.color') + "")) set_data_dev(t1, t1_value);

			if (!current || dirty & /*selectedColor*/ 64 && button_style_value !== (button_style_value = `background-color: ${/*selectedColor*/ ctx[6].toHexString()};`)) {
				attr_dev(button, "style", button_style_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(textinput.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(textinput.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_component(textinput);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$c.name,
		type: "if",
		source: "(234:2) {#if yarnUnderModification !== -1}",
		ctx
	});

	return block;
}

function create_fragment$l(ctx) {
	let div3;
	let div2;
	let div0;
	let button0;
	let t1;
	let button1;
	let t2;
	let button1_disabled_value;
	let t3;
	let div1;
	let t4;
	let t5;
	let current;
	let mounted;
	let dispose;
	let each_value = /*$draft*/ ctx[2].yarn;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
	}

	function select_block_type(ctx, dirty) {
		if (!/*showImport*/ ctx[4]) return create_if_block_1$4;
		return create_else_block$3;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*yarnUnderModification*/ ctx[1] !== -1 && create_if_block$c(ctx);

	const block = {
		c: function create() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			button0 = element("button");
			button0.textContent = "+";
			t1 = space();
			button1 = element("button");
			t2 = text("-");
			t3 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t4 = space();
			if_block0.c();
			t5 = space();
			if (if_block1) if_block1.c();
			attr_dev(button0, "class", "add svelte-1gaaezq");
			add_location(button0, file$l, 198, 6, 5602);
			button1.disabled = button1_disabled_value = /*$draft*/ ctx[2].yarn.length <= 1 || undefined;
			attr_dev(button1, "class", "remove svelte-1gaaezq");
			add_location(button1, file$l, 199, 6, 5664);
			attr_dev(div0, "class", "add-or-remove svelte-1gaaezq");
			add_location(div0, file$l, 197, 4, 5568);
			attr_dev(div1, "class", "yarns svelte-1gaaezq");
			add_location(div1, file$l, 205, 4, 5844);
			attr_dev(div2, "class", "container svelte-1gaaezq");
			add_location(div2, file$l, 196, 2, 5540);
			attr_dev(div3, "class", "yarn-settings");
			add_location(div3, file$l, 195, 0, 5510);
		},
		l: function claim(nodes) {
			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div2);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, t2);
			append_dev(div2, t3);
			append_dev(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(div3, t4);
			if_block0.m(div3, null);
			append_dev(div3, t5);
			if (if_block1) if_block1.m(div3, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*createNewYarn*/ ctx[8], false, false, false),
					listen_dev(button1, "click", /*click_handler*/ ctx[15], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*$draft*/ 4 && button1_disabled_value !== (button1_disabled_value = /*$draft*/ ctx[2].yarn.length <= 1 || undefined)) {
				prop_dev(button1, "disabled", button1_disabled_value);
			}

			if (dirty & /*yarnUnderModification, $draft, selectYarnForModification, colors*/ 526) {
				each_value = /*$draft*/ ctx[2].yarn;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$7(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$7(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div3, t5);
				}
			}

			if (/*yarnUnderModification*/ ctx[1] !== -1) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*yarnUnderModification*/ 2) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block$c(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div3, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			destroy_each(each_blocks, detaching);
			if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$l.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function focus(elm) {
	elm.focus();
}

/*
 CSV
397367,63ccca,5da399,42858c,35393c

 Array
["397367","63ccca","5da399","42858c","35393c"]

 Object
{"Hookers Green":"397367","Medium Turquoise":"63ccca","Polished Pine":"5da399","Steel Teal":"42858c","Onyx":"35393c"}

 Extended Array 
[{"name":"Hookers Green","hex":"397367","rgb":[57,115,103],"cmyk":[50,0,10,55],"hsb":[168,50,45],"hsl":[168,34,34],"lab":[44,-22,1]},{"name":"Medium Turquoise","hex":"63ccca","rgb":[99,204,202],"cmyk":[51,0,1,20],"hsb":[179,51,80],"hsl":[179,51,59],"lab":[76,-31,-8]},{"name":"Polished Pine","hex":"5da399","rgb":[93,163,153],"cmyk":[43,0,6,36],"hsb":[171,43,64],"hsl":[171,28,50],"lab":[62,-25,-2]},{"name":"Steel Teal","hex":"42858c","rgb":[66,133,140],"cmyk":[53,5,0,45],"hsb":[186,53,55],"hsl":[186,36,40],"lab":[52,-19,-10]},{"name":"Onyx","hex":"35393c","rgb":[53,57,60],"cmyk":[12,5,0,76],"hsb":[206,12,24],"hsl":[206,6,22],"lab":[24,-1,-2]}]
*/
function toRatio(color) {
	return {
		r: color.r / 255,
		g: color.g / 255,
		b: color.b / 255
	};
}

function instance$l($$self, $$props, $$invalidate) {
	let yarnUnderModification;
	let selectedYarn;
	let selectedColor;
	let $draft;
	let $ui;
	let $t;
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(2, $draft = $$value));
	validate_store(ui$1, 'ui');
	component_subscribe($$self, ui$1, $$value => $$invalidate(14, $ui = $$value));
	validate_store($format, 't');
	component_subscribe($$self, $format, $$value => $$invalidate(7, $t = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('YarnSettings', slots, []);
	window.tinycolor = tinycolor;
	let colors = [];

	//let color = { r: 1.0, g: 0.0, b: 0.0 };
	//let newYarnColor = color;
	let colorListener;

	let showImport = false;
	let importData;

	onMount(() => {
		colorListener = colorPickerStore.onColorChange(color => {
			if (yarnUnderModification !== -1) {
				draft$1.update(temp => {
					temp.yarn.find(a => a.id === yarnUnderModification).color = color;
				});
			}
		});
	});

	onDestroy(() => {
		colorPickerStore.removeListener(colorListener);
	});

	function createNewYarn(event) {
		event.preventDefault();
		let id = $draft.yarn.map(a => a.id).reduce((a, b) => Math.max(a, b)) + 1;

		draft$1.update(temp => {
			newYarn(temp, {
				name: 'Yarn',
				color: { r: 1.0, g: 1.0, b: 1.0 }
			});
		});

		ui$1.update(temp => {
			temp.selectedColor = id;
		});
	}

	function selectYarnForModification(event, i) {
		ui$1.update(temp => {
			temp.selectedColor = i;
		});
	}

	function changeName(newName, yarnId) {
		draft$1.update(temp => {
			temp.yarn.find(a => a.id === yarnId).name = newName;
		});
	}

	function deleteColor(id) {
		ui$1.update(temp => {
			let indexOf = $draft.yarn.findIndex(a => a.id === id);

			if (indexOf == 0) {
				indexOf = 2;
			}

			temp.selectedColor = $draft.yarn[indexOf - 1].id;
		});

		draft$1.update(temp => {
			removeYarn(temp, id);
		});
	}

	function showColorPicker(event) {
		event.preventDefault();
		colorPickerStore.showColorPicker(event.pageX, event.pageY, selectedYarn.color);
	}

	function addImportedColors(event) {
		event.preventDefault();
		console.log('Please import ' + importData);
		let str = importData.trim();
		let yarns = [];

		try {
			let json = JSON.parse(str);

			if (json instanceof Array) {
				if (json[0] instanceof Object) {
					//It's an extended array
					for (let item of json) {
						let color = tinycolor(item.hex);

						if (!color.isValid()) {
							throw new Error('Invalid color', item);
						}

						yarns.push({
							name: item.name,
							color: toRatio(color.toRgb())
						});
					}
				} else {
					//It's array of strings
					for (let item of json) {
						let color = tinycolor(item);

						if (!color.isValid()) {
							throw new Error('Invalid color', item);
						}

						yarns.push({
							name: 'Yarn',
							color: toRatio(color.toRgb())
						});
					}
				}
			} else {
				//It's an object of key-values
				for (let item of Object.entries(json)) {
					let color = tinycolor(item[1]);

					if (!color.isValid()) {
						throw new Error('Invalid color', item);
					}

					yarns.push({
						name: item[0],
						color: toRatio(color.toRgb())
					});
				}
			}
		} catch(e) {
			//Either it is an csv or a junk string
			let arr = importData.split(',');

			for (let item of arr) {
				let color = tinycolor(item);

				if (!color.isValid()) {
					//It's a junk string
					//Show error
					console.error('Unable to import colors from string ' + importData, e);

					$$invalidate(4, showImport = false);
					return;
				}

				yarns.push({
					name: 'Yarn',
					color: toRatio(color.toRgb())
				});
			}
		}

		if (yarns.length > 0) {
			draft$1.update(temp => {
				for (let y of yarns) {
					newYarn(temp, y);
				}
			});
		}

		$$invalidate(5, importData = '');
		$$invalidate(4, showImport = false);
	}

	const writable_props = [];

	Object_1$2.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<YarnSettings> was created with unknown prop '${key}'`);
	});

	const click_handler = () => deleteColor(yarnUnderModification);
	const click_handler_1 = (yarn, e) => selectYarnForModification(e, yarn.id);
	const click_handler_2 = () => $$invalidate(4, showImport = true);

	function input_input_handler() {
		importData = this.value;
		$$invalidate(5, importData);
	}

	const blur_handler = () => $$invalidate(4, showImport = false);
	const input_handler = e => changeName(e.target.value, yarnUnderModification);

	$$self.$capture_state = () => ({
		tinycolor,
		TextInput,
		draft: draft$1,
		ui: ui$1,
		draftUtil,
		t: $format,
		onMount,
		onDestroy,
		colorPickerStore,
		colors,
		colorListener,
		showImport,
		importData,
		focus,
		createNewYarn,
		selectYarnForModification,
		changeName,
		deleteColor,
		showColorPicker,
		toRatio,
		addImportedColors,
		selectedYarn,
		yarnUnderModification,
		selectedColor,
		$draft,
		$ui,
		$t
	});

	$$self.$inject_state = $$props => {
		if ('colors' in $$props) $$invalidate(3, colors = $$props.colors);
		if ('colorListener' in $$props) colorListener = $$props.colorListener;
		if ('showImport' in $$props) $$invalidate(4, showImport = $$props.showImport);
		if ('importData' in $$props) $$invalidate(5, importData = $$props.importData);
		if ('selectedYarn' in $$props) $$invalidate(0, selectedYarn = $$props.selectedYarn);
		if ('yarnUnderModification' in $$props) $$invalidate(1, yarnUnderModification = $$props.yarnUnderModification);
		if ('selectedColor' in $$props) $$invalidate(6, selectedColor = $$props.selectedColor);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$draft*/ 4) {
			{
				$draft.yarn.forEach(y => {
					$$invalidate(3, colors[y.id] = tinycolor.fromRatio(y.color), colors);
				});
			}
		}

		if ($$self.$$.dirty & /*$ui*/ 16384) {
			$$invalidate(1, yarnUnderModification = $ui.selectedColor);
		}

		if ($$self.$$.dirty & /*$draft, yarnUnderModification*/ 6) {
			$$invalidate(0, selectedYarn = $draft.yarn.find(y => yarnUnderModification === y.id));
		}

		if ($$self.$$.dirty & /*selectedYarn*/ 1) {
			$$invalidate(6, selectedColor = tinycolor.fromRatio(selectedYarn?.color));
		}
	};

	return [
		selectedYarn,
		yarnUnderModification,
		$draft,
		colors,
		showImport,
		importData,
		selectedColor,
		$t,
		createNewYarn,
		selectYarnForModification,
		changeName,
		deleteColor,
		showColorPicker,
		addImportedColors,
		$ui,
		click_handler,
		click_handler_1,
		click_handler_2,
		input_input_handler,
		blur_handler,
		input_handler
	];
}

class YarnSettings extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$l, create_fragment$l, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "YarnSettings",
			options,
			id: create_fragment$l.name
		});
	}
}

/* src/components/CheckboxInput/CheckboxInput.svelte generated by Svelte v3.43.0 */

const file$k = "src/components/CheckboxInput/CheckboxInput.svelte";

function create_fragment$k(ctx) {
	let label_1;
	let t0;
	let t1;
	let input;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			label_1 = element("label");
			t0 = text(/*label*/ ctx[1]);
			t1 = space();
			input = element("input");
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "id", "warp-count");
			input.disabled = /*disabled*/ ctx[2];
			attr_dev(input, "class", "svelte-emmwaj");
			add_location(input, file$k, 8, 2, 128);
			attr_dev(label_1, "class", "svelte-emmwaj");
			toggle_class(label_1, "disabled", /*disabled*/ ctx[2]);
			add_location(label_1, file$k, 6, 0, 93);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, label_1, anchor);
			append_dev(label_1, t0);
			append_dev(label_1, t1);
			append_dev(label_1, input);
			input.checked = /*checked*/ ctx[0];

			if (!mounted) {
				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[3]);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

			if (dirty & /*disabled*/ 4) {
				prop_dev(input, "disabled", /*disabled*/ ctx[2]);
			}

			if (dirty & /*checked*/ 1) {
				input.checked = /*checked*/ ctx[0];
			}

			if (dirty & /*disabled*/ 4) {
				toggle_class(label_1, "disabled", /*disabled*/ ctx[2]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(label_1);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$k.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$k($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('CheckboxInput', slots, []);
	let { checked } = $$props;
	let { label } = $$props;
	let { disabled = false } = $$props;
	const writable_props = ['checked', 'label', 'disabled'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckboxInput> was created with unknown prop '${key}'`);
	});

	function input_change_handler() {
		checked = this.checked;
		$$invalidate(0, checked);
	}

	$$self.$$set = $$props => {
		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
		if ('label' in $$props) $$invalidate(1, label = $$props.label);
		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
	};

	$$self.$capture_state = () => ({ checked, label, disabled });

	$$self.$inject_state = $$props => {
		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
		if ('label' in $$props) $$invalidate(1, label = $$props.label);
		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [checked, label, disabled, input_change_handler];
}

class CheckboxInput extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$k, create_fragment$k, not_equal, { checked: 0, label: 1, disabled: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CheckboxInput",
			options,
			id: create_fragment$k.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*checked*/ ctx[0] === undefined && !('checked' in props)) {
			console.warn("<CheckboxInput> was created without expected prop 'checked'");
		}

		if (/*label*/ ctx[1] === undefined && !('label' in props)) {
			console.warn("<CheckboxInput> was created without expected prop 'label'");
		}
	}

	get checked() {
		throw new Error("<CheckboxInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checked(value) {
		throw new Error("<CheckboxInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<CheckboxInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<CheckboxInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<CheckboxInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<CheckboxInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

let selection = {
  isSelecting: false,
  from: [0, 0],
  to: [10, 10],
  useThreading: false,
  useWarpColors: false,
  useTreadleOrder: false,
  useWeftColors: false,
};

const store = writable(selection);
let prevStore = selection;

store.subscribe((s) => {
  prevStore = s;
});

var selection$1 = {
  selection: store,
  update: function (func) {
    store.set(fn(prevStore, func));
  },
  subscribe: function (subscription) {
    return store.subscribe(subscription);
  },
};

/* src/pages/Editor/Sidebar/Subcomponents/Repeat.svelte generated by Svelte v3.43.0 */
const file$j = "src/pages/Editor/Sidebar/Subcomponents/Repeat.svelte";

function create_fragment$j(ctx) {
	let div2;
	let fieldset0;
	let legend0;
	let t1;
	let checkboxinput0;
	let updating_checked;
	let t2;
	let checkboxinput1;
	let updating_checked_1;
	let t3;
	let checkboxinput2;
	let updating_checked_2;
	let t4;
	let checkboxinput3;
	let updating_checked_3;
	let t5;
	let legend1;
	let t7;
	let fieldset1;
	let div0;
	let label;
	let t9;
	let input;
	let t10;
	let numberinput0;
	let updating_value;
	let t11;
	let numberinput1;
	let updating_value_1;
	let t12;
	let div1;
	let button0;
	let t14;
	let button1;
	let current;
	let mounted;
	let dispose;

	function checkboxinput0_checked_binding(value) {
		/*checkboxinput0_checked_binding*/ ctx[12](value);
	}

	let checkboxinput0_props = { label: "Threading" };

	if (/*useThreading*/ ctx[3] !== void 0) {
		checkboxinput0_props.checked = /*useThreading*/ ctx[3];
	}

	checkboxinput0 = new CheckboxInput({
			props: checkboxinput0_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(checkboxinput0, 'checked', checkboxinput0_checked_binding));

	function checkboxinput1_checked_binding(value) {
		/*checkboxinput1_checked_binding*/ ctx[13](value);
	}

	let checkboxinput1_props = { label: "TreadleOrder" };

	if (/*useTreadleOrder*/ ctx[1] !== void 0) {
		checkboxinput1_props.checked = /*useTreadleOrder*/ ctx[1];
	}

	checkboxinput1 = new CheckboxInput({
			props: checkboxinput1_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(checkboxinput1, 'checked', checkboxinput1_checked_binding));

	function checkboxinput2_checked_binding(value) {
		/*checkboxinput2_checked_binding*/ ctx[14](value);
	}

	let checkboxinput2_props = { label: "Warp colors" };

	if (/*useWarpColors*/ ctx[2] !== void 0) {
		checkboxinput2_props.checked = /*useWarpColors*/ ctx[2];
	}

	checkboxinput2 = new CheckboxInput({
			props: checkboxinput2_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(checkboxinput2, 'checked', checkboxinput2_checked_binding));

	function checkboxinput3_checked_binding(value) {
		/*checkboxinput3_checked_binding*/ ctx[15](value);
	}

	let checkboxinput3_props = { label: "Weft colors" };

	if (/*useWeftColors*/ ctx[0] !== void 0) {
		checkboxinput3_props.checked = /*useWeftColors*/ ctx[0];
	}

	checkboxinput3 = new CheckboxInput({
			props: checkboxinput3_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(checkboxinput3, 'checked', checkboxinput3_checked_binding));

	function numberinput0_value_binding(value) {
		/*numberinput0_value_binding*/ ctx[17](value);
	}

	let numberinput0_props = {
		label: "From",
		min: "0",
		max: /*maxLength*/ ctx[4]
	};

	if (/*targetFrom*/ ctx[7] !== void 0) {
		numberinput0_props.value = /*targetFrom*/ ctx[7];
	}

	numberinput0 = new NumberInput({
			props: numberinput0_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(numberinput0, 'value', numberinput0_value_binding));

	function numberinput1_value_binding(value) {
		/*numberinput1_value_binding*/ ctx[18](value);
	}

	let numberinput1_props = {
		label: "To",
		min: "0",
		max: /*maxLength*/ ctx[4],
		disabled: /*fillAll*/ ctx[5]
	};

	if (/*targetTo*/ ctx[6] !== void 0) {
		numberinput1_props.value = /*targetTo*/ ctx[6];
	}

	numberinput1 = new NumberInput({
			props: numberinput1_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(numberinput1, 'value', numberinput1_value_binding));

	const block = {
		c: function create() {
			div2 = element("div");
			fieldset0 = element("fieldset");
			legend0 = element("legend");
			legend0.textContent = "Repeat";
			t1 = space();
			create_component(checkboxinput0.$$.fragment);
			t2 = space();
			create_component(checkboxinput1.$$.fragment);
			t3 = space();
			create_component(checkboxinput2.$$.fragment);
			t4 = space();
			create_component(checkboxinput3.$$.fragment);
			t5 = space();
			legend1 = element("legend");
			legend1.textContent = "Target";
			t7 = space();
			fieldset1 = element("fieldset");
			div0 = element("div");
			label = element("label");
			label.textContent = "Fill entire draft";
			t9 = space();
			input = element("input");
			t10 = space();
			create_component(numberinput0.$$.fragment);
			t11 = space();
			create_component(numberinput1.$$.fragment);
			t12 = space();
			div1 = element("div");
			button0 = element("button");
			button0.textContent = "Apply repetition";
			t14 = space();
			button1 = element("button");
			button1.textContent = "Close";
			attr_dev(legend0, "class", "svelte-2nju0y");
			add_location(legend0, file$j, 108, 4, 2419);
			attr_dev(fieldset0, "class", "repeat-options svelte-2nju0y");
			add_location(fieldset0, file$j, 107, 2, 2381);
			attr_dev(legend1, "class", "svelte-2nju0y");
			add_location(legend1, file$j, 115, 2, 2744);
			attr_dev(label, "for", "fill-all");
			attr_dev(label, "class", "svelte-2nju0y");
			add_location(label, file$j, 118, 6, 2820);
			attr_dev(input, "name", "fill-all");
			attr_dev(input, "id", "fill-all");
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "class", "svelte-2nju0y");
			add_location(input, file$j, 119, 6, 2874);
			attr_dev(div0, "class", "svelte-2nju0y");
			add_location(div0, file$j, 117, 4, 2808);
			attr_dev(fieldset1, "class", "to-from-inputs svelte-2nju0y");
			add_location(fieldset1, file$j, 116, 2, 2770);
			attr_dev(button0, "class", "submit");
			add_location(button0, file$j, 137, 4, 3256);
			attr_dev(button1, "class", "submit");
			add_location(button1, file$j, 138, 4, 3327);
			attr_dev(div1, "class", "buttons svelte-2nju0y");
			add_location(div1, file$j, 136, 2, 3230);
			add_location(div2, file$j, 106, 0, 2373);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, fieldset0);
			append_dev(fieldset0, legend0);
			append_dev(fieldset0, t1);
			mount_component(checkboxinput0, fieldset0, null);
			append_dev(fieldset0, t2);
			mount_component(checkboxinput1, fieldset0, null);
			append_dev(fieldset0, t3);
			mount_component(checkboxinput2, fieldset0, null);
			append_dev(fieldset0, t4);
			mount_component(checkboxinput3, fieldset0, null);
			append_dev(div2, t5);
			append_dev(div2, legend1);
			append_dev(div2, t7);
			append_dev(div2, fieldset1);
			append_dev(fieldset1, div0);
			append_dev(div0, label);
			append_dev(div0, t9);
			append_dev(div0, input);
			input.checked = /*fillAll*/ ctx[5];
			append_dev(fieldset1, t10);
			mount_component(numberinput0, fieldset1, null);
			append_dev(fieldset1, t11);
			mount_component(numberinput1, fieldset1, null);
			append_dev(div2, t12);
			append_dev(div2, div1);
			append_dev(div1, button0);
			append_dev(div1, t14);
			append_dev(div1, button1);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(input, "change", /*input_change_handler*/ ctx[16]),
					listen_dev(button0, "click", /*submit*/ ctx[8], false, false, false),
					listen_dev(button1, "click", /*close*/ ctx[9], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			const checkboxinput0_changes = {};

			if (!updating_checked && dirty & /*useThreading*/ 8) {
				updating_checked = true;
				checkboxinput0_changes.checked = /*useThreading*/ ctx[3];
				add_flush_callback(() => updating_checked = false);
			}

			checkboxinput0.$set(checkboxinput0_changes);
			const checkboxinput1_changes = {};

			if (!updating_checked_1 && dirty & /*useTreadleOrder*/ 2) {
				updating_checked_1 = true;
				checkboxinput1_changes.checked = /*useTreadleOrder*/ ctx[1];
				add_flush_callback(() => updating_checked_1 = false);
			}

			checkboxinput1.$set(checkboxinput1_changes);
			const checkboxinput2_changes = {};

			if (!updating_checked_2 && dirty & /*useWarpColors*/ 4) {
				updating_checked_2 = true;
				checkboxinput2_changes.checked = /*useWarpColors*/ ctx[2];
				add_flush_callback(() => updating_checked_2 = false);
			}

			checkboxinput2.$set(checkboxinput2_changes);
			const checkboxinput3_changes = {};

			if (!updating_checked_3 && dirty & /*useWeftColors*/ 1) {
				updating_checked_3 = true;
				checkboxinput3_changes.checked = /*useWeftColors*/ ctx[0];
				add_flush_callback(() => updating_checked_3 = false);
			}

			checkboxinput3.$set(checkboxinput3_changes);

			if (dirty & /*fillAll*/ 32) {
				input.checked = /*fillAll*/ ctx[5];
			}

			const numberinput0_changes = {};
			if (dirty & /*maxLength*/ 16) numberinput0_changes.max = /*maxLength*/ ctx[4];

			if (!updating_value && dirty & /*targetFrom*/ 128) {
				updating_value = true;
				numberinput0_changes.value = /*targetFrom*/ ctx[7];
				add_flush_callback(() => updating_value = false);
			}

			numberinput0.$set(numberinput0_changes);
			const numberinput1_changes = {};
			if (dirty & /*maxLength*/ 16) numberinput1_changes.max = /*maxLength*/ ctx[4];
			if (dirty & /*fillAll*/ 32) numberinput1_changes.disabled = /*fillAll*/ ctx[5];

			if (!updating_value_1 && dirty & /*targetTo*/ 64) {
				updating_value_1 = true;
				numberinput1_changes.value = /*targetTo*/ ctx[6];
				add_flush_callback(() => updating_value_1 = false);
			}

			numberinput1.$set(numberinput1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(checkboxinput0.$$.fragment, local);
			transition_in(checkboxinput1.$$.fragment, local);
			transition_in(checkboxinput2.$$.fragment, local);
			transition_in(checkboxinput3.$$.fragment, local);
			transition_in(numberinput0.$$.fragment, local);
			transition_in(numberinput1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(checkboxinput0.$$.fragment, local);
			transition_out(checkboxinput1.$$.fragment, local);
			transition_out(checkboxinput2.$$.fragment, local);
			transition_out(checkboxinput3.$$.fragment, local);
			transition_out(numberinput0.$$.fragment, local);
			transition_out(numberinput1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			destroy_component(checkboxinput0);
			destroy_component(checkboxinput1);
			destroy_component(checkboxinput2);
			destroy_component(checkboxinput3);
			destroy_component(numberinput0);
			destroy_component(numberinput1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$j.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$j($$self, $$props, $$invalidate) {
	let useThreading;
	let useTreadleOrder;
	let useWarpColors;
	let useWeftColors;
	let maxLength;
	let selectionFrom;
	let selectionTo;
	let targetFrom;
	let targetTo;
	let $draft;
	let $selection;
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(10, $draft = $$value));
	validate_store(selection$1, 'selection');
	component_subscribe($$self, selection$1, $$value => $$invalidate(11, $selection = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Repeat', slots, []);
	let fillAll = true;

	onMount(() => {
		selection$1.update(temp => {
			temp.isSelecting = true;
		});
	});

	onDestroy(() => {
		selection$1.update(temp => {
			temp.isSelecting = false;
		});
	});

	function submit(event) {
		event.preventDefault();

		draft$1.update(temp => {
			if (useThreading) {
				applyPattern(temp, $draft.threading.slice(selectionFrom[0], selectionTo[0]), 'warp', false, targetFrom, targetTo);
			}

			if (useWarpColors) {
				applyColor(temp, $draft.warpColors.slice(selectionFrom[0], selectionTo[0]), 'warp');
			}

			if (useTreadleOrder) {
				applyPattern(temp, $draft.treadleOrder.slice(selectionFrom[1], selectionTo[1]), 'weft', false, targetFrom, targetTo);
			}

			if (useWeftColors) {
				applyColor(temp, $draft.weftColors.slice(selectionFrom[1], selectionTo[1]), 'weft');
			}
		});
	}

	function close() {
		ui$1.update(temp => {
			temp.selectedMenu = -1;
		});
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Repeat> was created with unknown prop '${key}'`);
	});

	function checkboxinput0_checked_binding(value) {
		useThreading = value;
		($$invalidate(3, useThreading), $$invalidate(11, $selection));
	}

	function checkboxinput1_checked_binding(value) {
		useTreadleOrder = value;
		($$invalidate(1, useTreadleOrder), $$invalidate(11, $selection));
	}

	function checkboxinput2_checked_binding(value) {
		useWarpColors = value;
		($$invalidate(2, useWarpColors), $$invalidate(11, $selection));
	}

	function checkboxinput3_checked_binding(value) {
		useWeftColors = value;
		($$invalidate(0, useWeftColors), $$invalidate(11, $selection));
	}

	function input_change_handler() {
		fillAll = this.checked;
		$$invalidate(5, fillAll);
	}

	function numberinput0_value_binding(value) {
		targetFrom = value;
		$$invalidate(7, targetFrom);
	}

	function numberinput1_value_binding(value) {
		targetTo = value;
		(($$invalidate(6, targetTo), $$invalidate(4, maxLength)), $$invalidate(10, $draft));
	}

	$$self.$capture_state = () => ({
		NumberInput,
		CheckboxInput,
		onMount,
		onDestroy,
		draft: draft$1,
		selection: selection$1,
		draftUtil,
		ui: ui$1,
		fillAll,
		submit,
		close,
		selectionTo,
		selectionFrom,
		useWeftColors,
		targetTo,
		targetFrom,
		useTreadleOrder,
		useWarpColors,
		useThreading,
		maxLength,
		$draft,
		$selection
	});

	$$self.$inject_state = $$props => {
		if ('fillAll' in $$props) $$invalidate(5, fillAll = $$props.fillAll);
		if ('selectionTo' in $$props) selectionTo = $$props.selectionTo;
		if ('selectionFrom' in $$props) selectionFrom = $$props.selectionFrom;
		if ('useWeftColors' in $$props) $$invalidate(0, useWeftColors = $$props.useWeftColors);
		if ('targetTo' in $$props) $$invalidate(6, targetTo = $$props.targetTo);
		if ('targetFrom' in $$props) $$invalidate(7, targetFrom = $$props.targetFrom);
		if ('useTreadleOrder' in $$props) $$invalidate(1, useTreadleOrder = $$props.useTreadleOrder);
		if ('useWarpColors' in $$props) $$invalidate(2, useWarpColors = $$props.useWarpColors);
		if ('useThreading' in $$props) $$invalidate(3, useThreading = $$props.useThreading);
		if ('maxLength' in $$props) $$invalidate(4, maxLength = $$props.maxLength);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$selection*/ 2048) {
			$$invalidate(3, useThreading = $selection.useThreading);
		}

		if ($$self.$$.dirty & /*$selection*/ 2048) {
			$$invalidate(1, useTreadleOrder = $selection.useTreadleOrder);
		}

		if ($$self.$$.dirty & /*$selection*/ 2048) {
			$$invalidate(2, useWarpColors = $selection.useWarpColors);
		}

		if ($$self.$$.dirty & /*$selection*/ 2048) {
			$$invalidate(0, useWeftColors = $selection.useWeftColors);
		}

		if ($$self.$$.dirty & /*$draft*/ 1024) {
			$$invalidate(4, maxLength = Math.max($draft.warpCount, $draft.weftCount));
		}

		if ($$self.$$.dirty & /*$selection*/ 2048) {
			selectionFrom = $selection.from;
		}

		if ($$self.$$.dirty & /*$selection*/ 2048) {
			selectionTo = $selection.to;
		}

		if ($$self.$$.dirty & /*maxLength*/ 16) {
			$$invalidate(6, targetTo = maxLength);
		}

		if ($$self.$$.dirty & /*useThreading*/ 8) {
			{
				selection$1.update(temp => {
					temp.useThreading = useThreading;
				});
			}
		}

		if ($$self.$$.dirty & /*useTreadleOrder*/ 2) {
			{
				selection$1.update(temp => {
					temp.useTreadleOrder = useTreadleOrder;
				});
			}
		}

		if ($$self.$$.dirty & /*useWarpColors*/ 4) {
			{
				selection$1.update(temp => {
					temp.useWarpColors = useWarpColors;
				});
			}
		}

		if ($$self.$$.dirty & /*useWeftColors*/ 1) {
			{
				selection$1.update(temp => {
					temp.useWeftColors = useWeftColors;
				});
			}
		}
	};

	$$invalidate(7, targetFrom = 0);

	return [
		useWeftColors,
		useTreadleOrder,
		useWarpColors,
		useThreading,
		maxLength,
		fillAll,
		targetTo,
		targetFrom,
		submit,
		close,
		$draft,
		$selection,
		checkboxinput0_checked_binding,
		checkboxinput1_checked_binding,
		checkboxinput2_checked_binding,
		checkboxinput3_checked_binding,
		input_change_handler,
		numberinput0_value_binding,
		numberinput1_value_binding
	];
}

class Repeat extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$j, create_fragment$j, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Repeat",
			options,
			id: create_fragment$j.name
		});
	}
}

function line(x0, y0, x1, y1) {
  let points = [];

  let dx = Math.abs(x1 - x0);
  let sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0);
  let sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for(;;) {
    points.push([x0, y0]);
    if(x0 === x1 && y0 === y1) {
      break;
    }
    let e2 = 2 * err;
    if(e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if(e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
  return points;
}

/* src/components/Grid/Grid.svelte generated by Svelte v3.43.0 */

const { Object: Object_1$1, console: console_1$3 } = globals;
const file$i = "src/components/Grid/Grid.svelte";

// (227:2) {#if !disabled && (resizeX === true || resizeY === true)}
function create_if_block$b(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			attr_dev(button, "class", "resize-btn svelte-6b4in1");
			toggle_class(button, "disabled", /*disabled*/ ctx[2]);
			toggle_class(button, "resizeX", /*resizeX*/ ctx[3]);
			toggle_class(button, "resizeY", /*resizeY*/ ctx[4]);
			add_location(button, file$i, 227, 4, 6063);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "pointerdown", /*onResizeMouseDown*/ ctx[12], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*disabled*/ 4) {
				toggle_class(button, "disabled", /*disabled*/ ctx[2]);
			}

			if (dirty[0] & /*resizeX*/ 8) {
				toggle_class(button, "resizeX", /*resizeX*/ ctx[3]);
			}

			if (dirty[0] & /*resizeY*/ 16) {
				toggle_class(button, "resizeY", /*resizeY*/ ctx[4]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$b.name,
		type: "if",
		source: "(227:2) {#if !disabled && (resizeX === true || resizeY === true)}",
		ctx
	});

	return block;
}

function create_fragment$i(ctx) {
	let div;
	let canvas_1;
	let canvas_1_style_value;
	let t;
	let mounted;
	let dispose;
	let if_block = !/*disabled*/ ctx[2] && (/*resizeX*/ ctx[3] === true || /*resizeY*/ ctx[4] === true) && create_if_block$b(ctx);

	const block = {
		c: function create() {
			div = element("div");
			canvas_1 = element("canvas");
			t = space();
			if (if_block) if_block.c();

			attr_dev(canvas_1, "style", canvas_1_style_value = `
    max-width: ${/*xCount*/ ctx[0] * /*cellSize*/ ctx[7] + 2.0 * /*borderSize*/ ctx[6]}px;
    max-height: ${/*yCount*/ ctx[1] * /*cellSize*/ ctx[7] + 2.0 * /*borderSize*/ ctx[6]}px;
    `);

			attr_dev(canvas_1, "width", "1");
			attr_dev(canvas_1, "height", "1");
			attr_dev(canvas_1, "class", "svelte-6b4in1");
			toggle_class(canvas_1, "disabled", /*disabled*/ ctx[2]);
			add_location(canvas_1, file$i, 212, 2, 5636);
			attr_dev(div, "class", "svelte-6b4in1");
			toggle_class(div, "resizeX", /*resizeX*/ ctx[3]);
			toggle_class(div, "resizeY", /*resizeY*/ ctx[4]);
			add_location(div, file$i, 211, 0, 5600);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, canvas_1);
			/*canvas_1_binding*/ ctx[23](canvas_1);
			append_dev(div, t);
			if (if_block) if_block.m(div, null);

			if (!mounted) {
				dispose = [
					listen_dev(canvas_1, "click", /*onCanvasClick*/ ctx[11], false, false, false),
					listen_dev(canvas_1, "pointerup", /*onCanvasMouseUp*/ ctx[10], false, false, false),
					listen_dev(canvas_1, "pointerdown", /*onCanvasMouseDown*/ ctx[8], false, false, false),
					listen_dev(canvas_1, "pointermove", /*onCanvasMouseMove*/ ctx[9], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*xCount, yCount*/ 3 && canvas_1_style_value !== (canvas_1_style_value = `
    max-width: ${/*xCount*/ ctx[0] * /*cellSize*/ ctx[7] + 2.0 * /*borderSize*/ ctx[6]}px;
    max-height: ${/*yCount*/ ctx[1] * /*cellSize*/ ctx[7] + 2.0 * /*borderSize*/ ctx[6]}px;
    `)) {
				attr_dev(canvas_1, "style", canvas_1_style_value);
			}

			if (dirty[0] & /*disabled*/ 4) {
				toggle_class(canvas_1, "disabled", /*disabled*/ ctx[2]);
			}

			if (!/*disabled*/ ctx[2] && (/*resizeX*/ ctx[3] === true || /*resizeY*/ ctx[4] === true)) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$b(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*resizeX*/ 8) {
				toggle_class(div, "resizeX", /*resizeX*/ ctx[3]);
			}

			if (dirty[0] & /*resizeY*/ 16) {
				toggle_class(div, "resizeY", /*resizeY*/ ctx[4]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			/*canvas_1_binding*/ ctx[23](null);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$i.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$i($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Grid', slots, []);
	let { xCount } = $$props;
	let { yCount } = $$props;
	let { toggleCell = () => false } = $$props;

	let { onClick = () => {
		
	} } = $$props;

	let { onMouseDown = () => {
		
	} } = $$props;

	let { onMouseUp = () => {
		
	} } = $$props;

	let { onMouseMove = () => {
		
	} } = $$props;

	let { disabled = false } = $$props;
	let { resizeX = false } = $$props;
	let { resizeY = false } = $$props;
	let canvas;
	let ctx;
	let borderSize = 2.5;
	let cellSize = 25;
	let rect;

	let resizeObserver = new ResizeObserver(() => {
			rect = canvas.getBoundingClientRect();
		});

	let resizeStartPos;
	let isResizing = false;

	onMount(() => {
		$$invalidate(22, ctx = canvas.getContext('2d'));
		rect = canvas.getBoundingClientRect();
		resizeObserver.observe(canvas);
	});

	onDestroy(() => {
		resizeObserver.unobserve(canvas);
	});

	function syncCanvasDimensions(xCount, yCount) {
		$$invalidate(5, canvas.width = cellSize * xCount + 2.0 * borderSize, canvas);
		$$invalidate(5, canvas.height = cellSize * yCount + 2.0 * borderSize, canvas);
	}

	function onCanvasMouseDown(event) {
		if (!disabled && !isResizing) {
			onMouseDown(event);
		}
	}

	function onCanvasMouseMove(event) {
		if (!disabled && !isResizing) {
			onMouseMove(event);
		}
	}

	function onCanvasMouseUp() {
		if (!disabled && !isResizing) {
			onMouseUp(event);
		}
	}

	function onCanvasClick() {
		if (!disabled && !isResizing) {
			onClick(event);
		}
	}

	function getBoundingClientRect() {
		return canvas.getBoundingClientRect();
	}

	function getCellsBetweenPoints(from, to) {
		let fromCell = this.getCellAtPos(from);
		let toCell = this.getCellAtPos(to);
		let linePoints = line(fromCell[0], fromCell[1], toCell[0], toCell[1]);
		return linePoints.filter(p => p[0] >= 0 && p[0] < xCount && p[1] >= 0 && p[1] < yCount);
	}

	function getCellAtPos(pos) {
		let canvasSize = rect.width;
		let size = (canvasSize - borderSize) / xCount;
		let i = Math.floor(pos[0] / size);
		let j = Math.floor(pos[1] / size);
		return [i, j];
	}

	function fillBorders(width, height) {
		ctx.fillRect(0, 0, borderSize, height);
		ctx.fillRect(width, 0, borderSize, height);
		ctx.fillRect(0, 0, width, borderSize);
		ctx.fillRect(0, height, width + borderSize, borderSize);
	}

	function drawForm(xCount, yCount, disabled) {
		$$invalidate(22, ctx.fillStyle = disabled ? '#ababab' : 'white', ctx);
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		$$invalidate(22, ctx.fillStyle = disabled ? 'gray' : 'black', ctx);

		if (disabled) {
			$$invalidate(22, ctx.fillStyle = 'gray', ctx);
		} else {
			$$invalidate(22, ctx.fillStyle = 'black', ctx);
		}

		let width = cellSize * xCount + borderSize;
		let height = cellSize * yCount + borderSize;
		fillBorders(width, height);

		for (let i = 1; i < xCount; i++) {
			ctx.fillRect(i * cellSize + borderSize / 2.0, 0, borderSize, height);
		}

		for (let i = 1; i < yCount; i++) {
			ctx.fillRect(0, i * cellSize + borderSize / 2.0, width, borderSize);
		}

		let innerCellMargin = 10;

		for (let i = 0; i < xCount; i++) {
			for (let j = 0; j < yCount; j++) {
				let value = toggleCell(j, i);

				if (value) {
					if (value instanceof Object) {
						$$invalidate(22, ctx.fillStyle = tinycolor.fromRatio(value).toHexString(), ctx);
					} else {
						$$invalidate(22, ctx.fillStyle = 'black', ctx);
					}

					ctx.fillRect(i * cellSize + innerCellMargin / 2.0 + borderSize, j * cellSize + innerCellMargin / 2.0 + borderSize, cellSize - innerCellMargin, cellSize - innerCellMargin);
				}
			}
		}
	}

	function onResizeMouseDown(e) {
		resizeStartPos = [e.pageX, e.pageY];
		isResizing = true;

		ui$1.update(temp => {
			temp.disableScroll = true;
		});

		document.body.addEventListener('pointermove', onResizeMouseMove);
		document.body.addEventListener('pointerup', onBodyMouseUp);

		document.body.addEventListener('pointercancel', () => {
			console.log('cancel');
		});

		if (resizeX) {
			document.body.style.cursor = 'col-resize';
		} else if (resizeY) {
			document.body.style.cursor = 'row-resize';
		}
	}

	function onResizeMouseMove(e) {
		console.log('pointermove');

		if (e.buttons === 0) {
			console.log('stop');
			stopDrag();
			return;
		}

		let endPos = [e.pageX, e.pageY];
		let diff = sub(create(), endPos, resizeStartPos);
		let d = diff[resizeX ? 0 : 1] / cellSize;
		let numCells;

		if (d > 0.0) {
			numCells = Math.floor(d);
		} else {
			numCells = -Math.floor(Math.abs(d));
		}

		if (numCells !== 0) {
			if (resizeX && xCount + numCells > 0) {
				$$invalidate(0, xCount += numCells);
				resizeStartPos[0] = resizeStartPos[0] + numCells * cellSize;
			} else if (resizeY && yCount + numCells > 0) {
				$$invalidate(1, yCount += numCells);
				resizeStartPos[1] = resizeStartPos[1] + numCells * cellSize;
			}
		}
	}

	function onBodyMouseUp() {
		stopDrag();
	}

	function stopDrag() {
		console.log('stopdrag');

		ui$1.update(temp => {
			temp.disableScroll = false;
		});

		document.body.removeEventListener('pointermove', onResizeMouseMove);
		document.body.removeEventListener('pointerup', onBodyMouseUp);
		document.body.style.cursor = '';
		isResizing = false;
	}

	const writable_props = [
		'xCount',
		'yCount',
		'toggleCell',
		'onClick',
		'onMouseDown',
		'onMouseUp',
		'onMouseMove',
		'disabled',
		'resizeX',
		'resizeY'
	];

	Object_1$1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Grid> was created with unknown prop '${key}'`);
	});

	function canvas_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			canvas = $$value;
			$$invalidate(5, canvas);
		});
	}

	$$self.$$set = $$props => {
		if ('xCount' in $$props) $$invalidate(0, xCount = $$props.xCount);
		if ('yCount' in $$props) $$invalidate(1, yCount = $$props.yCount);
		if ('toggleCell' in $$props) $$invalidate(13, toggleCell = $$props.toggleCell);
		if ('onClick' in $$props) $$invalidate(14, onClick = $$props.onClick);
		if ('onMouseDown' in $$props) $$invalidate(15, onMouseDown = $$props.onMouseDown);
		if ('onMouseUp' in $$props) $$invalidate(16, onMouseUp = $$props.onMouseUp);
		if ('onMouseMove' in $$props) $$invalidate(17, onMouseMove = $$props.onMouseMove);
		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
		if ('resizeX' in $$props) $$invalidate(3, resizeX = $$props.resizeX);
		if ('resizeY' in $$props) $$invalidate(4, resizeY = $$props.resizeY);
	};

	$$self.$capture_state = () => ({
		onMount,
		onDestroy,
		line,
		tinycolor,
		vec2,
		ui: ui$1,
		xCount,
		yCount,
		toggleCell,
		onClick,
		onMouseDown,
		onMouseUp,
		onMouseMove,
		disabled,
		resizeX,
		resizeY,
		canvas,
		ctx,
		borderSize,
		cellSize,
		rect,
		resizeObserver,
		resizeStartPos,
		isResizing,
		syncCanvasDimensions,
		onCanvasMouseDown,
		onCanvasMouseMove,
		onCanvasMouseUp,
		onCanvasClick,
		getBoundingClientRect,
		getCellsBetweenPoints,
		getCellAtPos,
		fillBorders,
		drawForm,
		onResizeMouseDown,
		onResizeMouseMove,
		onBodyMouseUp,
		stopDrag
	});

	$$self.$inject_state = $$props => {
		if ('xCount' in $$props) $$invalidate(0, xCount = $$props.xCount);
		if ('yCount' in $$props) $$invalidate(1, yCount = $$props.yCount);
		if ('toggleCell' in $$props) $$invalidate(13, toggleCell = $$props.toggleCell);
		if ('onClick' in $$props) $$invalidate(14, onClick = $$props.onClick);
		if ('onMouseDown' in $$props) $$invalidate(15, onMouseDown = $$props.onMouseDown);
		if ('onMouseUp' in $$props) $$invalidate(16, onMouseUp = $$props.onMouseUp);
		if ('onMouseMove' in $$props) $$invalidate(17, onMouseMove = $$props.onMouseMove);
		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
		if ('resizeX' in $$props) $$invalidate(3, resizeX = $$props.resizeX);
		if ('resizeY' in $$props) $$invalidate(4, resizeY = $$props.resizeY);
		if ('canvas' in $$props) $$invalidate(5, canvas = $$props.canvas);
		if ('ctx' in $$props) $$invalidate(22, ctx = $$props.ctx);
		if ('borderSize' in $$props) $$invalidate(6, borderSize = $$props.borderSize);
		if ('cellSize' in $$props) $$invalidate(7, cellSize = $$props.cellSize);
		if ('rect' in $$props) rect = $$props.rect;
		if ('resizeObserver' in $$props) resizeObserver = $$props.resizeObserver;
		if ('resizeStartPos' in $$props) resizeStartPos = $$props.resizeStartPos;
		if ('isResizing' in $$props) isResizing = $$props.isResizing;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*ctx, xCount, yCount*/ 4194307) {
			{
				if (ctx) {
					syncCanvasDimensions(xCount, yCount);
				}
			}
		}

		if ($$self.$$.dirty[0] & /*ctx, xCount, yCount, disabled*/ 4194311) {
			{
				if (ctx) {
					drawForm(xCount, yCount, disabled);
				}
			}
		}
	};

	return [
		xCount,
		yCount,
		disabled,
		resizeX,
		resizeY,
		canvas,
		borderSize,
		cellSize,
		onCanvasMouseDown,
		onCanvasMouseMove,
		onCanvasMouseUp,
		onCanvasClick,
		onResizeMouseDown,
		toggleCell,
		onClick,
		onMouseDown,
		onMouseUp,
		onMouseMove,
		getBoundingClientRect,
		getCellsBetweenPoints,
		getCellAtPos,
		drawForm,
		ctx,
		canvas_1_binding
	];
}

class Grid extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(
			this,
			options,
			instance$i,
			create_fragment$i,
			not_equal,
			{
				xCount: 0,
				yCount: 1,
				toggleCell: 13,
				onClick: 14,
				onMouseDown: 15,
				onMouseUp: 16,
				onMouseMove: 17,
				disabled: 2,
				resizeX: 3,
				resizeY: 4,
				getBoundingClientRect: 18,
				getCellsBetweenPoints: 19,
				getCellAtPos: 20,
				drawForm: 21
			},
			null,
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Grid",
			options,
			id: create_fragment$i.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xCount*/ ctx[0] === undefined && !('xCount' in props)) {
			console_1$3.warn("<Grid> was created without expected prop 'xCount'");
		}

		if (/*yCount*/ ctx[1] === undefined && !('yCount' in props)) {
			console_1$3.warn("<Grid> was created without expected prop 'yCount'");
		}
	}

	get xCount() {
		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xCount(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get yCount() {
		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set yCount(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get toggleCell() {
		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toggleCell(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onClick() {
		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onClick(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onMouseDown() {
		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onMouseDown(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onMouseUp() {
		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onMouseUp(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onMouseMove() {
		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onMouseMove(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get resizeX() {
		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set resizeX(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get resizeY() {
		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set resizeY(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getBoundingClientRect() {
		return this.$$.ctx[18];
	}

	set getBoundingClientRect(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getCellsBetweenPoints() {
		return this.$$.ctx[19];
	}

	set getCellsBetweenPoints(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getCellAtPos() {
		return this.$$.ctx[20];
	}

	set getCellAtPos(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get drawForm() {
		return this.$$.ctx[21];
	}

	set drawForm(value) {
		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/pages/Editor/Sidebar/Subcomponents/PatternFill/HeddleThreadingFill.svelte generated by Svelte v3.43.0 */
const file$h = "src/pages/Editor/Sidebar/Subcomponents/PatternFill/HeddleThreadingFill.svelte";

// (145:2) {#if warpOrWeft !== undefined}
function create_if_block$a(ctx) {
	let div0;
	let grid_1;
	let updating_xCount;
	let updating_yCount;
	let div0_class_value;
	let t0;
	let div1;
	let fieldset;
	let label;
	let t1_value = /*$t*/ ctx[6]('page.pattern_fill.mirrored_repeat') + "";
	let t1;
	let t2;
	let input;
	let current;
	let mounted;
	let dispose;

	function grid_1_xCount_binding(value) {
		/*grid_1_xCount_binding*/ ctx[16](value);
	}

	function grid_1_yCount_binding(value) {
		/*grid_1_yCount_binding*/ ctx[17](value);
	}

	let grid_1_props = {
		resizeX: /*warpOrWeft*/ ctx[0] === 'warp',
		resizeY: /*warpOrWeft*/ ctx[0] === 'weft',
		toggleCell: /*toggleCell*/ ctx[8],
		onMouseDown: /*onGridMouseDown*/ ctx[9],
		onMouseUp: /*onGridMouseUp*/ ctx[7],
		disabled: /*disabled*/ ctx[1]
	};

	if (/*xCount*/ ctx[2] !== void 0) {
		grid_1_props.xCount = /*xCount*/ ctx[2];
	}

	if (/*yCount*/ ctx[3] !== void 0) {
		grid_1_props.yCount = /*yCount*/ ctx[3];
	}

	grid_1 = new Grid({ props: grid_1_props, $$inline: true });
	/*grid_1_binding*/ ctx[15](grid_1);
	binding_callbacks.push(() => bind(grid_1, 'xCount', grid_1_xCount_binding));
	binding_callbacks.push(() => bind(grid_1, 'yCount', grid_1_yCount_binding));

	const block = {
		c: function create() {
			div0 = element("div");
			create_component(grid_1.$$.fragment);
			t0 = space();
			div1 = element("div");
			fieldset = element("fieldset");
			label = element("label");
			t1 = text(t1_value);
			t2 = space();
			input = element("input");
			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty('canvas ' + /*warpOrWeft*/ ctx[0]) + " svelte-dbckys"));
			add_location(div0, file$h, 145, 4, 3650);
			attr_dev(label, "for", "mirrored-repeat");
			add_location(label, file$h, 160, 8, 4028);
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "name", "mirrored-repeat");
			attr_dev(input, "id", "mirrored-repeat");
			add_location(input, file$h, 163, 8, 4135);
			add_location(fieldset, file$h, 159, 6, 4009);
			attr_dev(div1, "class", "controls");
			add_location(div1, file$h, 158, 4, 3980);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			mount_component(grid_1, div0, null);
			insert_dev(target, t0, anchor);
			insert_dev(target, div1, anchor);
			append_dev(div1, fieldset);
			append_dev(fieldset, label);
			append_dev(label, t1);
			append_dev(fieldset, t2);
			append_dev(fieldset, input);
			input.checked = /*mirroredRepeat*/ ctx[5];
			current = true;

			if (!mounted) {
				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[18]);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			const grid_1_changes = {};
			if (dirty & /*warpOrWeft*/ 1) grid_1_changes.resizeX = /*warpOrWeft*/ ctx[0] === 'warp';
			if (dirty & /*warpOrWeft*/ 1) grid_1_changes.resizeY = /*warpOrWeft*/ ctx[0] === 'weft';
			if (dirty & /*disabled*/ 2) grid_1_changes.disabled = /*disabled*/ ctx[1];

			if (!updating_xCount && dirty & /*xCount*/ 4) {
				updating_xCount = true;
				grid_1_changes.xCount = /*xCount*/ ctx[2];
				add_flush_callback(() => updating_xCount = false);
			}

			if (!updating_yCount && dirty & /*yCount*/ 8) {
				updating_yCount = true;
				grid_1_changes.yCount = /*yCount*/ ctx[3];
				add_flush_callback(() => updating_yCount = false);
			}

			grid_1.$set(grid_1_changes);

			if (!current || dirty & /*warpOrWeft*/ 1 && div0_class_value !== (div0_class_value = "" + (null_to_empty('canvas ' + /*warpOrWeft*/ ctx[0]) + " svelte-dbckys"))) {
				attr_dev(div0, "class", div0_class_value);
			}

			if ((!current || dirty & /*$t*/ 64) && t1_value !== (t1_value = /*$t*/ ctx[6]('page.pattern_fill.mirrored_repeat') + "")) set_data_dev(t1, t1_value);

			if (dirty & /*mirroredRepeat*/ 32) {
				input.checked = /*mirroredRepeat*/ ctx[5];
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(grid_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(grid_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			/*grid_1_binding*/ ctx[15](null);
			destroy_component(grid_1);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div1);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$a.name,
		type: "if",
		source: "(145:2) {#if warpOrWeft !== undefined}",
		ctx
	});

	return block;
}

function create_fragment$h(ctx) {
	let div;
	let current;
	let if_block = /*warpOrWeft*/ ctx[0] !== undefined && create_if_block$a(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			attr_dev(div, "class", "pattern-fill svelte-dbckys");
			add_location(div, file$h, 143, 0, 3586);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*warpOrWeft*/ ctx[0] !== undefined) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*warpOrWeft*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$a(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$h.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function addArrays(left, right) {
	let ret = [...right];

	for (let i = 0; i < left.length; i++) {
		if (left[i] !== undefined) {
			ret[i] = left[i];
		}
	}

	return ret;
}

function instance$h($$self, $$props, $$invalidate) {
	let treadleCount;
	let shaftCount;
	let $draft;
	let $t;
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(14, $draft = $$value));
	validate_store($format, 't');
	component_subscribe($$self, $format, $$value => $$invalidate(6, $t = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('HeddleThreadingFill', slots, []);
	let { warpOrWeft } = $$props;
	let { disabled = false } = $$props;
	let grid;
	let mirroredRepeat = true;
	let oldWarpOfWeft;
	let isDragging = false;
	let startPos = undefined;
	let linePoints = [];
	let xCount = 0;
	let yCount = 0;
	let cellData = [];

	onMount(() => {
		$$invalidate(2, xCount = treadleCount);
		$$invalidate(3, yCount = shaftCount);

		for (let i = 0; i < xCount; i++) {
			cellData[i] = i;
		}
	});

	function normalizeCellData() {
		cellData = cellData.map(v => v > xCount - 1 ? undefined : v);
	}

	function apply() {
		draft$1.update(temp => {
			let length = warpOrWeft === 'warp' ? xCount : yCount;
			let cellDataSlice = [...cellData];
			cellDataSlice.splice(length, cellData.length);
			applyPattern(temp, cellDataSlice, warpOrWeft, mirroredRepeat);
		});
	}

	function onGridMouseMove(event) {
		event.stopPropagation();

		if (event.buttons === 0) {
			startPos = undefined;
			isDragging = false;
			return;
		}

		let rect = grid.getBoundingClientRect();
		let pos = [event.clientX - rect.left, event.clientY - rect.top];

		if (isDragging === false && event.buttons & 1 && (event.movementX !== 0 || event.movementY !== 0)) {
			isDragging = true;
			startPos = pos;
		}

		if (isDragging) {
			let lp = grid.getCellsBetweenPoints(startPos, pos);
			linePoints = [];

			lp.forEach(p => {
				if (warpOrWeft === 'weft') {
					linePoints[p[1]] = p[0];
				} else if (warpOrWeft === 'warp') {
					linePoints[p[0]] = p[1];
				}
			});

			linePoints = addArrays(linePoints, cellData);
			grid.drawForm(xCount, yCount, false);
		}
	}

	function onGridMouseUp(event) {
		if (isDragging) {
			cellData = addArrays(linePoints, cellData);
			startPos = undefined;
			linePoints = undefined;
			isDragging = false;
			document.body.removeEventListener('mousemove', onGridMouseMove);
		} else {
			let rect = grid.getBoundingClientRect();
			let pos = [event.clientX - rect.left, event.clientY - rect.top];
			let [i, j] = grid.getCellAtPos(pos);

			if (warpOrWeft === 'warp') {
				cellData[i] = cellData[i] === j ? undefined : j;
			} else if (warpOrWeft === 'weft') {
				cellData[j] = cellData[j] === i ? undefined : i;
			}
		}

		grid.drawForm(xCount, yCount, false);
	}

	function toggleCell(i, j) {
		let x, y;

		if (warpOrWeft === 'warp') {
			x = j;
			y = i;
		} else if (warpOrWeft === 'weft') {
			x = i;
			y = j;
		}

		if (isDragging) {
			return linePoints[x] === y;
		} else {
			return cellData[x] === y;
		}
	}

	function onGridMouseDown() {
		document.body.addEventListener('mousemove', onGridMouseMove);
	}

	const writable_props = ['warpOrWeft', 'disabled'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HeddleThreadingFill> was created with unknown prop '${key}'`);
	});

	function grid_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			grid = $$value;
			$$invalidate(4, grid);
		});
	}

	function grid_1_xCount_binding(value) {
		xCount = value;
		(((((($$invalidate(2, xCount), $$invalidate(11, oldWarpOfWeft)), $$invalidate(0, warpOrWeft)), $$invalidate(3, yCount)), $$invalidate(13, treadleCount)), $$invalidate(12, shaftCount)), $$invalidate(14, $draft));
	}

	function grid_1_yCount_binding(value) {
		yCount = value;
		(((((($$invalidate(3, yCount), $$invalidate(11, oldWarpOfWeft)), $$invalidate(0, warpOrWeft)), $$invalidate(2, xCount)), $$invalidate(13, treadleCount)), $$invalidate(12, shaftCount)), $$invalidate(14, $draft));
	}

	function input_change_handler() {
		mirroredRepeat = this.checked;
		$$invalidate(5, mirroredRepeat);
	}

	$$self.$$set = $$props => {
		if ('warpOrWeft' in $$props) $$invalidate(0, warpOrWeft = $$props.warpOrWeft);
		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
	};

	$$self.$capture_state = () => ({
		onMount,
		draft: draft$1,
		draftUtil,
		Grid,
		t: $format,
		warpOrWeft,
		disabled,
		grid,
		mirroredRepeat,
		oldWarpOfWeft,
		isDragging,
		startPos,
		linePoints,
		xCount,
		yCount,
		cellData,
		normalizeCellData,
		apply,
		onGridMouseMove,
		onGridMouseUp,
		addArrays,
		toggleCell,
		onGridMouseDown,
		shaftCount,
		treadleCount,
		$draft,
		$t
	});

	$$self.$inject_state = $$props => {
		if ('warpOrWeft' in $$props) $$invalidate(0, warpOrWeft = $$props.warpOrWeft);
		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
		if ('grid' in $$props) $$invalidate(4, grid = $$props.grid);
		if ('mirroredRepeat' in $$props) $$invalidate(5, mirroredRepeat = $$props.mirroredRepeat);
		if ('oldWarpOfWeft' in $$props) $$invalidate(11, oldWarpOfWeft = $$props.oldWarpOfWeft);
		if ('isDragging' in $$props) isDragging = $$props.isDragging;
		if ('startPos' in $$props) startPos = $$props.startPos;
		if ('linePoints' in $$props) linePoints = $$props.linePoints;
		if ('xCount' in $$props) $$invalidate(2, xCount = $$props.xCount);
		if ('yCount' in $$props) $$invalidate(3, yCount = $$props.yCount);
		if ('cellData' in $$props) cellData = $$props.cellData;
		if ('shaftCount' in $$props) $$invalidate(12, shaftCount = $$props.shaftCount);
		if ('treadleCount' in $$props) $$invalidate(13, treadleCount = $$props.treadleCount);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$draft*/ 16384) {
			$$invalidate(13, treadleCount = $draft.treadleCount);
		}

		if ($$self.$$.dirty & /*$draft*/ 16384) {
			$$invalidate(12, shaftCount = $draft.shaftCount);
		}

		if ($$self.$$.dirty & /*oldWarpOfWeft, warpOrWeft, yCount, xCount, treadleCount, shaftCount*/ 14349) {
			{
				if (oldWarpOfWeft !== warpOrWeft) {
					$$invalidate(2, [xCount, yCount] = [yCount, xCount], xCount, (((((($$invalidate(3, yCount), $$invalidate(11, oldWarpOfWeft)), $$invalidate(0, warpOrWeft)), $$invalidate(2, xCount)), $$invalidate(13, treadleCount)), $$invalidate(12, shaftCount)), $$invalidate(14, $draft)));

					if (warpOrWeft === 'weft') {
						$$invalidate(2, xCount = treadleCount);
					} else if (warpOrWeft === 'warp') {
						$$invalidate(3, yCount = shaftCount);
					}

					$$invalidate(11, oldWarpOfWeft = warpOrWeft);
					normalizeCellData();
				}
			}
		}
	};

	return [
		warpOrWeft,
		disabled,
		xCount,
		yCount,
		grid,
		mirroredRepeat,
		$t,
		onGridMouseUp,
		toggleCell,
		onGridMouseDown,
		apply,
		oldWarpOfWeft,
		shaftCount,
		treadleCount,
		$draft,
		grid_1_binding,
		grid_1_xCount_binding,
		grid_1_yCount_binding,
		input_change_handler
	];
}

class HeddleThreadingFill extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$h, create_fragment$h, not_equal, { warpOrWeft: 0, disabled: 1, apply: 10 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "HeddleThreadingFill",
			options,
			id: create_fragment$h.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*warpOrWeft*/ ctx[0] === undefined && !('warpOrWeft' in props)) {
			console.warn("<HeddleThreadingFill> was created without expected prop 'warpOrWeft'");
		}
	}

	get warpOrWeft() {
		throw new Error("<HeddleThreadingFill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set warpOrWeft(value) {
		throw new Error("<HeddleThreadingFill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<HeddleThreadingFill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<HeddleThreadingFill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get apply() {
		return this.$$.ctx[10];
	}

	set apply(value) {
		throw new Error("<HeddleThreadingFill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var gridIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 228 86.8\">\n  <g stroke-width=\"10\" fill=\"none\">\n    <path d=\"M226.7 43.4H7.1\" stroke-width=\"5\"/>\n    <path d=\"M26.7 63L7.1 43.4l19.6-19.7\" stroke-linecap=\"square\" />\n  </g>\n  <path d=\"M57.6 1h169.3v84.7H57.6\" fill=\"none\" stroke-width=\"2.1\" stroke-linecap=\"round\" />\n  <path d=\"M57.6 22.2h169.3M57.6 43.4h169.1M227 64.6H57.5\" fill=\"none\" stroke-width=\"2.1\" stroke-linecap=\"round\"/>\n  <path d=\"M78.7 1v84.7M100 1v84.7M121 1v84.7M142.2 1v84.7M163.4 1v84.7M184.6 1v84.7M205.7 1v84.7\" fill=\"none\" stroke-width=\"2.1\"/>\n  <path stroke-width=\"2.1\" stroke-linecap=\"round\" d=\"M63 6.4h10.5V17H63zM84 27.6h10.6v10.6H84zM105.2 48.7h10.6v10.6h-10.6zM126.4 69.9H137v10.6h-10.6zM147.5 6.4h10.6V17h-10.6zM168.7 27.6h10.6v10.6h-10.6zM190 48.7h10.5v10.6H190zM211 69.9h10.6v10.6H211z\"/>\n  <path d=\"M7 43.4L33.9 70\" fill=\"none\"/>\n</svg>\n";

/* src/pages/Editor/Sidebar/Subcomponents/PatternFill/PatternFill.svelte generated by Svelte v3.43.0 */
const file$g = "src/pages/Editor/Sidebar/Subcomponents/PatternFill/PatternFill.svelte";

function create_fragment$g(ctx) {
	let div2;
	let div0;
	let input0;
	let t0;
	let label0;
	let t1;
	let div1;
	let input1;
	let t2;
	let label1;
	let t3;
	let heddlethreadingfill;
	let t4;
	let button;
	let t5_value = /*$t*/ ctx[2]('page.pattern_fill.apply') + "";
	let t5;
	let current;
	let mounted;
	let dispose;
	let heddlethreadingfill_props = { warpOrWeft: /*warpOrWeft*/ ctx[0] };

	heddlethreadingfill = new HeddleThreadingFill({
			props: heddlethreadingfill_props,
			$$inline: true
		});

	/*heddlethreadingfill_binding*/ ctx[7](heddlethreadingfill);

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			input0 = element("input");
			t0 = space();
			label0 = element("label");
			t1 = space();
			div1 = element("div");
			input1 = element("input");
			t2 = space();
			label1 = element("label");
			t3 = space();
			create_component(heddlethreadingfill.$$.fragment);
			t4 = space();
			button = element("button");
			t5 = text(t5_value);
			attr_dev(input0, "type", "radio");
			attr_dev(input0, "id", "warp");
			attr_dev(input0, "name", "warp-or-weft");
			input0.__value = "warp";
			input0.value = input0.__value;
			attr_dev(input0, "class", "svelte-ffg717");
			/*$$binding_groups*/ ctx[5][0].push(input0);
			toggle_class(input0, "notActive", /*warpOrWeft*/ ctx[0] === undefined);
			add_location(input0, file$g, 15, 4, 334);
			attr_dev(label0, "for", "warp");
			attr_dev(label0, "class", "svelte-ffg717");
			add_location(label0, file$g, 23, 4, 511);
			attr_dev(div0, "class", "warp svelte-ffg717");
			add_location(div0, file$g, 14, 2, 311);
			attr_dev(input1, "type", "radio");
			attr_dev(input1, "id", "weft");
			attr_dev(input1, "name", "warp-or-weft");
			input1.__value = "weft";
			input1.value = input1.__value;
			attr_dev(input1, "class", "svelte-ffg717");
			/*$$binding_groups*/ ctx[5][0].push(input1);
			add_location(input1, file$g, 26, 4, 588);
			attr_dev(label1, "for", "weft");
			attr_dev(label1, "class", "svelte-ffg717");
			add_location(label1, file$g, 33, 4, 716);
			attr_dev(div1, "class", "weft svelte-ffg717");
			add_location(div1, file$g, 25, 2, 565);
			attr_dev(div2, "class", "button-group svelte-ffg717");
			add_location(div2, file$g, 13, 0, 282);
			add_location(button, file$g, 38, 0, 842);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, input0);
			input0.checked = input0.__value === /*warpOrWeft*/ ctx[0];
			append_dev(div0, t0);
			append_dev(div0, label0);
			label0.innerHTML = gridIcon;
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div1, input1);
			input1.checked = input1.__value === /*warpOrWeft*/ ctx[0];
			append_dev(div1, t2);
			append_dev(div1, label1);
			label1.innerHTML = gridIcon;
			insert_dev(target, t3, anchor);
			mount_component(heddlethreadingfill, target, anchor);
			insert_dev(target, t4, anchor);
			insert_dev(target, button, anchor);
			append_dev(button, t5);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(input0, "change", /*input0_change_handler*/ ctx[4]),
					listen_dev(input1, "change", /*input1_change_handler*/ ctx[6]),
					listen_dev(button, "click", /*apply*/ ctx[3], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*warpOrWeft*/ 1) {
				input0.checked = input0.__value === /*warpOrWeft*/ ctx[0];
			}

			if (dirty & /*warpOrWeft, undefined*/ 1) {
				toggle_class(input0, "notActive", /*warpOrWeft*/ ctx[0] === undefined);
			}

			if (dirty & /*warpOrWeft*/ 1) {
				input1.checked = input1.__value === /*warpOrWeft*/ ctx[0];
			}

			const heddlethreadingfill_changes = {};
			if (dirty & /*warpOrWeft*/ 1) heddlethreadingfill_changes.warpOrWeft = /*warpOrWeft*/ ctx[0];
			heddlethreadingfill.$set(heddlethreadingfill_changes);
			if ((!current || dirty & /*$t*/ 4) && t5_value !== (t5_value = /*$t*/ ctx[2]('page.pattern_fill.apply') + "")) set_data_dev(t5, t5_value);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(heddlethreadingfill.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(heddlethreadingfill.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			/*$$binding_groups*/ ctx[5][0].splice(/*$$binding_groups*/ ctx[5][0].indexOf(input0), 1);
			/*$$binding_groups*/ ctx[5][0].splice(/*$$binding_groups*/ ctx[5][0].indexOf(input1), 1);
			if (detaching) detach_dev(t3);
			/*heddlethreadingfill_binding*/ ctx[7](null);
			destroy_component(heddlethreadingfill, detaching);
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(button);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$g($$self, $$props, $$invalidate) {
	let $t;
	validate_store($format, 't');
	component_subscribe($$self, $format, $$value => $$invalidate(2, $t = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('PatternFill', slots, []);
	let warpOrWeft = 'warp';
	let heddleThreadFill;

	function apply() {
		heddleThreadFill.apply();
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PatternFill> was created with unknown prop '${key}'`);
	});

	const $$binding_groups = [[]];

	function input0_change_handler() {
		warpOrWeft = this.__value;
		$$invalidate(0, warpOrWeft);
	}

	function input1_change_handler() {
		warpOrWeft = this.__value;
		$$invalidate(0, warpOrWeft);
	}

	function heddlethreadingfill_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			heddleThreadFill = $$value;
			$$invalidate(1, heddleThreadFill);
		});
	}

	$$self.$capture_state = () => ({
		t: $format,
		HeddleThreadingFill,
		gridIcon,
		warpOrWeft,
		heddleThreadFill,
		apply,
		$t
	});

	$$self.$inject_state = $$props => {
		if ('warpOrWeft' in $$props) $$invalidate(0, warpOrWeft = $$props.warpOrWeft);
		if ('heddleThreadFill' in $$props) $$invalidate(1, heddleThreadFill = $$props.heddleThreadFill);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		warpOrWeft,
		heddleThreadFill,
		$t,
		apply,
		input0_change_handler,
		$$binding_groups,
		input1_change_handler,
		heddlethreadingfill_binding
	];
}

class PatternFill extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$g, create_fragment$g, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "PatternFill",
			options,
			id: create_fragment$g.name
		});
	}
}

/* src/components/YarnFillTable/Repeats.svelte generated by Svelte v3.43.0 */

const { console: console_1$2 } = globals;
const file$f = "src/components/YarnFillTable/Repeats.svelte";

function get_each_context$6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[33] = list[i];
	child_ctx[34] = list;
	child_ctx[35] = i;
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[36] = list[i];
	return child_ctx;
}

function get_each_context_2$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[39] = list[i];
	child_ctx[41] = i;
	return child_ctx;
}

// (345:0) {#if length > 2}
function create_if_block$9(ctx) {
	let each_1_anchor;
	let each_value = /*repeatRows*/ ctx[2];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty$1();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*elements, amountOfNumberInputs, repeatTimesPerRow, setRepeatTimes, length, repeatRows, fromColumn, fromRow, elementActive, dragStart, selectedRepeat*/ 2047) {
				each_value = /*repeatRows*/ ctx[2];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$6(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$9.name,
		type: "if",
		source: "(345:0) {#if length > 2}",
		ctx
	});

	return block;
}

// (351:12) {#if column !== 0}
function create_if_block_1$3(ctx) {
	let div0;
	let t0;
	let t1;
	let div1;
	let if_block = (/*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 2] !== /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] || /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41]] !== /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] || /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] === 0 || /*selectedRepeat*/ ctx[8] !== undefined && (/*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] === 0 || /*selectedRepeat*/ ctx[8].id === /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1])) && create_if_block_2$2(ctx);

	const block = {
		c: function create() {
			div0 = element("div");
			t0 = space();
			if (if_block) if_block.c();
			t1 = space();
			div1 = element("div");
			attr_dev(div0, "class", "line left svelte-lc8d1w");
			toggle_class(div0, "visible", /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] !== 0 && /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 2] !== 0 && /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] === /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 2]);
			add_location(div0, file$f, 351, 14, 9602);
			attr_dev(div1, "class", "line right svelte-lc8d1w");
			toggle_class(div1, "visible", /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] !== 0 && /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41]] !== 0 && /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] === /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41]]);
			add_location(div1, file$f, 367, 14, 10543);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			insert_dev(target, t0, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div1, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*repeatRows*/ 4) {
				toggle_class(div0, "visible", /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] !== 0 && /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 2] !== 0 && /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] === /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 2]);
			}

			if (/*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 2] !== /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] || /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41]] !== /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] || /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] === 0 || /*selectedRepeat*/ ctx[8] !== undefined && (/*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] === 0 || /*selectedRepeat*/ ctx[8].id === /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1])) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2$2(ctx);
					if_block.c();
					if_block.m(t1.parentNode, t1);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*repeatRows*/ 4) {
				toggle_class(div1, "visible", /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] !== 0 && /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41]] !== 0 && /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1] === /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41]]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			if (detaching) detach_dev(t0);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(351:12) {#if column !== 0}",
		ctx
	});

	return block;
}

// (358:14) {#if repeatRows[row][column - 2] !== repeatRows[row][column - 1] || repeatRows[row][column] !== repeatRows[row][column - 1] || repeatRows[row][column - 1] === 0 || (selectedRepeat !== undefined && (repeatRows[row][column - 1] === 0 || selectedRepeat.id === repeatRows[row][column - 1]))}
function create_if_block_2$2(ctx) {
	let button;
	let button_data_id_value;
	let mounted;
	let dispose;

	function pointerdown_handler(...args) {
		return /*pointerdown_handler*/ ctx[14](/*row*/ ctx[35], /*column*/ ctx[41], ...args);
	}

	const block = {
		c: function create() {
			button = element("button");
			attr_dev(button, "data-id", button_data_id_value = /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1]);
			attr_dev(button, "data-row", /*row*/ ctx[35]);
			attr_dev(button, "class", "svelte-lc8d1w");
			toggle_class(button, "active", /*fromColumn*/ ctx[6] === /*column*/ ctx[41] - 1 && /*fromRow*/ ctx[5] === /*row*/ ctx[35] && /*elementActive*/ ctx[7]);
			add_location(button, file$f, 358, 16, 10178);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "pointerdown", pointerdown_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*repeatRows*/ 4 && button_data_id_value !== (button_data_id_value = /*repeatRows*/ ctx[2][/*row*/ ctx[35]][/*column*/ ctx[41] - 1])) {
				attr_dev(button, "data-id", button_data_id_value);
			}

			if (dirty[0] & /*fromColumn, fromRow, elementActive*/ 224) {
				toggle_class(button, "active", /*fromColumn*/ ctx[6] === /*column*/ ctx[41] - 1 && /*fromRow*/ ctx[5] === /*row*/ ctx[35] && /*elementActive*/ ctx[7]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$2.name,
		type: "if",
		source: "(358:14) {#if repeatRows[row][column - 2] !== repeatRows[row][column - 1] || repeatRows[row][column] !== repeatRows[row][column - 1] || repeatRows[row][column - 1] === 0 || (selectedRepeat !== undefined && (repeatRows[row][column - 1] === 0 || selectedRepeat.id === repeatRows[row][column - 1]))}",
		ctx
	});

	return block;
}

// (348:6) {#each { length } as _, column}
function create_each_block_2$1(ctx) {
	let td;
	let div;
	let if_block = /*column*/ ctx[41] !== 0 && create_if_block_1$3(ctx);

	const block = {
		c: function create() {
			td = element("td");
			div = element("div");
			if (if_block) if_block.c();
			attr_dev(div, "class", "repeat-container svelte-lc8d1w");
			add_location(div, file$f, 349, 10, 9526);
			attr_dev(td, "class", "svelte-lc8d1w");
			add_location(td, file$f, 348, 8, 9511);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td, anchor);
			append_dev(td, div);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, dirty) {
			if (/*column*/ ctx[41] !== 0) if_block.p(ctx, dirty);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(td);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2$1.name,
		type: "each",
		source: "(348:6) {#each { length } as _, column}",
		ctx
	});

	return block;
}

// (379:8) {#each amountOfNumberInputs[row] as id}
function create_each_block_1$1(ctx) {
	let input;
	let input_data_id_value;
	let input_value_value;
	let mounted;
	let dispose;

	function input_handler(...args) {
		return /*input_handler*/ ctx[15](/*id*/ ctx[36], /*row*/ ctx[35], ...args);
	}

	const block = {
		c: function create() {
			input = element("input");
			attr_dev(input, "type", "text");
			attr_dev(input, "class", "times-input svelte-lc8d1w");
			attr_dev(input, "data-id", input_data_id_value = /*id*/ ctx[36]);
			attr_dev(input, "data-row", /*row*/ ctx[35]);
			input.value = input_value_value = /*repeatTimesPerRow*/ ctx[1][/*row*/ ctx[35]][/*id*/ ctx[36]];
			add_location(input, file$f, 379, 10, 10927);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);

			if (!mounted) {
				dispose = listen_dev(input, "input", input_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*amountOfNumberInputs*/ 8 && input_data_id_value !== (input_data_id_value = /*id*/ ctx[36])) {
				attr_dev(input, "data-id", input_data_id_value);
			}

			if (dirty[0] & /*repeatTimesPerRow, amountOfNumberInputs*/ 10 && input_value_value !== (input_value_value = /*repeatTimesPerRow*/ ctx[1][/*row*/ ctx[35]][/*id*/ ctx[36]]) && input.value !== input_value_value) {
				prop_dev(input, "value", input_value_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$1.name,
		type: "each",
		source: "(379:8) {#each amountOfNumberInputs[row] as id}",
		ctx
	});

	return block;
}

// (346:2) {#each repeatRows as repeatRow, row}
function create_each_block$6(ctx) {
	let tr;
	let t0;
	let div;
	let t1;
	let row = /*row*/ ctx[35];
	let each_value_2 = { length: /*length*/ ctx[0] };
	validate_each_argument(each_value_2);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_1[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
	}

	let each_value_1 = /*amountOfNumberInputs*/ ctx[3][/*row*/ ctx[35]];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
	}

	const assign_tr = () => /*tr_binding*/ ctx[16](tr, row);
	const unassign_tr = () => /*tr_binding*/ ctx[16](null, row);

	const block = {
		c: function create() {
			tr = element("tr");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t0 = space();
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			add_location(div, file$f, 377, 6, 10863);
			attr_dev(tr, "class", "repeat svelte-lc8d1w");
			add_location(tr, file$f, 346, 4, 9419);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(tr, null);
			}

			append_dev(tr, t0);
			append_dev(tr, div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			append_dev(tr, t1);
			assign_tr();
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*repeatRows, fromColumn, fromRow, elementActive, dragStart, selectedRepeat, length*/ 997) {
				each_value_2 = { length: /*length*/ ctx[0] };
				validate_each_argument(each_value_2);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_2$1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(tr, t0);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_2.length;
			}

			if (dirty[0] & /*amountOfNumberInputs, repeatTimesPerRow, setRepeatTimes*/ 1034) {
				each_value_1 = /*amountOfNumberInputs*/ ctx[3][/*row*/ ctx[35]];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}

			if (row !== /*row*/ ctx[35]) {
				unassign_tr();
				row = /*row*/ ctx[35];
				assign_tr();
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			unassign_tr();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$6.name,
		type: "each",
		source: "(346:2) {#each repeatRows as repeatRow, row}",
		ctx
	});

	return block;
}

function create_fragment$f(ctx) {
	let if_block_anchor;
	let if_block = /*length*/ ctx[0] > 2 && create_if_block$9(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty$1();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (/*length*/ ctx[0] > 2) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$9(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function getRepeats(row, repeatTimes = []) {
	let lastValue = -1;
	let repeats = [];

	for (let i = 0; i < row.length; i++) {
		if (lastValue !== row[i]) {
			if (repeats.length > 0) {
				repeats[repeats.length - 1].to = i - 1;
			}

			repeats.push({
				from: i,
				times: repeatTimes[row[i]],
				id: row[i]
			});

			lastValue = row[i];
		}
	}

	if (repeats.length > 0 && repeats[repeats.length - 1].to === undefined) {
		repeats[repeats.length - 1].to = row.length - 1;
	}

	return repeats.filter(r => r.id !== 0);
}

function instance$f($$self, $$props, $$invalidate) {
	let repeatRows;
	let repeatTimesPerRow;
	let selectedRepeat;
	let amountOfNumberInputs;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Repeats', slots, []);
	let { length } = $$props;
	let { repeats = [] } = $$props;
	let elements = [];
	let activeElement;

	function insertColumn(index) {
		for (let i = 0; i < repeatRows.length; i++) {
			if (index < repeatRows.length - 1) {
				repeatRows[i].splice(index, 0, repeatRows[i][index]);
			} else {
				repeatRows[i].push(0);
			}
		}

		$$invalidate(2, repeatRows = [...repeatRows]);
	}

	function removeColumn(index) {
		for (let i = 0; i < repeatRows.length; i++) {
			repeatRows[i].splice(index, 1);
			postChangeCheck(repeatRows[i]);
		}

		$$invalidate(2, repeatRows = [...repeatRows]);
	}

	let distanceBetweenPoints;
	let fromRow;
	let fromColumn;
	let startX;
	let startClientX;
	let elementActive = false;

	function dragStart(event, row, column) {
		//elementActive = false;
		$$invalidate(5, fromRow = row);

		$$invalidate(6, fromColumn = column);
		startX = event.target.getBoundingClientRect().x;
		startClientX = event.clientX;
		document.body.classList.add('dragging');
		document.addEventListener('mousemove', dragMove);
		document.addEventListener('pointerup', dragEnd, { once: true });
	}

	//let clickFromRow;
	//let clickFromColumn;
	let lastX;

	let lastFromRow;
	let lastFromColumn;

	function dragEnd(event) {
		let delta = event.clientX - startClientX;
		console.log(delta);

		if (delta < 8) {
			//Set active element here for mouse clicking action (non-dragging)
			if (elementActive) {
				startX = lastX;
				$$invalidate(5, fromRow = lastFromRow);
				$$invalidate(6, fromColumn = lastFromColumn);
				dragMove(event);
				$$invalidate(7, elementActive = false);
			} else {
				lastX = startX;
				lastFromRow = fromRow;
				lastFromColumn = fromColumn;
				$$invalidate(7, elementActive = true);
			}
		}

		document.body.classList.remove('dragging');
		document.removeEventListener('mousemove', dragMove);
	}

	function dragMove(event) {
		let x = event.clientX;
		let row = repeatRows[fromRow];
		let delta = Math.round((x - startX) / distanceBetweenPoints);
		console.log('delta', delta);

		if (delta === 0 || fromColumn + delta < 0 || fromColumn + delta > length - 2) {
			return;
		}

		let id = row[fromColumn];

		if (delta !== 0) {
			while (delta !== 0 && encompassUnitInRowAbove(id, fromColumn, delta, fromRow)) {
				let change = Math.sign(delta);
				id = modifyRepeat(id, fromRow, change, fromColumn);
				$$invalidate(6, fromColumn += change);
				startX += distanceBetweenPoints * change;
				delta -= change;
			}

			postChangeCheck();
			$$invalidate(2, repeatRows[fromRow] = row, repeatRows);
			$$invalidate(2, repeatRows = [...repeatRows]);
		}
	}

	function isEndpoint(position, rowNum) {
		let row = repeatRows[rowNum];
		let id = row[position];

		if (row[position - 1] !== id || row[position + 1] !== id || position === 0 || position === row.length - 1) {
			return true;
		}

		return false;
	}

	function encompassUnitInRowAbove(id, fromColumn, delta, fromRow) {
		if (fromRow === 0) {
			return true;
		}

		let row = repeatRows[fromRow - 1];
		let currentRow = repeatRows[fromRow];
		let repeats = getRepeats(row);
		let target = fromColumn + delta;

		if (target === 0) {
			return true;
		}

		if (row[target] === 0 || target === row.length - 1) {
			return true;
		}

		if (isEndpoint(target, fromRow) && currentRow[target] === id) {
			return true;
		}

		for (let rep of repeats) {
			if (currentRow[target] !== id || id === 0) {
				if (delta > 0 && target === rep.to) {
					return true;
				}

				if (delta < 0 && target === rep.from) {
					return true;
				}
			} else {
				if (delta > 0 && target === rep.from) {
					return true;
				}

				if (delta < 0 && target === rep.to) {
					return true;
				}
			}
		}

		return false;
	}

	function getIds(row) {
		return new Set(repeatRows[row].filter(a => a !== 0));
	}

	function generateId(row) {
		return repeatRows[row].reduce((a, b) => Math.max(a, b)) + 1;
	}

	function modifyRepeat(id, rowNumber, delta, position) {
		let row = repeatRows[rowNumber];

		if (id === 0) {
			id = generateId(fromRow);
			row[position] = id;

			if (repeatTimesPerRow[fromRow] === undefined) {
				$$invalidate(1, repeatTimesPerRow[fromRow] = [], repeatTimesPerRow);
			}

			$$invalidate(1, repeatTimesPerRow[fromRow][id] = 1, repeatTimesPerRow);
		}

		if (row[position + delta] !== id) {
			row[position + delta] = id;

			for (let i = rowNumber + 1; i < repeatRows.length; i++) {
				let subRow = repeatRows[i];

				if (subRow[position] !== subRow[position + delta]) {
					subRow[position + delta] = subRow[position];
				}
			}
		} else {
			row[position] = 0;

			for (let i = rowNumber + 1; i < repeatRows.length; i++) {
				let subRow = repeatRows[i];

				if (subRow[position] !== subRow[position - delta]) {
					subRow[position] = 0;
				}
			}
		}

		return id;
	}

	function postChangeCheck() {
		for (let row of repeatRows) {
			// Remove 1-length repeats
			for (let i = 1; i < row.length - 1; i++) {
				let pre = row[i - 1];
				let id = row[i];
				let post = row[i + 1];

				if (pre !== id && post !== id) {
					row[i] = 0;
				}
			}

			//Remove 1-length from both ends
			if (row[0] !== row[1]) {
				row[0] = 0;
			}

			if (row[row.length - 1] !== row[row.length - 2]) {
				row[row.length - 1] = 0;
			}
		}

		let lastRow = repeatRows[repeatRows.length - 1];

		//If last row has repeats, add row with zeroes
		if (lastRow.some(v => v !== 0)) {
			repeatRows.push(Array(length - 1).fill(0));
			repeatTimesPerRow.push([]);
		} //If two last rows are all zeroes, remove one.

		if (repeatRows.length > 1) {
			let secondToLastRow = repeatRows[repeatRows.length - 2];

			if (lastRow.every(v => v === 0) && secondToLastRow.every(v => v === 0) || secondToLastRow[0] !== 0 && secondToLastRow.every(v => v === secondToLastRow[0])) {
				$$invalidate(2, repeatRows.length = repeatRows.length - 1, repeatRows);
			}
		}
	}

	function getPositionOfNumberInput(id, row) {
		let elms = elements[row];
		let buttons = elms.querySelectorAll('button');
		let first;
		let last;

		for (let i = 0; i < buttons.length; i++) {
			let item = Number(buttons[i].getAttribute('data-id'));

			if (first === undefined && item === id) {
				first = i;
			}

			if (first !== undefined && item !== id) {
				last = i - 1;
				break;
			}
		}

		if (last === undefined && Number(buttons[buttons.length - 1].getAttribute('data-id')) === id) {
			last = buttons.length - 1;
		}

		let firstRect = buttons[first].getBoundingClientRect();
		let lastRect = buttons[last].getBoundingClientRect();
		let parentRect = elms.getBoundingClientRect();

		return [
			(firstRect.x + lastRect.x) / 2.0 - parentRect.x - firstRect.width / 2,
			(firstRect.y + lastRect.y) / 2.0 - parentRect.y - 2
		];
	}

	afterUpdate(() => {
		elements.filter(e => e !== null).forEach(element => {
			let inputs = element.querySelectorAll('.times-input');

			inputs.forEach(elm => {
				let pos = getPositionOfNumberInput(Number(elm.getAttribute('data-id')), Number(elm.getAttribute('data-row')));
				elm.style.left = pos[0] + 'px';
				elm.style.top = pos[1] + 'px';
			});
		});

		if (distanceBetweenPoints === undefined && elements !== undefined && elements[0] !== undefined) {
			let buttons = elements[0].querySelectorAll('button');

			if (buttons[0] !== undefined && buttons[1] !== undefined) {
				let a = buttons[0].getBoundingClientRect();
				let b = buttons[1].getBoundingClientRect();
				distanceBetweenPoints = b.x - a.x;
			}
		}
	});

	function setRepeatTimes(id, row, value) {
		$$invalidate(1, repeatTimesPerRow[row][id] = value, repeatTimesPerRow);
		$$invalidate(1, repeatTimesPerRow = [...repeatTimesPerRow]);
	}

	const writable_props = ['length', 'repeats'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Repeats> was created with unknown prop '${key}'`);
	});

	const pointerdown_handler = (row, column, event) => dragStart(event, row, column - 1);
	const input_handler = (id, row, e) => setRepeatTimes(id, row, Number(e.target.value));

	function tr_binding($$value, row) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			elements[row] = $$value;
			$$invalidate(4, elements);
		});
	}

	$$self.$$set = $$props => {
		if ('length' in $$props) $$invalidate(0, length = $$props.length);
		if ('repeats' in $$props) $$invalidate(11, repeats = $$props.repeats);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		length,
		repeats,
		elements,
		activeElement,
		insertColumn,
		removeColumn,
		distanceBetweenPoints,
		fromRow,
		fromColumn,
		startX,
		startClientX,
		elementActive,
		dragStart,
		lastX,
		lastFromRow,
		lastFromColumn,
		dragEnd,
		dragMove,
		isEndpoint,
		encompassUnitInRowAbove,
		getRepeats,
		getIds,
		generateId,
		modifyRepeat,
		postChangeCheck,
		getPositionOfNumberInput,
		setRepeatTimes,
		repeatTimesPerRow,
		repeatRows,
		amountOfNumberInputs,
		selectedRepeat
	});

	$$self.$inject_state = $$props => {
		if ('length' in $$props) $$invalidate(0, length = $$props.length);
		if ('repeats' in $$props) $$invalidate(11, repeats = $$props.repeats);
		if ('elements' in $$props) $$invalidate(4, elements = $$props.elements);
		if ('activeElement' in $$props) activeElement = $$props.activeElement;
		if ('distanceBetweenPoints' in $$props) distanceBetweenPoints = $$props.distanceBetweenPoints;
		if ('fromRow' in $$props) $$invalidate(5, fromRow = $$props.fromRow);
		if ('fromColumn' in $$props) $$invalidate(6, fromColumn = $$props.fromColumn);
		if ('startX' in $$props) startX = $$props.startX;
		if ('startClientX' in $$props) startClientX = $$props.startClientX;
		if ('elementActive' in $$props) $$invalidate(7, elementActive = $$props.elementActive);
		if ('lastX' in $$props) lastX = $$props.lastX;
		if ('lastFromRow' in $$props) lastFromRow = $$props.lastFromRow;
		if ('lastFromColumn' in $$props) lastFromColumn = $$props.lastFromColumn;
		if ('repeatTimesPerRow' in $$props) $$invalidate(1, repeatTimesPerRow = $$props.repeatTimesPerRow);
		if ('repeatRows' in $$props) $$invalidate(2, repeatRows = $$props.repeatRows);
		if ('amountOfNumberInputs' in $$props) $$invalidate(3, amountOfNumberInputs = $$props.amountOfNumberInputs);
		if ('selectedRepeat' in $$props) $$invalidate(8, selectedRepeat = $$props.selectedRepeat);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*repeatRows, amountOfNumberInputs*/ 12) {
			{
				$$invalidate(3, amountOfNumberInputs = []);

				for (let i = 0; i < repeatRows.length; i++) {
					let ids = getIds(i);
					$$invalidate(3, amountOfNumberInputs[i] = [], amountOfNumberInputs);

					ids.forEach(id => {
						amountOfNumberInputs[i].push(id);
					});
				}

				$$invalidate(3, amountOfNumberInputs = [...amountOfNumberInputs]);
			}
		}

		if ($$self.$$.dirty[0] & /*repeatRows, repeatTimesPerRow*/ 6) {
			{
				$$invalidate(11, repeats = []);

				for (let i = 0; i < repeatRows.length; i++) {
					let rep = getRepeats(repeatRows[i], repeatTimesPerRow[i]);

					if (rep.length > 0) {
						$$invalidate(11, repeats[i] = rep, repeats);
					}
				}
			}
		}
	};

	$$invalidate(2, repeatRows = [[]]);
	$$invalidate(1, repeatTimesPerRow = []);
	$$invalidate(8, selectedRepeat = undefined);
	$$invalidate(3, amountOfNumberInputs = []);

	return [
		length,
		repeatTimesPerRow,
		repeatRows,
		amountOfNumberInputs,
		elements,
		fromRow,
		fromColumn,
		elementActive,
		selectedRepeat,
		dragStart,
		setRepeatTimes,
		repeats,
		insertColumn,
		removeColumn,
		pointerdown_handler,
		input_handler,
		tr_binding
	];
}

class Repeats extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(
			this,
			options,
			instance$f,
			create_fragment$f,
			not_equal,
			{
				length: 0,
				repeats: 11,
				insertColumn: 12,
				removeColumn: 13
			},
			null,
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Repeats",
			options,
			id: create_fragment$f.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*length*/ ctx[0] === undefined && !('length' in props)) {
			console_1$2.warn("<Repeats> was created without expected prop 'length'");
		}
	}

	get length() {
		throw new Error("<Repeats>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set length(value) {
		throw new Error("<Repeats>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get repeats() {
		throw new Error("<Repeats>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set repeats(value) {
		throw new Error("<Repeats>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get insertColumn() {
		return this.$$.ctx[12];
	}

	set insertColumn(value) {
		throw new Error("<Repeats>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get removeColumn() {
		return this.$$.ctx[13];
	}

	set removeColumn(value) {
		throw new Error("<Repeats>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/components/YarnFillTable/YarnDropDown.svelte generated by Svelte v3.43.0 */
const file$e = "src/components/YarnFillTable/YarnDropDown.svelte";

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	return child_ctx;
}

// (15:4) {#each $draft.yarn as yarn}
function create_each_block$5(ctx) {
	let option;
	let t0_value = /*yarn*/ ctx[5].name + "";
	let t0;
	let t1;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t0 = text(t0_value);
			t1 = space();
			option.__value = option_value_value = /*yarn*/ ctx[5].id;
			option.value = option.__value;
			add_location(option, file$e, 15, 6, 473);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t0);
			append_dev(option, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$draft*/ 2 && t0_value !== (t0_value = /*yarn*/ ctx[5].name + "")) set_data_dev(t0, t0_value);

			if (dirty & /*$draft*/ 2 && option_value_value !== (option_value_value = /*yarn*/ ctx[5].id)) {
				prop_dev(option, "__value", option_value_value);
				option.value = option.__value;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$5.name,
		type: "each",
		source: "(15:4) {#each $draft.yarn as yarn}",
		ctx
	});

	return block;
}

// (21:2) {#if selectedYarn !== -1}
function create_if_block$8(ctx) {
	let div;
	let div_style_value;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", "color-marker svelte-jxdqux");
			attr_dev(div, "style", div_style_value = `background-color: ${/*color*/ ctx[2]}`);
			add_location(div, file$e, 21, 4, 590);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*color*/ 4 && div_style_value !== (div_style_value = `background-color: ${/*color*/ ctx[2]}`)) {
				attr_dev(div, "style", div_style_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$8.name,
		type: "if",
		source: "(21:2) {#if selectedYarn !== -1}",
		ctx
	});

	return block;
}

function create_fragment$e(ctx) {
	let div;
	let select;
	let option;
	let t1;
	let mounted;
	let dispose;
	let each_value = /*$draft*/ ctx[1].yarn;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
	}

	let if_block = /*selectedYarn*/ ctx[0] !== -1 && create_if_block$8(ctx);

	const block = {
		c: function create() {
			div = element("div");
			select = element("select");
			option = element("option");
			option.textContent = "Add new yarn";

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			if (if_block) if_block.c();
			option.__value = -1;
			option.value = option.__value;
			add_location(option, file$e, 13, 4, 394);
			attr_dev(select, "class", "svelte-jxdqux");
			if (/*selectedYarn*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
			add_location(select, file$e, 12, 2, 346);
			attr_dev(div, "class", "color-dropdown svelte-jxdqux");
			add_location(div, file$e, 11, 0, 315);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, select);
			append_dev(select, option);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*selectedYarn*/ ctx[0]);
			append_dev(div, t1);
			if (if_block) if_block.m(div, null);

			if (!mounted) {
				dispose = [
					listen_dev(select, "change", /*select_change_handler*/ ctx[4]),
					listen_dev(select, "input", /*input_handler*/ ctx[3], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$draft*/ 2) {
				each_value = /*$draft*/ ctx[1].yarn;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*selectedYarn, $draft*/ 3) {
				select_option(select, /*selectedYarn*/ ctx[0]);
			}

			if (/*selectedYarn*/ ctx[0] !== -1) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$8(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$e($$self, $$props, $$invalidate) {
	let $draft;
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(1, $draft = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('YarnDropDown', slots, []);
	let { selectedYarn = -1 } = $$props;
	let color;
	const writable_props = ['selectedYarn'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<YarnDropDown> was created with unknown prop '${key}'`);
	});

	function input_handler(event) {
		bubble.call(this, $$self, event);
	}

	function select_change_handler() {
		selectedYarn = select_value(this);
		$$invalidate(0, selectedYarn);
	}

	$$self.$$set = $$props => {
		if ('selectedYarn' in $$props) $$invalidate(0, selectedYarn = $$props.selectedYarn);
	};

	$$self.$capture_state = () => ({
		draft: draft$1,
		tinycolor,
		selectedYarn,
		color,
		$draft
	});

	$$self.$inject_state = $$props => {
		if ('selectedYarn' in $$props) $$invalidate(0, selectedYarn = $$props.selectedYarn);
		if ('color' in $$props) $$invalidate(2, color = $$props.color);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*selectedYarn, $draft*/ 3) {
			if (Number(selectedYarn) !== -1) {
				let ratio = $draft.yarn.find(a => a.id === Number(selectedYarn)).color;
				$$invalidate(2, color = tinycolor.fromRatio(ratio).toHexString());
			}
		}
	};

	return [selectedYarn, $draft, color, input_handler, select_change_handler];
}

class YarnDropDown extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$e, create_fragment$e, not_equal, { selectedYarn: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "YarnDropDown",
			options,
			id: create_fragment$e.name
		});
	}

	get selectedYarn() {
		throw new Error("<YarnDropDown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set selectedYarn(value) {
		throw new Error("<YarnDropDown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/components/YarnFillTable/YarnFillTable.svelte generated by Svelte v3.43.0 */
const file$d = "src/components/YarnFillTable/YarnFillTable.svelte";

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[24] = list[i];
	child_ctx[26] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[24] = list[i];
	child_ctx[28] = i;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[24] = list[i];
	child_ctx[28] = i;
	return child_ctx;
}

// (130:6) {#if data.length > 0}
function create_if_block$7(ctx) {
	let tr;
	let each_value_2 = { length: /*data*/ ctx[0][0].length };
	validate_each_argument(each_value_2);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	const block = {
		c: function create() {
			tr = element("tr");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(tr, "class", "button-row svelte-b72vx4");
			add_location(tr, file$d, 130, 8, 3215);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tr, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*insertColumn, data*/ 129) {
				each_value_2 = { length: /*data*/ ctx[0][0].length };
				validate_each_argument(each_value_2);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tr, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(130:6) {#if data.length > 0}",
		ctx
	});

	return block;
}

// (132:10) {#each { length: data[0].length } as _, column}
function create_each_block_2(ctx) {
	let td;
	let button;
	let t1;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[11](/*column*/ ctx[28]);
	}

	const block = {
		c: function create() {
			td = element("td");
			button = element("button");
			button.textContent = "↓";
			t1 = space();
			attr_dev(button, "class", "add-button svelte-b72vx4");
			add_location(button, file$d, 133, 14, 3328);
			attr_dev(td, "class", "svelte-b72vx4");
			add_location(td, file$d, 132, 12, 3309);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td, anchor);
			append_dev(td, button);
			append_dev(td, t1);

			if (!mounted) {
				dispose = listen_dev(button, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(td);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(132:10) {#each { length: data[0].length } as _, column}",
		ctx
	});

	return block;
}

// (156:10) {#each { length: data[row].length - 1 } as _, column}
function create_each_block_1(ctx) {
	let td;
	let input;
	let input_value_value;
	let mounted;
	let dispose;

	function focus_handler() {
		return /*focus_handler*/ ctx[13](/*column*/ ctx[28]);
	}

	function blur_handler() {
		return /*blur_handler*/ ctx[14](/*column*/ ctx[28]);
	}

	function input_handler_1(...args) {
		return /*input_handler_1*/ ctx[15](/*column*/ ctx[28], /*row*/ ctx[26], ...args);
	}

	const block = {
		c: function create() {
			td = element("td");
			input = element("input");
			attr_dev(input, "size", "4");
			attr_dev(input, "type", "number");

			input.value = input_value_value = /*data*/ ctx[0][/*row*/ ctx[26]][/*column*/ ctx[28] + 1] !== undefined
			? /*data*/ ctx[0][/*row*/ ctx[26]][/*column*/ ctx[28] + 1]
			: '';

			attr_dev(input, "class", "svelte-b72vx4");
			add_location(input, file$d, 157, 14, 3991);
			attr_dev(td, "class", "svelte-b72vx4");
			add_location(td, file$d, 156, 12, 3972);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td, anchor);
			append_dev(td, input);

			if (!mounted) {
				dispose = [
					listen_dev(input, "focus", focus_handler, false, false, false),
					listen_dev(input, "blur", blur_handler, false, false, false),
					listen_dev(input, "input", input_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*data*/ 1 && input_value_value !== (input_value_value = /*data*/ ctx[0][/*row*/ ctx[26]][/*column*/ ctx[28] + 1] !== undefined
			? /*data*/ ctx[0][/*row*/ ctx[26]][/*column*/ ctx[28] + 1]
			: '')) {
				prop_dev(input, "value", input_value_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(td);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(156:10) {#each { length: data[row].length - 1 } as _, column}",
		ctx
	});

	return block;
}

// (142:6) {#each data as _, row}
function create_each_block$4(ctx) {
	let tr;
	let td;
	let yarndropdown;
	let t;
	let current;

	function input_handler(...args) {
		return /*input_handler*/ ctx[12](/*row*/ ctx[26], ...args);
	}

	yarndropdown = new YarnDropDown({
			props: {
				selectedYarn: /*data*/ ctx[0][/*row*/ ctx[26]][0]
			},
			$$inline: true
		});

	yarndropdown.$on("input", input_handler);

	let each_value_1 = {
		length: /*data*/ ctx[0][/*row*/ ctx[26]].length - 1
	};

	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			tr = element("tr");
			td = element("td");
			create_component(yarndropdown.$$.fragment);
			t = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(td, "class", "svelte-b72vx4");
			add_location(td, file$d, 143, 10, 3569);
			attr_dev(tr, "class", "svelte-b72vx4");
			add_location(tr, file$d, 142, 8, 3554);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td);
			mount_component(yarndropdown, td, null);
			append_dev(tr, t);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tr, null);
			}

			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const yarndropdown_changes = {};
			if (dirty & /*data*/ 1) yarndropdown_changes.selectedYarn = /*data*/ ctx[0][/*row*/ ctx[26]][0];
			yarndropdown.$set(yarndropdown_changes);

			if (dirty & /*data, undefined, onFocus, onBlur, setValue, Number*/ 833) {
				each_value_1 = {
					length: /*data*/ ctx[0][/*row*/ ctx[26]].length - 1
				};

				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tr, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(yarndropdown.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(yarndropdown.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_component(yarndropdown);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$4.name,
		type: "each",
		source: "(142:6) {#each data as _, row}",
		ctx
	});

	return block;
}

function create_fragment$d(ctx) {
	let div;
	let table;
	let tbody;
	let t0;
	let t1;
	let tr;
	let td;
	let yarndropdown;
	let updating_selectedYarn;
	let t2;
	let repeats_1;
	let updating_length;
	let updating_repeats;
	let current;
	let if_block = /*data*/ ctx[0].length > 0 && create_if_block$7(ctx);
	let each_value = /*data*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	function yarndropdown_selectedYarn_binding(value) {
		/*yarndropdown_selectedYarn_binding*/ ctx[16](value);
	}

	let yarndropdown_props = {};

	if (/*yarn*/ ctx[1] !== void 0) {
		yarndropdown_props.selectedYarn = /*yarn*/ ctx[1];
	}

	yarndropdown = new YarnDropDown({
			props: yarndropdown_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(yarndropdown, 'selectedYarn', yarndropdown_selectedYarn_binding));

	function repeats_1_length_binding(value) {
		/*repeats_1_length_binding*/ ctx[18](value);
	}

	function repeats_1_repeats_binding(value) {
		/*repeats_1_repeats_binding*/ ctx[19](value);
	}

	let repeats_1_props = {};

	if (/*length*/ ctx[4] !== void 0) {
		repeats_1_props.length = /*length*/ ctx[4];
	}

	if (/*repeats*/ ctx[2] !== void 0) {
		repeats_1_props.repeats = /*repeats*/ ctx[2];
	}

	repeats_1 = new Repeats({ props: repeats_1_props, $$inline: true });
	/*repeats_1_binding*/ ctx[17](repeats_1);
	binding_callbacks.push(() => bind(repeats_1, 'length', repeats_1_length_binding));
	binding_callbacks.push(() => bind(repeats_1, 'repeats', repeats_1_repeats_binding));

	const block = {
		c: function create() {
			div = element("div");
			table = element("table");
			tbody = element("tbody");
			if (if_block) if_block.c();
			t0 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			tr = element("tr");
			td = element("td");
			create_component(yarndropdown.$$.fragment);
			t2 = space();
			create_component(repeats_1.$$.fragment);
			attr_dev(td, "class", "svelte-b72vx4");
			add_location(td, file$d, 173, 8, 4484);
			attr_dev(tr, "class", "svelte-b72vx4");
			add_location(tr, file$d, 172, 6, 4471);
			add_location(tbody, file$d, 128, 4, 3171);
			attr_dev(table, "class", "svelte-b72vx4");
			add_location(table, file$d, 127, 2, 3159);
			attr_dev(div, "class", "top svelte-b72vx4");
			add_location(div, file$d, 126, 0, 3139);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, table);
			append_dev(table, tbody);
			if (if_block) if_block.m(tbody, null);
			append_dev(tbody, t0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tbody, null);
			}

			append_dev(tbody, t1);
			append_dev(tbody, tr);
			append_dev(tr, td);
			mount_component(yarndropdown, td, null);
			append_dev(tbody, t2);
			mount_component(repeats_1, tbody, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*data*/ ctx[0].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$7(ctx);
					if_block.c();
					if_block.m(tbody, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*data, undefined, onFocus, onBlur, setValue, Number, deleteRow*/ 865) {
				each_value = /*data*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(tbody, t1);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			const yarndropdown_changes = {};

			if (!updating_selectedYarn && dirty & /*yarn*/ 2) {
				updating_selectedYarn = true;
				yarndropdown_changes.selectedYarn = /*yarn*/ ctx[1];
				add_flush_callback(() => updating_selectedYarn = false);
			}

			yarndropdown.$set(yarndropdown_changes);
			const repeats_1_changes = {};

			if (!updating_length && dirty & /*length*/ 16) {
				updating_length = true;
				repeats_1_changes.length = /*length*/ ctx[4];
				add_flush_callback(() => updating_length = false);
			}

			if (!updating_repeats && dirty & /*repeats*/ 4) {
				updating_repeats = true;
				repeats_1_changes.repeats = /*repeats*/ ctx[2];
				add_flush_callback(() => updating_repeats = false);
			}

			repeats_1.$set(repeats_1_changes);
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(yarndropdown.$$.fragment, local);
			transition_in(repeats_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(yarndropdown.$$.fragment, local);
			transition_out(repeats_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			destroy_each(each_blocks, detaching);
			destroy_component(yarndropdown);
			/*repeats_1_binding*/ ctx[17](null);
			destroy_component(repeats_1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$d($$self, $$props, $$invalidate) {
	let length;
	let yarn;
	let data;
	let $draft;
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(21, $draft = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('YarnFillTable', slots, []);
	let repeats = [];

	onMount(() => {
		$$invalidate(0, data = $draft.yarn.map(y => [y.id]));
	});

	function getTableThreads() {
		let threads = [];

		if (data !== undefined && data.length > 0) {
			for (let i = 1; i < data[0].length; i++) {
				for (let j = 0; j < data.length; j++) {
					if (data[j][i] !== undefined && threads[i - 1] === undefined) {
						threads[i - 1] = { yarn: data[j][0], times: data[j][i] };
					}
				}
			}
		}

		return threads;
	}

	function getLength() {
		return length;
	}

	let repeatComponent;

	function deleteRow(row) {
		$$invalidate(0, data = data.filter((v, i) => i !== row));
	}

	function setValue(column, row, value) {
		for (let i = 0; i < data.length; i++) {
			$$invalidate(0, data[i][column] = undefined, data);
		}

		$$invalidate(0, data[row][column] = value, data);
		$$invalidate(0, data = [...data]);
	}

	function insertColumn(index) {
		repeatComponent.insertColumn(index - 1);
		data.forEach(row => row.splice(index, 0, undefined));
		$$invalidate(0, data = [...data]);
	}

	function getThreads() {
		let tableThreads = getTableThreads();
		let threads = [...tableThreads];

		for (let i = 0; i < repeats.length; i++) {
			let repeatRow = repeats[i];

			for (let j = repeatRow.length - 1; j >= 0; j--) {
				let rep = repeatRow[j];
				let part = threads.slice(rep.from, rep.to + 1);

				for (let k = 0; k < rep.times - 1; k++) {
					threads.splice(rep.from, 0, ...part);
				}

				let change = (rep.to - rep.from + 1) * (rep.times - 1);

				// Adjust lower repeats after changed thread list length
				for (let k = i + 1; k < repeats.length; k++) {
					let lowerRow = repeats[k];

					for (let l = 0; l < lowerRow.length; l++) {
						let rep1 = lowerRow[l];

						if (rep1.to >= rep.to) {
							rep1.to += change;
						}
					}
				}
			}
		}

		let ret = [];

		threads.forEach(th => {
			for (let i = 0; i < th.times; i++) {
				ret.push(th.yarn);
			}
		});

		ret.reverse();
		return ret;
	}

	function onFocus(columnIndex) {
		if (lastBlur !== undefined && columnIndex !== lastBlur) {
			let column = lastBlur;
			let removeColumn = true;

			for (let i = 0; i < data.length; i++) {
				if (data[i][column] !== undefined && data[i][column] !== '' && data[i][column] !== 0) {
					removeColumn = false;
					break;
				}
			}

			if (removeColumn) {
				data.forEach(row => row.splice(column, 1));
				repeatComponent.removeColumn(column - 1);
				$$invalidate(0, data = [...data]);
			}
		}

		changed = true;
	}

	let lastBlur;

	function onBlur(columnIndex) {
		lastBlur = columnIndex;
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<YarnFillTable> was created with unknown prop '${key}'`);
	});

	const click_handler = column => insertColumn(column + 1);

	const input_handler = (row, e) => {
		if (e.target.value === '-1') {
			deleteRow(row);
		} else {
			$$invalidate(0, data[row][0] = e.target.value, data);
		}
	};

	const focus_handler = column => onFocus(column + 1);
	const blur_handler = column => onBlur(column + 1);
	const input_handler_1 = (column, row, e) => setValue(column + 1, row, Number(e.target.value));

	function yarndropdown_selectedYarn_binding(value) {
		yarn = value;
		($$invalidate(1, yarn), $$invalidate(0, data));
	}

	function repeats_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			repeatComponent = $$value;
			$$invalidate(3, repeatComponent);
		});
	}

	function repeats_1_length_binding(value) {
		length = value;
		(($$invalidate(4, length), $$invalidate(0, data)), $$invalidate(1, yarn));
	}

	function repeats_1_repeats_binding(value) {
		repeats = value;
		$$invalidate(2, repeats);
	}

	$$self.$capture_state = () => ({
		onMount,
		Repeats,
		draft: draft$1,
		YarnDropDown,
		repeats,
		getTableThreads,
		getLength,
		repeatComponent,
		deleteRow,
		setValue,
		insertColumn,
		getThreads,
		onFocus,
		lastBlur,
		onBlur,
		data,
		length,
		yarn,
		$draft
	});

	$$self.$inject_state = $$props => {
		if ('repeats' in $$props) $$invalidate(2, repeats = $$props.repeats);
		if ('repeatComponent' in $$props) $$invalidate(3, repeatComponent = $$props.repeatComponent);
		if ('lastBlur' in $$props) lastBlur = $$props.lastBlur;
		if ('data' in $$props) $$invalidate(0, data = $$props.data);
		if ('length' in $$props) $$invalidate(4, length = $$props.length);
		if ('yarn' in $$props) $$invalidate(1, yarn = $$props.yarn);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*yarn, data*/ 3) {
			if (yarn !== -1) {
				$$invalidate(0, data = [...data, [yarn, ...Array(getLength() - 1)]]);
				$$invalidate(1, yarn = -1);
			}
		}

		if ($$self.$$.dirty & /*data*/ 1) {
			if (data[0] !== undefined && data[0].length > 0) {
				$$invalidate(4, length = data[0].length);
			}
		}
	};

	$$invalidate(4, length = 1);
	$$invalidate(0, data = []);
	$$invalidate(1, yarn = -1);

	return [
		data,
		yarn,
		repeats,
		repeatComponent,
		length,
		deleteRow,
		setValue,
		insertColumn,
		onFocus,
		onBlur,
		getThreads,
		click_handler,
		input_handler,
		focus_handler,
		blur_handler,
		input_handler_1,
		yarndropdown_selectedYarn_binding,
		repeats_1_binding,
		repeats_1_length_binding,
		repeats_1_repeats_binding
	];
}

class YarnFillTable extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$d, create_fragment$d, not_equal, { getThreads: 10 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "YarnFillTable",
			options,
			id: create_fragment$d.name
		});
	}

	get getThreads() {
		return this.$$.ctx[10];
	}

	set getThreads(value) {
		throw new Error("<YarnFillTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/pages/Editor/Sidebar/Subcomponents/WarpWeftFill.svelte generated by Svelte v3.43.0 */
const file$c = "src/pages/Editor/Sidebar/Subcomponents/WarpWeftFill.svelte";

function create_fragment$c(ctx) {
	let div;
	let yarnfilltable;
	let t0;
	let checkboxinput0;
	let updating_checked;
	let t1;
	let checkboxinput1;
	let updating_checked_1;
	let t2;
	let button;
	let t3_value = /*$t*/ ctx[3]('page.pattern_fill.apply') + "";
	let t3;
	let current;
	let mounted;
	let dispose;
	let yarnfilltable_props = {};

	yarnfilltable = new YarnFillTable({
			props: yarnfilltable_props,
			$$inline: true
		});

	/*yarnfilltable_binding*/ ctx[5](yarnfilltable);

	function checkboxinput0_checked_binding(value) {
		/*checkboxinput0_checked_binding*/ ctx[6](value);
	}

	let checkboxinput0_props = { label: "Apply on warp" };

	if (/*useWarp*/ ctx[1] !== void 0) {
		checkboxinput0_props.checked = /*useWarp*/ ctx[1];
	}

	checkboxinput0 = new CheckboxInput({
			props: checkboxinput0_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(checkboxinput0, 'checked', checkboxinput0_checked_binding));

	function checkboxinput1_checked_binding(value) {
		/*checkboxinput1_checked_binding*/ ctx[7](value);
	}

	let checkboxinput1_props = { label: "Apply on weft" };

	if (/*useWeft*/ ctx[2] !== void 0) {
		checkboxinput1_props.checked = /*useWeft*/ ctx[2];
	}

	checkboxinput1 = new CheckboxInput({
			props: checkboxinput1_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(checkboxinput1, 'checked', checkboxinput1_checked_binding));

	const block = {
		c: function create() {
			div = element("div");
			create_component(yarnfilltable.$$.fragment);
			t0 = space();
			create_component(checkboxinput0.$$.fragment);
			t1 = space();
			create_component(checkboxinput1.$$.fragment);
			t2 = space();
			button = element("button");
			t3 = text(t3_value);
			add_location(div, file$c, 26, 0, 674);
			add_location(button, file$c, 31, 0, 863);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(yarnfilltable, div, null);
			append_dev(div, t0);
			mount_component(checkboxinput0, div, null);
			append_dev(div, t1);
			mount_component(checkboxinput1, div, null);
			insert_dev(target, t2, anchor);
			insert_dev(target, button, anchor);
			append_dev(button, t3);
			current = true;

			if (!mounted) {
				dispose = listen_dev(button, "click", /*apply*/ ctx[4], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			const yarnfilltable_changes = {};
			yarnfilltable.$set(yarnfilltable_changes);
			const checkboxinput0_changes = {};

			if (!updating_checked && dirty & /*useWarp*/ 2) {
				updating_checked = true;
				checkboxinput0_changes.checked = /*useWarp*/ ctx[1];
				add_flush_callback(() => updating_checked = false);
			}

			checkboxinput0.$set(checkboxinput0_changes);
			const checkboxinput1_changes = {};

			if (!updating_checked_1 && dirty & /*useWeft*/ 4) {
				updating_checked_1 = true;
				checkboxinput1_changes.checked = /*useWeft*/ ctx[2];
				add_flush_callback(() => updating_checked_1 = false);
			}

			checkboxinput1.$set(checkboxinput1_changes);
			if ((!current || dirty & /*$t*/ 8) && t3_value !== (t3_value = /*$t*/ ctx[3]('page.pattern_fill.apply') + "")) set_data_dev(t3, t3_value);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(yarnfilltable.$$.fragment, local);
			transition_in(checkboxinput0.$$.fragment, local);
			transition_in(checkboxinput1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(yarnfilltable.$$.fragment, local);
			transition_out(checkboxinput0.$$.fragment, local);
			transition_out(checkboxinput1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			/*yarnfilltable_binding*/ ctx[5](null);
			destroy_component(yarnfilltable);
			destroy_component(checkboxinput0);
			destroy_component(checkboxinput1);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let $t;
	validate_store($format, 't');
	component_subscribe($$self, $format, $$value => $$invalidate(3, $t = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('WarpWeftFill', slots, []);
	let yarnFillTable;
	let useWarp;
	let useWeft;

	function apply() {
		let threads = yarnFillTable.getThreads();

		if (useWarp || useWeft) {
			draft$1.update(temp => {
				if (useWeft) {
					applyColor(temp, threads, 'weft');
				}

				if (useWarp) {
					applyColor(temp, threads, 'warp');
				}
			});
		}
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WarpWeftFill> was created with unknown prop '${key}'`);
	});

	function yarnfilltable_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			yarnFillTable = $$value;
			$$invalidate(0, yarnFillTable);
		});
	}

	function checkboxinput0_checked_binding(value) {
		useWarp = value;
		$$invalidate(1, useWarp);
	}

	function checkboxinput1_checked_binding(value) {
		useWeft = value;
		$$invalidate(2, useWeft);
	}

	$$self.$capture_state = () => ({
		t: $format,
		draft: draft$1,
		draftUtil,
		YarnFillTable,
		CheckboxInput,
		yarnFillTable,
		useWarp,
		useWeft,
		apply,
		$t
	});

	$$self.$inject_state = $$props => {
		if ('yarnFillTable' in $$props) $$invalidate(0, yarnFillTable = $$props.yarnFillTable);
		if ('useWarp' in $$props) $$invalidate(1, useWarp = $$props.useWarp);
		if ('useWeft' in $$props) $$invalidate(2, useWeft = $$props.useWeft);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		yarnFillTable,
		useWarp,
		useWeft,
		$t,
		apply,
		yarnfilltable_binding,
		checkboxinput0_checked_binding,
		checkboxinput1_checked_binding
	];
}

class WarpWeftFill extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$c, create_fragment$c, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "WarpWeftFill",
			options,
			id: create_fragment$c.name
		});
	}
}

var Subcomponents = [
  {
    icon: ScarfIcon,
    name: 'weave_settings',
    component: WeaveSettings,
  },
  {
    icon: YarnIcon,
    name: 'yarn_settings',
    component: YarnSettings,
  },
  {
    icon: PatternBucket,
    name: 'pattern_fill',
    component: PatternFill,
  },
  {
    icon: RepetitionIcon,
    name: 'repetition',
    component: WarpWeftFill,
  },
  {
    icon: Repeat$1,
    name: 'selection',
    component: Repeat,
  },
];

var HelpIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\"  width=\"100\" height=\"100\" viewbox=\"0 0 100 100\"><path d=\"M50 0a50 50 0 1050 50A50 50 0 0050 0zm4 70c0 3-2 5-5 5s-5-2-5-5 1-5 5-5c2 0 5 1 5 5zm7-23l-5 3a7 7 0 00-3 6 4 4 0 01-3 4 4 4 0 01-5-1 4 4 0 010-2 14 14 0 015-12 42 42 0 005-4 5 5 0 001-3c0-3-2-4-5-5-3 0-6 1-8 4a4 4 0 01-4 2c-3 0-5-3-4-6a13 13 0 017-6 22 22 0 019-2 46 46 0 015 1c5 1 9 6 9 11a10 10 0 01-4 10z\"/></svg>\n";

/* src/pages/Editor/Sidebar/Sidebar.svelte generated by Svelte v3.43.0 */

const { console: console_1$1 } = globals;
const file$b = "src/pages/Editor/Sidebar/Sidebar.svelte";

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	child_ctx[13] = i;
	return child_ctx;
}

// (60:2) {#if open}
function create_if_block$6(ctx) {
	let div3;
	let t0;
	let button;
	let span;
	let t2;
	let div0;
	let input;
	let t3;
	let label;
	let t5;
	let div2;
	let a;
	let div1;
	let mounted;
	let dispose;
	let each_value = Subcomponents;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div3 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			button = element("button");
			span = element("span");
			span.textContent = "Save file";
			t2 = space();
			div0 = element("div");
			input = element("input");
			t3 = space();
			label = element("label");
			label.textContent = "Load from file";
			t5 = space();
			div2 = element("div");
			a = element("a");
			div1 = element("div");
			add_location(span, file$b, 70, 8, 1821);
			attr_dev(button, "class", "icon-button save-load svelte-9w9ldr");
			add_location(button, file$b, 69, 6, 1750);
			attr_dev(input, "type", "file");
			attr_dev(input, "name", "upload");
			attr_dev(input, "id", "upload");
			attr_dev(input, "class", "svelte-9w9ldr");
			add_location(input, file$b, 74, 8, 1881);
			attr_dev(label, "class", "icon-button button svelte-9w9ldr");
			attr_dev(label, "for", "upload");
			add_location(label, file$b, 80, 8, 2011);
			attr_dev(div0, "class", "svelte-9w9ldr");
			add_location(div0, file$b, 73, 6, 1867);
			attr_dev(div1, "class", "icon svelte-9w9ldr");
			add_location(div1, file$b, 84, 10, 2161);
			attr_dev(a, "href", "/weaver/help");
			add_location(a, file$b, 83, 8, 2127);
			attr_dev(div2, "class", "help svelte-9w9ldr");
			add_location(div2, file$b, 82, 6, 2100);
			attr_dev(div3, "class", "sidebar svelte-9w9ldr");
			add_location(div3, file$b, 60, 4, 1430);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div3, null);
			}

			append_dev(div3, t0);
			append_dev(div3, button);
			append_dev(button, span);
			append_dev(div3, t2);
			append_dev(div3, div0);
			append_dev(div0, input);
			append_dev(div0, t3);
			append_dev(div0, label);
			append_dev(div3, t5);
			append_dev(div3, div2);
			append_dev(div2, a);
			append_dev(a, div1);
			div1.innerHTML = HelpIcon;
			/*div3_binding*/ ctx[8](div3);

			if (!mounted) {
				dispose = [
					listen_dev(button, "click", /*exportToFile*/ ctx[4], false, false, false),
					listen_dev(input, "input", /*importFromFile*/ ctx[5], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*selectMenu, $t, Subcomponents*/ 12) {
				each_value = Subcomponents;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div3, t0);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			destroy_each(each_blocks, detaching);
			/*div3_binding*/ ctx[8](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(60:2) {#if open}",
		ctx
	});

	return block;
}

// (62:6) {#each Subcomponents as item, i}
function create_each_block$3(ctx) {
	let button;
	let div;
	let raw_value = /*item*/ ctx[11].icon + "";
	let t0;
	let span;
	let t1_value = /*$t*/ ctx[2](`page.${/*item*/ ctx[11].name}.title`) + "";
	let t1;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[7](/*i*/ ctx[13]);
	}

	const block = {
		c: function create() {
			button = element("button");
			div = element("div");
			t0 = space();
			span = element("span");
			t1 = text(t1_value);
			attr_dev(div, "class", "" + (null_to_empty('icon') + " svelte-9w9ldr"));
			add_location(div, file$b, 63, 10, 1589);
			add_location(span, file$b, 66, 10, 1667);
			attr_dev(button, "class", "icon-button svelte-9w9ldr");
			add_location(button, file$b, 62, 8, 1519);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
			append_dev(button, div);
			div.innerHTML = raw_value;
			append_dev(button, t0);
			append_dev(button, span);
			append_dev(span, t1);

			if (!mounted) {
				dispose = listen_dev(button, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*$t*/ 4 && t1_value !== (t1_value = /*$t*/ ctx[2](`page.${/*item*/ ctx[11].name}.title`) + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(62:6) {#each Subcomponents as item, i}",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let div;
	let if_block = /*open*/ ctx[0] && create_if_block$6(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			attr_dev(div, "class", "sidebar-container svelte-9w9ldr");
			add_location(div, file$b, 58, 0, 1381);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*open*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$6(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$b($$self, $$props, $$invalidate) {
	let selectedMenu;
	let $draft;
	let $ui;
	let $t;
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(10, $draft = $$value));
	validate_store(ui$1, 'ui');
	component_subscribe($$self, ui$1, $$value => $$invalidate(6, $ui = $$value));
	validate_store($format, 't');
	component_subscribe($$self, $format, $$value => $$invalidate(2, $t = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Sidebar', slots, []);
	let sidebar;
	let { open = false } = $$props;

	function selectMenu(index) {
		$$invalidate(0, open = false);

		ui$1.update(draft => {
			draft.selectedMenu = draft.selectedMenu === index ? -1 : index;
		});
	}

	function exportToFile() {
		const blob = new Blob([JSON.stringify($draft)], { type: 'text/json' });
		const link = document.createElement('a');
		link.download = 'weave.json';
		link.href = window.URL.createObjectURL(blob);
		link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

		const evt = new MouseEvent('click',
		{
				view: window,
				bubbles: true,
				cancelable: true
			});

		link.dispatchEvent(evt);
	}

	function importFromFile(e) {
		let files = e.target.files;

		if (files.length > 0) {
			let file = files[0];
			let reader = new FileReader();

			reader.onload = readFile => {
				try {
					let newDraft = JSON.parse(readFile.target.result);
					draft$1.set(newDraft);
				} catch(e) {
					console.error(e);
				}
			};

			reader.readAsText(file);
		}
	}

	const writable_props = ['open'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Sidebar> was created with unknown prop '${key}'`);
	});

	const click_handler = i => selectMenu(i);

	function div3_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			sidebar = $$value;
			$$invalidate(1, sidebar);
		});
	}

	$$self.$$set = $$props => {
		if ('open' in $$props) $$invalidate(0, open = $$props.open);
	};

	$$self.$capture_state = () => ({
		t: $format,
		Subcomponents,
		HelpIcon,
		ui: ui$1,
		draft: draft$1,
		sidebar,
		open,
		selectMenu,
		exportToFile,
		importFromFile,
		selectedMenu,
		$draft,
		$ui,
		$t
	});

	$$self.$inject_state = $$props => {
		if ('sidebar' in $$props) $$invalidate(1, sidebar = $$props.sidebar);
		if ('open' in $$props) $$invalidate(0, open = $$props.open);
		if ('selectedMenu' in $$props) selectedMenu = $$props.selectedMenu;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$ui*/ 64) {
			selectedMenu = $ui.selectedMenu;
		}
	};

	return [
		open,
		sidebar,
		$t,
		selectMenu,
		exportToFile,
		importFromFile,
		$ui,
		click_handler,
		div3_binding
	];
}

class Sidebar extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$b, create_fragment$b, not_equal, { open: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Sidebar",
			options,
			id: create_fragment$b.name
		});
	}

	get open() {
		throw new Error("<Sidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set open(value) {
		throw new Error("<Sidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var downArrow = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 140.7 121.9\"><path d=\"M140.1.4H.6l69.8 120.8z\" /></svg>\n";

var upArrow = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 140.7 121.9\"><path d=\"M140.1 121.5H.6L70.4.7z\" /></svg>\n";

/* src/components/YarnSelector/YarnSelector.svelte generated by Svelte v3.43.0 */
const file$a = "src/components/YarnSelector/YarnSelector.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	child_ctx[13] = i;
	return child_ctx;
}

// (40:6) {:else}
function create_else_block$2(ctx) {
	let html_tag;
	let html_anchor;

	const block = {
		c: function create() {
			html_tag = new HtmlTag();
			html_anchor = empty$1();
			html_tag.a = html_anchor;
		},
		m: function mount(target, anchor) {
			html_tag.m(downArrow, target, anchor);
			insert_dev(target, html_anchor, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(html_anchor);
			if (detaching) html_tag.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(40:6) {:else}",
		ctx
	});

	return block;
}

// (38:6) {#if isToggled === true}
function create_if_block_1$2(ctx) {
	let html_tag;
	let html_anchor;

	const block = {
		c: function create() {
			html_tag = new HtmlTag();
			html_anchor = empty$1();
			html_tag.a = html_anchor;
		},
		m: function mount(target, anchor) {
			html_tag.m(upArrow, target, anchor);
			insert_dev(target, html_anchor, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(html_anchor);
			if (detaching) html_tag.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(38:6) {#if isToggled === true}",
		ctx
	});

	return block;
}

// (45:2) {#if isToggled === true}
function create_if_block$5(ctx) {
	let div;
	let each_value = /*yarns*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "class", "color-dropdown svelte-1urfrg8");
			add_location(div, file$a, 45, 4, 1209);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tinycolor, yarns, selectedColorIndex, setColor*/ 26) {
				each_value = /*yarns*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(45:2) {#if isToggled === true}",
		ctx
	});

	return block;
}

// (47:6) {#each yarns as yarn, i}
function create_each_block$2(ctx) {
	let button;
	let button_style_value;
	let mounted;
	let dispose;

	function click_handler_1() {
		return /*click_handler_1*/ ctx[9](/*i*/ ctx[13]);
	}

	const block = {
		c: function create() {
			button = element("button");
			attr_dev(button, "class", "item svelte-1urfrg8");

			attr_dev(button, "style", button_style_value = `background-color: ${tinycolor.fromRatio(/*yarn*/ ctx[11].color).toHexString()};
          `);

			toggle_class(button, "selected", /*selectedColorIndex*/ ctx[1] === /*i*/ ctx[13]);
			add_location(button, file$a, 47, 8, 1277);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*yarns*/ 8 && button_style_value !== (button_style_value = `background-color: ${tinycolor.fromRatio(/*yarn*/ ctx[11].color).toHexString()};
          `)) {
				attr_dev(button, "style", button_style_value);
			}

			if (dirty & /*selectedColorIndex*/ 2) {
				toggle_class(button, "selected", /*selectedColorIndex*/ ctx[1] === /*i*/ ctx[13]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(47:6) {#each yarns as yarn, i}",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let div;
	let button;
	let span;
	let span_style_value;
	let button_style_value;
	let t;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*isToggled*/ ctx[2] === true) return create_if_block_1$2;
		return create_else_block$2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*isToggled*/ ctx[2] === true && create_if_block$5(ctx);

	const block = {
		c: function create() {
			div = element("div");
			button = element("button");
			span = element("span");
			if_block0.c();
			t = space();
			if (if_block1) if_block1.c();
			attr_dev(span, "class", "arrow svelte-1urfrg8");

			attr_dev(span, "style", span_style_value = `
        stroke: ${/*selectedColor*/ ctx[0].isDark() ? 'black' : 'white'};
        fill: ${/*selectedColor*/ ctx[0].isLight() ? 'black' : 'white'};
        `);

			add_location(span, file$a, 30, 4, 864);
			attr_dev(button, "class", "color-display svelte-1urfrg8");
			attr_dev(button, "style", button_style_value = `background-color: ${/*selectedColor*/ ctx[0].toHexString()};`);
			add_location(button, file$a, 25, 2, 712);
			attr_dev(div, "class", "yarn-selector svelte-1urfrg8");
			add_location(div, file$a, 24, 0, 682);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button);
			append_dev(button, span);
			if_block0.m(span, null);
			append_dev(div, t);
			if (if_block1) if_block1.m(div, null);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(span, null);
				}
			}

			if (dirty & /*selectedColor*/ 1 && span_style_value !== (span_style_value = `
        stroke: ${/*selectedColor*/ ctx[0].isDark() ? 'black' : 'white'};
        fill: ${/*selectedColor*/ ctx[0].isLight() ? 'black' : 'white'};
        `)) {
				attr_dev(span, "style", span_style_value);
			}

			if (dirty & /*selectedColor*/ 1 && button_style_value !== (button_style_value = `background-color: ${/*selectedColor*/ ctx[0].toHexString()};`)) {
				attr_dev(button, "style", button_style_value);
			}

			if (/*isToggled*/ ctx[2] === true) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$5(ctx);
					if_block1.c();
					if_block1.m(div, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$a($$self, $$props, $$invalidate) {
	let selectedColorIndex;
	let selectedYarn;
	let selectedColorBorder;
	let yarns;
	let $draft;
	let $ui;
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(6, $draft = $$value));
	validate_store(ui$1, 'ui');
	component_subscribe($$self, ui$1, $$value => $$invalidate(7, $ui = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('YarnSelector', slots, []);
	let isToggled = false;
	let selectedColor;

	function setColor(index) {
		ui$1.update(draft => {
			draft.selectedColor = index;
		});

		$$invalidate(2, isToggled = false);
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<YarnSelector> was created with unknown prop '${key}'`);
	});

	const click_handler = () => $$invalidate(2, isToggled = !isToggled);
	const click_handler_1 = i => setColor(i);

	$$self.$capture_state = () => ({
		tinycolor,
		draft: draft$1,
		ui: ui$1,
		downArrow,
		upArrow,
		isToggled,
		selectedColor,
		setColor,
		yarns,
		selectedColorBorder,
		selectedYarn,
		selectedColorIndex,
		$draft,
		$ui
	});

	$$self.$inject_state = $$props => {
		if ('isToggled' in $$props) $$invalidate(2, isToggled = $$props.isToggled);
		if ('selectedColor' in $$props) $$invalidate(0, selectedColor = $$props.selectedColor);
		if ('yarns' in $$props) $$invalidate(3, yarns = $$props.yarns);
		if ('selectedColorBorder' in $$props) selectedColorBorder = $$props.selectedColorBorder;
		if ('selectedYarn' in $$props) $$invalidate(5, selectedYarn = $$props.selectedYarn);
		if ('selectedColorIndex' in $$props) $$invalidate(1, selectedColorIndex = $$props.selectedColorIndex);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$ui*/ 128) {
			$$invalidate(1, selectedColorIndex = $ui.selectedColor);
		}

		if ($$self.$$.dirty & /*$draft, selectedColorIndex*/ 66) {
			$$invalidate(5, selectedYarn = $draft.yarn.find(y => y.id === selectedColorIndex));
		}

		if ($$self.$$.dirty & /*selectedYarn*/ 32) {
			$$invalidate(0, selectedColor = tinycolor.fromRatio(selectedYarn?.color));
		}

		if ($$self.$$.dirty & /*selectedColor*/ 1) {
			selectedColorBorder = selectedColor.isDark() ? 'white' : 'black';
		}

		if ($$self.$$.dirty & /*$draft*/ 64) {
			$$invalidate(3, yarns = $draft.yarn);
		}
	};

	return [
		selectedColor,
		selectedColorIndex,
		isToggled,
		yarns,
		setColor,
		selectedYarn,
		$draft,
		$ui,
		click_handler,
		click_handler_1
	];
}

class YarnSelector extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$a, create_fragment$a, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "YarnSelector",
			options,
			id: create_fragment$a.name
		});
	}
}

/* src/components/Dropdown/Dropdown.svelte generated by Svelte v3.43.0 */

const file$9 = "src/components/Dropdown/Dropdown.svelte";

// (12:2) {#if isToggled}
function create_if_block$4(ctx) {
	let div;
	let div_style_value;
	let current;
	const default_slot_template = /*#slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr_dev(div, "class", "dropdown-content svelte-ctlky3");
			attr_dev(div, "style", div_style_value = `top: ${/*height*/ ctx[2]}px`);
			add_location(div, file$9, 12, 4, 350);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[3],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*height*/ 4 && div_style_value !== (div_style_value = `top: ${/*height*/ ctx[2]}px`)) {
				attr_dev(div, "style", div_style_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(12:2) {#if isToggled}",
		ctx
	});

	return block;
}

function create_fragment$9(ctx) {
	let div;
	let button;
	let t1;
	let current;
	let mounted;
	let dispose;
	let if_block = /*isToggled*/ ctx[0] && create_if_block$4(ctx);

	const block = {
		c: function create() {
			div = element("div");
			button = element("button");
			button.textContent = "👁";
			t1 = space();
			if (if_block) if_block.c();
			add_location(button, file$9, 10, 2, 266);
			attr_dev(div, "class", "dropdown svelte-ctlky3");
			add_location(div, file$9, 9, 0, 219);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button);
			append_dev(div, t1);
			if (if_block) if_block.m(div, null);
			/*div_binding*/ ctx[6](div);
			current = true;

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*isToggled*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*isToggled*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$4(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			/*div_binding*/ ctx[6](null);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let container;
	let height;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Dropdown', slots, ['default']);
	let { isToggled = false } = $$props;
	const writable_props = ['isToggled'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropdown> was created with unknown prop '${key}'`);
	});

	const click_handler = () => $$invalidate(0, isToggled = !isToggled);

	function div_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			container = $$value;
			$$invalidate(1, container);
		});
	}

	$$self.$$set = $$props => {
		if ('isToggled' in $$props) $$invalidate(0, isToggled = $$props.isToggled);
		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({ isToggled, container, height });

	$$self.$inject_state = $$props => {
		if ('isToggled' in $$props) $$invalidate(0, isToggled = $$props.isToggled);
		if ('container' in $$props) $$invalidate(1, container = $$props.container);
		if ('height' in $$props) $$invalidate(2, height = $$props.height);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*container, height*/ 6) {
			if (container !== undefined && height === 0) {
				$$invalidate(2, height = container.firstChild.getBoundingClientRect().height);
			}
		}
	};

	$$invalidate(1, container = undefined);
	$$invalidate(2, height = 0);
	return [isToggled, container, height, $$scope, slots, click_handler, div_binding];
}

class Dropdown extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$9, create_fragment$9, not_equal, { isToggled: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dropdown",
			options,
			id: create_fragment$9.name
		});
	}

	get isToggled() {
		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isToggled(value) {
		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/components/Dropdown/DropdownItem.svelte generated by Svelte v3.43.0 */

const file$8 = "src/components/Dropdown/DropdownItem.svelte";

function create_fragment$8(ctx) {
	let div;
	let current;
	const default_slot_template = /*#slots*/ ctx[1].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr_dev(div, "class", "dropdown-item svelte-4pxv5h");
			add_location(div, file$8, 3, 0, 20);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[0],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
						null
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$8($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('DropdownItem', slots, ['default']);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DropdownItem> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
	};

	return [$$scope, slots];
}

class DropdownItem extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$8, create_fragment$8, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DropdownItem",
			options,
			id: create_fragment$8.name
		});
	}
}

/* src/pages/Editor/Toolbar.svelte generated by Svelte v3.43.0 */
const file$7 = "src/pages/Editor/Toolbar.svelte";

// (57:24) {:else}
function create_else_block$1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("x");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(57:24) {:else}",
		ctx
	});

	return block;
}

// (57:5) {#if !sidebarOpen}
function create_if_block$3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("≡");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(57:5) {#if !sidebarOpen}",
		ctx
	});

	return block;
}

// (66:4) <DropdownItem>
function create_default_slot_2(ctx) {
	let checkboxinput;
	let updating_checked;
	let current;

	function checkboxinput_checked_binding(value) {
		/*checkboxinput_checked_binding*/ ctx[7](value);
	}

	let checkboxinput_props = { label: "Show threading" };

	if (/*toggleThreading*/ ctx[1] !== void 0) {
		checkboxinput_props.checked = /*toggleThreading*/ ctx[1];
	}

	checkboxinput = new CheckboxInput({
			props: checkboxinput_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(checkboxinput, 'checked', checkboxinput_checked_binding));

	const block = {
		c: function create() {
			create_component(checkboxinput.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(checkboxinput, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const checkboxinput_changes = {};

			if (!updating_checked && dirty & /*toggleThreading*/ 2) {
				updating_checked = true;
				checkboxinput_changes.checked = /*toggleThreading*/ ctx[1];
				add_flush_callback(() => updating_checked = false);
			}

			checkboxinput.$set(checkboxinput_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(checkboxinput.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(checkboxinput.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(checkboxinput, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(66:4) <DropdownItem>",
		ctx
	});

	return block;
}

// (69:4) <DropdownItem>
function create_default_slot_1(ctx) {
	let checkboxinput;
	let updating_checked;
	let current;

	function checkboxinput_checked_binding_1(value) {
		/*checkboxinput_checked_binding_1*/ ctx[8](value);
	}

	let checkboxinput_props = { label: "Show treadle order" };

	if (/*toggleTreadleOrder*/ ctx[2] !== void 0) {
		checkboxinput_props.checked = /*toggleTreadleOrder*/ ctx[2];
	}

	checkboxinput = new CheckboxInput({
			props: checkboxinput_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(checkboxinput, 'checked', checkboxinput_checked_binding_1));

	const block = {
		c: function create() {
			create_component(checkboxinput.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(checkboxinput, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const checkboxinput_changes = {};

			if (!updating_checked && dirty & /*toggleTreadleOrder*/ 4) {
				updating_checked = true;
				checkboxinput_changes.checked = /*toggleTreadleOrder*/ ctx[2];
				add_flush_callback(() => updating_checked = false);
			}

			checkboxinput.$set(checkboxinput_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(checkboxinput.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(checkboxinput.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(checkboxinput, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(69:4) <DropdownItem>",
		ctx
	});

	return block;
}

// (65:2) <Dropdown>
function create_default_slot(ctx) {
	let dropdownitem0;
	let t;
	let dropdownitem1;
	let current;

	dropdownitem0 = new DropdownItem({
			props: {
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	dropdownitem1 = new DropdownItem({
			props: {
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(dropdownitem0.$$.fragment);
			t = space();
			create_component(dropdownitem1.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(dropdownitem0, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(dropdownitem1, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const dropdownitem0_changes = {};

			if (dirty & /*$$scope, toggleThreading*/ 2050) {
				dropdownitem0_changes.$$scope = { dirty, ctx };
			}

			dropdownitem0.$set(dropdownitem0_changes);
			const dropdownitem1_changes = {};

			if (dirty & /*$$scope, toggleTreadleOrder*/ 2052) {
				dropdownitem1_changes.$$scope = { dirty, ctx };
			}

			dropdownitem1.$set(dropdownitem1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dropdownitem0.$$.fragment, local);
			transition_in(dropdownitem1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dropdownitem0.$$.fragment, local);
			transition_out(dropdownitem1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dropdownitem0, detaching);
			if (detaching) detach_dev(t);
			destroy_component(dropdownitem1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(65:2) <Dropdown>",
		ctx
	});

	return block;
}

function create_fragment$7(ctx) {
	let div1;
	let button0;
	let t0;
	let div0;
	let button1;
	let t2;
	let button2;
	let t4;
	let dropdown;
	let t5;
	let yarnselector;
	let current;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (!/*sidebarOpen*/ ctx[0]) return create_if_block$3;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	dropdown = new Dropdown({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	yarnselector = new YarnSelector({ $$inline: true });

	const block = {
		c: function create() {
			div1 = element("div");
			button0 = element("button");
			if_block.c();
			t0 = space();
			div0 = element("div");
			button1 = element("button");
			button1.textContent = "Undo";
			t2 = space();
			button2 = element("button");
			button2.textContent = "Redo";
			t4 = space();
			create_component(dropdown.$$.fragment);
			t5 = space();
			create_component(yarnselector.$$.fragment);
			attr_dev(button0, "class", "hamberder svelte-1617tc9");
			add_location(button0, file$7, 55, 2, 1270);
			add_location(button1, file$7, 60, 4, 1377);
			add_location(button2, file$7, 61, 4, 1425);
			add_location(div0, file$7, 59, 2, 1367);
			attr_dev(div1, "class", "tool-bar svelte-1617tc9");
			add_location(div1, file$7, 54, 0, 1216);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, button0);
			if_block.m(button0, null);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div0, button1);
			append_dev(div0, t2);
			append_dev(div0, button2);
			append_dev(div1, t4);
			mount_component(dropdown, div1, null);
			append_dev(div1, t5);
			mount_component(yarnselector, div1, null);
			/*div1_binding*/ ctx[9](div1);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*toggle*/ ctx[4], false, false, false),
					listen_dev(button1, "click", draft$1.undo, false, false, false),
					listen_dev(button2, "click", draft$1.redo, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(button0, null);
				}
			}

			const dropdown_changes = {};

			if (dirty & /*$$scope, toggleTreadleOrder, toggleThreading*/ 2054) {
				dropdown_changes.$$scope = { dirty, ctx };
			}

			dropdown.$set(dropdown_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dropdown.$$.fragment, local);
			transition_in(yarnselector.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dropdown.$$.fragment, local);
			transition_out(yarnselector.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if_block.d();
			destroy_component(dropdown);
			destroy_component(yarnselector);
			/*div1_binding*/ ctx[9](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
	let cellSizeInput;
	let toggleTreadleOrder;
	let toggleThreading;
	let $ui;
	validate_store(ui$1, 'ui');
	component_subscribe($$self, ui$1, $$value => $$invalidate(6, $ui = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Toolbar', slots, []);
	let { height = 0 } = $$props;
	let { sidebarOpen } = $$props;
	let toolbarContainer;

	onMount(() => {
		$$invalidate(5, height = toolbarContainer.clientHeight);
	});

	/*
function toggleTreadleOrder() {
  ui.update((draft) => {
    draft.showTreadleOrder = !draft.showTreadleOrder;
  });
}

function toggleThreading() {
  ui.update((draft) => {
    draft.showThreading = !draft.showThreading;
  });
}
*/
	function toggle() {
		$$invalidate(0, sidebarOpen = !sidebarOpen);

		if (sidebarOpen === false) {
			ui$1.update(temp => {
				temp.selectedMenu = -1;
			});
		}
	}

	const writable_props = ['height', 'sidebarOpen'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toolbar> was created with unknown prop '${key}'`);
	});

	function checkboxinput_checked_binding(value) {
		toggleThreading = value;
		($$invalidate(1, toggleThreading), $$invalidate(6, $ui));
	}

	function checkboxinput_checked_binding_1(value) {
		toggleTreadleOrder = value;
		($$invalidate(2, toggleTreadleOrder), $$invalidate(6, $ui));
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			toolbarContainer = $$value;
			$$invalidate(3, toolbarContainer);
		});
	}

	$$self.$$set = $$props => {
		if ('height' in $$props) $$invalidate(5, height = $$props.height);
		if ('sidebarOpen' in $$props) $$invalidate(0, sidebarOpen = $$props.sidebarOpen);
	};

	$$self.$capture_state = () => ({
		onMount,
		ui: ui$1,
		draft: draft$1,
		YarnSelector,
		CheckboxInput,
		Dropdown,
		DropdownItem,
		height,
		sidebarOpen,
		toolbarContainer,
		toggle,
		toggleThreading,
		toggleTreadleOrder,
		cellSizeInput,
		$ui
	});

	$$self.$inject_state = $$props => {
		if ('height' in $$props) $$invalidate(5, height = $$props.height);
		if ('sidebarOpen' in $$props) $$invalidate(0, sidebarOpen = $$props.sidebarOpen);
		if ('toolbarContainer' in $$props) $$invalidate(3, toolbarContainer = $$props.toolbarContainer);
		if ('toggleThreading' in $$props) $$invalidate(1, toggleThreading = $$props.toggleThreading);
		if ('toggleTreadleOrder' in $$props) $$invalidate(2, toggleTreadleOrder = $$props.toggleTreadleOrder);
		if ('cellSizeInput' in $$props) cellSizeInput = $$props.cellSizeInput;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$ui*/ 64) {
			cellSizeInput = $ui.cellSize;
		}

		if ($$self.$$.dirty & /*$ui*/ 64) {
			$$invalidate(2, toggleTreadleOrder = $ui.showTreadleOrder);
		}

		if ($$self.$$.dirty & /*$ui*/ 64) {
			$$invalidate(1, toggleThreading = $ui.showThreading);
		}

		if ($$self.$$.dirty & /*toggleTreadleOrder*/ 4) {
			{
				ui$1.update(draft => {
					draft.showTreadleOrder = toggleTreadleOrder;
				});
			}
		}

		if ($$self.$$.dirty & /*toggleThreading*/ 2) {
			{
				ui$1.update(draft => {
					draft.showThreading = toggleThreading;
				});
			}
		}
	};

	return [
		sidebarOpen,
		toggleThreading,
		toggleTreadleOrder,
		toolbarContainer,
		toggle,
		height,
		$ui,
		checkboxinput_checked_binding,
		checkboxinput_checked_binding_1,
		div1_binding
	];
}

class Toolbar extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$7, create_fragment$7, not_equal, { height: 5, sidebarOpen: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Toolbar",
			options,
			id: create_fragment$7.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*sidebarOpen*/ ctx[0] === undefined && !('sidebarOpen' in props)) {
			console.warn("<Toolbar> was created without expected prop 'sidebarOpen'");
		}
	}

	get height() {
		throw new Error("<Toolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<Toolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get sidebarOpen() {
		throw new Error("<Toolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set sidebarOpen(value) {
		throw new Error("<Toolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var solidFrag = "precision highp float;\nuniform vec4 color;\nvoid main(void) {\n  vec3 outColor = color.rgb * color.a;\n  gl_FragColor = vec4(vec3(outColor), color.a);\n}\n";

var weaveFrag = "precision highp float;\n\nuniform sampler2D warpSampler;\nuniform sampler2D weftSampler;\nuniform sampler2D threading;\nuniform sampler2D treadleOrder;\nuniform sampler2D tieup;\n\nuniform vec2 cellSize;\nuniform vec2 scrollPos;\nuniform float shaftCount;\nuniform float treadleCount;\n\nvarying vec2 uv;\n\nconst float gap = 0.07;\n\nfloat getBorder(float x, float y, float tieupValue) {\n  vec2 b = vec2(\n      (mod(x, cellSize.x) / cellSize.x),\n      (mod(y, cellSize.y) / cellSize.y));\n\n  vec2 bv = 1.0 - vec2(\n      b.x * (1.0 - b.x),\n      b.y * (1.0 - b.y)\n      );\n\n  float f =\n    step(1.0 - gap, bv.x) * (1.0 - tieupValue) +\n    step(1.0 - gap, bv.y) * tieupValue;\n\n  return 1.0 - f;\n}\n\nvoid main(void) {\n  float x = (uv.s + scrollPos.x);\n  float y = (uv.t + scrollPos.y);\n\n  vec2 shaft = texture2D(threading, vec2(x, 0.0)).rg;\n  vec2 pedal = texture2D(treadleOrder, vec2(y, 0.0)).rg;\n\n  vec3 warpColor = texture2D(warpSampler, vec2(x, 0.0)).rgb;\n  vec3 weftColor = texture2D(weftSampler, vec2(y, 0.0)).rgb;\n\n  vec2 tieupOffset = vec2(\n      1.0 / (treadleCount + 1.0),\n      1.0 / (shaftCount + 1.0));\n  float tieupValue = texture2D(tieup, vec2(\n        pedal.r + tieupOffset.x,\n        shaft.r + tieupOffset.y\n        )).r;\n  float absence = shaft.g * pedal.g;\n\n  vec3 color = mix(warpColor, weftColor, tieupValue) * getBorder(x, y, tieupValue);\n\n  color = mix(warpColor * getBorder(x, y, 0.0), color, pedal.g);\n  color = mix(weftColor * getBorder(x, y, 1.0), color, shaft.g);\n\n  float overflow = step(y, 1.0) * step(x, 1.0);\n  color = mix(vec3(1.0, 1.0, 1.0), color.rgb, overflow);\n  gl_FragColor = vec4(vec3(color), 1.0);\n}\n";

var textureFrag = "precision highp float;\n\nuniform sampler2D sampler;\nuniform float opacity;\nvarying vec2 uv;\n\nvoid main(void) {\n  gl_FragColor = vec4(texture2D(sampler, uv).rgb * opacity, opacity);\n}\n";

var gridFrag = "precision highp float;\n\nuniform sampler2D cellToggleSampler;\nuniform vec2 cellSize;\nuniform vec2 scrollPos;\nuniform float vert;\nuniform float steps;\n\nvarying vec2 uv;\n\nconst float cellMargin = 0.15;\nconst float gap = 0.04;\n\nfloat getBorder(float x, float y, float margin) {\n  vec2 b = vec2(\n      (mod(x, cellSize.x) / cellSize.x),\n      (mod(y, cellSize.y) / cellSize.y));\n\n  vec2 bv = 1.0 - vec2(\n      b.x * (1.0 - b.x),\n      b.y * (1.0 - b.y)\n      );\n\n  float f = step(1.0 - margin, bv.x) + step(1.0 - margin, bv.y);\n\n  return 1.0 - f;\n}\n\nfloat getSteps(float x, float y) {\n  float horiz = 1.0 - vert;\n\n  vec2 b = vec2(\n      (mod(x, cellSize.x * steps) / (cellSize.x * steps)),\n      (mod(y, cellSize.y * steps) / (cellSize.y * steps)));\n\n  vec2 bv = 1.0 - vec2(\n      b.x * (1.0 - b.x),\n      b.y * (1.0 - b.y)\n      );\n\n  float margin = 0.012;\n  float f = step(1.0 - margin, bv.x) * horiz + step(1.0 - margin, bv.y) * vert;\n\n  return 1.0 - f;\n}\n\nvoid main(void) {\n  float x = (uv.s + scrollPos.x);\n  float y = (uv.t + scrollPos.y);\n  float horiz = 1.0 - vert;\n\n  vec2 tv = texture2D(cellToggleSampler, vec2(x * horiz + y * vert, 0)).rg;\n  float toggleValue = tv.r + tv.g - 1.0;\n\n  float border = getBorder(x, y, gap) * getSteps(x, y);\n  float squareBorder = 1.0 - getBorder(x, y, cellMargin);\n\n  float nx = x * vert + y * horiz;\n  float cellSizeF = cellSize.x * vert + cellSize.y * horiz;\n  float square = 1.0 - step(toggleValue, nx) * (1.0 - step(toggleValue, nx - cellSizeF));\n\n  float v = (square + squareBorder) * border;\n  float overflow = step(x, 1.0) * step(y, 1.0);\n  v = mix(1.0, v, overflow);\n  gl_FragColor = vec4(vec3(v), 1.0);\n}\n";

var tieupFrag = "precision highp float;\n\nuniform sampler2D cellToggleSampler;\n\nuniform vec2 cellSize;\nuniform vec2 scrollPos;\n\nvarying vec2 uv;\n\nconst float gap = 0.04;\nconst float cellMargin = 0.09;\n\nfloat getBorder(float x, float y, float margin) {\n  vec2 b = vec2(\n      (mod(x, cellSize.x) / cellSize.x),\n      (mod(y, cellSize.y) / cellSize.y));\n\n  vec2 bv = 1.0 - vec2(\n      b.x * (1.0 - b.x),\n      b.y * (1.0 - b.y)\n      );\n\n  float f = step(1.0 - margin, bv.x) + step(1.0 - margin, bv.y);\n\n  return 1.0 - f;\n}\n\nvoid main(void) {\n  vec3 color = vec3(1.0, 1.0, 1.0);\n  float x = (uv.s);\n  float y = (uv.t);\n  float toggleValue = texture2D(cellToggleSampler, vec2(x, y)).r;\n\n  float border = getBorder(x, y, gap);\n  vec3 fill = mix(\n      vec3(0.0, 0.0, 0.0),\n      vec3(1.0, 1.0, 1.0),\n      1.0 - getBorder(x, y, cellMargin) * toggleValue);\n  gl_FragColor = vec4(fill * border, 1.0);\n}\n";

var colorRowFrag = "precision highp float;\n\nuniform sampler2D colorSampler;\n\nuniform vec2 cellSize;\nuniform vec2 scrollPos;\nuniform float vert;\nuniform float steps;\n\nvarying vec2 uv;\n\nconst float gap = 0.04;\nconst float cellMargin = 0.15;\n\nfloat getBorder(float x, float y, float margin) {\n  vec2 b = vec2(\n      (mod(x, cellSize.x) / cellSize.x),\n      (mod(y, cellSize.y) / cellSize.y));\n\n  vec2 bv = 1.0 - vec2(\n      b.x * (1.0 - b.x),\n      b.y * (1.0 - b.y)\n      );\n\n  float f = step(1.0 - margin, bv.x) + step(1.0 - margin, bv.y);\n\n  return 1.0 - f;\n}\n\nfloat getSteps(float x, float y) {\n  float horiz = 1.0 - vert;\n\n  float margin = 0.012;\n  vec2 b = vec2(\n      (mod(x, cellSize.x * steps) / (cellSize.x * steps)),\n      (mod(y, cellSize.y * steps) / (cellSize.y * steps)));\n\n  vec2 bv = 1.0 - vec2(\n      b.x * (1.0 - b.x),\n      b.y * (1.0 - b.y)\n      );\n\n  float f = step(1.0 - margin, bv.x) * horiz + step(1.0 - margin, bv.y) * vert;\n\n  return 1.0 - f;\n}\n\nvoid main(void) {\n  float x = uv.s + scrollPos.x;\n  float y = uv.t + scrollPos.y;\n  if(x > 1.0 || y > 1.0) {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n  } else {\n    float horiz = 1.0 - vert;\n  //vec2 tv = texture2D(cellToggleSampler, vec2(x * horiz + y * vert, 0)).rg;\n    vec3 cellColor = texture2D(\n        colorSampler,\n        vec2(x * horiz + y * vert, 0)).rgb;\n    float border = getBorder(x, y, gap) * getSteps(x, y);\n    vec3 fill = mix(\n        cellColor,\n        vec3(1.0, 1.0, 1.0),\n        1.0 - getBorder(x, y, cellMargin));\n    float overflow = step(x, 1.0) * step(y, 1.0);\n    gl_FragColor = vec4((fill * border) * overflow, 1.0);\n  }\n}\n";

var genUV2D = "attribute vec2 aVertexPosition;\nvarying vec2 uv;\nuniform mat4 mvp;\nvoid main(void) {\n  uv = vec2(\n    clamp(aVertexPosition.x, 0.0, 1.0),\n    clamp(aVertexPosition.y, 0.0, 1.0)\n  );\n  gl_Position = mvp * vec4(vec3(aVertexPosition, 0.0), 1.0);\n}\n";

function buildShader(name) {
  switch(name) {
    case 'texture': return new Shader({ frag: textureFrag, vert: genUV2D });
    case 'solid': return new Shader({ frag: solidFrag, vert: genUV2D });
    case 'weave': return new Shader({ frag: weaveFrag, vert: genUV2D });
    case 'grid': return new Shader({ frag: gridFrag, vert: genUV2D });
    case 'tieup': return new Shader({ frag: tieupFrag, vert: genUV2D });
    case 'colorRow': return new Shader({ frag: colorRowFrag, vert: genUV2D });
    default: return undefined;
  }
}

class ShaderBuilder {
  constructor(gl) {
    this.gl = gl;
    this.shaderCache = {};
  }

  getShader(shaderName) {
    let shader = this.shaderCache[shaderName];
    if(shader === undefined) {
      shader = buildShader(shaderName);
      if(shader === undefined) {
        throw new Error(`Unknown shader name ${shaderName}`);
      }
      shader.compile(this.gl);
      this.shaderCache[shaderName] = shader;
    }
    return shader;
  }
}

class Texture {
  constructor(gl, width, height, data) {
    this.gl = gl;
    if (width === undefined || height === undefined) {
      throw new Error('Undefined width/height of texture');
    }
    this.width = width;
    this.height = height;

    if (data instanceof Uint8Array) {
      this.color = data;
    } else {
      this.color = new Uint8Array(data.length * 4);
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        let n = i * 4;
        this.color[n + 0] = d[0] * 255;
        this.color[n + 1] = d[1] * 255;
        this.color[n + 2] = d[2] * 255;
        this.color[n + 3] = d[3] * 255;
      }
    }

    this.compile(this.gl);
  }

  compile() {
    this.texture = this.gl.createTexture();

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.width,
      this.height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.color
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  delete() {
    this.gl.deleteTexture(this.texture);
  }

  bind(unit) {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }

  setColor(x, y, color) {
    this.setColorArea(x, y, 1, 1, color);
  }

  setColorArea(x, y, width, height, color) {
    this.color = new Uint8Array([
      color[0] * 255,
      color[1] * 255,
      color[2] * 255,
      color[3] * 255,
    ]);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texSubImage2D(
      this.gl.TEXTURE_2D,
      0,
      x,
      y,
      width,
      height,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.color
    );
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  unbind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
}

class RendererEventTarget {
  clickListeners = [];
  pointerMoveListeners = [];
  pointerUpListeners = [];
  pointerDownListeners = [];

  constructor(gl, shaders, name) {
    this.gl = gl;
    this.name = name;
    this.solidShader = shaders.getShader('solid');
    this.centerQuad = new VertexArray(
      this.gl,
      [-0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, -0.5],
      [1, 0, 2, 2, 0, 3],
      [2]
    );
    this.quad = new VertexArray(
      this.gl,
      [0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0],
      [1, 0, 2, 2, 0, 3],
      [2]
    );
  }

  prerender() {
    let { cellSize, xCount, yCount } = this.values;
    let [rX, rY] = this.rendererPos;
    let w = this.gl.canvas.width;
    let cH = cellSize / 2.0;

    this.gl.scissor(w - (rX + xCount) * cH, rY * cH, cH * xCount, cH * yCount);
  }

  isWithinGrid(pos) {
    let { cellSize, xCount, yCount } = this.values;

    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;

    let x = ((w - pos[0]) / w) * 2.0;
    let y = ((h - pos[1]) / h) * 2.0;
    let gridX = this.rendererPos[0] * (cellSize / w);
    let gridY = this.rendererPos[1] * (cellSize / h);
    let gridW = (xCount * cellSize) / w;
    let gridH = (yCount * cellSize) / h;
    let ret = x > gridX && y > gridY && x < gridX + gridW && y < gridY + gridH;
    return ret;
  }

  getCellAtPos(pos) {
    let { cellSize, scrollX, scrollY } = this.values;
    let shouldScrollX = this.shouldScrollX ? 1.0 : 0.0;
    let shouldScrollY = this.shouldScrollY ? 1.0 : 0.0;
    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;
    let xOffset = shouldScrollX * (scrollX / cellSize);
    let yOffset = shouldScrollY * (scrollY / cellSize);
    let cellX = Math.floor((w - pos[0]) / (cellSize / 2.0) + xOffset);
    let cellY = Math.floor((h - pos[1]) / (cellSize / 2.0) + yOffset);
    let i = cellX - this.rendererPos[0];
    let j = cellY - this.rendererPos[1];
    return [i, j];
  }

  getCellsBetweenPoints(from, to) {
    let fromCell = this.getCellAtPos(from);
    let toCell = this.getCellAtPos(to);
    let linePoints = line(fromCell[0], fromCell[1], toCell[0], toCell[1]);
    let { xCount, yCount } = this.values;
    return linePoints.filter(
      (p) => p[0] >= 0 && p[0] < xCount && p[1] >= 0 && p[1] < yCount
    );
  }
}

class TieupRenderer extends RendererEventTarget {
  constructor(gl, shaders, name) {
    super(gl, shaders, name);
    this.shader = shaders.getShader('tieup');
    this.mvp = create$4();

    this.initialView = create$4();
    scale$1(this.initialView, this.initialView, [-1.0, 1.0, 1.0]);
    translate(this.initialView, this.initialView, [-1.0, -1.0, 0.0]);
    this.view = create$4();
    this.mvp = create$4();
  }

  renderPoints(points) {
    this.render();
    let { xCount, yCount, cellSize } = this.values;
    this.solidShader.bind();
    this.centerQuad.bind();
    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;
    let cw = cellSize / w;
    let ch = cellSize / h;

    let mvp = identity(this.mvp);
    let view = translate(identity(this.view), this.initialView, [
      this.rendererPos[0] * cw,
      this.rendererPos[1] * ch,
      0.0,
    ]);
    translate(view, view, [cw / 2.0, ch / 2.0, 1.0]);
    scale$1(view, view, [cw, ch, 1.0]);
    for (let i = 0; i < xCount; i++) {
      for (let j = 0; j < yCount; j++) {
        if (points.some((p) => p[0] === i && p[1] === j)) {
          this.solidShader.setVec4('color', [1.0, 0.0, 0.0, 1.0]);
        } else {
          continue;
        }
        translate(mvp, view, [i, j, 0.0]);
        scale$1(mvp, mvp, [0.8, 0.8, 1.0]);
        this.solidShader.setMat4('mvp', mvp);
        this.centerQuad.draw();
      }
    }
    this.centerQuad.unbind();
    this.solidShader.unbind();
  }

  handleEvent(event) {
    let { cellSize, xCount, yCount } = this.values;
    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;
    let x = ((w - event.offsetX) / w) * 2.0;
    let y = ((h - event.offsetY) / h) * 2.0;

    let gridX = this.rendererPos[0] * (cellSize / w);
    let gridY = this.rendererPos[1] * (cellSize / h);
    let gridW = (xCount * cellSize) / w;
    let gridH = (yCount * cellSize) / h;
    if (x > gridX && y > gridY && x < gridX + gridW && y < gridY + gridH) {
      let i = Math.floor(((x - gridX) / gridW) * xCount);
      let j = Math.floor(((y - gridY) / gridH) * yCount);
      return [i, j, event];
    }
    return undefined;
  }

  updateValues(values) {
    this.values = values;
  }

  setRendererPosition(scrollPos) {
    this.rendererPos = scrollPos;
  }

  setCellToggleTexture(cellToggleTexture) {
    this.cellToggleTexture = cellToggleTexture;
  }

  render() {
    this.prerender();
    if (this.values === undefined) return;
    let { xCount, yCount, cellSize } = this.values;

    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;

    this.shader.bind();
    this.quad.bind();

    let cw = cellSize / w;
    let ch = cellSize / h;
    let mvp = identity(this.mvp);
    let view = translate(identity(this.view), this.initialView, [
      this.rendererPos[0] * cw,
      this.rendererPos[1] * ch,
      0.0,
    ]);
    scale$1(mvp, view, [
      (cellSize * xCount) / w,
      (cellSize * yCount) / h,
      1.0,
    ]);

    this.cellToggleTexture.bind(0);
    this.shader.setSampler2D('cellToggleSampler', 0);

    this.shader.setVec2('scrollPos', [0, 0]);

    this.shader.setVec2('cellSize', [cw / (cw * xCount), ch / (ch * yCount)]);

    this.shader.setMat4('mvp', mvp);
    this.quad.draw();
    this.quad.unbind();
    this.shader.unbind();
  }
}

class GridRenderer extends RendererEventTarget {
  constructor(gl, shaders, vertical, shouldScrollX, shouldScrollY, name) {
    super(gl, shaders, name);
    this.gl = gl;
    this.shader = shaders.getShader('grid');
    this.vertical = vertical;
    this.name = name;
    this.shouldScrollX = shouldScrollX;
    this.shouldScrollY = shouldScrollY;

    this.mvp = create$4();

    this.initialView = create$4();
    scale$1(this.initialView, this.initialView, [-1.0, 1.0, 1.0]);
    translate(this.initialView, this.initialView, [-1.0, -1.0, 0.0]);
    this.view = create$4();
    this.mvp = create$4();
  }

  updateValues(values) {
    this.values = values;
  }

  setRendererPosition(scrollPos) {
    this.rendererPos = scrollPos;
  }

  setCellToggleTexture(cellToggleTexture) {
    this.cellToggleTexture = cellToggleTexture;
  }

  renderPoints(points) {
    this.render();
    let { xCount, yCount, cellSize, scrollX, scrollY } = this.values;
    this.solidShader.bind();
    this.centerQuad.bind();
    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;
    let cw = cellSize / w;
    let ch = cellSize / h;
    let shouldScrollX = this.shouldScrollX ? 1.0 : 0.0;
    let shouldScrollY = this.shouldScrollY ? 1.0 : 0.0;

    let mvp = identity(this.mvp);
    let view = translate(identity(this.view), this.initialView, [
      this.rendererPos[0] * cw,
      this.rendererPos[1] * ch,
      0.0,
    ]);
    translate(view, view, [cw / 2.0, ch / 2.0, 1.0]);
    scale$1(view, view, [cw, ch, 1.0]);
    let minorSize = Math.min(xCount, yCount);
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < minorSize; j++) {
        let x, y;
        if (yCount < xCount) {
          x = i;
          y = j;
        } else {
          x = j;
          y = i;
        }

        translate(mvp, view, [
          (-scrollX / cellSize) * shouldScrollX,
          (-scrollY / cellSize) * shouldScrollY,
          0.0,
        ]);
        translate(mvp, mvp, [x, y, 0.0]);
        if (points[i] === undefined) {
          continue;
        } else if (points[i] === j) {
          this.solidShader.setVec4('color', [0.02, 0.4, 0.02, 1.0]);
          scale$1(mvp, mvp, [0.62, 0.62, 1.0]);
        } else {
          this.solidShader.setVec4('color', [1.0, 1.0, 1.0, 1.0]);
          scale$1(mvp, mvp, [0.8, 0.8, 1.0]);
        }
        this.solidShader.setMat4('mvp', mvp);
        this.centerQuad.draw();
      }
    }
    this.centerQuad.unbind();
    this.solidShader.unbind();
  }

  render() {
    this.prerender();
    if (this.values === undefined) return;
    let {
      xCount,
      yCount,
      cellSize,
      warpCount,
      weftCount,
      scrollX,
      scrollY,
      xStepDistance,
      yStepDistance,
    } = this.values;
    let shouldScrollX = this.shouldScrollX ? 1.0 : 0.0;
    let shouldScrollY = this.shouldScrollY ? 1.0 : 0.0;

    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;

    this.shader.bind();
    this.quad.bind();

    let cw = cellSize / w;
    let ch = cellSize / h;
    let mvp = identity(this.mvp);
    let view = translate(identity(this.view), this.initialView, [
      this.rendererPos[0] * cw,
      this.rendererPos[1] * ch,
      0.0,
    ]);
    scale$1(mvp, view, [
      (cellSize * xCount) / w,
      (cellSize * yCount) / h,
      1.0,
    ]);

    this.cellToggleTexture.bind(0);
    this.shader.setSampler2D('cellToggleSampler', 0);
    this.shader.setVec2('scrollPos', [
      (scrollX / (warpCount * cellSize)) * shouldScrollX,
      (scrollY / (weftCount * cellSize)) * shouldScrollY,
    ]);

    this.shader.setFloat('vert', yCount > xCount ? 1.0 : 0.0);
    this.shader.setFloat(
      'steps',
      yCount > xCount ? yStepDistance : xStepDistance
    );

    this.shader.setVec2('cellSize', [cw / (cw * xCount), ch / (ch * yCount)]);

    this.shader.setMat4('mvp', mvp);
    this.quad.draw();
    this.quad.unbind();
    this.shader.unbind();
  }
}

class WeaveRenderer extends RendererEventTarget {
  constructor(gl, shaders, name) {
    super(gl, shaders, name);
    this.gl = gl;
    this.weaveShader = shaders.getShader('weave');

    this.initialView = create$4();
    scale$1(this.initialView, this.initialView, [-1.0, 1.0, 1.0]);
    translate(this.initialView, this.initialView, [-1.0, -1.0, 0.0]);
    this.view = create$4();
    this.mvp = create$4();
  }

  updateValues(values) {
    this.values = values;
  }

  setThreadingTexture(threading) {
    this.threading = threading;
  }

  setTreadleOrderTexture(treadleOrder) {
    this.treadleOrder = treadleOrder;
  }

  setTieupTexture(tieup) {
    this.tieup = tieup;
  }

  setWarpTexture(warpTexture) {
    this.warpTexture = warpTexture;
  }

  setWeftTexture(weftTexture) {
    this.weftTexture = weftTexture;
  }

  setRendererPosition(scrollPos) {
    this.rendererPos = scrollPos;
  }

  render() {
    this.prerender();
    if (this.values === undefined) return;
    let {
      xCount,
      yCount,
      scrollX,
      scrollY,
      cellSize,
      shaftCount,
      treadleCount,
    } = this.values;

    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;

    let cw = cellSize / w;
    let ch = cellSize / h;
    let mvp = identity(this.mvp);
    let view = translate(identity(this.view), this.initialView, [
      this.rendererPos[0] * cw,
      this.rendererPos[1] * ch,
      0.0,
    ]);
    scale$1(mvp, view, [
      (cellSize * xCount) / w,
      (cellSize * yCount) / h,
      1.0,
    ]);

    this.weaveShader.bind();
    this.quad.bind();
    this.weaveShader.setMat4('mvp', mvp);

    this.warpTexture.bind(0);
    this.weaveShader.setSampler2D('warpSampler', 0);

    this.weftTexture.bind(1);
    this.weaveShader.setSampler2D('weftSampler', 1);

    this.threading.bind(2);
    this.weaveShader.setSampler2D('threading', 2);

    this.treadleOrder.bind(3);
    this.weaveShader.setSampler2D('treadleOrder', 3);

    this.tieup.bind(4);
    this.weaveShader.setSampler2D('tieup', 4);

    this.weaveShader.setFloat('shaftCount', shaftCount);
    this.weaveShader.setFloat('treadleCount', treadleCount);

    this.weaveShader.setVec2('cellSize', [
      cw / (cw * xCount),
      ch / (ch * yCount),
    ]);

    this.weaveShader.setVec2('scrollPos', [
      scrollX / (xCount * cellSize),
      scrollY / (yCount * cellSize),
    ]);

    this.quad.draw();
    this.quad.unbind();
    this.weaveShader.unbind();
  }
}

class ColorRowRenderer extends RendererEventTarget {
  constructor(gl, shaders, shouldScrollX, shouldScrollY, name) {
    super(gl, shaders, name);
    this.shader = shaders.getShader('colorRow');
    this.shouldScrollX = shouldScrollX;
    this.shouldScrollY = shouldScrollY;

    this.initialView = create$4();
    scale$1(this.initialView, this.initialView, [-1.0, 1.0, 1.0]);
    translate(this.initialView, this.initialView, [-1.0, -1.0, 0.0]);
    this.view = create$4();
    this.mvp = create$4();
  }

  getCellsBetweenPoints(from, to) {
    let fromCell = this.getCellAtPos(from);
    let toCell = this.getCellAtPos(to);
    let vert = this.values.yCount > this.values.xCount;
    if (!vert) {
      return [fromCell[0], toCell[0]];
    } else {
      return [fromCell[1], toCell[1]];
    }
  }

  renderPoints(from, to, color) {
    this.render();
    let { xCount, yCount, cellSize, scrollX, scrollY } = this.values;
    this.solidShader.bind();
    this.centerQuad.bind();
    if (to < from) {
      [from, to] = [to, from];
    }
    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;
    let cw = cellSize / w;
    let ch = cellSize / h;
    let shouldScrollX = this.shouldScrollX ? 1.0 : 0.0;
    let shouldScrollY = this.shouldScrollY ? 1.0 : 0.0;

    let mvp = identity(this.mvp);
    let view = translate(identity(this.view), this.initialView, [
      this.rendererPos[0] * cw,
      this.rendererPos[1] * ch,
      0.0,
    ]);
    translate(view, view, [cw / 2.0, ch / 2.0, 1.0]);
    scale$1(view, view, [cw, ch, 1.0]);

    for (let i = 0; i < to - from + 1; i++) {
      let x, y;
      if (xCount > yCount) {
        x = from + i;
        y = 0;
      } else {
        x = 0;
        y = from + i;
      }
      this.solidShader.setVec4('color', [color.r, color.g, color.b, 1.0]);
      translate(mvp, view, [
        (-scrollX / cellSize) * shouldScrollX,
        (-scrollY / cellSize) * shouldScrollY,
        0.0,
      ]);
      translate(mvp, mvp, [x, y, 0.0]);
      scale$1(mvp, mvp, [0.61, 0.61, 1.0]);
      this.solidShader.setMat4('mvp', mvp);
      this.centerQuad.draw();
    }
    this.centerQuad.unbind();
    this.solidShader.unbind();
  }

  handleEvent(event) {
    let { cellSize, xCount, yCount, scrollX, scrollY } = this.values;
    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;
    let x = ((w - event.offsetX) / w) * 2.0;
    let y = ((h - event.offsetY) / h) * 2.0;
    let gridX = this.rendererPos[0] * (cellSize / w);
    let gridY = this.rendererPos[1] * (cellSize / h);
    let gridW = (xCount * cellSize) / w;
    let gridH = (yCount * cellSize) / h;
    if (x > gridX && y > gridY && x < gridX + gridW && y < gridY + gridH) {
      let i = Math.floor(((x - gridX) / gridW) * xCount + scrollX / cellSize);
      let j = Math.floor(((y - gridY) / gridH) * yCount + scrollY / cellSize);
      return [i, j, event];
    }
    return undefined;
  }

  updateValues(values) {
    this.values = values;
  }

  setRendererPosition(pos) {
    this.rendererPos = pos;
  }

  setColorTexture(colorTexture) {
    this.colorTexture = colorTexture;
  }

  render() {
    this.prerender();
    if (this.values === undefined) return;
    let {
      scrollX,
      scrollY,
      xCount,
      yCount,
      cellSize,
      warpCount,
      weftCount,
      xStepDistance,
      yStepDistance,
    } = this.values;
    let shouldScrollX = this.shouldScrollX ? 1.0 : 0.0;
    let shouldScrollY = this.shouldScrollY ? 1.0 : 0.0;

    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;

    this.shader.bind();
    this.quad.bind();

    let cw = cellSize / w;
    let ch = cellSize / h;
    let mvp = identity(this.mvp);
    let view = translate(identity(this.view), this.initialView, [
      this.rendererPos[0] * cw,
      this.rendererPos[1] * ch,
      0.0,
    ]);
    scale$1(mvp, view, [
      (cellSize * xCount) / w,
      (cellSize * yCount) / h,
      1.0,
    ]);

    this.colorTexture.bind(0);
    this.shader.setSampler2D('colorSampler', 0);
    this.shader.setVec2('scrollPos', [
      (scrollX / (warpCount * cellSize)) * shouldScrollX,
      (scrollY / (weftCount * cellSize)) * shouldScrollY,
    ]);

    this.shader.setFloat('vert', yCount > xCount ? 1.0 : 0.0);
    this.shader.setFloat(
      'steps',
      yCount > xCount ? yStepDistance : xStepDistance
    );

    this.shader.setVec2('cellSize', [cw / (cw * xCount), ch / (ch * yCount)]);

    this.shader.setMat4('mvp', mvp);
    this.quad.draw();
    this.quad.unbind();
    this.shader.unbind();
  }
}

function create1DGridTexture(gl, data, shafts, length) {
  let gridTexture = new Uint8Array(length * 4);
  for (let i = 0; i < length; i++) {
    let n = i * 4;
    let value = (data[i] / shafts) * 255;
    let absence = 255;
    if (data[i] === null || data[i] === undefined || data[i] === -1) {
      absence = 0;
    }
    gridTexture[n + 0] = value;
    gridTexture[n + 1] = absence;
    gridTexture[n + 2] = value;
    gridTexture[n + 3] = value;
  }
  return new Texture(gl, length, 1, gridTexture);
}

function update1DTexture(gl, texture, index, value, height) {
  let data = new Uint8Array(value.length * 4);
  for (let i = 0; i < value.length; i++) {
    let n = i * 4;
    let dv = (value[i] / height) * 255;
    let absence = 255;
    if (value[i] === null || value[i] === undefined || value[i] === -1) {
      absence = 0;
    }
    data[n + 0] = dv;
    data[n + 1] = absence;
    data[n + 2] = dv;
    data[n + 3] = dv;
  }
  gl.bindTexture(gl.TEXTURE_2D, texture.texture);
  gl.texSubImage2D(
    gl.TEXTURE_2D, // target
    0, // level
    index, // xoffset
    0, // yoffset
    value.length, // width
    1, // height
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    data
  );
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function createGridTexture(gl, data, width, height) {
  let gridTexture = new Uint8Array(width * height * 4);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (data[i][j] === 1) {
        let n = (i * width + j) * 4;
        gridTexture[n + 0] = 255;
        gridTexture[n + 1] = 255;
        gridTexture[n + 2] = 255;
        gridTexture[n + 3] = 255;
      }
    }
  }
  return new Texture(gl, width, height, gridTexture);
}

function createColorTexture(gl, colors, w, yarns) {
  let idToYarn = [];
  for (let i = 0; i < yarns.length; i++) {
    idToYarn[yarns[i].id] = yarns[i];
  }
  let data = new Uint8Array(colors.length * 4);
  for (let i = 0; i < colors.length; i++) {
    let n = i * 4;
    let c = idToYarn[colors[i]].color;
    data[n + 0] = c.r * 255;
    data[n + 1] = c.g * 255;
    data[n + 2] = c.b * 255;
    data[n + 3] = 255;
  }
  return new Texture(gl, w, 1, data);
}

//export function update1DTexture(gl, texture, index, value, height) {
function updateColorTexture(gl, texture, index, colors, yarns) {
  let idToYarn = [];
  for (let i = 0; i < yarns.length; i++) {
    idToYarn[yarns[i].id] = yarns[i];
  }
  let data = new Uint8Array(colors.length * 4);
  for (let i = 0; i < colors.length; i++) {
    let n = i * 4;
    let c = idToYarn[colors[i]].color;
    data[n + 0] = c.r * 255;
    data[n + 1] = c.g * 255;
    data[n + 2] = c.b * 255;
    data[n + 3] = 255;
  }
  gl.bindTexture(gl.TEXTURE_2D, texture.texture);
  gl.texSubImage2D(
    gl.TEXTURE_2D, // target
    0, // level
    index, // xoffset
    0, // yoffset
    colors.length, // width
    1, // height
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    data
  );
  gl.bindTexture(gl.TEXTURE_2D, null);
}

class Renderer {
  showTreadleOrder = true;
  showThreading = true;
  renderNextFrame = false;
  prevDraft = {};
  prevUI = {};
  dependencyGraph = {
    treadleOrder: ['treadleOrder', 'weave'],
    threading: ['threading', 'weave'],
    warpColors: ['warpColors', 'weave'],
    weftColors: ['weftColors', 'weave'],
    tieup: ['tieup', 'weave'],
    shaftCount: 'clear',
    treadleCount: 'clear',
    warpCount: ['threading', 'warpColors', 'weave'],
    weftCount: ['treadleOrder', 'weftColors', 'weave'],
    yarn: ['warpColors', 'weftColors', 'weave'],
    cellSize: 'clear',
    scrollX: ['warpColors', 'threading', 'weave'],
    scrollY: ['weftColors', 'treadleOrder', 'weave'],
  };

  constructor(canvas, scrollContainer) {
    this.scrollContainer = scrollContainer;
    this.gl = canvas.getContext('webgl', {
      premultipliedAlpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.gl.clearColor(1, 1, 1, 1);
    this.shaders = new ShaderBuilder(this.gl);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.SCISSOR_TEST);
    this.startup = true;

    let maxTextureSize = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
    console.log('Max texture size', maxTextureSize);

    this.threadingTexture = new Texture(this.gl, 1, 1, [[0, 0, 0, 0]]);
    this.treadleOrderTexture = new Texture(this.gl, 1, 1, [[0, 0, 0, 0]]);
    this.tieupTexture = new Texture(this.gl, 1, 1, [[0, 0, 0, 0]]);
    this.warpTexture = new Texture(this.gl, 1, 1, [[0, 0, 0, 0]]);
    this.weftTexture = new Texture(this.gl, 1, 1, [[0, 0, 0, 0]]);

    this.resizeCanvas();
    window.addEventListener('beforeunload', () => {
      let extension = this.gl.getExtension('WEBGL_lose_context');
      if (extension) {
        console.log('Trying to free webgl context');
        extension.loseContext();
      }
    });

    this.renderers = {
      tieup: {
        renderer: new TieupRenderer(this.gl, this.shaders, 'tieup'),
        dirty: true,
        enabled: true,
        updateValues: function (draft, ui) {
          this.renderer.updateValues(this.getValues(draft, ui));
        },
        getValues: (draft, ui) => ({
          xCount: draft.treadleCount,
          yCount: draft.shaftCount,
          cellSize: ui.cellSize,
          scrollX: ui.scrollX,
          scrollY: ui.scrollY,
        }),
      },
      threading: {
        renderer: new GridRenderer(
          this.gl,
          this.shaders,
          false,
          true,
          false,
          'threading'
        ),
        updateValues: function (draft, ui) {
          this.renderer.updateValues(this.getValues(draft, ui));
        },
        getValues: (draft, ui) => ({
          xCount: draft.warpCount,
          yCount: draft.shaftCount,
          weftCount: draft.weftCount,
          warpCount: draft.warpCount,
          cellSize: ui.cellSize,
          scrollX: ui.scrollX,
          scrollY: ui.scrollY,
          xStepDistance: ui.xStepDistance,
        }),
        dirty: true,
        enabled: true,
      },
      treadleOrder: {
        renderer: new GridRenderer(
          this.gl,
          this.shaders,
          true,
          false,
          true,
          'treadleOrder'
        ),
        updateValues: function (draft, ui) {
          this.renderer.updateValues(this.getValues(draft, ui));
        },
        getValues: (draft, ui) => ({
          xCount: draft.treadleCount,
          yCount: draft.weftCount,
          weftCount: draft.weftCount,
          warpCount: draft.warpCount,
          cellSize: ui.cellSize,
          scrollX: ui.scrollX,
          scrollY: ui.scrollY,
          yStepDistance: ui.yStepDistance,
        }),
        dirty: true,
        enabled: true,
      },
      warpColors: {
        renderer: new ColorRowRenderer(
          this.gl,
          this.shaders,
          true,
          false,
          'warpColors'
        ),
        updateValues: function (draft, ui) {
          this.renderer.updateValues(this.getValues(draft, ui));
        },
        getValues: (draft, ui) => ({
          xCount: draft.warpCount,
          yCount: 1,
          weftCount: draft.weftCount,
          warpCount: draft.warpCount,
          cellSize: ui.cellSize,
          scrollX: ui.scrollX,
          scrollY: ui.scrollY,
          xStepDistance: ui.xStepDistance,
        }),
        dirty: true,
        enabled: true,
      },
      weftColors: {
        renderer: new ColorRowRenderer(
          this.gl,
          this.shaders,
          false,
          true,
          'weftColors'
        ),
        updateValues: function (draft, ui) {
          this.renderer.updateValues(this.getValues(draft, ui));
        },
        getValues: (draft, ui) => ({
          xCount: 1,
          yCount: draft.weftCount,
          weftCount: draft.weftCount,
          warpCount: draft.warpCount,
          cellSize: ui.cellSize,
          scrollX: ui.scrollX,
          scrollY: ui.scrollY,
          yStepDistance: ui.yStepDistance,
        }),
        dirty: true,
        enabled: true,
      },
      weave: {
        renderer: new WeaveRenderer(this.gl, this.shaders, 'weave'),
        updateValues: function (draft, ui) {
          this.renderer.updateValues(this.getValues(draft, ui));
        },
        getValues: (draft, ui) => ({
          xCount: draft.warpCount,
          yCount: draft.weftCount,
          shaftCount: draft.shaftCount,
          treadleCount: draft.treadleCount,
          cellSize: ui.cellSize,
          scrollX: ui.scrollX,
          scrollY: ui.scrollY,
        }),
        dirty: true,
        enabled: true,
      },
    };
    this.names = Object.keys(this.renderers);

    let listOfRenderers = Object.values(this.renderers);

    // arggh
    window.setTimeout(() => {
      let render = () => {
        if (this.renderNextFrame) {
          for (let i = 0; i < listOfRenderers.length; i++) {
            let r = listOfRenderers[i];
            if (r.dirty && r.enabled) {
              r.renderer.render();
              r.dirty = false;
            }
          }
          this.renderNextFrame = false;
        }
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    });
  }

  setRendererPosition(draft, showTreadleOrder, showThreading) {
    let treadleCount = draft.treadleCount;
    let shaftCount = draft.shaftCount;
    this.showTreadleOrder = showTreadleOrder;
    this.showThreading = showThreading;

    let to = Number(showTreadleOrder);
    let th = Number(showThreading);

    this.renderers.tieup.enabled = showTreadleOrder && showThreading;
    this.renderers.tieup.renderer.setRendererPosition([3, 3]);

    this.renderers.threading.enabled = showThreading;
    this.renderers.threading.renderer.setRendererPosition([
      to * (treadleCount + 3) + 1,
      3,
    ]);

    this.renderers.treadleOrder.enabled = showTreadleOrder;
    this.renderers.treadleOrder.renderer.setRendererPosition([
      3,
      th * (shaftCount + 3) + 1,
    ]);

    this.renderers.weftColors.renderer.setRendererPosition([
      1,
      th * (shaftCount + 3) + 1,
    ]);
    this.renderers.weftColors.enabled = showTreadleOrder;

    this.renderers.warpColors.enabled = showThreading;
    this.renderers.warpColors.renderer.setRendererPosition([
      to * (treadleCount + 3) + 1,
      1,
    ]);
    this.renderers.weave.renderer.setRendererPosition([
      to * (treadleCount + 3) + 1,
      th * (shaftCount + 3) + 1,
    ]);

    this.clear();
  }

  isDifferent(draft, prevDraft, ...args) {
    return args.some((a) => {
      return draft[a] !== prevDraft[a];
    });
  }

  update(draft, ui, changes) {
    if (changes.paths.size) {
      this.updateTextures(draft, changes);

      for (let c of changes.paths) {
        let dependencies;
        if (c === 'clear' || this.dependencyGraph[c] === 'clear') {
          this.clearCanvas();
          dependencies = this.names;
        } else {
          dependencies = this.dependencyGraph[c];
        }
        if (dependencies !== undefined) {
          for (let j = 0; j < dependencies.length; j++) {
            let r = this.renderers[dependencies[j]];
            r.dirty = true;
            r.updateValues(draft, ui);
          }
        }
      }
      changes.clear();
    }
    this.startup = false;
  }

  createThreadingTexture(draft) {
    this.threadingTexture.delete();
    this.threadingTexture = create1DGridTexture(
      this.gl,
      draft.threading,
      draft.shaftCount,
      draft.warpCount
    );
    this.renderers.threading.renderer.setCellToggleTexture(
      this.threadingTexture
    );
    this.renderers.weave.renderer.setThreadingTexture(this.threadingTexture);
  }

  createTreadleOrderTexture(draft) {
    this.treadleOrderTexture.delete();
    this.treadleOrderTexture = create1DGridTexture(
      this.gl,
      draft.treadleOrder,
      draft.treadleCount,
      draft.weftCount
    );
    this.renderers.treadleOrder.renderer.setCellToggleTexture(
      this.treadleOrderTexture
    );
    this.renderers.weave.renderer.setTreadleOrderTexture(
      this.treadleOrderTexture
    );
  }

  createTieupTexture(draft) {
    this.tieupTexture.delete();
    this.tieupTexture = createGridTexture(
      this.gl,
      draft.tieup,
      draft.treadleCount,
      draft.shaftCount
    );
    this.renderers.tieup.renderer.setCellToggleTexture(this.tieupTexture);
    this.renderers.weave.renderer.setTieupTexture(this.tieupTexture);
  }

  createWarpTexture(draft) {
    this.warpTexture.delete();
    this.warpTexture = createColorTexture(
      this.gl,
      draft.warpColors,
      draft.warpColors.length,
      draft.yarn
    );
    this.renderers.warpColors.renderer.setColorTexture(this.warpTexture);
    this.renderers.weave.renderer.setWarpTexture(this.warpTexture);
  }

  createWeftTexture(draft) {
    this.weftTexture.delete();
    this.weftTexture = createColorTexture(
      this.gl,
      draft.weftColors,
      draft.weftColors.length,
      draft.yarn
    );
    this.renderers.weftColors.renderer.setColorTexture(this.weftTexture);
    this.renderers.weave.renderer.setWeftTexture(this.weftTexture);
  }

  getSpan(patches) {
    return patches
      .map((p) => p.path[1])
      .reduce((x, y) => [Math.min(x[0], y), Math.max(x[1], y)], [
        Number.MAX_VALUE,
        Number.MIN_VALUE,
      ]);
  }

  updateValuesInColorTexture(draft, changes, name, texture, height) {
    let patch = changes.patches[name];
    if (patch.every((p) => p.op === 'replace')) {
      let span = this.getSpan(patch);
      let data = draft[name].slice(span[0], span[1] + 1);
      update1DTexture(this.gl, texture, span[0], data, height);
    }
  }

  updateTextures(draft, changes) {
    if (this.startup) {
      this.createThreadingTexture(draft);
      this.createTieupTexture(draft);
      this.createTreadleOrderTexture(draft);
      this.createWarpTexture(draft);
      this.createWeftTexture(draft);
      return;
    }

    if (changes.patches['tieup'] !== undefined) {
      this.createTieupTexture(draft);
    }

    if (changes.patches['shaftCount'] !== undefined) {
      this.createThreadingTexture(draft);
      this.createTieupTexture(draft);
    }

    if (changes.patches['treadleCount'] !== undefined) {
      this.createTreadleOrderTexture(draft);
      this.createTieupTexture(draft);
    }

    if (changes.patches['warpCount'] !== undefined) {
      this.createThreadingTexture(draft);
      this.createWarpTexture(draft);
    }

    if (changes.patches['weftCount'] !== undefined) {
      this.createTreadleOrderTexture(draft);
      this.createWeftTexture(draft);
    }

    if (changes.patches['threading'] !== undefined) {
      let patch = changes.patches.threading;
      if (patch.every((p) => p.op === 'replace')) {
        let span = this.getSpan(patch);
        let data = draft.threading.slice(span[0], span[1] + 1);
        update1DTexture(
          this.gl,
          this.threadingTexture,
          span[0],
          data,
          draft.shaftCount
        );
      }
    } else {
      this.createThreadingTexture(draft);
    }

    if (changes.patches['treadleOrder'] !== undefined) {
      let patch = changes.patches.treadleOrder;
      if (patch.every((p) => p.op === 'replace')) {
        let span = this.getSpan(patch);
        let data = draft.treadleOrder.slice(span[0], span[1] + 1);
        update1DTexture(
          this.gl,
          this.treadleOrderTexture,
          span[0],
          data,
          draft.treadleCount
        );
      }
    } else {
      this.createTreadleOrderTexture(draft);
    }

    if (changes.patches['warpColors'] !== undefined) {
      let patch = changes.patches.warpColors;
      if (patch.every((p) => p.op === 'replace')) {
        let span = this.getSpan(patch);
        let data = draft.warpColors.slice(span[0], span[1] + 1);
        updateColorTexture(
          this.gl,
          this.warpTexture,
          span[0],
          data,
          draft.yarn
        );
      } else {
        this.createWarpTexture(draft);
      }
    }

    if (changes.patches['weftColors'] !== undefined) {
      let patch = changes.patches.weftColors;
      if (patch.every((p) => p.op === 'replace')) {
        let span = this.getSpan(patch);
        let data = draft.weftColors.slice(span[0], span[1] + 1);
        updateColorTexture(
          this.gl,
          this.weftTexture,
          span[0],
          data,
          draft.yarn
        );
      } else {
        this.createWeftTexture(draft);
      }
    }

    if (changes.patches['yarn'] !== undefined) {
      this.createWarpTexture(draft);
      this.createWeftTexture(draft);
    }
  }

  getRenderer(name) {
    return this.renderers[name].renderer;
  }

  getRendererByPos(pos) {
    for (let i = 0; i < this.names.length; i++) {
      let name = this.names[i];
      if (
        this.renderers[name].renderer.isWithinGrid(pos) &&
        this.renderers[name].enabled
      ) {
        return this.renderers[name].renderer;
      }
    }
    return undefined;
  }

  resizeCanvas() {
    this.width = this.gl.canvas.width;
    this.height = this.gl.canvas.height;
    this.gl.viewport(0, 0, this.width, this.height);
  }

  addEventListener(name, func) {
    this.scrollContainer.addEventListener(name, func);
  }

  render() {
    this.renderNextFrame = true;
  }

  clearCanvas() {
    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;
    this.gl.scissor(0, 0, w, h);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  clear() {
    this.clearCanvas();
    Object.values(this.renderers).forEach((r) => (r.dirty = true));
    this.render();
  }
}

/* src/pages/Editor/WeaveDisplay/WeaveDisplay.svelte generated by Svelte v3.43.0 */

const { console: console_1 } = globals;
const file$6 = "src/pages/Editor/WeaveDisplay/WeaveDisplay.svelte";

function create_fragment$6(ctx) {
	let canvas_1;

	const block = {
		c: function create() {
			canvas_1 = element("canvas");
			attr_dev(canvas_1, "class", "weave-display svelte-7nbm36");
			add_location(canvas_1, file$6, 355, 0, 9371);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, canvas_1, anchor);
			/*canvas_1_binding*/ ctx[16](canvas_1);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(canvas_1);
			/*canvas_1_binding*/ ctx[16](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function linePointsChanged(left, right) {
	if (left.length !== right.length) {
		return true;
	}

	for (let i = 0; i < left.length; i++) {
		if (left[i] !== right[i]) {
			return true;
		}
	}

	return false;
}

function instance$6($$self, $$props, $$invalidate) {
	let scroll;
	let selectedColor;
	let cellSize;
	let isSelecting;
	let showTreadleOrder;
	let showThreading;
	let selectedMenu;
	let $draft;
	let $ui;
	let $selection;
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(13, $draft = $$value));
	validate_store(ui$1, 'ui');
	component_subscribe($$self, ui$1, $$value => $$invalidate(14, $ui = $$value));
	validate_store(selection$1, 'selection');
	component_subscribe($$self, selection$1, $$value => $$invalidate(15, $selection = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('WeaveDisplay', slots, []);
	let { scrollContainer } = $$props;
	let renderer;
	let canvas;
	let drag;
	let linePoints;
	let oldLinePoints = [];
	let cancelled = false;
	let oldP = [];
	let mouseDownOriginator;
	let startPos;
	let endPos;
	let startScroll;
	let oldScroll = [];
	let dragMaybe;

	function shouldStartDrag(event) {
		let ret = drag === undefined && event.buttons & 1 !== 0 && (event.movementX !== 0 || event.movementY !== 0) && dragMaybe && !isSelecting;

		if (ret === true) {
			dragMaybe = false;
		}

		return ret;
	}

	onMount(() => {
		$$invalidate(5, renderer = new Renderer(canvas, scrollContainer));
		syncCanvasDimensions();

		if (listenerQueue.length !== 0) {
			for (let item of listenerQueue) {
				renderer.addEventListener(item.name, item.func);
			}

			listenerQueue = [];
		}

		renderer.addEventListener('pointerdown', e => {
			if (selectedMenu !== -1) {
				return;
			}

			if (e.button === 2) {
				e.preventDefault();
				cancelled = true;
				handleRightclick(e);
			} else {
				startPos = [e.offsetX, e.offsetY];
				startScroll = [...scroll];
				dragMaybe = true;
				mouseDownOriginator = renderer.getRendererByPos(startPos)?.name;
			}
		});

		renderer.addEventListener('pointermove', e => {
			//console.log('pos', [e.offsetX, e.offsetY]);
			setHover(e);

			if (shouldStartDrag(e)) {
				let rendererName = renderer.getRendererByPos(startPos)?.name;

				if (rendererName !== undefined && rendererName !== 'weave') {
					$$invalidate(6, drag = rendererName);

					ui$1.update(draft => {
						draft.isDragging = true;
					});
				}
			}

			if (drag !== undefined && drag !== 'weave') {
				endPos = [e.offsetX, e.offsetY];

				let startPosScroll = [
					startPos[0] + (scroll[0] - startScroll[0]) / 2.0,
					startPos[1] + (scroll[1] - startScroll[1]) / 2.0
				];

				$$invalidate(7, linePoints = renderer.getRenderer(drag).getCellsBetweenPoints(startPosScroll, endPos));

				if (!drag.includes('Color')) {
					if (drag === 'tieup') {
						if (linePointsChanged(linePoints, oldLinePoints)) {
							renderer.getRenderer(drag).renderPoints(linePoints);
						}

						oldLinePoints = linePoints;
					} else {
						let p = pointsToArray(linePoints);

						if (linePointsChanged(p, oldP)) {
							renderer.getRenderer(drag).renderPoints(p);
						}

						oldP = p;
					}
				} else {
					if (linePointsChanged(linePoints, oldLinePoints)) {
						let color = $draft.yarn.find(y => y.id === selectedColor).color;
						renderer.getRenderer(drag).renderPoints(...linePoints, color);
					}

					ui$1.update(draft => {
						draft.selectFrom = linePoints[0];
						draft.selectTo = linePoints[1];
					});

					oldLinePoints = linePoints;
				}
			}
		});

		renderer.addEventListener('pointerup', e => {
			if (drag !== undefined) {
				switch (drag) {
					case 'warpColors':
					case 'weftColors':
						updateColor(drag, linePoints[0], linePoints[1], $ui.selectedColor);
						renderer.clear();
						break;
					case 'treadleOrder':
					case 'threading':
						{
							let lp = pointsToArray(linePoints);
							updateListWithLine(drag, lp);
							break;
						}
					case 'tieup':
						updateTieupWithPoints(linePoints);
						break;
				}
			} else if (!isSelecting && cancelled === false) {
				// Regular click without drag
				let pos = [e.offsetX, e.offsetY];

				let name = renderer.getRendererByPos(pos)?.name;

				if (name === undefined || name !== mouseDownOriginator) {
					mouseDownOriginator = undefined;
				} else {
					let cell = renderer.getRenderer(name).getCellAtPos(pos);

					switch (name) {
						case 'warpColors':
							updateColor(name, cell[0], cell[0], selectedColor);
							break;
						case 'weftColors':
							updateColor(name, cell[1], cell[1], selectedColor);
							break;
						case 'threading':
							updateGrid(name, cell[0], cell[1]);
							break;
						case 'treadleOrder':
							updateGrid(name, cell[1], cell[0]);
							break;
						case 'tieup':
							toggleTieup(cell[1], cell[0]);
							break;
					}
				}
			}

			stopDrag();
			cancelled = false;
			mouseDownOriginator = undefined;
		});

		document.addEventListener('keydown', e => {
			if (e.key === 'Escape' && drag !== undefined) {
				event.stopPropagation();
				stopDrag();
			}
		});

		document.addEventListener('visibilitychange', () => {
			if (!document.hidden) {
				renderer.clear();
			}
		});
	});

	function updateGrid(name, index, value) {
		draft$1.update(temp => {
			temp[name][index] = temp[name][index] === value ? -1 : value;
		});
	}

	function updateTieupWithPoints(linePoints) {
		draft$1.update(temp => {
			linePoints.forEach(p => {
				temp.tieup[p[1]][p[0]] = 1;
			});
		});
	}

	function updateColor(name, colorStart, colorEnd, selectedColor) {
		if (colorEnd < colorStart) {
			[colorStart, colorEnd] = [colorEnd, colorStart];
		}

		draft$1.update(temp => {
			for (let i = 0; i < colorEnd - colorStart + 1; i++) {
				temp[name][colorStart + i] = selectedColor;
			}
		});
	}

	function updateListWithLine(name, lp) {
		draft$1.update(temp => {
			lp.forEach((p, i) => temp[name][i] = p);
		});
	}

	function toggleTieup(x, y) {
		draft$1.update(temp => {
			temp.tieup[x][y] = temp.tieup[x][y] === 1 ? 0 : 1;
		});
	}

	function pointsToArray(lp) {
		let ret = [];

		lp.forEach(p => {
			if (drag === 'treadleOrder') {
				ret[p[1]] = p[0];
			} else if (drag === 'threading') {
				ret[p[0]] = p[1];
			}
		});

		return ret;
	}

	function stopDrag() {
		if (drag !== undefined) {
			renderer.getRenderer(drag).render();
			$$invalidate(6, drag = undefined);
			cancelled = true;

			ui$1.update(draft => {
				draft.isDragging = false;
			});
		}
	}

	function setHover(event) {
		let pos = [event.offsetX, event.offsetY];
		let r = renderer.getRendererByPos(pos);

		if (r) {
			let cell = r.getCellAtPos(pos);

			if (cell[0] !== $ui.hoverCell[0] || cell[1] !== $ui.hoverCell[1]) {
				ui$1.update(draft => {
					draft.hoverCell = cell;
				});
			}
		}
	}

	function handleRightclick(event) {
		let pos = [event.offsetX, event.offsetY];
		let r = renderer.getRendererByPos(pos);

		if (r) {
			switch (r.name) {
				case 'warpColors':
					{
						let cell = r.getCellAtPos(pos);
						let c = $draft[r.name][cell[0]];
						console.log(c);

						ui$1.update(draft => {
							draft.selectedColor = c;
						});

						break;
					}
				case 'weftColors':
					{
						let cell = r.getCellAtPos(pos);
						let c = $draft[r.name][cell[1]];

						ui$1.update(draft => {
							draft.selectedColor = c;
						});

						break;
					}
			}
		}
	}

	function syncCanvasDimensions() {
		$$invalidate(0, canvas.width = canvas.offsetWidth, canvas);
		$$invalidate(0, canvas.height = canvas.offsetHeight, canvas);
		renderer.resizeCanvas();
		renderer.clear();
	}

	let listenerQueue = [];

	function addEventListener(name, func) {
		if (renderer !== undefined) {
			renderer.addEventListener(name, func);
		} else {
			listenerQueue.push({ name, func });
		}
	}

	const writable_props = ['scrollContainer'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<WeaveDisplay> was created with unknown prop '${key}'`);
	});

	function canvas_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			canvas = $$value;
			$$invalidate(0, canvas);
		});
	}

	$$self.$$set = $$props => {
		if ('scrollContainer' in $$props) $$invalidate(1, scrollContainer = $$props.scrollContainer);
	};

	$$self.$capture_state = () => ({
		onMount,
		draft: draft$1,
		changes,
		selection: selection$1,
		ui: ui$1,
		Renderer,
		scrollContainer,
		renderer,
		canvas,
		drag,
		linePoints,
		oldLinePoints,
		cancelled,
		oldP,
		mouseDownOriginator,
		startPos,
		endPos,
		startScroll,
		oldScroll,
		dragMaybe,
		shouldStartDrag,
		updateGrid,
		updateTieupWithPoints,
		updateColor,
		updateListWithLine,
		toggleTieup,
		linePointsChanged,
		pointsToArray,
		stopDrag,
		setHover,
		handleRightclick,
		syncCanvasDimensions,
		listenerQueue,
		addEventListener,
		selectedColor,
		isSelecting,
		scroll,
		selectedMenu,
		showThreading,
		showTreadleOrder,
		cellSize,
		$draft,
		$ui,
		$selection
	});

	$$self.$inject_state = $$props => {
		if ('scrollContainer' in $$props) $$invalidate(1, scrollContainer = $$props.scrollContainer);
		if ('renderer' in $$props) $$invalidate(5, renderer = $$props.renderer);
		if ('canvas' in $$props) $$invalidate(0, canvas = $$props.canvas);
		if ('drag' in $$props) $$invalidate(6, drag = $$props.drag);
		if ('linePoints' in $$props) $$invalidate(7, linePoints = $$props.linePoints);
		if ('oldLinePoints' in $$props) oldLinePoints = $$props.oldLinePoints;
		if ('cancelled' in $$props) cancelled = $$props.cancelled;
		if ('oldP' in $$props) oldP = $$props.oldP;
		if ('mouseDownOriginator' in $$props) mouseDownOriginator = $$props.mouseDownOriginator;
		if ('startPos' in $$props) startPos = $$props.startPos;
		if ('endPos' in $$props) endPos = $$props.endPos;
		if ('startScroll' in $$props) startScroll = $$props.startScroll;
		if ('oldScroll' in $$props) $$invalidate(8, oldScroll = $$props.oldScroll);
		if ('dragMaybe' in $$props) dragMaybe = $$props.dragMaybe;
		if ('listenerQueue' in $$props) listenerQueue = $$props.listenerQueue;
		if ('selectedColor' in $$props) $$invalidate(9, selectedColor = $$props.selectedColor);
		if ('isSelecting' in $$props) isSelecting = $$props.isSelecting;
		if ('scroll' in $$props) $$invalidate(10, scroll = $$props.scroll);
		if ('selectedMenu' in $$props) selectedMenu = $$props.selectedMenu;
		if ('showThreading' in $$props) $$invalidate(11, showThreading = $$props.showThreading);
		if ('showTreadleOrder' in $$props) $$invalidate(12, showTreadleOrder = $$props.showTreadleOrder);
		if ('cellSize' in $$props) cellSize = $$props.cellSize;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*$ui*/ 16384) {
			$$invalidate(10, scroll = [$ui.scrollX, $ui.scrollY]);
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 16384) {
			$$invalidate(9, selectedColor = $ui.selectedColor);
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 16384) {
			cellSize = $ui.cellSize;
		}

		if ($$self.$$.dirty[0] & /*$selection*/ 32768) {
			isSelecting = $selection.isSelecting;
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 16384) {
			$$invalidate(12, showTreadleOrder = $ui.showTreadleOrder);
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 16384) {
			$$invalidate(11, showThreading = $ui.showThreading);
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 16384) {
			selectedMenu = $ui.selectedMenu;
		}

		if ($$self.$$.dirty[0] & /*renderer, $draft, showTreadleOrder, showThreading*/ 14368) {
			{
				if (renderer) {
					renderer.setRendererPosition($draft, showTreadleOrder, showThreading);
				}
			}
		}

		if ($$self.$$.dirty[0] & /*renderer, $draft, $ui*/ 24608) {
			{
				if (renderer) {
					renderer.update($draft, $ui, changes);

					try {
						renderer.render();
					} catch(e) {
						console.error(e);
					}
				}
			}
		}

		if ($$self.$$.dirty[0] & /*renderer, drag, scroll, oldScroll, $draft, selectedColor, linePoints*/ 10208) {
			{
				if (renderer !== undefined && drag !== undefined && (scroll[0] !== oldScroll[0] || scroll[1] !== oldScroll[1])) {
					if (drag.includes('Color')) {
						let color = $draft.yarn[selectedColor].color;
						renderer.getRenderer(drag).renderPoints(...linePoints, color);
					} else {
						renderer.getRenderer(drag).renderPoints(linePoints);
					}
				}

				$$invalidate(8, oldScroll = scroll);
			}
		}
	};

	return [
		canvas,
		scrollContainer,
		setHover,
		syncCanvasDimensions,
		addEventListener,
		renderer,
		drag,
		linePoints,
		oldScroll,
		selectedColor,
		scroll,
		showThreading,
		showTreadleOrder,
		$draft,
		$ui,
		$selection,
		canvas_1_binding
	];
}

class WeaveDisplay extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(
			this,
			options,
			instance$6,
			create_fragment$6,
			not_equal,
			{
				scrollContainer: 1,
				setHover: 2,
				syncCanvasDimensions: 3,
				addEventListener: 4
			},
			null,
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "WeaveDisplay",
			options,
			id: create_fragment$6.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*scrollContainer*/ ctx[1] === undefined && !('scrollContainer' in props)) {
			console_1.warn("<WeaveDisplay> was created without expected prop 'scrollContainer'");
		}
	}

	get scrollContainer() {
		throw new Error("<WeaveDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set scrollContainer(value) {
		throw new Error("<WeaveDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get setHover() {
		return this.$$.ctx[2];
	}

	set setHover(value) {
		throw new Error("<WeaveDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get syncCanvasDimensions() {
		return this.$$.ctx[3];
	}

	set syncCanvasDimensions(value) {
		throw new Error("<WeaveDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get addEventListener() {
		return this.$$.ctx[4];
	}

	set addEventListener(value) {
		throw new Error("<WeaveDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/pages/Editor/Selection/SelectionComponent.svelte generated by Svelte v3.43.0 */

const { Object: Object_1 } = globals;
const file$5 = "src/pages/Editor/Selection/SelectionComponent.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[42] = list[i];
	return child_ctx;
}

// (290:0) {#if isSelecting}
function create_if_block$2(ctx) {
	let div;
	let mounted;
	let dispose;
	let each_value = /*selections*/ ctx[2];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "class", "selections");
			add_location(div, file$5, 290, 2, 8939);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			if (!mounted) {
				dispose = listen_dev(div, "pointermove", /*routeMoveEvent*/ ctx[5], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*selections, containerMouseDown, $selection, weaveApplied, toggleSelection, hasLength, isDragging*/ 463) {
				each_value = /*selections*/ ctx[2];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(290:0) {#if isSelecting}",
		ctx
	});

	return block;
}

// (299:8) {#if isDragging}
function create_if_block_2$1(ctx) {
	let div;
	let div_style_value;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "style", div_style_value = toCssString(/*selectionItem*/ ctx[42].dragMarker));
			attr_dev(div, "class", "current-selection-marker svelte-vd1v9m");
			add_location(div, file$5, 299, 10, 9307);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*selections*/ 4 && div_style_value !== (div_style_value = toCssString(/*selectionItem*/ ctx[42].dragMarker))) {
				attr_dev(div, "style", div_style_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(299:8) {#if isDragging}",
		ctx
	});

	return block;
}

// (305:8) {#if hasLength}
function create_if_block_1$1(ctx) {
	let div;
	let div_style_value;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[25](/*selectionItem*/ ctx[42]);
	}

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", "" + (null_to_empty('selection-overlay') + " svelte-vd1v9m"));
			attr_dev(div, "style", div_style_value = toCssString(/*selectionItem*/ ctx[42].selectionArea));
			toggle_class(div, "applied", /*$selection*/ ctx[0][/*selectionItem*/ ctx[42].name] || /*weaveApplied*/ ctx[8](/*selectionItem*/ ctx[42].name));
			add_location(div, file$5, 305, 10, 9476);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (!mounted) {
				dispose = listen_dev(div, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*selections*/ 4 && div_style_value !== (div_style_value = toCssString(/*selectionItem*/ ctx[42].selectionArea))) {
				attr_dev(div, "style", div_style_value);
			}

			if (dirty[0] & /*$selection, selections, weaveApplied*/ 261) {
				toggle_class(div, "applied", /*$selection*/ ctx[0][/*selectionItem*/ ctx[42].name] || /*weaveApplied*/ ctx[8](/*selectionItem*/ ctx[42].name));
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(305:8) {#if hasLength}",
		ctx
	});

	return block;
}

// (292:4) {#each selections as selectionItem}
function create_each_block$1(ctx) {
	let div;
	let t0;
	let t1;
	let div_data_name_value;
	let div_class_value;
	let div_style_value;
	let mounted;
	let dispose;
	let if_block0 = /*isDragging*/ ctx[1] && create_if_block_2$1(ctx);
	let if_block1 = /*hasLength*/ ctx[3] && create_if_block_1$1(ctx);

	function pointerdown_handler(...args) {
		return /*pointerdown_handler*/ ctx[26](/*selectionItem*/ ctx[42], ...args);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			attr_dev(div, "data-name", div_data_name_value = /*selectionItem*/ ctx[42].name);
			attr_dev(div, "class", div_class_value = "" + (null_to_empty('selection ' + /*selectionItem*/ ctx[42].name) + " svelte-vd1v9m"));
			attr_dev(div, "style", div_style_value = toCssString(/*selectionItem*/ ctx[42].canvasArea));
			add_location(div, file$5, 292, 6, 9042);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block0) if_block0.m(div, null);
			append_dev(div, t0);
			if (if_block1) if_block1.m(div, null);
			append_dev(div, t1);

			if (!mounted) {
				dispose = listen_dev(div, "pointerdown", pointerdown_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (/*isDragging*/ ctx[1]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2$1(ctx);
					if_block0.c();
					if_block0.m(div, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*hasLength*/ ctx[3]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1$1(ctx);
					if_block1.c();
					if_block1.m(div, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty[0] & /*selections*/ 4 && div_data_name_value !== (div_data_name_value = /*selectionItem*/ ctx[42].name)) {
				attr_dev(div, "data-name", div_data_name_value);
			}

			if (dirty[0] & /*selections*/ 4 && div_class_value !== (div_class_value = "" + (null_to_empty('selection ' + /*selectionItem*/ ctx[42].name) + " svelte-vd1v9m"))) {
				attr_dev(div, "class", div_class_value);
			}

			if (dirty[0] & /*selections*/ 4 && div_style_value !== (div_style_value = toCssString(/*selectionItem*/ ctx[42].canvasArea))) {
				attr_dev(div, "style", div_style_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(292:4) {#each selections as selectionItem}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let if_block_anchor;
	let if_block = /*isSelecting*/ ctx[4] && create_if_block$2(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty$1();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (/*isSelecting*/ ctx[4]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function swap(a, b, i) {
	if (a[i] > b[i]) {
		let t = b[i];
		b[i] = a[i];
		a[i] = t;
	}
}

function toCssString(obj) {
	return Object.entries(obj).reduce((a, b) => a + '; ' + b.join(': '), '');
}

function instance$5($$self, $$props, $$invalidate) {
	let cellSize;
	let shaftCount;
	let treadleCount;
	let threadingPosition;
	let treadleOrderPosition;
	let warpColorsPosition;
	let weftColorsPosition;
	let weavePosition;
	let isSelecting;
	let selectedThreading;
	let to;
	let from;
	let appliedSelections;
	let hasLength;
	let useThreading;
	let useTreadleOrder;
	let useWarpColors;
	let useWeftColors;
	let scrollX;
	let scrollY;
	let showTreadleOrder;
	let showThreading;
	let dragSelection;
	let selections;
	let $selection;
	let $ui;
	let $draft;
	validate_store(selection$1, 'selection');
	component_subscribe($$self, selection$1, $$value => $$invalidate(0, $selection = $$value));
	validate_store(ui$1, 'ui');
	component_subscribe($$self, ui$1, $$value => $$invalidate(23, $ui = $$value));
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(24, $draft = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('SelectionComponent', slots, []);
	let { weaveDisplay } = $$props;

	function routeMoveEvent(event) {
		weaveDisplay.setHover(event);
	}

	function getSelection(fromCoord, toCoord) {
		let origin = [0, 0];

		if (fromCoord[0] > toCoord[0]) {
			fromCoord = copy(create(), fromCoord);
			toCoord = copy(create(), toCoord);
			swap(fromCoord, toCoord, 0);
		}

		if (fromCoord[1] > toCoord[1]) {
			fromCoord = copy(create(), fromCoord);
			toCoord = copy(create(), toCoord);
			swap(fromCoord, toCoord, 1);
		}

		if (dist(origin, fromCoord) > dist(origin, toCoord)) {
			[fromCoord, toCoord] = [toCoord, fromCoord];
		}

		let fromOrigin = create();
		sub(fromOrigin, fromCoord, origin);
		scale(fromOrigin, fromOrigin, 1 / cellSize);
		fromOrigin = fromOrigin.map(v => Math.max(0, v)).map(Math.floor);
		let toOrigin = create();
		sub(toOrigin, toCoord, origin);
		scale(toOrigin, toOrigin, 1 / cellSize);
		toOrigin = toOrigin.map(Math.ceil);
		return { from: fromOrigin, to: toOrigin };
	}

	let isDragging;
	let containerFrom = [0, 0];
	let currentSelection;

	function containerMouseDown(event, name) {
		let rect = event.target.getBoundingClientRect();

		if (event.shiftKey) {
			let containerTo = [
				rect.width - event.offsetX + scrollX,
				rect.height - event.offsetY + scrollY
			];

			let mouseOverElement = document.elementFromPoint(event.pageX, event.pageY);
			let selection = getSelection(containerFrom, containerTo);
			let targetName = mouseOverElement.getAttribute('data-name');
			updateSelection(selection, targetName);
			return;
		}

		currentSelection = name;
		containerFrom = [rect.width - event.offsetX + scrollX, rect.height - event.offsetY + scrollY];
		document.body.addEventListener('pointermove', containerMouseMove);
		document.body.addEventListener('pointerup', containerMouseUp);
	}

	function containerMouseMove(event) {
		let rect = event.target.getBoundingClientRect();
		let containerTo = [rect.width - event.offsetX + scrollX, rect.height - event.offsetY + scrollY];
		$$invalidate(1, isDragging = true);
		$$invalidate(12, dragSelection = getSelection(containerFrom, containerTo));
	}

	function containerMouseUp(event) {
		let rect = event.target.getBoundingClientRect();
		let containerTo = [rect.width - event.offsetX + scrollX, rect.height - event.offsetY + scrollY];
		let mouseOverElement = document.elementFromPoint(event.pageX, event.pageY);
		let targetName = mouseOverElement.getAttribute('data-name');
		let newSelection = getSelection(containerFrom, containerTo);
		updateSelection(newSelection, targetName);
		stopContainerDrag();
	}

	function updateSelection(newSelection, targetName) {
		selection$1.update(temp => {
			temp.to = newSelection.to;
			temp.from = newSelection.from;

			if (targetName === 'weave') {
				temp.useThreading = true;
				temp.useWarpColors = true;
				temp.useTreadleOrder = true;
				temp.useWeftColors = true;
			} else {
				temp.useThreading = false;
				temp.useWarpColors = false;
				temp.useTreadleOrder = false;
				temp.useWeftColors = false;
				temp[currentSelection] = true;
			}

			if (targetName !== 'weave' && targetName !== currentSelection) {
				temp[targetName] = true;
			}
		});
	}

	function toggleSelection(name) {
		if (name !== 'weave') {
			selection$1.update(temp => {
				temp[name] = !temp[name];
			});
		}
	}

	function stopContainerDrag() {
		$$invalidate(1, isDragging = false);
		document.body.removeEventListener('pointermove', containerMouseMove);
		document.body.removeEventListener('pointerup', containerMouseUp);
	}

	function weaveApplied(name) {
		return name === 'weave' && $selection.useThreading && $selection.useTreadleOrder && $selection.useWarpColors && $selection.useWeftColors;
	}

	const writable_props = ['weaveDisplay'];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectionComponent> was created with unknown prop '${key}'`);
	});

	const click_handler = selectionItem => toggleSelection(selectionItem.name);
	const pointerdown_handler = (selectionItem, e) => containerMouseDown(e, selectionItem.name);

	$$self.$$set = $$props => {
		if ('weaveDisplay' in $$props) $$invalidate(9, weaveDisplay = $$props.weaveDisplay);
	};

	$$self.$capture_state = () => ({
		vec2,
		selection: selection$1,
		ui: ui$1,
		draft: draft$1,
		weaveDisplay,
		routeMoveEvent,
		swap,
		getSelection,
		isDragging,
		containerFrom,
		currentSelection,
		containerMouseDown,
		containerMouseMove,
		containerMouseUp,
		updateSelection,
		toggleSelection,
		stopContainerDrag,
		toCssString,
		weaveApplied,
		scrollY,
		scrollX,
		dragSelection,
		cellSize,
		from,
		to,
		weavePosition,
		weftColorsPosition,
		warpColorsPosition,
		treadleCount,
		treadleOrderPosition,
		shaftCount,
		threadingPosition,
		selections,
		showThreading,
		showTreadleOrder,
		useWeftColors,
		useWarpColors,
		useTreadleOrder,
		useThreading,
		hasLength,
		appliedSelections,
		selectedThreading,
		isSelecting,
		$selection,
		$ui,
		$draft
	});

	$$self.$inject_state = $$props => {
		if ('weaveDisplay' in $$props) $$invalidate(9, weaveDisplay = $$props.weaveDisplay);
		if ('isDragging' in $$props) $$invalidate(1, isDragging = $$props.isDragging);
		if ('containerFrom' in $$props) containerFrom = $$props.containerFrom;
		if ('currentSelection' in $$props) currentSelection = $$props.currentSelection;
		if ('scrollY' in $$props) $$invalidate(10, scrollY = $$props.scrollY);
		if ('scrollX' in $$props) $$invalidate(11, scrollX = $$props.scrollX);
		if ('dragSelection' in $$props) $$invalidate(12, dragSelection = $$props.dragSelection);
		if ('cellSize' in $$props) $$invalidate(13, cellSize = $$props.cellSize);
		if ('from' in $$props) $$invalidate(14, from = $$props.from);
		if ('to' in $$props) $$invalidate(15, to = $$props.to);
		if ('weavePosition' in $$props) $$invalidate(16, weavePosition = $$props.weavePosition);
		if ('weftColorsPosition' in $$props) $$invalidate(17, weftColorsPosition = $$props.weftColorsPosition);
		if ('warpColorsPosition' in $$props) $$invalidate(18, warpColorsPosition = $$props.warpColorsPosition);
		if ('treadleCount' in $$props) $$invalidate(19, treadleCount = $$props.treadleCount);
		if ('treadleOrderPosition' in $$props) $$invalidate(20, treadleOrderPosition = $$props.treadleOrderPosition);
		if ('shaftCount' in $$props) $$invalidate(21, shaftCount = $$props.shaftCount);
		if ('threadingPosition' in $$props) $$invalidate(22, threadingPosition = $$props.threadingPosition);
		if ('selections' in $$props) $$invalidate(2, selections = $$props.selections);
		if ('showThreading' in $$props) showThreading = $$props.showThreading;
		if ('showTreadleOrder' in $$props) showTreadleOrder = $$props.showTreadleOrder;
		if ('useWeftColors' in $$props) useWeftColors = $$props.useWeftColors;
		if ('useWarpColors' in $$props) useWarpColors = $$props.useWarpColors;
		if ('useTreadleOrder' in $$props) useTreadleOrder = $$props.useTreadleOrder;
		if ('useThreading' in $$props) useThreading = $$props.useThreading;
		if ('hasLength' in $$props) $$invalidate(3, hasLength = $$props.hasLength);
		if ('appliedSelections' in $$props) appliedSelections = $$props.appliedSelections;
		if ('selectedThreading' in $$props) selectedThreading = $$props.selectedThreading;
		if ('isSelecting' in $$props) $$invalidate(4, isSelecting = $$props.isSelecting);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*$ui*/ 8388608) {
			$$invalidate(13, cellSize = $ui.cellSize / 2.0);
		}

		if ($$self.$$.dirty[0] & /*$draft*/ 16777216) {
			$$invalidate(21, shaftCount = $draft.shaftCount);
		}

		if ($$self.$$.dirty[0] & /*$draft*/ 16777216) {
			$$invalidate(19, treadleCount = $draft.treadleCount);
		}

		if ($$self.$$.dirty[0] & /*treadleCount*/ 524288) {
			$$invalidate(22, threadingPosition = [treadleCount + 4, 3]);
		}

		if ($$self.$$.dirty[0] & /*shaftCount*/ 2097152) {
			$$invalidate(20, treadleOrderPosition = [3, shaftCount + 4]);
		}

		if ($$self.$$.dirty[0] & /*treadleCount*/ 524288) {
			$$invalidate(18, warpColorsPosition = [treadleCount + 4, 1]);
		}

		if ($$self.$$.dirty[0] & /*shaftCount*/ 2097152) {
			$$invalidate(17, weftColorsPosition = [1, shaftCount + 4]);
		}

		if ($$self.$$.dirty[0] & /*treadleCount, shaftCount*/ 2621440) {
			$$invalidate(16, weavePosition = [treadleCount + 4, shaftCount + 4]);
		}

		if ($$self.$$.dirty[0] & /*$selection*/ 1) {
			$$invalidate(4, isSelecting = $selection.isSelecting);
		}

		if ($$self.$$.dirty[0] & /*$selection*/ 1) {
			selectedThreading = $selection.threading;
		}

		if ($$self.$$.dirty[0] & /*$selection*/ 1) {
			$$invalidate(15, to = $selection.to);
		}

		if ($$self.$$.dirty[0] & /*$selection*/ 1) {
			$$invalidate(14, from = $selection.from);
		}

		if ($$self.$$.dirty[0] & /*$selection*/ 1) {
			$$invalidate(3, hasLength = $selection.to[0] - $selection.from[0] > 0 && $selection.to[1] - $selection.from[1] > 0);
		}

		if ($$self.$$.dirty[0] & /*$selection*/ 1) {
			useThreading = $selection.useThreading;
		}

		if ($$self.$$.dirty[0] & /*$selection*/ 1) {
			useTreadleOrder = $selection.useTreadleOrder;
		}

		if ($$self.$$.dirty[0] & /*$selection*/ 1) {
			useWarpColors = $selection.useWarpColors;
		}

		if ($$self.$$.dirty[0] & /*$selection*/ 1) {
			useWeftColors = $selection.useWeftColors;
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 8388608) {
			$$invalidate(11, scrollX = $ui.scrollX / 2.0);
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 8388608) {
			$$invalidate(10, scrollY = $ui.scrollY / 2.0);
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 8388608) {
			showTreadleOrder = $ui.showTreadleOrder;
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 8388608) {
			showThreading = $ui.showThreading;
		}

		if ($$self.$$.dirty[0] & /*threadingPosition, cellSize, shaftCount, to, from, scrollX, dragSelection, treadleOrderPosition, treadleCount, scrollY, warpColorsPosition, weftColorsPosition, weavePosition*/ 8387584) {
			$$invalidate(2, selections = [
				{
					name: 'useThreading',
					canvasArea: {
						left: 0,
						right: `${threadingPosition[0] * cellSize}px`,
						bottom: `${threadingPosition[1] * cellSize}px`,
						height: `${shaftCount * cellSize}px`
					},
					selectionArea: {
						width: `${cellSize * (to[0] - from[0])}px`,
						height: `${cellSize * shaftCount}px`,
						right: `${from[0] * cellSize - scrollX}px`,
						bottom: 0
					},
					dragMarker: {
						width: `${cellSize * (dragSelection.to[0] - dragSelection.from[0])}px`,
						height: `${cellSize * shaftCount}px`,
						right: `${dragSelection.from[0] * cellSize - scrollX}px`,
						bottom: 0
					}
				},
				{
					name: 'useTreadleOrder',
					dir: 'vert',
					canvasArea: {
						top: 0,
						right: `${treadleOrderPosition[0] * cellSize}px`,
						bottom: `${treadleOrderPosition[1] * cellSize}px`,
						width: `${treadleCount * cellSize}px`
					},
					selectionArea: {
						width: `${cellSize * treadleCount}px`,
						height: `${(to[1] - from[1]) * cellSize}px`,
						bottom: `${from[1] * cellSize - scrollY}px`
					},
					dragMarker: {
						width: `${cellSize * treadleCount}px`,
						height: `${(dragSelection.to[1] - dragSelection.from[1]) * cellSize}px`,
						bottom: `${dragSelection.from[1] * cellSize - scrollY}px`
					}
				},
				{
					name: 'useWarpColors',
					canvasArea: {
						height: `${cellSize}px`,
						right: `${warpColorsPosition[0] * cellSize}px`,
						bottom: `${warpColorsPosition[1] * cellSize}px`,
						left: 0
					},
					selectionArea: {
						width: `${(to[0] - from[0]) * cellSize}px`,
						height: `${cellSize}px`,
						right: `${from[0] * cellSize - scrollX}px`
					},
					dragMarker: {
						width: `${cellSize * (dragSelection.to[0] - dragSelection.from[0])}px`,
						right: `${cellSize * dragSelection.from[0] - scrollX}px`,
						height: `${cellSize}px`
					}
				},
				{
					name: 'useWeftColors',
					canvasArea: {
						width: `${cellSize}px`,
						right: `${weftColorsPosition[0] * cellSize}px`,
						top: 0,
						bottom: `${weftColorsPosition[1] * cellSize}px`
					},
					selectionArea: {
						width: `${cellSize}px`,
						height: `${(to[1] - from[1]) * cellSize}px`,
						right: 0,
						bottom: `${from[1] * cellSize - scrollY}px`
					},
					dragMarker: {
						width: `${cellSize}px`,
						height: `${(dragSelection.to[1] - dragSelection.from[1]) * cellSize}px`,
						right: 0,
						bottom: `${dragSelection.from[1] * cellSize - scrollY}px`
					}
				},
				{
					name: 'weave',
					canvasArea: {
						left: 0,
						right: `${weavePosition[0] * cellSize}px`,
						top: 0,
						bottom: `${weavePosition[1] * cellSize}px`
					},
					selectionArea: {
						width: `${cellSize * (to[0] - from[0])}px`,
						height: `${cellSize * (to[1] - from[1])}px`,
						right: `${from[0] * cellSize - scrollX}px`,
						bottom: `${from[1] * cellSize - scrollY}px`
					},
					dragMarker: {
						width: `${(dragSelection.to[0] - dragSelection.from[0]) * cellSize}px`,
						height: `${(dragSelection.to[1] - dragSelection.from[1]) * cellSize}px`,
						right: `${dragSelection.from[0] * cellSize - scrollX}px`,
						bottom: `${dragSelection.from[1] * cellSize - scrollY}px`
					}
				}
			]);
		}
	};

	appliedSelections = [];
	$$invalidate(12, dragSelection = { to: 0, from: 0 });

	return [
		$selection,
		isDragging,
		selections,
		hasLength,
		isSelecting,
		routeMoveEvent,
		containerMouseDown,
		toggleSelection,
		weaveApplied,
		weaveDisplay,
		scrollY,
		scrollX,
		dragSelection,
		cellSize,
		from,
		to,
		weavePosition,
		weftColorsPosition,
		warpColorsPosition,
		treadleCount,
		treadleOrderPosition,
		shaftCount,
		threadingPosition,
		$ui,
		$draft,
		click_handler,
		pointerdown_handler
	];
}

class SelectionComponent extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$5, create_fragment$5, not_equal, { weaveDisplay: 9 }, null, [-1, -1]);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SelectionComponent",
			options,
			id: create_fragment$5.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*weaveDisplay*/ ctx[9] === undefined && !('weaveDisplay' in props)) {
			console.warn("<SelectionComponent> was created without expected prop 'weaveDisplay'");
		}
	}

	get weaveDisplay() {
		throw new Error("<SelectionComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set weaveDisplay(value) {
		throw new Error("<SelectionComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/pages/Editor/RulerBar.svelte generated by Svelte v3.43.0 */
const file$4 = "src/pages/Editor/RulerBar.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[20] = list[i];
	return child_ctx;
}

// (72:4) {#each steps as step}
function create_each_block(ctx) {
	let span;
	let t_value = /*step*/ ctx[20][0] + "";
	let t;
	let span_style_value;

	const block = {
		c: function create() {
			span = element("span");
			t = text(t_value);
			attr_dev(span, "style", span_style_value = `${/*vertical*/ ctx[3] ? 'bottom' : 'right'}: ${/*step*/ ctx[20][1]}`);
			attr_dev(span, "class", "svelte-1xnl843");
			add_location(span, file$4, 72, 6, 1709);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*steps*/ 1 && t_value !== (t_value = /*step*/ ctx[20][0] + "")) set_data_dev(t, t_value);

			if (dirty & /*vertical, steps*/ 9 && span_style_value !== (span_style_value = `${/*vertical*/ ctx[3] ? 'bottom' : 'right'}: ${/*step*/ ctx[20][1]}`)) {
				attr_dev(span, "style", span_style_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(72:4) {#each steps as step}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let div1;
	let div0;
	let div0_style_value;
	let div1_style_value;
	let each_value = /*steps*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div0, "class", "steps svelte-1xnl843");

			attr_dev(div0, "style", div0_style_value = `
    height: ${/*ch*/ ctx[2]}px;
    font-size: ${/*cellSize*/ ctx[1] / 5}pt;
    transform: ${/*transform*/ ctx[7]};
    `);

			add_location(div0, file$4, 63, 2, 1546);
			attr_dev(div1, "class", "steps-container svelte-1xnl843");

			attr_dev(div1, "style", div1_style_value = `
  right: ${/*containerPos*/ ctx[8][0]}px;
  bottom: ${/*containerPos*/ ctx[8][1]}px;
  height: ${/*stepsContainerHeight*/ ctx[4]}px;
  width: ${/*stepsContainerWidth*/ ctx[5]}px
  `);

			toggle_class(div1, "vertical", /*vertical*/ ctx[3]);
			add_location(div1, file$4, 52, 0, 1315);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}

			/*div1_binding*/ ctx[19](div1);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*vertical, steps*/ 9) {
				each_value = /*steps*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*ch, cellSize, transform*/ 134 && div0_style_value !== (div0_style_value = `
    height: ${/*ch*/ ctx[2]}px;
    font-size: ${/*cellSize*/ ctx[1] / 5}pt;
    transform: ${/*transform*/ ctx[7]};
    `)) {
				attr_dev(div0, "style", div0_style_value);
			}

			if (dirty & /*containerPos, stepsContainerHeight, stepsContainerWidth*/ 304 && div1_style_value !== (div1_style_value = `
  right: ${/*containerPos*/ ctx[8][0]}px;
  bottom: ${/*containerPos*/ ctx[8][1]}px;
  height: ${/*stepsContainerHeight*/ ctx[4]}px;
  width: ${/*stepsContainerWidth*/ ctx[5]}px
  `)) {
				attr_dev(div1, "style", div1_style_value);
			}

			if (dirty & /*vertical*/ 8) {
				toggle_class(div1, "vertical", /*vertical*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks, detaching);
			/*div1_binding*/ ctx[19](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let vertical;
	let cellSize;
	let ch;
	let containerPos;
	let scrollPos;
	let transform;
	let shaftCount;
	let treadleCount;
	let $ui;
	let $draft;
	validate_store(ui$1, 'ui');
	component_subscribe($$self, ui$1, $$value => $$invalidate(17, $ui = $$value));
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(18, $draft = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('RulerBar', slots, []);
	let { width = 0 } = $$props;
	let { height = 0 } = $$props;
	let { position } = $$props;
	let { stepCount } = $$props;
	let { distance } = $$props;
	let stepsContainerHeight;
	let stepsContainerWidth;
	let guideContainer;
	let steps = [];
	const writable_props = ['width', 'height', 'position', 'stepCount', 'distance'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RulerBar> was created with unknown prop '${key}'`);
	});

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			guideContainer = $$value;
			$$invalidate(6, guideContainer);
		});
	}

	$$self.$$set = $$props => {
		if ('width' in $$props) $$invalidate(9, width = $$props.width);
		if ('height' in $$props) $$invalidate(10, height = $$props.height);
		if ('position' in $$props) $$invalidate(11, position = $$props.position);
		if ('stepCount' in $$props) $$invalidate(12, stepCount = $$props.stepCount);
		if ('distance' in $$props) $$invalidate(13, distance = $$props.distance);
	};

	$$self.$capture_state = () => ({
		ui: ui$1,
		draft: draft$1,
		width,
		height,
		position,
		stepCount,
		distance,
		stepsContainerHeight,
		stepsContainerWidth,
		guideContainer,
		steps,
		cellSize,
		treadleCount,
		ch,
		shaftCount,
		vertical,
		scrollPos,
		transform,
		containerPos,
		$ui,
		$draft
	});

	$$self.$inject_state = $$props => {
		if ('width' in $$props) $$invalidate(9, width = $$props.width);
		if ('height' in $$props) $$invalidate(10, height = $$props.height);
		if ('position' in $$props) $$invalidate(11, position = $$props.position);
		if ('stepCount' in $$props) $$invalidate(12, stepCount = $$props.stepCount);
		if ('distance' in $$props) $$invalidate(13, distance = $$props.distance);
		if ('stepsContainerHeight' in $$props) $$invalidate(4, stepsContainerHeight = $$props.stepsContainerHeight);
		if ('stepsContainerWidth' in $$props) $$invalidate(5, stepsContainerWidth = $$props.stepsContainerWidth);
		if ('guideContainer' in $$props) $$invalidate(6, guideContainer = $$props.guideContainer);
		if ('steps' in $$props) $$invalidate(0, steps = $$props.steps);
		if ('cellSize' in $$props) $$invalidate(1, cellSize = $$props.cellSize);
		if ('treadleCount' in $$props) $$invalidate(14, treadleCount = $$props.treadleCount);
		if ('ch' in $$props) $$invalidate(2, ch = $$props.ch);
		if ('shaftCount' in $$props) $$invalidate(15, shaftCount = $$props.shaftCount);
		if ('vertical' in $$props) $$invalidate(3, vertical = $$props.vertical);
		if ('scrollPos' in $$props) $$invalidate(16, scrollPos = $$props.scrollPos);
		if ('transform' in $$props) $$invalidate(7, transform = $$props.transform);
		if ('containerPos' in $$props) $$invalidate(8, containerPos = $$props.containerPos);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*height, width*/ 1536) {
			$$invalidate(3, vertical = height > width);
		}

		if ($$self.$$.dirty & /*$ui*/ 131072) {
			$$invalidate(1, cellSize = $ui.cellSize);
		}

		if ($$self.$$.dirty & /*$ui*/ 131072) {
			$$invalidate(1, cellSize = $ui.cellSize);
		}

		if ($$self.$$.dirty & /*cellSize*/ 2) {
			$$invalidate(2, ch = cellSize / 2.0);
		}

		if ($$self.$$.dirty & /*position, ch*/ 2052) {
			$$invalidate(8, containerPos = [position[0] * ch, position[1] * ch]);
		}

		if ($$self.$$.dirty & /*vertical, $ui*/ 131080) {
			$$invalidate(16, scrollPos = vertical ? $ui.scrollY : $ui.scrollX);
		}

		if ($$self.$$.dirty & /*vertical, scrollPos*/ 65544) {
			$$invalidate(7, transform = `translate${vertical ? 'Y' : 'X'}(${scrollPos / 2.0}px)`);
		}

		if ($$self.$$.dirty & /*$draft*/ 262144) {
			$$invalidate(15, shaftCount = $draft.shaftCount);
		}

		if ($$self.$$.dirty & /*$draft*/ 262144) {
			$$invalidate(14, treadleCount = $draft.treadleCount);
		}

		if ($$self.$$.dirty & /*vertical, height, ch, shaftCount, width, treadleCount*/ 50700) {
			{
				if (vertical) {
					$$invalidate(4, stepsContainerHeight = height - ch * (shaftCount + 6) - 4);
					$$invalidate(5, stepsContainerWidth = ch);
				} else {
					$$invalidate(4, stepsContainerHeight = ch);
					$$invalidate(5, stepsContainerWidth = width - ch * (treadleCount + 4) + 4);
				}
			}
		}

		if ($$self.$$.dirty & /*stepCount, distance, cellSize, steps*/ 12291) {
			{
				$$invalidate(0, steps = []);

				for (let i = 0; i < stepCount / distance; i++) {
					let step = i * distance;
					let right = `${step * cellSize / 2}px`;

					if (step > 10) {
						right += ` - ${Math.floor(Math.log10(step))}em / 2`;
					} else if (step > 0) {
						right += ` - 0.5ex`;
					}

					right = `calc(${right})`;
					steps.push([step, right]);
				}
			}
		}
	};

	return [
		steps,
		cellSize,
		ch,
		vertical,
		stepsContainerHeight,
		stepsContainerWidth,
		guideContainer,
		transform,
		containerPos,
		width,
		height,
		position,
		stepCount,
		distance,
		treadleCount,
		shaftCount,
		scrollPos,
		$ui,
		$draft,
		div1_binding
	];
}

class RulerBar extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(this, options, instance$4, create_fragment$4, not_equal, {
			width: 9,
			height: 10,
			position: 11,
			stepCount: 12,
			distance: 13
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "RulerBar",
			options,
			id: create_fragment$4.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*position*/ ctx[11] === undefined && !('position' in props)) {
			console.warn("<RulerBar> was created without expected prop 'position'");
		}

		if (/*stepCount*/ ctx[12] === undefined && !('stepCount' in props)) {
			console.warn("<RulerBar> was created without expected prop 'stepCount'");
		}

		if (/*distance*/ ctx[13] === undefined && !('distance' in props)) {
			console.warn("<RulerBar> was created without expected prop 'distance'");
		}
	}

	get width() {
		throw new Error("<RulerBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<RulerBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<RulerBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<RulerBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get position() {
		throw new Error("<RulerBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set position(value) {
		throw new Error("<RulerBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get stepCount() {
		throw new Error("<RulerBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set stepCount(value) {
		throw new Error("<RulerBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get distance() {
		throw new Error("<RulerBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set distance(value) {
		throw new Error("<RulerBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/pages/Editor/InfoBar.svelte generated by Svelte v3.43.0 */
const file$3 = "src/pages/Editor/InfoBar.svelte";

// (13:2) {:else}
function create_else_block(ctx) {
	let span;
	let t_value = `${/*hoverCell*/ ctx[2][0]}, ${/*hoverCell*/ ctx[2][1]}` + "";
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text(t_value);
			attr_dev(span, "class", "svelte-1pjpio4");
			add_location(span, file$3, 13, 4, 302);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hoverCell*/ 4 && t_value !== (t_value = `${/*hoverCell*/ ctx[2][0]}, ${/*hoverCell*/ ctx[2][1]}` + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(13:2) {:else}",
		ctx
	});

	return block;
}

// (11:2) {#if isDragging}
function create_if_block$1(ctx) {
	let span;
	let t_value = `${/*from*/ ctx[0]} → ${/*to*/ ctx[1]} (${/*length*/ ctx[4]})` + "";
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text(t_value);
			attr_dev(span, "class", "svelte-1pjpio4");
			add_location(span, file$3, 11, 4, 243);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*from, to, length*/ 19 && t_value !== (t_value = `${/*from*/ ctx[0]} → ${/*to*/ ctx[1]} (${/*length*/ ctx[4]})` + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(11:2) {#if isDragging}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let div;

	function select_block_type(ctx, dirty) {
		if (/*isDragging*/ ctx[3]) return create_if_block$1;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if_block.c();
			attr_dev(div, "class", "info-bar svelte-1pjpio4");
			add_location(div, file$3, 9, 0, 197);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let from;
	let to;
	let length;
	let isDragging;
	let hoverCell;
	let $ui;
	validate_store(ui$1, 'ui');
	component_subscribe($$self, ui$1, $$value => $$invalidate(5, $ui = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('InfoBar', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InfoBar> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		ui: ui$1,
		hoverCell,
		isDragging,
		from,
		to,
		length,
		$ui
	});

	$$self.$inject_state = $$props => {
		if ('hoverCell' in $$props) $$invalidate(2, hoverCell = $$props.hoverCell);
		if ('isDragging' in $$props) $$invalidate(3, isDragging = $$props.isDragging);
		if ('from' in $$props) $$invalidate(0, from = $$props.from);
		if ('to' in $$props) $$invalidate(1, to = $$props.to);
		if ('length' in $$props) $$invalidate(4, length = $$props.length);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$ui*/ 32) {
			$$invalidate(0, from = $ui.selectFrom);
		}

		if ($$self.$$.dirty & /*$ui*/ 32) {
			$$invalidate(1, to = $ui.selectTo);
		}

		if ($$self.$$.dirty & /*to, from*/ 3) {
			$$invalidate(4, length = to - from + 1);
		}

		if ($$self.$$.dirty & /*$ui*/ 32) {
			$$invalidate(3, isDragging = $ui.isDragging);
		}

		if ($$self.$$.dirty & /*$ui*/ 32) {
			$$invalidate(2, hoverCell = $ui.hoverCell);
		}
	};

	return [from, to, hoverCell, isDragging, length, $ui];
}

class InfoBar extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$3, create_fragment$3, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "InfoBar",
			options,
			id: create_fragment$3.name
		});
	}
}

/* src/pages/Editor/Sidebar/Dialog.svelte generated by Svelte v3.43.0 */
const file$2 = "src/pages/Editor/Sidebar/Dialog.svelte";

function create_fragment$2(ctx) {
	let div;
	let switch_instance;
	let current;
	var switch_value = Subcomponents[/*selectedMenu*/ ctx[1]].component;

	function switch_props(ctx) {
		return { $$inline: true };
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props());
	}

	const block = {
		c: function create() {
			div = element("div");
			if (switch_instance) create_component(switch_instance.$$.fragment);
			attr_dev(div, "class", "dialog svelte-1j95j2a");
			add_location(div, file$2, 33, 0, 868);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (switch_instance) {
				mount_component(switch_instance, div, null);
			}

			/*div_binding*/ ctx[3](div);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (switch_value !== (switch_value = Subcomponents[/*selectedMenu*/ ctx[1]].component)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, div, null);
				} else {
					switch_instance = null;
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (switch_instance) destroy_component(switch_instance);
			/*div_binding*/ ctx[3](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	let selectedMenu;
	let $ui;
	validate_store(ui$1, 'ui');
	component_subscribe($$self, ui$1, $$value => $$invalidate(2, $ui = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Dialog', slots, []);
	let dialogElement;

	onMount(() => {
		document.body.addEventListener('pointerdown', onClick);
	});

	function onClick(event) {
		if (dialogElement === null) {
			document.body.removeEventListener('pointerdown', onClick);
			return;
		}

		if (selectedMenu !== -1 && //Disable click dismissal for select/repeat
		selectedMenu !== 4 && !dialogElement.contains(event.target) && !event.target.classList.contains('color-input-canvas')) {
			event.preventDefault();

			ui$1.update(temp => {
				temp.selectedMenu = -1;
			});

			document.body.removeEventListener('pointerdown', onClick);
		}
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dialog> was created with unknown prop '${key}'`);
	});

	function div_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			dialogElement = $$value;
			$$invalidate(0, dialogElement);
		});
	}

	$$self.$capture_state = () => ({
		onMount,
		ui: ui$1,
		draft: draft$1,
		Subcomponents,
		dialogElement,
		onClick,
		selectedMenu,
		$ui
	});

	$$self.$inject_state = $$props => {
		if ('dialogElement' in $$props) $$invalidate(0, dialogElement = $$props.dialogElement);
		if ('selectedMenu' in $$props) $$invalidate(1, selectedMenu = $$props.selectedMenu);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$ui*/ 4) {
			$$invalidate(1, selectedMenu = $ui.selectedMenu);
		}
	};

	return [dialogElement, selectedMenu, $ui, div_binding];
}

class Dialog extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$2, create_fragment$2, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dialog",
			options,
			id: create_fragment$2.name
		});
	}
}

/* src/pages/Editor/Editor.svelte generated by Svelte v3.43.0 */
const file$1 = "src/pages/Editor/Editor.svelte";

// (178:2) {#if selectedMenu !== -1}
function create_if_block_3(ctx) {
	let dialog;
	let current;
	dialog = new Dialog({ $$inline: true });

	const block = {
		c: function create() {
			create_component(dialog.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(dialog, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dialog, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(178:2) {#if selectedMenu !== -1}",
		ctx
	});

	return block;
}

// (192:6) {#if scrollContainer !== undefined}
function create_if_block(ctx) {
	let weavedisplay;
	let updating_scrollContainer;
	let t0;
	let selection;
	let t1;
	let t2;
	let if_block1_anchor;
	let current;

	function weavedisplay_scrollContainer_binding(value) {
		/*weavedisplay_scrollContainer_binding*/ ctx[24](value);
	}

	let weavedisplay_props = {};

	if (/*scrollContainer*/ ctx[3] !== void 0) {
		weavedisplay_props.scrollContainer = /*scrollContainer*/ ctx[3];
	}

	weavedisplay = new WeaveDisplay({
			props: weavedisplay_props,
			$$inline: true
		});

	/*weavedisplay_binding*/ ctx[23](weavedisplay);
	binding_callbacks.push(() => bind(weavedisplay, 'scrollContainer', weavedisplay_scrollContainer_binding));

	selection = new SelectionComponent({
			props: { weaveDisplay: /*weaveDisplay*/ ctx[11] },
			$$inline: true
		});

	let if_block0 = /*$ui*/ ctx[0].showThreading && create_if_block_2(ctx);
	let if_block1 = /*$ui*/ ctx[0].showTreadleOrder && create_if_block_1(ctx);

	const block = {
		c: function create() {
			create_component(weavedisplay.$$.fragment);
			t0 = space();
			create_component(selection.$$.fragment);
			t1 = space();
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty$1();
		},
		m: function mount(target, anchor) {
			mount_component(weavedisplay, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(selection, target, anchor);
			insert_dev(target, t1, anchor);
			if (if_block0) if_block0.m(target, anchor);
			insert_dev(target, t2, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert_dev(target, if_block1_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const weavedisplay_changes = {};

			if (!updating_scrollContainer && dirty[0] & /*scrollContainer*/ 8) {
				updating_scrollContainer = true;
				weavedisplay_changes.scrollContainer = /*scrollContainer*/ ctx[3];
				add_flush_callback(() => updating_scrollContainer = false);
			}

			weavedisplay.$set(weavedisplay_changes);
			const selection_changes = {};
			if (dirty[0] & /*weaveDisplay*/ 2048) selection_changes.weaveDisplay = /*weaveDisplay*/ ctx[11];
			selection.$set(selection_changes);

			if (/*$ui*/ ctx[0].showThreading) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty[0] & /*$ui*/ 1) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_2(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(t2.parentNode, t2);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*$ui*/ ctx[0].showTreadleOrder) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty[0] & /*$ui*/ 1) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_1(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(weavedisplay.$$.fragment, local);
			transition_in(selection.$$.fragment, local);
			transition_in(if_block0);
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(weavedisplay.$$.fragment, local);
			transition_out(selection.$$.fragment, local);
			transition_out(if_block0);
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			/*weavedisplay_binding*/ ctx[23](null);
			destroy_component(weavedisplay, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(selection, detaching);
			if (detaching) detach_dev(t1);
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach_dev(t2);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach_dev(if_block1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(192:6) {#if scrollContainer !== undefined}",
		ctx
	});

	return block;
}

// (195:8) {#if $ui.showThreading}
function create_if_block_2(ctx) {
	let rulerbar;
	let current;

	rulerbar = new RulerBar({
			props: {
				width: /*canvasWidth*/ ctx[5],
				stepCount: /*$draft*/ ctx[1].warpCount,
				distance: /*$ui*/ ctx[0].xStepDistance,
				position: [/*$draft*/ ctx[1].treadleCount + 4, 2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(rulerbar.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(rulerbar, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const rulerbar_changes = {};
			if (dirty[0] & /*canvasWidth*/ 32) rulerbar_changes.width = /*canvasWidth*/ ctx[5];
			if (dirty[0] & /*$draft*/ 2) rulerbar_changes.stepCount = /*$draft*/ ctx[1].warpCount;
			if (dirty[0] & /*$ui*/ 1) rulerbar_changes.distance = /*$ui*/ ctx[0].xStepDistance;
			if (dirty[0] & /*$draft*/ 2) rulerbar_changes.position = [/*$draft*/ ctx[1].treadleCount + 4, 2];
			rulerbar.$set(rulerbar_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(rulerbar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(rulerbar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(rulerbar, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(195:8) {#if $ui.showThreading}",
		ctx
	});

	return block;
}

// (203:8) {#if $ui.showTreadleOrder}
function create_if_block_1(ctx) {
	let rulerbar;
	let current;

	rulerbar = new RulerBar({
			props: {
				height: /*canvasHeight*/ ctx[6],
				stepCount: /*$draft*/ ctx[1].weftCount,
				distance: /*$ui*/ ctx[0].yStepDistance,
				position: [2, /*$draft*/ ctx[1].shaftCount + 4]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(rulerbar.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(rulerbar, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const rulerbar_changes = {};
			if (dirty[0] & /*canvasHeight*/ 64) rulerbar_changes.height = /*canvasHeight*/ ctx[6];
			if (dirty[0] & /*$draft*/ 2) rulerbar_changes.stepCount = /*$draft*/ ctx[1].weftCount;
			if (dirty[0] & /*$ui*/ 1) rulerbar_changes.distance = /*$ui*/ ctx[0].yStepDistance;
			if (dirty[0] & /*$draft*/ 2) rulerbar_changes.position = [2, /*$draft*/ ctx[1].shaftCount + 4];
			rulerbar.$set(rulerbar_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(rulerbar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(rulerbar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(rulerbar, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(203:8) {#if $ui.showTreadleOrder}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let toolbar;
	let updating_height;
	let updating_sidebarOpen;
	let t0;
	let sidebar;
	let updating_open;
	let t1;
	let div4;
	let t2;
	let div0;
	let div0_style_value;
	let t3;
	let div2;
	let div1;
	let div2_style_value;
	let t4;
	let div3;
	let infobar;
	let div3_style_value;
	let current;
	let mounted;
	let dispose;

	function toolbar_height_binding(value) {
		/*toolbar_height_binding*/ ctx[20](value);
	}

	function toolbar_sidebarOpen_binding(value) {
		/*toolbar_sidebarOpen_binding*/ ctx[21](value);
	}

	let toolbar_props = {};

	if (/*toolbarHeight*/ ctx[8] !== void 0) {
		toolbar_props.height = /*toolbarHeight*/ ctx[8];
	}

	if (/*sidebarOpen*/ ctx[12] !== void 0) {
		toolbar_props.sidebarOpen = /*sidebarOpen*/ ctx[12];
	}

	toolbar = new Toolbar({ props: toolbar_props, $$inline: true });
	binding_callbacks.push(() => bind(toolbar, 'height', toolbar_height_binding));
	binding_callbacks.push(() => bind(toolbar, 'sidebarOpen', toolbar_sidebarOpen_binding));

	function sidebar_open_binding(value) {
		/*sidebar_open_binding*/ ctx[22](value);
	}

	let sidebar_props = {};

	if (/*sidebarOpen*/ ctx[12] !== void 0) {
		sidebar_props.open = /*sidebarOpen*/ ctx[12];
	}

	sidebar = new Sidebar({ props: sidebar_props, $$inline: true });
	binding_callbacks.push(() => bind(sidebar, 'open', sidebar_open_binding));
	let if_block0 = /*selectedMenu*/ ctx[13] !== -1 && create_if_block_3(ctx);
	let if_block1 = /*scrollContainer*/ ctx[3] !== undefined && create_if_block(ctx);
	infobar = new InfoBar({ $$inline: true });

	const block = {
		c: function create() {
			create_component(toolbar.$$.fragment);
			t0 = space();
			create_component(sidebar.$$.fragment);
			t1 = space();
			div4 = element("div");
			if (if_block0) if_block0.c();
			t2 = space();
			div0 = element("div");
			t3 = space();
			div2 = element("div");
			div1 = element("div");
			if (if_block1) if_block1.c();
			t4 = space();
			div3 = element("div");
			create_component(infobar.$$.fragment);
			attr_dev(div0, "class", "scrollpane svelte-nzvidi");
			attr_dev(div0, "style", div0_style_value = `left: ${/*width*/ ctx[15]}px; top: ${/*height*/ ctx[14]}px;`);
			add_location(div0, file$1, 180, 2, 5386);
			attr_dev(div1, "class", "weave-container svelte-nzvidi");
			add_location(div1, file$1, 190, 4, 5653);
			attr_dev(div2, "class", "fixed svelte-nzvidi");

			attr_dev(div2, "style", div2_style_value = `
    top: ${/*toolbarHeight*/ ctx[8]}px;
    right: ${/*scrollbarWidth*/ ctx[9]}px;
    bottom: ${/*scrollbarWidth*/ ctx[9] + /*infobarHeight*/ ctx[7]}px
    `);

			add_location(div2, file$1, 181, 2, 5461);
			attr_dev(div3, "class", "infobarContainer-container svelte-nzvidi");
			attr_dev(div3, "style", div3_style_value = `bottom: ${/*scrollbarHeight*/ ctx[10]}px; right: ${/*scrollbarWidth*/ ctx[9]}px`);
			add_location(div3, file$1, 213, 2, 6360);
			attr_dev(div4, "class", "container svelte-nzvidi");
			attr_dev(div4, "tabindex", "0");
			add_location(div4, file$1, 171, 0, 5232);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(toolbar, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(sidebar, target, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div4, anchor);
			if (if_block0) if_block0.m(div4, null);
			append_dev(div4, t2);
			append_dev(div4, div0);
			append_dev(div4, t3);
			append_dev(div4, div2);
			append_dev(div2, div1);
			if (if_block1) if_block1.m(div1, null);
			/*div2_binding*/ ctx[25](div2);
			append_dev(div4, t4);
			append_dev(div4, div3);
			mount_component(infobar, div3, null);
			/*div3_binding*/ ctx[26](div3);
			/*div4_binding*/ ctx[27](div4);
			current = true;

			if (!mounted) {
				dispose = listen_dev(div4, "scroll", /*updatePosition*/ ctx[16], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			const toolbar_changes = {};

			if (!updating_height && dirty[0] & /*toolbarHeight*/ 256) {
				updating_height = true;
				toolbar_changes.height = /*toolbarHeight*/ ctx[8];
				add_flush_callback(() => updating_height = false);
			}

			if (!updating_sidebarOpen && dirty[0] & /*sidebarOpen*/ 4096) {
				updating_sidebarOpen = true;
				toolbar_changes.sidebarOpen = /*sidebarOpen*/ ctx[12];
				add_flush_callback(() => updating_sidebarOpen = false);
			}

			toolbar.$set(toolbar_changes);
			const sidebar_changes = {};

			if (!updating_open && dirty[0] & /*sidebarOpen*/ 4096) {
				updating_open = true;
				sidebar_changes.open = /*sidebarOpen*/ ctx[12];
				add_flush_callback(() => updating_open = false);
			}

			sidebar.$set(sidebar_changes);

			if (/*selectedMenu*/ ctx[13] !== -1) {
				if (if_block0) {
					if (dirty[0] & /*selectedMenu*/ 8192) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div4, t2);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (!current || dirty[0] & /*width, height*/ 49152 && div0_style_value !== (div0_style_value = `left: ${/*width*/ ctx[15]}px; top: ${/*height*/ ctx[14]}px;`)) {
				attr_dev(div0, "style", div0_style_value);
			}

			if (/*scrollContainer*/ ctx[3] !== undefined) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty[0] & /*scrollContainer*/ 8) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div1, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (!current || dirty[0] & /*toolbarHeight, scrollbarWidth, infobarHeight*/ 896 && div2_style_value !== (div2_style_value = `
    top: ${/*toolbarHeight*/ ctx[8]}px;
    right: ${/*scrollbarWidth*/ ctx[9]}px;
    bottom: ${/*scrollbarWidth*/ ctx[9] + /*infobarHeight*/ ctx[7]}px
    `)) {
				attr_dev(div2, "style", div2_style_value);
			}

			if (!current || dirty[0] & /*scrollbarHeight, scrollbarWidth*/ 1536 && div3_style_value !== (div3_style_value = `bottom: ${/*scrollbarHeight*/ ctx[10]}px; right: ${/*scrollbarWidth*/ ctx[9]}px`)) {
				attr_dev(div3, "style", div3_style_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(toolbar.$$.fragment, local);
			transition_in(sidebar.$$.fragment, local);
			transition_in(if_block0);
			transition_in(if_block1);
			transition_in(infobar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toolbar.$$.fragment, local);
			transition_out(sidebar.$$.fragment, local);
			transition_out(if_block0);
			transition_out(if_block1);
			transition_out(infobar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(toolbar, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(sidebar, detaching);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div4);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			/*div2_binding*/ ctx[25](null);
			destroy_component(infobar);
			/*div3_binding*/ ctx[26](null);
			/*div4_binding*/ ctx[27](null);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function reducePrecision(num) {
	return Math.round(num / 2) * 2;
}

function instance$1($$self, $$props, $$invalidate) {
	let warpCount;
	let weftCount;
	let cellSize;
	let width;
	let height;
	let showThreading;
	let showTreadleOrder;
	let selectedMenu;
	let disableScroll;
	let $ui;
	let $draft;
	validate_store(ui$1, 'ui');
	component_subscribe($$self, ui$1, $$value => $$invalidate(0, $ui = $$value));
	validate_store(draft$1, 'draft');
	component_subscribe($$self, draft$1, $$value => $$invalidate(1, $draft = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Editor', slots, []);
	let infobarContainer;
	let scrollContainer;
	let canvasContainer;
	let canvasWidth;
	let canvasHeight;
	let cellSizeInput = $ui.cellSize;
	let hasChangedCellSize;
	let scrollPercentage = [];
	let infobarHeight = 0;
	let toolbarHeight = 0;
	let scrollbarWidth = 15;
	let scrollbarHeight = 15;
	let weaveDisplay;
	let resizeObserver;
	let sidebarOpen = true;

	afterUpdate(() => {
		if (hasChangedCellSize) {
			hasChangedCellSize = false;
			let [scrollLeftMax, scrollTopMax] = getBounds();
			let x = (1.0 - scrollPercentage[0]) * scrollLeftMax;
			let y = (1.0 - scrollPercentage[1]) * scrollTopMax;
			scrollContainer.scrollTo(x, y);
		}
	});

	onMount(() => {
		$$invalidate(9, scrollbarWidth = scrollContainer.offsetWidth - scrollContainer.clientWidth);
		$$invalidate(10, scrollbarHeight = scrollContainer.offsetHeight - scrollContainer.clientHeight);
		$$invalidate(7, infobarHeight = infobarContainer.clientHeight);
		let scrollLeftMax = scrollContainer.scrollWidth - scrollContainer.clientWidth;
		let scrollTopMax = scrollContainer.scrollHeight - scrollContainer.clientHeight;
		scrollContainer.scrollTo(scrollLeftMax, scrollTopMax);

		resizeObserver = new ResizeObserver(() => {
				if (weaveDisplay !== undefined && weaveDisplay !== null) {
					weaveDisplay.syncCanvasDimensions();
				}
			});

		resizeObserver.observe(canvasContainer);

		scrollContainer.addEventListener('contextmenu', e => {
			e.preventDefault();
			return false;
		});

		scrollContainer.addEventListener('wheel', event => {
			if (event.ctrlKey) {
				event.preventDefault();
				cellSizeInput += event.deltaY * -0.03;
				cellSizeInput = Math.max(5, Math.min(70, cellSizeInput));
				changeCellSize();
			}
		});

		let startScale;

		scrollContainer.addEventListener('touchstart', e => {
			let touches = e.targetTouches;

			if (touches.length === 2) {
				let t0 = touches[0];
				let t1 = touches[1];
				let p0 = fromValues(t0.clientX, t0.clientY);
				let p1 = fromValues(t1.clientX, t1.clientY);
				startScale = length(sub(create(), p0, p1));
			}
		});

		scrollContainer.addEventListener('touchmove', e => {
			let touches = e.targetTouches;

			if (touches.length === 2) {
				let t0 = touches[0];
				let t1 = touches[1];
				let p0 = fromValues(t0.clientX, t0.clientY);
				let p1 = fromValues(t1.clientX, t1.clientY);
				let newScale = length(sub(create(), p0, p1));
				let scaleDiff = newScale / startScale;

				ui$1.update(draft => {
					draft.cellSize = draft.cellSize * scaleDiff;
				});

				startScale = newScale;
			}
		});

		scrollContainer.addEventListener('touchend', e => {
			if (e.touches.length === 0 && startScale !== undefined) {
				ui$1.update(draft => {
					draft.cellSize = reducePrecision(draft.cellSize);
				});

				startScale = undefined;
			}
		});

		let rect = canvasContainer.getBoundingClientRect();
		$$invalidate(5, canvasWidth = rect.width);
		$$invalidate(6, canvasHeight = rect.height);
	});

	function getBounds() {
		let scrollLeftMax = scrollContainer.scrollWidth - scrollContainer.clientWidth;
		let scrollTopMax = scrollContainer.scrollHeight - scrollContainer.clientHeight;
		return [scrollLeftMax, scrollTopMax];
	}

	function getPosition() {
		let [scrollLeftMax, scrollTopMax] = getBounds();
		let x = reducePrecision(scrollLeftMax - scrollContainer.scrollLeft);
		let y = reducePrecision(scrollTopMax - scrollContainer.scrollTop);
		return [x, y];
	}

	function updatePosition() {
		let pos = getPosition();

		ui$1.update(draft => {
			draft.scrollX = pos[0];
			draft.scrollY = pos[1];
		});
	}

	function changeCellSize() {
		let newCellSize = reducePrecision(cellSizeInput);
		let oldCellSize = $ui.cellSize;

		if (newCellSize !== oldCellSize) {
			hasChangedCellSize = true;
			let [x, y] = getPosition();
			let [scrollLeftMax, scrollTopMax] = getBounds();
			scrollPercentage = [x / scrollLeftMax, y / scrollTopMax];

			ui$1.update(draft => {
				draft.cellSize = newCellSize;
			});
		}
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Editor> was created with unknown prop '${key}'`);
	});

	function toolbar_height_binding(value) {
		toolbarHeight = value;
		$$invalidate(8, toolbarHeight);
	}

	function toolbar_sidebarOpen_binding(value) {
		sidebarOpen = value;
		$$invalidate(12, sidebarOpen);
	}

	function sidebar_open_binding(value) {
		sidebarOpen = value;
		$$invalidate(12, sidebarOpen);
	}

	function weavedisplay_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			weaveDisplay = $$value;
			$$invalidate(11, weaveDisplay);
		});
	}

	function weavedisplay_scrollContainer_binding(value) {
		scrollContainer = value;
		$$invalidate(3, scrollContainer);
	}

	function div2_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			canvasContainer = $$value;
			$$invalidate(4, canvasContainer);
		});
	}

	function div3_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			infobarContainer = $$value;
			$$invalidate(2, infobarContainer);
		});
	}

	function div4_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			scrollContainer = $$value;
			$$invalidate(3, scrollContainer);
		});
	}

	$$self.$capture_state = () => ({
		onMount,
		afterUpdate,
		Sidebar,
		Toolbar,
		ui: ui$1,
		draft: draft$1,
		WeaveDisplay,
		Selection: SelectionComponent,
		RulerBar,
		InfoBar,
		Dialog,
		vec2,
		infobarContainer,
		scrollContainer,
		canvasContainer,
		canvasWidth,
		canvasHeight,
		cellSizeInput,
		hasChangedCellSize,
		scrollPercentage,
		infobarHeight,
		toolbarHeight,
		scrollbarWidth,
		scrollbarHeight,
		weaveDisplay,
		resizeObserver,
		sidebarOpen,
		reducePrecision,
		getBounds,
		getPosition,
		updatePosition,
		changeCellSize,
		disableScroll,
		selectedMenu,
		showTreadleOrder,
		showThreading,
		cellSize,
		weftCount,
		height,
		warpCount,
		width,
		$ui,
		$draft
	});

	$$self.$inject_state = $$props => {
		if ('infobarContainer' in $$props) $$invalidate(2, infobarContainer = $$props.infobarContainer);
		if ('scrollContainer' in $$props) $$invalidate(3, scrollContainer = $$props.scrollContainer);
		if ('canvasContainer' in $$props) $$invalidate(4, canvasContainer = $$props.canvasContainer);
		if ('canvasWidth' in $$props) $$invalidate(5, canvasWidth = $$props.canvasWidth);
		if ('canvasHeight' in $$props) $$invalidate(6, canvasHeight = $$props.canvasHeight);
		if ('cellSizeInput' in $$props) cellSizeInput = $$props.cellSizeInput;
		if ('hasChangedCellSize' in $$props) hasChangedCellSize = $$props.hasChangedCellSize;
		if ('scrollPercentage' in $$props) scrollPercentage = $$props.scrollPercentage;
		if ('infobarHeight' in $$props) $$invalidate(7, infobarHeight = $$props.infobarHeight);
		if ('toolbarHeight' in $$props) $$invalidate(8, toolbarHeight = $$props.toolbarHeight);
		if ('scrollbarWidth' in $$props) $$invalidate(9, scrollbarWidth = $$props.scrollbarWidth);
		if ('scrollbarHeight' in $$props) $$invalidate(10, scrollbarHeight = $$props.scrollbarHeight);
		if ('weaveDisplay' in $$props) $$invalidate(11, weaveDisplay = $$props.weaveDisplay);
		if ('resizeObserver' in $$props) resizeObserver = $$props.resizeObserver;
		if ('sidebarOpen' in $$props) $$invalidate(12, sidebarOpen = $$props.sidebarOpen);
		if ('disableScroll' in $$props) disableScroll = $$props.disableScroll;
		if ('selectedMenu' in $$props) $$invalidate(13, selectedMenu = $$props.selectedMenu);
		if ('showTreadleOrder' in $$props) showTreadleOrder = $$props.showTreadleOrder;
		if ('showThreading' in $$props) showThreading = $$props.showThreading;
		if ('cellSize' in $$props) $$invalidate(17, cellSize = $$props.cellSize);
		if ('weftCount' in $$props) $$invalidate(18, weftCount = $$props.weftCount);
		if ('height' in $$props) $$invalidate(14, height = $$props.height);
		if ('warpCount' in $$props) $$invalidate(19, warpCount = $$props.warpCount);
		if ('width' in $$props) $$invalidate(15, width = $$props.width);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*$draft*/ 2) {
			$$invalidate(19, warpCount = $draft.warpCount);
		}

		if ($$self.$$.dirty[0] & /*$draft*/ 2) {
			$$invalidate(18, weftCount = $draft.weftCount);
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 1) {
			$$invalidate(17, cellSize = $ui.cellSize);
		}

		if ($$self.$$.dirty[0] & /*warpCount, cellSize*/ 655360) {
			$$invalidate(15, width = warpCount * cellSize);
		}

		if ($$self.$$.dirty[0] & /*weftCount, cellSize*/ 393216) {
			$$invalidate(14, height = weftCount * cellSize);
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 1) {
			showThreading = $ui.showThreading;
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 1) {
			showTreadleOrder = $ui.showTreadleOrder;
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 1) {
			$$invalidate(13, selectedMenu = $ui.selectedMenu);
		}

		if ($$self.$$.dirty[0] & /*$ui*/ 1) {
			disableScroll = $ui.disableScroll;
		}
	};

	return [
		$ui,
		$draft,
		infobarContainer,
		scrollContainer,
		canvasContainer,
		canvasWidth,
		canvasHeight,
		infobarHeight,
		toolbarHeight,
		scrollbarWidth,
		scrollbarHeight,
		weaveDisplay,
		sidebarOpen,
		selectedMenu,
		height,
		width,
		updatePosition,
		cellSize,
		weftCount,
		warpCount,
		toolbar_height_binding,
		toolbar_sidebarOpen_binding,
		sidebar_open_binding,
		weavedisplay_binding,
		weavedisplay_scrollContainer_binding,
		div2_binding,
		div3_binding,
		div4_binding
	];
}

class Editor extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$1, create_fragment$1, not_equal, {}, null, [-1, -1]);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Editor",
			options,
			id: create_fragment$1.name
		});
	}
}

/* src/App.svelte generated by Svelte v3.43.0 */
const file = "src/App.svelte";

function create_fragment(ctx) {
	let div;
	let editor;
	let t;
	let colorpickerdialog;
	let current;
	editor = new Editor({ $$inline: true });
	colorpickerdialog = new ColorPickerDialog({ $$inline: true });

	const block = {
		c: function create() {
			div = element("div");
			create_component(editor.$$.fragment);
			t = space();
			create_component(colorpickerdialog.$$.fragment);
			attr_dev(div, "class", "application svelte-1qeorvx");
			add_location(div, file, 5, 0, 166);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(editor, div, null);
			insert_dev(target, t, anchor);
			mount_component(colorpickerdialog, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(editor.$$.fragment, local);
			transition_in(colorpickerdialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(editor.$$.fragment, local);
			transition_out(colorpickerdialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(editor);
			if (detaching) detach_dev(t);
			destroy_component(colorpickerdialog, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('App', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ ColorPickerDialog, Editor });
	return [];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance, create_fragment, not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});
	}
}

var en = {
  "page.weave_settings.title": 'Weave settings',
  "page.weave_settings.shaft_count": 'Number of shafts',
  "page.weave_settings.treadle_count": 'Number of treadles',
  "page.weave_settings.warp_count": 'Number of warp threads',
  "page.weave_settings.weft_count": 'Number of weft threads',
  "page.yarn_settings.title": 'Yarn settings',
  "page.yarn_settings.name": 'Name',
  "page.pattern_fill.title": 'Threading or treadle order fill',
  "page.pattern_fill.mirrored_repeat": 'Mirrored repetition',
  "page.pattern_fill.warp_weft_title": 'Threading/treadling',
  "page.pattern_fill.color_title": 'Warp/weft colors',
  "page.pattern_fill.apply": 'Apply',
  "page.repetition.title": 'Warp/weft repetition',
  "page.selection.title": 'Selection',
  "terms.warp": 'Warp',
  "terms.weft": 'Weft',
  "terms.treadling": 'Treadling',
  "terms.threading": 'Threading',
  "terms.treadles": 'Treadles',
  "terms.heddle": 'Heddle',
  "terms.color": 'Color',
  "terms.save": 'Save'
};

addMessages('en', en);

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});

/*
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('serviceworker.js', { scope: './' })
    .then((reg) => {
      // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope);
    })
    .catch((error) => {
      // registration failed
      console.log('Registration failed with ' + error);
    });
}
*/

T();
window.process = { env: { NODE_ENV: 'production' } };

const app = new App({
  target: document.body,
});

window.tinycolor = tinycolor;

export { app as default };
//# sourceMappingURL=main.js.map
