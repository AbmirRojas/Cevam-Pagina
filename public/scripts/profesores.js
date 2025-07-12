// Script for the main dashboard functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Variables globales
            const dashboardSection = document.getElementById('dashboardSection');
            const librarySection = document.getElementById('librarySection');
            const bookDetailSection = document.getElementById('bookDetailSection');
            const contentSection = document.getElementById('contentSection');
            const progressSection = document.getElementById('progressSection');
            const headerTitle = document.getElementById('headerTitle');
            
            // Referencias a los elementos del detalle del libro
            const bookDetailTitle = document.querySelector('.book-detail-title');
            const bookDetailLevel = document.querySelector('.book-detail-level');
            const bookDetailDescription = document.querySelector('.book-detail-description');
            
            // Variable para almacenar el libro actual
            let currentBookId = null;
            
            // Variable para almacenar el módulo actual (para edición)
            let currentModule = null;
            
            // Secciones
            const sections = {
                'dashboard': dashboardSection,
                'library': librarySection,
                'content': contentSection,
                'progress': progressSection
            };
            
            // Book data
            const books = {
                1: {
                    title: "Beginner Level",
                    level: "Nivel: Principiante",
                    description: "Build your English foundation with essential grammar and vocabulary."
                },
                2: {
                    title: "Elementary Level",
                    level: "Nivel: Elemental",
                    description: "Expand your vocabulary and basic sentence structures."
                },
                3: {
                    title: "Pre-Intermediate",
                    level: "Nivel: Pre-Intermedio",
                    description: "Develop more complex language skills for everyday communication."
                },
                4: {
                    title: "Intermediate",
                    level: "Nivel: Intermedio",
                    description: "Master intermediate-level grammatical structures and expressions."
                },
                5: {
                    title: "Upper Intermediate",
                    level: "Nivel: Intermedio Alto",
                    description: "Refine your language skills for more sophisticated communication."
                },
                6: {
                    title: "Advanced Level",
                    level: "Nivel: Avanzado",
                    description: "Achieve fluency and precision in complex language usage."
                },
                7: {
                    title: "Business English",
                    level: "Nivel: Intermedio-Avanzado",
                    description: "Master professional communication for the corporate world."
                },
                8: {
                    title: "Academic English",
                    level: "Nivel: Avanzado",
                    description: "Excel in academic writing and research communication."
                },
                9: {
                    title: "Conversational English",
                    level: "Nivel: Intermedio",
                    description: "Develop natural speaking skills for everyday interactions."
                },
                10: {
                    title: "Exam Preparation",
                    level: "Nivel: Avanzado",
                    description: "Prepare for TOEFL, IELTS, and other English proficiency exams."
                }
            };
            
            // Module data (para edición)
            const modulesData = {
                'grammar': {
                    title: "Grammar",
                    description: "Master essential English grammar rules with clear explanations and practical examples."
                },
                'listening': {
                    title: "Listening",
                    description: "Improve your listening comprehension with real dialogues and audio exercises."
                },
                'speaking': {
                    title: "Speaking",
                    description: "Develop fluency and confidence in everyday and professional situations."
                },
                'reading': {
                    title: "Reading",
                    description: "Improve your reading speed and comprehension with varied texts and exercises."
                },
                'writing': {
                    title: "Writing",
                    description: "Learn to express your ideas clearly and with grammatical accuracy."
                },
                'vocabulary': {
                    title: "Vocabulary",
                    description: "Expand your word bank with essential vocabulary for everyday communication."
                }
            };
            
            // Función para mostrar secciones
            function showSection(sectionId) {
                // Ocultar todas las secciones
                Object.values(sections).forEach(section => {
                    if (section) section.style.display = 'none';
                });
                
                // Ocultar también la sección de detalle de libro
                bookDetailSection.style.display = 'none';
                
                // Mostrar la sección seleccionada
                if (sections[sectionId]) {
                    sections[sectionId].style.display = 'block';
                    headerTitle.textContent = sectionId === 'dashboard' ? 'DASHBOARD PROFESORES' : 
                                              sectionId === 'library' ? 'BIBLIOTECA CEVAM' : 
                                              sectionId === 'progress' ? 'PROGRESO ESTUDIANTES' : 
                                              sectionId === 'content' ? 'CREAR MÓDULOS' : 'CEVAM';
                }
                
                // Actualizar menú activo
                const menuLinks = document.querySelectorAll('.menu-link[data-section]');
                menuLinks.forEach(link => {
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
            
            // Navegación del menú lateral
            document.querySelectorAll('.menu-link[data-section]').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const sectionId = this.getAttribute('data-section');
                    showSection(sectionId);
                });
            });
            
            // Botones de acciones rápidas
            document.querySelectorAll('.action-button[data-section]').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const sectionId = this.getAttribute('data-section');
                    showSection(sectionId);
                });
            });
            
            // Botones "Ver módulos"
            document.querySelectorAll('.view-modules-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const bookId = this.getAttribute('data-book');
                    showBookDetail(bookId);
                });
            });
            
            // Función para mostrar detalles del libro
            function showBookDetail(bookId) {
                const book = books[bookId];
                if (book) {
                    bookDetailTitle.textContent = `Book ${bookId}: ${book.title}`;
                    bookDetailLevel.textContent = book.level;
                    bookDetailDescription.textContent = book.description;
                    
                    // Guardar el ID del libro actual
                    currentBookId = bookId;
                    
                    // Ocultar todas las secciones
                    Object.values(sections).forEach(section => {
                        if (section) section.style.display = 'none';
                    });
                    
                    // Mostrar la sección de detalle
                    bookDetailSection.style.display = 'block';
                    headerTitle.textContent = `LIBRO ${bookId}: ${book.title.toUpperCase()}`;
                }
            }
            
            // Botones de regreso a la biblioteca
            document.querySelectorAll('#backToLibrary, #backToLibrary2').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    showSection('library');
                });
            });
            
            // Botones de editar módulo
            document.querySelectorAll('.edit-module-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const moduleName = this.getAttribute('data-module');
                    editModule(moduleName);
                });
            });
            
            // Botones de borrar módulo
            document.querySelectorAll('.delete-module-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const moduleName = this.getAttribute('data-module');
                    if (confirm(`¿Estás seguro de que deseas eliminar el módulo ${moduleName}?`)) {
                        alert(`Módulo ${moduleName} eliminado exitosamente`);
                        // Aquí iría la lógica real para eliminar el módulo
                    }
                });
            });
            
            // Función para editar un módulo
            function editModule(moduleName) {
                const module = modulesData[moduleName];
                if (module) {
                    // Guardar el módulo actual
                    currentModule = moduleName;
                    
                    // Navegar a la sección de creación de contenidos
                    showSection('content');
                    
                    // Llenar el formulario con los datos del módulo
                    document.getElementById('moduleTitle').value = module.title;
                    document.getElementById('moduleBook').value = currentBookId || '1';
                    document.getElementById('moduleDescription').value = module.description;
                    document.getElementById('contentBody').value = `Contenido detallado del módulo ${module.title}. Personalice este contenido según sea necesario.`;
                    
                    // Mostrar mensaje
                    const alertContainer = document.getElementById('alertContainer');
                    alertContainer.innerHTML = `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle"></i> 
                            Estás editando el módulo: ${module.title}
                        </div>
                    `;
                }
            }
            
            // Botón de crear nuevo módulo
            document.getElementById('createModuleBtn').addEventListener('click', function(e) {
                e.preventDefault();
                
                // Navegar a la sección de crear contenidos
                showSection('content');
                
                // Pre-seleccionar el libro actual en el formulario
                if (currentBookId) {
                    document.getElementById('moduleBook').value = currentBookId;
                    
                    // Mostrar mensaje de contexto
                    const alertContainer = document.getElementById('alertContainer');
                    alertContainer.innerHTML = `
                        <div class="alert alert-success">
                            <i class="fas fa-info-circle"></i> 
                            Estás creando contenido para el libro: ${books[currentBookId].title}
                        </div>
                    `;
                }
            });
            
            // Funcionalidad de sidebar móvil
            const sidebarToggle = document.querySelector('.sidebar-toggle');
            const sidebar = document.querySelector('.mazer-sidebar');
            
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
            });
            
            // Mostrar el dashboard por defecto
            showSection('dashboard');
        });

        // Script for the module creation form functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Tabs functionality
            const tabs = document.querySelectorAll('.tab');
            const tabContents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs and contents
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to current tab
                    this.classList.add('active');
                    
                    // Show corresponding content
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(`${tabId}Tab`).classList.add('active');
                });
            });
            
            // Evaluation options selection
            const evaluationOptions = document.querySelectorAll('.evaluation-option');
            evaluationOptions.forEach(option => {
                option.addEventListener('click', function() {
                    evaluationOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show questions section only for quizzes
                    const type = this.getAttribute('data-type');
                    if (type === 'quiz') {
                        document.getElementById('quizQuestionsSection').style.display = 'block';
                    } else {
                        document.getElementById('quizQuestionsSection').style.display = 'none';
                    }
                });
            });
            
            // Add option to question
            document.querySelector('.add-option')?.addEventListener('click', function() {
                const optionsContainer = this.previousElementSibling;
                const newOption = document.createElement('div');
                newOption.className = 'option-item';
                newOption.innerHTML = `
                    <input type="radio" class="option-checkbox" name="option1">
                    <input type="text" class="form-control option-input" placeholder="Nueva opción">
                `;
                optionsContainer.appendChild(newOption);
            });
            
            // Add question
            document.getElementById('addQuestionBtn')?.addEventListener('click', function() {
                const questionsContainer = document.querySelector('#quizQuestionsSection .form-group');
                const questionCount = questionsContainer.children.length + 1;
                
                const questionHtml = `
                    <div class="question-container">
                        <div class="question-header">
                            <h5 class="question-title">Pregunta 2</h5>
                            <div class="question-actions">
                                <button class="question-action">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="question-action delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Texto de la pregunta">
                        </div>
                        <div class="form-group">
                            <label>Opciones</label>
                            <div class="option-item">
                                <input type="radio" class="option-checkbox" name="option2">
                                <input type="text" class="form-control option-input" placeholder="Opción 1">
                            </div>
                            <div class="option-item">
                                <input type="radio" class="option-checkbox" name="option2">
                                <input type="text" class="form-control option-input" placeholder="Opción 2">
                            </div>
                            <div class="option-item">
                                <input type="radio" class="option-checkbox" name="option2">
                                <input type="text" class="form-control option-input" placeholder="Opción 3">
                            </div>
                            <button class="add-option">
                                <i class="fas fa-plus"></i> Agregar opción
                            </button>
                        </div>
                    </div>
                `;
                
                questionsContainer.insertAdjacentHTML('beforeend', questionHtml);
            });
            
            // Modal functionality
            const modal = document.getElementById('evaluationModal');
            const openModalBtn = document.getElementById('addEvaluationBtn');
            const closeModalBtn = document.querySelector('.modal-close');
            const cancelModalBtn = document.getElementById('cancelEvaluationBtn');
            
            if (openModalBtn) {
                openModalBtn.addEventListener('click', function() {
                    modal.style.display = 'flex';
                });
            }
            
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            }
            
            if (cancelModalBtn) {
                cancelModalBtn.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            }
            
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // Save evaluation
            document.getElementById('saveEvaluationBtn')?.addEventListener('click', function() {
                const title = document.getElementById('evaluationTitle').value;
                const typeElement = document.querySelector('.evaluation-option.active');
                const type = typeElement ? typeElement.getAttribute('data-type') : '';
                const description = document.getElementById('evaluationDescription').value;
                
                if (!title || !type) {
                    alert('Por favor, complete todos los campos obligatorios');
                    return;
                }
                
                // Add to evaluations container
                const evaluationsContainer = document.getElementById('evaluationsContainer');
                const newEvaluation = document.createElement('div');
                newEvaluation.className = 'evaluation-card';
                
                let typeText = '';
                switch(type) {
                    case 'quiz': typeText = 'Quiz'; break;
                    case 'exam': typeText = 'Examen'; break;
                    case 'exercise': typeText = 'Ejercicio'; break;
                }
                
                newEvaluation.innerHTML = `
                    <div class="evaluation-card-header">
                        <div>
                            <h4 class="evaluation-title">${title}</h4>
                            <span class="evaluation-type">${typeText}</span>
                        </div>
                        <div class="evaluation-actions">
                            <button class="evaluation-action">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="evaluation-action delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="evaluation-details">
                        <p>${description || 'Sin descripción'}</p>
                    </div>
                `;
                
                evaluationsContainer.appendChild(newEvaluation);
                
                // Close modal
                modal.style.display = 'none';
                
                // Reset modal form
                document.getElementById('evaluationTitle').value = '';
                document.getElementById('evaluationDescription').value = '';
                evaluationOptions.forEach(opt => opt.classList.remove('active'));
                document.getElementById('quizQuestionsSection').style.display = 'none';
            });
            
            // Save module
            document.getElementById('saveModuleBtn')?.addEventListener('click', function() {
                const title = document.getElementById('moduleTitle').value;
                const book = document.getElementById('moduleBook').value;
                const description = document.getElementById('moduleDescription').value;
                const content = document.getElementById('contentBody').value;
                
                if (!title || !book || !description || !content) {
                    alert('Por favor, complete todos los campos obligatorios');
                    return;
                }
                
                // Show success message
                const alertContainer = document.getElementById('alertContainer');
                alertContainer.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i> 
                        Módulo creado exitosamente: ${title}
                    </div>
                `;
                
                // Scroll to top
                window.scrollTo(0, 0);
            });
            
            // Reset form
            document.getElementById('resetFormBtn')?.addEventListener('click', function() {
                document.getElementById('moduleTitle').value = '';
                document.getElementById('moduleBook').value = '';
                document.getElementById('moduleDescription').value = '';
                document.getElementById('contentBody').value = '';
                document.getElementById('evaluationsContainer').innerHTML = '';
                document.getElementById('alertContainer').innerHTML = '';
            });
            
            // Simulate file upload
            document.querySelector('.upload-btn')?.addEventListener('click', function() {
                const fileList = document.querySelector('.file-list');
                const newFile = document.createElement('div');
                newFile.className = 'file-item';
                newFile.innerHTML = `
                    <div class="file-icon">
                        <i class="fas fa-file"></i>
                    </div>
                    <div class="file-info">
                        <div class="file-name">Nuevo_recurso.docx</div>
                        <div class="file-size">2.4 MB</div>
                    </div>
                    <div class="file-actions">
                        <button class="file-action">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="file-action delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                fileList.appendChild(newFile);
            });
        });