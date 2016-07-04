/**
 * postcss-border-width
 */

var postcss = require("postcss");


module.exports = postcss.plugin('postcss-border-width', function (opts) {
	opts = opts || {};
	var options = {
			parentSelectors: opts.parentSelectors || [':global(.iosx2)', ':global(.iosx3)'],
			maxPixelValue: opts.maxPixelValue || 2
		},
		pxReg = /(\d+)px/,
		borders, rules;

	return function (css) {
		borders = [];
		rules = [];

		css.walkDecls(function (decl) {
			if ( /^border/.test(decl.prop) && pxReg.test(decl.value) ) {
				var width = decl.value.match(pxReg)[1];

				if ( width <= options.maxPixelValue ) {
					var rule = decl.parent,
						selector = rule.selector;

					if ( !borders[width] ) {
						borders[width] = [];
					}

					borders[width].push(selector); // Sort by width
				}
			}
		});

		for ( var i = 1; i < borders.length; i++ ) { // From 1px
			var selectors = borders[i];
			if ( selectors ) {
				var ps = options.parentSelectors;
				var flatenSelector = [];
				var matches;

				selectors.forEach(function(s) {
					matches = (s + ',').match(/\.[^,]+(?=,)/g);
					if ( matches && matches.length > 1 ) {
						flatenSelector = flatenSelector.concat(matches);
					} else {
						flatenSelector.push(s);
					}
				});

				rules.push(ps[0] + ' ' + flatenSelector.join(',\r\n' + ps[0] + ' ') + '{border-width:' + i/2 + 'px}');
				rules.push(ps[1] + ' ' + flatenSelector.join(',\r\n' + ps[1] + ' ') + '{border-width:' + round(i/2.8, 10) + 'px}');
			}
		}

		rules = rules.join('');
		rules = postcss.parse(rules);
		css.append(rules);
	};
});


function round(val, dec) {
	var multiplier = Math.pow(10, dec);
	return Math.round(multiplier * val) /multiplier;
}