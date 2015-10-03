var $ = require('jquery');
var Extend = require('structurejs/util/Extend');
var DOMElement = require('structurejs/display/DOMElement');
var BaseEvent = require('structurejs/event/BaseEvent');
var Key = require('../constant/Key');

/**
 * TODO: YUIDoc_comment
 *
 * @class ListItemComponent
 * @extends DOMElement
 * @constructor
 **/
var ListItemComponent = (function () {

    var _super = Extend(ListItemComponent, DOMElement);

    function ListItemComponent(model){
        _super.call(this);

        /**
         * Holds onto the model for this view.
         *
         * @property model
         * @type {ListItemModel}
         * @public
         */
        this.model = model;

        /**
         * @property _$itemInput
         * @type {jQuery}
         * @private
         */
        this._$itemInput = null;

        /**
         * @property _$itemLabel
         * @type {jQuery}
         * @private
         */
        this._$itemLabel = null;

        /**
         * TODO: YUIDoc_comment
         *
         * @property _$markCompleteCheckbox
         * @type {jQuery}
         * @private
         */
        this._$markCompleteCheckbox = null;
    }

    /**
     * @overridden DOMElement.create
     */
    ListItemComponent.prototype.create = function () {
        _super.prototype.create.call(this, '#listItemTemplate', this.model);

        this._$itemInput = this.$element.find('.js-itemText');
        this._$itemLabel = this.$element.find('.js-editTodo');
        this._$markCompleteCheckbox = this.$element.find('.js-markComplete');
    };

    /**
     * @overridden DOMElement.layout
     */
    ListItemComponent.prototype.layout = function () {
        this.$element.toggleClass('completed', this.model.isComplete);

        this._$markCompleteCheckbox.prop('checked', this.model.isComplete);

        return this;
    };

    /**
     * @overridden DOMElement.enable
     */
    ListItemComponent.prototype.enable = function () {
        if (this.isEnabled === true) { return this; }

        this.$element.addEventListener('click', '.js-markComplete', this._onItemToggleComplete, this);
        this.$element.addEventListener('click', '.js-removeTodo', this._onItemRemove, this);
        this.$element.addEventListener('dblclick', '.js-editTodo', this._onItemEdit, this);

        this.$element.addEventListener('keydown', this._onEscapeKey, this);
        this.$element.addEventListener('keypress', this._onEnterKey, this);
        this._$itemInput.addEventListener('blur', this._onInputBlur, this);

        return _super.prototype.enable.call(this);
    };

    /**
     * @overridden DOMElement.disable
     */
    ListItemComponent.prototype.disable = function () {
        if (this.isEnabled === false) { return this; }

        this.$element.removeEventListener('click', '.js-markComplete', this._onItemToggleComplete, this);
        this.$element.removeEventListener('click', '.js-removeTodo', this._onItemRemove, this);
        this.$element.removeEventListener('dblclick', '.js-editTodo', this._onItemEdit, this);

        this.$element.removeEventListener('keydown', this._onEscapeKey, this);
        this.$element.removeEventListener('keypress', this._onEnterKey, this);
        this._$itemInput.removeEventListener('blur', this._onInputBlur, this);

        return _super.prototype.disable.call(this);
    };

    /**
     * @overridden DOMElement.destroy
     */
    ListItemComponent.prototype.destroy = function () {
        // Destroy the child objects and references in this parent class to prevent memory leaks.

        _super.prototype.destroy.call(this);
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method setCompleted
     * @public
     */
    ListItemComponent.prototype.setCompleted = function() {
        this.model.isComplete = true;

        this.layout();
        this._saveItemText();
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method setUnCompleted
     * @public
     */
    ListItemComponent.prototype.setUnCompleted = function() {
        this.model.isComplete = false;

        this.layout();
        this._saveItemText();
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method isComplete
     * @public
     */
    ListItemComponent.prototype.isComplete = function() {
        return this.model.isComplete;
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method hide
     * @public
     */
    ListItemComponent.prototype.hide = function() {
        this.$element.hide();
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method show
     * @public
     */
    ListItemComponent.prototype.show = function() {
        this.$element.show();
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method _onItemToggleComplete
     * @private
     */
    ListItemComponent.prototype._onItemToggleComplete = function(event) {
        var isChecked = $(event.target).prop('checked');

        this.model.isComplete = isChecked;

        this.layout();
        this._saveItemText();
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method _onItemEdit
     * @private
     */
    ListItemComponent.prototype._onItemEdit = function(event) {
        this.$element.addClass('editing');

        this._$itemInput.focus();
        this._$itemInput.select();
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method _onEscapeKey
     * @private
     */
    ListItemComponent.prototype._onEscapeKey = function(event) {
        if (event.which === Key.ESC) {
            this._resetItemText();
        }
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method _onEscapeKey
     * @private
     */
    ListItemComponent.prototype._onInputBlur = function(event) {
        var todoText = this._$itemInput.val().trim();

        if (todoText != '') {
            this.model.text = todoText;
            this._resetItemText();
            this._saveItemText();
        } else {
            this._resetItemText();
        }
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method _resetItemText
     * @private
     */
    ListItemComponent.prototype._resetItemText = function() {
        this.$element.removeClass('editing');

        // We need to reset the hidden input back to the original value.
        this._$itemInput.val(this.model.text);
        this._$itemLabel.text(this.model.text);
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method _saveItemText
     * @private
     */
    ListItemComponent.prototype._saveItemText = function() {
        this.dispatchEvent(new BaseEvent(BaseEvent.CHANGE, true, true, this.model));
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method _onItemRemove
     * @private
     */
    ListItemComponent.prototype._onItemRemove = function(event) {
        this.dispatchEvent(new BaseEvent(BaseEvent.REMOVED, true));
    };

    /**
     * TODO: YUIDoc_comment
     *
     * @method _onEnterKey
     * @private
     */
    ListItemComponent.prototype._onEnterKey = function(event) {
        var todoText = this._$itemInput.val().trim();

        if (event.which === Key.ENTER) {
            if (todoText != '') {
                this.model.text = todoText;
                this._resetItemText();
                this._saveItemText();
            } else {
                this._resetItemText();
            }
        }
    };

    return ListItemComponent;
})();

module.exports = ListItemComponent;
