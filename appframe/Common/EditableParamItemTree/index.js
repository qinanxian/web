import React from 'react';
import {openModal, Icon, Modal} from '../../../src/components';
import EditableTreeList from './EditableTreeList';

export default class EditableParamItemTree extends React.Component {

    constructor(props) {
        super(props);
        const {title, paramCode} = this.props;
        this.title = title ? title : '编辑树图';
        this.paramCode = paramCode;
    }

    openEditableTree = () => {
      if (this.paramCode === 'DataFromPackTree' || this.paramCode === 'DictCategoryTree') {
        Modal.info({
          title: '温馨提示',
          content: '显示模版和数据字典的配置已经移动到工具AmixBuilder，如果您没有该工具，请联系研发部',
        });
      } else {
        const {reloadTree} = this.props;
        openModal(<EditableTreeList paramCode={this.paramCode}/>, {
            title: this.title,
            defaultButton: false,
            refresh: reloadTree
        });
      }
    };

    render() {
        return (
            <div>
                <a onClick={() => this.openEditableTree()}> <Icon type="edit"/>编辑树图</a>
            </div>
        );
    }

}
