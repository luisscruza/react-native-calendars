const { isToday, isDateNotInRange, sameMonth } = require('./dateutils');
const { toMarkingFormat } = require('./interface');
export function getState(day, current, props, disableDaySelection) {
    var _a;
    const { minDate, maxDate, disabledByDefault, disabledByWeekDays, context } = props;
    let state;
    if (!disableDaySelection && ((_a = context === null || context === void 0 ? void 0 : context.selectedDate) !== null && _a !== void 0 ? _a : toMarkingFormat(current)) === toMarkingFormat(day)) {
        state = 'selected';
    }
    else if (isToday(day)) {
        state = 'today';
    }
    else if (disabledByDefault) {
        state = 'disabled';
    }
    else if (isDateNotInRange(day, minDate, maxDate)) {
        state = 'disabled';
    }
    else if (!sameMonth(day, current)) {
        state = 'disabled';
    }
    else if (disabledByWeekDays && disabledByWeekDays.indexOf(day.getDay()) !== -1) {
        state = 'disabled';
    }
    return state;
}
