import React, { Component } from 'react';

export default class KPIHistogram2 extends Component{
    constructor(props){
        super(props);
        this.state = {
            status:80
        }
    }
    getStatus = (flag) => {
        if (flag >= 100) {
            return {
                display:'none',
                num:100,
                arrow:'fill'
            }
        } else if (flag > 0) {
            return {
                display:'inline-block',
                num:flag,
                arrow:'empty'
            };
        } else {
            return {
                display:'none',
                num:0,
                arrow:'empty'
            };
        }
    };
    render() {
        const sta = this.getStatus(this.state.status);
        return (
            <div className='kpi2-cta'>
                <span className={`kpi2-cta-arrow kpi2-cta-arrow${sta.arrow}`}/>
                <div className='kpi2-cta-pillar'>
                    <div style={{height:sta.num+'%'}} className='kpi2-cta-pillar-embedded'>
                        <span style={{display:sta.display}} className='kpi2-cta-pillar-embedded-status'>已完成</span>
                    </div>
                </div>
            </div>
        );
    }
}
