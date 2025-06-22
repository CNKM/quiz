// QuizApp Class to encapsulate all quiz logic and state
class QuizApp {
    constructor() {
        // DOM Elements
        this.body = document.body;
        this.sidebar = document.getElementById('sidebar');
        this.showSidebarIconContainer = document.getElementById('showSidebarIconContainer');
        this.hideSidebarIcon = document.getElementById('hideSidebarIcon');
        this.quizNav = document.getElementById('quiz-nav');
        
        // Custom Dropdown Elements
        this.customQuizTypeFilter = document.getElementById('custom-quiz-type-filter');
        this.quizTypeToggle = document.getElementById('quiz-type-toggle');
        this.selectedQuizTypeSpan = document.getElementById('selected-quiz-type');
        this.quizTypeMenu = document.getElementById('quiz-type-menu');
        this.dropdownArrow = this.quizTypeToggle.querySelector('.dropdown-arrow');


        this.quizTitleElement = document.getElementById('quiz-title');
        this.quizTypeElement = document.getElementById('quiz-type');
        this.questionMediaContainer = document.getElementById('question-media-container'); // New media container
        this.quizContentElement = document.getElementById('quiz-content');
        this.optionsContainer = document.getElementById('options-container');
        this.startQuizBtn = document.getElementById('start-quiz-btn');
        this.submitQuizBtn = document.getElementById('submit-quiz-btn');
        this.timerDisplay = document.getElementById('timer');
        this.scoreDisplay = document.getElementById('score-display');

        // State Variables
        this.currentQuizIndex = 0;
        this.userAnswers = {}; // Stores user answers for the current quiz
        this.timerInterval = null;
        this.startTime = null;
        this.quizStarted = false;
        this.quizSubmitted = false;
        this.quizScores = {}; // Stores scores for completed quizzes { quizId: { correct, total, percentage, time, userAnswers } }
        this.selectedQuizType = 'all'; // Keep track of the selected filter type
        this.currentVideoElement = null; // Store reference to the current video element
        // Matching specific state for drag-and-drop
        this.draggedLeftItemValue = null; // Value of the item currently being dragged from the left column
    }

    /**
     * Initializes the Quiz Application.
     * Sets up event listeners and loads the initial quiz.
     */
    init() {
        // Check if quizData is loaded
        if (typeof quizData === 'undefined') {
            console.error("Error: quiz_data.js not loaded. Please ensure the file is in the same directory and loaded correctly.");
            return;
        }

        this.addEventListeners();
        this.populateTypeFilter();
        this.loadQuizNavigation();

        // Set initial sidebar state (assuming open by default)
        this.body.classList.remove('sidebar-hidden');
        this.sidebar.classList.remove('hidden');
        this.showSidebarIconContainer.style.display = 'none';
    }

