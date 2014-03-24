var request = require('request'),
    send = require('send');

/**
 * Create a HTTP handler serving/proxying application files
 * @return {Function}
 */
function create(applications) {
    var pattern = /^\/apps\/([\w-_%]+\/)([\w\/\.-_%]+)$/;

    applications.build();

    return function (req, res, next) {
        var match = pattern.exec(req.url),
            filePath,
            app;

        // url matches /apps/<appname> and there's an app with given url
        if (match && (app = applications.get({ url: match[1] }))) {

            app = app[0];

            filePath = match[2];

            // proxy request to external server
            if (app.proxy) {
                req.pipe(request(app.proxy + filePath)).pipe(res);
            // server file from local file system
            } else {
                send(req, filePath).root(app.path).pipe(res);
            }
        // nothing to do here
        } else {
            next();
        }
    };
}

module.exports.create = create;