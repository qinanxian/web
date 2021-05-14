import React from 'react';
import {Spin,Button,Icon,Message,EmbedBlock,Collapse} from '../../../../src/components';
import classnames from '../../../../src/lib/classnames';
import './style/index.less';

const mockLinks = [{key:'key1',content:'link1'},{key:'key2',content:'link2'}];

export default class  WorkflowCase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      spinning:false,
      toggle:null,
      foldStatus:false,
      isAnimation:false
    };
  }
  componentDidMount(){
    this._getTaskResource();
  }
  _getTaskResource(){
    const { ready, rest } = this.props;

  }
  _handleClick = () => {
    const toggleStatus = this.state.toggle;
    this.setState({
      toggle:toggleStatus === null ? true : !toggleStatus,
      isAnimation: true
    }, () => {
      setTimeout(() => {
        this.setState({
          foldStatus:true,
          isAnimation:false
        })
      },400)
    });
  };
  _handleLeftIcon = () => {
    this.setState({
      toggle:!this.state.toggle,
      foldStatus:false,
      isAnimation: true
    },() => {
      setTimeout(() => {
        this.setState({isAnimation:false})
      },400)
    });
  };
  _handleLinks = () => {
    Message.info('超链接事件！');
  };
  _handleSave = () => {
    Message.info('保存！');
  };
  render() {
    const {spinning,toggle,foldStatus,isAnimation} = this.state;
    const classes_content = classnames({
        'workflow-container-content':true,
        'workflow-container-content-spread':foldStatus,
        'workflow-container-content-active':isAnimation&&(toggle !== null ? toggle : false) || false,
        'workflow-container-content-inactive':isAnimation&&(toggle !== null ? !toggle : false) || false
    });
    const classes_quickbox = classnames({
        'workflow-container-quickbox':true,
        'workflow-container-quickbox-fold':foldStatus,
        'workflow-container-quickbox-active':isAnimation&&(toggle !== null ? toggle : false) || false,
        'workflow-container-quickbox-inactive':isAnimation&&(toggle !== null ? !toggle : false) || false
    });
    const leftIcon = toggle ? 'show' : 'hidden';
    return (
      <Spin spinning={spinning}>
        <div className='workflow-container'>
          <div className={classes_content}>
            <div className='workflow-container-content-header'>
              <div className='workflow-container-content-header-title'>项目测试流程</div>
              <div className='workflow-container-content-header-info'>
                <span>审批号：235001</span>
                <span>流程发起人：qliu</span>
                <span>发起时间：2019-02-15 16:47:00</span>
              </div>
              <div className='workflow-container-content-header-tabs'>
                <div className='workflow-container-content-header-tabs-btns'></div>
                <div className='workflow-container-content-header-tabs-links'>
                  {mockLinks.map(item => <span key={item.key} onClick={this._handleLinks} className='workflow-container-content-header-tabs-links-item'>{item.content}</span>)}
                </div>
              </div>
            </div>
            <div className='workflow-container-content-body'>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div> contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div> contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div> contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div> contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
                <div>contentcontentcontentcontentcontentcontentcontentcontent</div>
            </div>
            <span onClick={this._handleSave} className='workflow-container-content-save'>
                <Icon className='workflow-container-content-save-icon' type='fa-save'/>
            </span>
          </div>
          <div className={classes_quickbox}>
              <Icon className='workflow-container-quickbox-rightIcon' type="fa-angle-double-right" onClick={this._handleClick}>协同</Icon>
          </div>
          <Icon onClick={this._handleLeftIcon} className={`workflow-container-leftIcon${leftIcon}`} type="fa-angle-double-left"/>
        </div>
      </Spin>
    );
  }
}
