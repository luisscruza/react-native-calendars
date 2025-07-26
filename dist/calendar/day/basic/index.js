import React, { Fragment, useCallback, useRef } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { xdateToData } from '../../../interface';
import Marking from '../marking';
import styleConstructor from './style';
const BasicDay = (props) => {
    const { theme, date, onPress, onLongPress, markingType, marking, state, disableAllTouchEventsForDisabledDays, disableAllTouchEventsForInactiveDays, accessibilityLabel, children, testID } = props;
    const dateData = date ? xdateToData(date) : undefined;
    const style = useRef(styleConstructor(theme));
    const _marking = marking || {};
    const isSelected = _marking.selected || state === 'selected';
    const isDisabled = typeof _marking.disabled !== 'undefined' ? _marking.disabled : state === 'disabled';
    const isInactive = typeof (marking === null || marking === void 0 ? void 0 : marking.inactive) !== 'undefined' ? marking.inactive : state === 'inactive';
    const isToday = typeof (marking === null || marking === void 0 ? void 0 : marking.today) !== 'undefined' ? marking.today : state === 'today';
    const isMultiDot = markingType === Marking.markings.MULTI_DOT;
    const isMultiPeriod = markingType === Marking.markings.MULTI_PERIOD;
    const isCustom = markingType === Marking.markings.CUSTOM;
    const shouldDisableTouchEvent = () => {
        const { disableTouchEvent } = _marking;
        let disableTouch = false;
        if (typeof disableTouchEvent === 'boolean') {
            disableTouch = disableTouchEvent;
        }
        else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && isDisabled) {
            disableTouch = disableAllTouchEventsForDisabledDays;
        }
        else if (typeof disableAllTouchEventsForInactiveDays === 'boolean' && isInactive) {
            disableTouch = disableAllTouchEventsForInactiveDays;
        }
        return disableTouch;
    };
    const getContainerStyle = () => {
        const { customStyles, selectedColor } = _marking;
        const styles = [style.current.base];
        if (isSelected) {
            styles.push(style.current.selected);
            if (selectedColor) {
                styles.push({ backgroundColor: selectedColor });
            }
        }
        else if (isToday) {
            styles.push(style.current.today);
        }
        //Custom marking type
        if (isCustom && customStyles && customStyles.container) {
            if (customStyles.container.borderRadius === undefined) {
                customStyles.container.borderRadius = 16;
            }
            styles.push(customStyles.container);
        }
        return styles;
    };
    const getTextStyle = () => {
        const { customStyles, selectedTextColor } = _marking;
        const styles = [style.current.text];
        if (isSelected) {
            styles.push(style.current.selectedText);
            if (selectedTextColor) {
                styles.push({ color: selectedTextColor });
            }
        }
        else if (isDisabled) {
            styles.push(style.current.disabledText);
        }
        else if (isToday) {
            styles.push(style.current.todayText);
        }
        else if (isInactive) {
            styles.push(style.current.inactiveText);
        }
        // Custom marking type
        if (isCustom && customStyles && customStyles.text) {
            styles.push(customStyles.text);
        }
        return styles;
    };
    const _onPress = useCallback(() => {
        onPress === null || onPress === void 0 ? void 0 : onPress(dateData);
    }, [onPress, date]);
    const _onLongPress = useCallback(() => {
        onLongPress === null || onLongPress === void 0 ? void 0 : onLongPress(dateData);
    }, [onLongPress, date]);
    const renderMarking = () => {
        const { marked, dotColor, dots, periods } = _marking;
        return (React.createElement(Marking, { type: markingType, theme: theme, marked: isMultiDot ? true : marked, selected: isSelected, disabled: isDisabled, inactive: isInactive, today: isToday, dotColor: dotColor, dots: dots, periods: periods }));
    };
    const renderText = () => {
        return (React.createElement(Text, { allowFontScaling: false, style: getTextStyle(), testID: `${testID}.text` }, String(children)));
    };
    const renderContent = () => {
        return (React.createElement(Fragment, null,
            renderText(),
            renderMarking()));
    };
    const renderContainer = () => {
        const { activeOpacity } = _marking;
        return (React.createElement(TouchableOpacity, { testID: testID, style: getContainerStyle(), activeOpacity: activeOpacity, disabled: shouldDisableTouchEvent(), onPress: !shouldDisableTouchEvent() ? _onPress : undefined, onLongPress: !shouldDisableTouchEvent() ? _onLongPress : undefined, accessible: true, accessibilityRole: isDisabled ? undefined : 'button', accessibilityLabel: accessibilityLabel }, isMultiPeriod ? renderText() : renderContent()));
    };
    const renderPeriodsContainer = () => {
        return (React.createElement(View, { style: style.current.container },
            renderContainer(),
            renderMarking()));
    };
    return isMultiPeriod ? renderPeriodsContainer() : renderContainer();
};
export default BasicDay;
BasicDay.displayName = 'BasicDay';
