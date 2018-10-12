import React, { Component } from 'react';
import { Upload, message, Icon } from 'antd';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

export default class FileUpload extends Component {
  static propTypes = {
    fileList: PropTypes.array,
    uploadedLen: PropTypes.number,
    actionUrl: PropTypes.string,
    // setUploadedParam: PropTypes.func,
  }

  static defaultProps = {
    fileList: [],
    uploadedLen: 1,
    actionUrl: '',
    // setUploadedParam: undefined,
  }

  constructor(props) {
    super(props);
    this.state = {
      fileList: props.fileList || [],
    };
  }

  // 点击移除文件时的回调，返回值为 false 时不移除
  // onRemove = () => !this.props.isDetail
  onRemove = () => {
    if (this.props.isDetail) {
      return false;
    }
    this.props.removeUpload();
    return undefined;
  }

  beforeUpload = (file) => {
    const { fileType, fileName, fileLimit } = this.props;
    const needType = file.name.split('.').pop();
    const isNeedType = needType === fileType;
    const isFileLimit = file.size / 1024 / 1024 < fileLimit;
    if (!isNeedType) {
      message.error(`只能上传${fileType}类型文件!`);
    }
    if (!isFileLimit) {
      message.error(`${fileName}不能超过${fileLimit}MB!`);
    }
    const canUpFile = isNeedType && isFileLimit;
    const newFile = file;
    newFile.flag = !canUpFile;
    return canUpFile;
  }

  handleChange = (info) => { // 上传中、完成、失败都会调用这个函数
    const that = this;
    if (info.file.flag) { return; }
    let canAdd = true;
    const { status, response } = info.file;
    if (status === 'done') { // 上传完成之后
      if (/^(-5|1601|1602)$/.test(response.resultCode)) { // token 失效或账号被删除或被冻结
        localStorage.clear();
        message.error('登录已无效，请重新登录');
        history.push({ pathname: '/SignIn' });
      } else if (response.resultCode === '1603') { // 无权限
        history.push({ pathname: '/404' });
      } else if (response.resultCode === '0') {
        message.success('本次导入成功');
        const { uid } = response.resultData;
        that.props.setUploadedParam({ uid });
      } else {
        message.error(response.resultDesc);
        canAdd = false;
      }
    }
    this.setState({ // fileList 的改变要写在if 外边，否则不能上传
      fileList: info.fileList,
    }, () => {
      if (!canAdd) {
        this.setState({ fileList: [] });
      }
    });
  }

  render() {
    const { actionUrl, uploadedLen } = this.props;
    const { fileList } = this.state;
    return (
      <Upload
        name="file"
        action={actionUrl}
        headers={{ authorization: localStorage.getItem('accessToken') }}
        listType="text"
        onChange={this.handleChange}
        beforeUpload={this.beforeUpload}
        onRemove={this.onRemove}
        fileList={this.state.fileList}
      >
        {
          fileList.length >= uploadedLen ? null
            :
            (
              <div>
                <Icon type="plus" />
                <span className="ant-upload-text">Upload</span>
              </div>
            )
        }
      </Upload>
    );
  }
}
