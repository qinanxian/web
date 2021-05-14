import React from 'react';
import {Icon} from '../index';
import config from '../../lib/config';
import {getDictTree} from '../../lib/base';
import TabPanes from './tabpanes';
import {flatData,fuzzySearch,restructureData,getPreTabKey,resetTabPanes,getAddressName,getValue} from './tool';
import './style/index.less';
import { compose } from '../compose';
/* eslint-disable */
@compose
export default class AddressPicker extends React.Component {
    constructor(props){
        super(props);
        this.tag = null;
        this.joint = props.joint || true;
        this.disableSearch = props.disableSearch || false;
        this.dropBox = null;
        this.selectedItems = [];
        this.state = {
            icon:'down',
            dropDown:'down',
            panes:[],
            activeKey:'null',
            value:getValue(props.value) || '',
        };
    }
    componentDidMount(){
        getDictTree(this.props.dictCode || 'District').then((res) => {
            this.dataSource = restructureData(res);
            this.flatData = flatData(this.dataSource);
            this.setState({
                panes:this.setPaneData(this.dataSource),
                activeKey:this.dataSource ? 'tab8' : 'null',
            });
        });
        this.dropBox = document.querySelectorAll(`.custom-select-box${this.props.id}`);
        if(this.dropBox.length > 0){
            this.tag = this.dropBox[this.dropBox.length - 1];
            window.addEventListener('click',this.handleExecute);
        }
    }
    componentWillUpdate(nextProps,nextState){
        if (nextState.value !== this.state.value) {
            this.handleChange(nextState.value);
        }
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.handleExecute);
    }
    _serializeParam = (params = {}, field) => {
        let str = '';
        if (typeof params === 'string') {
            str = params;
        } else {
            if (Array.isArray(params) && field) {
                params.forEach(p => {
                    if (typeof p === 'string' || typeof p === 'number') {
                        str = `${str};${field}=${p}`;
                    }
                })
            } else {
                Object.keys(params).forEach(p => {
                    if (Array.isArray(params[p])) {
                        str = `${str};${this._serializeParam(params[p], p)}`;
                    } else {
                        str = `${str};${p}=${params[p]}`;
                    }
                })
            }
        }
        return encodeURIComponent(str.replace(/^;/g, ''));
    };
    setPaneData = (value) => {
        if (!value) return [{title:'null',content:'数据为空',key:'null',closable:false}];
        if (value && !value.children) {
            return [{title: '详细地址', content: <textarea
                    onChange={this.addDetailMes}
                    placeholder='请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息'
                    className='custom-select-box-dropdown-detail-area'/>, key: value.tabKey}];
        }
        return [].concat({title: '请选择',
            content:<div className='custom-select-box-dropdown-detail-ul'>{value.children.map((item) => {
                return (<span
                    key={item.sortCode}
                    className='custom-select-box-dropdown-detail-ul-li'
                    onClick={() => this.handleLiClick(item)}
                >
          {item.name}
        </span>);
            })}</div>,
            key: value.tabKey,
            closable: value.tabKey === 'tab' ? value.tabKey !== 'tab' : value.tabKey !== 'tab8'});
    };
    resetPanesArray = (originPanes,replacePane) => {
        const panesArray = originPanes.filter((fit) => fit.key.length < replacePane.tabKey.length)
            .map((item) => {
                if (item.key === getPreTabKey(replacePane.tabKey) || item.key === 'tab') {
                    return {...item,title:replacePane.name};
                }
                return item;
            }).concat(this.setPaneData(replacePane));
        // const resultTitle = panesArray.filter(fit => fit.key.length < 7 && fit.title !== '请选择').map(it => it.title);
        // return {panes:panesArray,value:this.joint ? resultTitle.join(' ') : replacePane.name};
        return replacePane.children ? {panes:panesArray} :
            {panes:panesArray,value:this.joint ? getAddressName(this.dataSource,replacePane).join(' ') : replacePane.name}
    };
    handleLiClick = (item) => {
        const result = this.resetPanesArray(this.state.panes,item);
        this.selectedItems = this.selectedItems.filter((fit) => fit.tabKey.length < item.tabKey.length).concat([item]);
        item.children ?
            this.setState({
                panes:result.panes,
                activeKey:item.tabKey,
            })
            :
            this.setState({
                panes:result.panes,
                activeKey:item.tabKey,
                value:result.value,
            })
    };
    addDetailMes = (e) => {
        const spvalue = this.state.value.split('，');
        if (spvalue[1] && spvalue[1] !== e.target.value) {
            this.setState({
                value:e.target.value !== '' ? spvalue[0] + '，' + e.target.value : spvalue[0],
            })
        }
        if (spvalue.length < 2) {
            this.setState({
                value:this.state.value + '，' + e.target.value,
            })
        }
    };
    handleRemoveTab = (targetKey) => {
        const result = resetTabPanes(this.state.panes,targetKey);
        this.setState({
            panes:result.panes,
            activeKey:result.activeKey,
        });
    };
    handleClick = (e) => {
        e.stopPropagation();
        if (this.state.icon !== 'closecircle') {
            this.setState({
                icon:this.state.icon === 'down' ? 'up' : 'down',
                dropDown:this.state.dropDown === 'down' ? 'up' : 'down',
            });
        } else {
            this.setState({
                value:'',
                icon:this.state.dropDown,
                panes:this.setPaneData(this.dataSource),
                activeKey:'tab8',
            });
            this.selectedItems = [];
        }
    };
    handleExecute = (e) => {
        if(this.state.dropDown !== 'down' && this.tag.compareDocumentPosition(e.target) !== 20){
            this.setState({
                dropDown:'down',
                icon:'down',
            });
        }
    };
    handleSearchClick = (e) => {
        if (e.charCode === 13 || e === '13') {
            let params = null,activeKey = 'error';
            const searchRet = fuzzySearch(this.flatData,this.inputValue.value);
            const type = Object.prototype.toString.call(searchRet).slice(8,-1);
            if (type === 'String') {
                params = this.dataSource;
                activeKey = 'tab8';
            } else if (type === 'Array' && searchRet.length > 0) {
                params = {children:searchRet,tabKey:'tab'};
                activeKey = 'tab';
            } else {
                params = null;
                activeKey = 'null';
            }
            this.setState({
                panes:this.setPaneData(params),
                activeKey:activeKey,
            });
        }
    };
    handleMourseOver = () => {
        this.state.value && this.setState({
            icon:'closecircle',
        });
    };
    handleMourseOut = () => {
        this.state.value && this.setState({
            icon:this.state.dropDown,
        });
    };
    handleChange(value){
        const { onChange } = this.props;
        onChange && onChange(value && JSON.stringify({code:this.selectedItems.map(item => item.code),address:value}));
    }
    render() {
        const {icon,dropDown,panes,activeKey,value} = this.state;
        const {reading,item,isTable,valuenullholder,id, prefix = 'ro' } = this.props;
        const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
        const styleObj = item && {
            ...JSON.parse(item.elementUIHint.htmlStyle),
        };
        if (reading) {
            const retStyle = !isTable ? {paddingBottom: '10px',height: 'auto',lineHeight: '22px',paddingTop: '10px',whiteSpace: 'pre-wrap',wordWrap: 'break-word'} : {};
            return (
                !isTable && !value ?
                    <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`} style={{color:'rgba(150,150,150,0.4)'}}>{valueHolder}</div>
                    :
                    <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}
                         style={retStyle}
                    >{value}</div>
            );
        }
        return (
            <div
                className='custom-select'
                style={{...styleObj}}
            >
                <input
                    id={`custom-select-input${id}`}
                    className='custom-select-input'
                    onClick={this.handleClick}
                    readOnly={true}
                    value={value}
                />
                <span className={`custom-select-toggle${icon === 'down' || icon === 'up' ? '' : 'close'}`}>
          <Icon onClick={this.handleClick}
                type={icon} onMouseOut={this.handleMourseOut}
                onMouseOver={this.handleMourseOver}/>
        </span>
                <div className={`custom-select-box${id} custom-select-box custom-select-${dropDown}`}>
                    <div className='custom-select-box-dropdown'>
                        <div className={`custom-select-box-dropdown-search${this.disableSearch}`}>
                            <input
                                ref={instance => this.inputValue = instance}
                                className='custom-select-box-dropdown-searchfalse-input'
                                onKeyPress={this.handleSearchClick}
                                placeholder='搜索框'/>
                            <span className='custom-select-box-dropdown-searchfalse-icon'><Icon type='search1' onClick={() => this.handleSearchClick('13')}/></span>
                        </div>
                        <div className='custom-select-box-dropdown-detail'>
                            <TabPanes
                                activeKey={activeKey}
                                panes={panes}
                                removeOnTab={this.handleRemoveTab}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
