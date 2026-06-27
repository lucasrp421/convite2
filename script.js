// ===== Elementos das telas =====
const opening = document.getElementById("opening");
const videoScreen = document.getElementById("videoScreen");
const inviteScreen = document.getElementById("inviteScreen");
const presentScreen = document.getElementById("presentScreen");
const dressScreen = document.getElementById("dressScreen");

const envelope = document.getElementById("envelope");
const video = document.getElementById("openingVideo");
const bgMusic = document.getElementById("bgMusic");

const confirmBtn = document.getElementById("confirmBtn");
const localBtn = document.getElementById("localBtn");
const presentBtn = document.getElementById("presentBtn");
const dressBtn = document.getElementById("dressBtn");

const backButtons = document.querySelectorAll("[data-back]");

// Links externos
const LINK_CONFIRMAR = "https://wa.me/5561992959195";
const LINK_LOCAL = "https://share.google/awzooLA4ul8FZy1jJ";

// ===== Helper para troca de tela =====
function showScreen(screenToShow) {
    [opening, videoScreen, inviteScreen, presentScreen, dressScreen].forEach(s => {
        s.classList.remove("active");
    });
    screenToShow.classList.add("active");
}

// ===== Fluxo: Envelope -> Vídeo -> Convite =====
let started = false;

function startExperience(e) {
    if (started) return;
    started = true;
    e.preventDefault();

    showScreen(videoScreen);

    // FIX: Só dá play no vídeo primeiro.
    // A música entra no evento 'play' do vídeo para evitar conflito no mobile
    // (dois .play() simultâneos podem fazer o navegador rejeitar ambos).
    video.currentTime = 0;
    video.muted = false;

    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(err => {
            console.warn("Vídeo bloqueado pelo navegador:", err);
        });
    }
}

// Quando o vídeo realmente começa a rodar, liga a música
video.addEventListener("play", () => {
    bgMusic.volume = 0.6;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(err => {
        console.warn("Música bloqueada pelo navegador:", err);
    });
}, { once: true }); // once: dispara só na primeira vez

// Ao terminar o vídeo, vai para o convite
video.addEventListener("ended", () => {
    showScreen(inviteScreen);
});

// Toque no vídeo pula para o fim (comportamento comum em convites)
video.addEventListener("click", () => {
    video.currentTime = video.duration || 9999;
});

// Registra listeners no envelope (click + touchend para mobile)
envelope.addEventListener("click", startExperience);
envelope.addEventListener("touchend", startExperience, { passive: false });

// ===== Botões do convite =====
presentBtn.addEventListener("click", () => showScreen(presentScreen));
dressBtn.addEventListener("click", () => showScreen(dressScreen));

confirmBtn.addEventListener("click", () => {
    window.open(LINK_CONFIRMAR, "_blank");
});

localBtn.addEventListener("click", () => {
    window.open(LINK_LOCAL, "_blank");
});

// ===== Botões de voltar =====
backButtons.forEach(btn => {
    btn.addEventListener("click", () => showScreen(inviteScreen));
});

// ===== Retoma música se usuário voltar para o app =====
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && started && bgMusic.paused && !videoScreen.classList.contains("active")) {
        bgMusic.play().catch(() => {});
    }
});
