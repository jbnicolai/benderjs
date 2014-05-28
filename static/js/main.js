/**
 * Marionette Application
 */
var App = new Backbone.Marionette.Application();

/**
 * Navigate to a route
 * @param {String}  route             Route to navigate to
 * @param {Object}  [options]         Backbone.history.navigate options
 * @param {Boolean} [options.trigger] Force triggering route event
 * @param {Boolean} [options.replace] Replace current route with new one instead of adding another record in the history
 *
 */
App.navigate = function ( route, options ) {
    options = options || {
        trigger: true
    };

    Backbone.history.navigate( route, options );
};

/**
 * Get current route
 * @return {String}
 */
App.getCurrentRoute = function () {
    return Backbone.history.fragment;
};

/**
 * Alias for history.back
 */
App.back = function () {
    Backbone.history.history.back();
};

/**
 * Main layout region responsible for displaying dialog modals
 */
App.ModalRegion = Backbone.Marionette.Region.extend( {
    el: '#modal',

    constructor: function () {
        _.bindAll( this, 'getEl', 'showModal', 'hideModal' );
        Backbone.Marionette.Region.prototype.constructor.apply( this, arguments );
        this.on( 'show', this.showModal, this );
    },

    getEl: function ( selector ) {
        var $el = $( selector );

        $el.on( 'hidden', this.close );
        return $el;
    },

    showModal: function ( view ) {
        view.on( 'close', this.hideModal, this );
        this.$el.modal( 'show' );
    },

    hideModal: function () {
        this.$el.modal( 'hide' );
    }
} );

App.addRegions( {
    socketStatus: '#socket-status',
    tabs: '#tabs',
    header: '#header',
    content: '#content',
    modal: App.ModalRegion
} );

App.on( 'initialize:after', function () {
    Backbone.history.start();
    if ( this.getCurrentRoute() === '' ) App.Tests.trigger( 'tests:list' );
} );
