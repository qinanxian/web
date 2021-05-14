import React from 'react';
import $ from 'jquery';
import { Form } from '@ant-design/compatible';
import { Switch, Icon, Tabs, Button, Modal, Divider,Password} from '../../../src/components/index';
import * as cache from '../../../src/lib/cache';
import config from '../../../src/lib/config';
import { addBodyEventListener, removeBodyEventListener } from '../../../src/lib/listener';
import { post,get } from '../../../src/lib/rest';
import './style/index.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

export default Form.create()(class PersonalManager extends React.Component {
    constructor(props) {
        super(props);
        this.tag = null;
        this.tags = null;
        this.id = Math.uuid();
        this.state = {
            dropDownState: 'top',
            dropDownBox: 'none',
            visible: false,
            bellState: false,
            plusState: false,
            passVisiable:false,
            msgAni:null,
            msgData:[],
            infoShow:false,
            dropRun:'',
            activeId:[]
        };
    }
    componentDidMount() {
        const { prefix = 'ro' } = this.props;
        const tagA = document.querySelectorAll(`.${prefix}-personal-box`);
        const tagB = document.querySelectorAll(`.${prefix}-personal-operation-container`);
        if (tagA.length > 0 || tagB.length > 0) {
            this.tag = tagA[tagA.length - 1];
            this.tags = tagB[tagB.length - 1];
            window.addEventListener('click', this._executeCA);
            window.addEventListener('mouseover', this._executeCB);
        }
        addBodyEventListener(this.id,this._excuteMsg,'click');
        this.getAllMessages();
    }
    componentWillUnmount() {
        window.removeEventListener('click', this._executeCA);
        window.removeEventListener('mouseover', this._executeCB);
        removeBodyEventListener(this.id);
    }
    restructureMsgData(value){
        return value.map((items,index) => ({...items,isShow:index < 1}));
    }
    _excuteMsg = (e) => {
        const msgDom = this.msgInstance.compareDocumentPosition(e.target);
        if (this.state.msgAni && msgDom !== 20 && msgDom !== 0) {
            this.setState({msgAni:false},() => {
                this.state.activeId.length > 0 && this.deleteReadMessage();
            });
        }
    };
    _executeCA = (e) => {
        const { dropDownBox } = this.state;
        if (dropDownBox !== 'none' && this.tag && this.tag.compareDocumentPosition(e.target) !== 20) {
            this._closeDropDown(1);
        }
    };
    _executeCB = (e) => {
        const { plusState } = this.state;
        if (plusState && this.tags && this.tags.compareDocumentPosition(e.target) !== 20) {
            this._closeDropDown(2);
        }
    };
    _closeDropDown = (num) => {
        if (num === 1) {
            this.setState({
                dropDownState: 'top',
                dropDownBox: 'none',
            });
        } else if (num === 2){
            this.setState({
                plusState: false,
            });
        }
    };
    _dropDownBox = (e) => {
        const {dropDownState} = this.state;
        if (dropDownState === 'down') {
            this.setState({
                dropDownState: 'top',
                dropDownBox: 'none',
            });
        } else {
            this.setState({
                dropDownState: 'down',
                dropDownBox: 'block',
                plusState: false,
            });
        }
        e.nativeEvent.stopImmediatePropagation();
    };
    _changeTheme = (value) => {
        this.props.switchMenu && this.props.switchMenu(value);
    };
    _logOut = () => {
        post('/logout', {}, {
            headers: {
                "X-Requested-With":"XMLHttpRequest"
            },
        }).then(() => {
            cache.setUser({});
            cache.setSessionId('');
            cache.setItem('menuId',[]);
            window.location.reload();
        }).catch(err => {
            Modal.error({
                title: '退出失败',
                content: JSON.stringify(err),
            });
        })
    };
    _singlePage = (value) => {
        const result = value ? 'spa' : 'tabs';
        post('/auth/user/my/saveBehavior', {id:cache.getItem('pageId'),objectId:result,objectType:'MyPageType'});
        cache.setItem('pageType', result);
        this.props.changePageType && this.props.changePageType(result);
    };
    handleResetPass = () => {
        this._closeDropDown(1);
        this.setState({passVisiable:true});
    };
    hidePassModal = (flag) => {
        if(flag){
            this.handlePassSubmit();
        }else{
            this.props.form.resetFields();
            this.setState({passVisiable:false});
        }
    };
    handlePassSubmit = () => {
        const {validateFields,resetFields} = this.props.form;
        validateFields((err, param) => {
            if (!err) {
                const resetData = {oldPwd:param['originPass'],newPwd:param['newPass']};
                post('/account/userModifyPwd', {}, {
                    data: $.param(resetData),
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    headers: {
                        "X-Requested-With":"XMLHttpRequest"
                    },
                }).then(() => {
                    this.setState({passVisiable:false});
                    resetFields();
                    cache.setUser({});
                    cache.setSessionId('');
                    cache.setItem('menuId',[]);
                    window.location.reload();
                }).catch(err => {
                    if (err) {
                        if (err.message.length > 8) {
                            this.props.form.setFields({
                                newPass: {
                                    value: param.newPass,
                                    errors: [new Error(err.message)],
                                },
                            });
                        } else {
                            // 原密码错误
                            this.props.form.setFields({
                                originPass: {
                                    value: param.originPass,
                                    errors: [new Error(err.message)],
                                },
                            });
                        }
                    }
                });
            }
        });
    };
    informationTabPane = (prefix, getFieldDecorator, personalObj) => {
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14, offset: 1},
            colon: false,
        };
        return (
            <div className={`${prefix}-tabPane1`}>
              <div className={`${prefix}-tabPane1-portrait`}>
                <span className={`${prefix}-tabPane1-portrait-icon`}/>
              </div>
              <div className={`${prefix}-tabPane1-register`}>
                <div className={`${prefix}-tabPane1-register-item`}>
                  <span className={`${prefix}-tabPane1-register-item-name`}>账户：</span>
                  <span className={`${prefix}-tabPane1-register-item-value`}>{personalObj.name}</span>
                </div>
                <div className={`${prefix}-tabPane1-register-item`}>
                  <span className={`${prefix}-tabPane1-register-item-name`}>昵称：</span>
                  <span className={`${prefix}-tabPane1-register-item-value`}>{personalObj.nick}</span>
                </div>
                <div className={`${prefix}-tabPane1-register-item`}>
                  <span className={`${prefix}-tabPane1-register-item-name`}>密码：</span>
                  <span className={`${prefix}-tabPane1-register-item-value`}>
                            ●●●●●●●●
                            <Icon
                                type='fa-pencil-square-o'
                                onClick={this.handleResetPass}
                                className={`${prefix}-reset-password-icon`}
                            />
                        </span>
                </div>
                <div className={`${prefix}-tabPane1-register-item`}>
                  <span className={`${prefix}-tabPane1-register-item-name`}>邮箱：</span>
                  <span className={`${prefix}-tabPane1-register-item-value`}>{personalObj.email}</span>
                </div>
                <div className={`${prefix}-tabPane1-register-item`}>
                  <span className={`${prefix}-tabPane1-register-item-name`}>电话：</span>
                  <span className={`${prefix}-tabPane1-register-item-value`}>{personalObj.phone}</span>
                </div>
              </div>
              <div className={`${prefix}-tabPane1-button`}>
                <Button onClick={this._logOut}>退出</Button>
              </div>
            </div>
        );
    };
    navSwitchTabPane = (prefix, layoutStyle) => {
        const bgColor = this.props.bgColor;
        let navTree = 'three';
        let megaTree = 'two';
        let megaMenu = 'one';
        if (layoutStyle === 'megaTree') {
            megaTree = 'twod';
        } else if (layoutStyle === 'megaMenu') {
            megaMenu = 'oned';
        } else if (layoutStyle === 'navTree') {
            navTree = 'threed';
        }
        return (
            <div className={`${prefix}-tabPane2`}>
              <div className={`${prefix}-tabPane2-${megaMenu}`} onClick={() => this._changeTheme(1)}>
                <div className={`${prefix}-tabPane2-${megaMenu}-nav1`}>
                  <div className={`${prefix}-tabPane2-${megaMenu}-nav1-top`} style={{ background: layoutStyle === 'megaMenu' ? bgColor : '#D4D6D8' }}/>
                </div>
                <div className={`${prefix}-tabPane2-${megaMenu}-text`}>顶部导航</div>
              </div>
              <div className={`${prefix}-tabPane2-${megaTree}`} onClick={() => this._changeTheme(3)}>
                <div className={`${prefix}-tabPane2-${megaTree}-nav1`}>
                  <div className={`${prefix}-tabPane2-${megaTree}-nav1-top`} style={{ background: layoutStyle === 'megaTree' ? bgColor : '#D4D6D8' }}/>
                  <div className={`${prefix}-tabPane2-${megaTree}-nav1-left`} style={{ background: layoutStyle === 'megaTree' ? bgColor : '#D4D6D8' }}/>
                </div>
                <div className={`${prefix}-tabPane2-${megaTree}-text`}>顶部&侧边</div>
              </div>
              <div className={`${prefix}-tabPane2-${navTree}`} onClick={() => this._changeTheme(2)}>
                <div className={`${prefix}-tabPane2-${navTree}-nav1`}>
                  <div className={`${prefix}-tabPane2-${navTree}-nav1-left`} style={{ background: layoutStyle === 'navTree' ? bgColor : '#D4D6D8' }}/>
                </div>
                <div className={`${prefix}-tabPane2-${navTree}-text`}>侧边</div>
              </div>
                {
                    config.surface.switcher.enableOpenModel ?
                        <div className={`${prefix}-tabPane2-singlePage`}>
                          <span>单页面应用：</span>
                          <Switch
                              defaultChecked={this.props.pageType !== 'tabs'}
                              checkedChildren='开'
                              unCheckedChildren='关'
                              onChange={this._singlePage}
                          />
                        </div>
                        :
                        ''
                }
            </div>
        );
    };
    _getColorItem = (value) => {
        switch (value) {
            case '#001529':
                return 'item1';
            case '#5bc24c':
                return 'item2';
            case '#008080':
                return 'item3';
            case '#e63f24':
                return 'item6';
            case '#3078d7':
                return 'item5';
            case '#8362d6':
                return 'item4';
            case '#ff8712':
                return 'item9';
            case '#30a487':
                return 'item8';
            case '#f5b025':
                return 'item7';
        }
    };
    _handleThemeColor = (value) => {
        const {prefix = 'ro' } = this.props;
        const getBgColor = $(`.${prefix}-theme-container-box-${value}`).css('background-color');
        this.props.themeColor && this.props.themeColor(getBgColor, value);
    };
    switchThemeColor = (prefix) => {
        const item = this._getColorItem(this.props.bgColor);
        const itemArr = [{key:'A',value:'item1'}, {key:'B',value:'item2'},{key:'C',value:'item3'},{key:'D',value:'item4'},
            {key:'E',value:'item5'},{key:'F',value:'item6'},{key:'G',value:'item7'},{key:'H',value:'item8'},{key:'I',value:'item9'}];
        return (
            <div className={`${prefix}-theme-container`}>
                {itemArr.map(items =>
                    <div key={items.key} className={`${prefix}-theme-container-box`}>
                      <div className={`${prefix}-theme-container-box-item ${prefix}-theme-container-box-${items.value}`} onClick={() => this._handleThemeColor(items.value)}>
                        <span style={{ display: item === items.value ? '' : 'none' }} className={`${prefix}-theme-container-box-${items.value}-selected`}/>
                      </div>
                        {/*<div className={`${prefix}-theme-container-box-text`}>{items.key}</div>*/}
                    </div>
                )}
            </div>
        );
    };
    _rock = (e) => {
        const {bellState,msgAni} = this.state;
        e.stopPropagation();
        this.setState({
            // bellState: !bellState,
            msgAni:msgAni === null ? true : !msgAni,
            dropDownState: 'top',
            dropDownBox: 'none',
        },() => {
            this.state.activeId.length > 0 && this.deleteReadMessage();
        });
    };
    getAllMessages = () => {
        get('/common/message/unreadMessages').then(result => {
            this.setState({
                msgData:this.restructureMsgData(result),
                activeId:[]
            });
        });
    };
    deleteReadMessage = () => {
        post(`/common/message/readClickedMessages`,{receiverIds:this.state.activeId}).then(ret => {
            ret && this.getAllMessages();
        });
    };
    hiddenClick = (e) => {
        e.stopPropagation();
    };
    handleBrefs = (e) => {
        e.stopPropagation();
        const {msgData,activeId} = this.state;
        const ids = [];
        const brefs = msgData.map(item => {
            if (item.id === e.target.id){
                !activeId.includes(item.id) && ids.push(item.id);
                return {...item,isShow:!item.isShow};
            }
            if (item.isShow && item.id !== e.target.id){
                return {...item,isShow:false};
            }
            return item;
        });
        this.setState({['msgData']:brefs,dropRun:'run',activeId:this.state.activeId.concat(ids)});
    };
    _overPlus = (e) => {
        this.setState({
            plusState: true,
            dropDownBox: 'none',
            dropDownState: 'top',
        });
        e.nativeEvent.stopImmediatePropagation();
    };
    _outPlus = (e) => {
        this.setState({
            plusState: false,
        });
        e.nativeEvent.stopImmediatePropagation();
    };
    handlePlusOver = (e, id) => {
        const idObj = document.getElementById(id).style;
        idObj.background = this.props.bgColor || '#001529';
        idObj.color = '#fff';
    };
    handlePlusOut = (e, id) => {
        const idObj = document.getElementById(id).style;
        idObj.background = '';
        idObj.color = '#001529';
    };
    _setLayoutSkin = (prefix, getFieldDecorator, personalObj,layoutStyle) => {
        const {EnableCustomizeLayout,EnableCustomizeSkin} = config.surface.switcher;
        if(!EnableCustomizeLayout && EnableCustomizeSkin){
            return (
                <Tabs defaultActiveKey="1" className={`${prefix}-personal-box-tab`}>
                  <TabPane tab="我" key="1" className={`${prefix}-personal-box-tab-tabPane`}>
                      {this.informationTabPane(prefix, getFieldDecorator, personalObj)}
                  </TabPane>
                  <TabPane tab="皮肤" key="3" className={`${prefix}-personal-box-tab-tabPane`}>
                      {this.switchThemeColor(prefix)}
                  </TabPane>
                </Tabs>
            );
        } else if(EnableCustomizeLayout && !EnableCustomizeSkin){
            return (
                <Tabs defaultActiveKey="1" className={`${prefix}-personal-box-tab`}>
                  <TabPane tab="我" key="1" className={`${prefix}-personal-box-tab-tabPane`}>
                      {this.informationTabPane(prefix, getFieldDecorator, personalObj)}
                  </TabPane>
                  <TabPane tab="布局风格" key="2" className={`${prefix}-personal-box-tab-tabPane`}>
                      {this.navSwitchTabPane(prefix, layoutStyle)}
                  </TabPane>
                </Tabs>
            );
        } else if(!EnableCustomizeLayout && !EnableCustomizeSkin){
            return (
                <Tabs defaultActiveKey="1" className={`${prefix}-personal-box-tab`}>
                  <TabPane tab="我" key="1" className={`${prefix}-personal-box-tab-tabPane`}>
                      {this.informationTabPane(prefix, getFieldDecorator, personalObj)}
                  </TabPane>
                </Tabs>
            );
        } else {
            return (
                <Tabs defaultActiveKey="1" className={`${prefix}-personal-box-tab`} type='line'>
                  <TabPane tab="我" key="1" className={`${prefix}-personal-box-tab-tabPane`}>
                      {this.informationTabPane(prefix, getFieldDecorator, personalObj)}
                  </TabPane>
                  <TabPane tab="布局风格" key="2" className={`${prefix}-personal-box-tab-tabPane`}>
                      {this.navSwitchTabPane(prefix, layoutStyle)}
                  </TabPane>
                  <TabPane tab="皮肤" key="3" className={`${prefix}-personal-box-tab-tabPane`}>
                      {this.switchThemeColor(prefix)}
                  </TabPane>
                </Tabs>
            );
        }
    };
    getRightRadius = (num) => {
        let result = {style:{right:'-1px'},value:num};
        if (num === 0) {
            result = {style:{display:'none'},value:''};
        } else if (9 < num && num <= 99) {
            result = {style:{right:'-6px'},value:num};
        } else if (num > 99) {
            result = {style:{right:'-10px'},value:'99+'};
        }
        return result;
    };
    _navRight = (prefix, getFieldDecorator, flag, menuType) => {
        const {dropDownBox, dropDownState, bellState,msgAni,msgData,dropRun} = this.state;
        const {surface,brand} = config;
        const cusEn = surface.customizeEnable ? 'active' : 'inactive';
        const bell = bellState ? 'bellActive' : 'bellStop';
        const news = bellState ? 'active' : 'news';
        const personalObj = cache.getUser();
        const layoutStyle = menuType || 'navTree';
        const messages = msgData;
        const narRightMargin = menuType === 'navTree' ? '10px' : '2px';
        const right = this.getRightRadius(msgData.length);
        if (!brand.messageSummaryEnable && brand.quickCreateEnable) {
            return (
                <div style={{minWidth:'159px',marginRight:'36px'}} className={`${prefix}-nav-right`}>
                  <div className={`${prefix}-nav-right-items`}>
                    <span className={`${prefix}-personal-portrait ${prefix}-personal-portraitmegaMenu`} onClick={this._dropDownBox} />
                    <span className={`${prefix}-navRight-text-${flag}`} onClick={this._dropDownBox}>{personalObj.name}</span>
                    <span className={`${prefix}-personal-${dropDownState}-${flag}`} onClick={this._dropDownBox} />
                    <div style={{display: dropDownBox}} className={`${prefix}-personal-box ${prefix}-personal-${cusEn} ${prefix}-personal-two`}>
                        {surface.customizeEnable ?
                            this._setLayoutSkin(prefix, getFieldDecorator, personalObj,layoutStyle)
                            :
                            this.informationTabPane(prefix, getFieldDecorator, personalObj)
                        }
                    </div>
                  </div>
                  <Divider type='vertical'/>
                  <div className={`${prefix}-right-items`}>
                    <div className={`${prefix}-personal-operation-${flag}`}
                         onMouseOver={this._overPlus}
                         onMouseOut={this._outPlus}>
            <span
                className={`${prefix}-personal-operation-${flag}-plus`}
                // onClick={this._conferenceBox}
            />
                      <span style={{ display: this.state.plusState ? '' : 'none' }} className={`${prefix}-personal-operation-${flag}-plusBlock`}/>
                      <div style={{ display: this.state.plusState ? '' : 'none' }} className={`${prefix}-personal-operation-container`}>
                        <div
                            onMouseOver={(e) => this.handlePlusOver(e, `${prefix}-personal-mail`)}
                            onMouseOut={(e) => this.handlePlusOut(e, `${prefix}-personal-mail`)}
                            className={`${prefix}-personal-operation-container-text`}
                            id={`${prefix}-personal-mail`}
                            style={this.state.txtStyle}
                        >
                          <Icon type='mail'/>
                          <span>发送站内信</span>
                        </div>
                        <div
                            onMouseOver={(e) => this.handlePlusOver(e, `${prefix}-personal-thumb`)}
                            onMouseOut={(e) => this.handlePlusOut(e, `${prefix}-personal-thumb`)}
                            className={`${prefix}-personal-operation-container-text`}
                            id={`${prefix}-personal-thumb`}
                        >
                          <Icon type='fa-thumb-tack'/>
                          <span>创建任务</span>
                        </div>
                        <div
                            onMouseOver={(e) => this.handlePlusOver(e, `${prefix}-personal-comment`)}
                            onMouseOut={(e) => this.handlePlusOut(e, `${prefix}-personal-comment`)}
                            className={`${prefix}-personal-operation-container-text`}
                            id={`${prefix}-personal-comment`}
                        >
                          <Icon type='fa-comment-o'/>
                          <span>发起话题讨论</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            );
        } else if (!brand.quickCreateEnable && brand.messageSummaryEnable) {
            return (
                <div style={{minWidth:'211px',marginRight:menuType === 'navTree' ? '0' : '-7px'}} className={`${prefix}-nav-right`}>
                  <div className={`${prefix}-nav-right-items`}>
                    <span className={`${prefix}-personal-portrait ${prefix}-personal-portraitmegaMenu`} onClick={this._dropDownBox} />
                    <span className={`${prefix}-navRight-text-${flag}`} onClick={this._dropDownBox}>{personalObj.name}</span>
                    <span className={`${prefix}-personal-${dropDownState}-${flag}`} onClick={this._dropDownBox} />
                    <div style={{display: dropDownBox}} className={`${prefix}-personal-box ${prefix}-personal-${cusEn} ${prefix}-personal-two`}>
                        {surface.customizeEnable ?
                            this._setLayoutSkin(prefix, getFieldDecorator, personalObj,layoutStyle)
                            :
                            this.informationTabPane(prefix, getFieldDecorator, personalObj)
                        }
                    </div>
                  </div>
                  <Divider type='vertical'/>
                    <span ref={instance => this.msgInstance = instance} onClick={this._rock} style={{position:'relative'}}>
            <span className={`${prefix}-personal-information-prompt ${prefix}-navRight-text-${flag}`}>消息中心</span>
            <span className={`${prefix}-personal-information-${flag}`}>
              {
                  flag === 'gray'
                      ?
                      <Icon className={`${prefix}-information-${bell}`} type={'roic-email'}/>
                      :
                      <Icon className={`${prefix}-information-${bell}`} type={'roic-email'}/>
              }
                <span style={right.style} className={`${prefix}-personal-information-prompt-${news}`}>
                <span style={{ display: bellState ? 'none' : '',height:menuType === 'navTree' ? '18px' : '19px' }} className={`${prefix}-personal-information-prompt-news-nums`}>{right.value}</span>
              </span>
            </span>
            <span className={`${prefix}-msglist ${prefix}-msglist${msgAni}`} onClick={this.hiddenClick}>
                <span className={`${prefix}-msglist-main`}>
                    {
                        messages.length > 0 ?
                            messages.map((items,index) => <span id={items.id + index} key={items.id} className={`${prefix}-msglist-main-block`}>
                        <span id={items.id} className={`${prefix}-msglist-main-block-origin`} onClick={this.handleBrefs}>
                            <span>{items.title}</span>
                            <Icon className={`${prefix}-msglist-main-block-origin-icon${dropRun}${items.isShow}`} type='down'/>
                        </span>
                        <span className={`${prefix}-msglist-main-block-content ${prefix}-msglist-main-block-content${items.isShow}`}>
                            <span className={`${prefix}-msglist-main-block-content-bref`}>{items.content}</span>
                            <span style={{display:items.linkUrl ? 'block' : 'none'}} onClick={(e) => this.handleDetailInfo(e,items)} className={`${prefix}-msglist-main-block-content-modal`}>详情 >></span>
                        </span>
                        </span>)
                            :
                            <span className={`${prefix}-msglist-main-nothing`}>没有新通知</span>
                    }
                </span>
                <span onClick={this.handleAllMsg} className={`${prefix}-msglist-allmsg`}>查看已读</span>
            </span>
          </span>
                </div>
            );
        } else if (!brand.messageSummaryEnable && !brand.quickCreateEnable) {
            return (
                <div className={`${prefix}-nav-right ${prefix}-nav-rightLast`}>
                  <div className={`${prefix}-nav-right-items`}>
                    <span className={`${prefix}-personal-portrait ${prefix}-personal-portraitmegaMenu`} onClick={this._dropDownBox} />
                    <span className={`${prefix}-navRight-text-${flag}`} onClick={this._dropDownBox}>{personalObj.name}</span>
                    <span className={`${prefix}-personal-${dropDownState}-${flag}`} onClick={this._dropDownBox} />
                    <div style={{display: dropDownBox}} className={`${prefix}-personal-box ${prefix}-personal-${cusEn} ${prefix}-personal-last`}>
                        {surface.customizeEnable ?
                            this._setLayoutSkin(prefix, getFieldDecorator, personalObj,layoutStyle)
                            :
                            this.informationTabPane(prefix, getFieldDecorator, personalObj)
                        }
                    </div>
                  </div>
                </div>
            );
        } else {
            return (
                <div className={`${prefix}-nav-right`} style={{marginRight:narRightMargin}}>
                  <div className={`${prefix}-nav-right-items`}>
                    <span className={`${prefix}-personal-portrait ${prefix}-personal-portraitmegaMenu   `} onClick={this._dropDownBox} />
                    <span className={`${prefix}-navRight-text-${flag}`} onClick={this._dropDownBox}>{personalObj.name}</span>
                    <span className={`${prefix}-personal-${dropDownState}-${flag}`} onClick={this._dropDownBox} />
                    <div style={{display: dropDownBox}} className={`${prefix}-personal-box ${prefix}-personal-${cusEn} ${prefix}-personal-three`}>
                        {surface.customizeEnable ?
                            this._setLayoutSkin(prefix, getFieldDecorator, personalObj,layoutStyle)
                            :
                            this.informationTabPane(prefix, getFieldDecorator, personalObj)
                        }
                    </div>
                  </div>
                  <Divider type='vertical'/>
                  <div className={`${prefix}-right-items`}>
                    <div className={`${prefix}-personal-operation-${flag}`}
                         onMouseOver={this._overPlus}
                         onMouseOut={this._outPlus}>
            <span
                className={`${prefix}-personal-operation-${flag}-plus`}
                // onClick={this._conferenceBox}
            />
                      <span style={{ display: this.state.plusState ? '' : 'none' }} className={`${prefix}-personal-operation-${flag}-plusBlock`}/>
                      <div style={{ display: this.state.plusState ? '' : 'none' }} className={`${prefix}-personal-operation-container`}>
                        <div
                            onMouseOver={(e) => this.handlePlusOver(e, `${prefix}-personal-mail`)}
                            onMouseOut={(e) => this.handlePlusOut(e, `${prefix}-personal-mail`)}
                            className={`${prefix}-personal-operation-container-text`}
                            id={`${prefix}-personal-mail`}
                            style={this.state.txtStyle}
                        >
                          <Icon type='mail'/>
                          <span>发送站内信</span>
                        </div>
                        <div
                            onMouseOver={(e) => this.handlePlusOver(e, `${prefix}-personal-thumb`)}
                            onMouseOut={(e) => this.handlePlusOut(e, `${prefix}-personal-thumb`)}
                            className={`${prefix}-personal-operation-container-text`}
                            id={`${prefix}-personal-thumb`}
                        >
                          <Icon type='fa-thumb-tack'/>
                          <span>创建任务</span>
                        </div>
                        <div
                            onMouseOver={(e) => this.handlePlusOver(e, `${prefix}-personal-comment`)}
                            onMouseOut={(e) => this.handlePlusOut(e, `${prefix}-personal-comment`)}
                            className={`${prefix}-personal-operation-container-text`}
                            id={`${prefix}-personal-comment`}
                        >
                          <Icon type='fa-comment-o'/>
                          <span>发起话题讨论</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider type='vertical'/>
                  <span ref={instance => this.msgInstance = instance} onClick={this._rock} style={{position:'relative'}}>
            <span className={`${prefix}-personal-information-prompt ${prefix}-navRight-text-${flag}`}>消息中心</span>
            <span className={`${prefix}-personal-information-${flag}`}>
              {
                  flag === 'gray'
                      ?
                      <Icon className={`${prefix}-information-${bell}`} type={'roic-email'}/>
                      :
                      <Icon className={`${prefix}-information-${bell}`} type={'roic-email'}/>
              }
              <span style={right.style} className={`${prefix}-personal-information-prompt-${news}`}>
                <span style={{ display: bellState ? 'none' : '',height:menuType === 'navTree' ? '18px' : '19px' }} className={`${prefix}-personal-information-prompt-news-nums`}>{right.value}</span>
              </span>
            </span>
            <span className={`${prefix}-msglist ${prefix}-msglist${msgAni}`} onClick={this.hiddenClick}>
                <span className={`${prefix}-msglist-main`}>
                    {
                        messages.length > 0 ?
                            messages.map((items,index) => <span id={items.id + index} key={items.id} className={`${prefix}-msglist-main-block`}>
                        <span id={items.id} className={`${prefix}-msglist-main-block-origin`} onClick={this.handleBrefs}>
                            <span>{items.title}</span>
                            <Icon className={`${prefix}-msglist-main-block-origin-icon${dropRun}${items.isShow}`} type='down'/>
                        </span>
                        <span className={`${prefix}-msglist-main-block-content ${prefix}-msglist-main-block-content${items.isShow}`}>
                            <span className={`${prefix}-msglist-main-block-content-bref`}>{items.content}</span>
                            <span style={{display:items.linkUrl ? 'block' : 'none'}} onClick={(e) => this.handleDetailInfo(e,items)} className={`${prefix}-msglist-main-block-content-modal`}>详情 >></span>
                        </span>
                        </span>)
                            :
                            <span className={`${prefix}-msglist-main-nothing`}>没有新通知</span>
                    }
                </span>
                <span onClick={this.handleAllMsg} className={`${prefix}-msglist-allmsg`}>查看已读</span>
            </span>
          </span>
                </div>
            );
        }
    };
    handleAllMsg = (e) => {
        e.stopPropagation();
        this.setState({
            msgAni:false
        },() => {
            this.props.openReadedMsg && this.props.openReadedMsg();
        });
    };
    handleDetailInfo = (e,item) => {
        e.stopPropagation();
        this.setState({msgAni:false});
        this.props.openDetail && this.props.openDetail(item.title,item.linkUrl,item.linkUrlParam);
    };
    getAccountType = () => {
        const user = cache.getUser() || {};
        return user.accountType;
    };
    render() {
        const accountType = this.getAccountType();
        const {prefix = 'ro', menuType} = this.props;
        const {getFieldDecorator} = this.props.form;
        // const flag = menuType !== 'navTree' ? 'white' : 'gray';
        const flag = menuType !== 'navTree' ? 'white' : 'white';
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14, offset: 1},
            colon: false,
        };
        return (
            <div>
                {this._navRight(prefix, getFieldDecorator, flag, menuType)}
              <Modal
                  key='password'
                  title='修改密码'
                  visible={this.state.passVisiable}
                  onOk={() => this.hidePassModal(true)}
                  onCancel={() => this.hidePassModal(false)}
                  okText='确认'
                  cancelText='取消'
              >
                <Form key='resetPassword' onSubmit={this.handlePassSubmit}>
                  <FormItem
                      label="原密码"
                      style={{display:'flex'}}
                  >
                      {getFieldDecorator('originPass',
                          {rules: [{ required: true, message: '请输入原密码' }]}
                      )(<Password/>)}
                  </FormItem>
                  <FormItem
                      label="新密码"
                      style={{display:'flex'}}
                  >
                      {getFieldDecorator('newPass',
                          {rules: [{
                              required: true,
                              validator: (rule, value, callback) => {
                                  const originPass = this.props.form.getFieldValue('originPass');
                                  if (!value) {
                                      callback('请输入新密码');
                                  } else {
                                      const length = accountType === 'Administrator' ? 14 : 8;
                                      const results = [];
                                      if (/\d+/g.test(value)) {
                                          results.push('number');
                                      }
                                      if (/[a-z]+/g.test(value)) {
                                          results.push('word')
                                      }
                                      if (/[A-Z]+/g.test(value)) {
                                          results.push('upWord')
                                      }
                                      if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]+/g.test(value)) {
                                          results.push('spword')
                                      }
                                      if (results.length < 3 || value.length < length) {
                                          callback(`密码长度最少为${length}位，且需要是小写，大写，数字，特殊符号其中至少三者的组合`);
                                      } else if (originPass === value){
                                          callback('新密码不能与旧密码一致');
                                      } else {
                                          callback();
                                      }
                                  }


                              } }]}
                      )(<Password/>)}
                  </FormItem>
                  <FormItem
                      label="确认密码"
                      style={{display:'flex'}}
                  >
                      {getFieldDecorator('confirmPass',
                          {rules: [{ required: true ,
                              validator: (rule, value, callback) => {
                                  if (value && value !== this.props.form.getFieldValue('newPass')) {
                                      callback('两次输入不一致！');
                                  } else if (!value) {
                                      callback('请输入确认密码');
                                  } else {
                                      callback();
                                  }
                              }
                          }]}
                      )(<Password/>)}
                  </FormItem>
                </Form>
              </Modal>
            </div>
        );
    }
});
