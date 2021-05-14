import React from 'react';
import { Icon, Calendar } from 'roface';
import {addBodyEventListener, removeBodyEventListener} from '../../../../src/lib/listener';

export default class TimeRange extends React.Component{
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
        const show = isShow ? 'inline-block' : 'none';
        return (
            <div className={`${prefix}-trange`}>
                <div ref={insatnce => this.timeRange = insatnce } className={`${prefix}-trange-cta`}>
                    <div className={`${prefix}-trange-cta-start`} onClick={() => this.handleRangeClick('timerange1')}>
                        <div className={`${prefix}-trange-cta-start-label`}>订单录入时间：</div>
                        <div className={`${prefix}-trange-cta-start-line`}/>
                        <div className={`${prefix}-trange-cta-start-value`}>1991-03-01</div>
                        <div className={`${prefix}-trange-cta-start-icon`}><Icon type={'calendar'}/></div>
                    </div>
                    <div className={`${prefix}-trange-cta-line`}/>
                    <div className={`${prefix}-trange-cta-end`} onClick={() => this.handleRangeClick('timerange2')}>
                        <div className={`${prefix}-trange-cta-end-value`}>1991-11-31</div>
                        <div className={`${prefix}-trange-cta-end-icon`}><Icon type={'calendar'}/></div>
                    </div>
                </div>
                <div style={{display:show}} className={`${prefix}-trange-box`}>
                    <Calendar fullscreen={false} onPanelChange={this.onPanelChange} />
                </div>
            </div>
        );
    }
}
