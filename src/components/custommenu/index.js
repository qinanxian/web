import React from 'react';

export default class CustomMenu extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }
  render() {
    const {dataSource = []} = this.props;
    console.log('dataSource:',dataSource);
    return (
      <div className='custmenu-container'>
        ge
      </div>``
    );
  }
}
