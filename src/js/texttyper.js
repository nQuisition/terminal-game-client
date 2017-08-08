import $ from 'jquery';

var defaultOptions = {
  interval: 40,
  blinkingInterval: 1.0,
  hasCursor: true
};

export default class TextTyper {
  constructor(target, options) {
    this.options = {...defaultOptions, ...options};
    this.$target = $(target);
    this.$textTarget = $('<span></span>');
    this.$target.append(this.$textTarget);
    this.typing = false;
  }

  initCursor() {
    if(!this.options.hasCursor)
      return;
    this.$cursor = $('<span>', {'id' : 'infoCursor', 'class' : 'typer-cursor'});
    this.$cursor.html('&nbsp;');
  }

  setInterval(interval) {
    this.options.interval = interval;
  }

  changeTarget(target) {
    if(this.nextTimeout)
      clearTimeout(this.nextTimeout);
    this.$target.children('#infoCursor').remove();
    //this.$target.last().remove();
    this.$target = $(target);
    this.$textTarget = $('<span></span>');
    this.$target.append(this.$textTarget);
  }

  start(message, clear) {
    if(clear)
      this.$textTarget.text('');
    this.message = message;
    this.position = 0;
    this.initCursor();
    this.$target.append(this.$cursor);
    if(this.options.interval === 0) {
      this.$textTarget.text(this.message);
      //this.$target.append(this.$cursor);
      this.typing = false;
    }
    else {
      this.$cursor.removeClass('typer-cursor');
      this.$cursor.addClass('typer-cursor-solid');
      this.typing = true;
      this.showTextRecursive('');
    }
  }

  showTextRecursive(messageSoFar) {
    if (this.position < this.message.length) {
      //$(target).append(message[index++]);
      this.typing = true;
      messageSoFar += this.message[this.position++];
      this.$textTarget.text(messageSoFar);
      /*if(this.options.hasCursor)
        this.$target.append(this.$cursor);*/
      this.nextTimeout = setTimeout(function () { this.showTextRecursive(messageSoFar); }.bind(this), this.options.interval);
    }
    else {
      this.$cursor.removeClass('typer-cursor-solid');
      this.$cursor.addClass('typer-cursor');
      this.typing = false;
    }
    /*else {
      if(typingClass)
        $(target).removeClass(typingClass);
      //TODO ugh
      if(defaultClass)
        $(target).addClass(defaultClass);
      if(typeof callback === 'function') {
        if(defaultClass)
          $(target).removeClass(defaultClass);
        setTimeout(function () { callback() }, 0);
      }
    }*/
  }
}
