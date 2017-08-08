import $ from 'jquery';

import styles from '../css/index.scss';

import TextTyper from './texttyper';

let number = 0;
let _blocked = false;

/*const callback = function() {
  number++;
  const elementId = 'line' + number;
  const text = textArray[number];
  $('#app').append('<div id="' + elementId + '" class="command-line cursor-blinking"></div><br>');

  textFunctions.showText(
    '#' + elementId,
    text,
    40,
    'cursor-blinking',
    'cursor-solid',
    number >= textArray.length-1?null:callback);
};*/

$(window).on('load', function () {
  const typer = new TextTyper('#line');
  //typer.start('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', true);

  const socket = new WebSocket('ws://localhost:8081');
  const $info = $('#info');
  const $input = $('#input');
  const $inputWrapper = $('#inputWrapper');
  const $inputPrefix = $('#inputPrefix');

  const prefix = '[root@ncf-wi-12.fn.kc0] $ ';

  $inputPrefix.text(prefix);

  $(document).on('keydown', function(ev) {
    const k = ev.which || ev.keyCode;
    let cancel = false;

    if ( _blocked ) {
      cancel = true;
    } else {
      if ( k == 9 ) {
        cancel = true;
      } else if ( k == 38 ) {
        //nextHistory();
        cancel = true;
      } else if ( k == 40 ) {
        cancel = true;
      } else if ( k == 37 || k == 39 ) {
        cancel = true;
      }
    }

    if ( cancel ) {
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    }

    if ( k == 8 ) {
      const text = $input.text();
      if(text.length >= 0)
        $input.html(text.substring(0, text.length-1));
    }

    return true;
  });

  $(document).on('keypress', function(ev) {
    ev.preventDefault();
    if ( _blocked ) {
      return false;
    }

    const k = ev.which || ev.keyCode;
    if ( k == 13 ) {
      const text = $input.text().trim();
      $input.text('');
      if(text !== '') {
        _blocked = true;
        socket.send(text);
        const $echo = $('<div class="command-line-input">' + prefix + text + '</div><br>');
        $inputWrapper.before($echo);
        $inputPrefix.text('');
      }
    } else {
      const kc = String.fromCharCode(k);
      $input.text($input.text() + kc);
    }

    return true;
  });

  /*$output.onfocus = function() {
      update();
    };

    $output.onblur = function() {
      update();
    };

  window.onfocus = function() {
    $input.focus();
  };*/

  socket.onopen = function(event) {

  };
  socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const text = data.text;
    const speed = data.speed;
    const type = data.type;
    if(type === 'info') {
      number++;
      const elementId = 'line' + number;
      $info.append('<div id="' + elementId + '" class="command-line"></div><br>');
      //window.scrollTo(0,document.body.scrollHeight);
      $info.scrollTop($info[0].scrollHeight);
      typer.changeTarget('#' + elementId);
      typer.setInterval(speed);
      typer.start(text, true);
    }
    else if (type === 'console') {
      $inputWrapper.before('<div class="command-line-input">' + text + '</div><br>');
      if(_blocked) {
        $inputPrefix.text(prefix);
        _blocked = false;
      }
    }
  };
});
