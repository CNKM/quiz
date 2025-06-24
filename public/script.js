// Assume quizData is defined in a separate JS file, e.g., quiz_English_data.js
// For multiple quiz data sources, we'll store them in an array.
// This array will hold the parsed quiz data objects.
const quizDataSources = [];
let app; // Declare app globally so loadQuizDataFiles can access it

// QuizApp Class to encapsulate all quiz logic and state
class QuizApp {
    constructor() {
        // DOM Elements - Added null checks for safer access
        this.body = document.body; // body should always exist

        this.sidebar = document.getElementById('sidebar');
        if (!this.sidebar) console.error("DOM Error: Element with ID 'sidebar' not found.");

        this.showSidebarIconContainer = document.getElementById('showSidebarIconContainer');
        if (!this.showSidebarIconContainer) console.error("DOM Error: Element with ID 'showSidebarIconContainer' not found.");

        this.hideSidebarIcon = document.getElementById('hideSidebarIcon');
        if (!this.hideSidebarIcon) console.error("DOM Error: Element with ID 'hideSidebarIcon' not found.");

        this.quizNav = document.getElementById('quiz-nav');
        if (!this.quizNav) console.error("DOM Error: Element with ID 'quiz-nav' not found.");


        // New Custom Quiz Mode Dropdown Elements
        this.customQuizModeFilter = document.getElementById('custom-quiz-mode-filter');
        if (!this.customQuizModeFilter) console.error("DOM Error: Element with ID 'custom-quiz-mode-filter' not found.");

        this.quizModeToggle = document.getElementById('quiz-mode-toggle');
        if (!this.quizModeToggle) console.error("DOM Error: Element with ID 'quiz-mode-toggle' not found.");

        this.selectedQuizModeSpan = document.getElementById('selected-quiz-mode');
        if (!this.selectedQuizModeSpan) console.error("DOM Error: Element with ID 'selected-quiz-mode' not found.");

        this.quizModeMenu = document.getElementById('quiz-mode-menu');
        if (!this.quizModeMenu) console.error("DOM Error: Element with ID 'quiz-mode-menu' not found.");

        this.modeDropdownArrow = this.quizModeToggle ? this.quizModeToggle.querySelector('.dropdown-arrow') : null;
        if (!this.modeDropdownArrow && this.quizModeToggle) console.error("DOM Error: Element with class 'dropdown-arrow' not found inside #quiz-mode-toggle.");


        // New Custom Quiz Source Dropdown Elements
        this.customQuizSourceFilter = document.getElementById('custom-quiz-source-filter');
        if (!this.customQuizSourceFilter) console.error("DOM Error: Element with ID 'custom-quiz-source-filter' not found.");

        this.quizSourceToggle = document.getElementById('quiz-source-toggle');
        if (!this.quizSourceToggle) console.error("DOM Error: Element with ID 'quiz-source-toggle' not found.");

        this.selectedQuizSourceSpan = document.getElementById('selected-quiz-source');
        if (!this.selectedQuizSourceSpan) console.error("DOM Error: Element with ID 'selected-quiz-source' not found.");

        this.quizSourceMenu = document.getElementById('quiz-source-menu');
        if (!this.quizSourceMenu) console.error("DOM Error: Element with ID 'quiz-source-menu' not found.");

        this.sourceDropdownArrow = this.quizSourceToggle ? this.quizSourceToggle.querySelector('.dropdown-arrow') : null;
        if (!this.sourceDropdownArrow && this.quizSourceToggle) console.error("DOM Error: Element with class 'dropdown-arrow' not found inside #quiz-source-toggle.");


        // Custom Type Filter Dropdown Elements
        this.customQuizTypeFilter = document.getElementById('custom-quiz-type-filter');
        if (!this.customQuizTypeFilter) console.error("DOM Error: Element with ID 'custom-quiz-type-filter' not found.");

        this.quizTypeToggle = document.getElementById('quiz-type-toggle');
        if (!this.quizTypeToggle) console.error("DOM Error: Element with ID 'quiz-type-toggle' not found.");

        this.selectedQuizTypeSpan = document.getElementById('selected-quiz-type');
        if (!this.selectedQuizTypeSpan) console.error("DOM Error: Element with ID 'selected-quiz-type' not found.");

        this.quizTypeMenu = document.getElementById('quiz-type-menu');
        if (!this.quizTypeMenu) console.error("DOM Error: Element with ID 'quiz-type-menu' not found.");

        this.typeDropdownArrow = this.quizTypeToggle ? this.quizTypeToggle.querySelector('.dropdown-arrow') : null; // Changed from dropdownArrow to typeDropdownArrow to distinguish
        if (!this.typeDropdownArrow && this.quizTypeToggle) console.error("DOM Error: Element with class 'dropdown-arrow' not found inside #quiz-type-toggle.");


        // New Set Quiz Time Limit Elements
        this.setQuizTimeLimitContainer = document.getElementById('set-quiz-time-limit-container');
        if (!this.setQuizTimeLimitContainer) console.error("DOM Error: Element with ID 'set-quiz-time-limit-container' not found.");

        this.setQuizTimeInput = document.getElementById('set-quiz-time-input');
        if (!this.setQuizTimeInput) console.error("DOM Error: Element with ID 'set-quiz-time-input' not found.");

        // Get the label for "套题时间" to hide/show it
        this.setQuizTimeLimitLabel = document.getElementById('set-quiz-time-limit-label');
        if (!this.setQuizTimeLimitLabel) console.error("DOM Error: Element with ID 'set-quiz-time-limit-label' not found.");


        // New Overall Set Quiz Summary Display
        this.setQuizSummaryDisplay = document.getElementById('set-quiz-summary-display');
        if (!this.setQuizSummaryDisplay) console.error("DOM Error: Element with ID 'set-quiz-summary-display' not found.");

        this.overallScorePercentageDisplay = this.setQuizSummaryDisplay ? this.setQuizSummaryDisplay.querySelector('.overall-score-percentage') : null;
        if (!this.overallScorePercentageDisplay && this.setQuizSummaryDisplay) console.error("DOM Error: Element with class 'overall-score-percentage' not found inside #set-quiz-summary-display.");

        this.quizTitleElement = document.getElementById('quiz-title');
        if (!this.quizTitleElement) console.error("DOM Error: Element with ID 'quiz-title' not found.");

        this.quizTypeElement = document.getElementById('quiz-type');
        if (!this.quizTypeElement) console.error("DOM Error: Element with ID 'quiz-type' not found.");

        this.questionMediaContainer = document.getElementById('question-media-container'); // New media container
        if (!this.questionMediaContainer) console.error("DOM Error: Element with ID 'question-media-container' not found.");

        this.quizContentElement = document.getElementById('quiz-content');
        if (!this.quizContentElement) console.error("DOM Error: Element with ID 'quiz-content' not found.");

        this.optionsContainer = document.getElementById('options-container');
        if (!this.optionsContainer) console.error("DOM Error: Element with ID 'options-container' not found.");

        this.startQuizBtn = document.getElementById('start-quiz-btn');
        if (!this.startQuizBtn) console.error("DOM Error: Element with ID 'start-quiz-btn' not found.");

        this.submitQuizBtn = document.getElementById('submit-quiz-btn');
        if (!this.submitQuizBtn) console.error("DOM Error: Element with ID 'submit-quiz-btn' not found.");

        this.timerDisplay = document.getElementById('timer');
        if (!this.timerDisplay) console.error("DOM Error: Element with ID 'timer' not found.");

        this.scoreDisplay = document.getElementById('score-display'); // Main content score display
        if (!this.scoreDisplay) console.error("DOM Error: Element with ID 'score-display' not found.");


        // New navigation buttons for Set Quiz
        this.prevQuestionBtn = document.getElementById('prev-question-btn');
        if (!this.prevQuestionBtn) console.error("DOM Error: Element with ID 'prev-question-btn' not found.");

        this.nextQuestionBtn = document.getElementById('next-question-btn');
        if (!this.nextQuestionBtn) console.error("DOM Error: Element with ID 'next-question-btn' not found.");


        // State Variables
        this.quizMode = 'single'; // 'single' or 'set'
        this.currentQuizIndex = 0; // Index for current quiz in the currentQuizData.questions array (for single mode)
        this.userAnswers = {}; // Stores user answers for the current quiz (single mode) {questionIndex: answer}
        this.timerInterval = null;
        this.startTime = null;
        this.quizStarted = false;
        this.quizSubmitted = false;
        this.quizScores = {}; // Stores scores for completed quizzes (single mode) { quizId: { correct, total, percentage, time, userAnswers } }
        this.selectedQuizType = 'all'; // Keep track of the selected filter type
        this.currentVideoElement = null; // Store reference to the current video element
        // Matching specific state for drag-and-drop
        this.draggedLeftItemValue = null; // Value of the item currently being dragged from the left column

        this.selectedQuizSourceIndex = 0; // Index of the currently selected quiz data source
        this.currentQuizData = null; // Reference to the currently active quiz data object

        // State variables for 'set' quiz mode
        this.setQuizTimeLimit = 60; // Default 60 minutes for set quiz
        this.setQuizQuestions = []; // Stores the questions for the current set quiz
        this.currentSetQuizQuestionIndex = 0; // Index for navigation within a set quiz
        // Stores all user answers for the current set quiz: { questionId: { subQuestionIndex: answer } }
        this.setQuizUserAnswers = {};
        // Stores score data for each question in a set quiz after submission: { questionId: { isCorrect: bool, percentage: number, explanation: string } }
        this.setQuizScoreData = {};
        this.overallSetQuizScore = { // Overall score for the entire set quiz
            correct: 0,
            total: 0,
            percentage: 0
        };
    }

    /**
     * Initializes the Quiz Application.
     * Sets up event listeners and loads the initial quiz.
     */
    init() {
        // Ensure quizDataSources is populated before proceeding
        if (quizDataSources.length === 0) {
            console.error("Error: No quiz data sources loaded. Please ensure quiz data files are loaded correctly.");
            // Display a user-friendly message or disable functionality
            if (this.quizTitleElement) {
                this.quizTitleElement.textContent = "错误：没有找到题库数据。请检查你的题库文件是否正确加载。";
                this.quizTitleElement.style.color = "#dc3545"; // Red color for error
            }
            if (this.startQuizBtn) this.startQuizBtn.disabled = true;
            if (this.submitQuizBtn) this.submitQuizBtn.disabled = true;
            return;
        }

        // Set the initial currentQuizData to the first source
        this.currentQuizData = quizDataSources[this.selectedQuizSourceIndex];

        this.addEventListeners();
        this.populateSourceFilter(); // Populate quiz source dropdown first
        this.populateModeFilter(); // Populate quiz mode dropdown
        this.applyModeUI(); // Apply UI based on initial mode ('single')

        // Set initial sidebar state (assuming open by default)
        if (this.body) this.body.classList.remove('sidebar-hidden');
        if (this.sidebar) this.sidebar.classList.remove('hidden');
        if (this.showSidebarIconContainer) this.showSidebarIconContainer.style.display = 'none';

        // Set initial display for quiz source
        if (this.currentQuizData && this.currentQuizData.title && this.selectedQuizSourceSpan) {
            this.selectedQuizSourceSpan.textContent = this.currentQuizData.title;
        } else if (this.selectedQuizSourceSpan) {
            this.selectedQuizSourceSpan.textContent = '选择题库';
        }
        if (this.selectedQuizModeSpan) this.selectedQuizModeSpan.textContent = '单题作答'; // Default mode display
        this.selectedQuizMode = 'single'; // Explicitly set default mode
        this.loadQuizNavigation(); // Load navigation based on the initial source and type
    }

    /**
     * Adds all necessary event listeners to DOM elements.
     */
    addEventListeners() {
        // Check for existence before adding listeners to avoid 'null' or 'undefined' errors
        if (this.showSidebarIconContainer) {
            this.showSidebarIconContainer.addEventListener('click', this.toggleSidebar.bind(this));
        } else { console.error("Event Listener Error: Element #showSidebarIconContainer not found."); }

        if (this.hideSidebarIcon) {
            this.hideSidebarIcon.addEventListener('click', this.toggleSidebar.bind(this));
        } else { console.error("Event Listener Error: Element #hideSidebarIcon not found."); }

        if (this.startQuizBtn) {
            this.startQuizBtn.addEventListener('click', this.startQuiz.bind(this));
        } else { console.error("Event Listener Error: Element #start-quiz-btn not found."); }

        if (this.submitQuizBtn) {
            this.submitQuizBtn.addEventListener('click', this.handleSubmitOrReattempt.bind(this));
        } else { console.error("Event Listener Error: Element #submit-quiz-btn not found."); }

        // Event listeners for custom mode dropdown
        if (this.quizModeToggle) {
            this.quizModeToggle.addEventListener('click', this.toggleModeDropdown.bind(this));
        } else { console.error("Event Listener Error: Element #quiz-mode-toggle not found, cannot add dropdown listener."); }

        // Event listeners for custom source dropdown
        if (this.quizSourceToggle) {
            this.quizSourceToggle.addEventListener('click', this.toggleSourceDropdown.bind(this));
        } else { console.error("Event Listener Error: Element #quiz-source-toggle not found, cannot add dropdown listener."); }

        // Event listeners for custom type dropdown
        if (this.quizTypeToggle) {
            this.quizTypeToggle.addEventListener('click', this.toggleTypeDropdown.bind(this));
        } else { console.error("Event Listener Error: Element #quiz-type-toggle not found, cannot add dropdown listener."); }

        // Event listeners for set quiz navigation buttons
        if (this.prevQuestionBtn) {
            this.prevQuestionBtn.addEventListener('click', this.goToPreviousQuestion.bind(this));
        } else { console.error("Event Listener Error: Element #prev-question-btn not found."); }

        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.addEventListener('click', this.goToNextQuestion.bind(this));
        } else { console.error("Event Listener Error: Element #next-question-btn not found."); }

