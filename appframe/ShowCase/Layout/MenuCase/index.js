import React from 'react';
import {CustomMenu} from 'roface';
import { getItem } from '../../../../src/lib/cache';
import { removeLevelMore, flatToTree,reCoverSurround, findMenuItem } from '../../../../src/lib/menutransform';

export default class MenuCase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dataSource:[]
    };
  }
  componentDidMount(){
      const menu = JSON.parse(getItem('menu'));
      if (menu) {
          const res = reCoverSurround(menu);
          const dataSource = removeLevelMore(flatToTree(res).data);
          this.setState({
              dataSource:dataSource
          });
      }
  }
  render() {
    const {dataSource} = this.state;
    return (
      <div className='menu-container'>
        <CustomMenu dataSource={dataSource}/>
      </div>
    );
  }
}
