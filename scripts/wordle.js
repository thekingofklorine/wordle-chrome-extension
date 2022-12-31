

function getWords (theUrl){
  var array = [];
  // console.log(theUrl)
  fetch(theUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${reponse.status}`)
    }
    response.text()
    .then(t1 => {
    //console.log({ t1 }); // after calling text() we can see the result here
    var wArray = t1.split("\n")
    array = wArray
    var bestWord = "bestword"
    //
// this is where you take wArray and change it based on the criteria
    // 
    //this is where you take the possible words and create a best word
    bestWord = chooseBestWord(wArray)
    console.log(bestWord)
    document.getElementById('guess').textContent = bestWord;
    return wArray; // but we decided to return the response to the next handler
    })
    return response
  })
  .catch(error => console.log(error))
  return array;
}

function chooseBestWord(array){
  var word ="default"
  const letterArray = []
  for(var i = 0; i < 26; i++){
    var count = 0;
    for(var j = 0; j < array.length; j++){
      var chr = String.fromCharCode(97 + i)
      if(array[j].includes(chr)){
        count++
      }
    }
    letterArray.push(count)
  }
  var letterArrayOrder = [...letterArray]
  letterArrayOrder.sort(function(a, b){return b - a});
  var biggest = letterArrayOrder[0]
  var buildWord = getTheLetter(biggest)//this tosses in the first letter
  var lap = 0
  while(buildWord.length < 5){
    var next = letterArrayOrder[lap+1]
    var letter = getTheLetter(next) 
    if(isThereAWord(buildWord, letter)){
      buildWord = buildWord + letter
    }
    lap++
  }

  word = getWord(buildWord)
  return word

  function getTheLetter(number){
    var guess = 0
    for(var j = 0; j < 26; j++){
      if (letterArray[j] == number){
        guess = j
        break
      }
    }
    return String.fromCharCode(97 + guess)
  }

  function isThereAWord(theWord, letter){  //see if letters can make a word from list
    var newArray = [...array]
    for(var i = 0; i < theWord.length; i++){
      for(var j = 0; j < newArray.length; j++){
        if(!newArray[j].includes(theWord[i])){
          newArray.splice(j,1)
          j--
          continue
        }
        if(i == 0 && !newArray[j].includes(letter)){
          newArray.splice(j,1)
          j--
        }
      }
      if(newArray.length == 0){ //if there is no more words left its bad
        return false
      }
    }
    return true
  }

  function getWord(theWord){
    var newArray = [...array]
    for(var i = 0; i < theWord.length; i++){
      for(var j = 0; j < newArray.length; j++){
        if(!newArray[j].includes(theWord[i])){
          newArray.splice(j,1)
          j--
          continue
        }
        if(i == 0 && !newArray[j].includes(letter)){
          newArray.splice(j,1)
          j--
        }
      }
      if(newArray.length == 0){ //if there is no more words left its bad
        return "bad maths"
      }
    }
    return newArray[0]
  }
}

var url = "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words"
console.log(url)
var wordArray = getWords(url);
//console.log(wordArray.length)
//console.log(wordArray)



     