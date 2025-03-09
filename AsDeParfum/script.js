console.log("script.js carregado!");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM totalmente carregado!");

    const headerContainer = document.getElementById("header-container");
    const footerContainer = document.getElementById("footer-container");

    if (!headerContainer) {
        console.error("Elemento #header-container não encontrado!");
    }
    if (!footerContainer) {
        console.error("Elemento #footer-container não encontrado!");
    }

    import("./components/header.js")
    .then(({ Header, setupHeaderListeners }) => {
        console.log("Header gerado:", Header()); 
        document.getElementById("header-container").innerHTML = Header();
        setupHeaderListeners();
    })
    .catch(error => console.error("Erro ao carregar header.js:", error));

import("./components/footer.js")
    .then(({ Footer }) => {
        console.log("Footer gerado:", Footer()); 
        document.getElementById("footer-container").innerHTML = Footer();
    })
    .catch(error => console.error("Erro ao carregar footer.js:", error));
});