/* ==========================================================================
   PROBEX - SBV Pediátrico na Escola
   Lógica do Módulo de Emergência (js/modules/emergencia.js)
   ========================================================================== */

// --- Passos de Desengasgo Bebê (< 1 ano) ---
const passosBebe = [
    {
        numero: "PASSO 1 DE 5",
        instrucao: "1. Posicione o bebê de bruços no seu antebraço, apoiado na sua coxa. Mantenha a cabeça mais baixa que o corpo. Segure a mandíbula (queixo) em 'C' sem apertar a garganta.",
        alerta: "🚫 NUNCA: Não segure o bebê de ponta-cabeça pelas pernas e não garroteie o pescoço."
    },
    {
        numero: "PASSO 2 DE 5",
        instrucao: "2. Dê 5 GOLPES FIRMES no meio das costas do bebê (entre as escápulas) com a base da sua outra mão.",
        alerta: "🖐️ Dica: Golpes firmes no sentido para fora para expulsar o corpo estranho."
    },
    {
        numero: "PASSO 3 DE 5",
        instrucao: "3. VIRE O BEBÊ de barriga para cima, apoiado no outro antebraço e coxa, mantendo a cabeça mais baixa que o corpo.",
        alerta: "⚠️ Mantenha firme o suporte à cabeça e ao pescoço durante a virada."
    },
    {
        numero: "PASSO 4 DE 5",
        instrucao: "4. Faça 5 COMPRESSÕES no centro do peito (linha dos mamilos), afundando cerca de 4 cm com a base de uma mão ou dois polegares.",
        alerta: "🚫 ATENÇÃO (AHA 2025): A antiga técnica de 2 dedos NÃO é mais recomendada. Use a base da mão ou dois polegares."
    },
    {
        numero: "PASSO 5 DE 5",
        instrucao: "5. REPITA o ciclo de 5 golpes nas costas e 5 compressões no peito sem parar até o objeto ser expulso ou o bebê desmaiar.",
        alerta: "🚨 Se o bebê ficar mole e sem resposta, clique no botão vermelho abaixo para iniciar a RCP imediata!"
    }
];

// --- Passos de Desengasgo Criança (≥ 1 ano) ---
const passosCrianca = [
    {
        numero: "PASSO 1 DE 4",
        instrucao: "1. Ajoelhe-se ou fique na altura da criança, posicione-se atrás ou ao lado dela e incline o corpo da criança levemente para a frente.",
        alerta: "🚫 ATENÇÃO: Se a criança estiver tossindo com força ou falando (engasgo leve), apenas incentive a tosse!"
    },
    {
        numero: "PASSO 2 DE 4",
        instrucao: "2. Dê 5 GOLPES FIRMES no meio das costas (entre as escápulas) com a base da sua mão.",
        alerta: "🖐️ Mantenha a criança inclinada para a frente durante os golpes nas costas."
    },
    {
        numero: "PASSO 3 DE 4",
        instrucao: "3. Fique atrás da criança, abrace a cintura, feche uma mão em punho (polegar para a barriga) 2 dedos acima do umbigo. Cubra com a outra mão e puxe rápido para DENTRO e para CIMA 5 vezes (Heimlich).",
        alerta: "⚠️ Mão posicionada acima do umbigo e bem abaixo do osso do peito (esterno)."
    },
    {
        numero: "PASSO 4 DE 4",
        instrucao: "4. REPITA alternando 5 golpes nas costas e 5 compressões na barriga até o objeto sair ou a criança desmaiar.",
        alerta: "🚨 Se a criança desmaiar, deite-a no chão e clique no botão vermelho abaixo para iniciar a RCP!"
    }
];

let passoAtualBebe = 0;
let passoAtualCrianca = 0;
let audioContext = null;
let metronomoInterval = null;
let somAtivo = false;

// --- Gerenciador de Passos Bebê ---
function atualizarPassoBebe() {
    const tagNumero = document.getElementById('passo-numero-tag');
    const textoInstrucao = document.getElementById('passo-instrucao-texto');
    const alertaEspecifico = document.getElementById('passo-alerta-especifico');
    const btnAnt = document.getElementById('btn-passo-anterior');
    const btnProx = document.getElementById('btn-passo-proximo');

    if (!tagNumero) return;

    const passo = passosBebe[passoAtualBebe];
    tagNumero.textContent = passo.numero;
    textoInstrucao.textContent = passo.instrucao;
    alertaEspecifico.innerHTML = passo.alerta;

    btnAnt.disabled = (passoAtualBebe === 0);
    if (passoAtualBebe === passosBebe.length - 1) {
        btnProx.textContent = "Reiniciar Ciclo 🔄";
    } else {
        btnProx.textContent = "Próximo Passo ➡️";
    }
}

