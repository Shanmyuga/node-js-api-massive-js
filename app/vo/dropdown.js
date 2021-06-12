const ValueObject = require('value-object')

class DropDown {


    constructor(label, value) {
        this._label = label;
        this._value = value;
    }


    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
}

module.exports = DropDown;