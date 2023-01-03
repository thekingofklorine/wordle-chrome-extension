
const block = document.getElementById("wordle-app-game")
if(block != null){ 
    const badge = document.createElement("p");
    badge.id = "BrianCrane"
    const button = document.createElement("BUTTON")
    var text = document.createTextNode("Refresh Guess");    
    button.className = "Key-module_key__Rv-Vp"         
    button.appendChild(text);
    button.onclick = function(){runMe()}
    badge.style.textAlign = "center"
    badge.textContent = "Click button to refresh guess"
    block.insertAdjacentElement("afterbegin", button)
    block.insertAdjacentElement("afterbegin", badge)
}else{
    console.log("was null")
}

function runMe(){
  function getWords (theUrl){
    var array = [];
    fetch(theUrl)
    .then(response => {
    if (!response.ok) {
        throw new Error(`Request failed with status ${reponse.status}`)
    }
    response.text()
    .then(t1 => {
    var wArray = t1.split("\n")
    array = wArray
    var bestWord = "bestword"
    wArray = filterArray(wArray)
    bestWord = chooseBestWord(wArray)
    document.getElementById('BrianCrane').textContent = bestWord;
    return wArray; // but we decided to return the response to the next handler
    
    function filterArray(theFullArray){
      var lettersKnown = []; //total letters known
      var lettersCorrect = [] //dont do other things when we got one right
      var docArray = []; //the phrase from the page "e absent"
      var adjustedArray = []; //words in the bank
      var fromDoc = document.getElementsByClassName("Row-module_row__dEHfN")  
    
      for(var i = 0; i < 6; i++){ //six is the number of rows
        const notChild = fromDoc[i].children
        for(var j = 0; j < 5; j++){
          const child = notChild[j].children[0].ariaLabel
          if(child.includes(" ")){
            docArray.push(child)
          }
        }
      }
      adjustedArray = [...theFullArray]
      for(var i = 0; i < docArray.length; i++){
        
        if(docArray[i].includes("absent")){
          for(var j = 0; j < adjustedArray.length; j++){
            if(adjustedArray[j].includes(docArray[i].charAt(0))){ //char at 0 is the letter, if absent but its there remove it
              adjustedArray.splice(j,1)
              j--
            }
          }
        }
        if(docArray[i].includes("correct")){
          if(!lettersKnown.includes(docArray[i].charAt(0))){ //push every new letter into
            lettersKnown.push(docArray[i].charAt(0))
          }
          for(var k = 0; k < adjustedArray.length; k++){
            if(adjustedArray[k].charAt(i % 5) != docArray[i].charAt(0)){  // if the letter in the master list at modulo 5 is equal to the first thing
              adjustedArray.splice(k,1)
              k--
            } //char at 0 is the letter, if absent but its there remove it
          }
        }
        if(docArray[i].includes("present")){
          if(!lettersKnown.includes(docArray[i].charAt(0))){ //push every new letter into
            lettersKnown.push(docArray[i].charAt(0))
          }
          for(var l = 0; l < adjustedArray.length; l++){
            if(adjustedArray[l].includes(docArray[i].charAt(0))){
              if(adjustedArray[l].charAt(i % 5) == docArray[i].charAt(0)){  // if the letter in the master list at modulo 5 is equal to the first thing
                adjustedArray.splice(l,1)
                l--
              } 
            } else{  //if it doenst have the letter
              adjustedArray.splice(l,1)
              l--
            }
            //char at 0 is the letter, if absent but its there remove it
          }
        }
      }

      if(lettersKnown.length == 5) {
        for(var j = 0; j < adjustedArray.length; j++){  //if we have all 5 letters eliminate the rest
          if(!adjustedArray[j].includes(lettersKnown[0]) || 
          !adjustedArray[j].includes(lettersKnown[1]) || 
          !adjustedArray[j].includes(lettersKnown[2]) || 
          !adjustedArray[j].includes(lettersKnown[3]) || 
          !adjustedArray[j].includes(lettersKnown[4])){
            adjustedArray.splice(j,1)
            j--
          }
        }
      }

      return adjustedArray
    }
  
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
  var wordArray = getWords(url);
}

