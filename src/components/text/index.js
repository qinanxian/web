import React from 'react';
import { Input } from 'antd';
import config from '../../lib/config';
import { compose } from '../compose';
import { filterProps } from '../../../src/lib/object';
import classnames from '../../../src/lib/classnames';
import './style/index.less';

@compose
export default class RoText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || '',
        };
    }

    componentWillReceiveProps(nextProps) {
        this.returnFormat = typeof nextProps.value;
        if (this.state.value !== nextProps.value) {
            this.setState({
                value: nextProps.value || '',
            });
        }
    }
    handleChange = (e) => {
        const { item = {} } = this.props;
        const value = e.target.value || '';
        this.setState({ value });
        // this.props.onChange && this.props.onChange(value);
        item.onNoValidateChange && item.onNoValidateChange({[item.code]: value});
    };
    handleTextBlur = (e) => {
        const { onBlur, onChange, onValueChange } = this.props;
        if (e.target.value === '') {
            onBlur && onBlur(null);
            onChange && onChange(null);
            onValueChange && onValueChange(null);
        } else {
            onBlur && onBlur(e.target.value);
            onChange && onChange(e.target.value);
            onValueChange && onValueChange(e.target.value);
        }
    };
    /* eslint-disable */
    render() {
        const { readOnly, reading, style, compPrefix, suffix, prefix = 'ro', item,isTable,valuenullholder,customLength } = this.props;
        const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
        const limitedLength = customLength ? customLength.toString() : item && item.limitedLength > 0 ? (item.limitedLength).toString() : '';
        const {value} = this.state;
        const align = item && item.elementUIHint && item.elementUIHint.textAlign;
        const classes = classnames({
            [`${prefix}-readonly-input`]:readOnly,
            [`${prefix}-input-${align ? align.toLowerCase() : 'left'}`]:true
        });
        if (reading) {
            const retStyle = !isTable ? {paddingBottom: '10px',height: 'auto',lineHeight: '22px',paddingTop: '10px',whiteSpace: 'pre-wrap',wordWrap: 'break-word'} : {};
            return (
                !isTable && !value ?
                    <div
                        style={{color:'rgba(150,150,150,0.4)'}}
                        className={`${prefix}-under-line-${config.readingInfoUnderLine}`}
                    >
                        {`${compPrefix || ''}${valueHolder}${typeof suffix === 'string' ? suffix : '' || ''}`}
                    </div>
                    :
                    <div
                        style={retStyle} className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>
                        {`${compPrefix || ''}${value ? value : ''}`}
                        <span style={{color:'rgba(0,0,0,0.7)',marginLeft:'10px' }}>{typeof suffix === 'string' ? suffix : '' || ''}</span>
                    </div>
            );
        }
        return (
            <Input
                {...filterProps(this.props, ['onOk','defaultButton','resizeModal','compPrefix', 'decimalDigits', 'dictCodeTreeLeafOnly','reading', 'isTable'])}
                style={style || null}
                className={classes}
                value={this.state.value}
                addonBefore={compPrefix}
                addonAfter={suffix}
                onBlur={this.handleTextBlur}
                prefix=''
                suffix=''
                onChange={this.handleChange}
                maxLength={parseInt(limitedLength || -1)}
                autoComplete='off'
            />
        );
    }
}
