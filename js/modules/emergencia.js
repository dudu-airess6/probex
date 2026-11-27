/* ==========================================================================
   PROBEX - SBV Pediátrico na Escola
   Lógica do Módulo de Emergência (js/modules/emergencia.js)
   ========================================================================== */

// --- Passos de Desengasgo Bebê (< 1 ano) ---
const passosBebe = [
    {
        numero: "PASSO 1 DE 5",
        instrucao: "1. Posicione o bebê de bruços no seu antebraço, apoiado na sua coxa. Mantenha a cabeça mais baixa que o corpo. Segure a mandíbula (queixo) em 'C' sem apertar a garganta.",
        alertaPrefixo: "NUNCA: ",
        alertaTexto: "Não segure o bebê de ponta-cabeça pelas pernas e não garroteie o pescoço."
    },
    {
        numero: "PASSO 2 DE 5",
        instrucao: "2. Dê 5 GOLPES FIRMES no meio das costas do bebê (entre as escápulas) com a base da sua outra mão.",
        alertaPrefixo: "Dica: ",
        alertaTexto: "Mantenha a cabeça e o pescoço apoiados durante os golpes."
    },
    {
        numero: "PASSO 3 DE 5",
        instrucao: "3. VIRE O BEBÊ de barriga para cima, apoiado no outro antebraço e coxa, mantendo a cabeça mais baixa que o corpo.",
        alertaPrefixo: "Atenção: ",
        alertaTexto: "Mantenha firme o suporte à cabeça e ao pescoço durante a virada."
    },
    {
        numero: "PASSO 4 DE 5",
        instrucao: "4. Faça 5 impulsos torácicos rápidos na metade inferior do esterno, usando a base da palma de uma mão.",
        alertaPrefixo: "Técnica AHA/AAP 2025: ",
        alertaTexto: "Para aliviar o engasgo grave em bebês, use a base da palma de uma mão nos impulsos torácicos."
    },
    {
        numero: "PASSO 5 DE 5",
        instrucao: "5. REPITA o ciclo de 5 golpes nas costas e 5 impulsos torácicos até o objeto sair ou o bebê ficar inconsciente.",
        alertaPrefixo: "Emergência: ",
        alertaTexto: "Se o bebê ficar inconsciente, inicie a RCP imediatamente pelas compressões torácicas; não verifique pulso."
    }
];

// --- Passos de Desengasgo Criança (≥ 1 ano) ---
const passosCrianca = [
    {
        numero: "PASSO 1 DE 4",
        instrucao: "1. Ajoelhe-se ou fique na altura da criança, posicione-se atrás ou ao lado dela e incline o corpo da criança levemente para a frente.",
        alertaPrefixo: "ATENÇÃO: ",
        alertaTexto: "Se a criança estiver tossindo com força ou falando (engasgo leve), apenas incentive a tosse!"
    },
    {
        numero: "PASSO 2 DE 4",
        instrucao: "2. Dê 5 GOLPES FIRMES no meio das costas (entre as escápulas) com a base da sua mão.",
        alertaPrefixo: "Dica: ",
        alertaTexto: "Mantenha a criança inclinada para a frente durante os golpes nas costas."
    },
    {
        numero: "PASSO 3 DE 4",
        instrucao: "3. Fique atrás da criança, abrace a cintura, feche uma mão em punho (polegar para a barriga) 2 dedos acima do umbigo. Cubra com a outra mão e puxe rápido para DENTRO e para CIMA 5 vezes (Heimlich).",
        alertaPrefixo: "Posição: ",
        alertaTexto: "Posicione o punho acima do umbigo e bem abaixo do osso do peito (esterno)."
    },
    {
        numero: "PASSO 4 DE 4",
        instrucao: "4. REPITA alternando 5 golpes nas costas e 5 impulsos abdominais até o objeto sair ou a criança ficar inconsciente.",
        alertaPrefixo: "Emergência: ",
        alertaTexto: "Se a criança ficar inconsciente, inicie a RCP imediatamente pelas compressões torácicas; não verifique pulso."
    }
];

