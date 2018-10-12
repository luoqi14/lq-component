import React, { Component } from 'react';
import { Button, Popconfirm, Icon } from 'antd';
import Img from '../../../../components/Img';
import ListPage from '../../../../components/ListPage';
import Number from '../../../../components/Number';

class View extends Component {
  componentDidMount() {
    this.load();
  }

  load() {
    this.props.loadUsers({
      ...this.props.searchParams,
      ...this.props.sorter,
    });
  }

  render() {
    const {
      menuRouter,
      users,
      loading,
      page,
      loadUsers,
      changeSearch,
      searchParams,
      lockUser,
      sorter,
      selectedRowKeys,
      selectRows,
      clearSelectedKeys,
      changeTab,
      activeTab,
    } = this.props;

    const columns = [
      {
        label: '序号',
        name: 'sequence',
        columnType: 'sequence',
      },
      {
        label: '工号',
        name: 'id',
        line: 200,
        sorter: true,
        align: 'left',
      },
      {
        label: '图片',
        name: 'avatar',
        render: (url) => <Img src={url || null} />,
      },
      {
        label: '自定义',
        name: 'cuz',
        component: Number,
        search: true,
        hidden: true,
        col: 6,
        hideLabel: true,
      },
      {
        title: <Icon type="user" />,
        label: '员工姓名',
        name: 'name',
        search: true,
        col: 6,
        sorter: true,
        align: 'left',
      },
      {
        label: '三级地址',
        name: 'address1',
        type: 'address',
        search: true,
      },
      {
        label: '联系电话',
        name: 'phone',
        search: true,
        sorter: true,
        phone: true,
        col: 6,
      },
      {
        label: '员工类型',
        name: 'type',
        search: true,
        type: 'select',
        data: { 1: '店长', 2: '快递员' },
        sorter: true,
        col: 6,
      },
      {
        label: '所属门店',
        name: 'storeId',
        search: true,
        type: 'select',
        data: { 1: '计量问问店', 2: '杭师问问店' },
        sorter: true,
        col: 6,
      },
      {
        label: '员工状态',
        name: 'status',
        search: true,
        type: 'select',
        data: [{ id: 1, label: '在职' }, { id: 2, label: '离职' }],
        sorter: true,
        br: true,
        col: 6,
      },
      {
        label: '注册时间',
        name: 'createDatetime',
        type: 'datetimeRange',
        timeFormat: 'YYYY-MM-DD HH:mm:ss',
        sorter: true,
        search: true,
        br: true,
        shortcuts: ['today', 'yesterday', 'thisWeek', 'thisMonth'],
        col: 18,
        labelCol: 2,
        wrapperCol: 22,
        width: 220,
      },
      {
        label: '操作',
        name: 'action',
        render: (text, record) => (record.status === 1
          && (<Popconfirm
            title="你确定要注销吗?"
            onConfirm={lockUser.bind(this, { ids: [record.id] })}
          >
            <Button type="primary">注销</Button>
          </Popconfirm>)),
      },
    ];

    const buttons = [
      {
        label: '批量注销',
        onClick: lockUser.bind(this, { ids: selectedRowKeys, multi: true }),
        disabled: selectedRowKeys.length === 0,
      },
    ];

    return (
      <ListPage
        // title="标题"
        columns={columns}
        breadcrumb={menuRouter}
        data={users}
        loading={loading}
        page={page}
        search={loadUsers}
        changeSearch={changeSearch}
        searchParams={searchParams}
        sorter={sorter}
        xScroll={800}
        checkbox={{
          selectedRowKeys,
          selectRows,
          clearSelectedKeys,
          getCheckboxProps: (record) => ({
            disabled: record.status === 2,
          }),
        }}
        buttons={buttons}
        topButtons={[
          {
            label: '刷新',
            onClick: this.load.bind(this),
            type: 'default',
            icon: 'sync',
            loading,
          },
        ]}
        buttonPos="tab"
        tableTitle={'Title'}
        searchButtonStyle={{ clear: 'none' }}
        breadcrumbSeparator=">"
        expandedRowRender={(record) => <p style={{ margin: 0 }}>{record.name}</p>}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        tab={{
          title: ['tab1', 'tab2'],
          onChange: (key) => {
            changeTab(key);
          },
          activeKey: activeTab,
        }}
        expandIconAsCell={false}
      />
    );
  }
}

export default View;
