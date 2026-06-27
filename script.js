// ===== Elementos das telas =====
const opening     = document.getElementById("opening");
const videoScreen = document.getElementById("videoScreen");
const inviteScreen = document.getElementById("inviteScreen");
const presentScreen = document.getElementById("presentScreen");
const dressScreen = document.getElementById("dressScreen");

const envelope = document.getElementById("envelope");
const video    = document.getElementById("openingVideo");
const bgMusic  = document.getElementById("bgMusic");

const confirmBtn = document.getElementById("confirmBtn");
const localBtn   = document.getElementById("localBtn");
const presentBtn = document.getElementById("presentBtn");
const dressBtn   = document.getElementById("dressBtn");

const backButtons = document.querySelectorAll("[data-back]");

const LINK_CONFIRMAR = "https://wa.me/5561992959195";
const LINK_LOCAL     = "https://share.google/awzooLA4ul8FZy1jJ";

const allScreens = [opening, videoScreen, inviteScreen, presentScreen, dressScreen];

// ===== Helper troca de tela =====
function showScreen(screenToShow) {
    allScreens.forEach(s => s.classList.remove("active"));
    screenToShow.classList.add("active");
}

// ===== Pré-carrega o vídeo para eliminar flash preto =====
// Carrega metadados sem travar o primeiro frame
video.preload = "auto";
video.load();

// Assim que o primeiro frame estiver pronto, trava o vídeo nele
// (o frame fica "pintado" no elemento, eliminando o flash preto ao exibir a tela)
video.addEventListener("loadeddata", () => {
    video.currentTime = 0.01; // posiciona no 1º frame visível
}, { once: true });

// ===== Fluxo: Envelope → Vídeo → Convite =====
let started = false;

function startExperience(e) {
    if (started) return;
    started = true;
    e.preventDefault();

    // Mostra a tela do vídeo — o 1º frame já está pintado, sem flash preto
    showScreen(videoScreen);

    video.currentTime = 0;
    video.muted = false;

    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(err => {
            console.warn("Vídeo bloqueado:", err);
        });
    }
}

// Música começa quando o vídeo de fato inicia (evita conflito de play() no mobile)
video.addEventListener("play", () => {
    bgMusic.volume = 0.6;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(err => console.warn("Música bloqueada:", err));
}, { once: true });

// Ao terminar o vídeo → convite
video.addEventListener("ended", () => {
    showScreen(inviteScreen);
});

// Toque no vídeo → pula para o fim
video.addEventListener("click", () => {
    video.currentTime = video.duration || 9999;
});

// Listeners no envelope
envelope.addEventListener("click",    startExperience);
envelope.addEventListener("touchend", startExperience, { passive: false });

// ===== Botões do convite =====
presentBtn.addEventListener("click", () => showScreen(presentScreen));
dressBtn.addEventListener("click",   () => showScreen(dressScreen));
confirmBtn.addEventListener("click", () => window.open(LINK_CONFIRMAR, "_blank"));
localBtn.addEventListener("click",   () => window.open(LINK_LOCAL, "_blank"));

// ===== Botões de voltar =====
backButtons.forEach(btn => {
    btn.addEventListener("click", () => showScreen(inviteScreen));
});

// ===== Retoma música se app voltar ao foco =====
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && started && bgMusic.paused && !videoScreen.classList.contains("active")) {
        bgMusic.play().catch(() => {});
    }
});
