import React from 'react';

export default class BlockCta extends React.Component{
    render(){
        const { children, prefix = 'ro', colW = 6, rowH = 4 } = this.props;
        return (
            <div
                className={`${prefix}-blockcta ${prefix}-blockcta-W${colW} ${prefix}-blockcta-H${rowH}`}>
                {children}
                <span className={`${prefix}-blockcta-lineT`}/>
                <span className={`${prefix}-blockcta-lineR`}/>
                <span className={`${prefix}-blockcta-lineB`}/>
                <span className={`${prefix}-blockcta-lineL`}/>
            </div>
        );
    }
};
