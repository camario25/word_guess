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
$(document).ready(function() {
  levelDropdown();
  $('#counter').append(6);
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
  var wordsArr = response.split('\n');
  console.log(wordsArr);
  var wordSelect = wordsArr[randomInt(101)];
  console.log(wordSelect);
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function wordError (error) {
  console.log(error);
}