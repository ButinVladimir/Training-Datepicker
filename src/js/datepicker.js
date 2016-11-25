/**
 * Datepicker construction
 * Month should be in range of 1-12 and day should be in range of 1-31
 *
 * @param {object} element - DOM element to which datepicker instance is attached
 * @param {number} year - Initial year value
 * @param {number} month - Initial month value
 * @param {number} day - Initial day value
 * @param {function} format - Formatting callback
 * @param {DatepickerWindow} datepickerWindow - Instance of DatepickerWindow
 */
function Datepicker(element, year, month, day, format, datepickerWindow) {
    var date = new Date(),
        self = this;

    this._element = element;
    this._datepickerWindow = datepickerWindow;
    this._year = year;
    this._month = month - 1;
    this._day = day;
    this._format = format;

    this._element.addEventListener('datepicker.show', function(e) {
        e.stopPropagation();

        datepickerWindow.show(
            self,
            self._element.offsetLeft + window.scrollX + 'px',
            self._element.offsetTop + element.clientHeight + 4 + window.scrollY + 'px'
        );
    });
}

/**
 * Day getter
 */
Datepicker.prototype.getDay = function() {
    return this._day;
};

/**
 * Month getter
 */
Datepicker.prototype.getMonth = function() {
    return this._month;
};

/**
 * Year getter
 */
Datepicker.prototype.getYear = function() {
    return this._year;
};

/**
 * Date changed
 */
Datepicker.prototype.changeDate = function() {
    this._year = this._datepickerWindow.getYear();
    this._month = this._datepickerWindow.getMonth();
    this._day = this._datepickerWindow.getDay();

    var changeDateEvent = new CustomEvent('datepicker.change', {detail: this._format(this._year, this._month + 1, this._day)});
    this._element.dispatchEvent(changeDateEvent);
    this._datepickerWindow.hide();
};


var createDatepicker = (function() {
    var datepickerWindow = null;

    return function(element, year, month, day, format) {
        datepickerWindow = datepickerWindow || new DatepickerWindow();

        return new Datepicker(element, year, month, day, format, datepickerWindow);
    };
})();
