/* eslint-disable no-restricted-syntax,react/no-find-dom-node */
import React, { Component } from 'react';
import { InputNumber as AntdInputNumber } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from '../utils';
import unit from '../decorators/unit';

import './style.scss';

function formatMoney(num) {
  const numStr = `${num}`;
  const nums = numStr.split('.');

  const integer = (nums[0]).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return nums.length > 1 ? `${integer}.${nums[1]}` : integer;
}

class InputNumber extends Component {
  static propTypes = {
    max: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    money: PropTypes.bool,
    min: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    precision: PropTypes.number,
    reduce: PropTypes.oneOf([0.001, 0.01, 0.1, 1, 100, 1000, 10000, 100000, 1000000, 10000000]),
    size: PropTypes.string,
    render: PropTypes.func,
  };

  static defaultProps = {
    max: 10000000000000000,
    min: -Infinity,
    money: false,
    placeholder: '',
    disabled: false,
    precision: 2,
    reduce: 1,
    size: '',
    render: undefined,
  };

  constructor(props) {
    super(props);
    const value = typeof (props.value) === 'number' ? (props.value) : (props.value || undefined);
    this.state = { value, focused: false };
  }


  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = typeof (nextProps.value) === 'number' ? (nextProps.value) : (nextProps.value || undefined);
      this.setState({ value });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.focused !== nextState.focused) {
      this.changedFocus = nextState.focused;
    }
  }

  handleChange(value) {
    let val;
    if (typeof value === 'string') {
      val = `${value}`;
    } else {
      val = value;
    }
    this.props.onChange(val);
  }

  formatter = (val) => {
    const {
      reduce,
      render,
    } = this.props;
    if (render && !this.state.focused) {
      this.blurValue = render(val);
      return this.blurValue;
    }
    if (render && this.changedFocus) {
      this.changedFocus = false;
      return this.blurValue;
    }
    if (isEmpty(val)) {
      return val;
    }
    if (val === '-') {
      return val;
    }
    let isComma = false;
    if ((`${val}`).lastIndexOf('.') === (`${val}`).length - 1) {
      isComma = true;
    }
    const decimalLen = ((`${val}`).split('.')[1] || '').length;
    let value = `${parseFloat(val) / reduce}`;
    let reduceLen;
    let resLen;
    if (reduce > 1) {
      reduceLen = (`${reduce}`).length - (`${reduce}`).replace(/0/g, '').length;
      resLen = decimalLen + reduceLen;
    } else if (reduce < 1) {
      reduceLen = `${reduce}`.split('.')[1].length;
      resLen = Math.max(decimalLen - reduceLen, 0);
    }
    value = (+value).toFixed(resLen);
    value += (isComma ? '.' : '');
    if (value) {
      value = (`${value}`).replace(/[^.\-\d]/g, '');
      let precision = 0;
      const valueStr = `${value}`;
      const index = valueStr.indexOf('.');
      if (index >= 0) {
        precision = valueStr.length - valueStr.indexOf('.') - 1;
      }
      if (precision > this.props.precision) {
        value = (`${value}`).slice(0, index + 1 + this.props.precision);
      }
    }
    value = (`${value}`).replace(/,/g, '');
    if (this.inputValue) {
      if (+this.inputValue === parseFloat(value)) {
        const inputDecimalLen = ((`${this.inputValue}`).split('.')[1] || '').length;
        if (inputDecimalLen < this.props.precision) {
          value = parseFloat(value).toFixed(inputDecimalLen);
          value += (isComma ? '.' : '');
        }
      }
    }
    // if (value > +this.props.max) {
    //   value = +this.props.max;
    // }
    // if (value < +this.props.min) {
    //   value = +this.props.min;
    // }
    return value;
  };

  renderDisabled = () => {
    const {
      href,
      value,
      render,
      reduce,
      precision,
      money,
    } = this.props;
    let html = '';
    if (render) {
      html = render(value);
      html = isEmpty(html) ? <span className="fe-blank-holder">-</span> : html;
    } else {
      let number = (value / reduce).toFixed(precision);
      if (money) {
        number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      html = (<span>{isEmpty(value) ? <span className="fe-blank-holder">-</span> : number}</span>);
    }
    if (href && !isEmpty(value)) {
      html = <Link to={href}>{html}</Link>;
    }
    return html;
  };

  renderInput = () => {
    const {
      money,
      max = 10000000000000000,
      min,
      placeholder,
      inputWidth,
      addonBefore = '',
      addonAfter = '',
      readonly,
      reduce,
      size,
    } = this.props;

    let {
      step = 1,
    } = this.props;

    step *= reduce;

    const style = {};

    if (inputWidth) {
      style.width = inputWidth;
    }

    if (addonBefore) {
      style.marginLeft = 4;
    }

    if (addonAfter) {
      style.marginRight = 4;
    }

    let maxReduceLen = 0;
    const maxDecimalLen = ((`${max}`).split('.')[1] || '').length;
    let resMaxLen = 0;

    if (reduce > 1) {
      maxReduceLen = (`${reduce}`).length - (`${reduce}`).replace(/0/g, '').length;
      resMaxLen = Math.max(Math.max(maxDecimalLen - maxReduceLen, 0), this.props.precision);
    } else if (reduce < 1) {
      maxReduceLen = `${reduce}`.split('.')[1].length;
      resMaxLen = Math.max(maxDecimalLen + maxReduceLen, 0);
    }

    return (
      <AntdInputNumber
        onFocus={() => {
          this.setState({
            focused: true,
          });
        }}
        onBlur={() => {
          this.setState({
            focused: false,
          });
        }}
        step={step}
        size={size}
        style={style}
        disabled={readonly}
        max={+(+max * reduce).toFixed(resMaxLen)}
        min={(typeof min === 'number' ? +(min * reduce).toFixed(0) : +(+min * reduce).toFixed(0)) || undefined}
        placeholder={placeholder}
        money={money}
        onChange={this.handleChange.bind(this)}
        value={this.state.value}
        formatter={(val) => {
          const value = this.formatter(val);
          return money ? formatMoney(value) : value;
        }}
        parser={(val) => {
          if (isEmpty(val)) {
            return val;
          }
          if (val === '-') {
            return val;
          }
          let newVal = `${val}`;
          newVal = newVal.replace(/[^0-9,.-]/, '');
          newVal = newVal.replace(/\$\s?|(,*)/g, '');
          let reduceLen;
          if (reduce >= 1) {
            reduceLen = (`${reduce}`).length - (`${reduce}`).replace(/0/g, '').length;
            if (newVal.length > 15 - reduceLen) {
              newVal = newVal.slice(0, 15 - reduceLen);
            }
          } else if (reduce < 1) {
            if (newVal.length > 15) {
              newVal = newVal.slice(0, 15);
            }
          }
          this.inputValue = newVal;
          let isComma = false;
          if (newVal.lastIndexOf('.') === newVal.length - 1 &&
            (newVal.lastIndexOf('.') === newVal.indexOf('.') ||
              newVal.lastIndexOf('.') === (newVal.indexOf('.') + 1))) {
            isComma = true;
          }
          const decimalLen = ((`${newVal}`).split('.')[1] || '').length;
          if (decimalLen > this.props.precision) {
            newVal = newVal.slice(0, newVal.length - (decimalLen - this.props.precision));
          }
          if (window.isNaN(parseFloat(newVal))) {
            return '';
          }
          let resLen;
          if (reduce > 1) {
            reduceLen = (`${reduce}`).length - (`${reduce}`).replace(/0/g, '').length;
            resLen = Math.min(Math.max(decimalLen - reduceLen, 0), this.props.precision);
          } else if (reduce < 1) {
            reduceLen = `${reduce}`.split('.')[1].length;
            resLen = decimalLen + reduceLen;
          }
          const parsedVal = `${(+parseFloat(newVal) * (this.props.reduce)).toFixed(resLen)}`;
          return parsedVal + (isComma ? '.' : '');
        }}
      />
    );
  };

  render() {
    const {
      disabled,
      inputWidth,
      addonBefore = '',
      addonAfter = '',
      antdAddonBefore,
      antdAddonAfter,
      size,
    } = this.props;

    const style = {};

    const isGroup = antdAddonBefore || antdAddonAfter;

    if (inputWidth) {
      style.width = inputWidth;
    }

    if (addonBefore) {
      style.marginLeft = 4;
    }

    if (addonAfter) {
      style.marginRight = 4;
    }

    return (
      <div className={`number-container ${disabled ? 'number-disabled' : ''}`}>
        {
          !isGroup && (
            <React.Fragment>
              <span>{addonBefore}</span>
              {disabled ? this.renderDisabled() : this.renderInput()}
              <span>{addonAfter}</span>
            </React.Fragment>
          )
        }
        {
          isGroup && (
            <div className={`number-group ${size === 'large' ? 'number-group-lg' : ''}`}>
              {antdAddonBefore && (
                <span className="number-before-container">
                  <span
                    className={`number-before-inner ${typeof antdAddonBefore === 'object' ? 'number-element' : ''}`}
                  >{antdAddonBefore}</span>
                </span>
              )}
              {disabled ? this.renderDisabled() : this.renderInput()}
              {
                antdAddonAfter && (
                  <span className="number-after-container">
                    <span
                      className={`number-after-inner ${typeof antdAddonAfter === 'object' ? 'number-element' : ''}`}
                    >{antdAddonAfter}</span>
                  </span>
                )
              }
            </div>
          )
        }
        {this.renderUnit()}
      </div>
    );
  }
}

export default unit(InputNumber);
