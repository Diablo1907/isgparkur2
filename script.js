// Geçerli sicil numaraları (gerçek projelerde veritabanında saklanır)
const validSicilNumbers = ["12345", "98765", "11111"];

// Yeni HTML elemanlarını seçme
const loginContainer = document.getElementById('login-container');
const loginForm = document.getElementById('login-form');
const sicilNoInput = document.getElementById('sicil-no');
const errorMessage = document.getElementById('error-message');
const quizContainer = document.querySelector('.quiz-container');

// İSG soru bankası
const totalPoints = 100;
const questions = [
    {
        question: "Bir yangın anında ilk yapılması gereken nedir?",
        options: ["Asansörü kullanmak", "Yangın söndürme tüpü bulmak", "Acil çıkışa yönelmek", "Panik yapmak"],
        correctAnswer: "Acil çıkışa yönelmek"
    },
    {
        question: "Ergonomi ne anlama gelir?",
        options: ["İşin insana uyumu", "İş verimliliği", "Zaman yönetimi", "Ekip çalışması"],
        correctAnswer: "İşin insana uyumu"
    },
    {
        question: "Kişisel koruyucu donanım (KKD) kullanımı neden önemlidir?",
        options: ["Sadece zorunlu olduğu için", "İş kazalarını önlemek için", "İşvereni mutlu etmek için", "Daha iyi görünmek için"],
        correctAnswer: "İş kazalarını önlemek için"
    },
    {
        question: "İş yerinde acil çıkış levhaları hangi renkte olmalıdır?",
        options: ["Kırmızı", "Sarı", "Yeşil", "Mavi"],
        correctAnswer: "Yeşil"
    },
    {
        question: "Yüksekte çalışmalarda en temel güvenlik önlemi nedir?",
        options: ["Dizlik takmak", "İş eldiveni kullanmak", "Emniyet kemeri takmak", "Kask takmak"],
        correctAnswer: "Emniyet kemeri takmak"
    },
    {
        question: "Deneme?",
        options: ["Dizlik takmak", "İş eldiveni kullanmak", "Emniyet kemeri takmak", "Kask takmak"],
        correctAnswer: "Emniyet kemeri takmak"
    }
];

const pointsPerQuestion = totalPoints / questions.length;

// HTML elemanlarını seçme
const quizDiv = document.getElementById('quiz');
const resultDiv = document.getElementById('result-container');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreText = document.getElementById('score-text');

let currentQuestionIndex = 0;
let score = 0;
let points = 0;

// Oyunun başlatılması
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    points = 0;
    resultDiv.style.display = 'none';
    quizDiv.style.display = 'flex';
    nextBtn.style.display = 'block';
    nextBtn.textContent = 'Sonraki Soru';
    showQuestion();
}

// Soruyu gösterme
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    // Soru ilerlemesini göster
    const progressDiv = document.getElementById('question-progress');
    progressDiv.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;

    optionsContainer.innerHTML = '';
    submitBtn.disabled = true;
    submitBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';

    let selectedOption = null;
    let answered = false;

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        optionsContainer.appendChild(button);

        button.addEventListener('click', () => {
            if (answered) return;
            selectedOption = option;
            document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            submitBtn.disabled = false;
        });
    });

    submitBtn.onclick = function() {
        if (!selectedOption || answered) return;
        selectOption(selectedOption, currentQuestion.correctAnswer);
        answered = true;
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
    };
}

// Şık seçildiğinde
function selectOption(selectedOption, correctAnswer) {
    const optionButtons = document.querySelectorAll('.option-btn');
    let isCorrect = selectedOption === correctAnswer;

    optionButtons.forEach(button => {
        button.classList.remove('selected');
        if (button.textContent === selectedOption) {
            button.classList.add('selected');
        }
    });

    optionButtons.forEach(button => {
        if (button.textContent === correctAnswer) {
            button.classList.add('correct');
        } else if (button.textContent === selectedOption && !isCorrect) {
            button.classList.add('wrong');
        }
        button.disabled = true; // Tüm butonları devre dışı bırak
    });

    if (isCorrect) {
        score++;
        points += pointsPerQuestion;
    }

    nextBtn.style.display = 'block';
}

// Sonraki soruya geçiş
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

