import PropTypes from 'prop-types';
import XDate from 'xdate';
import isEmpty from 'lodash/isEmpty';
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { AccessibilityInfo, View } from 'react-native';
// @ts-expect-error
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import constants from '../commons/constants';
import { page, isGTE, isLTE, sameMonth } from '../dateutils';
import { xdateToData, parseDate, toMarkingFormat } from '../interface';
import { getState } from '../day-state-manager';
import { extractHeaderProps, extractDayProps } from '../componentUpdater';
import { useDidUpdate } from '../hooks';
import styleConstructor from './style';
import CalendarHeader from './header';
import Day from './day/index';
import BasicDay from './day/basic';
/**
 * @description: Calendar component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar.gif
 */
const Calendar = (props) => {
    const { initialDate, current, theme, markedDates, minDate, maxDate, allowSelectionOutOfRange, onDayPress, onDayLongPress, onMonthChange, onVisibleMonthsChange, disableMonthChange, enableSwipeMonths, hideExtraDays, firstDay, showSixWeeks, displayLoadingIndicator, customHeader, headerStyle, accessibilityElementsHidden, importantForAccessibility, testID, style: propsStyle } = props;
    const [currentMonth, setCurrentMonth] = useState(current || initialDate ? parseDate(current || initialDate) : new XDate());
    const style = useRef(styleConstructor(theme));
    const header = useRef();
    const weekNumberMarking = useRef({ disabled: true, disableTouchEvent: true });
    useEffect(() => {
        if (initialDate) {
            setCurrentMonth(parseDate(initialDate));
        }
    }, [initialDate]);
    useDidUpdate(() => {
        const _currentMonth = currentMonth.clone();
        onMonthChange === null || onMonthChange === void 0 ? void 0 : onMonthChange(xdateToData(_currentMonth));
        onVisibleMonthsChange === null || onVisibleMonthsChange === void 0 ? void 0 : onVisibleMonthsChange([xdateToData(_currentMonth)]);
        AccessibilityInfo.announceForAccessibility(_currentMonth.toString('MMMM yyyy'));
    }, [currentMonth]);
    const updateMonth = useCallback((newMonth) => {
        if (sameMonth(newMonth, currentMonth)) {
            return;
        }
        setCurrentMonth(newMonth);
    }, [currentMonth]);
    const addMonth = useCallback((count) => {
        const newMonth = currentMonth.clone().addMonths(count, true);
        updateMonth(newMonth);
    }, [currentMonth, updateMonth]);
    const handleDayInteraction = useCallback((date, interaction) => {
        const day = new XDate(date.dateString);
        if (allowSelectionOutOfRange || !(minDate && !isGTE(day, new XDate(minDate))) && !(maxDate && !isLTE(day, new XDate(maxDate)))) {
            if (!disableMonthChange) {
                updateMonth(day);
            }
            if (interaction) {
                interaction(date);
            }
        }
    }, [minDate, maxDate, allowSelectionOutOfRange, disableMonthChange, updateMonth]);
    const _onDayPress = useCallback((date) => {
        if (date)
            handleDayInteraction(date, onDayPress);
    }, [handleDayInteraction, onDayPress]);
    const onLongPressDay = useCallback((date) => {
        if (date)
            handleDayInteraction(date, onDayLongPress);
    }, [handleDayInteraction, onDayLongPress]);
    const onSwipeLeft = useCallback(() => {
        var _a;
        // @ts-expect-error
        (_a = header.current) === null || _a === void 0 ? void 0 : _a.onPressRight();
    }, [header]);
    const onSwipeRight = useCallback(() => {
        var _a;
        // @ts-expect-error
        (_a = header.current) === null || _a === void 0 ? void 0 : _a.onPressLeft();
    }, [header]);
    const onSwipe = useCallback((gestureName) => {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
            case SWIPE_DOWN:
                break;
            case SWIPE_LEFT:
                constants.isRTL ? onSwipeRight() : onSwipeLeft();
                break;
            case SWIPE_RIGHT:
                constants.isRTL ? onSwipeLeft() : onSwipeRight();
                break;
        }
    }, [onSwipeLeft, onSwipeRight]);
    const renderWeekNumber = (weekNumber) => {
        return (React.createElement(View, { style: style.current.dayContainer, key: `week-container-${weekNumber}` },
            React.createElement(BasicDay, { key: `week-${weekNumber}`, marking: weekNumberMarking.current, 
                // state='disabled'
                theme: theme, testID: `${testID}.weekNumber_${weekNumber}` }, weekNumber)));
    };
    const renderDay = (day, id) => {
        if (!sameMonth(day, currentMonth) && hideExtraDays) {
            return React.createElement(View, { key: id, style: style.current.emptyDayContainer });
        }
        const dayProps = extractDayProps(props);
        const dateString = toMarkingFormat(day);
        const disableDaySelection = isEmpty(props.context);
        return (React.createElement(View, { style: style.current.dayContainer, key: id },
            React.createElement(Day, Object.assign({}, dayProps, { testID: `${testID}.day_${dateString}`, date: dateString, state: getState(day, currentMonth, props, disableDaySelection), marking: markedDates === null || markedDates === void 0 ? void 0 : markedDates[dateString], onPress: _onDayPress, onLongPress: onLongPressDay }))));
    };
    const renderWeek = (days, id) => {
        const week = [];
        days.forEach((day, id2) => {
            week.push(renderDay(day, id2));
        }, this);
        if (props.showWeekNumbers) {
            week.unshift(renderWeekNumber(days[days.length - 1].getWeek()));
        }
        return (React.createElement(View, { style: style.current.week, key: id }, week));
    };
    const renderMonth = () => {
        const shouldShowSixWeeks = showSixWeeks && !hideExtraDays;
        const days = page(currentMonth, firstDay, shouldShowSixWeeks);
        const weeks = [];
        while (days.length) {
            weeks.push(renderWeek(days.splice(0, 7), weeks.length));
        }
        return React.createElement(View, { style: style.current.monthView }, weeks);
    };
    const shouldDisplayIndicator = useMemo(() => {
        if (currentMonth) {
            const lastMonthOfDay = toMarkingFormat(currentMonth.clone().addMonths(1, true).setDate(1).addDays(-1));
            if (displayLoadingIndicator && !(markedDates === null || markedDates === void 0 ? void 0 : markedDates[lastMonthOfDay])) {
                return true;
            }
        }
        return false;
    }, [currentMonth, displayLoadingIndicator, markedDates]);
    const renderHeader = () => {
        const headerProps = extractHeaderProps(props);
        const ref = customHeader ? undefined : header;
        const CustomHeader = customHeader;
        const HeaderComponent = customHeader ? CustomHeader : CalendarHeader;
        return (React.createElement(HeaderComponent, Object.assign({}, headerProps, { testID: `${testID}.header`, style: headerStyle, ref: ref, month: currentMonth, addMonth: addMonth, displayLoadingIndicator: shouldDisplayIndicator })));
    };
    const GestureComponent = enableSwipeMonths ? GestureRecognizer : View;
    const swipeProps = {
        onSwipe: (direction) => onSwipe(direction)
    };
    const gestureProps = enableSwipeMonths ? swipeProps : undefined;
    return (React.createElement(GestureComponent, Object.assign({}, gestureProps, { testID: `${testID}.container` }),
        React.createElement(View, { style: [style.current.container, propsStyle], testID: testID, accessibilityElementsHidden: accessibilityElementsHidden, importantForAccessibility: importantForAccessibility },
            renderHeader(),
            renderMonth())));
};
export default Calendar;
Calendar.displayName = 'Calendar';
Calendar.propTypes = Object.assign(Object.assign(Object.assign({}, CalendarHeader.propTypes), Day.propTypes), { theme: PropTypes.object, style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]), current: PropTypes.string, initialDate: PropTypes.string, minDate: PropTypes.string, maxDate: PropTypes.string, markedDates: PropTypes.object, hideExtraDays: PropTypes.bool, showSixWeeks: PropTypes.bool, onDayPress: PropTypes.func, onDayLongPress: PropTypes.func, onMonthChange: PropTypes.func, onVisibleMonthsChange: PropTypes.func, disableMonthChange: PropTypes.bool, enableSwipeMonths: PropTypes.bool, disabledByDefault: PropTypes.bool, headerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]), customHeader: PropTypes.any, allowSelectionOutOfRange: PropTypes.bool });
