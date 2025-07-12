
        document.addEventListener('DOMContentLoaded', function() {
            // Global variables
            let currentSection = 'dashboard';
            let currentBookId = 0;
            let currentModuleType = '';
            
            // Subtopic data for each module type
            const moduleSubtopics = {
                1: ["Explanations", "Exercises", "Practice tests"],
                2: ["Explanations", "Videos", "Audios", "Exercises"],
                3: ["Explanations", "Phonetics", "Practice"],
                4: ["Explanations", "Reading materials"],
                5: ["Explanations", "Samples", "Practice material"]
            };
            
            // Book titles
            const bookTitles = {
                1: "Book 1: Beginner Level",
                2: "Book 2: Elementary Level",
                3: "Book 3: Pre-Intermediate",
                4: "Book 4: Intermediate",
                5: "Book 5: Upper Intermediate",
                6: "Book 6: Advanced I",
                7: "Book 7: Advanced II",
                8: "Book 8: Business English",
                9: "Book 9: Academic English",
                10: "Book 10: Mastery Level"
            };
            
            // Book descriptions
            const bookDescriptions = {
                1: "Build your English foundation with essential grammar and vocabulary.",
                2: "Expand your vocabulary and basic sentence structures.",
                3: "Develop more complex language skills for everyday communication.",
                4: "Master intermediate-level grammatical structures and expressions.",
                5: "Refine your language skills for more sophisticated communication.",
                6: "Develop advanced comprehension and expression abilities.",
                7: "Achieve fluency and precision in complex language tasks.",
                8: "Specialized language skills for professional environments.",
                9: "Academic writing, research skills, and scholarly vocabulary.",
                10: "Mastery of nuanced language for expert communication."
            };
            
            // Generate book modules for all books
            const bookModules = {};

            const bookIcons = {
                1: "fa-language",
                2: "fa-headphones",
                3: "fa-microphone",
                4: "fa-book-reader",
                5: "fa-pencil-alt",
            }
            
            for (let i = 1; i <= 10; i++) {
                bookModules[i] = [
                    { 
                        title: "Grammar", 
                        subtitle: getGrammarSubtitle(i),
                        type: "grammar", 
                        icon: "fa-language", 
                        description: getGrammarDescription(i), 
                        features: getGrammarFeatures(i)
                    },
                    { 
                        title: "Listening", 
                        subtitle: "Comprehension Skills",
                        type: "listening", 
                        icon: "fa-headphones", 
                        description: getListeningDescription(i), 
                        features: getListeningFeatures(i)
                    },
                    { 
                        title: "Speaking", 
                        subtitle: "Fluency Development",
                        type: "speaking", 
                        icon: "fa-microphone", 
                        description: getSpeakingDescription(i), 
                        features: getSpeakingFeatures(i)
                    },
                    { 
                        title: "Reading", 
                        subtitle: "Comprehension Skills",
                        type: "reading", 
                        icon: "fa-book-reader", 
                        description: getReadingDescription(i), 
                        features: getReadingFeatures(i)
                    },
                    { 
                        title: "Writing", 
                        subtitle: "Expression Skills",
                        type: "writing", 
                        icon: "fa-pencil-alt", 
                        description: getWritingDescription(i), 
                        features: getWritingFeatures(i)
                    }
                ];
            }
            
            // Helper functions to generate book-specific content
            function getGrammarSubtitle(bookId) {
                const subtitles = {
                    1: "Fundamentals and Practice",
                    2: "Sentence Structure",
                    3: "Verb Tenses",
                    4: "Complex Structures",
                    5: "Advanced Usage",
                    6: "Precision and Nuance",
                    7: "Mastery of Structures",
                    8: "Business Contexts",
                    9: "Academic Contexts",
                    10: "Expert Level Usage"
                };
                return subtitles[bookId] || "Grammar Development";
            }
            
            function getGrammarDescription(bookId) {
                return `Master essential English grammar rules with clear explanations for ${bookTitles[bookId]}.`;
            }
            
            function getGrammarFeatures(bookId) {
                const features = [
                    ["12 chapters", "25 video lessons"],
                    ["15 chapters", "30 exercises"],
                    ["18 lessons", "35 practice activities"],
                    ["20 lessons", "40 exercises"],
                    ["22 lessons", "45 practice activities"],
                    ["24 lessons", "50 exercises"],
                    ["26 lessons", "55 practice activities"],
                    ["20 business scenarios", "40 exercises"],
                    ["22 academic contexts", "45 exercises"],
                    ["25 advanced topics", "50 exercises"]
                ];
                return features[bookId - 1] || ["Comprehensive grammar exercises"];
            }
            
            function getListeningDescription(bookId) {
                return `Improve your listening comprehension with real dialogues for ${bookTitles[bookId]}.`;
            }
            
            function getListeningFeatures(bookId) {
                const features = [
                    ["40 audio files"],
                    ["45 dialogues"],
                    ["50 conversations"],
                    ["55 interviews"],
                    ["60 lectures"],
                    ["65 presentations"],
                    ["70 discussions"],
                    ["60 business dialogues"],
                    ["65 academic lectures"],
                    ["70 expert discussions"]
                ];
                return features[bookId - 1] || ["Listening comprehension exercises"];
            }
            
            function getSpeakingDescription(bookId) {
                return `Develop fluency and confidence in everyday and professional situations for ${bookTitles[bookId]}.`;
            }
            
            function getSpeakingFeatures(bookId) {
                const features = [
                    ["Interactive dialogues", "Pronunciation practice"],
                    ["Common expressions", "Basic conversations"],
                    ["Situational practice", "Fluency exercises"],
                    ["Debate practice", "Presentation skills"],
                    ["Advanced discussions", "Negotiation practice"],
                    ["Formal presentations", "Critical discussions"],
                    ["Persuasive speaking", "Expert panels"],
                    ["Business negotiations", "Professional presentations"],
                    ["Academic presentations", "Research discussions"],
                    ["Expert debates", "Mastery dialogues"]
                ];
                return features[bookId - 1] || ["Speaking practice activities"];
            }
            
            function getReadingDescription(bookId) {
                return `Improve your reading speed and comprehension with varied texts for ${bookTitles[bookId]}.`;
            }
            
            function getReadingFeatures(bookId) {
                const features = [
                    ["30 texts"],
                    ["35 passages"],
                    ["40 articles"],
                    ["45 stories"],
                    ["50 essays"],
                    ["55 complex texts"],
                    ["60 advanced articles"],
                    ["55 business documents"],
                    ["60 academic papers"],
                    ["65 expert-level texts"]
                ];
                return features[bookId - 1] || ["Reading comprehension materials"];
            }
            
            function getWritingDescription(bookId) {
                return `Learn to express your ideas clearly and with grammatical accuracy for ${bookTitles[bookId]}.`;
            }
            
            function getWritingFeatures(bookId) {
                const features = [
                    ["Writing guide"],
                    ["Sentence construction"],
                    ["Paragraph development"],
                    ["Essay structure"],
                    ["Advanced composition"],
                    ["Formal writing"],
                    ["Professional writing"],
                    ["Business correspondence"],
                    ["Academic writing"],
                    ["Expert composition"]
                ];
                return features[bookId - 1] || ["Writing practice materials"];
            }
            
            // Generate book cards for the library
            async function generateBookCards() {
                try {
                    const response = await fetch("/api/books");
                    const booksData = await response.json();
                    const libraryGrid = document.querySelector('.library-grid');
                    libraryGrid.innerHTML = '';
                    
                    booksData.forEach(book => {
                        const bookCard = document.createElement('div');
                        bookCard.className = 'book-card';
                        bookCard.innerHTML = `
                            <div class="book-header">
                                <div class="book-icon">
                                    <i class="fas fa-book"></i>
                                </div>
                                <h3 class="book-title">Book ${book.id_libro}: ${book.nombre_libro}</h3>
                            </div>
                            <div class="book-content">
                                <p class="book-description">${book.descripcion}</p>
                            </div>
                            <div class="book-footer">
                                <button class="btn-read view-modules" data-book="${book.id_libro}">
                                    <i class="fas fa-book-open"></i> View modules
                                </button>
                            </div>
                        `;
                        libraryGrid.appendChild(bookCard);
                    });
                
                    // Add event listeners to view modules buttons
                    document.querySelectorAll('.view-modules').forEach(button => {
                        button.addEventListener('click', function() {
                            const bookId = this.getAttribute('data-book');
                            showBookModules(bookId);
                        });
                    });
                } catch (error) {
                    console.log(error)
                }
                
                
            }
            
            // Navigation functionality
            const menuLinks = document.querySelectorAll('.menu-link[data-section]');
            const sectionLinks = document.querySelectorAll('[data-section]');
            const sections = {
                'dashboard': document.getElementById('dashboardSection'),
                'library': document.getElementById('librarySection'),
                'profile': document.getElementById('profileSection'),
                'announcements': document.getElementById('announcementsSection')
            };
            
            // Module view elements
            const modulesView = document.getElementById('modulesView');
            const backToLibrary = document.getElementById('backToLibrary');
            const bookModulesTitle = document.getElementById('bookModulesTitle');
            const modulesGrid = document.getElementById('modulesGrid');
            
            // Specific module view elements
            const bookModulesView = document.getElementById('bookModulesView');
            
            // Show current section
            function showSection(sectionId) {
                // Hide all sections
                Object.values(sections).forEach(section => {
                    if (section) section.style.display = 'none';
                });
                
                // Show selected section
                if (sections[sectionId]) {
                    sections[sectionId].style.display = 'block';
                }
                
                // Update active menu
                menuLinks.forEach(link => {
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                currentSection = sectionId;
                
                // Generate books when library is shown
                if (sectionId === 'library') {
                    generateBookCards();
                }
            }
            
            // Show book modules
            async function showBookModules(bookId) {
                //api book data
                const bookFetch = await fetch("/api/books");
                const booksData = await bookFetch.json();
                
                // Hide book view
                document.querySelector('.library-grid').style.display = 'none';
                
                // Hide specific module view if visible
                bookModulesView.classList.remove('active');
                
                // Show modules view
                modulesView.classList.add('active');
                
                // Set book title
                bookModulesTitle.textContent = booksData[bookId - 1].nombre_libro;
                
                // Save current book ID
                currentBookId = bookId;
                
                // Clear previous modules
                modulesGrid.innerHTML = '';
                
                // Get modules for this book
                const modulesFetch = await fetch(`/api/book/${bookId}/modules`);
                const modules = await modulesFetch.json() || [];
                
                // Generate module cards
                modules.forEach(module => {
                    const subtopics = moduleSubtopics[module.id_tipo_contenido] || [];
                    
                    const moduleCard = document.createElement('div');
                    moduleCard.className = 'module-card';
                    
                    let subtopicsHTML = '';
                    if (subtopics.length > 0) {
                        subtopicsHTML = `
                            <h4>Content Structure:</h4>
                            <ul class="subtopic-list">
                                ${subtopics.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        `;
                    }
                    
                    moduleCard.innerHTML = `
                        <h3>${module.titulo} <span class="module-type">${module.id_tipo_contenido}</span></h3>
                        <p>${module.descripcion}</p>
                        ${subtopicsHTML}
                        <button class="view-modules-btn" data-module-id="${module.id_contenido}" data-module-type="${module.id_tipo_contenido}">
                            <i class="fas ${bookIcons[module.id_tipo_contenido]}"></i> Open module
                        </button>
                    `;
                    modulesGrid.appendChild(moduleCard);
                });
                
                // Add event listeners to module buttons
                document.querySelectorAll('.view-modules-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const moduleType = this.getAttribute('data-module-type');
                        const moduleId = this.getAttribute('data-module-id');
                        showModuleContent(moduleId, moduleType);
                    });
                });
            }
            
            // Show specific module content
            async function showModuleContent(moduleId, moduleType) {
                // Hide modules view
                modulesView.classList.remove('active');
                
                // Show specific module view
                bookModulesView.classList.add('active');
                
                // Get module
                const moduleFetch = await fetch(`/api/module/${moduleId}`);
                const moduleData = await moduleFetch.json();

                if (!Array.isArray(moduleData) || moduleData.length === 0) {
                console.error("No module data found");
                return;
                }

                const module = moduleData[0];

                // Ahora sí, usa module.id_tipo_contenido
                const typeFetch = await fetch(`/api/module/${module.id_tipo_contenido}/type`);
                const type = await typeFetch.json() || [];
                
                // Generate module content
                bookModulesView.innerHTML = `
                    <div class="back-to-modules" id="backToModules">
                        <i class="fas fa-arrow-left"></i>
                        <span>Back to modules</span>
                    </div>
                    
                    <div class="module-header ${type.nombre_tipo}-header">
                        <h1>${module.titulo}</h1>
                        <p>${module.descripcion}</p>
                    </div>
                    
                    <div class="module-content">
                        <div class="module-section">
                            <h4><i class="fas fa-book-open"></i> Introduction</h4>
                            <p>${module.descripcion}</p>
                            <p>${module.contenido_texto}</p>
                        </div>
                        
                        <div class="module-section">
                            <h4><i class="fas fa-book"></i> Content Overview</h4>
                            <p>In this module you'll learn:</p>
                            <ul>
                                ${moduleSubtopics[moduleType].map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="module-section">
                            <h4><i class="fas fa-play-circle"></i> Video Lesson</h4>
                            <p>Watch this introductory lesson to get started:</p>
                            
                            <div class="module-video">
                                <i class="fas fa-play-circle"></i>
                            </div>
                            
                            <a href="#" class="download-btn">
                                <i class="fas fa-download"></i> Download Material
                            </a>
                        </div>
                        
                        <div class="exercises-section">
                            <h4><i class="fas fa-pencil-alt"></i> Quizzes</h4>
                            <p>Reinforce what you've learned with our interactive quizzes. Each quiz is designed to assess your understanding of the lessons and help you identify areas for improvement.</p>
                            <a href="#" class="quiz-btn">
                                <i class="fas fa-question-circle"></i> Go to Quizzes
                            </a>
                        </div>
                    </div>
                `;
                
                // Add event to back to modules
                const newBackToModules = bookModulesView.querySelector('#backToModules');
                newBackToModules.addEventListener('click', backToModulesView);
            }
            
            // Back to library view
            function backToLibraryView() {
                // Hide modules view
                modulesView.classList.remove('active');
                
                // Hide specific module view
                bookModulesView.classList.remove('active');
                
                // Show book view
                document.querySelector('.library-grid').style.display = 'grid';
            }
            
            // Back to modules view
            function backToModulesView() {
                // Hide specific module view
                bookModulesView.classList.remove('active');
                
                // Show modules view
                modulesView.classList.add('active');
            }
            
            // Navigation event listeners
            menuLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const sectionId = this.getAttribute('data-section');
                    showSection(sectionId);
                });
            });
            
            // Section button event listeners
            sectionLinks.forEach(link => {
                link.addEventListener('click', function() {
                    const sectionId = this.getAttribute('data-section');
                    if (sections[sectionId]) {
                        showSection(sectionId);
                    }
                });
            });
            
            // Back to library event listener
            backToLibrary.addEventListener('click', backToLibraryView);
            
            // Back to modules event listener
            document.addEventListener('click', function(e) {
                if (e.target.closest('#backToModules')) {
                    backToModulesView();
                }
            });
            
            // Dark mode functionality
            const darkModeLink = document.getElementById('darkModeLink');
            
            darkModeLink.addEventListener('click', function(e) {
                e.preventDefault();
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            });
            
            // Load saved preferences
            const savedDarkMode = localStorage.getItem('darkMode') === 'true';
            if (savedDarkMode) {
                document.body.classList.add('dark-mode');
            }
            
            // Open settings from avatar
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');
            
            userAvatar.addEventListener('click', function() {
                showSection('profile');
            });
            
            userName.addEventListener('click', function() {
                showSection('profile');
            });
            
            // Mobile sidebar functionality
            const sidebarToggle = document.querySelector('.sidebar-toggle');
            const sidebar = document.querySelector('.mazer-sidebar');
            
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
            });
            
            // Dropdown menu functionality
            const resourcesToggle = document.getElementById('resourcesToggle');
            const resourcesMenu = document.getElementById('resourcesMenu');
            
            resourcesToggle.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('collapsed');
                resourcesMenu.classList.toggle('show');
            });
            
            // Initialize with dashboard
            showSection('dashboard');
        });