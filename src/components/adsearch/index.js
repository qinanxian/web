import React from 'react';
import ReactDom from 'react-dom';
// eslint-disable-next-line import/no-unresolved,import/no-extraneous-dependencies
import { Button } from 'roface';
import * as components from '../index';

import './style/index.less';

/* eslint-disable */
export default class AdSearch extends React.Component {
  static defaultProps = {
    footVisible: true
  };
  constructor(props) {
    super(props);
    this.state = {
      adSearchTerms: props.adSearchTerm || {},
      filterTemplate: null,
    };
  }
  componentDidMount(){
    this.dom = ReactDom.findDOMNode(this);
    if (this.dom) {
      //this.dom.setAttribute('tabindex', '0');
      this.dom.onkeydown = (e) => {
        if(e.keyCode === 13) {
          //this._adSearch();
        }
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ adSearchTerm: nextProps.adSearchTerm })
  }
  componentWillUnmount(){
    if (this.dom) {
      this.dom.onkeydown = null;
      this.dom.blur();
    }
  }
  _onOpenChange = (status) => {
    !status && this.dom.focus();
  }
  _adSearch = () => {
    this.props.adSearchRequest && this.props.adSearchRequest(this.state.adSearchTerms);
  };

  _clearForm = () => {
    const {adSearchTerms} = this.state;
    this.setState({
      adSearchTerms:{}
    });
    this.props.adSearchTermOnChange && this.props.adSearchTermOnChange({});
  };

  _adSearchTermOnChange = (value, adSearchTerm, item) => {
    this.setState({ adSearchTerms: Object.assign({}, adSearchTerm, {[item.code]: value}) });
    this.props.adSearchTermOnChange &&
    this.props.adSearchTermOnChange(Object.assign({}, adSearchTerm, {[item.code]: value}));
  };

  _isDatePicker = (editStyle) => {
    return ['DatePicker', 'YearMonthPicker', 'DateRangePicker', 'TimePicker', 'YearPicker'].includes(editStyle);
  };
  _renderAdSearchGroup = (prefix, filters) => {
    const { dict, colElements, filterTemplate, filterItemTemplate,params, adSearchColumn } = this.props;
    if (filters.length === 0) return null;
    if (filterTemplate) {
      return (
        <div className={`${prefix}-ad-container-search`}>
          {filterTemplate(filters, dict, colElements)}
        </div>
      )
    }
    return (
      <div className={`${prefix}-ad-container-search`}>
        {filters.map(item => {
          const itemCode = item.code;
          if (filterItemTemplate && filterItemTemplate[itemCode]) {
            return (
              <div key={item.code} className={`${prefix}-ad-container-search-template`}>
                {filterItemTemplate[itemCode](item, dict[itemCode],...Object.values(this.state.adSearchTerm))}
              </div>
            );
          }
          if (item.enabled) {
            const itemElement = colElements.filter((ob) => ob.code === item.code)[0];
            let Comp = components['Text'];
            let editStyle = 'Text';
            if (itemElement && itemElement.elementUIHint) {
              editStyle = itemElement.elementUIHint.editStyle;
              if (item.comparePattern === 'Range') {
                switch (itemElement.elementUIHint.editStyle) {
                  case 'DatePicker':
                    Comp = components['DateRangePicker'];
                    editStyle = 'DateRangePicker';
                    break;
                  case 'Currency':
                  case 'Double':
                  case 'Integer':
                    Comp = components['NumberRangeInput'];
                    break;
                  default:
                    Comp = components['Text'];
                }
              } else {
                Comp = components[itemElement.elementUIHint.editStyle];
              }
            }
            return (
              <div
                  key={item.code}
                  style={{
                    width: adSearchColumn ? `${(100 / adSearchColumn)}%` : 'auto'
                  }}
                  className= {`${prefix}-ad-container-search-com`}
              >
                <span
                    className= {`${prefix}-ad-container-search-label`}
                >
                  {item.name}:
                </span>
                <Comp
                  {...(this._isDatePicker(editStyle) ? {onOpenChange: this._onOpenChange} : {})}
                  key={item.code}
                  value={this.state.adSearchTerm[item.code]}
                  style={{ margin: 5 }}
                  options={dict[item.code]}
                  item={itemElement}
                  params={params}
                  onChange={(value) => this._adSearchTermOnChange(value, this.state.adSearchTerm, item)}
                />
              </div>
            );
          }
        })}
      </div>
    );
  };

  _renderFoot = () => {
    const { prefix = 'ro', footVisible,clearBtn = false } = this.props;
    if (!footVisible) return null;
    return (
      <div className={`${prefix}-ad-container-btn`}>
        <Button
          type="primary"
          icon="search"
          onClick={this._adSearch}
        >
          搜索
        </Button>
        <Button
          style={{display:clearBtn ? '' : 'none'}}
          onClick={this._clearForm}
        >
          清除
        </Button>
      </div>
    );
  };

  render() {
    const { prefix = 'ro', filters, open } = this.props;
    return (
      <div className={`${prefix}-ad-container`} style={{display: !open ? 'none' : '', outline: 'none'}}>
        {this._renderAdSearchGroup(prefix, filters)}
        {this._renderFoot()}
      </div>
    );
  }
}
