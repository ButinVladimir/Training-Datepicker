/**
 * Months names
 */
var MONTHS_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Window template
 */
var DATEPICKER_HTML = document.getElementById('template').innerHTML;

/**
 * Datepicker window constructor function
 */
function DatepickerWindow() {
    this._datepickerWindow = null;
    this._currentDatepicker = null;

    this._day = 0;
    this._year = 0;
    this._month = 0;

    var todayDate = new Date();
    this._currentDay = todayDate.getDate();
    this._currentMonth = todayDate.getMonth();
    this._currentYear = todayDate.getFullYear();
}

/**
 * Day getter
 */
DatepickerWindow.prototype.getDay = function() {
    return this._day;
};

/**
 * Month getter
 */
DatepickerWindow.prototype.getMonth = function() {
    return this._month;
};

/**
 * Year getter
 */
DatepickerWindow.prototype.getYear = function() {
    return this._year;
};

/**
 * Display window
 */
DatepickerWindow.prototype.show = function(datepicker, posX, posY) {
    if (this._datepickerWindow === null) {
        this._renderWindow();
        this._registerHandlers();
    }

    this._currentDatepicker = datepicker;
    this._datepickerWindow.style.display = 'block';

    this._datepickerWindow.style.left = posX;
    this._datepickerWindow.style.top = posY;

    this._day = datepicker.getDay();
    this._month = datepicker.getMonth();
    this._year = datepicker.getYear();

    this._renderMonthCaption();
    this._renderDaysContent();
};

/**
 * Hide window
 */
DatepickerWindow.prototype.hide = function() {
    this._currentDatepicker = null;
    this._datepickerWindow.style.display = 'none';
};

/**
 * Render window element
 */
DatepickerWindow.prototype._renderWindow = function() {
    var datepickerWindow = document.createElement('div');

    this._datepickerWindow = datepickerWindow;
    datepickerWindow.classList.add('datepicker-window');
    datepickerWindow.innerHTML = DATEPICKER_HTML;

    this._prevMonthButton = datepickerWindow.querySelector('.datepicker-prev-month-button');
    this._nextMonthButton = datepickerWindow.querySelector('.datepicker-next-month-button');

    this._monthCaption = datepickerWindow.querySelector('.datepicker-month-caption');
    this._daysContent = datepickerWindow.querySelector('.datepicker-days tbody');

    document.body.appendChild(datepickerWindow);
};

/**
 * Register handlers
 */
DatepickerWindow.prototype._registerHandlers = function() {
    var self = this;

    this._datepickerWindow.addEventListener('click', function(e) {
        e.stopPropagation(); 
    });

    document.addEventListener('click', function(e) {
        e.stopPropagation();

        self.hide();
    });

    this._prevMonthButton.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        self._prevMonth();
    });

    this._nextMonthButton.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        self._nextMonth();
    });

    this._daysContent.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        var day = +e.target.getAttribute('date-day');
        if (day !== 0) {
            self._day = +e.target.getAttribute('date-day');
            self._currentDatepicker.changeDate();
        }
    });
};

/**
 * Prev month button handler
 */
DatepickerWindow.prototype._prevMonth = function() {
    this._month--;
    if (this._month < 0) {
        this._month = 11;
        this._year--;
    }

    this._renderMonthCaption();
    this._renderDaysContent();
};

/**
 * Next month button handler
 */        
DatepickerWindow.prototype._nextMonth = function() {
    this._month++;
    if (this._month >= 12) {
        this._month = 0;
        this._year++;
    }

    this._renderMonthCaption();
    this._renderDaysContent();
};

/**
 * Render month caption
 */
DatepickerWindow.prototype._renderMonthCaption = function() {
   this._monthCaption.innerHTML = MONTHS_NAMES[this._month] + ' ' + this._year;
};

/**
 * Render days table content
 */
DatepickerWindow.prototype._renderDaysContent = function() {
    this._daysContent.innerHTML = '';

    var row = document.createElement('tr'),
        dayOfWeek = (new Date(this._year, this._month, 1)).getDay(),
        offset;

    for (offset = 0; offset < dayOfWeek; offset++) {
        row.appendChild(this._renderEmptyDayCell());
    }

    var daysInMonth = (new Date(this._year, this._month + 1, 0)).getDate();
    for (var day = 1; day <= daysInMonth; day++) {
        row.appendChild(this._renderDayCell(day));
        dayOfWeek++;

        if (dayOfWeek == 7) {
            this._daysContent.appendChild(row);
            row = day == daysInMonth ? null : document.createElement('tr');
            dayOfWeek = 0;
        }
    }

    if (dayOfWeek !== 0) {
        for (offset = dayOfWeek; offset < 7; offset++) {
            row.appendChild(this._renderEmptyDayCell());
        }
        this._daysContent.appendChild(row);
    }
};

/**
 * Render single day cell
 */
DatepickerWindow.prototype._renderDayCell = function(day, month, year) {
    var cell = document.createElement('td'),
        link = document.createElement('a');

    link.href = '#';
    link.setAttribute('date-day', day);
    link.innerHTML = day;

    if (this._currentDatepicker.getYear() === this._year && this._currentDatepicker.getMonth() === this._month && this._currentDatepicker.getDay() === day) {
        link.classList.add('selected');
    }

    if (this._currentYear === this._year && this._currentMonth === this._month && this._currentDay === day) {
        link.classList.add('today');
    }


    cell.appendChild(link);

    return cell;
};

/**
 * Render single empty day cell
 */
DatepickerWindow.prototype._renderEmptyDayCell = function() {
    var cell = document.createElement('td');

    return cell;
};
