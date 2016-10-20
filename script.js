let createDatepicker = (function(window, document) {
    /**
     * Months names
     */
    const MONTHS_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    /**
     * Window template
     */
    const DATEPICKER_HTML = `
        <div class="datepicker-header">
            <a href="#" class="datepicker-month-button datepicker-prev-month-button">
                <span class="datepicker-month-button-text">&#8678</span>
            </a>
            <a href="#" class="datepicker-month-button datepicker-next-month-button">
                <span class="datepicker-month-button-text">&#8680</span>
            </a>
            <div class="datepicker-month-caption">
                2016
            </div>
        </div>
        <div class="datepicker-days">
            <table class="datepicker-days-table">
                <thead>
                    <tr>
                        <th>Su</th>
                        <th>Mo</th>
                        <th>Tu</th>
                        <th>We</th>
                        <th>Th</th>
                        <th>Fr</th>
                        <th>Sa</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    `;

    class Datepicker {
        /**
         * Datepicker construction
         * Month should be in range of 1-12 and day should be in range of 1-31
         *
         * @param {Object} element - DOM element to which datepicker instance is attached
         * @param {Number} year - Initial year value
         * @param {Number} month - Initial month value
         * @param {Number} day - Initial day value
         * @param {Function} format - Formatting callback
         * @param {DatepickerWindow} datepickerWindow - Instance of DatepickerWindow
         */
        constructor(element, year, month, day, format, datepickerWindow) {
            let date = new Date();

            this._element = element;
            this._datepickerWindow = datepickerWindow;
            this._year = year;
            this._month = month - 1;
            this._day = day;
            this._format = format;

            this._element.addEventListener('datepicker.show', e => {
                e.stopPropagation();

                datepickerWindow.show(
                    this,
                    this._element.offsetLeft + window.scrollX + 'px',
                    this._element.offsetTop + element.clientHeight + 4 + window.scrollY + 'px'
                );
            });
        }

        /**
         * Day getter
         */
        getDay() {
            return this._day;
        }

        /**
         * Month getter
         */
        getMonth() {
            return this._month;
        }

        /**
         * Year getter
         */
        getYear() {
            return this._year;
        }

        /**
         * Date changed
         */
        changeDate() {
            this._year = this._datepickerWindow.getYear();
            this._month = this._datepickerWindow.getMonth();
            this._day = this._datepickerWindow.getDay();

            let changeDateEvent = new CustomEvent('datepicker.change', {detail: this._format(this._year, this._month, this._day)});
            this._element.dispatchEvent(changeDateEvent);
            this._datepickerWindow.hide();
        }
    }

	/**
     * Class for datepicker window
     */
    class DatepickerWindow {
		/**
         * Window constructor function
         */
        constructor() {
            this._datepickerWindow = null;
            this._currentDatepicker = null;

            this._day = 0;
            this._year = 0;
            this._month = 0;

            let todayDate = new Date();
            this._currentDay = todayDate.getDate();
            this._currentMonth = todayDate.getMonth();
            this._currentYear = todayDate.getFullYear();
		}

        /**
         * Day getter
         */
        getDay() {
            return this._day;
        }

        /**
         * Month getter
         */
        getMonth() {
            return this._month;
        }

        /**
         * Year getter
         */
        getYear() {
            return this._year;
        }

        /**
         * Display window
         */
        show(datepicker, posX, posY) {
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
        }

        /**
         * Hide window
         */
        hide() {
            this._currentDatepicker = null;
            this._datepickerWindow.style.display = 'none';
        }

        /**
         * Render window element
         */
        _renderWindow() {
            let datepickerWindow = document.createElement('div');
            this._datepickerWindow = datepickerWindow;
            datepickerWindow.classList.add('datepicker-window');
            datepickerWindow.innerHTML = DATEPICKER_HTML;

            this._prevMonthButton = datepickerWindow.querySelector('.datepicker-prev-month-button');
            this._nextMonthButton = datepickerWindow.querySelector('.datepicker-next-month-button');

            this._monthCaption = datepickerWindow.querySelector('.datepicker-month-caption');
            this._daysContent = datepickerWindow.querySelector('.datepicker-days tbody');

            document.body.appendChild(datepickerWindow);
        }

        /**
         * Register handlers
         */
        _registerHandlers() {
            this._datepickerWindow.addEventListener('click', e => { e.stopPropagation(); });

            document.addEventListener('click', e => {
                e.stopPropagation();

                this.hide();
            });

            this._prevMonthButton.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();

                this._prevMonth();
            });

            this._nextMonthButton.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();

                this._nextMonth();
            });

            this._daysContent.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();

                let day = +e.target.getAttribute('date-day');
                if (day !== 0) {
                    this._day = +e.target.getAttribute('date-day');
                    this._currentDatepicker.changeDate();
                }
            });
        }

        /**
         * Prev month button handler
         */
        _prevMonth() {
            this._month--;
            if (this._month < 0) {
                this._month = 11;
                this._year--;
            }

            this._renderMonthCaption();
            this._renderDaysContent();
        }

        /**
         * Next month button handler
         */        
        _nextMonth() {
            this._month++;
            if (this._month >= 12) {
                this._month = 0;
                this._year++;
            }

            this._renderMonthCaption();
            this._renderDaysContent();
        }

        /**
         * Render month caption
         */
        _renderMonthCaption() {
           this._monthCaption.innerHTML = MONTHS_NAMES[this._month] + ' ' + this._year;
        }

        /**
         * Render days table content
         */
        _renderDaysContent() {
            this._daysContent.innerHTML = '';

            let row = document.createElement('tr');
            let dayOfWeek = (new Date(this._year, this._month, 1)).getDay();

            for (let offset = 0; offset < dayOfWeek; offset++) {
                row.appendChild(this._renderEmptyDayCell());
            }

            let daysInMonth = (new Date(this._year, this._month + 1, 0)).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                row.appendChild(this._renderDayCell(day));
                dayOfWeek++;

                if (dayOfWeek == 7) {
                    this._daysContent.appendChild(row);
                    row = day == daysInMonth ? null : document.createElement('tr');
                    dayOfWeek = 0;
                }
            }

            if (dayOfWeek !== 0) {
                for (let offset = dayOfWeek; offset < 7; offset++) {
                    row.appendChild(this._renderEmptyDayCell());
                }
                this._daysContent.appendChild(row);
            }
        }

        /**
         * Render single day cell
         */
        _renderDayCell(day, month, year) {
            let cell = document.createElement('td');

            let link = document.createElement('a');
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
        }

        /**
         * Render single empty day cell
         */
        _renderEmptyDayCell() {
            let cell = document.createElement('td');

            return cell;
        }
    }

    let datepickerWindow = null;

    return function(element, year, month, day, format) {
        datepickerWindow = datepickerWindow || new DatepickerWindow();

        return new Datepicker(element, year, month, day, format, datepickerWindow);
    }
})(window, document);

/**
 * Formatting function
 */
function format(year, month, day) {
    return year + '.' + (month + 1) + '.' + day;
}

// First input

let input1 = document.querySelector('#target1');
let picker1 = createDatepicker(input1, 2016, 11, 1, format);

input1.addEventListener('click', e => {
    e.stopPropagation();

    let showDatepickerEvent = new CustomEvent('datepicker.show');
    input1.dispatchEvent(showDatepickerEvent);
});

input1.addEventListener('datepicker.change', e => {
    e.stopPropagation();

    input1.value = e.detail;
});


// Second input

let input2 = document.querySelector('#target2');
let picker2 = createDatepicker(input2, 2016, 10, 1, format);

input2.addEventListener('click', e => {
    e.stopPropagation();

    let showDatepickerEvent = new CustomEvent('datepicker.show');
    input2.dispatchEvent(showDatepickerEvent);
});

input2.addEventListener('datepicker.change', e => {
    e.stopPropagation();

    input2.value = e.detail;
});
