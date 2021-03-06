/**
 * Created by jkwu on 2019-05-29.
 */
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Icon } from 'roface';
// import ChinaMap2 from './ChinaMap2/index';
import ChinaMap from './ChinaMap/index';
import ContractBrand from './ContractBrand/index';
import FinancingPeriod from './FinancingPeriod/index';
import CRHistogram from './CRHistogram/index';
import TrendRent from './TrendRent/index';
import KPIHistogram2 from './KPIHistogram2/index';
import { addOnResize } from '../../../../src/lib/listener';
import './style/index.less';

export default class BizDashboard extends Component {
    constructor(props){
        super(props);
        this.flag = true;
        this.state = {
            isFullScreen:false,
            curHeight:700
        }
    }
    componentDidMount(){
        this.dom = ReactDom.findDOMNode(this);
        this._setBizHeight();
        addOnResize(() => {
            if (this.flag) {
                this.flag = false;
                setTimeout(() => {
                    this._setBizHeight();
                    this.flag = true;
                }, 100)
            }
        });
    }
    _setBizHeight = () => {
        const curClientHeight = document.documentElement.clientHeight;
        curClientHeight > 900 && this.setState({
            curHeight:curClientHeight - 200
        });
    };
    handleScreenClick = () => {
        this.setState({isFullScreen:!this.state.isFullScreen},() => {
            this.state.isFullScreen ? this.requestFullScreen() : this.exitFullScreen();
        });
    };
    requestFullScreen = () => {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };
    exitFullScreen = () => {
        const element = document;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.mozCancelFullScreen) {
            element.mozCancelFullScreen();
        }
        else if (element.webkitCancelFullScreen) {
            element.webkitCancelFullScreen();
        } else if (element.msExitFullscreen) {
            element.msExitFullscreen()
        }
        else if (element.exitFullscreen) {
            element.exitFullscreen();
        }
    };
  render() {
    return (
      <div ref={instance => this.domInst = instance} className="biz-dashboard-container">
        <div className="biz-dashboard-header">
          <span className="biz-dashboard-header-company">
              <span className="biz-dashboard-header-company-icon"/>
              <span className="biz-dashboard-header-company-title">
                  <span>???????????????</span>
                  <span>????????????</span>
              </span>
              <span className="biz-dashboard-header-company-date">2019/06/21</span>
          </span>
          <Icon onClick={this.handleScreenClick} type={this.state.isFullScreen&&'shrink' || 'arrowsalt'} />
        </div>
        <div className="biz-dashboard-body">
          <div className="biz-dashboard-body-left">
              <div className="biz-dashboard-body-left-top">
                  <div className='biz-dashboard-body-left-top-slider'>
                      <div className='biz-dashboard-body-left-top-slider-pie'>
                          <div className='biz-dashboard-body-left-top-slider-pie-date'>
                              <span>???</span>
                              <span>???</span>
                              <span>???</span>
                          </div>
                          <div className='biz-dashboard-body-left-top-slider-pie-block'>
                              <ContractBrand />
                              <div className='biz-dashboard-body-left-top-slider-pie-block-text'>??????????????????</div>
                          </div>
                          <div className='biz-dashboard-body-left-top-slider-pie-block'>
                              <FinancingPeriod />
                              <div className='biz-dashboard-body-left-top-slider-pie-block-text'>??????????????????</div>
                          </div>
                      </div>
                      <div className='biz-dashboard-body-left-top-slider-msg'>
                          <div className='biz-dashboard-body-left-top-slider-msg-date'>
                              <span>???????????????</span>
                              <span className='biz-dashboard-body-left-top-slider-msg-date-split'>
                                  <span>??????</span><span>??????</span><span>??????</span>
                              </span>
                          </div>
                          <div className='biz-dashboard-body-left-top-slider-msg-dill'>
                              <div className='biz-dashboard-body-left-top-slider-msg-dill-block'>
                                  <span>17</span>
                                  <span/>
                                  <span>??????</span>
                              </div>
                              <div className='biz-dashboard-body-left-top-slider-msg-dill-block'>
                                  <span>03</span>
                                  <span/>
                                  <span>??????</span>
                              </div>
                              <div className='biz-dashboard-body-left-top-slider-msg-dill-block'>
                                  <span>03</span>
                                  <span/>
                                  <span>??????</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className='biz-dashboard-body-left-top-content'>
                      <div className='biz-dashboard-body-left-top-content-map'>
                          <div className='biz-dashboard-body-left-top-content-map-title'>
                              <span className='biz-dashboard-body-left-top-content-map-title-block'>
                                  <span>?????????</span>
                                  <span>279</span>
                              </span>
                              <span className='biz-dashboard-body-left-top-content-map-title-block'>
                                  <span>?????????</span>
                                  <span>131</span>
                              </span>
                              <span className='biz-dashboard-body-left-top-content-map-title-block'>
                                  <span>??????????????????</span>
                                  <span className='biz-dashboard-body-left-top-content-map-title-block-text'>24,279,789</span>
                              </span>
                          </div>
                          <ChinaMap mapHeight={this.state.curHeight}/>
                      </div>
                      <div className='biz-dashboard-body-left-top-content-histogram'>
                          <div className='biz-dashboard-body-left-top-content-histogram-title'>
                              TOP10 ??????
                          </div>
                          <CRHistogram mapHeight={this.state.curHeight} />
                      </div>
                  </div>
              </div>
              <div className="biz-dashboard-body-left-bottom">
                  <div className="biz-dashboard-body-left-bottom-geo1">
                      <span>5??????????????????????????????</span>
                      <TrendRent/>
                  </div>
                  <div className="biz-dashboard-body-left-bottom-geo2">
                      <TrendRent/>
                      <span>?????????????????????????????????</span>
                  </div>
              </div>
          </div>
          <div className="biz-dashboard-body-right">
            <span className="biz-dashboard-body-right-kpi">
                <span>??????KPI</span>
                <span>11,000</span>
            </span>
            <KPIHistogram2/>
          </div>
        </div>
      </div>
    );
  }
}
