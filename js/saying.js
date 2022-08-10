(function () {

  function Word (selector, sayings) {
    this.elem = selector.nodeType ? selector : document.querySelector(selector)
    this.sayings = (sayings || []).slice(0)
    this._listeners = {}
    return this
  }

  Word.prototype.run = function(sayings) {
    var el = this.elem
    this.sayings = sayings || this.sayings

    if (this.sayings.length) {
      var saying = this.sayings.shift().split('')
      this.text('')
      this.emit('linestart')
      this.type(saying)
    } else {
      this.stop()
    }

    return this
  }

  Word.prototype.type = function(saying) {
    var self = this
      , el = this.elem

    if ((typeof saying).toLowerCase() === 'string') {
      saying = saying.split('')
    }

    if (saying.length > 0) {
      this.text(this.text() + saying.shift())
      this.letterTimer = window.setTimeout(function () { self.type(saying) }, random_number(100, 150))
    } else {
      this.emit('linefinish')
      if (!this.sayings.length) this.emit('finish')
      this.sayingTimer = window.setTimeout(function(){ self.run() }, 3400)
    }

    this.emit('lineenter')

    return this
  }

  Word.prototype.text = function (text) {
    var el = this.elem
      , input = (el.nodeName.toLowerCase() === 'input')

    if (text === undefined) {
      return input ? el.value : el.innerHTML
    } else {
      if (input) el.value = text
      else el.innerHTML = text
      return this
    }
  }

  function random_number (min, max) {
    return Math.round(Math.random() * (max - min + 1)) + min
  }

  Word.prototype.on = function (e, fn) {
    (this._listeners[e] = this._listeners[e] || []).push(fn)
    return this
  }

  Word.prototype.emit = function (e) {
    var listeners = this._listeners[e]
      , args = [].slice.call(arguments, 1)

    if (listeners) {
      for (var i = 0, len = listeners.length; i < len; i += 1) {
        listeners[i].apply(this, args)
      }
    }

    return this
  }

  function word (selector, sayings) {
    return new Word(selector, sayings)
  }

  window.Word = word

})();

$(function () {

  var typer = $('.home-typer input')
  //输入的文字	
  var sayings = [
  "我叫米糕，是一隻帥氣的天竺鼠",
      "今年兩歲半，目前單身",
      "喜歡吃新鮮的牧草",
	  "最愛別人摸我的屁屁",
	  "渴望溫暖的抱抱",
	  "Can you give me a hug?"
    ]
    , colors = ['#FF3333', '#FF7744', '#FFAA33', '#FFCC22', '#33FFAA', '#CCFF33'] //切换的颜色设置
    , length = 0

  //变换背景颜色
  if (document.querySelector('.home-typer input')) {
    var typewriter = Word('.home-typer input', sayings)
      .on('linestart', function () {
        var demo = $('.demo');
        if (length === colors.length) length = 0;
        demo.css('background', colors[length]);
        length++;
      }).on('lineenter', function(){
        if(typeof ss_legacy == 'function') ss_legacy(typer)
      })
      .on('finish', function(){
        var demo = $('.demo')
        demo.addClass('active')
        setTimeout(function () {
          typewriter.run(sayings.slice(0))
          demo.removeClass('active')
        }, 1200)
      })

    setTimeout(function(){
      typewriter.run()
    }, 1400)

    if(typeof ss_legacy == 'function') {
      typer.keyup(function() {
        ss_legacy(typer);
      })
    }
  }
  
  function updateSlider (slideAmount) {
    var slide_amount = this.value
    $('.home-typer input').css('font-size', slide_amount+'px')
  }
})
