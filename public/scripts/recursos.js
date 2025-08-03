
        document.addEventListener('DOMContentLoaded', function() {
            // Global variables
            let currentSection = 'dashboard';
            let currentBookId = 0;
            let currentModuleType = '';

            // Variables para Poder ver los Usuarios 
            let currentPage = 1;
            const usersPerPage = 5;
            let allUsers = []; // Aquí se guardarán todos los usuarios
            let currentSearchTerm = "";

            //variables de anuncios
            let currentAnnouncementPage = 1;
            const announcementsPerPage = 5;
            let allAnnouncements = [];
            let currentAnnouncementSearchTerm = "";



            // Subtopic data for each module type
            const moduleSubtopics = {
                1: ["Explanations", "Exercises", "Practice tests"],
                2: ["Explanations", "Videos", "Audios", "Exercises"],
                3: ["Explanations", "Phonetics", "Practice"],
                4: ["Explanations", "Reading materials"],
                5: ["Explanations", "Samples", "Practice material"]
            };
            
            const bookIcons = {
                1: "fa-language",
                2: "fa-headphones",
                3: "fa-microphone",
                4: "fa-book-reader",
                5: "fa-pencil-alt",
            }
            
            // Crear Nuevos Inputs

            let contador = 1;
            const maxInputs = 10;

            document.getElementById("agregarBtn").addEventListener("click", () => {
            if (contador <= maxInputs) {
                const contenedor = document.getElementById("contenedor");

                const wrapper = document.createElement("div");
                wrapper.className = "input-container";
                wrapper.id = `input${contador}`;

                // Campo: Enlace
                const inputEnlace = document.createElement("input");
                inputEnlace.type = "text";
                inputEnlace.name = `file${contador}`;
                inputEnlace.placeholder = `Enlace de Recurso Externo ${contador}`;
                inputEnlace.classList.add("form-control", "mt-3");

                // Campo: Nombre del archivo
                const inputNombre = document.createElement("input");
                inputNombre.type = "text";
                inputNombre.name = `nombre${contador}`;
                inputNombre.placeholder = `Nombre del archivo ${contador}`;
                inputNombre.classList.add("form-control", "mt-2");

                // Campo: Tamaño del archivo (en MB)
                const inputPeso = document.createElement("input");
                inputPeso.type = "number";
                inputPeso.name = `tamano${contador}`;
                inputPeso.placeholder = `Tamaño del archivo (MB) ${contador}`;
                inputPeso.classList.add("form-control", "mt-2");
                inputPeso.min = "0";

                // Botón para eliminar el conjunto de inputs
                const eliminarBtn = document.createElement("button");
                eliminarBtn.type = "button";
                eliminarBtn.innerText = "Eliminar";
                eliminarBtn.classList.add("btn", "btn-danger", "mt-2");
                eliminarBtn.onclick = () => {
                contenedor.removeChild(wrapper);
                contador--;
                };

                wrapper.appendChild(inputEnlace);
                wrapper.appendChild(inputNombre);
                wrapper.appendChild(inputPeso);
                wrapper.appendChild(eliminarBtn);
                contenedor.appendChild(wrapper);

                contador++;
            } else {
                alert("Has alcanzado el límite de 10 enlaces.");
            }
            });


            
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
                                <h3 class="book-title">Level ${book.id_libro}: ${book.nombre_libro}</h3>
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
                'announcements': document.getElementById('announcementsSection'),
                'content': document.getElementById('contentSection'),
                'users': document.getElementById('usersSection'),
                'books': document.getElementById('booksSection'),
                'modules': document.getElementById('modulesSection'),
                'notifications': document.getElementById('notificationsSection'),
                'bookCreation': document.getElementById('bookCreationSection'),
                'manageAnnouncements': document.getElementById('manageAnnouncementsSection'),
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

                if (sectionId === 'announcements') {
                    loadAnnouncements();
                }

                if (sectionId === 'books') {
                    loadBooks();
                }

                if (sectionId === 'modules') {
                    loadModules();
                }

                if (sectionId === 'users') {
                    loadUsers();
                }

                if (sectionId === 'manageAnnouncements') {
                    loadManageAnnouncements();
                }


                if (sectionId === 'notifications') {
                    loadNotifications(); //  llamada a la función que renderiza los anuncios
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
            async function showModuleContent(moduleId) {
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

                const typeFetch = await fetch(`/api/module/${module.id_tipo_contenido}/type`);
                const type = await typeFetch.json() || [];

                const linksFetch = await fetch(`/modulo/${moduleId}/links`);
                const linksData = await linksFetch.json(); // array con los archivos
                
                // Generate module content
                bookModulesView.innerHTML = `
                    <div class="back-to-modules" id="backToModules">
                        <i class="fas fa-arrow-left"></i>
                        <span>Back to modules</span>
                    </div>
                    
                    <div class="module-header ${type.nombre_tipo}-header">
                        <h1>${module.titulo}</h1>
                        <p class="preserve-lines" >${module.descripcion}</p>
                    </div>
                    
                    <div class="module-content">
                        <div class="module-section">
                            <h4><i class="fas fa-book-open"></i> Introduction</h4>
                            <p class="preserve-lines" >${module.descripcion}</p>
                        </div>
                        
                        <div class="module-section">
                            <h4><i class="fas fa-book"></i> Content Overview</h4>
                            <p class="preserve-lines" >${module.contenido_texto}</p>
                        </div>
                        
                        <div class="module-section">
                            <h4><i class="fas fa-play-circle"></i> Video Lesson</h4>
                            <p>Watch this introductory lesson to get started:</p>
                            
                            <div class="d-flex justify-content-center mb-5">
                                ${module.url_recurso}
                            </div>
                            
                            <a href="#" class="download-btn">
                                <i class="fas fa-download"></i> External Resources
                            </a>
                        </div>
                        
                        <div class="exercises-section">
                            <h4><i class="fas fa-pencil-alt"></i> Exercises</h4>
                            <p>Reinforce what you've learned with our interactive quizzes. Each quiz is designed to assess your understanding of the lessons and help you identify areas for improvement.</p>
                            <a href="#" class="quiz-btn" data-module-id="${module.id_contenido}">
                                <i class="fas fa-question-circle"></i> Go to Exercises
                            </a>
                        </div>
                    </div>
                `;

                let linkHTML = '';
                linksData.forEach(link => {
                let iconClass = 'fa-file-alt'; // icono por defecto

                linkHTML += `
                    <a href="${link.link_archivo}" class="download-item" target="_blank">
                    <i class="fas ${iconClass}"></i>
                    <div class="file-info">
                        <span class="file-name">${link.nombre_archivo || 'Archivo sin nombre'}</span>
                        <span class="file-size">${link.tamano_archivo || 'Peso desonocido' } MB</span>
                    </div>
                    <i class="fas fa-arrow-right download-arrow"></i>
                    </a>
                `;
                });

                const modalHTML = `
                    <div id="downloadModal" class="modal-overlay hidden">
                        <div class="modal-content">
                        <h2 class="modal-header" >External Resources</h2>
                        <span class="close-modal" id="closeModal">&times;</span>
                        ${linkHTML}
                        </div>
                    </div>
                `;

                bookModulesView.insertAdjacentHTML('beforeend', modalHTML);

                bookModulesView.querySelector('.quiz-btn').addEventListener('click', async (e) => {
                    e.preventDefault();
                    const moduleId = e.target.closest('.quiz-btn').dataset.moduleId;
                    showExercises(moduleId);
                });


                const downloadBtn = bookModulesView.querySelector('.download-btn');
                const modal = document.getElementById('downloadModal');
                const closeModalBtn = document.getElementById('closeModal');

                downloadBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.classList.remove('hidden');
                });

                closeModalBtn.addEventListener('click', () => {
                    modal.classList.add('hidden');
                });

                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.add('hidden');
                    }
                });
                
                // Add event to back to modules
                const newBackToModules = bookModulesView.querySelector('#backToModules');
                newBackToModules.addEventListener('click', backToModulesView);
            }

            async function showExercises(moduleId) {
                try {
                    const response = await fetch(`/api/module/${moduleId}/exercises`);
                    const exercises = await response.json();

                    const exerciseHTML = exercises.map((ex, i) => `
                    <div class="exercise-question">
                        <p><strong>Pregunta ${i + 1}:</strong> ${ex.pregunta}</p>
                        <ul class="exercise-options">
                        <li>A) ${ex.opcion_a}</li>
                        <li>B) ${ex.opcion_b}</li>
                        <li>C) ${ex.opcion_c}</li>
                        <li>D) ${ex.opcion_d}</li>
                        </ul>
                        <hr>
                    </div>
                    `).join("");

                    bookModulesView.innerHTML = `
                    <div class="back-to-modules" id="backToModules">
                        <i class="fas fa-arrow-left"></i>
                        <span>Back to Module</span>
                    </div>
                    <h2>Exercises</h2>
                    ${exerciseHTML || "<p>No hay ejercicios disponibles para este módulo.</p>"}
                    `;

                    document.getElementById("backToModules").addEventListener("click", () => loadModules());

                } catch (err) {
                    console.error("Error cargando ejercicios:", err);
                }
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
            
            /* TEACHER MODULE CREATION FUNCTIONALITY */
            
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
            
            // Reset form
            document.getElementById('resetFormBtn')?.addEventListener('click', function(e) {
                e.preventDefault();
                
                try {
                    const form = document.getElementById('moduleCreationForm');
                    if (form) {
                        form.reset(); // Limpia todos los campos del formulario automáticamente
                        
                        // Solo limpiar elementos que no se resetean con form.reset()
                        const alertContainer = document.getElementById('alertContainer');
                        if (alertContainer) alertContainer.innerHTML = '';
                        
                        console.log('Formulario reseteado exitosamente');
                    }
                } catch (error) {
                    console.error('Error al resetear el formulario:', error);
                }
            });

            // Notifications
            async function loadNotifications() {
                try {
                    const response = await fetch("/api/announcements");
                    const allAnnouncements = await response.json();

                    const container = document.getElementById("notificationsContainer");
                    container.innerHTML = "";

                    if (allAnnouncements.length === 0) {
                        container.innerHTML = "<p>No hay anuncios disponibles.</p>";
                        return;
                    }

                    // Mostrar solo los últimos 5 anuncios (más recientes)
                    const sortedAnnouncements = allAnnouncements.sort((a, b) => {
                        return new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion);
                    });

                    const latestFive = sortedAnnouncements.slice(0, 5);

                    latestFive.forEach(anuncio => {
                        const card = document.createElement("div");
                        card.className = "announcement-card";

                        card.innerHTML = `
                            <div class="activity-item">
                                <div class="activity-icon system">
                                    <i class="fas fa-bell"></i>
                                </div>

                                <div class="activity-content">
                                    <div class="activity-title">${anuncio.titulo}</div>
                                    <div class="activity-details">
                                        <span>${new Date(anuncio.fecha_creacion).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        container.appendChild(card);
                    });
                } catch (error) {
                    console.error("Error cargando los anuncios:", error);
                }
            }

            // Announcements
            async function loadAnnouncements() {
                try {
                    const response = await fetch("/api/announcements");
                    const announcements = await response.json();

                    const container = document.getElementById("announcementsContainer");
                    container.innerHTML = ""; // limpiar contenido anterior

                    if (announcements.length === 0) {
                        container.innerHTML = "<p>No hay anuncios disponibles.</p>";
                        return;
                    }

                    announcements.forEach(anuncio => {
                        const card = document.createElement("div");

                        card.innerHTML = `
                        <div class="announcement-card">
                            <h3 class="announcement-title">${anuncio.titulo}</h3>

                            <span class="announcement-date">${new Date(anuncio.fecha_creacion).toLocaleDateString()}</span>
                            <div class="announcement-content">
                                <p class="preserve-lines">${anuncio.mensaje}</p>
                            </div>
                        </div>
                        `;
                        container.appendChild(card);
                    });
                } catch (error) {
                    console.error("Error cargando los anuncios:", error);
                }
            }

            // Users Section
            function userRoleHTML(userRole) {
                let role = ""; 

                if (userRole === 1) {
                    role = `<span class="user-role role-admin">Administrator</span>`;
                } else if (userRole === 2) {
                    role = `<span class="user-role role-teacher">Teacher</span>`
                } else if (userRole === 3) {
                    role = `<span class="user-role role-student">Student</span>`
                }

                return role;
            }

            // Botones únicos para la paginación de usuarios
            const usersPrevBtn = document.getElementById('usersPrevBtn');
            const usersNextBtn = document.getElementById('usersNextBtn');
            const usersPaginationInfo = document.getElementById('usersPaginationInfo');

            // Eventos de paginación
            usersPrevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderUsers();
                }
            });

            usersNextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(allUsers.length / usersPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    renderUsers();
                }
            });

            document.getElementById('searchUserInput').addEventListener('input', (e) => {
                currentSearchTerm = e.target.value;
                currentPage = 1; // Reiniciar a la primera página
                renderUsers();
            });


            async function loadUsers() {
                try {
                    const response = await fetch("/api/users");
                    allUsers = await response.json(); 
                    renderUsers();
                } catch (error) {
                    console.error("Error cargando los usuarios:", error);
                }
            }

            function renderUsers() {
                let filteredUsers = allUsers;

                // Filtrar por nombre o apellido si hay término de búsqueda
                if (currentSearchTerm.trim() !== "") {
                    const term = currentSearchTerm.toLowerCase();
                    filteredUsers = allUsers.filter(user => {
                        const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
                        return fullName.includes(term);
                    });
                }

                const total = filteredUsers.length;
                const start = (currentPage - 1) * usersPerPage;
                const end = start + usersPerPage;
                const currentUsers = filteredUsers.slice(start, end);

                const container = document.getElementById("usersContainer");
                container.innerHTML = "";

                if (currentUsers.length === 0) {
                    container.innerHTML = "<tr><td colspan='5'>No users found.</td></tr>";
                } else {
                    currentUsers.forEach(user => {
                        const row = document.createElement("tr");
                        const roleHTML = userRoleHTML(user.id_rol);
                        row.innerHTML = `
                            <td>${user.id_usuario}</td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                <span>${user.correo}</span>
                                </div>
                            </td>
                            <td>${user.nombre} ${user.apellido}</td>
                            <td>${roleHTML}</td>
                            <td>
                                <button class="action-btn btn-view" data-id="${user.id_usuario}"><i class="fas fa-eye"></i></button>
                                <button class="action-btn btn-edit" data-id="${user.id_usuario}"><i class="fas fa-edit"></i></button>
                                <form method="POST" action="/deleteUser/${user.id_usuario}" class="delete-form" style="display:inline;">
                                <button type="submit" class="action-btn btn-delete" data-id="${user.id_usuario}">
                                    <i class="fas fa-trash"></i>
                                </button>
                                </form>
                            </td>
                        `;

                        container.appendChild(row);
                    });
                }

                if (usersPaginationInfo) {
                    usersPaginationInfo.textContent = `Mostrando ${Math.min(start + 1, total)}-${Math.min(end, total)} de ${total}`;
                }

                document.querySelectorAll('.btn-view').forEach(button => {
                    button.addEventListener('click', function () {
                        const userId = this.getAttribute('data-id');
                        const user = allUsers.find(u => u.id_usuario == userId);
                        if (user) openUserModal(user, false);
                    });
                });

                document.querySelectorAll('.btn-edit').forEach(button => {
                    button.addEventListener('click', function () {
                        const userId = this.getAttribute('data-id');
                        const user = allUsers.find(u => u.id_usuario == userId);
                        if (user) openUserModal(user, true);
                    });
                });

                document.querySelectorAll('.delete-form').forEach(form => {
                    form.addEventListener('submit', (e) => {
                        const confirmed = confirm("¿Estás seguro de que deseas eliminar este usuario?");
                        if (!confirmed) {
                        e.preventDefault();
                        }
                    });
                });

            }

            function openUserModal(user, editable = false) {
                const oldModal = document.getElementById('customUserModal');
                if (oldModal) oldModal.remove();

                const modalHTML = `
                    <div id="customUserModal" class="modal-overlay">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2>${editable ? 'Editar Usuario' : 'Ver Usuario'}</h2>
                                <span class="close-modal" id="closeUserModal">&times;</span>
                            </div>
                            <div class="modal-body">
                                <form id="customUserForm" method="POST" action="/updateUser/${user.id_usuario}">
                                    <label>Nombre:</label>
                                    <input type="text" name="nombre" value="${user.nombre}" ${editable ? '' : 'readonly'}>

                                    <label>Apellido:</label>
                                    <input type="text" name="apellido" value="${user.apellido}" ${editable ? '' : 'readonly'}>

                                    <label>Correo:</label>
                                    <input type="email" name="correo" value="${user.correo}" ${editable ? '' : 'readonly'}>

                                    <label>Rol:</label>
                                    <select name="id_rol" ${editable ? '' : 'disabled'}>
                                        <option value="1" ${user.id_rol === 1 ? 'selected' : ''}>Administrador</option>
                                        <option value="2" ${user.id_rol === 2 ? 'selected' : ''}>Profesor</option>
                                        <option value="3" ${user.id_rol === 3 ? 'selected' : ''}>Estudiante</option>
                                    </select>

                                    ${editable ? `<button type="submit" class="btn btn-save">Guardar Cambios</button>` : ''}
                                    <button type="button" class="btn btn-cancel" id="cerrarModalBtn">Cerrar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                `;

                document.body.insertAdjacentHTML('beforeend', modalHTML);

                // Cerrar modal
                document.getElementById('closeUserModal').addEventListener('click', () => {
                    document.getElementById('customUserModal').remove();
                });
                document.getElementById('cerrarModalBtn').addEventListener('click', () => {
                    document.getElementById('customUserModal').remove();
                });
            }

            // Books Section
            async function loadBooks() {
                try {
                    const response = await fetch("/api/books");
                    const books = await response.json();

                    const container = document.getElementById("booksContainer");
                    container.innerHTML = ""; // limpiar contenido anterior

                    if (books.length === 0) {
                        container.innerHTML = "<p>No hay libros disponibles.</p>";
                        return;
                    }

                    books.forEach(book => {
                        const card = document.createElement("div");

                        card.innerHTML = `
                        <div class="content-card" style="margin-bottom: 15px;">
                            <div class="content-header">
                                <h4 class="content-title">Book ${book.id_libro}: ${book.nombre_libro}</h4>
                            </div>
                            <p>${book.descripcion}</p>
                            <div class="content-actions">
                                <button class="btn btn-primary btn-sm btn-edit-book" data-id="${book.id_libro}">Editar</button>
                                <form method="POST" action="/deleteBook/${book.id_libro}" class="delete-book-form" style="display:inline;">
                                    <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                                </form>
                            </div>
                        </div>
                        `;
                        container.appendChild(card);
                    });

                    // EDITAR
                    document.querySelectorAll('.btn-edit-book').forEach(button => {
                        button.addEventListener('click', () => {
                            const bookId = button.getAttribute('data-id');
                            const book = books.find(b => b.id_libro == bookId);
                            if (book) openBookModal(book);
                        });
                    });

                    // ELIMINAR (con confirmación)
                    document.querySelectorAll('.delete-book-form').forEach(form => {
                        form.addEventListener('submit', (e) => {
                            const confirmed = confirm("¿Estás seguro de que deseas eliminar este libro?");
                            if (!confirmed) {
                                e.preventDefault();
                            }
                        });
                    });


                } catch (error) {
                    console.error("Error cargando los anuncios:", error);
                }
            }

            function openBookModal(book) {
                const oldModal = document.getElementById('bookModal');
                if (oldModal) oldModal.remove();

                const modalHTML = `
                    <div id="bookModal" class="modal-overlay">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2>Editar Libro</h2>
                                <span class="close-modal" id="closeBookModal">&times;</span>
                            </div>
                            <div class="modal-body">
                                <form method="POST" action="/updateBook/${book.id_libro}">
                                    <label>Nombre del libro:</label>
                                    <input type="text" name="nombre_libro" value="${book.nombre_libro}" required>
                                    
                                    <label>Descripción:</label>
                                    <textarea name="descripcion" class="form-control" required>${book.descripcion}</textarea>

                                    <button type="submit" class="btn btn-save">Guardar Cambios</button>
                                    <button type="button" class="btn btn-cancel" id="cancelBookModal">Cancelar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                `;

                document.body.insertAdjacentHTML('beforeend', modalHTML);

                document.getElementById('closeBookModal').addEventListener('click', () => {
                    document.getElementById('bookModal').remove();
                });
                document.getElementById('cancelBookModal').addEventListener('click', () => {
                    document.getElementById('bookModal').remove();
                });
            }

            //Modules Section
            async function loadModules() {
                try {
                    const response = await fetch("/api/modules");
                    const modules = await response.json();

                    const container = document.getElementById("modulesContainer");
                    container.innerHTML = ""; // limpiar contenido anterior

                    if (modules.length === 0) {
                        container.innerHTML = "<p>No hay modulos disponibles.</p>";
                        return;
                    }

                    window.allModules = modules; // global
                    renderModules(modules);      // mostrar los módulos filtrables

                } catch (error) {
                    console.error("Error cargando los modulos:", error);
                }
            }

            function renderModules(modulesToRender) {
                const container = document.getElementById("modulesContainer");
                container.innerHTML = "";

                if (modulesToRender.length === 0) {
                    container.innerHTML = "<p>No hay módulos disponibles.</p>";
                    return;
                }

                modulesToRender.forEach(module => {
                    const card = document.createElement("div");

                    card.innerHTML = `
                    <div class="content-card">
                        <div class="content-header">
                            <h4 class="content-title">${module.titulo}</h4>
                        </div>
                        <p>${module.descripcion}</p>
                        <div class="content-actions">
                            <button class="btn btn-primary btn-sm btn-edit-module" data-id="${module.id_contenido}">Editar</button>
                            <form method="POST" action="/deleteModule/${module.id_contenido}" class="delete-module-form" style="display:inline;">
                                <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                            </form>
                        </div>
                    </div>
                    `;
                    container.appendChild(card);
                });

                // Botones editar
                document.querySelectorAll('.btn-edit-module').forEach(button => {
                    button.addEventListener('click', () => {
                        const moduleId = button.getAttribute('data-id');
                        const module = modulesToRender.find(m => m.id_contenido == moduleId);
                        if (module) openModuleModal(module);
                    });
                });

                // Botones eliminar con confirmación
                document.querySelectorAll('.delete-module-form').forEach(form => {
                    form.addEventListener('submit', (e) => {
                        if (!confirm("¿Estás seguro de que deseas eliminar este módulo?")) {
                            e.preventDefault();
                        }
                    });
                });
            }

            document.getElementById("moduleSearch").addEventListener("input", (e) => {
                const search = e.target.value.toLowerCase();
                const filtered = window.allModules.filter(module =>
                    module.titulo.toLowerCase().includes(search)
                );
                renderModules(filtered);
            });



            function openModuleModal(module) {
                const oldModal = document.getElementById('bookModal');
                if (oldModal) oldModal.remove();

                const modalHTML = `
                    <div id="moduleModal" class="modal-overlay">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2>Edit Module</h2>
                                <span class="close-modal" id="closeModuleModal">&times;</span>
                            </div>
                            <div class="modal-body">
                                <form method="POST" action="/updateModule/${module.id_contenido}">
                                    <label>Title</label>
                                    <input type="text" name="title" value="${module.titulo}" required>
                                    
                                    <label>Description</label>
                                    <textarea name="descripcion" class="form-control" required>${module.descripcion}</textarea>

                                    <label>Content</label>
                                    <textarea name="content" class="form-control" required>${module.contenido_texto}</textarea>

                                    <button type="submit" class="btn btn-save">Guardar Cambios</button>
                                    <button type="button" class="btn btn-cancel" id="cancelModuleModal">Cancelar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                `;

                document.body.insertAdjacentHTML('beforeend', modalHTML);

                document.getElementById('closeModuleModal').addEventListener('click', () => {
                    document.getElementById('moduleModal').remove();
                });
                document.getElementById('cancelModuleModal').addEventListener('click', () => {
                    document.getElementById('moduleModal').remove();
                });
            }

            //exercicies
            async function showExercises(moduleId) {
            try {
                const response = await fetch(`/api/module/${moduleId}/exercises`);
                const exercises = await response.json();

                // Estado para almacenar las respuestas del usuario
                let userAnswers = {};
                let showingResults = false;

                const exerciseHTML = exercises.map((ex, i) => `
                    <div class="card mb-4 exercise-question" data-question="${i}">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h6 class="mb-0 text-primary fw-bold">
                                <i class="fas fa-question-circle me-2"></i>
                                Pregunta ${i + 1}
                            </h6>
                            <span class="badge question-result" id="result-${i}"></span>
                        </div>
                        <div class="card-body">
                            <p class="card-text fs-6 mb-3">${ex.pregunta}</p>
                            <div class="exercise-options">
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="question-${i}" value="a" id="q${i}a" data-question="${i}">
                                    <label class="form-check-label option-label w-100 p-2 rounded" for="q${i}a" data-option="a">
                                        <strong>A)</strong> ${ex.opcion_a}
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="question-${i}" value="b" id="q${i}b" data-question="${i}">
                                    <label class="form-check-label option-label w-100 p-2 rounded" for="q${i}b" data-option="b">
                                        <strong>B)</strong> ${ex.opcion_b}
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="question-${i}" value="c" id="q${i}c" data-question="${i}">
                                    <label class="form-check-label option-label w-100 p-2 rounded" for="q${i}c" data-option="c">
                                        <strong>C)</strong> ${ex.opcion_c}
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="question-${i}" value="d" id="q${i}d" data-question="${i}">
                                    <label class="form-check-label option-label w-100 p-2 rounded" for="q${i}d" data-option="d">
                                        <strong>D)</strong> ${ex.opcion_d}
                                    </label>
                                </div>
                            </div>
                            ${ex.explicacion ? `
                                <div class="alert alert-info mt-3 explanation d-none" id="explanation-${i}">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <strong>Explicación:</strong> ${ex.explicacion}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join("");

                bookModulesView.innerHTML = `
                    <div class="d-flex align-items-center mb-4" role="button" id="backToModules">
                        <i class="fas fa-arrow-left text-primary me-2"></i>
                        <span class="text-primary fw-semibold">Volver al Módulo</span>
                    </div>
                    
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="card border-0 bg-light">
                                <div class="card-body">
                                    <h2 class="card-title mb-3">
                                        <i class="fas fa-dumbbell text-primary me-2"></i>
                                        Ejercicios del Módulo
                                    </h2>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="text-muted" id="progress-text">0 de ${exercises.length} respondidas</span>
                                        <span class="badge bg-primary" id="progress-badge">0%</span>
                                    </div>
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar bg-success" role="progressbar" 
                                            style="width: 0%" id="progress-fill" 
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="exercises-container">
                        ${exerciseHTML || `
                            <div class="alert alert-info text-center">
                                <i class="fas fa-info-circle me-2"></i>
                                No hay ejercicios disponibles para este módulo.
                            </div>
                        `}
                    </div>

                    ${exercises.length > 0 ? `
                        <div class="text-center mb-4">
                            <button id="checkAnswers" class="btn btn-primary btn-lg me-2" disabled>
                                <i class="fas fa-check me-2"></i>
                                Verificar Respuestas
                            </button>
                            <button id="resetExercises" class="btn btn-outline-secondary btn-lg d-none">
                                <i class="fas fa-redo me-2"></i>
                                Reiniciar Ejercicios
                            </button>
                        </div>

                        <div class="card border-success d-none" id="resultsSummary">
                            <div class="card-header bg-success text-white text-center">
                                <h5 class="mb-0">
                                    <i class="fas fa-chart-pie me-2"></i>
                                    Resultados del Ejercicio
                                </h5>
                            </div>
                            <div class="card-body text-center">
                                <div class="row align-items-center">
                                    <div class="col-md-4">
                                        <div class="score-circle mx-auto mb-3 mb-md-0" id="scoreCircle">
                                            <div class="score-text" id="scoreText">0%</div>
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <h4 class="text-success mb-2" id="scoreMessage">¡Completa todos los ejercicios!</h4>
                                        <p class="text-muted mb-0" id="scoreStats"></p>
                                        <div class="mt-3">
                                            <div class="row text-center">
                                                <div class="col-4">
                                                    <div class="border-end">
                                                        <div class="fs-4 fw-bold text-success" id="correctCount">0</div>
                                                        <small class="text-muted">Correctas</small>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="border-end">
                                                        <div class="fs-4 fw-bold text-danger" id="incorrectCount">0</div>
                                                        <small class="text-muted">Incorrectas</small>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="fs-4 fw-bold text-primary" id="totalCount">${exercises.length}</div>
                                                    <small class="text-muted">Total</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                `;

                // Agregar estilos CSS específicos (solo lo que Bootstrap no cubre)
                if (!document.getElementById('exercises-bootstrap-styles')) {
                    const styles = document.createElement('style');
                    styles.id = 'exercises-bootstrap-styles';
                    styles.textContent = `
                        .exercise-question {
                            transition: all 0.3s ease;
                            border: 2px solid transparent !important;
                        }
                        
                        .exercise-question.answered {
                            border-color: #0d6efd !important;
                            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.1);
                        }
                        
                        .exercise-question.correct {
                            border-color: #198754 !important;
                            background-color: #f8fff9;
                        }
                        
                        .exercise-question.incorrect {
                            border-color: #dc3545 !important;
                            background-color: #fff8f8;
                        }
                        
                        .option-label {
                            cursor: pointer;
                            transition: all 0.2s ease;
                            border: 1px solid #dee2e6;
                            margin-top: 0.25rem;
                            position: relative;
                        }
                        
                        .option-label:hover {
                            background-color: #e9ecef;
                            border-color: #0d6efd;
                        }
                        
                        .option-label.selected {
                            background-color: #cff4fc;
                            border-color: #0d6efd;
                        }
                        
                        .option-label.correct {
                            background-color: #d1e7dd !important;
                            border-color: #198754 !important;
                            color: #0f5132;
                        }
                        
                        .option-label.incorrect {
                            background-color: #f8d7da !important;
                            border-color: #dc3545 !important;
                            color: #721c24;
                        }
                        
                        .option-label.correct::after {
                            content: "✓";
                            position: absolute;
                            right: 1rem;
                            top: 50%;
                            transform: translateY(-50%);
                            color: #198754;
                            font-weight: bold;
                            font-size: 1.2rem;
                        }
                        
                        .option-label.incorrect::after {
                            content: "✗";
                            position: absolute;
                            right: 1rem;
                            top: 50%;
                            transform: translateY(-50%);
                            color: #dc3545;
                            font-weight: bold;
                            font-size: 1.2rem;
                        }
                        
                        .question-result.correct {
                            background-color: #198754 !important;
                        }
                        
                        .question-result.incorrect {
                            background-color: #dc3545 !important;
                        }
                        
                        .score-circle {
                            width: 120px;
                            height: 120px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: conic-gradient(from 0deg, #198754 0%, #198754 var(--score-percent, 0%), #e9ecef var(--score-percent, 0%));
                            position: relative;
                        }
                        
                        .score-circle::before {
                            content: '';
                            position: absolute;
                            width: 90px;
                            height: 90px;
                            background: white;
                            border-radius: 50%;
                        }
                        
                        .score-text {
                            position: relative;
                            z-index: 1;
                            font-size: 1.5rem;
                            font-weight: bold;
                            color: #198754;
                        }
                        
                        #backToModules:hover {
                            transform: translateX(-5px);
                            transition: transform 0.2s ease;
                        }
                        
                        @media (max-width: 768px) {
                            .option-label {
                                font-size: 0.9rem;
                                padding: 0.75rem !important;
                            }
                            
                            .score-circle {
                                width: 100px;
                                height: 100px;
                            }
                            
                            .score-circle::before {
                                width: 75px;
                                height: 75px;
                            }
                            
                            .score-text {
                                font-size: 1.2rem;
                            }
                        }
                    `;
                    document.head.appendChild(styles);
                }

                // Event listeners
                document.getElementById("backToModules").addEventListener("click", () => loadModules());

                if (exercises.length > 0) {
                    // Manejar selección de respuestas
                    document.querySelectorAll('input[type="radio"]').forEach(radio => {
                        radio.addEventListener('change', function() {
                            const questionIndex = this.getAttribute('data-question');
                            userAnswers[questionIndex] = this.value;
                            
                            // Actualizar estilos visuales
                            const questionDiv = this.closest('.exercise-question');
                            questionDiv.classList.add('answered');
                            
                            // Remover clase selected de todas las opciones de esta pregunta
                            questionDiv.querySelectorAll('.option-label').forEach(label => {
                                label.classList.remove('selected');
                            });
                            
                            // Agregar clase selected a la opción seleccionada
                            this.closest('.form-check').querySelector('.option-label').classList.add('selected');
                            
                            updateProgress();
                        });
                    });

                    // Verificar respuestas
                    document.getElementById('checkAnswers').addEventListener('click', checkAnswers);
                    
                    // Reiniciar ejercicios
                    document.getElementById('resetExercises').addEventListener('click', resetExercises);
                }

                function updateProgress() {
                    const totalQuestions = exercises.length;
                    const answeredQuestions = Object.keys(userAnswers).length;
                    const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
                    
                    document.getElementById('progress-text').textContent = 
                        `${answeredQuestions} de ${totalQuestions} respondidas`;
                    document.getElementById('progress-badge').textContent = `${percentage}%`;
                    document.getElementById('progress-fill').style.width = `${percentage}%`;
                    document.getElementById('progress-fill').setAttribute('aria-valuenow', percentage);
                    
                    // Habilitar botón si todas están respondidas
                    const checkButton = document.getElementById('checkAnswers');
                    checkButton.disabled = answeredQuestions < totalQuestions;
                }

                function checkAnswers() {
                    if (showingResults) return;
                    
                    let correctAnswers = 0;
                    showingResults = true;

                    exercises.forEach((exercise, index) => {
                        const userAnswer = userAnswers[index];
                        let correctAnswer = exercise.respuesta_correcta;
                        
                        // Normalizar la respuesta correcta - puede venir como 'A', 'a', 'opcion_a', etc.
                        if (correctAnswer) {
                            correctAnswer = correctAnswer.toString().toLowerCase();
                            // Si viene como 'opcion_a', 'opcion_b', etc., extraer solo la letra
                            if (correctAnswer.includes('opcion_')) {
                                correctAnswer = correctAnswer.replace('opcion_', '');
                            }
                            // Si viene como 'A', 'B', etc., convertir a minúscula
                            if (correctAnswer.length === 1 && /[abcd]/i.test(correctAnswer)) {
                                correctAnswer = correctAnswer.toLowerCase();
                            }
                        }
                        
                        console.log(`Pregunta ${index + 1}:`, {
                            userAnswer,
                            correctAnswer,
                            originalCorrectAnswer: exercise.respuesta_correcta
                        });
                        
                        const isCorrect = userAnswer === correctAnswer;
                        
                        if (isCorrect) correctAnswers++;

                        const questionDiv = document.querySelector(`[data-question="${index}"]`);
                        const resultSpan = document.getElementById(`result-${index}`);
                        
                        // Actualizar resultado visual
                        questionDiv.classList.add(isCorrect ? 'correct' : 'incorrect');
                        resultSpan.textContent = isCorrect ? 'Correcto' : 'Incorrecto';
                        resultSpan.classList.add('badge', isCorrect ? 'correct' : 'incorrect');
                        
                        // Mostrar respuestas correctas e incorrectas
                        questionDiv.querySelectorAll('.option-label').forEach(label => {
                            const optionValue = label.getAttribute('data-option');
                            if (optionValue === correctAnswer) {
                                label.classList.add('correct');
                            } else if (optionValue === userAnswer && !isCorrect) {
                                label.classList.add('incorrect');
                            }
                        });
                        
                        // Mostrar explicación si existe
                        const explanation = document.getElementById(`explanation-${index}`);
                        if (explanation) {
                            explanation.classList.remove('d-none');
                        }
                    });

                    // Mostrar resumen de resultados
                    showResults(correctAnswers, exercises.length);
                    
                    // Cambiar botones
                    document.getElementById('checkAnswers').classList.add('d-none');
                    document.getElementById('resetExercises').classList.remove('d-none');
                    
                    // Deshabilitar todos los radio buttons
                    document.querySelectorAll('input[type="radio"]').forEach(radio => {
                        radio.disabled = true;
                    });
                }

                function showResults(correct, total) {
                    const percentage = Math.round((correct / total) * 100);
                    const incorrect = total - correct;
                    const resultsSummary = document.getElementById('resultsSummary');
                    const scoreCircle = document.getElementById('scoreCircle');
                    
                    // Actualizar porcentaje en el círculo
                    scoreCircle.style.setProperty('--score-percent', `${percentage}%`);
                    
                    // Cambiar color del círculo según el resultado
                    const color = getScoreColor(percentage);
                    scoreCircle.style.background = `conic-gradient(from 0deg, ${color} ${percentage}%, #e9ecef ${percentage}%)`;
                    
                    document.getElementById('scoreText').textContent = `${percentage}%`;
                    document.getElementById('scoreMessage').textContent = getScoreMessage(percentage);
                    document.getElementById('scoreStats').textContent = 
                        `Has obtenido un ${percentage}% de acierto`;
                    document.getElementById('correctCount').textContent = correct;
                    document.getElementById('incorrectCount').textContent = incorrect;
                    
                    // Cambiar color de la card según el resultado
                    resultsSummary.classList.remove('border-success', 'border-warning', 'border-danger');
                    const cardHeader = resultsSummary.querySelector('.card-header');
                    cardHeader.classList.remove('bg-success', 'bg-warning', 'bg-danger');
                    
                    if (percentage >= 70) {
                        resultsSummary.classList.add('border-success');
                        cardHeader.classList.add('bg-success');
                    } else if (percentage >= 50) {
                        resultsSummary.classList.add('border-warning');
                        cardHeader.classList.add('bg-warning');
                    } else {
                        resultsSummary.classList.add('border-danger');
                        cardHeader.classList.add('bg-danger');
                    }
                    
                    resultsSummary.classList.remove('d-none');
                    
                    // Smooth scroll al resumen
                    setTimeout(() => {
                        resultsSummary.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 300);
                }

                function getScoreColor(percentage) {
                    if (percentage >= 70) return '#198754';
                    if (percentage >= 50) return '#ffc107';
                    return '#dc3545';
                }

                function getScoreMessage(percentage) {
                    if (percentage >= 90) return '¡Excelente trabajo!';
                    if (percentage >= 80) return '¡Muy bien!';
                    if (percentage >= 70) return '¡Buen trabajo!';
                    if (percentage >= 50) return 'No está mal, puedes mejorar';
                    return 'Necesitas repasar el tema';
                }

                function resetExercises() {
                    userAnswers = {};
                    showingResults = false;
                    
                    // Limpiar todas las clases y estilos
                    document.querySelectorAll('.exercise-question').forEach(questionDiv => {
                        questionDiv.classList.remove('answered', 'correct', 'incorrect');
                        
                        questionDiv.querySelectorAll('.option-label').forEach(label => {
                            label.classList.remove('selected', 'correct', 'incorrect');
                        });
                        
                        questionDiv.querySelectorAll('input[type="radio"]').forEach(radio => {
                            radio.checked = false;
                            radio.disabled = false;
                        });
                        
                        const resultSpan = questionDiv.querySelector('.question-result');
                        resultSpan.textContent = '';
                        resultSpan.classList.remove('badge', 'correct', 'incorrect');
                        
                        const explanation = questionDiv.querySelector('.explanation');
                        if (explanation) {
                            explanation.classList.add('d-none');
                        }
                    });
                    
                    // Resetear progreso
                    updateProgress();
                    
                    // Cambiar botones
                    document.getElementById('checkAnswers').classList.remove('d-none');
                    document.getElementById('resetExercises').classList.add('d-none');
                    document.getElementById('resultsSummary').classList.add('d-none');
                    
                    // Scroll al inicio de los ejercicios
                    document.querySelector('.exercises-container').scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }

            } catch (err) {
                console.error("Error cargando ejercicios:", err);
                bookModulesView.innerHTML = `
                    <div class="d-flex align-items-center mb-4" role="button" id="backToModules">
                        <i class="fas fa-arrow-left text-primary me-2"></i>
                        <span class="text-primary fw-semibold">Volver al Módulo</span>
                    </div>
                    <div class="alert alert-danger text-center">
                        <h4 class="alert-heading">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Error al cargar ejercicios
                        </h4>
                        <p class="mb-3">No se pudieron cargar los ejercicios. Por favor, intenta de nuevo.</p>
                        <button onclick="location.reload()" class="btn btn-primary">
                            <i class="fas fa-refresh me-2"></i>
                            Reintentar
                        </button>
                    </div>
                `;
                
                document.getElementById("backToModules").addEventListener("click", () => loadModules());
            }
        }

        /*Formulario de Ejercicios*/

       function updateQuestionNumbers() {
        const container = document.getElementById("questionsContainer");
        const questionBlocks = container.querySelectorAll('.question-block');
        
        questionBlocks.forEach((block, index) => {
            const questionNumber = index + 1;
            
            // Actualizar el título de la pregunta
            const title = block.querySelector('h5');
            if (title) {
                title.textContent = `Pregunta ${questionNumber}`;
            }
            
            // Actualizar los nombres de los inputs para mantener la secuencia
            const inputs = block.querySelectorAll('input, select');
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                if (name) {
                    // Reemplazar el número en el nombre del input
                    const baseName = name.replace(/\d+$/, ''); // Eliminar números al final
                    input.setAttribute('name', `${baseName}${questionNumber}`);
                }
            });
        });
    }

    function getNextQuestionNumber() {
            const container = document.getElementById("questionsContainer");
            const questionBlocks = container.querySelectorAll('.question-block');
            return questionBlocks.length + 1;
        }

        document.getElementById("addQuestionBtn").addEventListener("click", () => {
            const container = document.getElementById("questionsContainer");
            const questionNumber = getNextQuestionNumber();
            
            const questionHTML = `
                <div class="question-block" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; position: relative;">
                    <button type="button" class="btn btn-danger btn-sm remove-question-btn" style="position: absolute; top: 10px; right: 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                    
                    <h5>Pregunta ${questionNumber}</h5>
                    
                    <label>Pregunta</label>
                    <input name="pregunta${questionNumber}" type="text" class="form-control" required>
                    
                    <label>Opción A</label>
                    <input name="opcion_a${questionNumber}" type="text" class="form-control" required>
                    
                    <label>Opción B</label>
                    <input name="opcion_b${questionNumber}" type="text" class="form-control" required>
                    
                    <label>Opción C</label>
                    <input name="opcion_c${questionNumber}" type="text" class="form-control" required>
                    
                    <label>Opción D</label>
                    <input name="opcion_d${questionNumber}" type="text" class="form-control" required>
                    
                    <label>Respuesta Correcta</label>
                    <select name="respuesta_correcta${questionNumber}" class="form-control" required>
                        <option value="">Seleccionar</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>
            `;
            
            // Insertamos el HTML
            container.insertAdjacentHTML('beforeend', questionHTML);
            
            // Obtenemos la referencia al nuevo elemento
            const newBlock = container.lastElementChild;
            
            // Añadimos el event listener al botón de eliminar
            const removeBtn = newBlock.querySelector('.remove-question-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    newBlock.remove();
                    // Importante: Renumerar todas las preguntas después de eliminar
                    updateQuestionNumbers();
                });
            }
            
            // Aplicar animación suave al nuevo elemento
            newBlock.style.opacity = '0';
            newBlock.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                newBlock.style.transition = 'all 0.3s ease';
                newBlock.style.opacity = '1';
                newBlock.style.transform = 'translateY(0)';
            }, 10);
        });

        function clearAllQuestions() {
            const container = document.getElementById("questionsContainer");
            container.innerHTML = '';
        }

        document.getElementById('resetFormBtn')?.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                const form = document.getElementById('moduleCreationForm');
                if (form) {
                    form.reset(); // Limpia todos los campos del formulario automáticamente
                    
                    // Limpiar elementos que no se resetean con form.reset()
                    const alertContainer = document.getElementById('alertContainer');
                    if (alertContainer) alertContainer.innerHTML = '';
                    
                    // Limpiar todas las preguntas
                    clearAllQuestions();
                    
                    // Limpiar archivos dinámicos
                    const contenedor = document.getElementById("contenedor");
                    if (contenedor) contenedor.innerHTML = '';
                    contador = 1; // Resetear el contador de archivos también
                    
                    console.log('Formulario reseteado exitosamente');
                }
            } catch (error) {
                console.error('Error al resetear el formulario:', error);
            }
        });

        /*|| Announcements Management Section ||*/

        async function loadManageAnnouncements() {
            try {
                const response = await fetch("/api/announcements");
                allAnnouncements = await response.json();
                renderManageAnnouncements();
            } catch (error) {
                console.error("Error cargando los anuncios para gestión:", error);
            }
        }

        // Función para renderizar los anuncios en la tabla
        function renderManageAnnouncements() {
            let filteredAnnouncements = allAnnouncements;

            // Filtrar por título si hay término de búsqueda
            if (currentAnnouncementSearchTerm.trim() !== "") {
                const term = currentAnnouncementSearchTerm.toLowerCase();
                filteredAnnouncements = allAnnouncements.filter(announcement =>
                    announcement.titulo.toLowerCase().includes(term)
                );
            }

            const total = filteredAnnouncements.length;
            const start = (currentAnnouncementPage - 1) * announcementsPerPage;
            const end = start + announcementsPerPage;
            const currentAnnouncements = filteredAnnouncements.slice(start, end);

            const container = document.getElementById("announcementsManageContainer");
            container.innerHTML = "";

            if (currentAnnouncements.length === 0) {
                container.innerHTML = "<tr><td colspan='5'>No se encontraron anuncios.</td></tr>";
            } else {
                currentAnnouncements.forEach(announcement => {
                    const row = document.createElement("tr");
                    const date = new Date(announcement.fecha_creacion).toLocaleDateString();
                    
                    row.innerHTML = `
                        <td>${announcement.id_mensaje}</td>
                        <td>
                            <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${announcement.titulo}
                            </div>
                        </td>
                        <td>${announcement.autor_nombre || 'Usuario'}</td>
                        <td>${date}</td>
                        <td>
                            <button class="action-btn btn-view" data-id="${announcement.id_mensaje}" title="Ver anuncio">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-edit" data-id="${announcement.id_mensaje}" title="Editar anuncio">
                                <i class="fas fa-edit"></i>
                            </button>
                            <form method="POST" action="/deleteAnnouncement/${announcement.id_mensaje}" class="delete-announcement-form" style="display:inline;">
                                <button type="submit" class="action-btn btn-delete" title="Eliminar anuncio">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </form>
                        </td>
                    `;
                    container.appendChild(row);
                });
            }

            // Actualizar información de paginación
            const paginationInfo = document.getElementById('announcementsPaginationInfo');
            if (paginationInfo) {
                paginationInfo.textContent = `${Math.min(start + 1, total)}-${Math.min(end, total)} de ${total}`;
            }

            // Event listeners para los botones
            attachAnnouncementEventListeners();
        }

        // Función para adjuntar event listeners a los botones
        function attachAnnouncementEventListeners() {
            // Botón ver
            document.querySelectorAll('.btn-view').forEach(button => {
                button.addEventListener('click', function () {
                    const announcementId = this.getAttribute('data-id');
                    const announcement = allAnnouncements.find(a => a.id_mensaje == announcementId);
                    if (announcement) openAnnouncementModal(announcement, false);
                });
            });

            // Botón editar
            document.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', function () {
                    const announcementId = this.getAttribute('data-id');
                    const announcement = allAnnouncements.find(a => a.id_mensaje == announcementId);
                    if (announcement) openAnnouncementModal(announcement, true);
                });
            });

            // Formularios de eliminación
            document.querySelectorAll('.delete-announcement-form').forEach(form => {
                form.addEventListener('submit', (e) => {
                    const confirmed = confirm("¿Estás seguro de que deseas eliminar este anuncio?");
                    if (!confirmed) {
                        e.preventDefault();
                    }
                });
            });
        }

        // Función para abrir el modal de anuncio
        function openAnnouncementModal(announcement, editable = false) {
            const oldModal = document.getElementById('announcementModal');
            if (oldModal) oldModal.remove();

            const modalHTML = `
                <div id="announcementModal" class="modal-overlay">
                    <div class="modal-content" style="max-width: 600px;">
                        <div class="modal-header">
                            <h2>${editable ? 'Editar Anuncio' : 'Ver Anuncio'}</h2>
                            <span class="close-modal" id="closeAnnouncementModal">&times;</span>
                        </div>
                        <div class="modal-body">
                            <form id="announcementForm" method="POST" action="/updateAnnouncement/${announcement.id_mensaje}">
                                <div class="form-group">
                                    <label>Título:</label>
                                    <input type="text" name="notificationTitle" value="${announcement.titulo}" 
                                        class="form-control" ${editable ? '' : 'readonly'} required>
                                </div>

                                <div class="form-group">
                                    <label>Mensaje:</label>
                                    <textarea name="notificationMessage" class="form-control" rows="6" 
                                            ${editable ? '' : 'readonly'} required>${announcement.mensaje}</textarea>
                                </div>

                                <div class="form-group">
                                    <label>Fecha de creación:</label>
                                    <input type="text" value="${new Date(announcement.fecha_creacion).toLocaleString()}" 
                                        class="form-control" readonly>
                                </div>

                                <div class="form-group" style="margin-top: 20px;">
                                    ${editable ? `
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-save me-2"></i>Guardar Cambios
                                        </button>
                                    ` : ''}
                                    <button type="button" class="btn btn-secondary" id="cancelAnnouncementModal">
                                        ${editable ? 'Cancelar' : 'Cerrar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Event listeners para cerrar el modal
            document.getElementById('closeAnnouncementModal').addEventListener('click', () => {
                document.getElementById('announcementModal').remove();
            });
            
            document.getElementById('cancelAnnouncementModal').addEventListener('click', () => {
                document.getElementById('announcementModal').remove();
            });

            // Cerrar modal al hacer clic fuera
            document.getElementById('announcementModal').addEventListener('click', (e) => {
                if (e.target.id === 'announcementModal') {
                    document.getElementById('announcementModal').remove();
                }
            });
        }

        // Event listeners para paginación y búsqueda (agregar al final de la función DOMContentLoaded)
        document.getElementById('announcementsPrevBtn')?.addEventListener('click', () => {
            if (currentAnnouncementPage > 1) {
                currentAnnouncementPage--;
                renderManageAnnouncements();
            }
        });

        document.getElementById('announcementsNextBtn')?.addEventListener('click', () => {
            const totalPages = Math.ceil(allAnnouncements.length / announcementsPerPage);
            if (currentAnnouncementPage < totalPages) {
                currentAnnouncementPage++;
                renderManageAnnouncements();
            }
        });

        document.getElementById('searchAnnouncementInput')?.addEventListener('input', (e) => {
            currentAnnouncementSearchTerm = e.target.value;
            currentAnnouncementPage = 1; // Reiniciar a la primera página
            renderManageAnnouncements();
        });
            


            // Initialize with dashboard
            showSection('dashboard');
        });

