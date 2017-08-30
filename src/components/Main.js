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

//构建单幅画的组件
let ImgFigure = React.createClass({
  render : function(){
    return(
      <figure>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2>{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
});

let GalleryByReactApp = React.createClass({
  render: function(){
    //声明两个组件用来包含所有的图片
    var controllerUnits = [],
    imgFigures = [];

    imageDatas.forEach(function(item,index){
      imgFigures.push(<ImgFigure key={index} data={item}/>);
    })

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

