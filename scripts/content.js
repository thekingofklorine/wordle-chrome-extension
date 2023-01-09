var url = "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words" //the url to get the words
const block = document.getElementById("wordle-app-game") //on start up try to look for this in html

if(block != null){                              //if that location exists place my html
    const badge = document.createElement("p");
    badge.id = "BrianCrane"
    const button = document.createElement("BUTTON")
    var text = document.createTextNode("Refresh Guess");    
    button.className = "Key-module_key__Rv-Vp"         
    button.appendChild(text);
    button.style.width = '33%'
    button.style.margin = 'auto'
    button.onclick = function(){runMe()}        //when button is pressed it runs the word algorithm
    badge.style.textAlign = "center"
    badge.textContent = "Click button to refresh guess"
    block.insertAdjacentElement("afterbegin", button)
    block.insertAdjacentElement("afterbegin", badge)
}else{                                          //if it doesn't exist the console with read an error
    console.log("was null")
}

function runMe(){                     //entered from button press

  getWords(url);                      //get the words from the url

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
    wArray = filterArray(wArray)          //pass in the initial huge array recive the narrowed down array
    bestWord = chooseBestWord(wArray)             //take your array and choose the most common word
    document.getElementById('BrianCrane').textContent = bestWord;   //replace the HTML text with the best word
    // return wArray; // but we decided to return the response to the next handler
    
    function filterArray(theFullArray){
      var lettersKnown = []; //total letters known (when it reaches 5 we remove all other letters)
      var docArray = []; //the phrase from the page "e absent" for example
      var adjustedArray = [...theFullArray]; //words in the bank
      var fromDoc = document.getElementsByClassName("Row-module_row__pwpBq")  //get the info from the page
    
      for(var i = 0; i < 6; i++){                         //six is the number of rows
        const notChild = fromDoc[i].children
        for(var j = 0; j < 5; j++){
          const child = notChild[j].children[0].ariaLabel //picks out the info we want to use
          if(child.includes(" ")){      //if the row has not been guessed yet there is no space, we only want guessed rows
            docArray.push(child)
          }
        }
      }

      for(var i = 0; i < docArray.length; i++){
        if(docArray[i].includes("absent")){       //greyed out letters are absent
          for(var j = 0; j < adjustedArray.length; j++){
            if(adjustedArray[j].includes(docArray[i].charAt(0))){ //char at 0 is the letter, if absent but its there remove it
              adjustedArray.splice(j,1)
              j--     //since we removed an index in the array, we must adjust the count
            }
          }
        }
        if(docArray[i].includes("correct")){
          var myLetter = docArray[i].charAt(0) //the letter guesesed is stored at beginning "e correct" 
          if(!lettersKnown.includes(myLetter)){ //check if its in letters known
            lettersKnown.push(myLetter)
          }
          for(var k = 0; k < adjustedArray.length; k++){
            if(adjustedArray[k].charAt(i % 5) != myLetter){  // % 5 of the docArray index gives us which spot the letter was in
              adjustedArray.splice(k,1)
              k--
            }
          }
        }
        if(docArray[i].includes("present")){
          var myLetter = docArray[i].charAt(0) //the letter guesesed is stored at beginning "e present" 
          if(!lettersKnown.includes(myLetter)){ //push every new letter into
            lettersKnown.push(myLetter)
          }
          for(var l = 0; l < adjustedArray.length; l++){
            if(adjustedArray[l].includes(myLetter)){
              if(adjustedArray[l].charAt(i % 5) == myLetter){  // if its in the spot that is bad
                adjustedArray.splice(l,1)
                l--
              } 
            } else{  //if it doenst have the letter
              adjustedArray.splice(l,1)
              l--
            }
          }
        }
      }

      if(lettersKnown.length == 5) {
        for(var j = 0; j < adjustedArray.length; j++){  //if we have all 5 letters eliminate the rest of the letters
          if(
          !adjustedArray[j].includes(lettersKnown[0]) || 
          !adjustedArray[j].includes(lettersKnown[1]) || 
          !adjustedArray[j].includes(lettersKnown[2]) || 
          !adjustedArray[j].includes(lettersKnown[3]) || 
          !adjustedArray[j].includes(lettersKnown[4])){
            adjustedArray.splice(j,1)
            j--
          }
        }
      }
      console.log(adjustedArray)
      return adjustedArray
    }
  
  })
      return response
      })
      .catch(error => console.log(error))
      return array;
  }
  
  function chooseBestWord(array){
    var word ="default"           //if there is an issue it will return default
    const letterArray = []
    for(var i = 0; i < 26; i++){
      var count = 0;
      for(var j = 0; j < array.length; j++){
        var chr = String.fromCharCode(97 + i) //this is how to get iterate a through z
        if(array[j].includes(chr)){   //we are counting the how many words use each letter
          count++
        }
      }
      letterArray.push(count)
    }
    var letterArrayOrder = [...letterArray]   //we make a copy of the count
    letterArrayOrder.sort(function(a, b){return b - a}); //and sort from highest to lowest
    var biggest = letterArrayOrder[0]    //the first is the most common letter
    var buildWord = getTheLetter(biggest)//this tosses in the letter to our options, it checks the two arrays against each other
    var lap = 0                          //this is to keep track of which is the next letter to check since we will be skipping some
    while(buildWord.length < 5){         //wordle is 5 letters long
      var next = letterArrayOrder[lap+1]
      var letter = getTheLetter(next) 
      if(isThereAWord(buildWord, letter)){    //checks to see if there is a word that contains all the letters added so far and the next most common one
        buildWord = buildWord + letter 
      }
      lap++
    }
  
    word = getWord(buildWord)  //we get the 5 letters that are most common and make a word in most common order, this unscrambles it
    return word
  
    function getTheLetter(number){  
      var guess = 0
      for(var j = 0; j < 26; j++){
        if (letterArray[j] == number){  //iterate through the alpha order and if the count of that order is the same
          guess = j
          break
        }
      }
      return String.fromCharCode(97 + guess)   //we return the index converted to a char
    }
  
    function isThereAWord(theWord, letter){  //see if letters can make a word from list
      var newArray = [...array]
      for(var i = 0; i < theWord.length; i++){
        for(var j = 0; j < newArray.length; j++){
          if(!newArray[j].includes(theWord[i])){  //if the array doesnt include the letters so far 
            newArray.splice(j,1)
            j--
            continue
          }
          if(i == 0 && !newArray[j].includes(letter)){ //and the new letter
            newArray.splice(j,1)
            j--
          }
        }
        if(newArray.length == 0){ //there is no more words left so the combo is bad
          return false
        }
      }
      return true //if there are words remaining we are good to go
    }
  
    function getWord(theWord){
      var newArray = [...array]
      for(var i = 0; i < theWord.length; i++){
        for(var j = 0; j < newArray.length; j++){ //same process as is there a word
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
        if(newArray.length == 0){ //if there is no more words left its bad previous function failed
          return "bad maths"
        }
      }
      return newArray[0]    //returns the first of the leftover words
    }
  }
}

