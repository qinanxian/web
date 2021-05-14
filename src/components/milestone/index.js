import React from 'react';
import {Tooltip} from '../index';
import './style/index.less';

/* eslint-disable */
export default class  MileStone extends React.Component {
  constructor(props){
    super(props);
    this.btnState = false;
    this.state = {
      dataSource:this._structData(props.dataSource) || [],
      toggle:false,
    };
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.dataSource.length !== this.state.dataSource.length) {
      this.setState({
        dataSource:this._structData(nextProps.dataSource)
      });
    }
  }
  _structData = (value) => {
    let btnState = false;
    const result =  value.map((item) => {
      if(item.children){
        const status = [];
        btnState = true;
        item.children.forEach((it) => {
          status.push({key:it.value.serialNo,
            itemName:it.value.itemName,
            status:it.value.status});
        });
        return {...item,status:status};
      }
      return item;
    });
    this.btnState = btnState;
    return result;
  };
  _getThemConfig = (value) => {
    const status = value.map(item => item.value.status);
    if (status.includes('doing')) {
      return 'doing';
    } else if (status.includes('init')) {
      return 'init';
    }
    return ' done';
  };
  _handleToggle = () => {
    this.setState({
      toggle:!this.state.toggle,
    });
  };
  _handleLiClick = (value,flag) => {
    if (!flag) {
      this.props.handleClick && this.props.handleClick(value);
    }
  };
  _renderMilestone = () => {
    const {dataSource,toggle} = this.state;
    if(!dataSource.length > 0){
      return null;
    }
    return dataSource.map((groups,index) => {
      const lineState = index === 0 ? 'unline' : 'line';
      const childData = groups.children;
      const titleState = childData ? this._getThemConfig(groups.children) : groups.value.status;
      return (
        <div key={groups.value.sortCode} className='milestone-container-box-groups'>
          <div className={`milestone-container-box-groups-${lineState} milestone-container-box-groups-${titleState}`}>
            <span className={`milestone-container-box-groups-${lineState}-arrow milestone-container-box-groups-${titleState}-arrow`}/>
          </div>
          <div className={`milestone-container-box-groups-header milestone-container-box-groups-${titleState}`}>
            <span className='milestone-container-box-groups-header-circle'>
              <span className={`milestone-container-box-groups-header-circle-inner milestone-container-box-groups-header-circle-${titleState}`}>
                {titleState !== ' FINISHED' ? index + 1 : null}
              </span>
            </span>
            <span className='milestone-container-box-groups-header-title'>
              <span
                className={`milestone-container-box-groups-header-title-text milestone-container-box-groups-header-title-${titleState !== ' FINISHED' ? 'untext' : ''}`}
                onClick={() => this._handleLiClick(groups.value,titleState !== ' FINISHED')}
              >{groups.value.itemName}</span>
            </span>
          </div>
          <ul className='milestone-container-box-groups-ul'>
            {
              childData ?
                !toggle ?
                  childData.map((group,num) => {
                    const point = group.value.status;
                    const vline = num + 1 === childData.length ? 'unVline' : 'vline';
                    return (
                      <li
                        key={group.value.sortCode}
                        className={`milestone-container-box-groups-ul-li milestone-container-box-groups-ul-lih${titleState}`}
                        onClick={() => this._handleLiClick(group.value,point !== ' done')}
                      >
                        <span className={`milestone-container-box-groups-ul-li-${point} milestone-container-box-groups-ul-li-flag`}>
                        <span className={`milestone-container-box-groups-ul-li-flag-${vline}`}/>
                        </span>
                        <span>{group.value.itemName}</span>
                      </li>
                    );
                })
                  :
                <li className='milestone-container-box-groups-ul-offli'>
                  {groups.status.map((item) => {
                    return (
                      <Tooltip key={item.key} title={item.itemName} placement='bottom'>
                        <span key={item.key} className={`milestone-container-box-groups-ul-offli-point milestone-container-box-groups-ul-offli-off${item.status}`}/>
                      </Tooltip>
                    );
                  })}
                </li>
                :
              <li className='milestone-container-box-groups-ul-single'>{groups.value.finishDate && groups.value.finishDate}</li>
            }
          </ul>
        </div>
      );
    });
  };
  render() {
    const tooltip = this.state.dataSource.length > 0 ? 'show' : 'hidden';
    return (
      <div className='milestone-container'>
        {/*<span className={`milestone-container-btn${this.btnState}`}><Button onClick={this._handleToggle}>Toggle</Button></span>*/}
        <div className={`milestone-container-tooltip milestone-container-tip${tooltip}`}>
          <span className='milestone-container-tooltip-doing'>进行中</span>
          <span className='milestone-container-tooltip-done'>已完成</span>
          <span className='milestone-container-tooltip-init'>未开始</span>
        </div>
        <div className='milestone-container-box'>{this._renderMilestone()}</div>
      </div>
    );
  }
}
