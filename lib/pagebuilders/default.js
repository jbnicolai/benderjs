/**
 * Copyright (c) 2014-2015, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 *
 * @file Default page builder delivering default test page template
 */

'use strict';

var path = require( 'path' );

module.exports = {
	name: 'bender-pagebuilder-default',

	build: function( data ) {
		var bender = this;

		data.parts.push(
			bender.files.readString( path.join( __dirname, '../../static/default.html' ) )
		);

		return data;
	},

	attach: function() {
		var bender = this;

		bender.checkDeps( module.exports.name, 'pagebuilders' );

		// add the default builder at the beginning
		bender.pagebuilders.add( 'default', module.exports.build, -1 );
	}
};