// --- Conteúdo Dinâmico da RCP (Bebê vs Criança) ---
const tecnicasRcp = {
    bebe: {
        titulo: "RCP BEBÊ (< 1 ANO)",
        passos: [
            "1. Deite o bebê de costas no chão, sobre uma superfície firme e plana.",
            "2. Comprima a metade inferior do esterno cerca de 4 cm (1/3 do tórax), usando a base de uma mão ou os dois polegares com as mãos envolvendo o tórax.",
            "3. Faça compressões a 100–120 por minuto e permita o retorno completo do tórax. Faça 30 compressões e 2 ventilações se estiver sozinho(a), ou 15 compressões e 2 ventilações com 2 socorristas. Se não for possível ventilar, mantenha as compressões enquanto aguarda ajuda."
        ],
        alertaPrefixo: "AHA/AAP 2025: ",
        alertaTexto: "Na RCP de bebês, não use a técnica de 2 dedos. Use uma mão ou os dois polegares com as mãos envolvendo o tórax."
    },
    crianca: {
        titulo: "RCP CRIANÇA (1 ANO ATÉ A PUBERDADE)",
        passos: [
            "1. Deite a criança de costas no chão, sobre uma superfície firme e plana.",
            "2. Comprima a metade inferior do esterno cerca de 5 cm (1/3 do tórax), usando uma ou duas mãos conforme o porte da criança.",
            "3. Faça compressões a 100–120 por minuto e permita o retorno completo do tórax. Faça 30 compressões e 2 ventilações se estiver sozinho(a), ou 15 compressões e 2 ventilações com 2 socorristas. Se não for possível ventilar, mantenha as compressões enquanto aguarda ajuda."
        ],
        alertaPrefixo: "ATENÇÃO: ",
        alertaTexto: "Mantenha os braços estendidos e os ombros alinhados acima das mãos para ajudar a alcançar a profundidade adequada."
    }
};

let passoAtualBebe = 0;
let passoAtualCrianca = 0;
let audioContext = null;
let metronomoInterval = null;
let somAtivo = false;

function preencherAlerta(elemento, prefixo, texto) {
    elemento.textContent = "";
    const strong = document.createElement("strong");
    strong.textContent = prefixo;
    elemento.appendChild(strong);
    elemento.appendChild(document.createTextNode(texto));
}

function atualizarBarraProgresso(barraId, indice, total) {
    const barra = document.getElementById(barraId);
    if (!barra || total <= 0) return;
    const percentual = Math.round(((indice + 1) / total) * 100);
    barra.style.width = `${percentual}%`;
}

// --- Gerenciador de Passos Bebê ---
function atualizarPassoBebe() {
    const tagNumero = document.getElementById("passo-numero-tag");
    const textoInstrucao = document.getElementById("passo-instrucao-texto");
    const alertaEspecifico = document.getElementById("passo-alerta-especifico");
    const btnAnt = document.getElementById("btn-passo-anterior");
    const btnProx = document.getElementById("btn-passo-proximo");

    if (!tagNumero || !textoInstrucao || !alertaEspecifico || !btnAnt || !btnProx) return;

    const passo = passosBebe[passoAtualBebe];
    tagNumero.textContent = passo.numero;
    textoInstrucao.textContent = passo.instrucao;
    preencherAlerta(alertaEspecifico, passo.alertaPrefixo, passo.alertaTexto);
    atualizarBarraProgresso("passo-progresso-fill-bebe", passoAtualBebe, passosBebe.length);

    btnAnt.disabled = (passoAtualBebe === 0);
    btnProx.textContent = (passoAtualBebe === passosBebe.length - 1)
        ? "Reiniciar ciclo"
        : "Próximo passo";
}

// --- Gerenciador de Passos Criança ---
function atualizarPassoCrianca() {
    const tagNumero = document.getElementById("passo-numero-tag-crianca");
    const textoInstrucao = document.getElementById("passo-instrucao-crianca");
    const alertaEspecifico = document.getElementById("passo-alerta-crianca");
    const btnAnt = document.getElementById("btn-passo-ant-crianca");
    const btnProx = document.getElementById("btn-passo-prox-crianca");

    if (!tagNumero || !textoInstrucao || !alertaEspecifico || !btnAnt || !btnProx) return;

    const passo = passosCrianca[passoAtualCrianca];
    tagNumero.textContent = passo.numero;
    textoInstrucao.textContent = passo.instrucao;
    preencherAlerta(alertaEspecifico, passo.alertaPrefixo, passo.alertaTexto);
    atualizarBarraProgresso("passo-progresso-fill-crianca", passoAtualCrianca, passosCrianca.length);

    btnAnt.disabled = (passoAtualCrianca === 0);
    btnProx.textContent = (passoAtualCrianca === passosCrianca.length - 1)
        ? "Reiniciar ciclo"
        : "Próximo passo";
}