        // Close dropdowns if clicked outside
        document.addEventListener('click', (event) => {
            // These elements are initialized in the constructor, so they might be null only if the initial DOM query failed.
            if (this.customQuizModeFilter && !this.customQuizModeFilter.contains(event.target)) {
                this.hideModeDropdown();
            }
            if (this.customQuizSourceFilter && !this.customQuizSourceFilter.contains(event.target)) {
                this.hideSourceDropdown();
            }
            if (this.customQuizTypeFilter && !this.customQuizTypeFilter.contains(event.target)) {
                this.hideTypeDropdown();
            }
        });

        // Listen for input changes on the set quiz time input
        if (this.setQuizTimeInput) {
            this.setQuizTimeInput.addEventListener('change', (event) => {
                let value = parseInt(event.target.value);
                if (isNaN(value) || value < 1) {
                    value = 1; // Minimum time
                } else if (value > 300) {
                    value = 300; // Maximum time
                }
                event.target.value = value;
                this.setQuizTimeLimit = value;
            });
        } else { console.error("Event Listener Error: Element #set-quiz-time-input not found."); }
    }

    /**
     * Toggles the visibility of the sidebar.
     */
    toggleSidebar() {
        if (!this.sidebar || !this.body || !this.showSidebarIconContainer || !this.quizNav) {
            console.error("Sidebar elements not found, cannot toggle sidebar.");
            return;
        }

        this.sidebar.classList.toggle('hidden');
        this.body.classList.toggle('sidebar-hidden');

        if (this.sidebar.classList.contains('hidden')) {
            this.showSidebarIconContainer.style.display = 'flex';
        } else {
            this.showSidebarIconContainer.style.display = 'none';
            // Scroll to top of the quiz navigation when sidebar becomes visible
            this.quizNav.scrollTop = 0;
        }
    }

    /**
     * Toggles the visibility of the custom quiz mode dropdown menu.
     */
    toggleModeDropdown() {
        if (!this.quizModeMenu || !this.quizModeToggle) {
            console.error("Quiz mode dropdown elements not found, cannot toggle dropdown.");
            return;
        }
        this.quizModeMenu.classList.toggle('show');
        this.quizModeToggle.classList.toggle('active');
        this.hideSourceDropdown(); // Close other dropdowns
        this.hideTypeDropdown();
    }

    /**
     * Hides the custom quiz mode dropdown menu.
     */
    hideModeDropdown() {
        if (this.quizModeMenu) this.quizModeMenu.classList.remove('show');
        if (this.quizModeToggle) this.quizModeToggle.classList.remove('active');
    }

    /**
     * Populates the custom dropdown menu with available quiz modes.
     */
    populateModeFilter() {
        if (!this.quizModeMenu) {
            console.error("Quiz mode menu not found, cannot populate mode filter.");
            return;
        }
        // Mode options are fixed in HTML, just add event listeners
        this.quizModeMenu.querySelectorAll('li').forEach(option => {
            option.addEventListener('click', () => {
                const mode = option.dataset.mode;
                this.selectModeOption(mode, option.textContent);
            });
        });
    }

    /**
     * Handles the selection of a custom quiz mode dropdown option.
     * @param {string} mode - The selected mode ('single' or 'set').
     * @param {string} text - The display text of the selected option.
     */
    selectModeOption(mode, text) {
        if (this.quizMode === mode) { // No change, just close dropdown
            this.hideModeDropdown();
            return;
        }

        this.quizMode = mode;
        if (this.selectedQuizModeSpan) this.selectedQuizModeSpan.textContent = text;
        this.hideModeDropdown();

        // Clear all states and reload UI based on new mode
        this.resetAllQuizState();
        this.applyModeUI();
        this.loadQuizNavigation();
    }

    /**
     * Applies UI changes based on the current quiz mode.
     */
    applyModeUI() {
        // Hide/show type filter dropdown based on mode
        if (this.quizMode === 'set') {
            if (this.customQuizTypeFilter) this.customQuizTypeFilter.style.display = 'none';
            // Also hide its label
            if (this.customQuizTypeFilter && this.customQuizTypeFilter.previousElementSibling) {
                this.customQuizTypeFilter.previousElementSibling.style.display = 'none'; // The span with "选择题型"
            }

            if (this.setQuizTimeLimitContainer) this.setQuizTimeLimitContainer.style.display = 'flex'; // Show time input for set quiz
            if (this.setQuizTimeLimitLabel) this.setQuizTimeLimitLabel.style.display = 'block'; // Show its label

            if (this.setQuizSummaryDisplay) this.setQuizSummaryDisplay.style.display = 'none'; // Hide summary display initially for set quiz
            // Make score display more general for set mode until submission
            if (this.scoreDisplay) this.scoreDisplay.textContent = '正确率: 未作答';
        } else { // Single mode
            if (this.customQuizTypeFilter) this.customQuizTypeFilter.style.display = 'block';
            // Show its label
            if (this.customQuizTypeFilter && this.customQuizTypeFilter.previousElementSibling) {
                this.customQuizTypeFilter.previousElementSibling.style.display = 'block'; // The span with "选择题型"
            }

            if (this.setQuizTimeLimitContainer) this.setQuizTimeLimitContainer.style.display = 'none'; // Hide time input for single quiz
            if (this.setQuizTimeLimitLabel) this.setQuizTimeLimitLabel.style.display = 'none'; // Hide its label

            if (this.setQuizSummaryDisplay) this.setQuizSummaryDisplay.style.display = 'none'; // Always hide for single mode
        }

        // Hide/show navigation buttons based on mode
        if (this.quizMode === 'set') {
            if (this.prevQuestionBtn) this.prevQuestionBtn.style.display = 'inline-block';
            if (this.nextQuestionBtn) this.nextQuestionBtn.style.display = 'inline-block';
            // Start quiz button should be enabled, nav buttons disabled initially
            if (this.startQuizBtn) this.startQuizBtn.disabled = false;
            if (this.prevQuestionBtn) this.prevQuestionBtn.disabled = true; // Initially disabled
            if (this.nextQuestionBtn) this.nextQuestionBtn.disabled = true; // Initially disabled
            if (this.submitQuizBtn) this.submitQuizBtn.disabled = true; // Submit only after starting
        } else {
            if (this.prevQuestionBtn) this.prevQuestionBtn.style.display = 'none';
            if (this.nextQuestionBtn) this.nextQuestionBtn.style.display = 'none';
            // Ensure single mode buttons are reset
            if (this.startQuizBtn) this.startQuizBtn.disabled = false;
            if (this.submitQuizBtn) {
                this.submitQuizBtn.disabled = true;
                this.submitQuizBtn.textContent = '交卷';
            }
        }
        if (this.timerDisplay) this.timerDisplay.textContent = '时间: 00:00'; // Reset timer display
    }

    /**
     * Resets all quiz-related states including scores and user answers for both modes.
     */
    resetAllQuizState() {
        this.resetQuizState(); // Resets current quiz display, timer, quizStarted flags etc.
        this.quizScores = {}; // Clear single mode scores
        this.setQuizUserAnswers = {}; // Clear set mode user answers
        this.setQuizScoreData = {}; // Clear set mode scores
        this.setQuizQuestions = []; // Clear set quiz question list
        this.currentSetQuizQuestionIndex = 0; // Reset set quiz navigation index
        this.overallSetQuizScore = { correct: 0, total: 0, percentage: 0 }; // Reset overall set score
        if (this.setQuizSummaryDisplay) this.setQuizSummaryDisplay.style.display = 'none'; // Hide summary
        if (this.overallScorePercentageDisplay) {
            this.overallScorePercentageDisplay.textContent = ''; // Clear summary text
            this.overallScorePercentageDisplay.classList.remove('score-high', 'score-mid', 'score-low');
        }

        this.selectedQuizType = 'all'; // Reset type filter
        if (this.selectedQuizTypeSpan) this.selectedQuizTypeSpan.textContent = '全部题型';
        this.populateTypeFilter(); // Repopulate type filter based on current source
    }

    /**
     * Toggles the visibility of the custom quiz source dropdown menu.
     */
    toggleSourceDropdown() {
        if (!this.quizSourceMenu || !this.quizSourceToggle) {
            console.error("Quiz source dropdown elements not found, cannot toggle dropdown.");
            return;
        }
        this.quizSourceMenu.classList.toggle('show');
        this.quizSourceToggle.classList.toggle('active');
        this.hideModeDropdown(); // Close other dropdowns
        this.hideTypeDropdown();
    }

    /**
     * Hides the custom quiz source dropdown menu.
     */
    hideSourceDropdown() {
        if (this.quizSourceMenu) this.quizSourceMenu.classList.remove('show');
        if (this.quizSourceToggle) this.quizSourceToggle.classList.remove('active');
    }

    /**
     * Toggles the visibility of the custom quiz type dropdown menu.
     */
    toggleTypeDropdown() {
        if (!this.quizTypeMenu || !this.quizTypeToggle) {
            console.error("Quiz type dropdown elements not found, cannot toggle dropdown.");
            return;
        }
        this.quizTypeMenu.classList.toggle('show');
        this.quizTypeToggle.classList.toggle('active');
        this.hideModeDropdown(); // Close other dropdowns
        this.hideSourceDropdown();
    }

    /**
     * Hides the custom quiz type dropdown menu.
     */
    hideTypeDropdown() {
        if (this.quizTypeMenu) this.quizTypeMenu.classList.remove('show');
        if (this.quizTypeToggle) this.quizTypeToggle.classList.remove('active');
    }

    /**
     * Populates the custom dropdown menu with available quiz data sources.
     */
    populateSourceFilter() {
        if (!this.quizSourceMenu) {
            console.error("Quiz source menu not found, cannot populate source filter.");
            return;
        }
        this.quizSourceMenu.innerHTML = ''; // Clear existing menu items

        quizDataSources.forEach((source, index) => {
            const option = document.createElement('li');
            option.textContent = source.title; // Use the title from the quiz data object
            option.dataset.index = index;
            option.addEventListener('click', () => this.selectSourceOption(index, source.title));
            this.quizSourceMenu.appendChild(option);
        });
    }

    /**
     * Handles the selection of a custom quiz source dropdown option.
     * @param {number} index - The index of the selected quiz data source.
     * @param {string} text - The display text of the selected option.
     */
    selectSourceOption(index, text) {
        if (this.selectedQuizSourceSpan) this.selectedQuizSourceSpan.textContent = text;
        this.selectedQuizSourceIndex = index; // Update the state variable
        this.currentQuizData = quizDataSources[index]; // Update the current quiz data
        this.hideSourceDropdown();
        this.resetAllQuizState(); // Reset all states when source changes
        this.loadQuizNavigation(); // Reload navigation based on new source
    }

    /**
     * Populates the custom dropdown menu with unique quiz types based on the current quiz data.
     */
    populateTypeFilter() {
        if (!this.quizTypeMenu) {
            console.error("Quiz type menu not found, cannot populate type filter.");
            return;
        }
        const types = new Set();
        if (this.currentQuizData && this.currentQuizData.questions) {
            this.currentQuizData.questions.forEach(quiz => {
                if (quiz.type) {
                    types.add(quiz.type);
                }
            });
        }

        this.quizTypeMenu.innerHTML = ''; // Clear existing menu items

        // Add "All Types" option
        const allOption = document.createElement('li');
        allOption.textContent = '全部题型';
        allOption.dataset.value = 'all';
        allOption.addEventListener('click', () => this.selectTypeOption('all', '全部题型'));
        this.quizTypeMenu.appendChild(allOption);

        // Add unique types
        types.forEach(type => {
            const option = document.createElement('li');
            option.textContent = type;
            option.dataset.value = type;
            option.addEventListener('click', () => this.selectTypeOption(type, type));
            this.quizTypeMenu.appendChild(option);
        });
    }

    /**
     * Handles the selection of a custom quiz type dropdown option.
     * @param {string} value - The data value of the selected option.
     * @param {string} text - The display text of the selected option.
     */
    selectTypeOption(value, text) {
        if (this.selectedQuizTypeSpan) this.selectedQuizTypeSpan.textContent = text;
        this.selectedQuizType = value; // Update the state variable
        this.hideTypeDropdown();
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
     * @param {string} filterType - The type to filter by, or 'all' for no filter (only for single mode).
     */
    loadQuizNavigation(filterType = 'all') {
        if (!this.quizNav) {
            console.error("Quiz navigation element not found, cannot load navigation.");
            return;
        }
        this.quizNav.innerHTML = '';
        if (!this.currentQuizData || !this.currentQuizData.questions || this.currentQuizData.questions.length === 0) {
            const noQuizzesItem = document.createElement('li');
            noQuizzesItem.textContent = '没有可用的题库数据';
            noQuizzesItem.style.cursor = 'default';
            noQuizzesItem.style.opacity = '0.7';
            this.quizNav.appendChild(noQuizzesItem);
            this.resetQuizDisplay(); // Clear main content
            return;
        }

        let quizzesToLoad = [];
        if (this.quizMode === 'single') {
            quizzesToLoad = this.currentQuizData.questions.filter(quiz => {
                return filterType === 'all' || quiz.type === filterType;
            });
            // If current filter yields no results, and there are other quizzes, reset to 'all' and reload
            if (quizzesToLoad.length === 0 && this.currentQuizData.questions.length > 0 && filterType !== 'all') {
                this.selectedQuizType = 'all';
                if (this.selectedQuizTypeSpan) this.selectedQuizTypeSpan.textContent = '全部题型';
                this.loadQuizNavigation('all');
                return; // Exit to prevent double loading
            }
        } else { // 'set' mode
            quizzesToLoad = this.currentQuizData.questions; // All questions for set quiz
            this.setQuizQuestions = quizzesToLoad; // Store for set quiz navigation
        }


        if (quizzesToLoad.length === 0) {
            const noQuizzesItem = document.createElement('li');
            noQuizzesItem.textContent = '没有可用的测验';
            noQuizzesItem.style.cursor = 'default';
            noQuizzesItem.style.opacity = '0.7';
            this.quizNav.appendChild(noQuizzesItem);
            this.resetQuizDisplay(); // Clear main content
            return;
        }

        quizzesToLoad.forEach((quiz, index) => {
            const listItem = document.createElement('li');
            // Add a class for overflow handling
            listItem.classList.add('quiz-nav-item');
            // Store the original index for single mode, or the set quiz internal index for set mode
            listItem.dataset.originalIndex = this.currentQuizData.questions.indexOf(quiz);
            listItem.dataset.setQuizIndex = index; // Store index within the set quiz array
            listItem.dataset.quizId = quiz.id; // Store quiz ID for lookup

            // Create a span for the title text to ensure proper wrapping
            const titleSpan = document.createElement('span');
            titleSpan.classList.add('quiz-nav-title');
            titleSpan.textContent = `${index + 1}. ${quiz.title}`;
            listItem.appendChild(titleSpan);

            listItem.title = quiz.title; // Keep title attribute for tooltip
            listItem.addEventListener('click', () => {
                if (this.quizMode === 'single') {
                    // Corrected: Pass the quiz ID to loadQuiz, not the original index
                    this.loadQuiz(quiz.id);
                } else { // 'set' mode
                    // Capture current answer before navigating if quiz started and not submitted
                    if (this.quizStarted && !this.quizSubmitted) {
                        this.captureCurrentAnswer();
                    }
                    this.currentSetQuizQuestionIndex = parseInt(listItem.dataset.setQuizIndex);
                    this.loadQuiz(quiz.id); // Load by ID for robustness in set mode
                }
            });
            this.quizNav.appendChild(listItem);

            // Apply 'answered' or 'completed' status immediately if applicable
            if (this.quizMode === 'set' && this.quizStarted && !this.quizSubmitted) {
                // For set mode during answering, mark as 'answered' if user has input
                if (this.setQuizUserAnswers[quiz.id] && Object.keys(this.setQuizUserAnswers[quiz.id]).length > 0) {
                    listItem.classList.add('answered');
                }
            } else if (this.quizScores[quiz.id]) { // For single mode or set mode after submission
                this.applyCompletionStatusToNavItem(listItem, quiz.id);
            } else if (this.setQuizScoreData[quiz.id]) { // For set mode after submission (individual scores)
                this.applyCompletionStatusToNavItem(listItem, quiz.id);
            }
        });

        // Determine which quiz to load initially
        let targetQuizId;
        if (this.quizMode === 'single') {
            targetQuizId = quizzesToLoad[this.currentQuizIndex]?.id;
        } else { // 'set' mode
            targetQuizId = quizzesToLoad[this.currentSetQuizQuestionIndex]?.id;
        }

        // Ensure targetQuizId is valid for the quizzesToLoad array
        if (quizzesToLoad.length > 0 && targetQuizId) {
            this.loadQuiz(targetQuizId); // Load by ID for robustness
        } else {
            this.resetQuizDisplay(); // Clear main content if no quiz can be loaded
        }
    }

    /**
     * Applies completion status (correct/incorrect/unanswered) and score to a navigation item.
     * @param {HTMLElement} navItem - The navigation list item DOM element.
     * @param {string|number} quizId - The ID of the quiz.
     */
    applyCompletionStatusToNavItem(navItem, quizId) {
        if (!navItem) {
            console.error("Navigation item is null, cannot apply completion status.");
            return;
        }
        // Remove completion classes from the navItem itself, as we only want to color the score text
        navItem.classList.remove('answered', 'completed-correct', 'completed-incorrect', 'completed-unanswered');
        let scoreInfo = null;

        if (this.quizMode === 'single' && this.quizScores[quizId]) {
            scoreInfo = this.quizScores[quizId];
        } else if (this.quizMode === 'set' && this.setQuizScoreData[quizId]) {
            scoreInfo = this.setQuizScoreData[quizId];
        }

        if (scoreInfo) {
            const percentage = parseFloat(scoreInfo.percentage); // Ensure it's a float
            const isCorrect = scoreInfo.isCorrect; // true for single complete correctness, or if 100% for set

            let scoreText = '';
            // Determine status and set class
            // Use scoreInfo.total and scoreInfo.correct for the X/Y part
            if (isCorrect === true || (percentage !== undefined && percentage === 100)) {
                scoreText = `100% (${scoreInfo.correct}/${scoreInfo.total})`;
            } else if (isCorrect === false || (percentage !== undefined && percentage < 100 && percentage >= 0)) {
                scoreText = `${percentage.toFixed(0)}% (${scoreInfo.correct}/${scoreInfo.total})`; // Round to nearest integer for display
            } else if (isCorrect === 'unanswered') {
                scoreText = `0% (0/${scoreInfo.total})`; // Display 0/Total for unanswered
            }

            // Append or update score display in nav item
            let scoreSpan = navItem.querySelector('.nav-item-score');
            if (!scoreSpan) {
                scoreSpan = document.createElement('span');
                scoreSpan.classList.add('nav-item-score');
                // Create a line break element to force score to a new line
                const br = document.createElement('br');
                // Insert the line break after the title span, before the score span
                const titleSpan = navItem.querySelector('.quiz-nav-title');
                if (titleSpan) {
                    titleSpan.after(br); // Insert after the title span
                    br.after(scoreSpan); // Insert score span after the break
                } else {
                    // Fallback if titleSpan isn't found (shouldn't happen with new logic)
                    navItem.appendChild(br);
                    navItem.appendChild(scoreSpan);
                }
            }
            scoreSpan.textContent = scoreText; // Set the score text

            // Apply color classes directly to the score span based on its percentage
            scoreSpan.classList.remove('score-high', 'score-mid', 'score-low'); // Clear previous classes
            if (percentage >= 90) {
                scoreSpan.classList.add('score-high');
            } else if (percentage >= 60) {
                scoreSpan.classList.add('score-mid');
            } else {
                scoreSpan.classList.add('score-low');
            }
        }
    }


    /**
     * Resets the main quiz display area to a blank state.
     */
    resetQuizDisplay() {
        if (this.quizTitleElement) this.quizTitleElement.textContent = '';
        if (this.quizTypeElement) this.quizTypeElement.textContent = '';
        if (this.questionMediaContainer) this.questionMediaContainer.innerHTML = ''; // Clear media
        if (this.quizContentElement) this.quizContentElement.innerHTML = '';
        if (this.optionsContainer) this.optionsContainer.innerHTML = '';
        if (this.startQuizBtn) this.startQuizBtn.disabled = true;
        if (this.submitQuizBtn) this.submitQuizBtn.disabled = true;
        // Conditional text for score display based on mode
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.quizMode === 'set' ? '正确率: 未作答' : '正确率: 0/0 (0%)';
        }
        if (this.timerDisplay) this.timerDisplay.textContent = '时间: 00:00';
        this.currentVideoElement = null; // Clear video reference
        if (this.prevQuestionBtn) this.prevQuestionBtn.disabled = true;
        if (this.nextQuestionBtn) this.nextQuestionBtn.disabled = true;
        if (this.submitQuizBtn) this.submitQuizBtn.textContent = '交卷'; // Reset submit button text
        if (this.scoreDisplay) this.scoreDisplay.classList.remove('score-high', 'score-mid', 'score-low');
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
        this.userAnswers = {}; // Clear user answers for the current single quiz
        this.draggedLeftItemValue = null; // Reset dragged item for matching

        // Stop video and disable controls if present
        if (this.currentVideoElement) {
            this.currentVideoElement.pause();
            this.currentVideoElement.currentTime = 0; // Reset video to start
            this.currentVideoElement.controls = false; // Disable controls
        }
        this.currentVideoElement = null; // Clear reference


        // Reset button states and displays
        this.disableOptions(true); // Pass true to remove all previous highlights/states
        if (this.startQuizBtn) this.startQuizBtn.disabled = false;
        if (this.submitQuizBtn) {
            this.submitQuizBtn.disabled = true;
            this.submitQuizBtn.textContent = '交卷'; // Chinese for button
        }
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.quizMode === 'set' ? '正确率: 未作答' : '正确率: 0/0 (0%)';
            this.scoreDisplay.classList.remove('score-high', 'score-mid', 'score-low');
        }
        if (this.timerDisplay) this.timerDisplay.textContent = '时间: 00:00';


        // Clear question media and content
        if (this.questionMediaContainer) this.questionMediaContainer.innerHTML = '';
        if (this.quizContentElement) this.quizContentElement.innerHTML = '';
        if (this.optionsContainer) this.optionsContainer.innerHTML = '';

        // Remove highlight from question numbers in content
        if (this.quizContentElement) {
            this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
                span.classList.remove('highlighted-question-num');
            });
        }

        // Reset sidebar navigation item styles
        if (this.quizNav) {
            this.quizNav.querySelectorAll('li').forEach(li => {
                li.classList.remove('active', 'answered', 'completed-correct', 'completed-incorrect', 'completed-unanswered');
                // Only remove the score span and the line break if the quiz is NOT in a submitted state
                // This ensures scores remain visible in review mode
                if (!this.quizSubmitted) {
                    const scoreSpan = li.querySelector('.nav-item-score');
                    if(scoreSpan) {
                        if (scoreSpan.previousElementSibling && scoreSpan.previousElementSibling.tagName === 'BR') {
                            scoreSpan.previousElementSibling.remove(); // Remove the <br> tag
                        }
                        scoreSpan.remove();
                    }
                }
            });
        }

        // Ensure nav buttons are disabled in set mode when quiz state is reset (unless already in submitted review mode)
        if (this.quizMode === 'set' && !this.quizSubmitted) { // Only disable if not in review mode
            if (this.prevQuestionBtn) this.prevQuestionBtn.disabled = true;
            if (this.nextQuestionBtn) this.nextQuestionBtn.disabled = true;
        }
    }


    /**
     * Loads and displays a specific quiz.
     * @param {string|number} quizId - The ID of the quiz to load.
     */
    loadQuiz(quizId) {
        let currentQuiz;
        let originalIndex;

        if (this.quizMode === 'single') {
            originalIndex = this.currentQuizData.questions.findIndex(q => q.id === quizId);
            if (originalIndex === -1) {
                console.error("Error: Single mode quiz ID not found.");
                this.resetQuizDisplay();
                return;
            }
            this.currentQuizIndex = originalIndex;
            currentQuiz = this.currentQuizData.questions[this.currentQuizIndex];
        } else { // 'set' mode
            this.currentSetQuizQuestionIndex = this.setQuizQuestions.findIndex(q => q.id === quizId);
            if (this.currentSetQuizQuestionIndex === -1) {
                console.error("Error: Set mode quiz ID not found.");
                this.resetQuizDisplay();
                return;
            }
            currentQuiz = this.setQuizQuestions[this.currentSetQuizQuestionIndex];
            originalIndex = this.currentQuizData.questions.indexOf(currentQuiz); // For general index tracking
        }

        // Reset quiz state (except for set mode user answers if still in answering phase)
        // This ensures the display is clean before rendering new quiz content
        const isSetQuizAnswering = (this.quizMode === 'set' && this.quizStarted && !this.quizSubmitted);
        // Only call resetQuizState if not in set quiz answering or review mode, to preserve scores and answers
        if (!isSetQuizAnswering && !this.quizSubmitted) {
             this.resetQuizState();
        } else {
            // If in set quiz answering or review, only clear visual feedback, but keep state for `enableOptions`
            this.disableOptions(true); // Clear only visual classes like selected-choice, correct/incorrect
            if (this.quizContentElement) {
                this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
                    span.classList.remove('highlighted-question-num');
                });
            }
            // Also ensure the "answered" class on sidebar is preserved during navigation
            const navItem = this.quizNav ? this.quizNav.querySelector(`li[data-quiz-id="${currentQuiz.id}"]`) : null;
            if (navItem && this.setQuizUserAnswers[currentQuiz.id] && Object.keys(this.setQuizUserAnswers[currentQuiz.id]).length > 0) {
                navItem.classList.add('answered');
            }
        }


        // Update active state in sidebar navigation
        if (this.quizNav) {
            Array.from(this.quizNav.children).forEach(li => {
                li.classList.remove('active');
                if (li.dataset.quizId == quizId) { // Use == for comparison as dataset is string
                    li.classList.add('active');
                }
            });
        }

        if (this.quizTitleElement) this.quizTitleElement.textContent = currentQuiz.title;
        if (this.quizTypeElement) this.quizTypeElement.textContent = `类型: ${currentQuiz.type} (${this.mapQuestionTypeToChinese(currentQuiz.questionType)})`;

        // Render media if available
        if (this.questionMediaContainer) this.questionMediaContainer.innerHTML = ''; // Clear previous media
        if (this.questionMediaContainer && currentQuiz.mediaUrl && currentQuiz.mediaType) {
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
                currentQuiz.options : (currentQuiz.options[0] ? currentQuiz.options[0].blanks : []); // Use blanks for fill-in-blank

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
        if (this.quizContentElement) this.quizContentElement.innerHTML = formattedContent;


        // Render options based on question type
        if (this.optionsContainer) {
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
                    this.optionsContainer.innerHTML = '<p>不支持的题型。</p>'; // Chinese for unsupported type
                    if (this.startQuizBtn) this.startQuizBtn.disabled = true;
                    if (this.submitQuizBtn) this.submitQuizBtn.disabled = true;
                    if (this.prevQuestionBtn) this.prevQuestionBtn.disabled = true;
                    if (this.nextQuestionBtn) this.nextQuestionBtn.disabled = true;
                    break;
            }
        }


        // Attach click listeners to question number spans if present
        if (this.quizContentElement) {
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
        }

        // Apply saved user answers if available (for set mode before submission)
        if (this.quizMode === 'set' && this.setQuizUserAnswers[currentQuiz.id]) {
            this.applySavedUserAnswers(currentQuiz, this.setQuizUserAnswers[currentQuiz.id]);
        }

        // If quiz was previously submitted (either single or set mode review), apply its state
        if (this.quizMode === 'single' && this.quizScores[currentQuiz.id]) {
            this.applySubmittedState(currentQuiz);
        } else if (this.quizMode === 'set' && this.setQuizScoreData[currentQuiz.id]) {
            this.applySubmittedState(currentQuiz);
        }

        // Enable/disable navigation buttons for set mode only, after content loaded
        if (this.quizMode === 'set' && this.quizStarted) {
            this.updateNavButtonsState();
        } else if (this.quizMode === 'set' && this.quizSubmitted) {
            // In review mode, nav buttons should always be enabled
            if (this.prevQuestionBtn) this.prevQuestionBtn.disabled = false;
            if (this.nextQuestionBtn) this.nextQuestionBtn.disabled = false;
        }
    }


    /**
     * Renders single-choice, multi-choice, and true-false questions.
     * @param {object} quizData - The current quiz object.
     */
    renderChoiceBasedQuestions(quizData) {
        if (!this.optionsContainer) {
            console.error("Options container not found, cannot render choice-based questions.");
            return;
        }
        this.optionsContainer.innerHTML = ''; // Clear previous content
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
                    this.handleChoiceAnswer(quizData.id, quizData.questionType, optionIndex, choiceKey, questionBlockDiv);
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
        // Enable options after rendering
        if (this.quizStarted && !this.quizSubmitted) {
            this.enableOptions();
        } else {
            this.disableOptions(); // Ensure options are disabled if quiz not started or submitted
        }
    }

    /**
     * Handles user selection for choice-based questions (single, multi, true-false).
     * @param {string|number} quizId - The ID of the current quiz.
     * @param {string} type - The question type ("single-choice", "multi-choice", "true-false").
     * @param {number} questionIndex - The index of the sub-question.
     * @param {string} selectedChoice - The choice key (e.g., 'A', 'B').
     * @param {HTMLElement} questionBlockDiv - The DOM element for the current question block.
     */
    handleChoiceAnswer(quizId, type, questionIndex, selectedChoice, questionBlockDiv) {
        if (!this.quizStarted || this.quizSubmitted || !questionBlockDiv) return;

        let currentAnswers;
        if (this.quizMode === 'single') {
            currentAnswers = this.userAnswers;
        } else { // set mode
            // Ensure the main answer object for this quizId exists
            this.setQuizUserAnswers[quizId] = this.setQuizUserAnswers[quizId] || {};
            currentAnswers = this.setQuizUserAnswers[quizId];
        }

        if (type === 'single-choice' || type === 'true-false') {
            // For single-choice/true-false, only one option can be selected
            questionBlockDiv.querySelectorAll('.choice-item').forEach(choiceElement => {
                choiceElement.classList.remove('selected-choice');
            });
            const chosenElement = questionBlockDiv.querySelector(`.choice-item[data-choice="${selectedChoice}"]`);
            if (chosenElement) {
                chosenElement.classList.add('selected-choice');
            }
            currentAnswers[questionIndex] = selectedChoice; // Store single string
        } else if (type === 'multi-choice') {
            // For multi-choice, toggle selection
            const currentSelectionElement = questionBlockDiv.querySelector(`.choice-item[data-choice="${selectedChoice}"]`);
            if (currentSelectionElement) {
                currentSelectionElement.classList.toggle('selected-choice');
            }


            let subQuestionAnswers = currentAnswers[questionIndex] || [];
            if (currentSelectionElement && currentSelectionElement.classList.contains('selected-choice')) {
                if (!subQuestionAnswers.includes(selectedChoice)) {
                    subQuestionAnswers.push(selectedChoice);
                }
            } else {
                subQuestionAnswers = subQuestionAnswers.filter(ans => ans !== selectedChoice);
            }
            currentAnswers[questionIndex] = subQuestionAnswers; // Store array of choices
        }

        // Mark question as "answered" in sidebar for set mode
        if (this.quizMode === 'set' && this.quizNav) {
            const navItem = this.quizNav.querySelector(`li[data-quiz-id="${quizId}"]`);
            if (navItem && !navItem.classList.contains('answered')) { // Only add if not already marked
                navItem.classList.add('answered');
            }
        }

        // Update highlighted question number in content
        if (this.quizContentElement) {
            this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
                if (parseInt(span.dataset.qindex) === questionIndex) {
                    span.classList.add('highlighted-question-num');
                } else {
                    span.classList.remove('highlighted-question-num');
                }
            });
        }
        questionBlockDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Renders a fill-in-blank question, supporting multiple blanks.
     * @param {object} quizData - The current quiz object.
     */
    renderFillInBlankQuestion(quizData) {
        if (!this.optionsContainer) {
            console.error("Options container not found, cannot render fill-in-blank question.");
            return;
        }
        this.optionsContainer.innerHTML = ''; // Clear previous content
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

        let currentAnswersArray;
        if (this.quizMode === 'single') {
            this.userAnswers[optionIndex] = this.userAnswers[optionIndex] || new Array(option.blankCount).fill('');
            currentAnswersArray = this.userAnswers[optionIndex];
        } else { // set mode
            this.setQuizUserAnswers[quizData.id] = this.setQuizUserAnswers[quizData.id] || {};
            // Initialize the specific blank array within the setQuizUserAnswers for this question
            this.setQuizUserAnswers[quizData.id][optionIndex] = this.setQuizUserAnswers[quizData.id][optionIndex] || new Array(option.blankCount).fill('');
            currentAnswersArray = this.setQuizUserAnswers[quizData.id][optionIndex];
        }


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
            if (currentAnswersArray[i] !== undefined) {
                inputElement.value = currentAnswersArray[i];
            }

            inputElement.addEventListener('input', (event) => {
                if (!this.quizStarted || this.quizSubmitted) return;
                const blankIdx = parseInt(event.target.dataset.blankIndex);
                currentAnswersArray[blankIdx] = event.target.value; // No trim here, trim on submission
                // Mark question as "answered" in sidebar for set mode if input is not empty
                if (this.quizMode === 'set' && this.quizNav) {
                    const navItem = this.quizNav.querySelector(`li[data-quiz-id="${quizData.id}"]`);
                    if (navItem && !navItem.classList.contains('answered') && event.target.value.trim() !== '') {
                        navItem.classList.add('answered');
                    }
                }
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

        // Enable options after rendering
        if (this.quizStarted && !this.quizSubmitted) {
            this.enableOptions();
        } else {
            this.disableOptions();
        }
    }

    /**
     * Renders a matching question.
     * @param {object} quizData - The current quiz object.
     */
    renderMatchingQuestion(quizData) {
        if (!this.optionsContainer) {
            console.error("Options container not found, cannot render matching question.");
            return;
        }
        this.optionsContainer.innerHTML = ''; // Clear previous content
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
            leftItem.addEventListener('dragstart', (event) => this.handleDragStart(event, quizData.id, leftValue));
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
            rightItem.addEventListener('drop', (event) => this.handleDrop(event, quizData.id, optionIndex, rightItem));

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
        if (this.quizMode === 'single') {
            this.userAnswers[optionIndex] = this.userAnswers[optionIndex] || {};
        } else { // set mode
            this.setQuizUserAnswers[quizData.id] = this.setQuizUserAnswers[quizData.id] || {};
        }


        // Initially render the user pairs display based on existing answers (if any)
        this.updateMatchingUserPairsDisplay(quizData.id, optionIndex);

        // Enable options after rendering
        if (this.quizStarted && !this.quizSubmitted) {
            this.enableOptions();
        } else {
            this.disableOptions();
        }
    }

    /**
     * Applies saved user answers to the current quiz display (for set mode when navigating).
     * @param {object} quizData - The current quiz object.
     * @param {object|Array} savedAnswers - The saved answers for this specific quiz.
     */
    applySavedUserAnswers(quizData, savedAnswers) {
        if (!savedAnswers || !this.optionsContainer) return;

        switch (quizData.questionType) {
            case 'single-choice':
            case 'true-false':
                quizData.options.forEach((option, optionIndex) => {
                    const userAnswer = savedAnswers[optionIndex];
                    if (userAnswer !== undefined) {
                        const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                        if (questionBlockDiv) {
                            const choiceElement = questionBlockDiv.querySelector(`.choice-item[data-choice="${userAnswer}"]`);
                            if (choiceElement) {
                                choiceElement.classList.add('selected-choice');
                            }
                        }
                    }
                });
                break;
            case 'multi-choice':
                quizData.options.forEach((option, optionIndex) => {
                    const userAnswersArr = savedAnswers[optionIndex] || [];
                    const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                    if (questionBlockDiv) {
                        userAnswersArr.forEach(ans => {
                            const choiceElement = questionBlockDiv.querySelector(`.choice-item[data-choice="${ans}"]`);
                            if (choiceElement) {
                                choiceElement.classList.add('selected-choice');
                            }
                        });
                    }
                });
                break;
            case 'fill-in-blank':
                const fillInBlankOptionIndex = 0; // Always 0 for fill-in-blank
                const userInputs = savedAnswers[fillInBlankOptionIndex] || [];
                const fillInBlankQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${fillInBlankOptionIndex}"]`);
                if (fillInBlankQuestionBlockDiv) {
                    userInputs.forEach((inputVal, blankIndex) => {
                        const inputElement = fillInBlankQuestionBlockDiv.querySelector(`.fill-in-blank-input[data-blank-index="${blankIndex}"]`);
                        if (inputElement) {
                            inputElement.value = inputVal;
                        }
                    });
                }
                break;
            case 'matching':
                const matchingOptionIndex = 0;
                const userMappings = savedAnswers[matchingOptionIndex] || {};
                const matchingQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${matchingOptionIndex}"]`);
                if (matchingQuestionBlockDiv) {
                    for (const leftVal in userMappings) {
                        const rightVal = userMappings[leftVal];
                        const leftElem = matchingQuestionBlockDiv.querySelector(`.left-item[data-value="${leftVal}"]`);
                        const rightElem = matchingQuestionBlockDiv.querySelector(`.right-item[data-value="${rightVal}"]`);

                        if (leftElem) {
                            leftElem.classList.add('matching-connected');
                            leftElem.classList.add('disabled');
                            leftElem.draggable = false;
                        }
                        if (rightElem) {
                            rightElem.classList.add('matching-connected');
                            rightElem.classList.add('disabled');
                            rightElem.style.pointerEvents = 'none';
                        }
                    }
                    this.updateMatchingUserPairsDisplay(quizData.id, matchingOptionIndex); // Re-render the user pairs display
                }
                break;
        }

        // After applying saved answers, re-enable options if quiz is started and not submitted
        if (this.quizStarted && !this.quizSubmitted) {
            this.enableOptions();
        }
    }

    /**
     * Applies the submitted state to the currently loaded quiz, showing explanations and results.
     * @param {object} quizData - The current quiz object.
     */
    applySubmittedState(quizData) {
        this.disableOptions(true); // Disable options and clear all styles for review
        this.quizStarted = false; // Ensure quiz is not in active answering state
        this.quizSubmitted = true; // Set submitted flag
        clearInterval(this.timerInterval); // Stop timer

        if (this.startQuizBtn) this.startQuizBtn.disabled = true; // Start button always disabled after submission
        if (this.submitQuizBtn) {
            this.submitQuizBtn.disabled = false; // Enable submit button for re-attempt
            this.submitQuizBtn.textContent = '重新作答'; // Change text to Re-attempt
        }

        if (this.scoreDisplay) this.scoreDisplay.classList.remove('score-high', 'score-mid', 'score-low');


        if (this.quizContentElement) {
            this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
                span.classList.remove('highlighted-question-num');
            });
        }


        // Determine which set of answers/scores to use
        let answersToUse, scoreInfo;
        // For 'set' mode, retrieve individual question score data
        if (this.quizMode === 'set' && this.setQuizScoreData[quizData.id]) {
            answersToUse = this.setQuizUserAnswers[quizData.id] || {};
            scoreInfo = this.setQuizScoreData[quizData.id]; // Use quizData.id here
        } else if (this.quizMode === 'single' && this.quizScores[quizData.id]) {
            answersToUse = this.quizScores[quizData.id].userAnswers;
            scoreInfo = this.quizScores[quizData.id];
        }

        if (!scoreInfo) {
            console.warn(`No score information found for quiz ID: ${quizData.id}. Cannot apply submitted state.`);
            // Fallback for scoreInfo if not found (e.g. if navigating to an unanswered question after submission)
            scoreInfo = { correct: 0, total: 0, percentage: 0, isCorrect: 'unanswered', time: (this.timerDisplay ? this.timerDisplay.textContent : '00:00') };
            answersToUse = this.setQuizUserAnswers[quizData.id] || {}; // Use whatever user answers might exist
        }

        const currentPercentage = parseFloat(scoreInfo.percentage);
        const currentCorrect = scoreInfo.correct;
        const currentTotal = scoreInfo.total;

        // Update the main content area's score display to show current question's accuracy
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = `正确率: ${currentCorrect}/${currentTotal} (${currentPercentage}%)`;
            this.scoreDisplay.classList.remove('score-high', 'score-mid', 'score-low');
            if (currentPercentage >= 90) {
                this.scoreDisplay.classList.add('score-high');
            } else if (currentPercentage >= 60) {
                this.scoreDisplay.classList.add('score-mid');
            } else {
                this.scoreDisplay.classList.add('score-low');
            }
        }
        if (this.timerDisplay) this.timerDisplay.textContent = scoreInfo.time || this.timerDisplay.textContent; // Show time taken

        // Display explanation and visual feedback for the current question
        if (!this.optionsContainer) {
            console.error("Options container not found, cannot apply submitted state for current question.");
            return;
        }

        switch (quizData.questionType) {
            case 'single-choice':
            case 'true-false':
                quizData.options.forEach((optionData, optionIndex) => {
                    const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                    if (!questionBlockDiv) return;
                    const correctAnswer = optionData.answer;
                    const userAnswer = answersToUse[optionIndex];

                    let isCorrectSub = (userAnswer !== undefined && String(userAnswer) === String(correctAnswer));

                    questionBlockDiv.querySelectorAll('.choice-item').forEach(choiceElement => {
                        const choiceKey = choiceElement.dataset.choice;
                        choiceElement.classList.remove('selected-choice', 'correct-choice', 'incorrect-choice'); // Clear selected first

                        if (String(choiceKey) === String(correctAnswer)) { // Highlight correct answer
                            choiceElement.classList.add('correct-choice');
                        }
                        // Highlight incorrect user answer if it's not the correct one
                        if (userAnswer !== undefined && String(userAnswer) === String(choiceKey) && !isCorrectSub) {
                            choiceElement.classList.add('incorrect-choice');
                        }
                    });
                    this.displayExplanation(questionBlockDiv, userAnswer, correctAnswer, optionData.explanation, optionData.choices, isCorrectSub, quizData.questionType);
                });
                break;
            case 'multi-choice':
                quizData.options.forEach((optionData, optionIndex) => {
                    const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                    if (!questionBlockDiv) return;
                    const correctAnswers = Array.isArray(optionData.answer) ? optionData.answer.sort() : [];
                    const userAnswers = (answersToUse[optionIndex] || []).sort();

                    let isCorrectSub = (correctAnswers.length === userAnswers.length &&
                                     correctAnswers.every((val, idx) => val === userAnswers[idx]));

                    questionBlockDiv.querySelectorAll('.choice-item').forEach(choiceElement => {
                        const choiceKey = choiceElement.dataset.choice;
                        choiceElement.classList.remove('selected-choice', 'correct-choice', 'incorrect-choice'); // Clear selected first

                        if (correctAnswers.includes(choiceKey)) { // Highlight all correct answers
                            choiceElement.classList.add('correct-choice');
                        }
                        // Highlight incorrect user selections
                        if (userAnswers.includes(choiceKey) && !correctAnswers.includes(choiceKey)) {
                            choiceElement.classList.add('incorrect-choice');
                        }
                    });
                    this.displayExplanation(questionBlockDiv, userAnswers, correctAnswers, optionData.explanation, optionData.choices, isCorrectSub, quizData.questionType);
                });
                break;
            case 'fill-in-blank':
                const fillInBlankOptionData = quizData.options[0];
                const fillInBlankQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
                if (!fillInBlankQuestionBlockDiv) return;
                const correctAnswersArray = fillInBlankOptionData.answer;
                const userInputsArray = answersToUse[0] || new Array(fillInBlankOptionData.blankCount).fill('');

                let fillInBlankExplanationContent = `<div class="explanation-item">`;

                for (let i = 0; i < fillInBlankOptionData.blankCount; i++) {
                    const inputElement = fillInBlankQuestionBlockDiv.querySelector(`.fill-in-blank-input[data-blank-index="${i}"]`);
                    const correctAnswer = (correctAnswersArray[i] || '').toLowerCase().trim();
                    const userInput = (userInputsArray[i] || '').toLowerCase().trim();

                    const isBlankCorrect = (userInput === correctAnswer);

                    if (inputElement) { // Ensure element exists before modifying
                        inputElement.disabled = true; // Disable input field
                        inputElement.classList.add('disabled');
                        if (isBlankCorrect) {
                            inputElement.classList.add('correct');
                        } else {
                            inputElement.classList.add('incorrect');
                        }
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
                const explanationEl = fillInBlankQuestionBlockDiv.querySelector('.question-explanation');
                if (explanationEl) {
                    explanationEl.innerHTML = fillInBlankExplanationContent;
                    explanationEl.style.display = 'block';
                }
                break;
            case 'matching':
                const correctMappings = quizData.options[0].answer; // The object of correct pairs
                const userMappings = answersToUse[0] || {}; // User's matched pairs for the single matching question

                const matchingQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
                if (!matchingQuestionBlockDiv) return;

                matchingQuestionBlockDiv.querySelectorAll('.matching-item').forEach(item => {
                    item.classList.add('disabled');
                    item.style.pointerEvents = 'none';
                    item.draggable = false;
                    item.classList.remove('matching-selected-left', 'matching-selected-right', 'matching-connected', 'matching-incorrect', 'correct-choice');
                });
                const userPairsDisplay = matchingQuestionBlockDiv.querySelector('.matching-user-pairs-display');
                if (userPairsDisplay) {
                    userPairsDisplay.style.display = 'none';
                }


                let matchingExplanationContent = `<div class="explanation-item"><h4>连线结果：</h4>`;
                matchingExplanationContent += `<div class="matching-explanation-grid">`;
                for (const leftKey in correctMappings) {
                    const expectedRight = correctMappings[leftKey];
                    const userRight = userMappings[leftKey];

                    const isPairCorrect = (userRight !== undefined && userRight === expectedRight);

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

                    matchingExplanationContent += `
                        <div class="matching-explanation-pair-row ${isPairCorrect ? 'correct' : 'incorrect'}">
                            <span class="explanation-left-side">${leftKey}</span>
                            <span class="explanation-user-answer">${userRight || '未作答'}</span>
                            <span class="explanation-status-icon"><i class="fas ${isPairCorrect ? 'fa-check-circle' : 'fa-times-circle'}" style="color: ${isPairCorrect ? '#28a745' : '#dc3545'};"></i></span>
                            <span class="explanation-correct-answer">正确: ${expectedRight}</span>
                        </div>
                    `;
                }
                matchingExplanationContent += `</div>`;
                matchingExplanationContent += `<span class="explanation-text">解析: ${quizData.options[0].explanation}</span></div>`;
                const matchingExplanationEl = matchingQuestionBlockDiv.querySelector('.question-explanation');
                if (matchingExplanationEl) {
                    matchingExplanationEl.innerHTML = matchingExplanationContent;
                    matchingExplanationEl.style.display = 'block';
                }
                break;
        }

        // After submission, ensure nav buttons are enabled for review
        if (this.quizMode === 'set' && this.quizSubmitted) {
            if (this.prevQuestionBtn) this.prevQuestionBtn.disabled = false;
            if (this.nextQuestionBtn) this.nextQuestionBtn.disabled = false;
        }
    }


    /**
     * Handles the dragstart event for left matching items.
     * @param {DragEvent} event - The drag event.
     * @param {string|number} quizId - The ID of the current quiz.
     * @param {string} value - The value of the dragged item.
     */
    handleDragStart(event, quizId, value) {
        if (!this.quizStarted || this.quizSubmitted) {
            event.preventDefault(); // Prevent dragging if quiz not started or submitted
            return;
        }
        this.draggedLeftItemValue = value;
        event.dataTransfer.setData('text/plain', value); // Set data for drag operation
        event.target.classList.add('dragging'); // Add visual feedback for dragging

        const currentQuizUserAnswers = this.quizMode === 'single' ? this.userAnswers : (this.setQuizUserAnswers[quizId] || {});
        const optionIndex = 0; // Matching is always optionIndex 0

        // If this left item was already paired, remove the old pairing from userAnswers
        if (currentQuizUserAnswers && currentQuizUserAnswers[optionIndex] && currentQuizUserAnswers[optionIndex][value]) {
            const oldRightValue = currentQuizUserAnswers[optionIndex][value];
            delete currentQuizUserAnswers[optionIndex][value]; // Remove the old pair

            // Remove connected/disabled classes from the previously matched right item
            const questionBlockDiv = event.target.closest('.question-block');
            if (questionBlockDiv) {
                const oldRightElem = questionBlockDiv.querySelector(`.right-item[data-value="${oldRightValue}"]`);
                if (oldRightElem) {
                    oldRightElem.classList.remove('matching-connected', 'disabled');
                    oldRightElem.style.pointerEvents = 'auto'; // Re-enable pointer events
                }
            }
            this.updateMatchingUserPairsDisplay(quizId, optionIndex); // Update display
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
     * @param {string|number} quizId - The ID of the current quiz.
     * @param {number} questionIndex - The index of the matching question.
     * @param {HTMLElement} dropTargetItem - The right item element that was dropped on.
     */
    handleDrop(event, quizId, questionIndex, dropTargetItem) {
        if (!this.quizStarted || this.quizSubmitted || !dropTargetItem) return;

        event.preventDefault();
        event.target.classList.remove('drag-over'); // Remove highlight

        const draggedValue = event.dataTransfer.getData('text/plain'); // Get value of the dragged left item
        const droppedOnValue = dropTargetItem.dataset.value; // Get value of the right item

        // Check if the dragged item is actually a left item and is from the current quiz
        if (draggedValue && this.draggedLeftItemValue === draggedValue) {
            let currentQuizUserAnswers;
            if (this.quizMode === 'single') {
                this.userAnswers[questionIndex] = this.userAnswers[questionIndex] || {};
                currentQuizUserAnswers = this.userAnswers[questionIndex];
            } else { // set mode
                this.setQuizUserAnswers[quizId] = this.setQuizUserAnswers[quizId] || {};
                currentQuizUserAnswers = this.setQuizUserAnswers[quizId][questionIndex] = this.setQuizUserAnswers[quizId][questionIndex] || {};
            }

            currentQuizUserAnswers[draggedValue] = droppedOnValue;

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

            // Mark question as "answered" in sidebar for set mode if a pair is made
            if (this.quizMode === 'set' && this.quizNav) {
                const navItem = this.quizNav.querySelector(`li[data-quiz-id="${quizId}"]`);
                if (navItem && !navItem.classList.contains('answered')) {
                    navItem.classList.add('answered');
                }
            }

            this.updateMatchingUserPairsDisplay(quizId, questionIndex); // Update the user pairs display
        }
        this.draggedLeftItemValue = null; // Reset dragged item value
    }

    /**
     * Updates the display area showing the user's current matched pairs for a matching question.
     * @param {string|number} quizId - The ID of the current quiz.
     * @param {number} questionIndex - The index of the matching question.
     */
    updateMatchingUserPairsDisplay(quizId, questionIndex) {
        if (!this.optionsContainer) {
            console.error("Options container not found, cannot update matching user pairs display.");
            return;
        }
        const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${questionIndex}"]`);
        if (!questionBlockDiv) return;

        const matchedPairsList = questionBlockDiv.querySelector('#matched-pairs-list');
        if (!matchedPairsList) return;

        matchedPairsList.innerHTML = ''; // Clear previous display

        let userMappings;
        if (this.quizMode === 'single') {
            userMappings = this.userAnswers[questionIndex] || {};
        } else { // set mode
            userMappings = this.setQuizUserAnswers[quizId] ? this.setQuizUserAnswers[quizId][questionIndex] || {} : {};
        }

        const currentQuiz = this.quizMode === 'single' ?
            this.currentQuizData.questions[this.currentQuizIndex] :
            this.setQuizQuestions[this.currentSetQuizQuestionIndex];
        if (!currentQuiz || !currentQuiz.options[0]) {
             console.warn("Current quiz or its options not found for matching display update.");
             return;
        }

        // This assumes options[0] for matching question
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
                    if (this.quizMode === 'single') {
                        delete this.userAnswers[questionIndex][leftValue];
                    } else {
                        delete this.setQuizUserAnswers[quizId][questionIndex][leftValue];
                        // If no more answers for this question, remove 'answered' class
                        if (Object.keys(this.setQuizUserAnswers[quizId][questionIndex] || {}).length === 0 && this.quizNav) {
                            const navItem = this.quizNav.querySelector(`li[data-quiz-id="${quizId}"]`);
                            if (navItem) navItem.classList.remove('answered');
                        }
                    }
                    this.updateMatchingUserPairsDisplay(quizId, questionIndex); // Update the display
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
        clearInterval(this.timerInterval); // Clear any existing timer
        this.timerInterval = setInterval(this.updateTimer.bind(this), 1000);
        if (this.startQuizBtn) this.startQuizBtn.disabled = true;
        if (this.submitQuizBtn) {
            this.submitQuizBtn.disabled = false;
            this.submitQuizBtn.textContent = '交卷'; // Chinese for button
        }


        // Reset sidebar completion classes on start - this will now also clear scores
        if (this.quizNav) {
            this.quizNav.querySelectorAll('li').forEach(li => {
                li.classList.remove('completed-correct', 'completed-incorrect', 'completed-unanswered', 'answered');
                // Remove the score span and the line break
                const scoreSpan = li.querySelector('.nav-item-score');
                if(scoreSpan) {
                    if (scoreSpan.previousElementSibling && scoreSpan.previousElementSibling.tagName === 'BR') {
                        scoreSpan.previousElementSibling.remove(); // Remove the <br> tag
                    }
                    scoreSpan.remove();
                }
            });
        }


        // Play video and enable controls if present
        if (this.currentVideoElement) {
            this.currentVideoElement.controls = true; // Enable video controls
            // Play video only if it was paused before, to prevent re-play on navigation
            if (this.quizStarted) { // Only play if quiz is actively running (not review)
                 this.currentVideoElement.play().catch(e => console.error("Video autoplay prevented:", e));
            }
        }

        // Hide sidebar automatically on quiz start
        if (this.sidebar && this.body && this.showSidebarIconContainer && !this.sidebar.classList.contains('hidden')) {
            this.sidebar.classList.add('hidden');
            this.body.classList.add('sidebar-hidden');
            this.showSidebarIconContainer.style.display = 'flex';
        }

        if (this.scoreDisplay) this.scoreDisplay.classList.remove('score-high', 'score-mid', 'score-low'); // Remove previous score styling

        // For set quiz mode, load the first question and enable navigation buttons
        if (this.quizMode === 'set') {
            this.setQuizUserAnswers = {}; // Clear previous answers for a new attempt
            this.setQuizScoreData = {}; // Clear previous score data
            this.overallSetQuizScore = { correct: 0, total: 0, percentage: 0 }; // Reset overall score
            if (this.setQuizSummaryDisplay) this.setQuizSummaryDisplay.style.display = 'none'; // Hide summary display
            this.currentSetQuizQuestionIndex = 0;
            if (this.setQuizQuestions.length > 0) {
                this.loadQuiz(this.setQuizQuestions[0].id);
                this.updateNavButtonsState(); // Update prev/next button state
                if (this.scoreDisplay) this.scoreDisplay.textContent = '正确率: 未作答'; // Reset for set quiz
            } else {
                console.warn("No questions loaded for set quiz.");
                this.resetQuizDisplay();
            }
        } else { // Single quiz mode
            this.userAnswers = {}; // Clear previous answers
            this.quizScores = {}; // Clear previous scores
            // Options are already enabled by loadQuiz/render methods
            if (this.scoreDisplay) this.scoreDisplay.textContent = '正确率: 未作答'; // For single quiz, until submitted
            this.enableOptions(); // Explicitly enable for single mode if not done by loadQuiz
        }
    }

    /**
     * Updates the timer display every second.
     */
    updateTimer() {
        if (!this.timerDisplay) return;

        const elapsedTime = Date.now() - this.startTime;
        let totalSeconds = Math.floor(elapsedTime / 1000);

        if (this.quizMode === 'set' && this.setQuizTimeLimit > 0) {
            const timeLimitSeconds = this.setQuizTimeLimit * 60;
            totalSeconds = timeLimitSeconds - totalSeconds;
            if (totalSeconds <= 0) {
                totalSeconds = 0;
                clearInterval(this.timerInterval);
                this.handleSubmitOrReattempt(); // Auto-submit when time runs out
                // Using an alert here as per previous code, but typically a custom modal would be preferred.
                // alert('时间到，测验已自动提交！'); // Alert user
                this.displayMessage('时间到，测验已自动提交！', 'info'); // Use custom message box
            }
        }

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        this.timerDisplay.textContent = `时间: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Chinese for display
    }

    /**
     * Custom message display instead of alert().
     * @param {string} message - The message to display.
     * @param {string} type - 'info', 'success', 'error' for styling.
     */
    displayMessage(message, type = 'info') {
        const messageBox = document.createElement('div');
        messageBox.classList.add('message-box', type);
        messageBox.textContent = message;
        document.body.appendChild(messageBox);

        // Position it centrally (could be refined with CSS)
        messageBox.style.position = 'fixed';
        messageBox.style.top = '50%';
        messageBox.style.left = '50%';
        messageBox.style.transform = 'translate(-50%, -50%)';
        messageBox.style.padding = '20px';
        messageBox.style.backgroundColor = type === 'error' ? '#dc3545' : (type === 'success' ? '#28a745' : '#4CAF50');
        messageBox.style.color = 'white';
        messageBox.style.borderRadius = '8px';
        messageBox.style.zIndex = '9999';
        messageBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        messageBox.style.textAlign = 'center';
        messageBox.style.maxWidth = '80%';

        setTimeout(() => {
            messageBox.remove();
        }, 3000); // Remove after 3 seconds
    }


    /**
     * Enables all quiz options for user selection based on question type.
     */
    enableOptions() {
        const currentQuiz = this.quizMode === 'single' ?
            this.currentQuizData.questions[this.currentQuizIndex] :
            this.setQuizQuestions[this.currentSetQuizQuestionIndex];
        if (!currentQuiz || !this.optionsContainer) return;

        // Pause and disable video controls if present
        if (this.currentVideoElement) {
            this.currentVideoElement.controls = true; // Enable video controls
            // Play video only if it was paused before, to prevent re-play on navigation
            if (this.quizStarted) { // Only play if quiz is actively running (not review)
                 this.currentVideoElement.play().catch(e => console.error("Video autoplay prevented:", e));
            }
        }

        if (currentQuiz.questionType === 'fill-in-blank') {
            this.optionsContainer.querySelectorAll('.fill-in-blank-input').forEach(input => {
                input.disabled = false;
                input.classList.remove('disabled', 'correct', 'incorrect');
            });
        } else if (currentQuiz.questionType === 'matching') {
            this.optionsContainer.querySelectorAll('.matching-item').forEach(item => {
                item.classList.remove('disabled', 'matching-connected', 'matching-incorrect', 'correct-choice'); // Clear any past result highlights
                item.style.pointerEvents = 'auto'; // Re-enable pointer events
                // Ensure draggable is true for left items unless they are already paired
                if (item.classList.contains('left-item')) {
                    let userMappings = this.quizMode === 'single' ? this.userAnswers[0] : (this.setQuizUserAnswers[currentQuiz.id] ? this.setQuizUserAnswers[currentQuiz.id][0] : {});
                    if (!userMappings[item.dataset.value]) { // Only if not already paired
                        item.draggable = true;
                    } else { // If already paired, keep it disabled
                        item.classList.add('disabled');
                        item.style.pointerEvents = 'none';
                        item.draggable = false;
                    }
                }
            });
            // Show user pairs display
            const matchingQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
            if (matchingQuestionBlockDiv) {
                const userPairsDisplay = matchingQuestionBlockDiv.querySelector('.matching-user-pairs-display');
                if (userPairsDisplay) {
                    userPairsDisplay.style.display = 'block';
                }
            }
        } else { // single-choice, multi-choice, true-false
            this.optionsContainer.querySelectorAll('.choice-item').forEach(choiceItem => {
                choiceItem.classList.remove('disabled', 'correct-choice', 'incorrect-choice');
            });
        }
    }

    /**
     * Disables all quiz options and hides explanations.
     * @param {boolean} clearVisualFeedback - If true, removes all visual feedback like selected/correct/incorrect.
     */
    disableOptions(clearVisualFeedback = false) {
        const currentQuiz = this.quizMode === 'single' ?
            this.currentQuizData.questions[this.currentQuizIndex] :
            this.setQuizQuestions[this.currentSetQuizQuestionIndex];
        if (!currentQuiz || !this.optionsContainer) return;

        // Pause and disable video controls if present
        if (this.currentVideoElement) {
            this.currentVideoElement.pause();
            this.currentVideoElement.controls = false;
        }

        if (currentQuiz.questionType === 'fill-in-blank') {
            this.optionsContainer.querySelectorAll('.fill-in-blank-input').forEach(input => {
                input.disabled = true;
                input.classList.add('disabled');
                if (clearVisualFeedback) {
                    input.classList.remove('correct', 'incorrect');
                }
            });
        } else if (currentQuiz.questionType === 'matching') {
            this.optionsContainer.querySelectorAll('.matching-item').forEach(item => {
                item.classList.add('disabled');
                item.style.pointerEvents = 'none';
                item.draggable = false;
                if (clearVisualFeedback) {
                    item.classList.remove('matching-selected-left', 'matching-selected-right', 'matching-connected', 'matching-incorrect', 'correct-choice');
                }
            });
            // Hide user pairs display
            const matchingQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
            if (matchingQuestionBlockDiv) {
                const userPairsDisplay = matchingQuestionBlockDiv.querySelector('.matching-user-pairs-display');
                if (userPairsDisplay) {
                    userPairsDisplay.style.display = 'none';
                }
            }
        } else { // single-choice, multi-choice, true-false
            this.optionsContainer.querySelectorAll('.choice-item').forEach(choiceItem => {
                choiceItem.classList.add('disabled');
                if (clearVisualFeedback) {
                    choiceItem.classList.remove('selected-choice', 'correct-choice', 'incorrect-choice');
                }
            });
        }
        this.optionsContainer.querySelectorAll('.question-explanation').forEach(explanationDiv => {
            explanationDiv.style.display = 'none';
        });
        if (this.quizContentElement) {
            this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
                span.classList.remove('highlighted-question-num');
            });
        }
    }

    /**
     * Handles quiz submission or re-attempt logic.
     */
    handleSubmitOrReattempt() {
        const currentQuizDataFromState = this.quizMode === 'single' ?
            (this.currentQuizData && this.currentQuizData.questions[this.currentQuizIndex]) :
            (this.setQuizQuestions && this.setQuizQuestions[this.currentSetQuizQuestionIndex]); // Get the current question for context
        if (!currentQuizDataFromState) {
            console.error("No current quiz data to handle submission/re-attempt.");
            return;
        }

        if (!this.quizStarted && !this.quizSubmitted) {
            console.warn("Quiz not started yet. Please click '开始作答' first.");
            return;
        }

        if (!this.quizSubmitted) { // Logic for Initial Submission
            clearInterval(this.timerInterval);
            this.quizSubmitted = true; // Mark as submitted
            this.quizStarted = false; // Stop the active answering state

            if (this.startQuizBtn) this.startQuizBtn.disabled = true; // Disable Start button
            if (this.submitQuizBtn) {
                this.submitQuizBtn.disabled = false; // Keep Submit button enabled for re-attempt
                this.submitQuizBtn.textContent = '重新作答'; // Change text to Re-attempt
            }


            this.disableOptions(); // Disable all options after submission

            if (this.quizContentElement) {
                this.quizContentElement.querySelectorAll('.question-num-in-text').forEach(span => {
                    span.classList.remove('highlighted-question-num');
                });
            }


            if (this.quizMode === 'single') {
                this.evaluateSingleQuizSubmission(currentQuizDataFromState);
            } else { // 'set' mode
                this.captureCurrentAnswer(); // Capture answer for the currently displayed question before final evaluation
                this.evaluateSetQuizSubmission();

                // After set quiz submission, load the current question with its results
                const currentQuizInSet = this.setQuizQuestions[this.currentSetQuizQuestionIndex];
                this.loadQuiz(currentQuizInSet.id); // Re-load to show current question's results

                // Show sidebar automatically after submission and select first item if present
                if (this.sidebar && this.body && this.showSidebarIconContainer && this.sidebar.classList.contains('hidden')) {
                    this.sidebar.classList.remove('hidden');
                    this.body.classList.remove('sidebar-hidden');
                    this.showSidebarIconContainer.style.display = 'none';
                }
                // Select the first item in navigation and scroll to it
                if (this.quizNav && this.quizNav.children.length > 0) {
                    const firstNavItem = this.quizNav.children[0];
                    firstNavItem.click(); // Simulate click to load and highlight
                    this.quizNav.scrollTop = 0; // Scroll to top
                }
            }

        } else { // Logic for Re-attempt after Submission
            // For single mode, clear score for current quiz.
            // For set mode, clear all set quiz scores and answers.
            if (this.quizMode === 'single') {
                if (currentQuizDataFromState && this.quizScores[currentQuizDataFromState.id]) {
                    delete this.quizScores[currentQuizDataFromState.id];
                }
                const navItem = this.quizNav ? this.quizNav.querySelector(`li[data-original-index="${this.currentQuizIndex}"]`) : null;
                if (navItem) {
                    navItem.classList.remove('completed-correct', 'completed-incorrect', 'completed-unanswered');
                    // Remove the score span and the line break
                    const scoreSpan = navItem.querySelector('.nav-item-score');
                    if(scoreSpan) {
                        if (scoreSpan.previousElementSibling && scoreSpan.previousElementSibling.tagName === 'BR') {
                            scoreSpan.previousElementSibling.remove(); // Remove the <br> tag
                        }
                        scoreSpan.remove();
                    }
                }
                this.loadQuiz(currentQuizDataFromState.id); // Reload the current single quiz to reset everything
            } else { // 'set' mode re-attempt
                this.setQuizUserAnswers = {}; // Clear all previous user answers for the set
                this.setQuizScoreData = {}; // Clear all previous score data for the set
                this.overallSetQuizScore = { correct: 0, total: 0, percentage: 0 }; // Reset overall score
                if (this.setQuizSummaryDisplay) this.setQuizSummaryDisplay.style.display = 'none'; // Hide summary display
                if (this.overallScorePercentageDisplay) {
                    this.overallScorePercentageDisplay.textContent = ''; // Clear summary text
                    this.overallScorePercentageDisplay.classList.remove('score-high', 'score-mid', 'score-low');
                }
                this.currentSetQuizQuestionIndex = 0; // Reset to the first question
                this.quizSubmitted = false; // Reset submitted flag
                this.quizStarted = false; // Reset started flag
                this.startQuiz(); // Restart the set quiz from scratch
                if (this.submitQuizBtn) this.submitQuizBtn.textContent = '交卷'; // Reset button text
            }
        }
    }

    /**
     * Evaluates answers and displays results for single quiz mode.
     * @param {object} quizData - The current quiz object.
     */
    evaluateSingleQuizSubmission(quizData) {
        let correctCount = 0;
        let totalQuestions = 0;
        if (!this.optionsContainer || !this.scoreDisplay || !this.timerDisplay) {
            console.error("Missing critical elements for evaluation.");
            return;
        }

        switch (quizData.questionType) {
            case 'single-choice':
            case 'true-false':
                totalQuestions = quizData.options.length;
                quizData.options.forEach((optionData, optionIndex) => {
                    const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                    if (!questionBlockDiv) return;
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

                    if (isCorrect) {
                        correctCount++;
                    }
                    this.displayExplanation(questionBlockDiv, userAnswer, correctAnswer, optionData.explanation, optionData.choices, isCorrect, quizData.questionType);
                });
                break;

            case 'multi-choice':
                totalQuestions = quizData.options.length;
                quizData.options.forEach((optionData, optionIndex) => {
                    const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                    if (!questionBlockDiv) return;
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

                    if (isCorrect) {
                        correctCount++;
                    }
                    this.displayExplanation(questionBlockDiv, userAnswers, correctAnswers, optionData.explanation, optionData.choices, isCorrect, quizData.questionType);
                });
                break;

            case 'fill-in-blank':
                totalQuestions = quizData.options[0].blankCount;
                const fillInBlankOptionData = quizData.options[0];
                const fillInBlankQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
                if (!fillInBlankQuestionBlockDiv) return;
                const correctAnswersArray = fillInBlankOptionData.answer;
                const userInputsArray = this.userAnswers[0] || new Array(totalQuestions).fill('');

                let fillInBlankExplanationContent = `<div class="explanation-item">`;

                for (let i = 0; i < totalQuestions; i++) {
                    const inputElement = fillInBlankQuestionBlockDiv.querySelector(`.fill-in-blank-input[data-blank-index="${i}"]`);
                    const correctAnswer = (correctAnswersArray[i] || '').toLowerCase().trim();
                    const userInput = (userInputsArray[i] || '').toLowerCase().trim();

                    const isBlankCorrect = (userInput === correctAnswer);

                    if (inputElement) {
                        inputElement.disabled = true;
                        inputElement.classList.add('disabled');

                        if (isBlankCorrect) {
                            inputElement.classList.add('correct');
                            correctCount++;
                        } else {
                            inputElement.classList.add('incorrect');
                        }
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
                const explanationEl = fillInBlankQuestionBlockDiv.querySelector('.question-explanation');
                if (explanationEl) {
                    explanationEl.innerHTML = fillInBlankExplanationContent;
                    explanationEl.style.display = 'block';
                }
                break;

            case 'matching':
                totalQuestions = quizData.options[0].pairs.length;
                const correctMappings = quizData.options[0].answer;
                const userMappings = this.userAnswers[0] || {};

                const matchingQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="0"]`);
                if (!matchingQuestionBlockDiv) return;

                matchingQuestionBlockDiv.querySelectorAll('.matching-item').forEach(item => {
                    item.classList.add('disabled');
                    item.style.pointerEvents = 'none';
                    item.draggable = false;
                    item.classList.remove('matching-selected-left', 'matching-selected-right', 'matching-connected', 'matching-incorrect', 'correct-choice');
                });
                const userPairsDisplay = matchingQuestionBlockDiv.querySelector('.matching-user-pairs-display');
                if (userPairsDisplay) {
                    userPairsDisplay.style.display = 'none';
                }


                let matchingExplanationContent = `<div class="explanation-item"><h4>连线结果：</h4>`;
                matchingExplanationContent += `<div class="matching-explanation-grid">`;
                for (const leftKey in correctMappings) {
                    const expectedRight = correctMappings[leftKey];
                    const userRight = userMappings[leftKey];

                    const isPairCorrect = (userRight !== undefined && userRight === expectedRight);

                    const leftElem = matchingQuestionBlockDiv.querySelector(`.left-item[data-value="${leftKey}"]`);
                    const userRightElem = matchingQuestionBlockDiv.querySelector(`.right-item[data-value="${userRight}"]`);
                    const correctRightElem = matchingQuestionBlockDiv.querySelector(`.right-item[data-value="${expectedRight}"]`);

                    if (isPairCorrect) {
                        correctCount++;
                        if (leftElem) leftElem.classList.add('matching-connected');
                        if (userRightElem) userRightElem.classList.add('matching-connected');
                    } else {
                        if (leftElem) leftElem.classList.add('matching-incorrect');
                        if (userRightElem && userRight) userRightElem.classList.add('matching-incorrect');
                        if (correctRightElem) correctRightElem.classList.add('correct-choice');
                    }

                    matchingExplanationContent += `
                        <div class="matching-explanation-pair-row ${isPairCorrect ? 'correct' : 'incorrect'}">
                            <span class="explanation-left-side">${leftKey}</span>
                            <span class="explanation-user-answer">${userRight || '未作答'}</span>
                            <span class="explanation-status-icon"><i class="fas ${isPairCorrect ? 'fa-check-circle' : 'fa-times-circle'}" style="color: ${isPairCorrect ? '#28a745' : '#dc3545'};"></i></span>
                            <span class="explanation-correct-answer">正确: ${expectedRight}</span>
                        </div>
                    `;
                }
                matchingExplanationContent += `</div>`;
                matchingExplanationContent += `<span class="explanation-text">解析: ${quizData.options[0].explanation}</span></div>`;
                const matchingExplanationEl = matchingQuestionBlockDiv.querySelector('.question-explanation');
                if (matchingExplanationEl) {
                    matchingExplanationEl.innerHTML = matchingExplanationContent;
                    matchingExplanationEl.style.display = 'block';
                }
                break;
        }


        // Calculate and display overall score
        const accuracyPercentage = totalQuestions === 0 ? 0 : ((correctCount / totalQuestions) * 100).toFixed(2);
        this.scoreDisplay.textContent = `正确率: ${correctCount}/${totalQuestions} (${accuracyPercentage}%)`;
        this.scoreDisplay.classList.remove('score-high', 'score-mid', 'score-low');
        if (accuracyPercentage >= 90) {
            this.scoreDisplay.classList.add('score-high');
        } else if (accuracyPercentage >= 60) {
            this.scoreDisplay.classList.add('score-mid');
        } else {
            this.scoreDisplay.classList.add('score-low');
        }

        // Mark quiz as completed in navigation
        const navItem = this.quizNav ? this.quizNav.querySelector(`li[data-original-index="${this.currentQuizIndex}"]`) : null;
        if (navItem) {
            this.applyCompletionStatusToNavItem(navItem, quizData.id);
        }

        // Store score and user answers for the main quiz ID
        this.quizScores[quizData.id] = {
            correct: correctCount,
            total: totalQuestions,
            percentage: accuracyPercentage,
            time: this.timerDisplay.textContent,
            userAnswers: JSON.parse(JSON.stringify(this.userAnswers)) // Deep copy userAnswers
        };
    }

    /**
     * Evaluates all answers and displays results for set quiz mode.
     */
    evaluateSetQuizSubmission() {
        let totalCorrectQuestions = 0;
        let totalSubQuestionsInSet = 0; // Total individual sub-questions across the entire set
        let setOverallTime = this.timerDisplay ? this.timerDisplay.textContent : '00:00';

        this.setQuizScoreData = {}; // Clear previous set score data

        this.setQuizQuestions.forEach(quiz => {
            const quizId = quiz.id;
            const userAnswersForThisQuiz = this.setQuizUserAnswers[quizId];
            let correctCountForQuiz = 0;
            let totalSubQuestionsForQuiz = 0;
            let isQuizFullyCorrect = true; // For single-choice, multi-choice sub-parts
            let quizStatus = ''; // 'correct', 'incorrect', 'unanswered'

            switch (quiz.questionType) {
                case 'single-choice':
                case 'true-false':
                    totalSubQuestionsForQuiz = quiz.options.length;
                    quiz.options.forEach((optionData, optionIndex) => {
                        const correctAnswer = optionData.answer;
                        const userAnswer = userAnswersForThisQuiz ? userAnswersForThisQuiz[optionIndex] : undefined;
                        const isCorrectSub = (userAnswer !== undefined && String(userAnswer) === String(correctAnswer));
                        if (isCorrectSub) {
                            correctCountForQuiz++;
                        } else {
                            isQuizFullyCorrect = false;
                        }
                    });
                    break;
                case 'multi-choice':
                    totalSubQuestionsForQuiz = quiz.options.length;
                    quiz.options.forEach((optionData, optionIndex) => {
                        const correctAnswers = Array.isArray(optionData.answer) ? optionData.answer.sort() : [];
                        const userAnswers = userAnswersForThisQuiz ? (userAnswersForThisQuiz[optionIndex] || []).sort() : [];
                        const isCorrectSub = (correctAnswers.length === userAnswers.length &&
                                         correctAnswers.every((val, idx) => val === userAnswers[idx]));
                        if (isCorrectSub) {
                            correctCountForQuiz++;
                        } else {
                            isQuizFullyCorrect = false;
                        }
                    });
                    break;
                case 'fill-in-blank':
                    totalSubQuestionsForQuiz = quiz.options[0].blankCount;
                    const correctBlanks = quiz.options[0].answer;
                    const userBlanks = userAnswersForThisQuiz ? (userAnswersForThisQuiz[0] || []) : new Array(totalSubQuestionsForQuiz).fill('');

                    for (let i = 0; i < totalSubQuestionsForQuiz; i++) {
                        const correctAnswer = (correctBlanks[i] || '').toLowerCase().trim();
                        const userInput = (userBlanks[i] || '').toLowerCase().trim();
                        const isBlankCorrect = (userInput === correctAnswer);
                        if (isBlankCorrect) {
                            correctCountForQuiz++;
                        } else {
                            isQuizFullyCorrect = false;
                        }
                    }
                    break;
                case 'matching':
                    totalSubQuestionsForQuiz = quiz.options[0].pairs.length;
                    const correctMappings = quiz.options[0].answer;
                    const userMappings = userAnswersForThisQuiz ? (userAnswersForThisQuiz[0] || {}) : {};

                    for (const leftKey in correctMappings) {
                        const expectedRight = correctMappings[leftKey];
                        const userRight = userMappings[leftKey];
                        const isPairCorrect = (userRight !== undefined && userRight === expectedRight);
                        if (isPairCorrect) {
                            correctCountForQuiz++;
                        } else {
                            isQuizFullyCorrect = false;
                        }
                    }
                    break;
                default:
                    totalSubQuestionsForQuiz = 0; // Unsupported type
                    isQuizFullyCorrect = false;
                    break;
            }

            const accuracyPercentageForQuiz = totalSubQuestionsForQuiz === 0 ? 0 : ((correctCountForQuiz / totalSubQuestionsForQuiz) * 100).toFixed(2);

            // Determine the overall status for this single quiz within the set
            let hasAnyAnswer = false;
            if (userAnswersForThisQuiz) { // Check if there's an entry for this quizId
                for (const key in userAnswersForThisQuiz) {
                    if (Array.isArray(userAnswersForThisQuiz[key])) { // For multi-choice/fill-in-blank (array of answers/blanks)
                        if (userAnswersForThisQuiz[key].some(val => (typeof val === 'string' ? val.trim() !== '' : val !== undefined && val !== null))) {
                            hasAnyAnswer = true;
                            break;
                        }
                    } else if (typeof userAnswersForThisQuiz[key] === 'object' && userAnswersForThisQuiz[key] !== null) { // For matching (object of pairs)
                        if (Object.keys(userAnswersForThisQuiz[key]).length > 0) {
                            hasAnyAnswer = true;
                            break;
                        }
                    } else if (userAnswersForThisQuiz[key] !== undefined && userAnswersForThisQuiz[key] !== null && userAnswersForThisQuiz[key] !== '') { // For single-choice/true-false (single string)
                        hasAnyAnswer = true;
                        break;
                    }
                }
            }


            if (!hasAnyAnswer) { // If no answers provided for any part of this quiz
                quizStatus = 'unanswered';
                isQuizFullyCorrect = 'unanswered'; // Special status for unanswered
            } else if (isQuizFullyCorrect) {
                quizStatus = 'correct';
            } else {
                quizStatus = 'incorrect';
            }

            // Store individual quiz results in setQuizScoreData
            this.setQuizScoreData[quizId] = {
                correct: correctCountForQuiz,
                total: totalSubQuestionsForQuiz,
                percentage: accuracyPercentageForQuiz,
                isCorrect: isQuizFullyCorrect, // True if all sub-parts are correct, false otherwise, 'unanswered' if no attempt
                status: quizStatus, // 'correct', 'incorrect', 'unanswered'
                time: setOverallTime, // For consistency, store overall time in each entry
            };

            // Aggregate for overall set score
            totalSubQuestionsInSet += totalSubQuestionsForQuiz;
            totalCorrectQuestions += correctCountForQuiz;
        });

        // Update sidebar navigation for all quizzes in the set
        if (this.quizNav) {
            this.setQuizQuestions.forEach(quiz => {
                const navItem = this.quizNav.querySelector(`li[data-quiz-id="${quiz.id}"]`);
                if (navItem) {
                    this.applyCompletionStatusToNavItem(navItem, quiz.id);
                }
            });
        }

        // Calculate and update overall set quiz score
        this.overallSetQuizScore.correct = totalCorrectQuestions;
        this.overallSetQuizScore.total = totalSubQuestionsInSet;
        this.overallSetQuizScore.percentage = totalSubQuestionsInSet === 0 ? 0 : ((totalCorrectQuestions / totalSubQuestionsInSet) * 100).toFixed(2);

        // Display overall set quiz score in the dedicated sidebar element
        if (this.setQuizSummaryDisplay) this.setQuizSummaryDisplay.style.display = 'flex'; // Show the summary display
        if (this.overallScorePercentageDisplay) {
            this.overallScorePercentageDisplay.textContent = `正确率: ${this.overallSetQuizScore.percentage}% (${this.overallSetQuizScore.correct}/${this.overallSetQuizScore.total})`;
            this.overallScorePercentageDisplay.classList.remove('score-high', 'score-mid', 'score-low');
            if (this.overallSetQuizScore.percentage >= 90) {
                this.overallScorePercentageDisplay.classList.add('score-high');
            } else if (this.overallSetQuizScore.percentage >= 60) {
                this.overallScorePercentageDisplay.classList.add('score-mid');
            } else {
                this.overallScorePercentageDisplay.classList.add('score-low');
            }
        }
    }


    /**
     * Display the explanation content for a question (for single, multi, true-false, fill-in-blank).
     * @param {HTMLElement} questionBlockDiv - The DOM block for the current question.
     * @param {string|array} userAnswer - User's answer(s).
     * @param {string|array} correctAnswer - Correct answer(s).
     * @param {string} explanation - Explanation text.
     * @param {object} choices - Options object (for choice-based questions).
     * @param {boolean} isCorrect - Whether the answer is correct.
     * @param {string} questionType - Type of question.
     */
    displayExplanation(questionBlockDiv, userAnswer, correctAnswer, explanation, choices, isCorrect, questionType) {
        const explanationDiv = questionBlockDiv.querySelector('.question-explanation');
        if (!explanationDiv) return;
        let html = '<div class="explanation-item">';
        // User's Answer
        if (questionType === 'multi-choice') {
            const userAnsArr = Array.isArray(userAnswer) ? userAnswer : [];
            html += `<p>你的答案: <span class="your-answer">${userAnsArr.length ? userAnsArr.join(', ') : '未作答'}</span> `;
            html += isCorrect ? '<i class="fas fa-check-circle explanation-icon" style="color: #28a745;"></i> (全对)<br>' : '<i class="fas fa-times-circle explanation-icon" style="color: #dc3545;"></i> (有误)<br>';
            html += `<p>正确答案: <span class="correct-answer">${Array.isArray(correctAnswer) ? correctAnswer.join(', ') : ''}</span></p>`;
        } else if (questionType !== 'fill-in-blank' && questionType !== 'matching') { // Fill-in and Matching handled separately for explanation details
            html += `<p>你的答案: <span class="your-answer">${userAnswer !== undefined && userAnswer !== null && userAnswer !== '' ? userAnswer : '未作答'}</span> `;
            html += isCorrect ? '<i class="fas fa-check-circle explanation-icon" style="color: #28a745;"></i> (正确)<br>' : '<i class="fas fa-times-circle explanation-icon" style="color: #dc3545;"></i> (错误)<br>';
            html += `<p>正确答案: <span class="correct-answer">${correctAnswer !== undefined && correctAnswer !== null ? correctAnswer : ''}</span></p>`;
        }
        // Options content (optional)
        if (choices && typeof choices === 'object' && (questionType === 'single-choice' || questionType === 'multi-choice' || questionType === 'true-false')) {
            html += '<div class="explanation-choices"><b>选项：</b> ';
            html += Object.entries(choices).map(([k, v]) => `${k}. ${v}`).join(' &nbsp; ');
            html += '</div>';
        }
        // Explanation content
        if (explanation) {
            html += `<div class="explanation-text"><b>解析：</b> ${explanation}</div>`;
        }
        html += '</div>';
        explanationDiv.innerHTML = html;
        explanationDiv.style.display = 'block';
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

    /**
     * Escapes special characters in a string for use in a regular expression.
     * @param {string} string - The string to escape.
     * @returns {string} The escaped string.
     */
    escapeRegExp(string) {
        return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Captures the current user's answers for the displayed question.
     * This is called before navigating to a new question in 'set' mode.
     */
    captureCurrentAnswer() {
        if (this.quizMode !== 'set' || !this.quizStarted || this.quizSubmitted) return;

        const currentQuiz = this.setQuizQuestions[this.currentSetQuizQuestionIndex];
        if (!currentQuiz) return;

        const quizId = currentQuiz.id;
        this.setQuizUserAnswers[quizId] = this.setQuizUserAnswers[quizId] || {};

        switch (currentQuiz.questionType) {
            case 'single-choice':
            case 'true-false':
                currentQuiz.options.forEach((option, optionIndex) => {
                    const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                    if (questionBlockDiv) {
                        const selectedChoice = questionBlockDiv.querySelector('.choice-item.selected-choice');
                        if (selectedChoice) {
                            this.setQuizUserAnswers[quizId][optionIndex] = selectedChoice.dataset.choice;
                        } else {
                            // If no selection, ensure it's removed from answers for this sub-question index
                            if (this.setQuizUserAnswers[quizId][optionIndex] !== undefined) {
                                delete this.setQuizUserAnswers[quizId][optionIndex];
                            }
                        }
                    }
                });
                break;
            case 'multi-choice':
                currentQuiz.options.forEach((option, optionIndex) => {
                    const questionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${optionIndex}"]`);
                    if (questionBlockDiv) {
                        const selectedChoices = Array.from(questionBlockDiv.querySelectorAll('.choice-item.selected-choice'))
                                                    .map(item => item.dataset.choice);
                        if (selectedChoices.length > 0) {
                            this.setQuizUserAnswers[quizId][optionIndex] = selectedChoices;
                        } else {
                            // If no selection, ensure it's removed from answers for this sub-question index
                            if (this.setQuizUserAnswers[quizId][optionIndex] !== undefined) {
                                delete this.setQuizUserAnswers[quizId][optionIndex];
                            }
                        }
                    }
                });
                break;
            case 'fill-in-blank':
                const fillInBlankOptionIndex = 0;
                const fillInBlankInputs = Array.from(this.optionsContainer.querySelectorAll('.fill-in-blank-input'));
                const userBlanks = fillInBlankInputs.map(input => input.value);
                // Only save if at least one blank has content
                if (userBlanks.some(val => val.trim() !== '')) {
                    this.setQuizUserAnswers[quizId][fillInBlankOptionIndex] = userBlanks;
                } else {
                    // If all blanks are empty, remove entry for this sub-question
                    if (this.setQuizUserAnswers[quizId][fillInBlankOptionIndex] !== undefined) {
                        delete this.setQuizUserAnswers[quizId][fillInBlankOptionIndex];
                    }
                }
                break;
            case 'matching':
                const matchingOptionIndex = 0;
                const matchingQuestionBlockDiv = this.optionsContainer.querySelector(`.question-block[data-question-index="${matchingOptionIndex}"]`);
                if (matchingQuestionBlockDiv) {
                    const leftItems = matchingQuestionBlockDiv.querySelectorAll('.left-item.matching-connected');
                    const currentPairs = {};
                    leftItems.forEach(leftItem => {
                        // When retrieving from DOM, we rely on the `handleDrop` already correctly setting the answer.
                        // Here, we re-collect it for robustness.
                        const rightItem = matchingQuestionBlockDiv.querySelector(`.right-item.matching-connected[data-value="${this.setQuizUserAnswers[quizId][matchingOptionIndex][leftItem.dataset.value]}"]`);
                        if (rightItem) {
                             currentPairs[leftItem.dataset.value] = rightItem.dataset.value;
                        }
                    });

                    if (Object.keys(currentPairs).length > 0) {
                        this.setQuizUserAnswers[quizId][matchingOptionIndex] = currentPairs;
                    } else {
                        // If no pairs, remove entry for this sub-question
                        if (this.setQuizUserAnswers[quizId][matchingOptionIndex] !== undefined) {
                            delete this.setQuizUserAnswers[quizId][matchingOptionIndex];
                        }
                    }
                }
                break;
        }

        // After capturing answer, check if there are any answers for the entire quiz to set 'answered' class
        const navItem = this.quizNav.querySelector(`li[data-quiz-id="${quizId}"]`);
        if (navItem) {
            const hasAnyAnswerForQuiz = Object.keys(this.setQuizUserAnswers[quizId] || {}).length > 0;
            if (hasAnyAnswerForQuiz && !navItem.classList.contains('answered')) {
                navItem.classList.add('answered');
            } else if (!hasAnyAnswerForQuiz && navItem.classList.contains('answered')) {
                navItem.classList.remove('answered');
            }
        }
    }


    /**
     * Navigates to the previous question in 'set' quiz mode.
     */
    goToPreviousQuestion() {
        if (this.currentSetQuizQuestionIndex > 0) {
            this.captureCurrentAnswer(); // Save current question's answer
            this.currentSetQuizQuestionIndex--;
            this.loadQuiz(this.setQuizQuestions[this.currentSetQuizQuestionIndex].id);
            this.updateNavButtonsState();
        }
    }

    /**
     * Navigates to the next question in 'set' quiz mode.
     */
    goToNextQuestion() {
        if (this.currentSetQuizQuestionIndex < this.setQuizQuestions.length - 1) {
            this.captureCurrentAnswer(); // Save current question's answer
            this.currentSetQuizQuestionIndex++;
            this.loadQuiz(this.setQuizQuestions[this.currentSetQuizQuestionIndex].id);
            this.updateNavButtonsState();
        }
    }

    /**
     * Updates the disabled state of 'Previous' and 'Next' buttons.
     */
    updateNavButtonsState() {
        // If in review mode (quizSubmitted is true), buttons should always be enabled.
        if (this.quizMode === 'set' && this.quizSubmitted) {
            if (this.prevQuestionBtn) this.prevQuestionBtn.disabled = false;
            if (this.nextQuestionBtn) this.nextQuestionBtn.disabled = false;
            return;
        }

        // Normal answering mode
        if (this.quizMode !== 'set' || !this.quizStarted) return; // Only for active set quiz

        if (this.prevQuestionBtn) this.prevQuestionBtn.disabled = (this.currentSetQuizQuestionIndex === 0);
        if (this.nextQuestionBtn) this.nextQuestionBtn.disabled = (this.currentSetQuizQuestionIndex === this.setQuizQuestions.length - 1);
    }
}

/**
 * Loads quiz data files asynchronously and initializes the app.
 * 自动扫描 public/lib/ 目录下所有 .json 题库文件（通过后端API）
 */
async function loadQuizDataFiles() {
    let filePaths = [];
    try {
        // 通过后端API获取题库文件名
        const res = await fetch('/api/quiz-list');
        if (!res.ok) throw new Error('无法获取题库文件列表');
        const files = await res.json();
        // 统一路径格式
        filePaths = files.map(f => './lib/' + f);
    } catch (e) {
        // 兼容性降级：如无法自动获取，仍加载默认题库
        filePaths = [
            './lib/quiz_data_Example.json', // Changed order to put example first as it has more variety
            './lib/quiz_geo_one.json'
            // './lib/quiz_English_data.json', // Removed as it's likely a duplicate or placeholder
        ];
    }

    for (const path of filePaths) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                console.warn(`Warning: Could not load quiz data from ${path}.`);
                continue;
            }
            const quizDataObject = await response.json();
            if (quizDataObject && quizDataObject.questions) {
                quizDataSources.push(quizDataObject);
            } else {
                console.warn(`Warning: Quiz data from ${path} is missing 'questions' property. Skipping this data source.`);
            }
        } catch (error) {
            console.error(`Failed to load or parse quiz data from ${path}:`, error);
        }
    }
    app.init();
}

// Initialize the QuizApp and load data when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new QuizApp(); // Assign app instance to global 'app' variable
    loadQuizDataFiles(); // Start loading quiz data
});
