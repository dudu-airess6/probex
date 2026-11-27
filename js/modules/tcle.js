const consentFeedback = document.getElementById("consent-feedback");
const acceptSimulation = document.querySelector('[data-consent-choice="accept"]');
const declineSimulation = document.querySelector('[data-consent-choice="decline"]');
const consentReader = document.getElementById("consent-reader");
const consentDocument = document.getElementById("consent-document");
const downloadButton = document.getElementById("consent-download");

if (
    !consentFeedback ||
    !acceptSimulation ||
    !declineSimulation ||
    !consentReader ||
    !consentDocument ||
    !downloadButton
) {
    throw new Error("A interface de simulação do TCLE está incompleta.");
}

let hasReachedEnd = false;

const enableAcceptanceAfterReading = () => {
    if (hasReachedEnd) {
        return;
    }

    const reachedEnd =
        consentReader.scrollTop + consentReader.clientHeight >=
        consentReader.scrollHeight - 2;

    if (reachedEnd) {
        hasReachedEnd = true;
        acceptSimulation.disabled = false;
        consentFeedback.textContent = "Fim do termo alcançado. O aceite de demonstração está habilitado.";
    }
};

consentReader.addEventListener("scroll", enableAcceptanceAfterReading, { passive: true });
window.addEventListener("resize", enableAcceptanceAfterReading);
enableAcceptanceAfterReading();

acceptSimulation.addEventListener("click", () => {
    consentFeedback.dataset.decision = "accept";
    consentFeedback.textContent = "Aceite simulado nesta página. Nenhum dado foi enviado ou armazenado.";
});

declineSimulation.addEventListener("click", () => {
    consentFeedback.dataset.decision = "decline";
    consentFeedback.textContent = "Recusa simulada nesta página. Nenhum dado foi enviado ou armazenado.";
});

downloadButton.addEventListener("click", () => {
    const draftNotice = document.querySelector(".consent-draft-notice");
    if (!draftNotice) {
        throw new Error("O aviso de rascunho do TCLE não foi encontrado.");
    }

    const fileContents = [
        "RASCUNHO DE DEMONSTRAÇÃO — NÃO USAR PARA COLETA",
        consentDocument.innerText.trim(),
        draftNotice.innerText.trim()
    ].join("\n\n");
    const file = new Blob([fileContents], { type: "text/plain;charset=utf-8" });
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = "tcle-probex-rascunho.txt";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);

    consentFeedback.dataset.decision = "download";
    consentFeedback.textContent = "Cópia provisória baixada. Nenhuma decisão foi registrada.";
});
