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
});

function levelDropdown() {
  for (var level in levels) {
    $("#level").append('<option value="' + level + '">' + levels[level] + '</option>');
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
      count: 50
    },
    success: wordsFetched,
    error: wordError
  });
});

function wordsFetched (response) {
  console.log(response);
}

function wordError (error) {
  console.log(error);
}