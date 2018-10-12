# lq-component
> 基于antd的公共组件

[项目地址](https://github.com/luoqi14/lq-component)

## Installation

  ```
  npm install lq-component --save
  ```
  
## 按需加载解决方案(仅适用单个引入组件)
babel配置文件.babelrc里的plugins添加
```
["babel-plugin-imports-transform", {
  "local-components": {
    "transform": "local-components/dist/${member}",
    "preventFullImport": true
  }
}]
```
需要先安装插件包
```
npm install babel-plugin-imports-transform --save-dev
```

## 表单解决方案

### 辅助函数
#### createFormItem(options)

参数 | 说明 | 类型 | 默认值
:---:|:---:|:---: | :---:
options.field | 字段 | object | 
options.form | form实例 | object |
options.formItemLayout | 布局 | object | 
options.colSpan | 一行占格数 | number | 24

引用此方法就不能按需加载

#### onFieldsChange(props, fields)
用于Form.create参数，确保props里有changeRecord

#### mapPropsToFields(props)
用于form.create参数，确保props里有values或record

### 布局
栅格布局，一行24格
label / wrapper  默认 4 / 6 可通过formItemLayout设置，如：
```javascript
options.formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 14,
  },
}
```
提供三种快速布局，field['simple'|'long'|'double']

simple为4 / 14, 行占24

long为4 / 20， 行占24

double为 8 / 12, 行占12，设置field['left'|'right']区别左右，两列布局

### 校验
可编辑才校验，隐藏只读不校验

field属性 | 说明 | 类型 | 默认值
:---:|:---:|:---: | :---:
required | 必填 | boolean | false
max | 最大值 | number | 120
min | 最小值 | number |
validator | 自定义函数 | function |
pattern | 正则 | Regex |
patternMsg | 正则自定义信息 | string |
phone | 手机校验 | boolean | false
number | 数字校验 | boolean | false
ID | 身份证校验 | boolean | false

### 编辑/查看
每个组件有两种状态，设置disabled或readonly为true/false

### 值
一般跟store的record绑定，通过onFieldsChange跟mapPropsToFields两个函数
```javascript
record = {
  name: {
    value: 'Jack'
  },
  age: {
    value: 18,
  },
};
```
可设默认值
用form.validateFields方法获取表单上的值或直接取record

## 通用列表页

![](public/markdown/listpage.jpg)
由标题、操作按钮、搜索栏、表格及弹窗表单组成

成员 | 说明 | 类型 | 默认值
:---:|:---:|:---: | :---:
title | 自定义标题名 | string |
name | 模块名 | string | 
rowKey | 表格记录主键 | string | id
loading | 表格加载中 | boolean | false
confirmDisabled | 弹窗表单按钮可用 | boolean | false
confirmLoading | 弹窗表单按钮加载中 | boolean | false
columns | 表格字段 | array | 必填
fields | 弹窗表单字段 | array | 
data | 表格数据 | array |
search | 搜索栏搜索触发 | function | 必填
save | 弹窗表单保存按钮触发 | function |
record | 弹窗表单数据 | object |
modalVisible | 弹窗表单显示 | boolean | false
cancel | 弹窗表单取消触发 | function |
changeRecord | 弹窗表单数据改变触发 | function |
changeSearch | 搜索数据改变触发 | function |
searchParams | 搜索数据 | object |
resetSearch | 搜索数据重置触发 | function | 
aboveSearch | 搜索栏前自定义html | jsx |
sorter | 表格排序 | object |
xScroll | 表格宽度 | number |
validateDisabled | 表单验证模式 | boolean | false

### 通用详情页

![](public/markdown/detailpage.jpg)
有标题（面包屑）、表单、操作按钮组成

成员 | 说明 | 类型 | 默认值
:---:|:---:|:---: | :---:
title | 自定义标题名 | string |
loading | 表单加载中 | boolean | false
fields | 表单字段 | array |
rowKey | 主键 | string | id
buttons | 操作按钮 | array | 
routers | 面包屑路径 | array |
validateDisabled | 表单验证模式 | boolean | false
  
## 可用二次封装组件

- Captcha 手机验证码输入框

  ![](public/markdown/Captcha.png)
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  count | 重新发送倒计时 | number | 60
  onClick | 按钮按下时触发,需返回promise  | function | 
  value | 值 | string |
  onChange | 输入改变时触发 | function(value)
  
- DatePicker 日期选择框
  
  ![](public/markdown/DatePicker.png)
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  value | 值 | string/date: monent |
  onChange | 选择改变时触发 | function(value)
  
- Editor 富文本编辑框
  
  ![](public/markdown/Editor.png)
    
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  value | 值 | string |
  onChange | 输入改变时触发 | function(value)
  
- ImagePicker 图片上传框
  
  ![](public/markdown/ImagePicker.png)
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  tokenSeparators | 值分隔符 | string |
  value | 值 | string/array |
  onChange | 选择改变时触发 | function(value)
  
- Input 输入框

  ![](public/markdown/Input.png)
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  value | 值 | string |
  onChange | 输入改变时触发 | function(value)
  
- MonthPicker 月份选择框
  
  ![](public/markdown/MonthPicker.png)
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  value | 值 | string/date: monent |
  onChange | 选择改变时触发 | function(value)
  
- MonthRange 月份范围选择框
  
  ![](public/markdown/MonthRange.png)
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  value | 值 | array |
  onChange | 选择改变时触发 | function(value)
  
- Number 数字输入框

  ![](public/markdown/Number.png)
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  value | 值 | string/number |
  min | 最小值 | number |
  max | 最大值 | number |
  money | 金额格式化 | boolean | false
  onChange | 输入改变时触发 | function(value)
  
- NumberRange 数字范围输入框

  ![](public/markdown/NumberRange.png)
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  value | 值 | array |
  startMin | 最小值 | number |
  endMax | 最大值 | number |
  onChange | 输入改变时触发 | function(value)
  
- Select 选择框

  ![](public/markdown/Select.png)
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  multiple | 多选模式 | boolean | false
  valueName | 值名称 | string | id
  displayName | 展示值名称 | string | name
  value | 值 | string/array |
  onChange | 选择改变时触发 | function(value)
  onSelect | 选择改变时触发 | function(value, record)
  page | 异步数据分页 | object(pageSize, pageNo, count, loading, data, query) |
  action | 分页是需设置，需返回promise  | function | 
  showSearch | 可搜索 | boolean
  
- Table 表格
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  loading | 数据加载标志 | boolean | false
  columns | 列定义 | array | 
  dataSource | 数据 | array |
  onChange | 分页改变时触发 | function(value)
  
- 表单弹出框

  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  confirmLoading | 保存按钮加载标志 | boolean | false
  fields | 字段定义 | array | 
  values | 数据 | array |
  changeRecord | 输入改变时触发 | function(fields)
  visible | 显示/隐藏 | boolean | false
  onCancel | 按取消按钮时触发 | function 
  onCreate | 按保存按钮时触发 | function
  cusTitle | 弹出框标题 | string
  formWidth | 弹出框宽度 | number | 1000
  
- 列表页
  
  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  title | 标题 | string 
  loading | 数据加载标志 | boolean | false
  columns | 列定义 | array | 
  data | 数据 | array |
  
- 详情页

  成员 | 说明 | 类型 | 默认值
  :---:|:---:|:---: | :---:
  title | 标题 | string 
  loading | 数据加载标志 | boolean | false
  values | 数据 | array |
  buttons | 自定义底部按钮 | array
  children | 自定义展示快 | object(JSX) |
  changeRecord | 输入改变时触发 | function(fields)
  
## 表单配置参数一览

- name 字段名（对应接口字段名）
- label 标签名
- disabled 禁用，这里更确切的理解应为只读，用于展示
- hidden 隐藏，不作校验
- search 是否是搜索栏字段
- required 必填
- validator 自定义校验
- pattern 正则校验
- patternMsg 正则校验提示信息
- phone 是否手机号
- number 是否数字
- positive 是否正数
- ID 是否身份证
- char 是否字母数字组合
- long 占满 一行样式
- simple 占中间 一行样式
- style 自定义内联样式
- className 自定义class样式
- type 类型
  - title 标题行
  - date 日期
  - Cascader 三级地区级联
    - data 地区数据
  - datetime 日期时间
  - dateRange 日期范围
  - month 月份
  - datetimeRange 日期时间范围
  - monthRange 月份范围
  - select 下拉选择，可多选
    - data 下拉数据
    - valueName 真实值
    - displayName 表现值
    - page 分页对象
  - editor 富文本
  - checkbox 复选
  - image 图片
    - tokenSeparators 多图片分隔符
  - password 密码
  - number 数字
    - min 最小值
    - max 最大值
    - money 是否金额格式化
  - textarea 多行文本
  - radio 单选框
  - numberRange 数字范围
    - startMin 开始最小值
    - endMax 结束最大值
  - 为空 即text 输入框
    - buttonText 带按钮
