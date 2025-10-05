// SELECTORES DE ELEMENTOS DEL DOM
const form = document.getElementById('ticketForm');
const ticketSection = document.getElementById('ticketSection');

const avatarInput = document.getElementById('avatar');
const uploadLabel = document.getElementById('uploadLabel');
const previewContainer = document.getElementById('previewContainer');
const avatarPreview = document.getElementById('avatarPreview');
const changeImageBtn = document.getElementById('changeImageBtn');

const ticketMessage = document.getElementById('ticketMessage');
const ticketSubMessage = document.getElementById('ticketSubMessage');
const ticketAvatar = document.getElementById('ticketAvatar');
const ticketName = document.getElementById('ticketName');
const ticketGithub = document.getElementById('ticketGithub');



// FUNCIÓN DE VISTA PREVIA Y VALIDACIÓN DEL AVATAR

avatarInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        const maxSize = 500 * 1024; // 500KB

        if (file.size > maxSize) {
            alert('❌ La imagen no puede superar los 500KB.');
            this.value = '';
            uploadLabel.hidden = false;
            previewContainer.hidden = true;
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            avatarPreview.src = e.target.result;
            uploadLabel.hidden = true;
            previewContainer.hidden = false;
        };
        reader.readAsDataURL(file);
    } else {
        uploadLabel.hidden = false;
        previewContainer.hidden = true;
        avatarPreview.src = '#';
    }
});

// FUNCIÓN PARA REINICIAR LA VISTA DEL AVATAR

changeImageBtn.addEventListener('click', () => {
    avatarInput.value = '';
    uploadLabel.hidden = false;
    previewContainer.hidden = true;
    avatarPreview.src = '#';
});



// MANEJO DEL ENVÍO DEL FORMULARIO Y GENERACIÓN DEL TICKET


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const github = document.getElementById('github').value.trim().replace('@', '');
    const avatarFile = avatarInput.files[0];

    if (!name || !email || !github) {
        alert("Por favor completa todos los campos.");
        return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("El email no es válido.");
        return;
    }

    // Consulta API de GitHub
    let githubData = null;
    try {
        const response = await fetch(`https://api.github.com/users/${github}`);
        if (response.ok) {
            githubData = await response.json();
        } else {
            console.warn("No se pudo obtener datos de GitHub");
        }
    } catch (err) {
        console.error("Error al consultar API:", err);
    }

    // Ocultar formulario y mostrar ticket
    form.hidden = true;
    ticketSection.hidden = false;

    // Mensajes del ticket
    ticketMessage.innerHTML =
        `Congrats, <span style="color:#ff6a3d">${name}</span>!<br>Your ticket is ready.`;

    ticketSubMessage.innerHTML =
        `We've emailed your ticket to <span style="color:#ff6a3d">${email}</span> 
         and will send updates in the run up to the event.`;

    // Avatar del ticket
    if (avatarFile) {
        ticketAvatar.src = URL.createObjectURL(avatarFile);
    } else if (githubData && githubData.avatar_url) {
        ticketAvatar.src = githubData.avatar_url;
    } else {
        ticketAvatar.src = "assets/default-avatar.png";
    }

    // Nombre (si GitHub trae name, lo usamos, sino el del form)
    ticketName.textContent = githubData && githubData.name ? githubData.name : name;

    // GitHub username 
    ticketGithub.innerHTML = ` <img src="/assets/images/icon-github.svg" alt="GitHub icon" class="github-icon">
    <span>@${github}</span>
`;
});
