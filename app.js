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
  $('#playerName').on('keyup', function() { //must have name to play
    if ($('#playerName').val() !== '') {
      $('#getLevel').prop('disabled', false);
    } else if ($('#playerName').val() === '') {
      $('#getLevel').prop('disabled', true);
    }
  })
  leaderBoard();
});
  
$('form').on('submit', function(e) {
  e.preventDefault();
  var level = parseInt($('#level').val());

  $.ajax({
    method: 'GET',
    url: wordApi,
    data: {
      difficulty: level,
      count: 200
    },
    success: wordsFetched,
    error: wordError
  });
});

function wordsFetched (response) {
  gameStart(); //loads up html divs for playing
  var checkWordArr = [];
  var wordsArr = response.split('\n');
  var wordSelect = wordsArr[randomInt(101)];
  var wordSplitArr = wordSelect.split('');
  appendLines(wordSplitArr.length);  //makes the blank undelines the length of the word
  setPlayer(); //saves player to sessionStorage object
  var nameSession = sessionStorage.getItem('playerName');
  var scoreSession = sessionStorage.getItem('playerScore');
  $('#currentScore').html('Current Score for ' + nameSession + ' is: ' + scoreSession);
  //validation that only letters are used as inputs
  $('#fullWord').keyup(function () { 
    this.value = this.value.replace(/[^A-Za-z]/, '');
    enableFullSubmitButton();
  })
  $('#submitFullWord').on('click', function () {
    var fullWordValue = $('#fullWord').val().toLowerCase();
    if (fullWordValue === wordSelect){
      win(); //includes completed happy image
      $('#guessWord').html('Current Word:  ' + wordSelect);
      disableGuesses();
    } else {
      countDown();
      imageSelect(); //image responds to counter
      if ($('#counter').html() === '0') {
        $('#guessWord').html('Current Word:  ' + wordSelect);
        disableGuesses();
      }
    }
  });
  //when clicking alphabet buttons
  $('.btn').on('click', function() { 
    var letter = $(this).val().toLowerCase();
    $(this).prop('disabled', true);
    if (wordSplitArr.includes(letter)) {
      $(this).css('background-color', '#09DBA7');
      $(this).css('height', '2em');
      $(this).css('font-weight', 'bolder');
      $(this).css('border', 'solid 2px #02547D')
      //function to replace _ with letter selected
      wordSplitArr.forEach(function (el, i) { 
        if (el === letter) {
          checkWordArr[i] = letter;
          $('#guessWord :nth-child(' + (i+1) + ')').replaceWith('<span>' + el + '</span>');
          if (checkWordArr.join('') === wordSelect) {
            win();
            disableGuesses();
          }
        } 
      })
    } else {
      countDown();
      $(this).css('background-color', '#F7301B');
      $(this).css('height', '2em');
      $(this).css('font-weight', 'bolder');
      $(this).css('border', 'solid 2px #02547D')
      // add letters to wrong letter section
      $('#usedLetter').append(letter + ', '); 
      imageSelect();
      if ($('#counter').html() === '0') {
        $('#guessWord').html('Current Word:  ' + wordSelect);
        disableGuesses();
      }
    }
  })  
  $('#clearLeaders').on('click', function() {
    localStorage.clear();
    leaderBoard();
  });
}

function wordError (error) {
  $('#alert').html(error);
}

function levelDropdown() {
  for (var level in levels) {
    $('#level').append('<option value="' + level + '">' + levels[level] + '</option>');
  }
}

function gameStart() {
  $('#level').prop('disabled', true);
  $('#guessWord').empty();
  $('#counter').empty();
  $('#alphabet').empty();
  $('#gameResult').empty();
  $('#face').html('<img src="images/head.png" alt="head">');
  $('#entireWord').html('<p>You can guess the whole word here:  <input type="text" id="fullWord" title="Only English Letters Allowed"><button id="submitFullWord" disabled>submit</button>')
  //makes each letter a button
  alphabet.forEach(function (el) { 
    $('#alphabet').append('<button class="btn" value="' + el + '">' + el + '</button>')
  });
  $('#counterDiv').html('<p>Incorrect Guesses Remaining:  <span id="counter"></span></p>');
  $('#counter').append(6);
  $('#usedLettersDiv').html('<p>Incorrect Letters:  <span id="usedLetter"></span></p>');
  $('#scoreButtons').html('<button id="clearLeaders">Clear High Scores</button>');
}

function enableFullSubmitButton() {
  if ($('#fullWord').val() !== '') {
    $('#submitFullWord').prop('disabled', false);
  } else if ($('#fullWord').val() === '') {
    $('#submitFullWord').prop('disabled', true);
  }
}

//to select a random word from the dictionary response
function randomInt(max) { 
  return Math.floor(Math.random() * Math.floor(max));
}

function appendLines(length) {
  $('#guessWord').append('Current Word:  ')
  while (length > 0) {
  $('#guessWord').append('<span> _  </span>');
  length--;
    }
}

//sessionScore resets to 0 when a player enters a new name and starts play.  Does not affect localStorage or leaderBoard until game finishes.
function setPlayer() {
  player = sessionStorage.getItem('playerName');
  if ( player === $('#playerName').val()) {
    return
  } else {
    sessionStorage.clear();
    sessionStorage.setItem('playerName', $('#playerName').val());
    sessionStorage.setItem('playerScore', '0');
  }
}

function win() {
  var score = 0
  score += (parseInt($('#level').val()) * 2); //score is determined by multiplying dificulty level by two
  var totalScore = score + (parseInt(sessionStorage.getItem('playerScore')));
  sessionStorage.setItem('playerScore', totalScore);
  $('#face').html('<img src="images/win.png">');
  $('#gameResult').html('<h2>You are the winner!</h2>');
  var player = sessionStorage.getItem('playerName');
  var sessionScore = sessionStorage.getItem('playerScore');
  var localScore = localStorage.getItem(player);
  $('#currentScore').html('Current Score for ' + player + ' is ' + sessionScore);
  //allows for automatic update of high score if session score is higher
  if (parseInt(sessionScore) > parseInt(localScore) || localScore === null) {
  localStorage.setItem(player, sessionScore);
  }
  leaderBoard();
}

//creates leaderboard from information saved in localStorage
function leaderBoard() { 
  var tempArr = [];
  var leadersNames = Object.keys(localStorage);
  var leadersScores = Object.values(localStorage);
  for (var player in localStorage) {
    if (parseInt(localStorage[player]) && player !== 'length') {
      tempArr.push([player, parseInt(localStorage[player])]);
    }
  }
  var sortedArr = tempArr.sort(function(a, b) {
    return b[1] - a[1];
  });  
    $('#leaderBoard').html('<table><caption>Player High Scores</caption><thead><tr><th>Name</th><th>Points</th></tr></thead><tbody></tbody></table>')
  sortedArr.forEach(function (el) {
    $('tbody').append('<tr><td>' + el[0] + '</td><td>' + el[1] + '</td></tr>')
  })
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

function countDown() {
  var counter = $('#counter').html();
  $('#counter').html(--counter);
}


function disableGuesses() {
  $('.btn').prop('disabled', true);
  $('#fullWord').prop('disabled', true);
  $('#submitFullWord').prop('disabled', true);
  $('#level').prop('disabled', false);
}