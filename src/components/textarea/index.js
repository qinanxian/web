import React from 'react';
import {Input} from 'antd';
import { compose } from '../compose';
import { filterProps } from '../../lib/object';
import config from '../../lib/config';
import './style/index.less';

const { TextArea } = Input;

@compose
export default class RoTextArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.value) {
            this.setState({
                value: nextProps.value,
            },() => {
                this.props.signcomment
                && this.props.onChange && this.props.onChange(nextProps.value);
            });
        }
    }
    onChange = (e) => {
        const value = e.target.value || '';
        this.setState({ value });
        this.props.onChange && this.props.onChange(value);
    };
    /* eslint-disable */
    render() {
      const { readOnly, reading, style, prefix = 'ro',isTable, item, customLength,valuenullholder,signcomment = false} = this.props;
      const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
      const limitedLength = customLength ? customLength.toString() : item && item.limitedLength > 0 ? (item.limitedLength).toString() : '';
        if (reading) {
            if (!isTable && signcomment) {
                return <div style={{height:'152px', padding: '10px 0 10px 10px',cursor: 'not-allowed'}}>{this.state.value}</div>
            } else {
                return (
                    !isTable && !this.state.value ?
                        <div
                            style={{color: 'rgba(150,150,150,0.4)'}}
                            className={`${prefix}-under-line-${config.readingInfoUnderLine}`}
                        >
                            {valueHolder}
                        </div>
                        :
                        <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}
                             style={{
                                 ...style,
                                 paddingBottom: '10px',
                                 height: 'auto',
                                 lineHeight: '22px',
                                 paddingTop: '10px',
                                 whiteSpace: 'pre-wrap',
                                 wordWrap: 'break-word'
                             }}>{this.props.value}</div>
                );
            }
        }
        return (
          <TextArea
            {...filterProps(this.props, ['signcomment','compPrefix', 'decimalDigits', 'dictCodeTreeLeafOnly', 'onOk', 'resizeModal','reading'])}
            style={{marginTop:5,marginBottom: 10, ...(style || {}), maxWidth: 'initial'}}
            className={readOnly ? `${prefix}-readonly-input` : null}
            value={this.state.value}
            onChange={this.onChange}
            maxLength={limitedLength}
          />
        );
    }
}
