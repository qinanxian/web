import React from 'react';
import { Icon, Calendar ,Row,Col,LinkButton} from 'roface';
import {addBodyEventListener,removeBodyEventListener} from '../../../../src/lib/listener';
import {propsCompose} from "../../../../src/components";

const OuterPack = (title) => {
    return (WrappedComponent) => {
        return class extends React.PureComponent {
            render(){
                const { prefix = 'ro' } = this.props;
                return (
                    <div className={`${prefix}-outerpack`}>
                        <div className={`${prefix}-outerpack-title`}>{title}</div>
                        <div className={`${prefix}-outerpack-com`}><WrappedComponent/></div>
                    </div>
                );
            }
        }
    }
};

const data = [{
    key:'1',
    value:'上海冠松之星',
},{
    key:'2',
    value:'上海宝信汽车',
},{
    key:'3',
    value:'杭州万宏4S店',
}];

@OuterPack('选择门店')
class DropDown extends React.Component{
    constructor(props){
        super(props);
        this.id = Math.uuid();
        this.state = {
            value:null,
            isShow:false
        }
    }
    componentDidMount(){
        addBodyEventListener(this.id,this.handleExecute,'click');
    }
    componentWillUnmount() {
        removeBodyEventListener(this.id)
    }
    handleExecute = (e) => {
        const cdn = this.chartsIns.compareDocumentPosition(e.target);
        if (cdn !== 20) {
            this.setState(() => ({
                isShow:false
            }))
        }
    };
    handleChange = (event) => {
        this.setState({
            value:document.getElementById(event.target.id).dataset.value || null,
            isShow:false
        });
    };
    handleClick = () => {
        this.setState((state) => ({
            isShow:!state.isShow
        }));
    };
    render(){
        const { prefix = 'ro' } = this.props;
        const { isShow, value } = this.state;
        return(
            <div className={`${prefix}-dropdown`} ref={instance => this.chartsIns = instance}>
                <div className={`${prefix}-dropdown-display`} onClick={this.handleClick}>
                    <div className={`${prefix}-dropdown-display-value`}>{value}</div>
                    <Icon className={`${prefix}-dropdown-display-icon${isShow}`}  type="down" />
                </div>
                <div className={`${prefix}-dropdown-box ${prefix}-dropdown-box${isShow}`} onClick={this.handleChange}>
                    {data.map(item => {
                        return (
                            <div id={item.key} key={item.key} data-value={item.value}>{item.value}</div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

@OuterPack('选择时间')
class TimeRange extends React.Component{
    constructor(props){
        super(props);
        this.id = Math.uuid();
        this.preId = null;
        this.state = {
            value:null,
            isShow:false
        }
    }
    componentDidMount(){
        addBodyEventListener(this.id,this.handleExecute,'click');
    }
    componentWillUnmount() {
        removeBodyEventListener(this.id)
    }
    handleExecute = (e) => {
        const cdn = this.timeRange.compareDocumentPosition(e.target);
        if (cdn !== 20) {
            this.setState(() => ({
                isShow:false
            }))
        }
    };
    onPanelChange = (value, mode) => {
        console.log(value, mode);
    };
    handleRangeClick = (flag) => {
        this.setState((state) => ({
            isShow: this.preId ? this.preId !== flag ? true : !state.isShow : true
        }),() => {
            this.preId = flag;
        });
    };
    render(){
        const { prefix = 'ro' } = this.props;
        const { value, isShow } = this.state;
        return(
            <div className={`${prefix}-timerange`}>
                <div ref={insatnce => this.timeRange = insatnce } className={`${prefix}-timerange-display`}>
                    <div className={`${prefix}-timerange-display-left`} onClick={() => this.handleRangeClick('timerange1')}>
                        <span className={`${prefix}-timerange-display-left-value`}>2018-09-09</span>
                        <Icon className={`${prefix}-timerange-display-left-icon`}  type="down" />
                    </div>
                    <span style={{margin: '0 5px'}}>至</span>
                    <div className={`${prefix}-timerange-display-right`} onClick={() => this.handleRangeClick('timerange2')}>
                        <span className={`${prefix}-timerange-display-right-value`}>2018-09-29</span>
                        <Icon className={`${prefix}-timerange-display-right-icon`}  type="down" />
                    </div>
                </div>
                <div className={`${prefix}-timerange-box ${prefix}-timerange-box${isShow}`}>
                    <Calendar fullscreen={false} onPanelChange={this.onPanelChange} />
                </div>
            </div>
        );
    }
}

class ZoomHandle extends React.Component{
    constructor(props){
        super(props);
        this.id = Math.uuid();
        this.preId = null;
        this.state = {
            value:null,
            isShow:false
        }
    }
    enlarge = (isFullScreen) => {
        const { flexTabs: { enlarge }, param: { __id } } = this.props;
        enlarge(__id, false, isFullScreen);
    };

    render(){
        return(
            <Row>
                <Col span={20}/>
                <Col span={2}><LinkButton icon={'fa-expand'} onClick={()=>this.enlarge(false)}></LinkButton></Col>
                <Col span={2}><LinkButton icon={'fa-arrows-alt'} onClick={()=>this.enlarge(true)}></LinkButton></Col>
            </Row>
        );
    }
}

export { DropDown, TimeRange ,ZoomHandle};
