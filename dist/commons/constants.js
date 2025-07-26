import { Dimensions, I18nManager, Platform } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isRTL = I18nManager.isRTL;
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';
const screenAspectRatio = screenWidth < screenHeight ? screenHeight / screenWidth : screenWidth / screenHeight;
const isTablet = Platform.isPad || (screenAspectRatio < 1.6 && Math.max(screenWidth, screenHeight) >= 900);
const isAndroidRTL = isAndroid && isRTL;
const isRN73 = () => { var _a, _b; return !!((_a = Platform === null || Platform === void 0 ? void 0 : Platform.constants) === null || _a === void 0 ? void 0 : _a.reactNativeVersion) && ((_b = Platform.constants.reactNativeVersion) === null || _b === void 0 ? void 0 : _b.minor) >= 73; };
export default {
    screenWidth,
    screenHeight,
    isRTL,
    isAndroid,
    isIOS,
    isTablet,
    isAndroidRTL,
    isRN73
};
