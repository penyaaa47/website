document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form");
    const playerNameInput = document.getElementById("player-name");
    const gameLevels = document.getElementById("game-levels");
    const questionContainer = document.getElementById("question-container");
    const nextLevelButton = document.getElementById("next-level");
    const restartGameButton = document.getElementById("restart-game");
    const gameLevelTitle = document.getElementById("game-level-title");
    const levelInstruction = document.getElementById("level-instruction");
    const dragDropContainer = document.getElementById("drag-drop-container");
    const sourceContainer = document.getElementById("source");
    const lightAnimalsContainer = document.getElementById("light-animals");
    const heavyAnimalsContainer = document.getElementById("heavy-animals");
    const authText = document.getElementById("auth-text");

    let playerName = "";
    let currentLevel = 1;
    let correctAnswers = 0;
    let streakCorrectAnswers = 0;
    let totalScore = 0; // Добавил переменную для сохранения очков
    const requiredCorrectAnswers = 4;
    let correctPlacements = 0;
    const requiredPlacements = 5;
    let lastQuestionIndex = null;
    let timer;
    let timeLeft = 30;

    const level1Animals = [
        { name: "Слон", weight: 5000, image: "images/elephant.png", category: "heavy" },
        { name: "Корова", weight: 700, image: "images/cow.png", category: "heavy" },
        { name: "Собака", weight: 30, image: "images/dog.png", category: "light" },
        { name: "Кот", weight: 5, image: "images/cat.png", category: "light" },
        { name: "Мышь", weight: 0.2, image: "images/mouse.png", category: "light" }
    ];

    const level2Animals = [...level1Animals];

    const level3Animals = [
        ...level1Animals,
        { name: "Лошадь", category: "heavy" },
        { name: "Тигр", category: "heavy" },
        { name: "Медведь", category: "heavy" },
        { name: "Горилла", category: "heavy" },
        { name: "Лев", category: "heavy" },
        { name: "Буйвол", category: "heavy" },
        { name: "Бегемот", category: "heavy" },
        { name: "Носорог", category: "heavy" },
        { name: "Осел", category: "heavy" },
        { name: "Ящерица", category: "light" },
        { name: "Попугай", category: "light" },
        { name: "Кролик", category: "light" },
        { name: "Еж", category: "light" },
        { name: "Летучая мышь", category: "light" },
        { name: "Белка", category: "light" },
        { name: "Хорек", category: "light" },
        { name: "Коала", category: "light" },
        { name: "Фенек", category: "light" },
        { name: "Кенгуру", category: "light" },
        { name: "Выдра", category: "light" },
        { name: "Курица", category: "light" },
        { name: "Гусь", category: "light" },
        { name: "Утка", category: "light" },
        { name: "Павлин", category: "light" },
        { name: "Фламинго", category: "light" },
        { name: "Обезьяна", category: "light" },
        { name: "Лемур", category: "light" },
        { name: "Крот", category: "light" },
        { name: "Змея", category: "light" },
        { name: "Пингвин", category: "light" },
        { name: "Черепаха", category: "light" },
        { name: "Антилопа", category: "heavy" },
        { name: "Верблюд", category: "heavy" }
    ];

    authForm.addEventListener("submit", (event) => {
        event.preventDefault();
        playerName = playerNameInput.value.trim();
        if (playerName) {
            localStorage.setItem("playerName", playerName);
            localStorage.setItem("totalScore", 0); // Обнуляем счет перед началом игры

            // Скрываем экран входа
            document.querySelector(".welcome-container").style.display = "none";

            // Показываем игру
            gameLevels.style.display = "block";
            startLevel();
        }
    
    });

    function startLevel() {
        questionContainer.innerHTML = "";
        gameLevelTitle.textContent = `Уровень ${currentLevel}`;

        if (currentLevel === 1) {
            nextLevelButton.style.display = "none";
            dragDropContainer.style.display = "none";
            levelInstruction.textContent = "Выберите животное, которое соответствует заданному весу. Для перехода на следующий уровень нужно ответить 4 раза подряд правильно";
            startLevel1();
        } else if (currentLevel === 2) {
            nextLevelButton.style.display = "none";
            dragDropContainer.style.display = "flex";
            levelInstruction.textContent = "Перетащите животное в правильную категорию: 'Легкие' или 'Тяжелые'.";
            startLevel2();
        } else if (currentLevel === 3) {
            nextLevelButton.style.display = "none";
            dragDropContainer.style.display = "none";
            levelInstruction.textContent = "Успейте выбрать категорию для животных за 30 секунд!";
            startLevel3();
        } else {
            showFinalResults();
        }
    }
        

    let askedQuestions = []; // Список уже заданных вопросов

    function startLevel1() {
        questionContainer.innerHTML = "";
        let availableQuestions = level1Animals.filter(animal => !askedQuestions.includes(animal.weight));

        // Если все вопросы использованы, обнуляем список
        if (availableQuestions.length === 0) {
            askedQuestions = [];
            availableQuestions = [...level1Animals];
        }

        let randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const randomAnimal = availableQuestions[randomIndex];

        // Добавляем в список использованных вопросов
        askedQuestions.push(randomAnimal.weight);

        let question = document.createElement("p");
        question.textContent = `Какое животное весит примерно ${randomAnimal.weight} кг?`;
        questionContainer.appendChild(question);

        let buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "15px";
        buttonContainer.style.flexWrap = "wrap";

        level1Animals.forEach(animal => {
            let button = document.createElement("button");
            button.textContent = animal.name;
            button.classList.add("btn");
            button.addEventListener("click", () => checkAnswerLevel1(animal, randomAnimal));
            buttonContainer.appendChild(button);
        });

        questionContainer.appendChild(buttonContainer);
    }

    function checkAnswerLevel1(selected, correct) {
        if (selected.name === correct.name) {
            alert("Правильно! +10 баллов");
            streakCorrectAnswers++;
            totalScore += 10;
        } else {
            alert("Неправильно! -5 баллов");
            streakCorrectAnswers = 0;
            totalScore -= 5;
            askedQuestions = []; // Сбрасываем список вопросов при ошибке
        }

        if (streakCorrectAnswers < requiredCorrectAnswers) {
            startLevel1();
        } else {
            nextLevelButton.style.display = "block";
        }
    }

   

    function startLevel2() {
        sourceContainer.innerHTML = "<p>Исходные животные:</p>";
        lightAnimalsContainer.innerHTML = "<p>Легкие животные:</p>";
        heavyAnimalsContainer.innerHTML = "<p>Тяжелые животные:</p>";

        level2Animals.forEach((animal, index) => {
            const img = document.createElement("img");
            img.src = animal.image;
            img.alt = animal.name;
            img.classList.add("draggable-animal");
            img.draggable = true;
            img.dataset.category = animal.category;
            img.id = `animal-${index}`;

            img.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text", animal.category);
                e.dataTransfer.setData("id", e.target.id);
            });

            sourceContainer.appendChild(img);
        });

        [lightAnimalsContainer, heavyAnimalsContainer].forEach(container => {
            container.addEventListener("dragover", (e) => e.preventDefault());

            container.addEventListener("drop", (e) => {
                e.preventDefault();
                const category = e.dataTransfer.getData("text");
                const draggedId = e.dataTransfer.getData("id");
                const draggedElement = document.getElementById(draggedId);
                const originalContainer = document.getElementById("source");

                if ((category === "light" && container.id === "light-animals") ||
                    (category === "heavy" && container.id === "heavy-animals")) {
                    alert("Правильно! +10 баллов");
                    container.appendChild(draggedElement);
                    correctPlacements++;
                    totalScore += 10; // ✅ Добавлено начисление баллов за правильный ответ
                } else {
                    alert("Неправильно! -5 баллов");
                    originalContainer.appendChild(draggedElement);
                    totalScore -= 5; // ✅ Добавлено вычитание баллов за неправильный ответ
                }

                if (correctPlacements >= requiredPlacements) {
                    nextLevelButton.style.display = "block";
                }
            });
        });
    }

    function startLevel3() {
        let timeDisplay = document.createElement("p");
        timeDisplay.id = "timer";
        timeDisplay.textContent = `Осталось времени: ${timeLeft} секунд`;
        questionContainer.appendChild(timeDisplay);

        let remainingAnimals = [...level3Animals]; // Копия массива животных, чтобы избежать изменений в оригинале

        timer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = `Осталось времени: ${timeLeft} секунд`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                alert(`Время вышло! Сейчас вы увидите свои результаты.`);
                nextLevelButton.style.display = "block";
                localStorage.setItem("totalScore", totalScore);
                showFinalResults(); // ✅ Переход на экран результатов
            }
        }, 1000);

        function generateAnimalQuestion() {
            questionContainer.innerHTML = "";
            questionContainer.appendChild(timeDisplay);

            if (remainingAnimals.length === 0) { // ✅ Если список пуст, выводим сообщение
                clearInterval(timer);
                let endMessage = document.createElement("p");
                endMessage.textContent = "Животные закончились!";
                questionContainer.appendChild(endMessage);
                nextLevelButton.style.display = "block"; // Открываем кнопку показа результатов
                localStorage.setItem("totalScore", totalScore);
                return;
            }

            let randomIndex = Math.floor(Math.random() * remainingAnimals.length);
            const randomAnimal = remainingAnimals[randomIndex];

            let question = document.createElement("p");
            question.textContent = `К какой категории относится животное: ${randomAnimal.name}?`;
            questionContainer.appendChild(question);

            let buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "center";
            buttonContainer.style.gap = "10px";
            buttonContainer.style.marginTop = "15px";

            ["Легкие", "Тяжелые"].forEach(category => {
                let button = document.createElement("button");
                button.textContent = category;
                button.classList.add("btn");
                button.addEventListener("click", () => {
                    if (
                        (category === "Легкие" && randomAnimal.category === "light") ||
                        (category === "Тяжелые" && randomAnimal.category === "heavy")
                    ) {
                        alert("Правильно! +10 баллов");
                        correctAnswers++;
                        totalScore += 10;
                    } else {
                        alert("Неправильно! -5 баллов");
                        totalScore -= 5;
                    }
                    localStorage.setItem("totalScore", totalScore);

                    remainingAnimals.splice(randomIndex, 1); // ✅ Удаляем животное из списка после ответа
                    generateAnimalQuestion();
                });
                buttonContainer.appendChild(button);
            });

            questionContainer.appendChild(buttonContainer);
        }

        generateAnimalQuestion();
    }


    function showFinalResults() {
        // Очистка только основного содержимого, а не всей страницы
        document.querySelector(".content").innerHTML = "";

        let finalScreen = document.createElement("div");
        finalScreen.classList.add("final-screen");

        // Центрируем финальный экран
        finalScreen.style.display = "flex";
        finalScreen.style.flexDirection = "column";
        finalScreen.style.alignItems = "center";
        finalScreen.style.justifyContent = "center";
        finalScreen.style.minHeight = "80vh";

        let title = document.createElement("h1");
        title.textContent = "Итог игры";
        finalScreen.appendChild(title);

        let playerInfo = document.createElement("p");
        playerInfo.textContent = `Игрок: ${playerName}`;
        finalScreen.appendChild(playerInfo);

        let scoreInfo = document.createElement("p");
        scoreInfo.textContent = `Ваши баллы: ${totalScore}`;
        finalScreen.appendChild(scoreInfo);

        let rank = "";
        if (totalScore < 10) rank = "Новичок";
        else if (totalScore < 20) rank = "Средний";
        else rank = "Профессионал";

        let rankInfo = document.createElement("p");
        rankInfo.textContent = `Ваш уровень: ${rank}`;
        finalScreen.appendChild(rankInfo);

        // ✅ Сохранение данных в localStorage
        let savedResults = JSON.parse(localStorage.getItem("gameResults")) || [];
        let newResult = { player: playerName, score: totalScore, rank: rank, date: new Date().toLocaleString() };
        savedResults.push(newResult);
        localStorage.setItem("gameResults", JSON.stringify(savedResults));

        // Кнопка для просмотра рейтинга игроков
        let viewResultsButton = document.createElement("button");
        viewResultsButton.textContent = "Посмотреть рейтинг игроков";
        viewResultsButton.classList.add("btn");
        viewResultsButton.addEventListener("click", () => {
            window.location.href = "rating.html";
        });
        finalScreen.appendChild(viewResultsButton);

        // Кнопка перезапуска игры
        let restartButton = document.createElement("button");
        restartButton.textContent = "Начать заново";
        restartButton.classList.add("btn");
        restartButton.addEventListener("click", () => {
            location.reload();
        });
        finalScreen.appendChild(restartButton);

        document.querySelector(".content").style.display = "flex";
        document.querySelector(".content").style.flexDirection = "column";
        document.querySelector(".content").style.justifyContent = "center";
        document.querySelector(".content").style.alignItems = "center";
        document.querySelector(".content").style.minHeight = "80vh";
        document.querySelector(".content").appendChild(finalScreen);
    }



    nextLevelButton.addEventListener("click", () => {
        currentLevel++;
        startLevel();
    });

    restartGameButton.addEventListener("click", () => {
        location.reload();
    });
});
