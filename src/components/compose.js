import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export const compose = (Com) => {
  class Compose extends React.Component {
    shouldComponentUpdate(nextProps) {
      return this._compareProps(nextProps);
    }
    _compareProps = (nextProps) => {
      const props = ['reading', 'readOnly', 'prefix', 'suffix', 'options', 'value', 'checked', 'displayValue', 'placeholder'];
      return props.some((field) => {
        /*if (Array.isArray(nextProps[field]) && nextProps[field].length < 20) {
          return this._compareArray(nextProps[field], this.props[field]);
        }*/
        return nextProps[field] !== this.props[field];
      });
    }
    _compareArray = (a, b) => {
      const tempB = !b ? [] : b;
      if (a.length !== tempB.length) {
        return true;
      }
      return a.some((value) => {
        if (typeof value === 'string') {
          return !tempB.includes(value);
        }
        const bCodeObj = tempB.reduce((pre, next) => {
          return {
            ...pre,
            [pre.code]: next && next.value,
          };
        }, {});
        return value && value.code === value && bCodeObj[value.code];
      });
    }
    render() {
      return <Com {...this.props} />;
    }
  }
  hoistNonReactStatics(Compose, Com);
  return Compose;
};
