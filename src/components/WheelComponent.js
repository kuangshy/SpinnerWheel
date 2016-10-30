
import React from 'react';
import ReactDOM from 'react-dom';
import Hammer from 'hammerjs';

class WheelComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      option: props.option
    }
  }
  // 开始滑动
  handlePanStart() {
    var option = this.state.option;
    option.rotateIndex = 0;
    option.isPan = false;
  }

  // 滑动
  handlePan(e) {
    let option = this.state.option;
    option.isPan = true
    let deltaY = e.deltaY;

    // 以上次选择的数值为起点,旋转了几个
    let deltaIndex = -Math.round(deltaY / option.height);

    // 当前显示值得索引
    option.selectedIndex = (option.lastIndex + deltaIndex);
    while(option.selectedIndex < 0) {
      option.selectedIndex += option.wheelData.length
    }
    option.selectedIndex %= option.wheelData.length;

    // 旋转角度
    option.rotation = Math.round(deltaY / option.height * option.theta) % option.theta;
    
    let rotateIndex = Math.floor(deltaY / option.height);
    if (rotateIndex - option.rotateIndex) {
      let rotateDirection = option.rotateDirection;
      rotateDirection = deltaY - option.deltaY > 0 ? 'rotateDown' : 'rotateUp';
      if(rotateDirection === option.rotateDirection || option.rotateDirection === '') {
        option.prepareDataMap = this.getPreparedData(option.wheelData, option.selectedIndex, option.prepareCount);
      }
      option.rotateDirection = rotateDirection;
      option.deltaY = deltaY;
    }

    option.rotateIndex= rotateIndex;

    this.setState({
      option: option
    })
  }

  // 结束滑动
  handlePanEnd() {
    let option = this.state.option;
    option.rotation = 0;
    option.lastIndex = option.selectedIndex;
    let selection = option.wheelData[option.selectedIndex];
    option.prepareDataMap = this.getPreparedData(option.wheelData, option.selectedIndex, option.prepareCount);
    this.setState({
      option: option
    });
    if (this.props.onChange) {
      this.props.onChange(selection);
    }
    option.isPan = false;
  }

  /**
   * [PreparedData 获取准备的新数据,目标数值要求在获取的数据中间]
   * @param {[Array]} wheelDataArr  [待获取目标的数组]
   * @param {[Number]} selectedIndex [待获取目标的索引]
   * @param {[Number]} prepareLength [准备数据数组的长度]
   * @return {[Array]} 返回准备数组
   */
  getPreparedData(wheelDataArr, selectedIndex, prepareLength) {
    // 待获取数组的长度
    let wheelLength = wheelDataArr.length;
    // 目标数据前后数据的长度,为方便处理,最终总长度都以奇数处理
    let deltaLength = Math.floor((prepareLength - 1) / 2);
    // 拷贝待获取目标的数组, 防止破坏原数据
    let wheelData = wheelDataArr.concat([]);
    let index = selectedIndex;
    // count用以计数,防止死循环
    let count = 0;
    // 拼接目标数组,知道能够获取满足条件的准备数组(即滚轮数据过少时,循环显示)
    while (index - deltaLength < 0 || index + deltaLength > wheelLength) {
      wheelData = wheelData.concat(wheelDataArr);
      wheelLength = wheelData.length;
      if(index - deltaLength < 0) {
        index += wheelLength;
      }
      if (count === 50) {
        break;
      }
      count++;
    }
    let startIndex = index - deltaLength;
    let endIndex = index + deltaLength + 1
    return wheelData.slice(startIndex, endIndex);
  }

  componentDidMount() {
    let option = this.state.option;
    let selection = this.props.selection || option.selection;
    let selectedIndex = option.wheelData.indexOf(selection);
    option.lastIndex = option.selectedIndex = selectedIndex;
    // 旋转角度
    option.rotation = option.lastRotation = 0;
    // 每个数据的角度
    option.theta = 360 / option.prepareCount;
    // 旋转方向
    option.rotateDirection = '';
    //上次滑动Y方向上的距离,有正负
    option.deltaY = 0;

    let textDOM = ReactDOM.findDOMNode(this.refs.text);
    option.height = textDOM.scrollHeight;

    //旋转圆的半径
    option.radius = Math.round((textDOM.scrollHeight * option.prepareCount) / (2 * Math.PI));

    // 准备数组
    option.prepareDataMap = this.getPreparedData(option.wheelData, option.selectedIndex, option.prepareCount);

    // 获取滚轮的DOM元素
    let wheelDOM = ReactDOM.findDOMNode(this.refs.wheel);
    // 利用hammerjs处理滑动事件
    option.touch = new Hammer(wheelDOM);
    option.touch.on('pan', this.handlePan.bind(this))
      .on('panstart', this.handlePanStart.bind(this))
      .on('panend', this.handlePanEnd.bind(this));
    option.touch.get('pan').set({direction: Hammer.DIRECTION_VERTICAL, threshold: 0});
    this.setState({
      option: option
    })
  }

  // 更新滚轮
  update() {
    let option = this.state.option;
    let selection = this.props.selection;
    option.selectedIndex = option.wheelData.indexOf(selection);
    option.prepareDataMap = this.getPreparedData(option.wheelData, option.selectedIndex, option.prepareCount);
  }

  render() {
    let figures = [];
    let option = this.state.option;
    if (!option.isPan) {
      // 如果非滑动操作,更新数据
      this.update();
    }
    if (option.prepareDataMap) {
      let middleIndex = Math.floor(option.prepareDataMap.length / 2);
      option.prepareDataMap.forEach(function (value, index) {
        let angle = (index - middleIndex) * option.theta + option.rotation;
        let style = {
          opacity: 0.5,
          transform: option.rotateType + '(' + -angle + 'deg) translateZ(' + option.radius + 'px)'
        };
        if (index === option.prepareDataMap.indexOf(option.wheelData[option.selectedIndex])) {
          style.opacity = 1;
        }
        figures.push(<figure key={'figure'+ index} style={style}>{value}</figure>)
      });
    }

    return(
      <div className={'single-wheel ' + this.props.className} ref="wheel">
        <div className="inner">
          <div className="container">
            <div className="text" ref="text">
              {figures}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WheelComponent;
