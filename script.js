(function(window, document) {
    const MONTHS_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
                        <th>Ss</th>
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
         */
        constructor(element, datepickerWindow) {
            let date = new Date();

            this._element = element;
            this._datepickerWindow = datepickerWindow;
            this._year = date.getFullYear();
            this._month = date.getMonth();
            this._day = date.getDate() - 1;

            element.addEventListener('click', e => {
                e.stopPropagation();

                datepickerWindow.show(this);
            });
        }

        /**
         * Element getter
         */
        getElement() {
            return this._element;
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

            this._element.value = this._year + '.' + (this._month + 1) + '.' + (this._day + 1);
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
            this._makeWindow();
            this._registerWindowClickHandler();
            this._currentDatepicker = null;

            this._day = 0;
            this._year = 0;
            this._month = 0;

            let todayDate = new Date();
            this._currentDay = todayDate.getDate() - 1;
            this._currentMonth = todayDate.getMonth();
            this._currentYear = todayDate.getFullYear();
            console.log(this);
		}

        /**
         * Register global window click handler
         */
        _registerWindowClickHandler() {
            this._datepickerWindow.addEventListener('click', e => { e.stopPropagation(); });

            document.addEventListener('click', e => {
                e.stopPropagation();

                this.hide();
            });
        }

        /**
         * Create window element
         */
        _makeWindow() {
            console.log('creating window');

            let datepickerWindow = document.createElement('div');
            this._datepickerWindow = datepickerWindow;
            datepickerWindow.classList.add('datepicker-window');
            datepickerWindow.innerHTML = DATEPICKER_HTML;

            this._prevMonthButton = datepickerWindow.querySelector('.datepicker-prev-month-button');
            this._prevMonthButton.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();

                this._prevMonth();
            });

            this._nextMonthButton = datepickerWindow.querySelector('.datepicker-next-month-button');
            this._nextMonthButton.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();

                this._nextMonth();
            });

            this._monthCaption = datepickerWindow.querySelector('.datepicker-month-caption');
            this._daysContent = datepickerWindow.querySelector('.datepicker-days tbody');
            this._daysContent.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();

                this._day = +e.target.getAttribute('date-day');
                this._currentDatepicker.changeDate();
            });

            document.body.appendChild(datepickerWindow);
        }

        /**
         * Display window
         */
        show(datepicker) {
            this._currentDatepicker = datepicker;
            this._datepickerWindow.style.display = 'block';

            let element = datepicker.getElement();
            this._datepickerWindow.style.left = element.offsetLeft + window.scrollX + 'px';
            this._datepickerWindow.style.top = element.offsetTop + element.clientHeight + 4 + window.scrollY + 'px';

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

            for (let i = 0; i < dayOfWeek; i++) {
                row.appendChild(this._renderEmptyDayCell());
            }

            let daysInMonth = (new Date(this._year, this._month + 1, 0)).getDate();
            for (let day = 0; day < daysInMonth; day++) {
                row.appendChild(this._renderDayCell(day));
                dayOfWeek++;

                if (dayOfWeek == 7) {
                    this._daysContent.appendChild(row);
                    row = day == daysInMonth - 1 ? null : document.createElement('tr');
                    dayOfWeek = 0;
                }
            }

            if (dayOfWeek !== 0) {
                for (let i = dayOfWeek; i < 7; i++) {
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
            link.innerHTML = day + 1;
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
    }

    let datepickerWindow = new DatepickerWindow();

    let picker1 = new Datepicker(document.querySelector('#target1'), datepickerWindow);
    let picker2 = new Datepicker(document.querySelector('#target2'), datepickerWindow);
})(window, document);