// Oyunu bitirme
function endQuiz() {
    quizDiv.style.display = 'none';
    resultDiv.style.display = 'block';
    const roundedPoints = Math.round(points);
    scoreText.textContent = `Doğru Sayısı: ${score} / ${questions.length}  |  Puanınız: ${roundedPoints}`;
    if (roundedPoints < 50) {
        scoreText.style.color = 'red';
    } else {
        scoreText.style.color = 'green';
    }

    // Kutlama
    const celebrationDiv = document.getElementById('celebration');
    const fireworksCanvas = document.getElementById('fireworks-canvas');
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (roundedPoints > 70) {
        celebrationDiv.innerHTML = '<div class="celebration-message big">🎉🎊 <br>TEBRİKLER!<br>Harika bir skor elde ettiniz!<br>��🎉</div>';
        fireworksCanvas.style.display = 'block';
        confettiCanvas.style.display = 'block';
        startFireworks();
        startConfetti();
    } else {
        celebrationDiv.innerHTML = '';
        fireworksCanvas.style.display = 'none';
        confettiCanvas.style.display = 'none';
    }

    // Sicil numarasını al
    const sicilNo = sicilNoInput.value;
    // Skoru kaydet
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({ sicilNo, points: roundedPoints });
    // En yüksekten en düşüğe sırala
    leaderboard.sort((a, b) => b.points - a.points);
    // İlk 10'u al
    leaderboard = leaderboard.slice(0, 10);
    // Kaydet
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Göster
    const leaderboardDiv = document.getElementById('leaderboard');
    let html = '<h3>En İyi 10 Skor</h3><ol>';
    leaderboard.forEach(entry => {
        html += `<li>${entry.sicilNo}: ${entry.points} puan</li>`;
    });
    html += '</ol>';
    leaderboardDiv.innerHTML = html;
}

// Basit havai fişek animasyonu
function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    function randomColor() {
        const colors = ['#ff3', '#f06', '#0cf', '#0f0', '#f90', '#fff', '#f33', '#3ff', '#ff0', '#0ff', '#f0f'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.2;
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 * i) / 50;
            const speed = Math.random() * 4 + 2;
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: randomColor()
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
    }

    function update() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.07; // gravity
            p.alpha -= 0.012;
        });
        particles = particles.filter(p => p.alpha > 0);
        if (particles.length < 30) createFirework();
    }

    function loop() {
        update();
        draw();
        animationFrame = requestAnimationFrame(loop);
    }

    // Start animation
    createFirework();
    loop();

    // Stop after 5 seconds
    setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
    }, 5000);
}

// Basit konfeti animasyonu
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    let confetti = [];
    let animationFrame;
    const colors = ['#ff3', '#f06', '#0cf', '#0f0', '#f90', '#fff', '#f33', '#3ff', '#ff0', '#0ff', '#f0f'];

    for (let i = 0; i < 120; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: Math.random() * 3 + 2,
            vx: Math.random() * 2 - 1,
            alpha: 1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(c => {
            ctx.globalAlpha = c.alpha;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fillStyle = c.color;
            ctx.fill();
        });
    }

    function update() {
        confetti.forEach(c => {
            c.x += c.vx;
            c.y += c.vy;
            c.alpha -= 0.002;
        });
        confetti = confetti.filter(c => c.y < canvas.height && c.alpha > 0);
    }

    function loop() {
        update();
        draw();
        animationFrame = requestAnimationFrame(loop);
    }

    loop();

    // Stop after 5 seconds
    setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
    }, 5000);
}

// Basit havai fişek animasyonu
function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    // Set both CSS and attribute size for proper rendering
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    function randomColor() {
        const colors = ['#ff3', '#f06', '#0cf', '#0f0', '#f90', '#fff', '#f33', '#3ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.2;
        for (let i = 0; i < 40; i++) {
            const angle = (Math.PI * 2 * i) / 40;
            const speed = Math.random() * 3 + 2;
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: randomColor()
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
    }

    function update() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.alpha -= 0.015;
        });
        particles = particles.filter(p => p.alpha > 0);
        if (particles.length < 20) createFirework();
    }

    function loop() {
        update();
        draw();
        animationFrame = requestAnimationFrame(loop);
    }

    // Start animation
    createFirework();
    loop();

    // Stop after 4 seconds
    setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
    }, 4000);
}

// Tekrar oynama butonu
restartBtn.addEventListener('click', () => {
    // Hide result and quiz, show login
    resultDiv.style.display = 'none';
    quizDiv.style.display = 'none';
    loginContainer.style.display = 'block';
    // Clear input and error
    sicilNoInput.value = '';
    errorMessage.textContent = '';
});

// Oyunu başlat
// Giriş formunu dinle
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini engeller

    const sicilNo = sicilNoInput.value;

    // 5 rakamlı sicil numarası kontrolü
    if (/^\d{5}$/.test(sicilNo)) {
        // Giriş başarılı, giriş ekranını gizle ve oyunu başlat
        loginContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        startQuiz();
    } else {
        // Hatalı giriş, hata mesajını göster
        errorMessage.textContent = 'Lütfen 5 rakamlı bir sicil numarası girin.';
    }
});