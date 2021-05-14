import React from 'react';
import {getUser} from  '../../../../src/lib/cache';
import {EmbedBlock,DragactGrid,Icon,EmebedButton,Message, ContextMenu} from '../../../../src/components';
import Calendar from '../WorkCalendar';
import './style/index.less';

const ReactGridLayout = DragactGrid.GridLayout;

export default class DashboardContainer extends React.Component {
  static Calendar = Calendar;
  constructor(props) {
    super(props);
    this.preLayout=[],
    this.state = {
      width:0,
      dataSource:[],
      layoutItem:[],
      topItem:[],
      show:props.dashButton.collapse,
      status:true,
      confirm:false,
      display: false,
    };
  }
  componentDidMount() {
    this.props.rest.get(`/common/dashboard/${getUser().id}`)
      .then((data) => {
        this.preLayout = this.structLayout(data.filter(fIte => fIte.isUsed === 'Y')) || [];
        this.setState({
          dataSource: data,
          layoutItem:this.preLayout,
          topItem:data.filter(fIte => fIte.isUsed === 'N') || [],
        });
      });
  }
  widthChange = (width,height) => {
    this.setState({width,height});
  };
  resetState = (value) => {
    this.setState({
      show:value.collapse,
      status:value.refresh,
    });
  };
  //保存变化后的layout,返回浏览模式
  structLayout = (value) => {
    return value.map(item => {
      return {
        i: item.boardKey, x: item.axisX || 0, y: item.axisY || 0,
        w: item.sizeW || 1, h: item.sizeH || 1,
      }
    });
  };
  handleConfirm = () => {
    const {dataSource,layoutItem} = this.state;
    this.preLayout = layoutItem;
    const newLayout = dataSource.map(item => {
      const curLayout = layoutItem.filter(lay => lay.i === item.boardKey);
      if(curLayout.length > 0){
        return {
          ...item,
          axisX:curLayout[0].x,
          axisY:curLayout[0].y,
          sizeH:curLayout[0].h,
          sizeW:curLayout[0].w,
          isUsed:'Y',
        }
      }
      return {
        ...item,
        isUsed:'N',
      };
    });
    this.props.rest.post(`/common/dashboard/save/${getUser().id}`,newLayout)
      .then(ret => {
        if(ret){
          Message.success('保存成功！');
          this.props.resetDashButton && this.props.resetDashButton(false);
        } else {
          Message.error('保存失败！');
        }
      });
  };
  //取消变化后的layout,返回浏览模式,或直接返回浏览模式
  handleCancel = () => {
    this.setState({layoutItem:this.preLayout},() => {this.props.resetDashButton && this.props.resetDashButton(false);});
  };
  //恢复到变化前的layout，停留在编辑模式
  handleRevocation = () => {
    this.props.rest.get(`/common/dashboard/reset/${getUser().id}`)
      .then((data) => {
        this.setState({
          dataSource: data,
          layoutItem:this.structLayout(data.filter(fIte => fIte.isUsed === 'Y')),
          topItem:data.filter(fIte => fIte.isUsed === 'N') || [],
        });
      });
  };
  getOptionItems = (style) => {
    const options = this.state.topItem.map(item => {
      return (
        <div
          id={item.boardKey}
          key={item.boardKey}
          className={`dashboard-container-body-top${style}-items-item`}
          draggable={true}
          onDragStart={this.handleDrag}
        >
          <Icon type={item.style || 'appstore-o'}/>
          <span>{item.name}</span>
        </div>
      );
    });
    return options;
  };
  showOptions(show){
    const style = this.state.status ? show + 'Hold' : show;
    return (
      <div
        id='thumbNail'
        className={`dashboard-container-body-top${style}`}
        onDragEnter={this.handleEnter}
        onDragOver={this.handleDragOver}
      >
        <div
          className={`dashboard-container-body-top${style}-items`}
          onDragEnter={this.handleEnter}
          onDragOver={this.handleDragOver}
        >
          {this.getOptionItems(style)}
        </div>
        <div className={`dashboard-container-body-top${style}-btns`}>
          <EmebedButton type='primary' onClick={this.handleConfirm}>确定</EmebedButton>
          <EmebedButton onClick={this.handleCancel}>取消</EmebedButton>
          <EmebedButton onClick={this.handleRevocation}>重置</EmebedButton>
        </div>
      </div>
    );
  };
  handleDelete = (value) => {
    const {layoutItem,dataSource,topItem} = this.state;
    this.setState({
      layoutItem:layoutItem.filter((item) => item.i !== value.i),
      topItem:topItem.concat(dataSource.filter(fit => fit.boardKey === value.i))
    });
  };
  resetPageMode = (value,flag) => {
    this.props.resetPageMode && this.props.resetPageMode(value,flag);
  };
  getChildComponent(){
    const {rest, openLoading, closeLoading,flexTabs,param,themeColor,colorV3,layout} = this.props;
    const {layoutItem,dataSource,show} = this.state;
    const showState = show ? 'layer' : 'unlayer';
    let showLayout = [];
    if (dataSource.length > 0) {
      showLayout =  layoutItem.map((item) => {
        const showItem = dataSource.filter(fit => fit.boardKey === item.i)[0];
        return (
          <div
            key={item.i}
            className='dashboard-container-body-center-item'
          >
            <div className={`dashboard-container-body-center-item-${show ? 'delete' : 'hidden'}`}>
              <Icon onClick={() => this.handleDelete(item)} type='close'/>
            </div>
            <EmbedBlock
              url={showItem.uri}
              rest={rest}
              param={param}
              openLoading={openLoading}
              closeLoading={closeLoading}
              flexTabs={flexTabs}
              item={showItem}
              themeColor={themeColor}
              colorV3={colorV3}
              layout={layout}
              resetPageMode={this.resetPageMode}
            />
            <div className={`dashboard-container-body-center-item-${showState}`}/>
          </div>
        );
      });
    }
    return showLayout;
  };
  handleDrag = (e) => {
    this.id = e.target.id;
    //e.dataTransfer.setData('id',e.target.id);
  };
  handleEnter = (e) => {
    e.preventDefault();
  };
  handleDragOver = (e) => {
    e.preventDefault();
  };
  handleDrop = (e) => {
    const {layoutItem,dataSource,topItem} = this.state;
    e.preventDefault();
    const selectedId = this.id;
    this.setState({
      layoutItem:layoutItem.concat(this.structLayout(dataSource.filter(fite => fite.boardKey === selectedId))),
      topItem:topItem.filter(fite => fite.boardKey !== selectedId),
    });
  };
  //obtain position and size and so on...
  layoutChange = (value) => {
    this.setState({layoutItem:value});
  };
  _onContextMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.menu && this.menu.display(e);
  };
  _contextMenuDidMount = (menu) => {
    this.menu = menu;
  };
  _menuClick = () => {
    this.props.resetDashButton && this.props.resetDashButton(true);
  };
  render() {
    const {width,height,layoutItem,show} = this.state;
    return (
      <div className='dashboard-container' onContextMenu={this._onContextMenu}>
        <ContextMenu
            didMount={this._contextMenuDidMount}
            onClick={this._menuClick}
            menus={[{key: 'board', name: '定制主页'}]}
        />
        <div className='dashboard-container-body'>
          {this.showOptions(show)}
          <div
            id='instGraph'
            className={`dashboard-container-body-center`}
            onDragEnter={this.handleEnter}
            onDragOver={this.handleDragOver}
            onDrop={this.handleDrop}
            style={{height:height}}
          >
            <ReactGridLayout
              isDraggable={show}
              isResizable={show}
              className="layout"
              layout={layoutItem}
              cols={24}
              rowHeight={30}
              width={width - 16}
              onDragEnter={this.handleEnter}
              onDragOver={this.handleDragOver}
              onLayoutChange={this.layoutChange}
            >
              {this.getChildComponent()}
            </ReactGridLayout>
          </div>
        </div>
      </div>
    )
  }
}
