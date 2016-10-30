require('normalize.css/normalize.css');
require('styles/WheelComponent.css');
require('styles/Main.css');

import React from 'react';
import ReactDOM from 'react-dom';
import WheelComponent from './WheelComponent';

// 时钟定时器
let startClock;

/**
 * 配置项option
 * prepareCount   -- 每次准备数据的长度
 * rotateType     -- 滚轮滚动方向, 目前只支持(rotateX),只可竖直滚动
 * transformProp  -- 浏览器transform前缀,不同浏览器不同,此功能还未做
 * wheelData      -- 滚轮数据数组,保存所有滚轮的数值
 * selection      -- 默认选中项,此项优先在 WheelComponent 组件中,以 props 形式设置.
 * permitCircle   -- 允许滚轮循环,目前只有循环,(不循环功能还未做)
 */
// 年配置项
let yearOption = {
  prepareCount: 16,
  rotateType: 'rotateX',
  transformProp: 'transform',
  wheelData: ['2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020'],
  selected: '2010',
  permitCircle: true
};
let monthOption = {
  prepareCount: 16,
  rotateType: 'rotateX',
  transformProp: 'transform',
  wheelData: ['01','02','03','04','05','06','07','08','09','10','11','12'],
  selected: '1',
  permitCircle: true
};
let dateOption = {
  prepareCount: 16,
  rotateType: 'rotateX',
  transformProp: 'transform',
  wheelData: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
  selected: '5',
  permitCircle: true
};
let hourOption = {
  prepareCount: 16,
  rotateType: 'rotateX',
  transformProp: 'transform',
  wheelData: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
  selected: '11',
  permitCircle: true
};
let minuteOption = {
  prepareCount: 16,
  rotateType: 'rotateX',
  transformProp: 'transform',
  wheelData: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20',
  '21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40',
  '41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
  selected: '4',
  permitCircle: true
};
let secondOption = {
  prepareCount: 16,
  rotateType: 'rotateX',
  transformProp: 'transform',
  wheelData: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20',
  '21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40',
  '41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
  selected: '56',
  permitCircle: true
};
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: '2016',
      month: '9',
      date: '18',
      hour: '11',
      minute: '30',
      second: '10'
    }
  }
  componentDidMount() {
    this.updateDate();
  }

  // 更新时间
  updateDate() {
    let date = new Date();
    let y = date.getFullYear().toString(),
      mo = date.getMonth() + 1 > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString() ,
      d = date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate().toString(),
      h = date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours().toString(),
      mi = date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes().toString(),
      s = date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds().toString();
    this.setState({
      year: y,
      month: mo,
      date: d,
      hour: h,
      minute: mi,
      second: s
    });
  }
  changeYear(year) {
    this.setState({
      year: year
    })
  }
  changeMonth(month) {
    this.setState({
      month: month
    })
  }
  changeDate(date) {
    this.setState({
      date: date
    })
  }
  changeHour(hour) {
    this.setState({
      hour: hour
    })
  }
  changeMinute(minute) {
    this.setState({
      minute: minute
    })
  }
  changeSecond(second) {
    this.setState({
      second: second
    })
  }

  // 点击更新按钮更新时间
  handleClick() {
    this.updateDate();
  }

  // 时钟按钮功能
  handleClock(){
    let clockDOM = ReactDOM.findDOMNode(this.refs.clock);
    name = clockDOM.innerHTML;
    if(name === '时钟') {
      startClock = setInterval(function() {
        this.updateDate();
      }.bind(this),1000);
      clockDOM.innerHTML = '取消';
    } else {
      clockDOM.innerHTML = '时钟';
      clearInterval(startClock);
    }
  }

  render() {
    return(
      <div className="time-wheel">
        <div>
          <span className="time-text">{this.state.year}年{this.state.month}月{this.state.date}日 {this.state.hour}:{this.state.minute}:{this.state.second}</span>
        </div>
        <div>
          <WheelComponent className="year-wheel" option={yearOption} selection={this.state.year} onChange={this.changeYear.bind(this)}/>
          <WheelComponent className="month-wheel" option={monthOption} selection={this.state.month} onChange={this.changeMonth.bind(this)}/>
          <WheelComponent className="date-wheel" option={dateOption} selection={this.state.date} onChange={this.changeDate.bind(this)}/>
          <WheelComponent className="hour-wheel" option={hourOption} selection={this.state.hour} onChange={this.changeHour.bind(this)}/>
          <WheelComponent className="minute-wheel" option={minuteOption} selection={this.state.minute} onChange={this.changeMinute.bind(this)}/>
          <WheelComponent className="second-wheel" option={secondOption} selection={this.state.second} onChange={this.changeSecond.bind(this)}/>
        </div>
        <div>
          <button onClick={this.handleClick.bind(this)}>刷新</button>
          <button onClick={this.handleClock.bind(this)} ref="clock">时钟</button>
        </div>
      </div>
    )
  }
}

export default AppComponent;
