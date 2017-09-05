require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数， 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

/*
* 获取区间内的一个随机值
* */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}
/*
* 获取0-30之间的任意一个正负值
* */
function get30DegRandom(){
  return Math.random() > 0.5 ? '' : '-' + Math.ceil(Math.random() * 30)
}

//构建单幅画的组件
let ImgFigure = React.createClass({
  /*
  * imgFigure的点击函数
  */
  handleClick : function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },
  render : function(){
    var styleObj = {};
    // 如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度有值 并且不为0，添加旋转角度
    if (this.props.arrange.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    //获取imgfigure的图片样式名称
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
});

let GalleryByReactApp = React.createClass({
  Constant : {
    centerPos :{//居中位置图片的取值范围
      left : 0,
      right:0
    },
    hPosRange : { //水平方向的取值范围
      leftSecX : [0 , 0],
      rightSecX : [0 ,0],
      y:[0 , 0]
    },
    vPosRange : {// 垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  },

  /*
  * 翻转图片
  * index输入当前被执行inverse操作的图片对应的图片信息数组的index值
  * 本函数是一个闭包函数 ，其内renturn 一个真正被执行行的函数
  * */
  inverse : function (index) {
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }.bind(this)
  },

  /*
  * 重新布局所有图片
  * 指定居中排布哪一张图片
  * */
  rearrange : function(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [], //用来存储我们布局在上侧图片的状态信息
        topImgNum = Math.ceil(Math.random() * 2), //取一个或者不取 值为0或1
        topImgSpliceIndex = 0, //用来标记布局在上侧的图是在数组的哪个位置
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);  //中心图片的状态

        //centerIndex居中图片的状态信息
        imgsArrangeCenterArr[0] = {
          pos : centerPos,
          rotate : 0,
          isCenter : true
        }

        //取出要布局上侧图片的状态信息
        topImgSpliceIndex = Math.ceil( Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value,index){
          imgsArrangeTopArr[index] = {
            pos : {
              top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
              left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate: get30DegRandom(),
            isCenter : false
          }
        });

        //布局位于左右两侧的图片
        for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
          var hPosRangeLORX = null;

          //前半部分布局在左边 右半部分布局在右边
          if(i < k){
            hPosRangeLORX = hPosRangeLeftSecX;
          }else{
            hPosRangeLORX = hPosRangeRightSecX;
          };

          imgsArrangeArr[i] = {
            pos : {
              top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
              left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
            },
            rotate : get30DegRandom(),
            isCenter : false
          };
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);  //位于上侧的图片信息放到数组中
        };
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]); //位于中心的图片信息放回到数组中

        this.setState({
          imgsArrangeArr:imgsArrangeArr
        });
  },
  /*
   * 利用arrange函数， 居中对应index的图片
   * @param index, 需要被居中的图片对应的图片信息数组的index值
   * @returns {Function}
   */
  center : function(index){
    return function (){
      this.rearrange(index)
    }.bind(this);
  },
  getInitialState : function(){
    return {
      imgsArrangeArr : [ //初始化状态对象
        /*{
          pos : {
            left : '0',
            top : '0'
          },
          rotate : 0, //旋转角度
          isInverse : false, //用来表示图片的正反面 false 正面
          isCenter : false //图片是否居中 fase不居中
        }*/
      ]
    }
  },
  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount : function(){
    //拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage), //舞台
        stageW = stageDOM.scrollWidth,   //舞台大小
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    //拿到一个imgfigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
        left : halfStageW - halfImgW,
        top : halfStageH - halfImgH
    }

    //计算左侧 右侧区域图片的排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW *3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排位位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    //调用图片排布位置的方法
    this.rearrange(0); //指定图片数组中的第一张居中
  },
  render: function(){
    //声明两个组件用来包含所有的图片
    var controllerUnits = [],
    imgFigures = [];

    imageDatas.forEach(function(item,index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos : { //初始化状态对象，定位到左上角
            left : 0,
            top : 0
          },
          rotate : 0,
          isInverse : false
        }
      }
      imgFigures.push(<ImgFigure key={index} data={item} ref={'imgFigure' + index} arrange = {this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this))

    return(
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

ReactDOM.render(<GalleryByReactApp /> , document.getElementById('app'));
module.exports = GalleryByReactApp;

