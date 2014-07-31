var bl = require( 'browser-launcher' ),
	logger = require( './logger' ).create( 'launcher', true );

module.exports = {
	name: 'bender-launcher',

	attach: function() {
		var bender = this;

		bender.launcher = {
			launch: function( browser ) {
				bl( function( err, launcher ) {
					if ( err ) {
						logger.error( String( err ) );
					}

					console.log( 'browsers found:', require( 'util' ).inspect( launcher.browsers, {
						depth: 3
					} ) );

					var opts = {
						browser: browser
					};

					launcher( bender.conf.address + '/capture', opts, function( err, instance ) {
						if ( err ) {
							logger.error( String( err ) );
							process.exit( 1 );
						}

						bender.on( 'queues:beforeComplete', function() {
							instance.stop();
						} );
					} );
				} );
			}
		};
	}
};