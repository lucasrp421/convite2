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

// ===== Fluxo: Envelope -> Vídeo (+ música) -> Convite =====
envelope.addEventListener("click", startExperience);
envelope.addEventListener("touchend", startExperience, { passive: true });

let started = false;
function startExperience(e) {
    if (started) return;
    started = true;
    if (e) e.preventDefault();

    showScreen(videoScreen);

    // Toca o vídeo e a música juntos
    video.currentTime = 0;
    video.muted = false;
    video.play().catch(() => {});

    bgMusic.volume = 0.6;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {
        // Alguns navegadores podem bloquear; tenta de novo no próximo toque
    });
}

video.addEventListener("ended", () => {
    showScreen(inviteScreen);
});

// Permite pular o vídeo tocando nele (opcional, mas comum em convites)
video.addEventListener("click", () => {
    video.currentTime = video.duration || 0;
});

// ===== Botões do convite =====
presentBtn.addEventListener("click", () => showScreen(presentScreen));
dressBtn.addEventListener("click", () => showScreen(dressScreen));

confirmBtn.addEventListener("click", () => {
    window.open(LINK_CONFIRMAR, "_blank");
});

localBtn.addEventListener("click", () => {
    window.open(LINK_LOCAL, "_blank");
});

// ===== Botões de voltar (sempre retornam ao convite principal) =====
backButtons.forEach(btn => {
    btn.addEventListener("click", () => showScreen(inviteScreen));
});

// ===== Garante que a música continue tocando mesmo se o navegador pausar no background =====
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && started && bgMusic.paused && !videoScreen.classList.contains("active")) {
        bgMusic.play().catch(() => {});
    }
});
