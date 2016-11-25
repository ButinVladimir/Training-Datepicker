/**
 * Formatting function
 */
function format(year, month, day) {
    return year + '.' + month + '.' + day;
}


// First input

var input1 = document.querySelector('#target1'),
    picker1 = createDatepicker(input1, 2016, 11, 1, format);

input1.addEventListener('click', function(e) {
    e.stopPropagation();

    var showDatepickerEvent = new CustomEvent('datepicker.show');
    input1.dispatchEvent(showDatepickerEvent);
});

input1.addEventListener('datepicker.change', function(e) {
    e.stopPropagation();

    input1.value = e.detail;
});


// Second input

var input2 = document.querySelector('#target2'),
    picker2 = createDatepicker(input2, 2016, 10, 1, format);

input2.addEventListener('click', function(e) {
    e.stopPropagation();

    var showDatepickerEvent = new CustomEvent('datepicker.show');
    input2.dispatchEvent(showDatepickerEvent);
});

input2.addEventListener('datepicker.change', function(e) {
    e.stopPropagation();

    input2.value = e.detail;
});
