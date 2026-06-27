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

// =====================================================================
// SOLUÇÃO DEFINITIVA PARA O FLASH PRETO
//
// Em vez de trocar "display:none → display:flex" (que causa frame preto),
// usamos opacity para todas as transições. O vídeo começa a rodar MUDO
// e INVISÍVEL logo que a página carrega — o navegador já decodifica os
// frames. Quando o usuário clica, só aumentamos a opacidade: sem delay,
// sem frame preto, sem jank.
// =====================================================================

const allScreens = [opening, videoScreen, inviteScreen, presentScreen, dressScreen];

function showScreen(target) {
    allScreens.forEach(s => {
        s.style.opacity = "0";
        s.style.pointerEvents = "none";
        s.style.zIndex = "0";
    });
    target.style.opacity = "1";
    target.style.pointerEvents = "auto";
    target.style.zIndex = "1";
}

// Inicializa: só opening visível
allScreens.forEach(s => {
    s.style.display  = "flex";   // TODOS ficam no DOM com display:flex
    s.style.opacity  = "0";
    s.style.pointerEvents = "none";
    s.style.zIndex   = "0";
    s.style.transition = "opacity 0.35s ease";
});
opening.style.opacity = "1";
opening.style.pointerEvents = "auto";
opening.style.zIndex = "1";

// Começa o vídeo MUDO assim que possível — pré-aquece o decoder
video.muted = true;
video.currentTime = 0;
video.play().catch(() => {});   // silencioso; pode falhar em alguns browsers

// =====================================================================
// CLIQUE NA TELA INICIAL
// =====================================================================
let started = false;

opening.addEventListener("click", function () {
    if (started) return;
    started = true;

    // Reinicia do frame 0 e desmuta — o frame já está pintado pelo pré-aquecimento
    video.currentTime = 0;
    video.muted = false;

    // Garante que está tocando
    video.play().catch(function () {
        // Fallback: alguns browsers exigem muted para autoplay
        video.muted = true;
        video.play().then(function () {
            video.muted = false;
        }).catch(function () {});
    });

    // Liga a música junto com o vídeo
    bgMusic.volume = 0.5;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(function () {
        // Alguns browsers bloqueiam áudio sem interação prévia
        // O clique do usuário É a interação — deve funcionar
        console.warn("bgMusic bloqueada");
    });

    // Revela a tela do vídeo com fade
    showScreen(videoScreen);
});

// Fim do vídeo → convite
video.addEventListener("ended", function () {
    showScreen(inviteScreen);
});

// Toque no vídeo pula para o fim
video.addEventListener("click", function () {
    if (!started) return;
    video.currentTime = video.duration - 0.1 || 9999;
});

// =====================================================================
// BOTÕES DO CONVITE
// =====================================================================
presentBtn.addEventListener("click", function () { showScreen(presentScreen); });
dressBtn.addEventListener("click",   function () { showScreen(dressScreen); });
confirmBtn.addEventListener("click", function () { window.open(LINK_CONFIRMAR, "_blank"); });
localBtn.addEventListener("click",   function () { window.open(LINK_LOCAL, "_blank"); });

backButtons.forEach(function (btn) {
    btn.addEventListener("click", function () { showScreen(inviteScreen); });
});

// Retoma música se app voltar ao foco
document.addEventListener("visibilitychange", function () {
    if (!document.hidden && started && bgMusic.paused && videoScreen.style.opacity !== "1") {
        bgMusic.play().catch(function () {});
    }
});
