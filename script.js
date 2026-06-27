const opening       = document.getElementById("opening");
const videoScreen   = document.getElementById("videoScreen");
const inviteScreen  = document.getElementById("inviteScreen");
const presentScreen = document.getElementById("presentScreen");
const dressScreen   = document.getElementById("dressScreen");

const video       = document.getElementById("openingVideo");
const bgMusic     = document.getElementById("bgMusic");
const buttonsRow  = document.querySelector(".buttons-row");

const confirmBtn  = document.getElementById("confirmBtn");
const localBtn    = document.getElementById("localBtn");
const presentBtn  = document.getElementById("presentBtn");
const dressBtn    = document.getElementById("dressBtn");
const backButtons = document.querySelectorAll("[data-back]");

const LINK_CONFIRMAR = "https://wa.me/5561992959195";
const LINK_LOCAL     = "https://share.google/awzooLA4ul8FZy1jJ";

const allScreens = [opening, videoScreen, inviteScreen, presentScreen, dressScreen];

// ── Inicializa todas as telas no DOM mas invisíveis ──────────────────
allScreens.forEach(s => {
    s.style.display       = "flex";
    s.style.opacity       = "0";
    s.style.pointerEvents = "none";
    s.style.zIndex        = "0";
    s.style.transition    = "opacity 0.35s ease";
});

function showScreen(target) {
    allScreens.forEach(s => {
        s.style.opacity       = "0";
        s.style.pointerEvents = "none";
        s.style.zIndex        = "0";
    });
    target.style.opacity       = "1";
    target.style.pointerEvents = "auto";
    target.style.zIndex        = "1";
}

// Mostra tela inicial
showScreen(opening);

// ── Pré-aquece o vídeo silenciosamente ──────────────────────────────
// O vídeo roda mudo desde o início: decoder já tem frames prontos.
// Assim quando o usuário clicar, não há frame preto — só reveal de opacity.
video.muted = true;
video.play().catch(() => {});

// ── Temporizador para mostrar botões 2s antes do fim do vídeo ────────
let buttonTimerSet = false;

video.addEventListener("timeupdate", function () {
    if (buttonTimerSet) return;
    const remaining = video.duration - video.currentTime;
    if (!isNaN(remaining) && remaining <= 2) {
        buttonTimerSet = true;
        // Animação: botões sobem da posição inicial
        buttonsRow.classList.add("visible");
    }
});

// ── Clique na tela inicial ───────────────────────────────────────────
let started = false;

opening.addEventListener("click", function () {
    if (started) return;
    started = true;

    // Reinicia do frame 0 e desmuta — frame já está pintado
    video.currentTime = 0;
    video.muted = false;
    buttonTimerSet = false;
    buttonsRow.classList.remove("visible");

    video.play().catch(function () {
        video.muted = true;
        video.play().then(function () { video.muted = false; }).catch(() => {});
    });

    // Música — disparada diretamente pelo clique do usuário
    bgMusic.volume = 0.5;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(function (e) {
        console.warn("bgMusic bloqueada:", e);
    });

    showScreen(videoScreen);
});

// ── Fim do vídeo → convite (botões já visíveis, ficam lá) ────────────
video.addEventListener("ended", function () {
    showScreen(inviteScreen);
    // Garante que os botões estão visíveis ao chegar no convite
    buttonsRow.classList.add("visible");
});

// Toque no vídeo pula para o fim (2s antes para acionar animação)
video.addEventListener("click", function () {
    if (!started) return;
    const jumpTo = video.duration ? video.duration - 2.1 : 9999;
    video.currentTime = jumpTo;
});

// ── Botões do convite ────────────────────────────────────────────────
presentBtn.addEventListener("click", function () { showScreen(presentScreen); });
dressBtn.addEventListener("click",   function () { showScreen(dressScreen); });
confirmBtn.addEventListener("click", function () { window.open(LINK_CONFIRMAR, "_blank"); });
localBtn.addEventListener("click",   function () { window.open(LINK_LOCAL, "_blank"); });

backButtons.forEach(function (btn) {
    btn.addEventListener("click", function () { showScreen(inviteScreen); });
});

// ── Retoma música ao voltar para o app ───────────────────────────────
document.addEventListener("visibilitychange", function () {
    if (!document.hidden && started && bgMusic.paused && videoScreen.style.opacity !== "1") {
        bgMusic.play().catch(() => {});
    }
});
