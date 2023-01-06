To Upload the extension to chrome:
First go to chrome://extensions/ in chrome.
In the top right toggle the button for Developer Mode to on
![develop screenshot](img/develop.PNG?raw=true "Develop Screenshot")
Then additinal options should pop up on the top left side, click on Load Unpacked
![unpack screenshot](img/unpack.PNG?raw=true "Unpack Screenshot")
Choose the folder from wherever it was downloaded. You should see a Green W in your extensions.
![extension screenshot](img/extension.PNG?raw=true "Extension Screenshot")
Open up wordle, and play

To use:
When you want help with, click on the refresh button and it will give you a word
![guess screenshot](img/guess.PNG?raw=true "Guess Screenshot")
After submitting a new response if you want help again, hit the button

Explanation:
WHen you click the refresh guess button what the algorithm does is run through the guesses that have been made so far and narrows down the word bank to words that fit the clues given, whether something is correct, present, or absent. Then it passes the narrowed down list of words, then it chooses which word has the most common letters, and passes it back into the webpage. This approach works really well in hard mode, where you have to use all the letters you have guessed thus far. It doesn't guarantee a correct guess in 6 however. For example if your word is layer, it will guess the la and er in 4 guesses, but then there are 6 options left among them "laker", "lamer", and "laver". It will guess laker, then lamer and then you are out of guesses. If you inspect and open up the console it should show you what words are options, so you can see if you are running into that scenario. If I wanted to update my code to not work in hard mode, and but address the shortcoming, I could create a way of measuring which words if guessed narrow down the most words. That way it will not get stuck eliminating one letter at a time towards the end.