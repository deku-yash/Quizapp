document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const quizScreen = document.getElementById("quiz-screen");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const nextBtn = document.getElementById("next-btn");
    const resultScreen = document.getElementById("result-screen");
    const scoreText = document.getElementById("score-text");
    const restartBtn = document.getElementById("restart-btn");

    let quizData = [];
    let currentQuestionIndex = 0;
    let score = 0;

    async function fetchQuizData() {
        try {
            const response = await fetch("quiz-data.json");
            quizData = await response.json();
            console.log("Fetched Quiz Data:", quizData);

            if (quizData.length === 0) {
                console.error("Quiz Data is empty! Check if quiz-data.json is loading correctly.");
            }
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        }
    }

    async function startQuiz() {
        console.log("Starting Quiz...");
        startBtn.classList.add("hidden"); 
        resultScreen.classList.add("hidden"); 
        quizScreen.classList.remove("hidden"); 
        
        if (quizData.length === 0) {
            await fetchQuizData(); // Ensure quiz data is loaded
        }

        currentQuestionIndex = 0;
        score = 0;
        showQuestion();
    }

    function showQuestion() {
        if (currentQuestionIndex >= quizData.length) {
            showResult();
            return;
        }

        const currentQuestion = quizData[currentQuestionIndex];

        if (!currentQuestion || !currentQuestion.question || !currentQuestion.options) {
            console.error("Invalid question data:", currentQuestion);
            return;
        }

        let correctAnswer = currentQuestion.correctAnswer || currentQuestion.correct; // ✅ Fix

        if (!correctAnswer) {
            console.error("Error: Missing correct answer field in question!", currentQuestion);
            return;
        }

        console.log("Displaying question:", currentQuestion.question);
        questionText.innerText = currentQuestion.question;

        optionsContainer.innerHTML = ""; 
        currentQuestion.options.forEach((option) => {
            let button = document.createElement("button");
            button.innerText = option;
            button.classList.add("option-btn");

            button.addEventListener("click", () => selectAnswer(button, correctAnswer)); 
            optionsContainer.appendChild(button);
        });

        nextBtn.classList.add("hidden");
    }

    function selectAnswer(button, correctAnswer) { // ✅ Corrected to receive correctAnswer as argument
        let selectedAnswer = button.innerText.trim();

        if (selectedAnswer === correctAnswer.trim()) {
            button.classList.add("correct");
            score++;
        } else {
            button.classList.add("wrong");
        }

        nextBtn.classList.remove("hidden");
    }

    nextBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            showQuestion();
        } else {
            showResult();
        }
    });

    function showResult() {
        quizScreen.classList.add("hidden");
        resultScreen.classList.remove("hidden");
        scoreText.innerText = `Your Score: ${score} / ${quizData.length}`;
    }

    restartBtn.addEventListener("click", startQuiz);
    startBtn.addEventListener("click", startQuiz);

    fetchQuizData(); // Fetch quiz data when the page loads
});
