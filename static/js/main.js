(function (window, Ember, EmberSockets) {

    window.App = Ember.Application.create({
        Socket: EmberSockets.extend({
            host: window.location.hostname,
            port: window.location.port,
            namespace: 'dashboard',
            options: {
                'reconnection delay': 2000,
                'reconnection limit': 2000,
                'max reconnection attempts': Infinity
            },
            controllers: ['application', 'browsers']
        })
    });

    App.newJob = Ember.Object.extend({
        description: '',
        browsersText: '',

        browsers: function () {
            return this.get('browsersText')
                .trim().split(' ')
                    .uniq()
                    .filter(function (item) {
                        return item;
                    });
        }.property('browsersText'),

        addBrowser: function (name) {
            this.set('browsersText', this.get('browsersText').trim() + ' ' + name);
        }
    }).create();

    App.Router.map(function () {
        this.resource('tests');
        this.resource('jobs');
        this.resource('job', { path: '/jobs/:job_id' });
        this.resource('browsers');
    });

    App.IndexRoute = Ember.Route.extend({
        redirect: function () {
            this.transitionTo('tests');
        }
    });

    App.ApplicationController = Ember.Controller.extend({
        needs: ['tests', 'browsers'],

        browsersCount: Ember.computed.alias('controllers.browsers.clients.length'),
        testsRunning: Ember.computed.alias('controllers.tests.testStatus.running'),

        tabs: [
            { target: 'tests', name: 'Tests' },
            { target: 'jobs', name: 'Jobs' },
            { target: 'browsers', name: 'Browsers', browsers: true }
        ],

        socketStatus: Ember.Object.extend({
            status: 'disconnected',

            css: function () {
                var status = this.get('status');

                return status === 'connected' ? 'success' :
                    status === 'reconnecting' ? 'warning' : 'danger';
            }.property('status')
        }).create(),

        sockets: {
            connect: function () {
                this.socket.emit('register');
                this.socketStatus.set('status', 'connected');
            },
            reconnect: function () {
                this.socketStatus.set('status', 'reconnecting');
            },
            reconnecting: function () {
                this.socketStatus.set('status', 'reconnecting');
            },
            reconnect_failed: function () {
                this.socketStatus.set('status', 'disconnected');
            },
            disconnect: function () {
                this.socketStatus.set('status', 'disconnected');
            }
        }
    });

})(this, Ember, EmberSockets);