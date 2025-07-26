import React from 'react';
import { Text } from 'react-native';
import { weekDayNames } from '../dateutils';
const WeekDaysNames = React.memo(({ firstDay, style }) => {
    const dayNames = weekDayNames(firstDay);
    return dayNames.map((day, index) => (React.createElement(Text, { allowFontScaling: false, key: index, style: style, numberOfLines: 1, accessibilityLabel: '' }, day)));
});
export default WeekDaysNames;
