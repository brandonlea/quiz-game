let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let timerInterval;
let timeLeft = 30;
let startTime;

function StartQuiz() {
  const category = document.getElementById("category-select").value;
  const difficulty = document.getElementById("difficulty-select").value;
  
  hideScreen("welcome-screen");
  showScreen("quiz-screen");
  
  getQuizData(category, difficulty);
}

function showScreen(id) {
  const screen = document.getElementById(id);
  screen.classList.add("active");
}

function hideScreen(id) {
  const screen = document.getElementById(id);
  screen.classList.remove("active");
}

async function getQuizData(category, difficulty) {
  try {
    const api = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}`;
    const response = await fetch(api);
    const data = await response.json();
    
    if (data.response_code === 0) {
      questions = data.results.map(formatQuestion);
      currentQuestionIndex = 0;
      score = 0;
      updateScore();
      renderQuestion();
    } else {
      alert("Failed to load questions. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    alert("Error loading quiz. Please check your connection and try again.");
  }
}

function formatQuestion(questionData) {
  const answers = [...questionData.incorrect_answers, questionData.correct_answer];
  shuffleArray(answers);
  
  return {
    question: decodeHtml(questionData.question),
    answers: answers,
    correct: questionData.correct_answer,
    category: questionData.category,
    difficulty: questionData.difficulty
  };
}

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }
  
  const question = questions[currentQuestionIndex];
  const questionText = document.getElementById("question-text");
  const answerButtons = document.getElementById("answer-buttons");
  const questionNumber = document.getElementById("question-number");
  
  questionText.textContent = question.question;
  questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
  
  answerButtons.innerHTML = "";
  
  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.textContent = decodeHtml(answer);
    button.onclick = () => selectAnswer(answer);
    answerButtons.appendChild(button);
  });
  
  startTimer();
}

function selectAnswer(selectedAnswer) {
  const question = questions[currentQuestionIndex];
  const answerButtons = document.getElementById("answer-buttons").children;
  const nextButton = document.getElementById("next-btn");
  
  clearInterval(timerInterval);
  
  for (let button of answerButtons) {
    button.disabled = true;
    if (button.textContent === decodeHtml(question.correct)) {
      button.classList.add("correct");
    } else if (button.textContent === decodeHtml(selectedAnswer) && selectedAnswer !== question.correct) {
      button.classList.add("incorrect");
    }
  }
  
  if (selectedAnswer === question.correct) {
    score += 1;
    updateScore();
  }
  
  nextButton.style.display = "block";
  nextButton.onclick = nextQuestion;
}

function calculateScore() {
  return 1;
}

function nextQuestion() {
  currentQuestionIndex++;
  const nextButton = document.getElementById("next-btn");
  nextButton.style.display = "none";
  
  if (currentQuestionIndex < questions.length) {
    renderQuestion();
  } else {
    endQuiz();
  }
}

function startTimer() {
  timeLeft = 30;
  startTime = Date.now();
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = timeLeft;
  
  if (timeLeft <= 10) {
    timerElement.classList.add("warning");
  } else {
    timerElement.classList.remove("warning");
  }
}

function timeUp() {
  const answerButtons = document.getElementById("answer-buttons").children;
  const nextButton = document.getElementById("next-btn");
  
  for (let button of answerButtons) {
    button.disabled = true;
    if (button.textContent === decodeHtml(questions[currentQuestionIndex].correct)) {
      button.classList.add("correct");
    }
  }
  
  nextButton.style.display = "block";
  nextButton.onclick = nextQuestion;
}

function updateScore() {
  document.getElementById("score").textContent = score;
}

function endQuiz() {
  const finalScore = document.getElementById("final-score");
  const correctAnswers = document.getElementById("correct-answers");
  const timeTaken = document.getElementById("time-taken");
  
  finalScore.textContent = score;
  correctAnswers.textContent = score / 10;
  
  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  timeTaken.textContent = totalTime;
  
  hideScreen("quiz-screen");
  showScreen("results-screen");
  
  const playAgainBtn = document.getElementById("play-again-btn");
  playAgainBtn.onclick = () => {
    hideScreen("results-screen");
    showScreen("welcome-screen");
    resetQuiz();
  };
}

function resetQuiz() {
  currentQuestionIndex = 0;
  questions = [];
  score = 0;
  timeLeft = 30;
  clearInterval(timerInterval);
  
  updateScore();
  updateTimerDisplay();
  
  const nextButton = document.getElementById("next-btn");
  nextButton.style.display = "none";
}