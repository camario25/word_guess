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
  var score = 0;
  $('#level').prop('disabled', true);
  $('#guessWord').empty();
  $('#counter').empty();
  $('#alphabet').empty();
  $('#face').html('<img src="images/head.png" alt="head">');
  $('#entireWord').html('<p>You can guess the whole word here:  <input type="text" id="fullWord" title="Only English Letters Allowed"><button id="submitFullWord" disabled>submit</button>')
  alphabet.forEach(function (el) {
    $('#alphabet').append('<button class="btn" value="' + el + '">' + el + '</button>')
  });
  $('#counterDiv').html('<p>Incorrect Guesses Remaining:  <span id="counter"></span></p>');
  $('#counter').append(6);
  $('#usedLettersDiv').html('<p>Incorrect Letters:  <span id="usedLetter"></span></p>');
  $('#scoreButtons').html('<button id="saveScore">Save Your Score</button><button id="clearLeaders">Clear High Scores</button>');
  var wordsArr = response.split('\n');
  var wordSelect = wordsArr[randomInt(101)];
  var wordSplitArr = wordSelect.split('');
  console.log(wordSplitArr);
  appendLines(wordSplitArr.length);
  setPlayer();
  
  $('#fullWord').keyup(function () {
    this.value = this.value.replace(/[^A-Za-z]/, '');
    enableFullSubmitButton();
  })
  $('#submitFullWord').on('click', function () {
    var fullWordValue = $('#fullWord').val().toLowerCase();
    if (fullWordValue === wordSelect){
      console.log(fullWordValue, wordSelect);
      $('#face').html('<img src="images/win.png">');
      $('#gameResult').html('<h2>You are the winner!</h2>');
      score += (parseInt($('#level').val()) * 2);
      var totalScore = score + (parseInt(sessionStorage.getItem('playerScore')));
      sessionStorage.setItem('playerScore', totalScore);
      console.log(score, totalScore);
      disableGuesses();
    } else {
      countDown();
      imageSelect();
      if ($('#counter').html() === '0') {
        $('#guessWord').html('Current Word:  ' + wordSelect);
        disableGuesses();
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
            score += (parseInt($('#level').val()) * 2);
            // sessionScore += score;
            var totalScore = score + parseInt(sessionStorage.getItem('playerScore'));
            console.log(score, sessionScore, totalScore);
            sessionStorage.setItem('playerScore', totalScore);
            disableGuesses();
          }
        } 
      })
    } else {
      countDown();
      $('#usedLetter').append(letter + ', ');
      imageSelect();
      if ($('#counter').html() === '0') {
        $('#guessWord').html('Current Word:  ' + wordSelect);
        disableGuesses();
      }
    }
  })
  $('#saveScore').on('click', function() {
    player = sessionStorage.getItem('playerName');
    score = sessionStorage.getItem('playerScore');
    window.localStorage.setItem(player, score);
  });
  $('#clearLeaders').on('click', function() {
    localStorage.clear();
  });
}





function enableFullSubmitButton() {
  if ($('#fullWord').val() !== '') {
    $('#submitFullWord').prop('disabled', false);
  } else if ($('#fullWord').val() === '') {
    $('#submitFullWord').prop('disabled', true);
  }
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function setPlayer() {
  player = sessionStorage.getItem('playerName');
  if ( player === $('#playerName').val()) {
    return
  } else {
    sessionStorage.clear();
    sessionStorage.setItem('playerName', $('#playerName').val());
  
  console.log(sessionStorage.getItem('playerName'));
  }
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

function disableGuesses() {
  $('.btn').prop('disabled', true);
  $('#submitFullWord').prop('disabled', true);
  $('#level').prop('disabled', false);
}