const opening       = document.getElementById("opening");
const videoScreen   = document.getElementById("videoScreen");
const inviteScreen  = document.getElementById("inviteScreen");
const presentScreen = document.getElementById("presentScreen");
const dressScreen   = document.getElementById("dressScreen");

const video   = document.getElementById("openingVideo");
const bgMusic = document.getElementById("bgMusic");

const confirmBtn  = document.getElementById("confirmBtn");
const localBtn    = document.getElementById("localBtn");
const presentBtn  = document.getElementById("presentBtn");
const dressBtn    = document.getElementById("dressBtn");
const backButtons = document.querySelectorAll("[data-back]");

const LINK_CONFIRMAR = "https://wa.me/5561992959195";
const LINK_LOCAL     = "https://share.google/awzooLA4ul8FZy1jJ";

const allScreens = [opening, videoScreen, inviteScreen, presentScreen, dressScreen];

function showScreen(s) {
    allScreens.forEach(x => x.classList.remove("active"));
    s.classList.add("active");
}

// ===== Eliminar flash preto: pré-posiciona o vídeo ANTES de mostrar a tela =====
// O vídeo fica mudo e pausado no frame 0 enquanto aguarda o clique.
// Assim quando a tela do vídeo aparecer, o frame já está pintado no canvas.
video.muted = true;
video.preload = "auto";

// Assim que dados suficientes carregam, decodifica o primeiro frame
video.addEventListener("canplay", function onCanPlay() {
    video.removeEventListener("canplay", onCanPlay);
    // Joga brevemente mudo para forçar o decode do frame
    video.play().then(function() {
        video.pause();
        video.currentTime = 0;
        video.muted = false; // restaura
    }).catch(function() {
        video.muted = false;
    });
}, { once: true });

// ===== Clique na tela inicial =====
let started = false;

opening.addEventListener("click", function() {
    if (started) return;
    started = true;

    // Troca de tela — o frame já está pintado, sem flash preto
    showScreen(videoScreen);

    video.muted = false;
    video.currentTime = 0;

    video.play().catch(function(err) {
        console.warn("play bloqueado:", err);
        // Fallback mobile: começa mudo e desmuta
        video.muted = true;
        video.play().then(function() {
            video.muted = false;
        }).catch(function(e) { console.warn(e); });
    });
});

// Música entra só depois que o vídeo estiver tocando (sem conflito de play duplo)
video.addEventListener("play", function() {
    bgMusic.volume = 0.5;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(function() {});
}, { once: true });

// Fim do vídeo → convite
video.addEventListener("ended", function() {
    showScreen(inviteScreen);
});

// Toque no vídeo pula para o fim
video.addEventListener("click", function() {
    video.currentTime = video.duration - 0.1 || 9999;
});

// ===== Botões do convite =====
presentBtn.addEventListener("click", function() { showScreen(presentScreen); });
dressBtn.addEventListener("click",   function() { showScreen(dressScreen); });
confirmBtn.addEventListener("click", function() { window.open(LINK_CONFIRMAR, "_blank"); });
localBtn.addEventListener("click",   function() { window.open(LINK_LOCAL, "_blank"); });

backButtons.forEach(function(btn) {
    btn.addEventListener("click", function() { showScreen(inviteScreen); });
});

// Retoma música ao voltar para o app
document.addEventListener("visibilitychange", function() {
    if (!document.hidden && started && bgMusic.paused && !videoScreen.classList.contains("active")) {
        bgMusic.play().catch(function() {});
    }
});