// --- Gerenciador de Passos Criança ---
function atualizarPassoCrianca() {
    const tagNumero = document.getElementById('passo-numero-tag-crianca');
    const textoInstrucao = document.getElementById('passo-instrucao-crianca');
    const alertaEspecifico = document.getElementById('passo-alerta-crianca');
    const btnAnt = document.getElementById('btn-passo-ant-crianca');
    const btnProx = document.getElementById('btn-passo-prox-crianca');

    if (!tagNumero) return;

    const passo = passosCrianca[passoAtualCrianca];
    tagNumero.textContent = passo.numero;
    textoInstrucao.textContent = passo.instrucao;
    alertaEspecifico.innerHTML = passo.alerta;

    btnAnt.disabled = (passoAtualCrianca === 0);
    if (passoAtualCrianca === passosCrianca.length - 1) {
        btnProx.textContent = "Reiniciar Ciclo 🔄";
    } else {
        btnProx.textContent = "Próximo Passo ➡️";
    }
}

// --- Metrônomo Web Audio API (110 BPM) ---
function tocarBeepMetronomo() {
    if (!audioContext || !somAtivo) return;

    try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz beep
        gain.gain.setValueAtTime(0.15, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start();
        osc.stop(audioContext.currentTime + 0.08);
    } catch (e) {
        console.warn("Audio Context Error:", e);
    }
}

function toggleSomMetronomo() {
    const btnAudio = document.getElementById('btn-toggle-audio');
    if (!btnAudio) return;

    if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            audioContext = new AudioCtx();
        }
    }

    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }

    somAtivo = !somAtivo;

    if (somAtivo) {
        btnAudio.textContent = "🔊 Desligar Som do Metrônomo";
        btnAudio.style.background = "var(--cor-suporte)";
        btnAudio.style.color = "#FFF";
        if (!metronomoInterval) {
            metronomoInterval = setInterval(tocarBeepMetronomo, 545); // ~110 BPM
        }
    } else {
        btnAudio.textContent = "🔊 Ligar Som do Metrônomo";
        btnAudio.style.background = "var(--cor-fundo-alt)";
        btnAudio.style.color = "var(--cor-texto)";
        if (metronomoInterval) {
            clearInterval(metronomoInterval);
            metronomoInterval = null;
        }
    }
}

// --- Inicialização dos Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Bebê Handlers
    const btnAntBebe = document.getElementById('btn-passo-anterior');
    const btnProxBebe = document.getElementById('btn-passo-proximo');

    if (btnAntBebe && btnProxBebe) {
        btnAntBebe.addEventListener('click', () => {
            if (passoAtualBebe > 0) {
                passoAtualBebe--;
                atualizarPassoBebe();
            }
        });

        btnProxBebe.addEventListener('click', () => {
            if (passoAtualBebe < passosBebe.length - 1) {
                passoAtualBebe++;
            } else {
                passoAtualBebe = 0; // Reinicia ciclo
            }
            atualizarPassoBebe();
        });

        atualizarPassoBebe();
    }

    // Criança Handlers
    const btnAntCrianca = document.getElementById('btn-passo-ant-crianca');
    const btnProxCrianca = document.getElementById('btn-passo-prox-crianca');

    if (btnAntCrianca && btnProxCrianca) {
        btnAntCrianca.addEventListener('click', () => {
            if (passoAtualCrianca > 0) {
                passoAtualCrianca--;
                atualizarPassoCrianca();
            }
        });

        btnProxCrianca.addEventListener('click', () => {
            if (passoAtualCrianca < passosCrianca.length - 1) {
                passoAtualCrianca++;
            } else {
                passoAtualCrianca = 0; // Reinicia ciclo
            }
            atualizarPassoCrianca();
        });

        atualizarPassoCrianca();
    }

    // Toggle Áudio Metrônomo
    const btnAudio = document.getElementById('btn-toggle-audio');
    if (btnAudio) {
        btnAudio.addEventListener('click', toggleSomMetronomo);
    }
});