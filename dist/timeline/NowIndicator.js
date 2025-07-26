import React, { useMemo } from 'react';
import { View } from 'react-native';
import { calcTimeOffset } from './helpers/presenter';
import { HOUR_BLOCK_HEIGHT } from './Packer';
const NowIndicator = (props) => {
    const { styles, width, left } = props;
    const indicatorPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT);
    const nowIndicatorStyle = useMemo(() => {
        return [styles.nowIndicator, { top: indicatorPosition, left }];
    }, [indicatorPosition, left]);
    return (React.createElement(View, { style: nowIndicatorStyle },
        React.createElement(View, { style: [styles.nowIndicatorLine, { width }] }),
        React.createElement(View, { style: styles.nowIndicatorKnob })));
};
export default NowIndicator;
