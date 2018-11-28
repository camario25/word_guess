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
  while (length > 0) {
  $('#guessWord').append(' _  ');
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
  $('#counter').append(6);
  alphabet.forEach(function (el) {
    console.log(el);
    $('#alphabet').append('<button>' + el + '</button>')
  });
  var wordsArr = response.split('\n');
  console.log(wordsArr);
  var wordSelect = wordsArr[randomInt(101)];
  console.log(wordSelect);
  var wordSplitArr = wordSelect.split('');
  console.log(wordSplitArr);
  appendLines(wordSplitArr.length);
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function wordError (error) {
  console.log(error);
}