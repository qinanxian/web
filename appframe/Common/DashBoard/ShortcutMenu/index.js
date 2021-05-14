import React from 'react';
import {Icon, openModal, DataTable, Notify, Modal, Spin} from 'roface';
import './style/index.less';

/* eslint-disable */
class RoShortcutMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit:false,
            dataSource:[],
            loading:true,
        };
    }
    componentDidMount(){
        this.getShortcutMenu();
    }
    getShortcutMenu(){
        this.props.rest.get('/shortcutMenu/query/').then(ret => {
            this.setState({dataSource:ret,loading:false});
        });
    }
    editIconClick = () => {
        this.setState({edit:!this.state.edit});
    };
    handleItemClick = (url,title) => {
        !this.state.edit && this.props.flexTabs.open(title,url);
    };
    deleteMenuItem = (key) => {
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.props.rest.post(`/shortcutMenu/delete/${key}`).then(() => {
                    Notify.success(`删除成功`);
                    this.getShortcutMenu();
                });
            },
            onCancel: () => {
                return;
            },
        });

    };
    handleDataReady = (dataList) => {
        this.dataList = dataList;
    };
    handlePlusClick = () => {
        openModal(<DataTable dataFormId="common-ShortCutMenuList"
                             selectionType='multiple'
                             dataReady={this.handleDataReady}
        />,{
            defaultButton: true,
            title:"选择快捷菜单" ,
            onOk: (modal, compnent,btn) => {
                modal.close();
                this.dataList.invoke('apply',{selectedData:this.dataList.getSelectedRows()}).then(ret => {
                    Notify.success(`添加成功`);
                    this.getShortcutMenu();
                });
            }
        });
    };
    render() {
        const {prefix = 'ro'} = this.props;
        return (
            <div className={`${prefix}-shortcutmenu`}>
                <Spin spinning={this.state.loading}>
                    <div className={`${prefix}-shortcutmenu-header`}>
                        <span>快捷菜单</span>
                        <span>
                            <Icon className={`${prefix}-shortcutmenu-header-icon`} onClick={this.editIconClick} type='fa-pencil-square-o'/>
                            <Icon onClick={this.handlePlusClick} type='plus'/>
                        </span>
                    </div>
                    <div className={`${prefix}-shortcutmenu-menus`}>
                        {this.state.dataSource.map(item => {
                            return this.renderShortCutItem(item,prefix);
                        })}
                    </div>
                </Spin>
            </div>
        );
    }
    renderShortCutItem = (item,prefix) => {
        return (
            <div key={item.id}
                 className={`${prefix}-shortcutmenu-menus-itemv2 ${prefix}-shortcutmenu-menus-itemv2${this.state.edit}`}
                 onClick={() => this.handleItemClick(item.menuUrl,item.menuName)}
            >
                <span> {item.menuName}</span>
                <span className={`${prefix}-shortcutmenu-menus-itemv2-delete${this.state.edit}`}>
                       <Icon type='minuscircle' onClick={() => this.deleteMenuItem(item.id)}/>
                    </span>
            </div>
        );
    }
}

export default RoShortcutMenu;