    /**
     * Adds all necessary event listeners to DOM elements.
     */
    addEventListeners() {
        this.showSidebarIconContainer.addEventListener('click', this.toggleSidebar.bind(this));
        this.hideSidebarIcon.addEventListener('click', this.toggleSidebar.bind(this));

        this.startQuizBtn.addEventListener('click', this.startQuiz.bind(this));
        this.submitQuizBtn.addEventListener('click', this.handleSubmitReattempt.bind(this));
        
        // Event listeners for custom dropdown
        this.quizTypeToggle.addEventListener('click', this.toggleDropdown.bind(this));
        // Close dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!this.customQuizTypeFilter.contains(event.target)) {
                this.hideDropdown();
            }
        });
    }

    /**
     * Toggles the visibility of the sidebar.
     */
    toggleSidebar() {
        this.sidebar.classList.toggle('hidden');
        this.body.classList.toggle('sidebar-hidden');
        
        if (this.sidebar.classList.contains('hidden')) {
            this.showSidebarIconContainer.style.display = 'flex';
        } else {
            this.showSidebarIconContainer.style.display = 'none';
        }
    }

    /**
     * Toggles the visibility of the custom dropdown menu.
     */
    toggleDropdown() {
        this.quizTypeMenu.classList.toggle('show');
        this.quizTypeToggle.classList.toggle('active');
    }

    /**
     * Hides the custom dropdown menu.
     */
    hideDropdown() {
        this.quizTypeMenu.classList.remove('show');
        this.quizTypeToggle.classList.remove('active');
    }

    /**
     * Populates the custom dropdown menu with unique quiz types.
     */
    populateTypeFilter() {
        const types = new Set();
        quizData.questions.forEach(quiz => {
            // Use the 'type' field for the high-level filter dropdown
            if (quiz.type) {
                types.add(quiz.type);
            }
        });

        this.quizTypeMenu.innerHTML = ''; // Clear existing menu items

        // Add "All Types" option
        const allOption = document.createElement('li');
        allOption.textContent = '全部题型';
        allOption.dataset.value = 'all';
        allOption.addEventListener('click', () => this.selectDropdownOption('all', '全部题型'));
        this.quizTypeMenu.appendChild(allOption);

        // Add unique types
        types.forEach(type => {
            const option = document.createElement('li');
            option.textContent = type;
            option.dataset.value = type;
            option.addEventListener('click', () => this.selectDropdownOption(type, type));
            this.quizTypeMenu.appendChild(option);
        });
    }

    /**
     * Handles the selection of a custom dropdown option.
     * @param {string} value - The data value of the selected option.
     * @param {string} text - The display text of the selected option.
     */
    selectDropdownOption(value, text) {
        this.selectedQuizTypeSpan.textContent = text;
        this.selectedQuizType = value; // Update the state variable
        this.hideDropdown();
        this.filterQuizNavigation(); // Apply the filter
    }

    /**
     * Filters the quiz navigation list based on the selected type from the custom dropdown.
     */
    filterQuizNavigation() {
        this.loadQuizNavigation(this.selectedQuizType); // Use the stored selected type
    }

    /**
     * Loads and displays the quiz navigation list, optionally filtered by type.
     * @param {string} filterType - The type to filter by, or 'all' for no filter.
     */
    loadQuizNavigation(filterType = 'all') {
        this.quizNav.innerHTML = '';
        const filteredQuizzes = quizData.questions.filter(quiz => {
            return filterType === 'all' || quiz.type === filterType;
        });

        if (filteredQuizzes.length === 0 && quizData.questions.length > 0) {
            // If current filter yields no results, reset to 'all' and reload
            this.selectedQuizType = 'all'; 
            this.selectedQuizTypeSpan.textContent = '全部题型';
            this.loadQuizNavigation('all');
            return;
        }
        if (filteredQuizzes.length === 0) {
            // No quizzes at all or no quizzes after resetting filter
            const noQuizzesItem = document.createElement('li');
            noQuizzesItem.textContent = '没有可用的测验';
            noQuizzesItem.style.cursor = 'default';
            noQuizzesItem.style.opacity = '0.7';
            this.quizNav.appendChild(noQuizzesItem);
            this.resetQuizDisplay(); // Clear main content
            return;
        }

        filteredQuizzes.forEach((quiz, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${quiz.title}`;
            listItem.dataset.originalIndex = quizData.questions.indexOf(quiz); // Store original index
            listItem.title = quiz.title;
            listItem.addEventListener('click', () => {
                this.loadQuiz(parseInt(listItem.dataset.originalIndex));
            });
            this.quizNav.appendChild(listItem);
        });

        // Determine which quiz to load after filtering
        let targetQuizIndex = this.currentQuizIndex;
        const currentQuizExistsInFiltered = filteredQuizzes.some(q => quizData.questions.indexOf(q) === targetQuizIndex);

        // If the current quiz is no longer in the filtered list, load the first one
        if (!currentQuizExistsInFiltered && filteredQuizzes.length > 0) {
            targetQuizIndex = quizData.questions.indexOf(filteredQuizzes[0]); // Load the first quiz in the filtered list
        } else if (filteredQuizzes.length === 0) {
                targetQuizIndex = -1; // No quizzes to load
        }

        // If after filtering, the currentQuizIndex is out of bounds or no quizzes,
        // try to set it to 0 if there are any quizzes.
        // This specifically handles the "last item not showing" if the user was on it
        // and then filtered, or if the initial load was on an out-of-bounds index.
        if (quizData.questions.length > 0 && (targetQuizIndex === -1 || targetQuizIndex >= quizData.questions.length)) {
            targetQuizIndex = 0; // Default to first quiz if current is invalid
        }


        if (targetQuizIndex !== -1) {
            this.loadQuiz(targetQuizIndex);
        } else {
            this.resetQuizDisplay(); // Clear main content if no quiz can be loaded
        }
    }

    /**
     * Resets the main quiz display area to a blank state.
     */
    resetQuizDisplay() {
        this.quizTitleElement.textContent = '';
        this.quizTypeElement.textContent = '';
        this.questionMediaContainer.innerHTML = ''; // Clear media
        this.quizContentElement.innerHTML = '';
        this.optionsContainer.innerHTML = '';
        this.startQuizBtn.disabled = true;
        this.submitQuizBtn.disabled = true;
        this.scoreDisplay.textContent = '正确率: 0/0 (0%)';
        this.timerDisplay.textContent = '时间: 00:00';
        this.currentVideoElement = null; // Clear video reference
    }


    /**
     * Resets the quiz to its initial unstarted state.
     * This includes timer, score, user answers, and button states.
     */
    resetQuizState() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.startTime = null;
        this.quizStarted = false;
        this.quizSubmitted = false;
        this.userAnswers = {}; // Clear user answers for the new attempt
        this.draggedLeftItemValue = null; // Reset dragged item for matching

        // Stop video and disable controls if present
        if (this.currentVideoElement) {
            this.currentVideoElement.pause();
            this.currentVideoElement.currentTime = 0; // Reset video to start
            this.currentVideoElement.controls = false; // Disable controls
        }
        this.currentVideoElement = null; // Clear reference


        // Reset button states and displays
        this.disableOptions(); // This also clears existing answer highlights/explanations
        this.startQuizBtn.disabled = false;
        this.submitQuizBtn.disabled = true;
        this.submitQuizBtn.textContent = '交卷'; // Chinese for button
        this.scoreDisplay.textContent = '正确率: 0/0 (0%)';
        this.timerDisplay.textContent = '时间: 00:00';

        // Clear question media and content
        this.questionMediaContainer.innerHTML = '';
        this.quizContentElement.innerHTML = '';
        this.optionsContainer.innerHTML = '';

        // Remove highlight from question numbers in content
        this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
            span.classList.remove('highlighted-question-num');
        });
    }


    /**
     * Loads and displays a specific quiz based on its original index in quizData.questions.
     * @param {number} originalIndex - The original index of the quiz in quizData.questions.
     */
    loadQuiz(originalIndex) {
        this.resetQuizState(); // Reset state before loading new quiz content

        this.currentQuizIndex = originalIndex;
        const currentQuiz = quizData.questions[this.currentQuizIndex];

        // Update active state in sidebar navigation
        Array.from(this.quizNav.children).forEach(li => {
            li.classList.remove('active');
            if (parseInt(li.dataset.originalIndex) === this.currentQuizIndex) {
                li.classList.add('active');
            }
        });

        this.quizTitleElement.textContent = currentQuiz.title;
        this.quizTypeElement.textContent = `类型: ${currentQuiz.type} (${this.mapQuestionTypeToChinese(currentQuiz.questionType)})`;
        
        // Render media if available
        this.questionMediaContainer.innerHTML = ''; // Clear previous media
        if (currentQuiz.mediaUrl && currentQuiz.mediaType) {
            if (currentQuiz.mediaType === 'video') {
                const videoElement = document.createElement('video');
                // Initially set controls to false. They will be enabled upon starting the quiz.
                videoElement.controls = false; 
                videoElement.classList.add('question-media-video');
                videoElement.src = currentQuiz.mediaUrl;
                videoElement.innerHTML = '您的浏览器不支持视频播放。';
                videoElement.autoplay = false; // Ensure it doesn't autoplay before `startQuiz`
                this.questionMediaContainer.appendChild(videoElement);
                this.currentVideoElement = videoElement; // Store reference to the video element
            }
            // Add more media types (image, audio) here if needed in the future
        }

        // Format quiz content for question number highlighting (primarily for single-choice/cloze)
        let formattedContent = currentQuiz.content || ''; // Ensure content exists
        if (currentQuiz.questionType === 'single-choice' || currentQuiz.questionType === 'fill-in-blank') { 
            const optionsToHighlight = currentQuiz.questionType === 'single-choice' ? 
                currentQuiz.options : currentQuiz.options[0].blanks; // Use blanks for fill-in-blank

            optionsToHighlight.forEach((item, itemIndex) => {
                const questionNumText = item.label || item.question; // Use label for blanks, question for single-choice
                const questionNumMatch = questionNumText.match(/\d+/);
                if (questionNumMatch) {
                    const questionNum = questionNumMatch[0];
                    // More robust regex for question numbers like "1．", "(7)", "96.", "(1)"
                    const fullQuestionMatch = new RegExp(`(?<!<span[^>]*?>)(${this.escapeRegExp(questionNumText)})(?!<\\/span>)`, 'g');

                    if (formattedContent.match(fullQuestionMatch)) {
                        formattedContent = formattedContent.replace(fullQuestionMatch, `<span class="question-num-in-text" data-qindex="${itemIndex}">$&</span>`);
                    } else {
                        // Fallback for cases where full question doesn't match directly, try just the number
                        const simpleNumRegex = new RegExp(`(?<!<span[^>]*?>)(\\b${questionNum}\\b[\\.\\uff0e)]?|\\(${questionNum}\\))(?!<\\/span>)`, 'g');
                        formattedContent = formattedContent.replace(simpleNumRegex, `<span class="question-num-in-text" data-qindex="${itemIndex}">$&</span>`);
                    }
                }
            });
        }
        this.quizContentElement.innerHTML = formattedContent;


        // Render options based on question type
        switch (currentQuiz.questionType) {
            case 'single-choice':
            case 'multi-choice':
            case 'true-false':
                this.renderChoiceBasedQuestions(currentQuiz);
                break;
            case 'fill-in-blank':
                this.renderFillInBlankQuestion(currentQuiz);
                break;
            case 'matching':
                this.renderMatchingQuestion(currentQuiz);
                break;
            default:
                this.optionsContainer.innerHTML = '<p>Unsupported question type.</p>';
                this.startQuizBtn.disabled = true;
                this.submitQuizBtn.disabled = true;
                break;
        }

        // Attach click listeners to question number spans if present
        this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
            span.addEventListener('click', (event) => {
                const qIndex = parseInt(event.target.dataset.qindex);
                const targetBlock = this.optionsContainer.querySelector(`.fill-in-blank-input[data-blank-index="${qIndex}"]`) || 
                                    this.optionsContainer.querySelector(`.question-block[data-question-index="${qIndex}"]`); // Fallback for general question blocks
                if (targetBlock) {
                    targetBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    // Optional: temporarily highlight the block
                    targetBlock.style.border = '2px solid #87CEEB';
                    setTimeout(() => {
                        targetBlock.style.border = '1px solid transparent';
                    }, 1000);
                }
            });
        });

        // If quiz was previously submitted, apply its state
        if (this.quizScores[currentQuiz.id]) {
            this.applySubmittedState();
        }
    }

    /**
     * Renders single-choice, multi-choice, and true-false questions.
     * @param {object} quizData - The current quiz object.
     */
    renderChoiceBasedQuestions(quizData) {
        quizData.options.forEach((option, optionIndex) => {
            const questionBlockDiv = document.createElement('div');
            questionBlockDiv.classList.add('question-block');
            questionBlockDiv.dataset.questionIndex = optionIndex;
            // Store the correct answer directly for simpler access during submission
            questionBlockDiv.dataset.correctAnswer = JSON.stringify(option.answer); 

            const questionSubTitle = document.createElement('div');
            questionSubTitle.classList.add('question-sub-title');
            questionSubTitle.textContent = option.question;

            const choicesWrapper = document.createElement('div');
            choicesWrapper.classList.add('choices-wrapper');

            Object.keys(option.choices).forEach(choiceKey => {
                const choiceItemDiv = document.createElement('div');
                choiceItemDiv.classList.add('choice-item');
                choiceItemDiv.dataset.choice = choiceKey;
                choiceItemDiv.textContent = `${choiceKey}. ${option.choices[choiceKey]}`;
                choicesWrapper.appendChild(choiceItemDiv);

                choiceItemDiv.addEventListener('click', () => {
                    if (!this.quizStarted || this.quizSubmitted) return;
                    this.handleChoiceAnswer(quizData.questionType, optionIndex, choiceKey, questionBlockDiv);
                });
            });

            const questionExplanationDiv = document.createElement('div');
            questionExplanationDiv.classList.add('question-explanation');
            questionExplanationDiv.style.display = 'none';

            questionBlockDiv.appendChild(questionSubTitle);
            questionBlockDiv.appendChild(choicesWrapper);
            questionBlockDiv.appendChild(questionExplanationDiv);
            this.optionsContainer.appendChild(questionBlockDiv);
        });
    }

    /**
     * Handles user selection for choice-based questions (single, multi, true-false).
     * @param {string} type - The question type ("single-choice", "multi-choice", "true-false").
     * @param {number} questionIndex - The index of the sub-question.
     * @param {string} selectedChoice - The choice key (e.g., 'A', 'B').
     * @param {HTMLElement} questionBlockDiv - The DOM element for the current question block.
     */
    handleChoiceAnswer(type, questionIndex, selectedChoice, questionBlockDiv) {
        if (!this.quizStarted || this.quizSubmitted) return;
        if (type === 'single-choice' || type === 'true-false') {
            // For single-choice/true-false, only one option can be selected
            questionBlockDiv.querySelectorAll('.choice-item').forEach(choiceElement => {
                choiceElement.classList.remove('selected-choice');
            });
            questionBlockDiv.querySelector(`.choice-item[data-choice="${selectedChoice}"]`).classList.add('selected-choice');
            this.userAnswers[questionIndex] = selectedChoice; // Store single string
        } else if (type === 'multi-choice') {
            // For multi-choice, toggle selection
            const currentSelectionElement = questionBlockDiv.querySelector(`.choice-item[data-choice="${selectedChoice}"]`);
            currentSelectionElement.classList.toggle('selected-choice');

            let currentAnswers = this.userAnswers[questionIndex] || [];
            if (currentSelectionElement.classList.contains('selected-choice')) {
                if (!currentAnswers.includes(selectedChoice)) {
                    currentAnswers.push(selectedChoice);
                }
            } else {
                currentAnswers = currentAnswers.filter(ans => ans !== selectedChoice);
            }
            this.userAnswers[questionIndex] = currentAnswers; // Store array of choices
        }

        // Update highlighted question number in content
        this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
            if (parseInt(span.dataset.qindex) === questionIndex) {
                span.classList.add('highlighted-question-num');
            } else {
                span.classList.remove('highlighted-question-num');
            }
        });
        questionBlockDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Renders a fill-in-blank question, supporting multiple blanks.
     * @param {object} quizData - The current quiz object.
     */
    renderFillInBlankQuestion(quizData) {
        // Fill-in-blank usually has only one "option" object for the entire blank sentence
        const option = quizData.options[0]; 
        const optionIndex = 0; // Always 0 for fill-in-blank as it's a single question type for submission

        const questionBlockDiv = document.createElement('div');
        questionBlockDiv.classList.add('question-block');
        questionBlockDiv.dataset.questionIndex = optionIndex;
        questionBlockDiv.dataset.correctAnswer = JSON.stringify(option.answer); // Store answer array as string

        const questionSubTitle = document.createElement('div');
        questionSubTitle.classList.add('question-sub-title');
        // Use the question text from options, not the main content which might be the full text
        questionSubTitle.textContent = option.question; 

        const fillInBlankContentWrapper = document.createElement('div');
        fillInBlankContentWrapper.classList.add('fill-in-blank-container');

        this.userAnswers[optionIndex] = this.userAnswers[optionIndex] || new Array(option.blankCount).fill(''); // Initialize user answers array for blanks

        // Iterate through the 'blanks' array in the option data to create specific inputs
        option.blanks.forEach((blankData, i) => {
            const blankLabel = document.createElement('span');
            blankLabel.classList.add('fill-in-blank-text-part');
            blankLabel.textContent = `${blankData.label} `; // Display label from data (e.g., "(1)")
            fillInBlankContentWrapper.appendChild(blankLabel);

            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.classList.add('fill-in-blank-input');
            inputElement.placeholder = blankData.placeholder; // Use placeholder from data
            inputElement.dataset.blankIndex = i; // Store which blank this input corresponds to
            inputElement.disabled = true; // Initially disabled

            // Restore user's previous answer if available
            if (this.userAnswers[optionIndex][i]) {
                inputElement.value = this.userAnswers[optionIndex][i];
            }

            inputElement.addEventListener('input', (event) => {
                if (!this.quizStarted || this.quizSubmitted) return;
                const blankIdx = parseInt(event.target.dataset.blankIndex);
                this.userAnswers[optionIndex][blankIdx] = event.target.value.trim();
            });
            fillInBlankContentWrapper.appendChild(inputElement);
        });

        const questionExplanationDiv = document.createElement('div');
        questionExplanationDiv.classList.add('question-explanation');
        questionExplanationDiv.style.display = 'none';

        questionBlockDiv.appendChild(questionSubTitle);
        questionBlockDiv.appendChild(fillInBlankContentWrapper);
        questionBlockDiv.appendChild(questionExplanationDiv);
        this.optionsContainer.appendChild(questionBlockDiv);
    }

    /**
     * Renders a matching question.
     * @param {object} quizData - The current quiz object.
     */
    renderMatchingQuestion(quizData) {
        // Matching question typically has only one "option" object for all pairs
        const option = quizData.options[0];
        const optionIndex = 0; // Always 0 for matching

        const questionBlockDiv = document.createElement('div');
        questionBlockDiv.classList.add('question-block');
        questionBlockDiv.dataset.questionIndex = optionIndex;
        // Store the full answer object for this question
        questionBlockDiv.dataset.correctAnswer = JSON.stringify(option.answer);

        const questionSubTitle = document.createElement('div');
        questionSubTitle.classList.add('question-sub-title');
        questionSubTitle.textContent = option.question;

        const matchingContainer = document.createElement('div');
        matchingContainer.classList.add('matching-container');

        const leftColumn = document.createElement('div');
        leftColumn.classList.add('matching-column', 'left-column');
        const rightColumn = document.createElement('div');
        rightColumn.classList.add('matching-column', 'right-column');

        // Shuffle pairs for display to ensure randomness (optional, but good practice)
        const shuffledPairs = [...option.pairs];
        // Separate left and right items, shuffle them individually
        const leftItems = shuffledPairs.map(p => p.left).sort(() => Math.random() - 0.5);
        const rightItems = shuffledPairs.map(p => p.right).sort(() => Math.random() - 0.5);

        leftItems.forEach(leftValue => {
            const leftItem = document.createElement('div');
            leftItem.classList.add('matching-item', 'left-item');
            leftItem.dataset.value = leftValue;
            leftItem.textContent = leftValue;
            leftItem.draggable = true; // Make left items draggable

            // Drag event listeners for the left item
            leftItem.addEventListener('dragstart', (event) => this.handleDragStart(event, leftValue));
            leftItem.addEventListener('dragend', (event) => {
                event.target.classList.remove('dragging'); // Remove dragging class
            });

            leftColumn.appendChild(leftItem);
        });

        rightItems.forEach(rightValue => {
            const rightItem = document.createElement('div');
            rightItem.classList.add('matching-item', 'right-item');
            rightItem.dataset.value = rightValue;
            rightItem.textContent = rightValue;
            
            // Drop event listeners for the right item
            rightItem.addEventListener('dragover', (event) => this.handleDragOver(event));
            rightItem.addEventListener('dragleave', (event) => this.handleDragLeave(event));
            rightItem.addEventListener('drop', (event) => this.handleDrop(event, optionIndex, rightItem));

            rightColumn.appendChild(rightItem);
        });

        matchingContainer.appendChild(leftColumn);
        matchingContainer.appendChild(rightColumn);

        // Add the display area for user's matched pairs
        const userPairsDisplayDiv = document.createElement('div');
        userPairsDisplayDiv.classList.add('matching-user-pairs-display');
        // Changed text from "已作答匹配：" to "匹配操作草稿："
        userPairsDisplayDiv.innerHTML = '<h4>匹配操作草稿：</h4><div id="matched-pairs-list"></div>'; // Sub-container for list
        
        const questionExplanationDiv = document.createElement('div');
        questionExplanationDiv.classList.add('question-explanation');
        questionExplanationDiv.style.display = 'none';

        questionBlockDiv.appendChild(questionSubTitle);
        questionBlockDiv.appendChild(matchingContainer);
        questionBlockDiv.appendChild(userPairsDisplayDiv); // Append the new display area
        questionBlockDiv.appendChild(questionExplanationDiv);
        this.optionsContainer.appendChild(questionBlockDiv);

        // Initialize user answers for matching as an object to store pairs
        this.userAnswers[optionIndex] = this.userAnswers[optionIndex] || {};

        // Initially render the user pairs display based on existing answers (if any)
        this.updateMatchingUserPairsDisplay(optionIndex);

        // If previously submitted, apply the saved state
        if (this.quizScores[quizData.id] && this.quizScores[quizData.id].userAnswers && this.quizScores[quizData.id].userAnswers[optionIndex]) {
            const savedUserPairs = this.quizScores[quizData.id].userAnswers[optionIndex];
            for (const leftVal in savedUserPairs) {
                const rightVal = savedUserPairs[leftVal];
                const leftElem = questionBlockDiv.querySelector(`.left-item[data-value="${leftVal}"]`);
                const rightElem = questionBlockDiv.querySelector(`.right-item[data-value="${rightVal}"]`);
                if (leftElem && rightElem) {
                    // Apply 'connected' state for correct pairs, or 'incorrect' for wrong ones
                    const correctMappings = JSON.parse(questionBlockDiv.dataset.correctAnswer);
                    if (correctMappings[leftVal] === rightVal) {
                        leftElem.classList.add('matching-connected');
                        rightElem.classList.add('matching-connected');
                    } else {
                        leftElem.classList.add('matching-incorrect');
                        rightElem.classList.add('matching-incorrect');
                        // Highlight the correct right answer if user's was wrong
                        const actualCorrectRightElem = questionBlockDiv.querySelector(`.right-item[data-value="${correctMappings[leftVal]}"]`);
                        if (actualCorrectRightElem) {
                            actualCorrectRightElem.classList.add('correct-choice'); // Using existing class for highlighting
                        }
                    }
                    leftElem.classList.add('disabled');
                    rightElem.classList.add('disabled');
                    leftElem.draggable = false; // Disable dragging after submission
                }
            }
        }
    }

    /**
     * Handles the dragstart event for left matching items.
     * @param {DragEvent} event - The drag event.
     * @param {string} value - The value of the dragged item.
     */
    handleDragStart(event, value) {
        if (!this.quizStarted || this.quizSubmitted) {
            event.preventDefault(); // Prevent dragging if quiz not started or submitted
            return;
        }
        this.draggedLeftItemValue = value;
        event.dataTransfer.setData('text/plain', value); // Set data for drag operation
        event.target.classList.add('dragging'); // Add visual feedback for dragging

        // If this left item was already paired, remove the old pairing from userAnswers
        // This allows re-pairing and dynamic updates.
        const currentQuiz = quizData.questions[this.currentQuizIndex];
        const optionIndex = 0; // Matching is always optionIndex 0
        if (this.userAnswers[optionIndex] && this.userAnswers[optionIndex][value]) {
            const oldRightValue = this.userAnswers[optionIndex][value];
            delete this.userAnswers[optionIndex][value]; // Remove the old pair

            // Remove connected/disabled classes from the previously matched right item
            const questionBlockDiv = event.target.closest('.question-block');
            if (questionBlockDiv) {
                const oldRightElem = questionBlockDiv.querySelector(`.right-item[data-value="${oldRightValue}"]`);
                if (oldRightElem) {
                    oldRightElem.classList.remove('matching-connected', 'disabled');
                    oldRightElem.style.pointerEvents = 'auto'; // Re-enable pointer events
                }
            }
            this.updateMatchingUserPairsDisplay(optionIndex); // Update display
        }
    }

    /**
     * Handles the dragover event for right matching items (drop targets).
     * @param {DragEvent} event - The drag event.
     */
    handleDragOver(event) {
        if (!this.quizStarted || this.quizSubmitted) {
            event.preventDefault();
            return;
        }
        event.preventDefault(); // Necessary to allow dropping
        event.dataTransfer.dropEffect = 'move'; // Visual feedback for allowed drop
        event.target.classList.add('drag-over'); // Highlight drop target
    }

    /**
     * Handles the dragleave event for right matching items.
     * @param {DragEvent} event - The drag event.
     */
    handleDragLeave(event) {
        event.target.classList.remove('drag-over'); // Remove highlight
    }

    /**
     * Handles the drop event for right matching items.
     * @param {DragEvent} event - The drag event.
     * @param {number} questionIndex - The index of the matching question.
     * @param {HTMLElement} dropTargetItem - The right item element that was dropped on.
     */
    handleDrop(event, questionIndex, dropTargetItem) {
        if (!this.quizStarted || this.quizSubmitted) return;

        event.preventDefault();
        event.target.classList.remove('drag-over'); // Remove highlight

        const draggedValue = event.dataTransfer.getData('text/plain'); // Get value of the dragged left item
        const droppedOnValue = dropTargetItem.dataset.value; // Get value of the right item

        // Check if the dragged item is actually a left item and is from the current quiz
        if (draggedValue && this.draggedLeftItemValue === draggedValue) {
            // Update userAnswers for the matching question (index 0)
            this.userAnswers[questionIndex] = this.userAnswers[questionIndex] || {};
            this.userAnswers[questionIndex][draggedValue] = droppedOnValue;

            // Visually mark the dropped left item as connected/disabled
            const questionBlockDiv = dropTargetItem.closest('.question-block');
            if (questionBlockDiv) {
                const draggedLeftElem = questionBlockDiv.querySelector(`.left-item[data-value="${draggedValue}"]`);
                if (draggedLeftElem) {
                    draggedLeftElem.classList.add('matching-connected');
                    draggedLeftElem.classList.add('disabled');
                    draggedLeftElem.draggable = false; // Make it non-draggable once connected
                }
            }
            dropTargetItem.classList.add('matching-connected'); // Mark right item as connected
            dropTargetItem.classList.add('disabled'); // Disable the target right item
            dropTargetItem.style.pointerEvents = 'none'; // Ensure it's not clickable

            this.updateMatchingUserPairsDisplay(questionIndex); // Update the user pairs display
        }
        this.draggedLeftItemValue = null; // Reset dragged item value
    }

    /**
     * Updates the display area showing the user's current matched pairs for a matching question.
     * @param {number} questionIndex - The index of the matching question.
     */
    updateMatchingUserPairsDisplay(questionIndex) {
        const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${questionIndex}"]`);
        if (!questionBlockDiv) return;

        const matchedPairsList = questionBlockDiv.querySelector('#matched-pairs-list');
        if (!matchedPairsList) return;

        matchedPairsList.innerHTML = ''; // Clear previous display

        const userMappings = this.userAnswers[questionIndex] || {};
        const currentQuiz = quizData.questions[this.currentQuizIndex];
        // No need for correctMappings here, just displaying user's current attempt

        const allLeftItems = currentQuiz.options[0].pairs.map(p => p.left);

        allLeftItems.forEach(leftValue => {
            const rightValue = userMappings[leftValue];
            if (rightValue) { // Only display if a pair exists for this left item
                const pairDisplay = document.createElement('div');
                pairDisplay.classList.add('matched-pair-item-display');
                
                // Left column for the pair description
                const pairDescription = document.createElement('div');
                pairDescription.classList.add('pair-description');
                pairDescription.innerHTML = `<span class="left-display">${leftValue}</span> <i class="fas fa-arrow-right"></i> <span class="right-display">${rightValue}</span>`;
                pairDisplay.appendChild(pairDescription);

                // Right column for the remove button and text
                const removeAction = document.createElement('div');
                removeAction.classList.add('remove-action');
                
                const removeBtn = document.createElement('button');
                removeBtn.classList.add('matched-pair-remove-btn');
                removeBtn.innerHTML = '<i class="fas fa-times"></i>'; // Font Awesome close icon
                removeBtn.title = `移除 ${leftValue} - ${rightValue} 匹配`; // Chinese title for button
                removeBtn.addEventListener('click', () => {
                    if (!this.quizStarted || this.quizSubmitted) return;

                    // Re-enable the left and right items
                    const leftElem = questionBlockDiv.querySelector(`.left-item[data-value="${leftValue}"]`);
                    const rightElem = questionBlockDiv.querySelector(`.right-item[data-value="${rightValue}"]`);
                    
                    if (leftElem) {
                        leftElem.classList.remove('matching-connected', 'disabled');
                        leftElem.style.pointerEvents = 'auto';
                        leftElem.draggable = true; // Make it draggable again
                    }
                    if (rightElem) {
                        rightElem.classList.remove('matching-connected', 'disabled');
                        rightElem.style.pointerEvents = 'auto';
                    }

                    // Remove from userAnswers
                    delete this.userAnswers[questionIndex][leftValue];
                    this.updateMatchingUserPairsDisplay(questionIndex); // Update the display
                });
                
                const removeText = document.createElement('span');
                removeText.textContent = '移除匹配'; // Text for remove action
                removeAction.appendChild(removeBtn);
                removeAction.appendChild(removeText);
                pairDisplay.appendChild(removeAction);

                matchedPairsList.appendChild(pairDisplay);
            }
        });

        // If no pairs are matched, show a message
        if (Object.keys(userMappings).length === 0) {
            matchedPairsList.innerHTML = '<p style="text-align: center; color: #aaa;">暂无匹配关系</p>'; // Chinese for display
        }
    }


    /**
     * Starts the quiz timer and enables options.
     */
    startQuiz() {
        if (this.quizStarted) return;
        this.quizStarted = true;
        this.startTime = Date.now();
        this.timerInterval = setInterval(this.updateTimer.bind(this), 1000);
        this.startQuizBtn.disabled = true;
        this.submitQuizBtn.disabled = false;
        this.submitQuizBtn.textContent = '交卷'; // Chinese for button
        this.enableOptions();
        this.scoreDisplay.textContent = '正确率: 未作答'; // Chinese for display

        // Play video and enable controls if present
        if (this.currentVideoElement) {
            this.currentVideoElement.controls = true; // Enable video controls
            this.currentVideoElement.play().catch(e => console.error("Video autoplay prevented:", e));
        }

        // Hide sidebar automatically on quiz start
        if (!this.sidebar.classList.contains('hidden')) {
            this.sidebar.classList.add('hidden');
            this.body.classList.add('sidebar-hidden');
            this.showSidebarIconContainer.style.display = 'flex';
        }
    }

    /**
     * Updates the timer display every second.
     */
    updateTimer() {
        const elapsedTime = Date.now() - this.startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        this.timerDisplay.textContent = `时间: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Chinese for display
    }

    /**
     * Enables all quiz options for user selection based on question type.
     */
    enableOptions() {
        const currentQuiz = quizData.questions[this.currentQuizIndex];
        if (!currentQuiz) return;

        if (currentQuiz.questionType === 'fill-in-blank') {
            this.optionsContainer.querySelectorAll('.fill-in-blank-input').forEach(input => {
                input.disabled = false;
                input.classList.remove('disabled');
            });
        } else if (currentQuiz.questionType === 'matching') {
                this.optionsContainer.querySelectorAll('.matching-item').forEach(item => {
                item.classList.remove('disabled'); // Remove disabled state
                item.style.pointerEvents = 'auto'; // Re-enable pointer events
                item.classList.remove('matching-connected', 'matching-incorrect', 'correct-choice'); // Clear any past result highlights
                // Ensure draggable is true for left items
                if (item.classList.contains('left-item')) {
                    item.draggable = true;
                }
            });
            // Show user pairs display
            const matchingQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
            if (matchingQuestionBlockDiv) {
                const userPairsDisplay = matchingQuestionBlockDiv.querySelector('.matching-user-pairs-display');
                if (userPairsDisplay) {
                    userPairsDisplay.style.display = 'block'; // Show the user matching display area
                }
            }

        } else { // single-choice, multi-choice, true-false
            this.optionsContainer.querySelectorAll('.choice-item').forEach(choiceItem => {
                choiceItem.classList.remove('disabled');
            });
        }
    }

    /**
     * Disables all quiz options and hides explanations.
     */
    disableOptions() {
        const currentQuiz = quizData.questions[this.currentQuizIndex];
        if (!currentQuiz) return;

        // Pause and disable video controls if present
        if (this.currentVideoElement) {
            this.currentVideoElement.pause(); // Pause the video
            // Do NOT reset currentTime here, allow user to resume from where they left off if they re-attempt
            this.currentVideoElement.controls = false; // Disable controls
        }

        if (currentQuiz.questionType === 'fill-in-blank') {
            this.optionsContainer.querySelectorAll('.fill-in-blank-input').forEach(input => {
                input.disabled = true;
                input.classList.add('disabled');
                input.classList.remove('correct', 'incorrect'); // Remove previous result highlighting
            });
        } else if (currentQuiz.questionType === 'matching') {
                this.optionsContainer.querySelectorAll('.matching-item').forEach(item => {
                item.classList.add('disabled');
                item.style.pointerEvents = 'none'; // Absolutely prevent clicks
                item.draggable = false; // Disable dragging
                item.classList.remove('matching-selected-left', 'matching-selected-right', 'matching-connected', 'matching-incorrect', 'correct-choice'); // Clear matching specific states
            });
            // Hide user pairs display
            const matchingQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
            if (matchingQuestionBlockDiv) {
                const userPairsDisplay = matchingQuestionBlockDiv.querySelector('.matching-user-pairs-display');
                if (userPairsDisplay) {
                    userPairsDisplay.style.display = 'none'; // Hide the user matching display area during review/disabled state
                }
            }

        }
        else { // single-choice, multi-choice, true-false
            this.optionsContainer.querySelectorAll('.choice-item').forEach(choiceItem => {
                choiceItem.classList.add('disabled');
                choiceItem.classList.remove('selected-choice', 'correct-choice', 'incorrect-choice');
            });
        }
        this.optionsContainer.querySelectorAll('.question-explanation').forEach(explanationDiv => {
            explanationDiv.style.display = 'none';
        });
        this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
            span.classList.remove('highlighted-question-num');
        });
    }

    /**
     * Handles quiz submission or re-attempt logic.
     */
    handleSubmitReattempt() {
        const currentQuiz = quizData.questions[this.currentQuizIndex];

        // Added a check to prevent submission if not started
        if (!this.quizStarted && !this.quizSubmitted) {
            console.warn("Quiz not started yet. Please click '开始作答' first.");
            return;
        }

        if (!this.quizSubmitted) {
            // Logic for Initial Submission
            clearInterval(this.timerInterval);
            this.quizSubmitted = true;
            this.startQuizBtn.disabled = true; // Disable Start button
            this.submitQuizBtn.disabled = true; // Temporarily disable Submit button during processing
            this.disableOptions(); // Disable all options after submission

            let correctCount = 0;
            let totalQuestions = 0;

            this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
                span.classList.remove('highlighted-question-num');
            });

            // Evaluate answers based on question type
            switch (currentQuiz.questionType) {
                case 'single-choice':
                case 'true-false':
                    totalQuestions = currentQuiz.options.length;
                    currentQuiz.options.forEach((optionData, optionIndex) => {
                        const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                        const correctAnswer = optionData.answer;
                        const userAnswer = this.userAnswers[optionIndex];
                        
                        let isCorrect = (userAnswer !== undefined && String(userAnswer) === String(correctAnswer));

                        questionBlockDiv.querySelectorAll('.choice-item').forEach(choiceElement => {
                            const choiceKey = choiceElement.dataset.choice;
                            choiceElement.classList.remove('selected-choice', 'correct-choice', 'incorrect-choice');
                            
                            if (String(choiceKey) === String(correctAnswer)) { // Highlight correct answer
                                choiceElement.classList.add('correct-choice');
                            }
                            if (userAnswer !== undefined && String(userAnswer) === String(choiceKey) && !isCorrect) { // Highlight incorrect user answer
                                choiceElement.classList.add('incorrect-choice');
                            }
                        });

                        if (isCorrect) {
                            correctCount++;
                        }
                        this.displayExplanation(questionBlockDiv, userAnswer, correctAnswer, optionData.explanation, optionData.choices, isCorrect, currentQuiz.questionType);
                    });
                    break;

                case 'multi-choice':
                    totalQuestions = currentQuiz.options.length;
                    currentQuiz.options.forEach((optionData, optionIndex) => {
                        const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                        // Ensure correctAnswers is an array and sorted for consistent comparison
                        const correctAnswers = Array.isArray(optionData.answer) ? optionData.answer.sort() : [];
                        const userAnswers = (this.userAnswers[optionIndex] || []).sort();
                        
                        // Check if arrays are identical (same elements, same count)
                        let isCorrect = (correctAnswers.length === userAnswers.length &&
                                         correctAnswers.every((val, idx) => val === userAnswers[idx]));

                        questionBlockDiv.querySelectorAll('.choice-item').forEach(choiceElement => {
                            const choiceKey = choiceElement.dataset.choice;
                            choiceElement.classList.remove('selected-choice', 'correct-choice', 'incorrect-choice'); // Clear selected first

                            if (correctAnswers.includes(choiceKey)) { // Highlight all correct answers
                                choiceElement.classList.add('correct-choice');
                            }
                            // Highlight user's incorrect selections (chosen but not correct, or not chosen but correct)
                            if (userAnswers.includes(choiceKey) && !correctAnswers.includes(choiceKey)) {
                                choiceElement.classList.add('incorrect-choice');
                            }
                            // Also consider correct answers not selected by the user as incorrect (visually)
                            if (!userAnswers.includes(choiceKey) && correctAnswers.includes(choiceKey)) {
                                // This case is already covered by correct-choice, but if the user missed it,
                                // we want to ensure the correct answer is still highlighted correctly.
                                // No additional class needed here, `correct-choice` is enough.
                            }
                        });

                        if (isCorrect) {
                            correctCount++;
                        }
                        this.displayExplanation(questionBlockDiv, userAnswers, correctAnswers, optionData.explanation, optionData.choices, isCorrect, currentQuiz.questionType);
                    });
                    break;

                case 'fill-in-blank':
                    // For multi-blank fill-in, totalQuestions is blankCount
                    totalQuestions = currentQuiz.options[0].blankCount;
                    const fillInBlankOptionData = currentQuiz.options[0];
                    const fillInBlankQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`); // Only one option for fill-in-blank
                    const correctAnswersArray = fillInBlankOptionData.answer;
                    const userInputsArray = this.userAnswers[0] || new Array(totalQuestions).fill(''); // Ensure userInputsArray exists and is correct length

                    let fillInBlankExplanationContent = `<div class="explanation-item">`;
                    
                    for (let i = 0; i < totalQuestions; i++) {
                        const inputElement = fillInBlankQuestionBlockDiv.querySelector(`.fill-in-blank-input[data-blank-index="${i}"]`);
                        const correctAnswer = (correctAnswersArray[i] || '').toLowerCase().trim();
                        const userInput = (userInputsArray[i] || '').toLowerCase().trim();
                        
                        const isBlankCorrect = (userInput === correctAnswer);

                        inputElement.disabled = true; // Disable input field
                        inputElement.classList.add('disabled');

                        if (isBlankCorrect) {
                            inputElement.classList.add('correct');
                            correctCount++;
                        } else {
                            inputElement.classList.add('incorrect');
                        }

                        fillInBlankExplanationContent += `<p>填空 ${i + 1}: `;
                        fillInBlankExplanationContent += `你的答案: <span class="your-answer">${userInputsArray[i] || '未作答'}</span> `;
                        fillInBlankExplanationContent += isBlankCorrect ? `<i class="fas fa-check-circle explanation-icon" style="color: #28a745;"></i> (正确)<br>` : `<i class="fas fa-times-circle explanation-icon" style="color: #dc3545;"></i> (错误)<br>`;
                        if (!isBlankCorrect) {
                            fillInBlankExplanationContent += `正确答案: <span class="correct-answer">${correctAnswersArray[i]}</span><br>`;
                        }
                        fillInBlankExplanationContent += `</p>`;
                    }
                    fillInBlankExplanationContent += `<span class="explanation-text">解析: ${fillInBlankOptionData.explanation}</span></div>`;
                    fillInBlankQuestionBlockDiv.querySelector('.question-explanation').innerHTML = fillInBlankExplanationContent;
                    fillInBlankQuestionBlockDiv.querySelector('.question-explanation').style.display = 'block';
                    break;

                case 'matching':
                    totalQuestions = currentQuiz.options[0].pairs.length; // Number of pairs is total questions
                    const correctMappings = currentQuiz.options[0].answer; // The object of correct pairs
                    const userMappings = this.userAnswers[0] || {}; // User's matched pairs for the single matching question

                    const matchingQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
                    
                    // Disable all matching items
                    matchingQuestionBlockDiv.querySelectorAll('.matching-item').forEach(item => {
                        item.classList.add('disabled');
                        item.style.pointerEvents = 'none';
                        item.draggable = false; // Disable dragging
                        item.classList.remove('matching-selected-left', 'matching-selected-right', 'dragging', 'drag-over'); // Clear any dragging/selection states
                    });
                    // Hide the user pairs display area during review
                    if (matchingQuestionBlockDiv) { // Ensure matchingQuestionBlockDiv exists before querying
                        const userPairsDisplay = matchingQuestionBlockDiv.querySelector('.matching-user-pairs-display');
                        if (userPairsDisplay) {
                            userPairsDisplay.style.display = 'none';
                        }
                    }


                    let matchingExplanationContent = `<div class="explanation-item"><h4>连线结果：</h4>`;
                    
                    // Iterate over the *correct* mappings to display all correct pairs and compare user answers
                    // Modified to use a flexbox layout for aligning columns correctly
                    matchingExplanationContent += `<div class="matching-explanation-grid">`; // New grid container
                    for (const leftKey in correctMappings) {
                        const expectedRight = correctMappings[leftKey];
                        const userRight = userMappings[leftKey]; // Get user's paired right for this left key
                        
                        const isPairCorrect = (userRight !== undefined && userRight === expectedRight);

                        const leftElem = matchingQuestionBlockDiv.querySelector(`.left-item[data-value="${leftKey}"]`);
                        const userRightElem = matchingQuestionBlockDiv.querySelector(`.right-item[data-value="${userRight}"]`); // User's chosen right
                        const correctRightElem = matchingQuestionBlockDiv.querySelector(`.right-item[data-value="${expectedRight}"]`); // Actual correct right

                        // Apply visual feedback to connected items
                        if (isPairCorrect) {
                            correctCount++;
                            if (leftElem) leftElem.classList.add('matching-connected');
                            if (userRightElem) userRightElem.classList.add('matching-connected');
                        } else {
                            if (leftElem) leftElem.classList.add('matching-incorrect');
                            // If user made a choice, and it's incorrect, mark their choice as incorrect
                            if (userRightElem && userRight) userRightElem.classList.add('matching-incorrect');
                            // Always highlight the correct right answer
                            if (correctRightElem) correctRightElem.classList.add('correct-choice'); // Using existing class for highlighting
                        }

                        // Add explanation for each pair, now using grid for alignment
                        matchingExplanationContent += `
                            <div class="matching-explanation-pair-row ${isPairCorrect ? 'correct' : 'incorrect'}">
                                <span class="explanation-left-side">${leftKey}</span>
                                <span class="explanation-user-answer">${userRight || '未作答'}</span>
                                <span class="explanation-status-icon"><i class="fas ${isPairCorrect ? 'fa-check-circle' : 'fa-times-circle'}" style="color: ${isPairCorrect ? '#28a745' : '#dc3545'};"></i></span>
                                <span class="explanation-correct-answer">正确: ${expectedRight}</span>
                            </div>
                        `;
                    }
                    matchingExplanationContent += `</div>`; // Close matching-explanation-grid
                    matchingExplanationContent += `<span class="explanation-text">解析: ${currentQuiz.options[0].explanation}</span></div>`;
                    matchingQuestionBlockDiv.querySelector('.question-explanation').innerHTML = matchingExplanationContent;
                    matchingQuestionBlockDiv.querySelector('.question-explanation').style.display = 'block';
                    break;
            }


            // Calculate and display overall score
            const accuracyPercentage = totalQuestions === 0 ? 0 : ((correctCount / totalQuestions) * 100).toFixed(2);
            this.scoreDisplay.textContent = `正确率: ${correctCount}/${totalQuestions} (${accuracyPercentage}%)`;

            // Mark quiz as completed in navigation
            const navItem = this.quizNav.querySelector(`li[data-original-index="${this.currentQuizIndex}"]`);
            if (navItem) {
                navItem.classList.add('completed');
            }

            // Store score and user answers for the main quiz ID
            this.quizScores[currentQuiz.id] = {
                correct: correctCount,
                total: totalQuestions,
                percentage: accuracyPercentage,
                time: this.timerDisplay.textContent,
                userAnswers: JSON.parse(JSON.stringify(this.userAnswers)) // Deep copy userAnswers
            };

            // After submission, enable submit button and change its text for re-attempt
            this.submitQuizBtn.disabled = false;
            this.submitQuizBtn.textContent = '重新作答';

        } else {
            // Logic for Re-attempt after Submission
            // Remove saved score and reset completed status in navigation
            delete this.quizScores[currentQuiz.id];
            const navItem = this.quizNav.querySelector(`li[data-original-index="${this.currentQuizIndex}"]`);
            if (navItem) {
                navItem.classList.remove('completed');
            }
            // Reload the current quiz to reset everything to a fresh, unstarted state
            this.loadQuiz(this.currentQuizIndex);
            // No need to set button states here, loadQuiz (via resetQuizState) handles it.
        }
    }

    /**
     * Displays the explanation for a given question block.
     * @param {HTMLElement} questionBlockDiv - The question block DOM element.
     * @param {*} userAnswer - The user's answer (string, array, or object).
     * @param {*} correctAnswer - The correct answer (string, array, or object).
     * @param {string} explanationText - The full explanation text.
     * @param {object} choices - The choices object (for choice-based questions).
     * @param {boolean} isCorrect - Whether the user's answer was correct.
     * @param {string} questionType - The type of question.
     */
    displayExplanation(questionBlockDiv, userAnswer, correctAnswer, explanationText, choices, isCorrect, questionType) {
        const questionExplanationDiv = questionBlockDiv.querySelector('.question-explanation');
        let explanationContent = `<div class="explanation-item">`;

        if (questionType === 'single-choice' || questionType === 'true-false') {
            if (userAnswer !== undefined && choices && choices[userAnswer]) {
                explanationContent += `你的答案: <span class="your-answer">${userAnswer}. ${choices[userAnswer]}</span> `;
                explanationContent += isCorrect ? `<i class="fas fa-check-circle explanation-icon" style="color: #28a745;"></i> (正确)<br>` : `<i class="fas fa-times-circle explanation-icon" style="color: #dc3545;"></i> (错误)<br>`;
                if (!isCorrect) {
                    explanationContent += `正确答案: <span class="correct-answer">${correctAnswer}. ${choices[correctAnswer]}</span><br>`;
                }
            } else {
                explanationContent += `你的答案: <span class="your-answer">未作答</span> <i class="fas fa-times-circle explanation-icon" style="color: #dc3545;"></i> (错误)<br>`;
                explanationContent += `正确答案: <span class="correct-answer">${correctAnswer}. ${choices[correctAnswer]}</span><br>`;
            }
        } else if (questionType === 'multi-choice') {
            const userAnsDisplay = (userAnswer && userAnswer.length > 0) ? 
                userAnswer.map(ans => `${ans}. ${choices[ans]}`).join(', ') : '未作答';
            // Ensure correctAnswer is an array for multi-choice for display consistency
            const correctAnsArray = Array.isArray(correctAnswer) ? correctAnswer : (correctAnswer ? [correctAnswer] : []);
            const correctAnsDisplay = (correctAnsArray.length > 0) ?
                correctAnsArray.map(ans => `${ans}. ${choices[ans]}`).join(', ') : '无';

            explanationContent += `你的答案: <span class="your-answer">${userAnsDisplay}</span> `;
            explanationContent += isCorrect ? `<i class="fas fa-check-circle explanation-icon" style="color: #28a745;"></i> (正确)<br>` : `<i class="fas fa-times-circle explanation-icon" style="color: #dc3545;"></i> (错误)<br>`;
            if (!isCorrect) {
                explanationContent += `正确答案: <span class="correct-answer">${correctAnsDisplay}</span><br>`;
            }
        } else if (questionType === 'fill-in-blank') {
            // For fill-in-blank, explanation is handled in handleSubmitReattempt
            // This branch might not be hit if explanation is built entirely in submit
            console.warn("displayExplanation for fill-in-blank might be redundant here.");
        }
        // Matching explanation is handled within handleSubmitReattempt directly

        if (questionType !== 'fill-in-blank' && questionType !== 'matching') { // Only apply if not handled elsewhere
            explanationContent += `<span class="explanation-text">解析: ${explanationText}</span></div>`;
            questionExplanationDiv.innerHTML = explanationContent;
            questionExplanationDiv.style.display = 'block';
        }
    }


    /**
     * Applies the visual state for a previously submitted quiz.
     */
    applySubmittedState() {
        this.quizSubmitted = true;
        this.startQuizBtn.disabled = true;
        this.submitQuizBtn.disabled = false; // Enable for re-attempt
        this.submitQuizBtn.textContent = '重新作答';
        this.disableOptions(); // Ensure options are disabled for viewing results

        const currentQuiz = quizData.questions[this.currentQuizIndex];
        const savedScore = this.quizScores[currentQuiz.id];

        // Restore video controls state
        if (this.currentVideoElement) {
            // If quiz was submitted, controls should be disabled for review
            this.currentVideoElement.controls = false; 
            this.currentVideoElement.pause(); // Ensure video is paused
        }


        if (savedScore) {
            this.scoreDisplay.textContent = `正确率: ${savedScore.correct}/${savedScore.total} (${savedScore.percentage}%)`;
            this.timerDisplay.textContent = savedScore.time;
            this.userAnswers = savedScore.userAnswers || {}; // Restore user answers

            this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
                span.classList.remove('highlighted-question-num');
            });

            // Re-evaluate and display explanations based on saved answers
            switch (currentQuiz.questionType) {
                case 'single-choice':
                case 'true-false':
                    currentQuiz.options.forEach((optionData, optionIndex) => {
                        const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                        const correctAnswer = optionData.answer;
                        const userAnswer = this.userAnswers[optionIndex];
                        
                        let isCorrect = (userAnswer !== undefined && String(userAnswer) === String(correctAnswer));

                        questionBlockDiv.querySelectorAll('.choice-item').forEach(choiceElement => {
                            const choiceKey = choiceElement.dataset.choice;
                            choiceElement.classList.remove('selected-choice', 'correct-choice', 'incorrect-choice');

                            if (String(choiceKey) === String(correctAnswer)) {
                                choiceElement.classList.add('correct-choice');
                            }
                            if (userAnswer !== undefined && String(userAnswer) === String(choiceKey) && !isCorrect) {
                                choiceElement.classList.add('incorrect-choice');
                            }
                        });
                        this.displayExplanation(questionBlockDiv, userAnswer, correctAnswer, optionData.explanation, optionData.choices, isCorrect, currentQuiz.questionType);
                    });
                    break;

                case 'multi-choice':
                    currentQuiz.options.forEach((optionData, optionIndex) => {
                        const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                        const correctAnswers = Array.isArray(optionData.answer) ? optionData.answer.sort() : [];
                        const userAnswers = (this.userAnswers[optionIndex] || []).sort();
                        
                        let isCorrect = (correctAnswers.length === userAnswers.length &&
                                         correctAnswers.every((val, idx) => val === userAnswers[idx]));

                        questionBlockDiv.querySelectorAll('.choice-item').forEach(choiceElement => {
                            const choiceKey = choiceElement.dataset.choice;
                            choiceElement.classList.remove('selected-choice', 'correct-choice', 'incorrect-choice');

                            if (correctAnswers.includes(choiceKey)) {
                                choiceElement.classList.add('correct-choice');
                            }
                            if (userAnswers.includes(choiceKey) && !correctAnswers.includes(choiceKey)) {
                                choiceItem.classList.add('incorrect-choice');
                            }
                        });
                        this.displayExplanation(questionBlockDiv, userAnswer, correctAnswer, optionData.explanation, optionData.choices, isCorrect, currentQuiz.questionType);
                    });
                    break;

                case 'fill-in-blank':
                    const fillInBlankOptionData = currentQuiz.options[0];
                    const fillInBlankQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
                    const correctAnswersArray = fillInBlankOptionData.answer;
                    const userInputsArray = this.userAnswers[0] || new Array(fillInBlankOptionData.blankCount).fill(''); // Restore user's answer array

                    let fillInBlankExplanationContent = `<div class="explanation-item">`;
                    
                    for (let i = 0; i < fillInBlankOptionData.blankCount; i++) {
                        const inputElement = fillInBlankQuestionBlockDiv.querySelector(`.fill-in-blank-input[data-blank-index="${i}"]`);
                        const correctAnswer = (correctAnswersArray[i] || '').toLowerCase().trim();
                        const userInput = (userInputsArray[i] || '').toLowerCase().trim();
                        
                        const isBlankCorrect = (userInput === correctAnswer);

                        inputElement.value = userInputsArray[i] || ''; // Display user's saved input
                        inputElement.disabled = true;
                        inputElement.classList.add('disabled');
                        inputElement.classList.remove('correct', 'incorrect'); // Clear previous visual states before applying new ones
                        
                        if (isBlankCorrect) {
                            inputElement.classList.add('correct');
                        } else {
                            inputElement.classList.add('incorrect');
                        }

                        fillInBlankExplanationContent += `<p>填空 ${i + 1}: `;
                        fillInBlankExplanationContent += `你的答案: <span class="your-answer">${userInputsArray[i] || '未作答'}</span> `;
                        fillInBlankExplanationContent += isBlankCorrect ? `<i class="fas fa-check-circle explanation-icon" style="color: #28a745;"></i> (正确)<br>` : `<i class="fas fa-times-circle explanation-icon" style="color: #dc3545;"></i> (错误)<br>`;
                        if (!isBlankCorrect) {
                            fillInBlankExplanationContent += `正确答案: <span class="correct-answer">${correctAnswersArray[i]}</span><br>`;
                        }
                        fillInBlankExplanationContent += `</p>`;
                    }
                    fillInBlankExplanationContent += `<span class="explanation-text">解析: ${fillInBlankOptionData.explanation}</span></div>`;
                    fillInBlankQuestionBlockDiv.querySelector('.question-explanation').innerHTML = fillInBlankExplanationContent;
                    fillInBlankQuestionBlockDiv.querySelector('.question-explanation').style.display = 'block';
                    break;

                case 'matching':
                    const optionData = currentQuiz.options[0];
                    const matchingQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
                    
                    // Re-enable user pairs display for review if it was hidden
                    if (matchingQuestionBlockDiv) { // Ensure matchingQuestionBlockDiv exists before querying
                        const userPairsDisplay = matchingQuestionBlockDiv.querySelector('.matching-user-pairs-display');
                        if (userPairsDisplay) {
                            userPairsDisplay.style.display = 'block';
                        }
                    }

                    matchingQuestionBlockDiv.querySelectorAll('.matching-item').forEach(item => {
                        item.classList.add('disabled');
                        item.style.pointerEvents = 'none';
                        item.draggable = false; // Ensure dragging is off in review mode
                        item.classList.remove('matching-selected-left', 'matching-selected-right', 'dragging', 'drag-over'); // Clear any dragging/selection states
                    });

                    const correctMappings = optionData.answer;
                    const userMappings = this.userAnswers[0] || {};
                    let matchingExplanationContent = `<div class="explanation-item"><h4>连线结果：</h4>`;

                    // Re-render the user pairs display with correct/incorrect visual feedback
                    const matchedPairsList = matchingQuestionBlockDiv.querySelector('#matched-pairs-list');
                    if (matchedPairsList) {
                        matchedPairsList.innerHTML = ''; // Clear existing
                        const allLeftItems = currentQuiz.options[0].pairs.map(p => p.left);

                        allLeftItems.forEach(leftKey => {
                            const expectedRight = correctMappings[leftKey];
                            const userRight = userMappings[leftKey];
                            const isPairCorrect = (userRight !== undefined && userRight === expectedRight);

                            const pairDisplay = document.createElement('div');
                            pairDisplay.classList.add('matched-pair-item-display');
                            pairDisplay.classList.add(isPairCorrect ? 'correct' : 'incorrect'); // Add class for styling feedback
                            // Removed position: static and padding-right here as they are now handled by CSS rules for .matched-pair-item-display
                            pairDisplay.style.position = 'static'; // Ensure it's not absolutely positioned
                            pairDisplay.style.paddingRight = '12px'; // Adjust padding

                            // Left column for the pair description
                            const pairDescription = document.createElement('div');
                            pairDescription.classList.add('pair-description');
                            pairDescription.innerHTML = `
                                <span class="left-display">${leftKey}</span>
                                <i class="fas fa-arrow-right"></i>
                                <span class="right-display">${userRight || '未作答'}</span>
                            `;
                            pairDisplay.appendChild(pairDescription);

                            // Add the remove button only during active quiz (not review)
                            if (!this.quizSubmitted) { // Only add remove button if quiz is NOT submitted
                                const removeAction = document.createElement('div');
                                removeAction.classList.add('remove-action');
                                
                                const removeBtn = document.createElement('button');
                                removeBtn.classList.add('matched-pair-remove-btn');
                                removeBtn.innerHTML = '<i class="fas fa-times"></i>'; // Font Awesome close icon
                                removeBtn.title = `移除 ${leftKey} - ${userRight} 匹配`; // Chinese title for button
                                removeBtn.addEventListener('click', () => {
                                    if (!this.quizStarted || this.quizSubmitted) return;

                                    // Re-enable the left and right items
                                    const leftElem = matchingQuestionBlockDiv.querySelector(`.left-item[data-value="${leftKey}"]`);
                                    const rightElem = matchingQuestionBlockDiv.querySelector(`.right-item[data-value="${userRight}"]`);
                                    
                                    if (leftElem) {
                                        leftElem.classList.remove('matching-connected', 'disabled');
                                        leftElem.style.pointerEvents = 'auto';
                                        leftElem.draggable = true; // Make it draggable again
                                    }
                                    if (rightElem) {
                                        rightElem.classList.remove('matching-connected', 'disabled');
                                        rightElem.style.pointerEvents = 'auto';
                                    }

                                    // Remove from userAnswers
                                    delete this.userAnswers[optionIndex][leftKey];
                                    this.updateMatchingUserPairsDisplay(optionIndex); // Update the display
                                });
                                
                                const removeText = document.createElement('span');
                                removeText.textContent = '移除匹配'; // Text for remove action
                                removeAction.appendChild(removeBtn);
                                removeAction.appendChild(removeText);
                                pairDisplay.appendChild(removeAction);
                            }
                            matchedPairsList.appendChild(pairDisplay);

                            // Apply visual feedback to original items as well
                            const leftElem = matchingQuestionBlockDiv.querySelector(`.left-item[data-value="${leftKey}"]`);
                            const userRightElem = matchingQuestionBlockDiv.querySelector(`.right-item[data-value="${userRight}"]`);
                            const correctRightElem = matchingQuestionBlockDiv.querySelector(`.right-item[data-value="${expectedRight}"]`);

                            if (isPairCorrect) {
                                if (leftElem) leftElem.classList.add('matching-connected');
                                if (userRightElem) userRightElem.classList.add('matching-connected');
                            } else {
                                if (leftElem) leftElem.classList.add('matching-incorrect');
                                if (userRightElem && userRight) userRightElem.classList.add('matching-incorrect');
                                if (correctRightElem) correctRightElem.classList.add('correct-choice');
                            }
                        });
                    }
                    // Explanation content for review mode (already built in handleSubmitReattempt)
                    matchingExplanationContent += `<div class="matching-explanation-grid">`; // New grid container for explanations
                    for (const leftKey in correctMappings) {
                        const expectedRight = correctMappings[leftKey];
                        const userRight = userMappings[leftKey];
                        const isPairCorrect = (userRight !== undefined && userRight === expectedRight);

                        matchingExplanationContent += `
                            <div class="matching-explanation-pair-row ${isPairCorrect ? 'correct' : 'incorrect'}">
                                <span class="explanation-left-side">${leftKey}</span>
                                <span class="explanation-user-answer">${userRight || '未作答'}</span>
                                <span class="explanation-status-icon"><i class="fas ${isPairCorrect ? 'fa-check-circle' : 'fa-times-circle'}" style="color: ${isPairCorrect ? '#28a745' : '#dc3545'};"></i></span>
                                <span class="explanation-correct-answer">正确: ${expectedRight}</span>
                            </div>
                        `;
                    }
                    matchingExplanationContent += `</div>`; // Close matching-explanation-grid


                    matchingExplanationContent += `<span class="explanation-text">解析: ${optionData.explanation}</span></div>`;
                    matchingQuestionBlockDiv.querySelector('.question-explanation').innerHTML = matchingExplanationContent;
                    matchingQuestionBlockDiv.querySelector('.question-explanation').style.display = 'block';
                    break;
            }


            // Calculate and display overall score
            const accuracyPercentage = totalQuestions === 0 ? 0 : ((correctCount / totalQuestions) * 100).toFixed(2);
            this.scoreDisplay.textContent = `正确率: ${correctCount}/${totalQuestions} (${accuracyPercentage}%)`;

            // Mark quiz as completed in navigation
            const navItem = this.quizNav.querySelector(`li[data-original-index="${this.currentQuizIndex}"]`);
            if (navItem) {
                navItem.classList.add('completed');
            }

            // Store score and user answers for the main quiz ID
            this.quizScores[currentQuiz.id] = {
                correct: correctCount,
                total: totalQuestions,
                percentage: accuracyPercentage,
                time: this.timerDisplay.textContent,
                userAnswers: JSON.parse(JSON.stringify(this.userAnswers)) // Deep copy userAnswers
            };

            // After submission, enable submit button and change its text for re-attempt
            this.submitQuizBtn.disabled = false;
            this.submitQuizBtn.textContent = '重新作答';

        } else {
            // Logic for Re-attempt after Submission
            // Remove saved score and reset completed status in navigation
            delete this.quizScores[currentQuiz.id];
            const navItem = this.quizNav.querySelector(`li[data-original-index="${this.currentQuizIndex}"]`);
            if (navItem) {
                navItem.classList.remove('completed');
            }
            // Reload the current quiz to reset everything to a fresh, unstarted state
            this.loadQuiz(this.currentQuizIndex);
            // No need to set button states here, loadQuiz (via resetQuizState) handles it.
        }
    }

    /**
     * Helper function to escape special characters in a string for use in a RegExp.
     * @param {string} string - The string to escape.
     * @returns {string} The escaped string.
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Maps internal questionType to a human-readable Chinese string.
     * @param {string} type - The internal question type.
     * @returns {string} The Chinese translation.
     */
    mapQuestionTypeToChinese(type) {
        switch (type) {
            case 'single-choice': return '单选题';
            case 'multi-choice': return '多选题';
            case 'fill-in-blank': return '填空题';
            case 'matching': return '连线题';
            case 'true-false': return '判断题';
            default: return '未知题型';
        }
    }
}

// Initialize the QuizApp when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new QuizApp();
    app.init();
});
