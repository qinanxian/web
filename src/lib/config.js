import profileDefault from '../../profile';

const profile = { ...profileDefault,...profileCustomize };  //使用指定环境的，覆盖默认环境的

const defaultConfig = {
    baseUrl: 'http://127.0.0.1',
    webApi: {
        i18n: '/base/i18n',
        dictList: '/base/dicts',
        dictItem: '/base/dicts',
        paramItemsTree: '/base/params/itemsTree',
        userMenuList: '/base/menu/userMenu',/*这个暂时应该不使用了*/
        allPilot: '/appframe/pilot/all',
        userPilot: '/appframe/pilot/my',
        dataFormAdmin: '/devtool',
        dataFormMeta: '/dataform/meta',
        dataFormInvoke: '/dataform/invoke',
        dataFormDataOne: '/dataform/data/one',
        dataFormDataOneSave: '/dataform/save/one',
        dataFormDataOneValidate: '/dataform/validate/one',
        dataFormDataList: '/dataform/data/list',
        dataFormDataListSave: '/dataform/save/list',
        dataFormDataListValidate: '/dataform/validate/list',
        dataFormDataItemDelete: '/dataform/delete/one',
        dataFormDataListDelete: '/dataform/delete/list',
        dataFormDictTree: '/dataform/element-dict-tree',
        dataExcel: '/dataform/excel/data/list',
        devtoolDataform: '/devtool/dataform'
        // dataFormDataOne: '/dataform/data/one/{form}/{param}',
        // dataFormDataList: '/dataform/data/list/{form}/{param}/{sort}/{index:[]+}-{size:[]+}',
    },
    icons: [
        {name: 'roic', path: '/icon/roic/index.html'},
        {name: 'antd', path: '/icon/antd/index.html'},
        {name: 'awesome', path: '/icon/awesome/index.html'},
    ],
    app_1: {
        name: '',
        logo: 'roic-amix',//amarsoft,amix,rober,pdman ,使用的roic的图标，省去了roic前缀
        owner: '',
        slogan: '欢迎使用&请登录',
    },
    app_2: {
        name: 'AMIX基金管理平台',
        logo: '',
        owner: 'AMIX公司&Copyright ©2000-2018 AMIX all rights reserved',
        slogan: '交易指南&使用说明&联系我们',
    },
    app_3: {
        name: '欢迎登录AMIX管理平台',
        logo: '',
        owner: '',
        slogan: '',
    },
    brand: {
        banner: {
            logoText:'Amix',
            title: '基金管理平台',
            logo: 'roic-amix',
        },
        quickCreateEnable: true, /*顶部区域的快速创建按钮区*/
        messageSummaryEnable: true /*顶部区域的消息提示区*/
    },
    loginDefault: 'app_1',
    labelAlign: 'right', /* left   right(默认)   spaceBetween(label左对齐，冒号右对齐)*/
    valueNullHolder: '<空>',
    labelWidth: '150px',
    readingInfoUnderLine:false,
    tabType:'line',
    surface:profile.surface,
};

const config = {
    ...defaultConfig,
    ...profile,
    icons: defaultConfig.icons.concat(profile.icons || []),
    baseUrl: baseUrl || profile.baseUrl,
    staticUrl: staticUrl,
    customPage: customPage,
    evn: evn,
};

export default config;
