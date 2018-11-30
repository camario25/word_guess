var wordApi = "http://app.linkedin-reach.io/words";
var levels = {
  1: '01',
  2: '02',
  3: '03',
  4: '04',
  5: '05',
  6: '06',
  7: '07',
  8: '08',
  9: '09',
  10: '10'
}
var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y','Z'];

var imageUrls = ["images/loss.png", "images/hair.png", "images/lashes.png", "images/ears.png", "images/nose.png", "images/eyes.png"];

$(document).ready(function() {
  levelDropdown();
  $('#face').html('<img src="images/head.png" alt="head">');
});

function levelDropdown() {
  for (var level in levels) {
    $('#level').append('<option value="' + level + '">' + levels[level] + '</option>');
  }
}

function countDown() {
  var counter = $('#counter').html();
  $('#counter').html(--counter);
}

function appendLines(length) {
  $('#guessWord').append('Current Word:  ')
  while (length > 0) {
  $('#guessWord').append('<span> _  </span>');
  length--;
    }
}
  
$('form').on('submit', function(e) {
  e.preventDefault();
  var level = parseInt($('#level').val());

  $.ajax({
    method: 'GET',
    url: wordApi,
    data: {
      difficulty: level,
      count: 100
    },
    success: wordsFetched,
    error: wordError
  });
});

function wordsFetched (response) {
  var checkWordArr = [];
  $('#guessWord').empty();
  $('#counter').empty();
  $('#alphabet').empty();
  $('#entireWord').html('<p>You can guess the whole word here:  <input type="text" id="fullWord"><button id="submitFullWord">submit</button>')
  alphabet.forEach(function (el) {
    $('#alphabet').append('<button class="btn" value="' + el + '">' + el + '</button>')
  });
  $('#counterDiv').html('<p>Incorrect Guesses Remaining:  <span id="counter"></span></p>');
  $('#counter').append(6);
  $('#usedLettersDiv').html('<p>Incorrect Letters:  <span id="usedLetter"></span></p>');
  var wordsArr = response.split('\n');
  var wordSelect = wordsArr[randomInt(101)];
  var wordSplitArr = wordSelect.split('');
  console.log(wordSplitArr);
  appendLines(wordSplitArr.length);
  $('#submitFullWord').on('click', function () {
    var fullWordValue = $('#fullWord').val();
    if (fullWordValue === wordSelect){
      console.log(fullWordValue, wordSelect);
      $('#face').html('<img src="images/win.png">');
      $('#gameResult').html('<h2>You are the winner!</h2>');
    } else {
      countDown();
      imageSelect();
      if ($('#counter').html() === '0') {
        $('#guessWord').html('Current Word:  ' + wordSelect);
      }
    }
  });
  $('.btn').on('click', function() {
    var letter = $(this).val().toLowerCase();
    console.log(letter);
    $(this).prop('disabled', true);
    if (wordSplitArr.includes(letter)) {
      wordSplitArr.forEach(function (el, i) {
        if (el === letter) {
          checkWordArr[i] = letter;
          console.log('yes', el, checkWordArr);
          $('#guessWord :nth-child(' + (i+1) + ')').replaceWith('<span>' + el + '</span>');
          if (checkWordArr.join('') === wordSelect) {
            $('#face').html('<img src="images/win.png">');
            $('#gameResult').html('<h2>You are the winner!</h2>');
          }
        } 
      })
    } else {
      countDown();
      $('#usedLetter').append(letter + ', ');
      imageSelect();
      if ($('#counter').html() === '0') {
        $('#guessWord').html('Current Word:  ' + wordSelect);
      }
    }
  })
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function wordError (error) {
  console.log(error);
}

function imageSelect() {
  cnt = parseInt($('#counter').html());
  if ( cnt >= 0 ) {
    $('#face').html('<img src='+ imageUrls[(cnt)] +'>');
  } 
  if ( cnt === 0 ) {
    $('#gameResult').html('<h2>You lost, please try again</h2>');
  }
}