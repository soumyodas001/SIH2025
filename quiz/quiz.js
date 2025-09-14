const STATE_DATA = {
    "Kerala": "Kathakali",
    "Tamil Nadu": "Bharatanatyam",
    "Andhra Pradesh": "Kuchipudi",
    "Odisha": "Odissi",
    "Uttar Pradesh": "Kathak",
    "Manipur": "Manipuri",
    "Assam": "Bihu",
    "Punjab": "Bhangra",
    "Gujarat": "Garba",
    "Rajasthan": "Ghoomar",
    "Maharashtra": "Lavani",
    "Karnataka": "Yakshagana",
    "West Bengal": "Durga Puja",
    "Goa": "Fugdi",
    "Bihar": "Chhath Puja",
    "Jharkhand": "Jhumar",
    "Chhattisgarh": "Panthi",
    "Himachal Pradesh": "Kinnauri Nati",
    "Mizoram": "Cheraw",
    "Nagaland": "Hornbill Festival",
    "Meghalaya": "Shad Suk Mynsiem",
    "Tripura": "Hojagiri",
    "Sikkim": "Losar Festival",
    "Arunachal Pradesh": "Losar (Tawang)",
    "Delhi": "Qutub Festival",
    "Haryana": "Phag Dance",
    "Madhya Pradesh": "Khajuraho Dance Festival",
    "Telangana": "Bonalu",
    "Ladakh": "Hemis Festival",
    "Jammu & Kashmir": "Rouf Dance",
    "Puducherry": "Villianur Car Festival",
    "Lakshadweep": "Lava Dance",
    "Andaman & Nicobar": "Nicobari Dance",
    "Chennai": "Margazhi Festival",
    "Varanasi": "Ganga Mahotsav",
    "Jaipur": "Teej Festival",
    "Kolkata": "Rath Yatra",
    "Mumbai": "Ganesh Chaturthi",
    "Hyderabad": "Deccan Festival",
    "Bhopal": "Lokrang Festival",
    "Lucknow": "Kathak Utsav",
    "Patna": "Sonepur Mela",
    "Agra": "Taj Mahotsav",
    "Konark": "Konark Dance Festival",
    "Delhi (Republic Day)": "Republic Day Parade",
    "Haridwar": "Kumbh Mela",
    "Allahabad": "Magh Mela",
    "Amritsar": "Baisakhi",
    "Nagpur": "Marbat Festival",
    "Surat": "Navratri Garba",
    "Ahmedabad": "International Kite Festival",
    "Mysuru": "Dasara",
    "Madurai": "Chithirai Festival",
    "Thanjavur": "Natyanjali Festival",
    "Kochi": "Onam",
    "Thrissur": "Thrissur Pooram",
    "Alleppey": "Nehru Trophy Boat Race",
    "Puri": "Rath Yatra",
    "Darjeeling": "Darjeeling Carnival",
    "Shillong": "Wangala Festival",
    "Dimapur": "Aoling Festival",
    "Imphal": "Lai Haraoba",
    "Aizawl": "Chapchar Kut",
    "Itanagar": "Solung Festival",
    "Kohima": "Sekrenyi Festival",
    "Gangtok": "Saga Dawa",
    "Leh": "Dosmoche Festival",
    "Kargil": "Losar Festival",
    "Shimla": "Summer Festival",
    "Kullu": "Dussehra",
    "Rohtak": "Gugga Naumi",
    "Kurukshetra": "Gita Jayanti",
    "Gwalior": "Tansen Music Festival",
    "Indore": "Rangpanchami",
    "Ujjain": "Mahakal Festival",
    "Raipur": "Hareli Festival",
    "Bilaspur": "Raut Nacha",
    "Ranchi": "Karma Festival",
    "Jamshedpur": "Sarhul Festival",
    "Bhubaneswar": "Rajarani Music Festival",
    "Cuttack": "Bali Jatra",
    "Puducherry": "International Yoga Festival",
    "Daman": "Nariyal Poornima",
    "Diu": "Gangaji Fair",
    "Silvassa": "Tarna Dance",
    "Chandigarh": "Rose Festival",
    "Noida": "International Trade Fair",
    "Dehradun": "Jhanda Fair",
    "Nainital": "Nanda Devi Festival",
    "Almora": "Uttarayani Fair",
    "Bareilly": "Jhumka Festival",
    "Kanpur": "Ganga Mela",
    "Varanasi (Ganga Aarti)": "Dev Deepawali",
    "Prayagraj": "Ardh Kumbh Mela",
    "Ayodhya": "Deepotsav",
    "Mathura": "Lathmar Holi"
};

