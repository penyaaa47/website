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
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            location.reload(); // Аналог нажатия "Начать заново"
        }
    });

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
        { name: "Лошадь", weight: 500, category: "heavy" },
        { name: "Тигр", weight: 300, category: "heavy" },
        { name: "Медведь", weight: 600, category: "heavy" },
        { name: "Горилла", weight: 160, category: "heavy" },
        { name: "Лев", weight: 250, category: "heavy" },
        { name: "Буйвол", weight: 900, category: "heavy" },
        { name: "Бегемот", weight: 1500, category: "heavy" },
        { name: "Носорог", weight: 2300, category: "heavy" },
        { name: "Осел", weight: 200, category: "heavy" },
        { name: "Ящерица", weight: 0.5, category: "light" },
        { name: "Попугай", weight: 1, category: "light" },
        { name: "Кролик", weight: 2, category: "light" },
        { name: "Еж", weight: 1.5, category: "light" },
        { name: "Летучая мышь", weight: 0.03, category: "light" },
        { name: "Белка", weight: 0.6, category: "light" },
        { name: "Хорек", weight: 1.3, category: "light" },
        { name: "Коала", weight: 9, category: "light" },
        { name: "Фенек", weight: 1.5, category: "light" },
        { name: "Кенгуру", weight: 85, category: "light" },
        { name: "Выдра", weight: 10, category: "light" },
        { name: "Курица", weight: 2.5, category: "light" },
        { name: "Гусь", weight: 4, category: "light" },
        { name: "Утка", weight: 3, category: "light" },
        { name: "Павлин", weight: 5, category: "light" },
        { name: "Фламинго", weight: 3.5, category: "light" },
        { name: "Обезьяна", weight: 8, category: "light" },
        { name: "Лемур", weight: 2.2, category: "light" },
        { name: "Крот", weight: 0.1, category: "light" },
        { name: "Змея", weight: 6, category: "light" },
        { name: "Пингвин", weight: 30, category: "light" },
        { name: "Черепаха", weight: 12, category: "light" },
        { name: "Антилопа", weight: 250, category: "heavy" },
        { name: "Верблюд", weight: 600, category: "heavy" }
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
            levelInstruction.textContent = "Выберите животное, которое соответствует заданному весу. Для перехода на следующий уровень нужно ответить 4 раза подряд правильно. Для выбора можете использовать клавишу Enter или ЛКМ";
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
    function setupLevelSkipButtons() {
        document.getElementById("skip-to-level-2").addEventListener("click", () => {
            const playerName = document.getElementById("player-name").value.trim();
            if (!playerName) {
                alert("Введите имя перед началом игры!");
                return;
            }
            localStorage.setItem("playerName", playerName);
            currentLevel = 2;
            startLevel2();
            gameLevels.style.display = "block";
        });

        document.getElementById("skip-to-level-3").addEventListener("click", () => {
            const playerName = document.getElementById("player-name").value.trim();
            if (!playerName) {
                alert("Введите имя перед началом игры!");
                return;
            }
            localStorage.setItem("playerName", playerName);
            currentLevel = 3;
            startLevel3();
            gameLevels.style.display = "block";
        });
    }

    let askedQuestions = []; // Список уже заданных вопросов

    function startLevel1() {
        questionContainer.innerHTML = "";

        // Получаем случайного животного из списка level3Animals
        let randomIndex = Math.floor(Math.random() * level3Animals.length);
        const randomAnimal = level3Animals[randomIndex];

        // Генерируем вопрос
        let question = document.createElement("p");
        question.textContent = `Какое животное весит примерно ${randomAnimal.weight} кг?`;
        questionContainer.appendChild(question);

        let buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "15px";
        buttonContainer.style.flexWrap = "wrap";

        let buttons = [];

        // Выбираем 5 случайных животных для кнопок (включая правильный ответ)
        let shuffledAnimals = [...level3Animals].sort(() => Math.random() - 0.5).slice(0, 5);

        // Убеждаемся, что среди кнопок есть правильный ответ
        if (!shuffledAnimals.some(animal => animal.name === randomAnimal.name)) {
            shuffledAnimals[Math.floor(Math.random() * shuffledAnimals.length)] = randomAnimal;
        }

        shuffledAnimals.forEach(animal => {
            let button = document.createElement("button");
            button.textContent = animal.name;
            button.classList.add("btn");

            // Обработка клика
            button.addEventListener("click", () => checkAnswerLevel1(animal, randomAnimal));

            // Фокус при наведении
            button.addEventListener("mouseenter", () => {
                button.focus();
            });

            // Выбор при нажатии Enter
            button.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    checkAnswerLevel1(animal, randomAnimal);
                }
            });

            buttons.push(button);
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
        questionContainer.innerHTML = "";

        let timeDisplay = document.createElement("p");
        timeDisplay.id = "timer";
        timeDisplay.textContent = `Осталось времени: ${timeLeft} секунд`;
        questionContainer.appendChild(timeDisplay);

        let remainingAnimals = [...level3Animals]; // Копия массива животных
        let buttonIntervals = []; // Массив для хранения интервалов движения кнопок
        let timeExpired = false; // Флаг, который предотвратит бесконечные вызовы alert()

        timer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = `Осталось времени: ${timeLeft} секунд`;

            if (timeLeft <= 0 && !timeExpired) { // Проверяем, не вызывался ли уже alert()
                timeExpired = true; // Устанавливаем флаг, чтобы alert не повторялся
                clearInterval(timer);
                buttonIntervals.forEach(interval => clearInterval(interval)); // Останавливаем движение кнопок
                alert(`Время вышло! Сейчас вы увидите свои результаты.`);
                nextLevelButton.style.display = "block";
                localStorage.setItem("totalScore", totalScore);
                showFinalResults();
            }
        }, 1000);

        function generateAnimalQuestion() {
            if (timeExpired) return; // Если время вышло, не создаем новые вопросы

            questionContainer.innerHTML = "";
            questionContainer.appendChild(timeDisplay);

            if (remainingAnimals.length === 0) {
                clearInterval(timer);
                buttonIntervals.forEach(interval => clearInterval(interval)); // Останавливаем кнопки
                let endMessage = document.createElement("p");
                endMessage.textContent = "Животные закончились!";
                questionContainer.appendChild(endMessage);
                nextLevelButton.style.display = "block";
                localStorage.setItem("totalScore", totalScore);
                return;
            }

            let randomIndex = Math.floor(Math.random() * remainingAnimals.length);
            const randomAnimal = remainingAnimals[randomIndex];

            let question = document.createElement("p");
            question.textContent = `К какой категории относится животное: ${randomAnimal.name}?`;
            questionContainer.appendChild(question);

            let buttonContainer = document.createElement("div");
            buttonContainer.classList.add("moving-buttons-container");

            ["Легкие", "Тяжелые"].forEach(category => {
                let button = document.createElement("button");
                button.textContent = category;
                button.classList.add("btn", "moving-button");
                button.dataset.category = category;

                button.addEventListener("click", () => {
                    if (timeExpired) return; // Если время вышло, не обрабатываем клики

                    if (
                        (category === "Легкие" && randomAnimal.category === "light") ||
                        (category === "Тяжелые" && randomAnimal.category === "heavy")
                    ) {
                        alert("Правильно! +10 баллов");
                        totalScore += 10;
                    } else {
                        alert("Неправильно! -5 баллов");
                        totalScore -= 5;
                    }

                    localStorage.setItem("totalScore", totalScore);
                    remainingAnimals.splice(randomIndex, 1);
                    generateAnimalQuestion();
                });

                buttonContainer.appendChild(button);
            });

            questionContainer.appendChild(buttonContainer);
            moveButtons(buttonIntervals); // Запускаем движение кнопок
        }

        generateAnimalQuestion();
    }
    function moveButtons(buttonIntervals) {
        const buttons = document.querySelectorAll(".moving-button");
        const gameContainer = document.querySelector(".content"); // Ограничиваем движение в розовой зоне
        const restartButton = document.getElementById("restart-game"); // Кнопка "Начать игру заново"

        if (!gameContainer || !restartButton) return;

        let containerRect = gameContainer.getBoundingClientRect();
        let restartRect = restartButton.getBoundingClientRect(); // Получаем координаты кнопки

        buttons.forEach(button => {
            let interval = setInterval(() => {
                let maxX = containerRect.width - button.clientWidth - 20;
                let maxY = containerRect.height - button.clientHeight - 20;

                let newX, newY;
                do {
                    newX = Math.random() * maxX;
                    newY = Math.random() * maxY;
                } while (
                    newX + button.clientWidth > restartRect.left - containerRect.left && // Проверка по X
                    newX < restartRect.right - containerRect.left &&
                    newY + button.clientHeight > restartRect.top - containerRect.top && // Проверка по Y
                    newY < restartRect.bottom - containerRect.top
                );

                button.style.position = "absolute";
                button.style.left = `${containerRect.left + newX}px`;
                button.style.top = `${containerRect.top + newY}px`;
            }, 1000);

            buttonIntervals.push(interval);

            // Когда игрок наводит курсор, кнопка сразу же убегает
            button.addEventListener("mouseenter", () => {
                let newX, newY;
                do {
                    newX = Math.random() * maxX;
                    newY = Math.random() * maxY;
                } while (
                    newX + button.clientWidth > restartRect.left - containerRect.left &&
                    newX < restartRect.right - containerRect.left &&
                    newY + button.clientHeight > restartRect.top - containerRect.top &&
                    newY < restartRect.bottom - containerRect.top
                );

                button.style.left = `${containerRect.left + newX}px`;
                button.style.top = `${containerRect.top + newY}px`;
            });
        });
    }

       

    function showFinalResults() {
        // Очистка только основного содержимого, а не всей страницы
        document.querySelector(".content").innerHTML = "";

        let finalScreen = document.createElement("div");
        finalScreen.classList.add("final-screen");

        // Центрируем финальный экран, но выше центра
        finalScreen.style.display = "flex";
        finalScreen.style.flexDirection = "column";
        finalScreen.style.alignItems = "center";
        finalScreen.style.justifyContent = "flex-start";
        finalScreen.style.marginTop = "50px";
        finalScreen.style.padding = "20px";

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
        if (totalScore < 90) rank = "Новичок";
        else if (totalScore < 190) rank = "Средний";
        else rank = "Профессионал";

        let rankInfo = document.createElement("p");
        rankInfo.textContent = `Ваш уровень: ${rank}`;
        finalScreen.appendChild(rankInfo);

        // ✅ Сохранение данных в localStorage
        let savedResults = JSON.parse(localStorage.getItem("gameResults")) || [];
        let newResult = { player: playerName, score: totalScore, rank: rank, date: new Date().toLocaleString() };
        savedResults.push(newResult);
        localStorage.setItem("gameResults", JSON.stringify(savedResults));

        // Контейнер для кнопок ответа
        let buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.flexDirection = "column";
        buttonContainer.style.alignItems = "center";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "15px";

        // Кнопка для просмотра рейтинга игроков
        let viewResultsButton = document.createElement("button");
        viewResultsButton.textContent = "Посмотреть рейтинг игроков";
        viewResultsButton.classList.add("btn");
        viewResultsButton.addEventListener("click", () => {
            window.location.href = "rating.html";
        });
        buttonContainer.appendChild(viewResultsButton);

        // Кнопка перезапуска игры
        let restartButton = document.createElement("button");
        restartButton.textContent = "Начать заново";
        restartButton.classList.add("btn");
        restartButton.style.marginTop = "10px"; // Раздвигаем кнопки

        // Меняем обработчик с одиночного клика на двойной клик
        restartButton.addEventListener("dblclick", function () {
            location.reload();
        });

        buttonContainer.appendChild(restartButton);
        finalScreen.appendChild(buttonContainer);

        document.querySelector(".content").style.display = "flex";
        document.querySelector(".content").style.flexDirection = "column";
        document.querySelector(".content").style.justifyContent = "flex-start";
        document.querySelector(".content").style.alignItems = "center";
        document.querySelector(".content").style.marginTop = "50px";
        document.querySelector(".content").appendChild(finalScreen);
    }

    setupLevelSkipButtons(); // Подключаем обработчики кнопок перехода

    nextLevelButton.addEventListener("click", () => {
        currentLevel++;
        startLevel();
    });

    restartGameButton.addEventListener("click", () => {
        location.reload();
    });
});
