$(function(){

$('.slider-wrapper').slick({
  adaptiveHeight: false,
  // 自動再生するか [初期値:false]
  autoplay: true
  // 自動再生で切り替えする時間(ミリ秒) [初期値:3000]
});

$('#container').masonry({
    itemSelector: '.item',
    columnWidth: 180, 
    isFitWidth: true  //親要素の幅に合わせてカラム数を自動調整
  });


});

