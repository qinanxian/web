/**
 * Created by dpcui on 21/12/2017.
 */

import React from 'react';
import { Icon } from '@ant-design/compatible';
import { Select, Input } from 'antd';
import { compose } from '../../compose';
import config from '../../../lib/config';
import {filterProps} from '../../../lib/object';

const Option = Select.Option;

@compose
class RoSelect extends React.Component {
    static defaultProps = {
        optionField: 'code',
        optionName: 'name',
    };
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || '',
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }

    /* eslint-disable */
    handleChange = (value,option,row) => {
        const label = this.props.options.filter(fit => fit.value === value);
        this.setState({ value: value });
        this.props.onChange && this.props.onChange(value,option.props.value && option.key,label,row);
        console.log(value,':',option.props.value && option.key,label,row);
    };

    renderOption = () => {
        const optionDefault = (
            <Option key={Math.uuid()} value={''}>
                { '--请选择--' }
            </Option>
        );
        const children = [optionDefault];
        const { options=[], optionName, optionField, optionDisabled } = this.props;
        if (options && options[0] instanceof Object) {
            for (let i = 0; i < options.length; i++) {
                children.push(
                    <Option
                        key={options[i][optionField]}
                        disabled={optionDisabled && optionDisabled.includes(options[i][optionField])}
                        value={options[i][optionField]}
                    >
                        { options[i][optionName] }
                    </Option>
                );
            }
        } else {
            for (let i = 0; i < options.length; i++) {
                children.push(
                    <Option
                        key={options[i]}
                        value={options[i]}
                        disabled={optionDisabled && optionDisabled.includes(options[i])}
                    >
                        { options[i] }
                    </Option>
                );
            }
        }
        return children;
    };
    /* eslint-disable */

    renderReadingAndReadOnly = () => {
        const {reading, options = [], optionField, optionName, readOnly, placeholder, prefix = 'ro', style,isTable,valuenullholder} = this.props;
        const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
        let valueX = this.state.value;

        if (options && options[0] instanceof Object) {
            for (let i = 0; i < options.length; i++) {
                if (options[i][optionField] === this.state.value) { valueX = options[i][optionName] }
            }
        }

        if (reading) {
            const retStyle = !isTable ? {paddingBottom: '10px',height: 'auto',lineHeight: '22px',paddingTop: '10px',whiteSpace: 'pre-wrap',wordWrap: 'break-word'} : {};
            return (
                !isTable && !valueX ?
                    <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`} style={{color:'rgba(150,150,150,0.4)'}}>{valueHolder}</div>
                    :
                    <div
                        className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}
                        style={retStyle}
                    >{ valueX ? valueX : ''}</div>
            );
        } else {
            return (
                <Input
                    readOnly={readOnly}
                    placeholder={placeholder}
                    style={style || null}
                    className={readOnly ? `${prefix}-readonly-input` : null}
                    suffix={<Icon type="down" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    value={valueX}
                />
            );
        }
    };

    render() {
        const { reading, readOnly, style, disabledcontainer,record,majorKey, containerId } = this.props;
        if (reading || readOnly) { return this.renderReadingAndReadOnly() }
        return (
            <Select
                {...filterProps(this.props, ['options', 'optionField', 'optionName'])}
                style={{ width: '100%', ...style }}
                onChange={(value,options) => this.handleChange(value,options,majorKey && record[majorKey])}
                value={this.state.value}
                getPopupContainer={triggerNode => {
                    if (disabledcontainer === 'true') {
                        return document.body;
                    } else if (containerId) {
                      return document.getElementById(containerId);
                    }
                    return triggerNode.parentNode;
                }}
                showSearch
                optionFilterProp='children'
            >
                {this.renderOption()}
            </Select>
        );
    }
}

export default RoSelect;