// --- Gerenciador de Técnica RCP (Bebê vs Criança) ---
function aplicarTecnicaRcp(idade, atualizarUrl = false) {
    const faixa = idade === "crianca" ? "crianca" : "bebe";
    const dados = tecnicasRcp[faixa];
    const titulo = document.getElementById("rcp-titulo-faixa");
    const container = document.getElementById("conteudo-tecnica-rcp");
    const tabBebe = document.getElementById("tab-rcp-bebe");
    const tabCrianca = document.getElementById("tab-rcp-crianca");

    if (!container || !tabBebe || !tabCrianca) return;

    if (titulo) {
        titulo.textContent = dados.titulo;
    }

    const ehBebe = faixa === "bebe";
    tabBebe.classList.toggle("ativo", ehBebe);
    tabCrianca.classList.toggle("ativo", !ehBebe);
    tabBebe.setAttribute("aria-pressed", String(ehBebe));
    tabCrianca.setAttribute("aria-pressed", String(!ehBebe));

    container.textContent = "";
    dados.passos.forEach((textoPasso) => {
        const p = document.createElement("p");
        p.className = "passo-instrucao";
        p.textContent = textoPasso;
        container.appendChild(p);
    });

    const alerta = document.createElement("div");
    alerta.className = "passo-alerta-grave";
    preencherAlerta(alerta, dados.alertaPrefixo, dados.alertaTexto);
    container.appendChild(alerta);

    if (atualizarUrl && window.history && typeof window.history.replaceState === "function") {
        const url = new URL(window.location.href);
        url.searchParams.set("idade", faixa);
        window.history.replaceState({}, "", url.toString());
    }
}

// --- Metrônomo Web Audio API (110 BPM) ---
function tocarBeepMetronomo() {
    if (!audioContext || !somAtivo) return;

    try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioContext.currentTime);
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

function pararMetronomo() {
    somAtivo = false;
    if (metronomoInterval) {
        clearInterval(metronomoInterval);
        metronomoInterval = null;
    }
    const btnAudio = document.getElementById("btn-toggle-audio");
    if (btnAudio) {
        btnAudio.textContent = "Ligar som do metrônomo";
        btnAudio.classList.remove("ativo");
        btnAudio.setAttribute("aria-pressed", "false");
    }
}

function toggleSomMetronomo() {
    const btnAudio = document.getElementById("btn-toggle-audio");
    if (!btnAudio) return;

    if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            audioContext = new AudioCtx();
        }
    }

    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
    }

    somAtivo = !somAtivo;

    if (somAtivo) {
        btnAudio.textContent = "Desligar som do metrônomo";
        btnAudio.classList.add("ativo");
        btnAudio.setAttribute("aria-pressed", "true");
        tocarBeepMetronomo();
        if (!metronomoInterval) {
            metronomoInterval = setInterval(tocarBeepMetronomo, 545); // ~110 BPM
        }
    } else {
        pararMetronomo();
    }
}

// --- Inicialização dos Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
    // Bebê Handlers
    const btnAntBebe = document.getElementById("btn-passo-anterior");
    const btnProxBebe = document.getElementById("btn-passo-proximo");

    if (btnAntBebe && btnProxBebe) {
        btnAntBebe.addEventListener("click", () => {
            if (passoAtualBebe > 0) {
                passoAtualBebe--;
                atualizarPassoBebe();
            }
        });

        btnProxBebe.addEventListener("click", () => {
            if (passoAtualBebe < passosBebe.length - 1) {
                passoAtualBebe++;
            } else {
                passoAtualBebe = 0;
            }
            atualizarPassoBebe();
        });

        atualizarPassoBebe();
    }

    // Criança Handlers
    const btnAntCrianca = document.getElementById("btn-passo-ant-crianca");
    const btnProxCrianca = document.getElementById("btn-passo-prox-crianca");

    if (btnAntCrianca && btnProxCrianca) {
        btnAntCrianca.addEventListener("click", () => {
            if (passoAtualCrianca > 0) {
                passoAtualCrianca--;
                atualizarPassoCrianca();
            }
        });

        btnProxCrianca.addEventListener("click", () => {
            if (passoAtualCrianca < passosCrianca.length - 1) {
                passoAtualCrianca++;
            } else {
                passoAtualCrianca = 0;
            }
            atualizarPassoCrianca();
        });

        atualizarPassoCrianca();
    }

    // RCP Abas Bebê vs Criança + Leitura do parâmetro ?idade=
    const tabRcpBebe = document.getElementById("tab-rcp-bebe");
    const tabRcpCrianca = document.getElementById("tab-rcp-crianca");
    if (tabRcpBebe && tabRcpCrianca) {
        const params = new URLSearchParams(window.location.search);
        const idadeInicial = params.get("idade") === "crianca" ? "crianca" : "bebe";
        aplicarTecnicaRcp(idadeInicial, false);

        tabRcpBebe.addEventListener("click", () => aplicarTecnicaRcp("bebe", true));
        tabRcpCrianca.addEventListener("click", () => aplicarTecnicaRcp("crianca", true));
    }

    // Toggle Áudio Metrônomo
    const btnAudio = document.getElementById("btn-toggle-audio");
    if (btnAudio) {
        btnAudio.addEventListener("click", toggleSomMetronomo);
        window.addEventListener("pagehide", pararMetronomo);
    }
});