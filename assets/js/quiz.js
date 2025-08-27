//Main Game Logic
function quiz() {

}

// Start the quiz
function startQuiz(level, category) {

}

// Start the timer
function startTimer() {

}

// Add score up
function addScore(currentScore) {

}

// Getting data
async function getQuizData(level, category) {
    const url = "https://opentdb.com/api.php?amount=10&category=9";
   
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error(error.message);
      }
}

function renderButton(text) {
  var btn = document.createElement("button");

  btn.innerText = text;
  btn.className += "t";

  return btn;
}