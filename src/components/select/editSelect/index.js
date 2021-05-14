import React from 'react';
import { Icon } from '../../index';
import config from '../../../lib/config';
import { compose } from '../../compose';
import outerClose from '../../outerClose';

const inputHeight = config.layoutLevel[config.layoutLevelDefault].inputHeightBase;
/* eslint-disable */

@compose
@outerClose
export default class EditSelect extends React.Component{
    static defaultProps = {
        optionField: 'code',
        optionName: 'name',
        options:[]
    };
    constructor(props) {
        super(props);
        this.state = {
            optionsItems:props.options.map(item => {
                return {...item,selected:false}
            }),
            value: this.getRealValue(this.props.value,props.options.map(item => {
                return {...item,selected:false}
            })),
            dropDown:'up',
            dropStyle:'none'
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: this.getRealValue(nextProps.value,nextProps.options.map(item => {
                return {...item,selected:false}
            })),
        });
    }
    getRealValue = (keys = [],optionsItems) => {
        return optionsItems.filter(fit => keys.includes(fit[this.props.optionField]));
    };
    handleOptionClick = (event) => {
        const { optionsItems } = this.state;
        const { optionField } = this.props;
        const resetOptions = optionsItems.map(item => {
            if (item[optionField] === event.target.id) {
                return {...item,selected:!item.selected}
            }
            return item;
        });
        this.setState({
            optionsItems:resetOptions,
            value:resetOptions.filter(fit => fit.selected),
        },() => {
            this.props.onChange && this.props.onChange(this.state.value.map(item => item[optionField]));
        });
    };
    handleDeleteClick = (key) => {
        const { optionField } = this.props;
        this.setState({
            value:this.state.value.filter(fit => fit[optionField] !== key),
            optionsItems:this.state.optionsItems.map(item => {
                if (item[optionField] === key) {
                    return {...item,selected:false}
                }
                return item;
            })
        },() => {
            this.props.onChange && this.props.onChange(this.state.value.map(item => item[optionField]));
        });
    };

    handleDropDownClick = (e) => {
        e.stopPropagation();
        this.setState({
            dropDown:'down',
            dropStyle:'flex'
        });
    };
    closeDropDown = () => {
        this.setState({
            dropDown:'up',
        },() => {
            setTimeout(() => {
                this.setState({dropStyle:'none'})
            },400)
        });
    };
    render(){
        const { editRef ,style, optionName, optionField, optionDisabled } = this.props;
        const { value, optionsItems, dropDown, dropStyle } = this.state;
        // optionsItems.unshift({[optionField]:'un_select',[optionName]:'--请选择--'});
        // console.log('value:',value);
        return (
            <div
                ref={editRef}
                style={{...style,height:inputHeight}}
                className="cust-edit"
            >
                <div className="cust-edit-cta" onClick={this.handleDropDownClick}>
                    <div className="cust-edit-cta-select">
                        {value.map(item => <span key={item[optionField]}>
                        {item[optionName]}<Icon type="close" onClick={() => this.handleDeleteClick(item[optionField])}/>
                    </span>)}
                    </div>
                </div>
                <div
                    style={{display:dropStyle}}
                    className={`cust-edit-options cust-edit-options${dropDown}`}
                    onClick={this.handleOptionClick}
                >
                    {optionsItems.map((item) => {
                        return (
                            <span
                                key={item[optionField]}
                                id={item[optionField]}
                                className="cust-edit-options-item"
                            >
                                <span>{item[optionName]}</span>
                                <Icon style={{display:item.selected ? 'inline-block' : 'none'}} type="check"/>
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    }
}
