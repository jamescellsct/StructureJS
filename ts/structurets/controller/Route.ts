class Route
{
    // Regexps
    private _regexSlashes:RegExp = /(^\/+|\/+$)/g;
    private _regexOptionalSlash:RegExp = /(:|})\/:/g;
    private _regexParam:RegExp = /\{([^\(}]+)(\((.[^\)]*)\))?\}/g;
    private _regexOptionalParam:RegExp = /:([^:\(]+)(\((.[^\)]*)\))?:/g;

    /**
     * @type Number
     */
    private INDEX_NOT_FOUND = -1;

    /**
     * @property name
     * @type String
     */
    public name = '';

    /**
     * @property path
     * @type String
     */
    public path = '';

    /**
     * @property patterns
     * @type Object
     */
    public patterns = {};

    /**
     * @property regex
     * @type RegExp
     */
    public regex = null;

    /**
     * @property _isActive
     * @type Boolean
     * @default `false`
     * @private
     */
    private _isActive = false;

    /**
     * @property _previousParams
     * @type String
     * @private
     */
    private _previousParams = '';

    constructor(path, name)
    {
        this.regex = this._pathToRegexp(this.path, this.patterns);

        this.path.replace(this._regexSlashes, '');

        // cleanup path by removed quantifiers
        this.path = this.path.replace(this._regexParam, '{$1}')
            .replace(this._regexOptionalParam, ':$1:');
    }

    /**
     * Convert path to regexp
     *
     * @type Function
     * @param {String} path
     * @param {Object} patterns
     * @returns {RegExp}
     * @private
     */
    private _pathToRegexp(path, patterns) {
        path = path
            .replace(this._regexOptionalSlash, '$1[\/]?:')
            .replace(this._regexParam, function(_, param, extra, pattern) {
                if (extra) {
                    patterns[param] = new RegExp(pattern);
                }
                if (pattern) {
                    return '(' + pattern + ')';
                }
                return '([^\\/?])';
            })
            .replace(this._regexOptionalParam, function(_, param, extra, pattern) {
                if (extra) {
                    patterns[param] = new RegExp(pattern);
                }
                if (pattern) {
                    return '(?:(' + pattern + ')?)';
                }
                return '(?:([^\\/?]+)?\/?)';
            });

        return new RegExp('^/?' + path + '/?$', 'i');
    }

    /**
     * Publish enter event
     *
     * @fires Route#EVENT_ENTER
     *
     * @method enter
     * @param {Array} [params]
     * @chainable
     */
    public enter(params) {
        var stringParams = JSON.stringify(params);

        if (stringParams === this._previousParams) {
            return this;
        }

        this._previousParams = stringParams;
        this._isActive = true;

        params = params || [];

        params.unshift(this.name);

        console.log("publish", params);
        return this//.publish.apply(this, params);
    }

    /**
     * Publish exit event
     *
     * @fires Route#EVENT_EXIT
     *
     * @method exit
     * @chainable
     */
    public exit() {
        this._previousParams = null;
        this._isActive = false;

        console.log("publish", this.name);

        return this//.publish(this.EVENT_EXIT, this.name);
    }


    /**
     * Determine if route is active
     *
     * @method isActive
     * @returns {Boolean}
     */
    public isActive() {
        return this._isActive === true;
    }

    /**
     * Determine if route matches `path`
     *
     * @method getParameters
     * @param {String} path
     * @returns {Array}
     */
    public getParameters(path) {
        var match = this.regex.exec(path);
        var params = [];
        var length = match && match.length;

        for (var i = 1; i < length; ++i) {
            params.push(('string' === typeof match[i]) ? decodeURIComponent(match[i]) : match[i]);
        }

        return params;
    }

    /**
     * Determine if route matches `path`
     *
     * @method match
     * @param {String} path
     * @returns {Boolean}
     */
    public match(path) {
        return this.regex.test(path);
    }

    /**
     * @method generateRoute
     * @param {Object} params
     * @returns {String}
     */
    public generateRoute(params) {
        var path = this.path;
        var param;

        for (param in params) {
            if (params.hasOwnProperty(param)) {
                if (this.patterns.hasOwnProperty(param)) {
                    if (!this.patterns[param].test(params[param])) {
                        continue;
                    }
                }

                path = path
                    .replace('{' + param + '}', params[param])
                    .replace(':' + param + ':', params[param]);
            }
        }

        path = path
            .replace(this._regexOptionalSlash, '$1:')
            .replace(this._regexOptionalParam, '');

        if (path.indexOf('{') !== this.INDEX_NOT_FOUND) {
            throw new Error('missing parameters for url: ' + path);
        }

        return '/' + path;
    }


}
export = Route;