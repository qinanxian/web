import React from 'react';
import { Select } from 'antd';
import { compose } from '../compose';
import config from '../../lib/config';

const Option = Select.Option;

@compose
export default class MultiSelect extends React.Component {
    static defaultProps = {
        optionField: 'code',
        optionName: 'name',
    };
    constructor(props) {
        super(props);
        this.state = {
            value: this._changeString2Array(this.props.value) || [],
        };
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.value) {
            this.setState({
                value: this._changeString2Array(nextProps.value),
            });
        }
    }
    _assembleOptions = () => {
       const { model, options, optionField, optionName, optionDisabled} = this.props;
       let newOptions;
       switch(model) {
           case 'model':
               newOptions = options.map(item => item.itemName);
               break;
           case 'jsonModel':
               newOptions = options.map(item => item.v);
               break;
           case 'additionModel':
           default:
               newOptions = options;
       }
       const optionArr = [];
       if (options && options[0] instanceof Object) {
           newOptions && newOptions.forEach((item) => {
               optionArr.push(
                 <Option
                   key={item[optionField]}
                   disabled={optionDisabled && optionDisabled.includes(item[optionField])}
                   value={item[optionField]}
                 >
                   {item[optionName]}
                 </Option>);
           });
       } else {
           newOptions && newOptions.forEach((item) => {
               optionArr.push(
                 <Option
                   key={item}
                   value={item}
                   disabled={optionDisabled.includes(item)}
                 >
                   {item}
                 </Option>);
           });
       }
       return optionArr;
    };

    handleChange = (value) => {
        this.setState({
           value,
        });
        const { onChange } = this.props;
        if (onChange) {
            onChange(this._changeArray2String(value));
        }
    };
    _changeString2Array = (str) => {
        if (str instanceof Array) {
            return str;
        }
        if (str === '') {
            return [];
        }
        return str && str.split && str.split(',');
    };
    _changeArray2String = (ary) => {
        if (ary instanceof String) {
            return ary;
        }
        if (ary.length === 0) {
            return '';
        }
        return ary && ary.join && ary.join(',');
    };
    _constructReadingValue = (value) => {
      const { options, optionField, optionName } = this.props;
      const displayValueArr  = [];
      value && value.forEach((item) => {
        options.forEach((option) => {
            if (option[optionField] === item) {
                displayValueArr.push(option[optionName]);
            }
        });
      });
      return displayValueArr;
    };
    render() {
      /* eslint-disable */
      const { reading,isTable,valuenullholder, prefix = 'ro' } = this.props;
      const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
        const { value } = this.state;
        if (reading) {
            return (
              !isTable && !value ?
                <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`} style={{color:'rgba(150,150,150,0.4)'}}>{valueHolder}</div>
                :
                <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>{this._changeArray2String(this._constructReadingValue(value))}</div>
            );
        }
        const children = this._assembleOptions();
        return (
          <Select
            {...this.props}
            mode="multiple"
            style={this.props.style || null}
            value={this.state.value}
            onChange={this.handleChange}
          >
            {children}
          </Select>
        );
    }
}