class Quiz {
    constructor(data) {
        this.data = data;
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.generateQuestions();
    }

    generateQuestions() {
        const states = Object.keys(this.data);
        const shuffledStates = [...states].sort(() => Math.random() - 0.5);
        const selectedStates = shuffledStates.slice(0, 10);

        this.questions = selectedStates.map(state => {
            const correctAnswer = this.data[state];
            const otherStates = states.filter(s => s !== state);
            const shuffledOthers = [...otherStates].sort(() => Math.random() - 0.5);
            const wrongAnswers = shuffledOthers.slice(0, 3).map(s => this.data[s]);

            const options = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);

            return {
                question: `What is the famous cultural dance/festival associated with ${state}?`,
                options: options,
                correctAnswer: correctAnswer,
                state: state
            };
        });
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    checkAnswer(answer) {
        const current = this.getCurrentQuestion();
        return current.correctAnswer === answer;
    }

    nextQuestion() {
        this.currentQuestion++;
        return this.currentQuestion < this.questions.length;
    }

    getScore() {
        return this.score;
    }

    getMedal() {
        if (this.score === 10) return { type: 'Gold', color: 'text-yellow-500' };
        if (this.score === 9) return { type: 'Silver', color: 'text-gray-400' };
        if (this.score === 8) return { type: 'Bronze', color: 'text-orange-700' };
        return { type: 'No medal', color: 'text-black' };
    }
}

// Quiz UI Handler
class QuizUI {
    constructor(quizInstance) {
        this.quiz = quizInstance;
        this.quizArea = document.getElementById('quiz-area');
        this.resultArea = document.getElementById('resultArea');
    }

    displayQuestion() {
        const currentQuestion = this.quiz.getCurrentQuestion();
        
        this.quizArea.innerHTML = `
            <div class="space-y-4">
                <div class="text-lg font-medium">Question ${this.quiz.currentQuestion + 1} of 10</div>
                <p class="text-xl mb-4">${currentQuestion.question}</p>
                <div class="grid grid-cols-1 gap-3">
                    ${currentQuestion.options.map((option, index) => `
                        <button 
                            class="btn btn-outline hover:bg-orange-100 text-left px-4 py-2 rounded-lg transition-all duration-200 w-full"
                            onclick="quizUI.handleAnswer('${option}')"
                        >${option}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    handleAnswer(answer) {
        const isCorrect = this.quiz.checkAnswer(answer);
        if (isCorrect) this.quiz.score++;

        const currentQuestion = this.quiz.getCurrentQuestion();
        
        // Show feedback
        this.quizArea.innerHTML = `
            <div class="space-y-4">
                <div class="text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'} font-bold mb-4">
                    ${isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
                </div>
                <p class="text-lg">
                    The correct answer for ${currentQuestion.state} is: 
                    <span class="font-bold">${currentQuestion.correctAnswer}</span>
                </p>
                <button 
                    class="btn btn-primary mt-4 w-full"
                    onclick="quizUI.nextQuestion()"
                >
                    Next Question
                </button>
            </div>
        `;
    }

    nextQuestion() {
        if (this.quiz.nextQuestion()) {
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const score = this.quiz.getScore();
        const medal = this.quiz.getMedal();
        
        this.quizArea.innerHTML = `
            <div class="text-center space-y-4">
                <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
                <p class="text-xl">Your Score: ${score}/10</p>
                <p class="text-lg ${medal.color} font-bold">
                    ${medal.type !== 'No medal' ? `🏅 ${medal.type} Medal!` : 'Keep practicing!'}
                </p>
                <button 
                    class="btn btn-primary mt-4"
                    onclick="startQuiz()"
                >
                    Try Again
                </button>
            </div>
        `;
    }
}

// Initialize quiz
let quiz;
let quizUI;

function startQuiz() {
    quiz = new Quiz(STATE_DATA);
    quizUI = new QuizUI(quiz);
    quizUI.displayQuestion();
}

// Start the quiz when the page loads
window.onload = startQuiz;