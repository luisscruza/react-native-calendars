import { render, fireEvent } from '@testing-library/react-native';
import { extractStyles } from '../../testUtils';
export class DayDriver {
    constructor(element, testID) {
        this.element = element;
        this.renderTree = render(element);
        this.testID = testID || element.props.testID;
    }
    getStyle() {
        return extractStyles(this.renderTree.getByTestId(this.testID));
    }
    getDayText() {
        return this.renderTree.getByTestId(`${this.testID}.text`).children.join('');
    }
    getTextStyle() {
        return extractStyles(this.renderTree.getByTestId(`${this.testID}.text`));
    }
    getAccessibilityLabel() {
        var _a;
        const node = this.renderTree.getByTestId(this.testID);
        return (_a = node === null || node === void 0 ? void 0 : node.props) === null || _a === void 0 ? void 0 : _a.accessibilityLabel.trim();
    }
    tap() {
        const node = this.renderTree.getByTestId(this.testID);
        if (!node) {
            throw new Error('Day not found.');
        }
        fireEvent.press(node);
    }
}
