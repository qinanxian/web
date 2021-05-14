import React from 'react';
import { Icon, Calendar } from 'roface';
import {addBodyEventListener, removeBodyEventListener} from '../../../../src/lib/listener';

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

export default class SelectForOrder extends React.Component{
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
        const show = isShow ? 'inline-block' : 'none';
        return (
            <div className={`${prefix}-select`} ref={instance => this.chartsIns = instance}>
                <div className={`${prefix}-select-label`}>按组织筛选：</div>
                <div className={`${prefix}-select-line`}/>
                <div className={`${prefix}-select-input`} onClick={this.handleClick}>
                    <div>{value}</div>
                    <Icon type='down'/>
                </div>
                <div style={{display:show}} className={`${prefix}-select-dropdown`} onClick={this.handleChange}>
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
