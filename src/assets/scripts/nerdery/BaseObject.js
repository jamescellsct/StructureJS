define(function(require, exports, module) {
    'use strict';

    var Util = require('nerdery/util/Util');

    /**
    * The {{#crossLink "BaseObject"}}{{/crossLink}} class is an abstract class that provides common properties and functionality for all StructureTS classes.
    *
    * @class BaseObject
    * @module StructureTS
    * @submodule core
    * @constructor
    * @version 0.1.0
    **/
    var BaseObject = (function () {

        function BaseObject() {
            /**
             * The fully qualified class name of the object. Use {{#crossLink "BaseObject/getQualifiedClassName:method"}}{{/crossLink}} method to retrieve the class name of a StructureTS object.
             *
             * @property CLASS_NAME
             * @type {string}
             * @final
             * @protected
             */
            this.CLASS_NAME = 'BaseObject';
            /**
             * The cid or client id is a unique identifier automatically assigned to most StructureTS objects upon instantiation.
             *
             * @property cid
             * @type {int}
             * @default null
             * @writeOnce
             * @public
             */
            this.cid = Util.uniqueId();
        }
        /**
         * Returns the fully qualified class name of an object.
         * @example
         *      instance.getQualifiedClassName();
         * @method getQualifiedClassName
         * @returns {string} Returns the class name.
         * @public
         */
        BaseObject.prototype.getQualifiedClassName = function () {
            return this.CLASS_NAME;
        };

        /**
         * The purpose of the destroy method is to make an object ready for garbage collection. This
         * should be thought of as a one way function. Once destroy is called no further methods should be
         * called on the object or properties accessed. It is the responsibility of those who implement this
         * function to stop all running Timers, all running Sounds, remove any event
         * listeners and take any other steps necessary to make an object eligible for garbage collection.
         * It is critical that all subclasses call the super for this function in their overridden methods.
         *
         * Note: super.destroy(); should be called first before you clean up any other objects/items in the current classs.
         * The {{#crossLink "BaseObject/destroy:method"}}{{/crossLink}} method also calls the
         * {{#crossLink "EventDispatcher/disable:method"}}{{/crossLink}} method on all classes that extend
         * {{#crossLink "EventDispatcher"}}{{/crossLink}}.
         * @example
         *      public destroy():void {
        *          super.destroy();
        *
        *          this._childInstance.destroy();
        *          this._childInstance = null;
        *      }
         * @method destroy
         * @public
         */
        BaseObject.prototype.destroy = function () {
        };

        return BaseObject;
    })();

    module.exports = BaseObject;

});

