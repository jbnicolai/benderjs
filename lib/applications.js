/**
 * @file Manages application resources required by tests
 */
var _ = require('lodash');

/**
 * Application
 * @param {String}         name            Application name
 * @param {Object}         options         Application configuration
 * @param {String}         [options.proxy] Application's URL to proxy into
 * @param {String}         [options.path]  Application's local directory
 * @param {String}         options.url     Application's url
 * @param {Array.<String>} options.files   Application files
 * @constructor
 */
function Application(name, options) {
    if (options.proxy) this.proxy = options.proxy;
    if (options.path) this.path = options.path;
    
    this.name = name;
    this.url = options.url || this.name + '/';
    this.js = [];
    this.css = [];

    this.buildUrls(options.files);
}

/**
 * Build urls to application files that should be included in the test context
 * @param  {Array.<String>} files Names of fiels to be included
 */
Application.prototype.buildUrls = function (files) {
    var pattern = /\.(css|js)$/;

    files.forEach(function (file) {
        var ext = pattern.exec(file);

        if (ext) this[ext[1]].push('/apps/' + this.url + file);
    }.bind(this));
};



/**
 * Application collection
 * @param {Object} config Configuration object
 */
function ApplicationCollection(config) {
    this.applications = {};
    this.config = config;
}

ApplicationCollection.$inject = ['config'];

/**
 * Build application collection based on configuration file
 */
ApplicationCollection.prototype.build = function () {
    var app, name;

    if (!_.isPlainObject(this.config.applications)) return;

    for (name in this.config.applications) {
        app = this.config.applications[name];
        if (this.validate(app)) {
            this.applications[name] = new Application(name, app);
        }
    }
};

/**
 * Validate application's properties
 * @param  {Object} app Application configuration
 * @return {Boolean}
 */
ApplicationCollection.prototype.validate = function (app) {
    return app && app.files && (app.proxy || app.path);
};

/**
 * Get application(s) based on given options
 * @param  {String|Array|Object} options Application name(s) or object property value to find an app
 * @return {Array.<Application>|Null}
 */
ApplicationCollection.prototype.get = function (options) {
    // get application by name
    if (_.isString(options)) return [this.applications[options]] || null;
    
    // get multiple applications
    if (_.isArray(options)) {
        return options.map(function (name) {
            return this.applications[name];
        }.bind(this));
    }
    
    // get application by options, e.g. {url: 'myApp/'}
    if (_.isPlainObject(options)) return _.where(this.applications, options) || null;
    
    // return all apps if no options specified
    return Object.keys(this.applications).map(function (key) {
        return this.applications[key];
    }.bind(this));
};

module.exports = ApplicationCollection;