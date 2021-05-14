import React from 'react';

export default class ReactHello extends React.Component {

    render() {
        return (
            <div style={{marginLeft: '20px'}}>
                <div>
                    <span style={{fontWeight: 'bold', color: '#0000FF', fontSize: '16px'}}>Hello</span>
                    <span style={{fontWeight: 'bold',color: '#FF0000',fontSize: '14px',textDecoration: 'underline'}}>Word</span>
                </div>
            </div>


        );
    }
}

