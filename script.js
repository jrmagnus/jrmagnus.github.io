
// --- LÓGICA DO EFEITO SPOTLIGHT ---
document.getElementById("cards").onmousemove = e => {
    for (const card of document.getElementsByClassName("card")) {
        const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };
}

// --- LÓGICA DA API GEMINI ---

function formatText(type) {
    const textArea = document.getElementById('textToFormat');
    let text = textArea.value;

    switch (type) {
        case 'lowercase':
            text = text.toLowerCase();
            break;
        case 'uppercase':
            text = text.toUpperCase();
            break;
        case 'capitalize':
            text = text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
            break;
        case 'alternating':
            text = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
            break;
    }

    textArea.value = text;
}

function copyFormattedText() {
    const textArea = document.getElementById('textToFormat');
    textArea.select();
    try {
        document.execCommand('copy');
        // Optional: Visual feedback could be added here
    } catch (err) {
        console.error('Falha ao copiar: ', err);
    }
}


// --- LÓGICA PARA TROCA DE TEMA (Estilo Original) ---
// --- LÓGICA PARA TROCA DE TEMA ---
function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);

    // Atualiza os botões ativos
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(themeName)) {
            btn.classList.add('active');
        }
    });
}

// Aplica o tema guardado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'antigravity';
    setTheme(savedTheme);

    // Inicia a calculadora de etanol e adiciona listeners
    mixEthanolCalc();
    const ethanolInputs = ['gasliters', 'ethanolpercentgas', 'ethanolliters'];
    ethanolInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', mixEthanolCalc);
    });
});

// --- LÓGICA DAS FERRAMENTAS ---

function generatepassword() {
    document.getElementById("txtgeneratepassword").value = '';
    const passwordlist = document.getElementById('passwordlist');
    passwordlist.innerHTML = '';

    const passwordquantity = parseInt(document.getElementById('passwordquantity').value) || 1;
    const passwordlength = parseInt(document.getElementById('passwordlength').value) || 12;
    const charsLetters = "abcdefghkmnopqrstuvwxyzABCDEFGHKLMNPQRSTUVWXYZ";
    const charsSpecial = "!@#$%^&*~";
    const charsNumbers = "0123456789";
    let chars = '';

    if (document.getElementById('charsletters').checked) chars += charsLetters;
    if (document.getElementById('charsnumbers').checked) chars += charsNumbers;
    if (document.getElementById('charsspecials').checked) chars += charsSpecial;

    if (chars.length === 0) {
        alert("Por favor, selecione pelo menos um tipo de caractere.");
        return;
    }

    const passwords = [];
    for (let i = 0; i < passwordquantity; i++) {
        let pass = '';
        for (let j = 0; j < passwordlength; j++) {
            const randomNumber = Math.floor(Math.random() * chars.length);
            pass += chars.substring(randomNumber, randomNumber + 1);
        }
        passwords.push(pass);
    }

    if (passwordquantity === 1) {
        const passInput = document.getElementById("txtgeneratepassword");
        passInput.value = passwords[0];
        passInput.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Falha ao copiar: ', err);
        }
    } else {
        document.getElementById("txtgeneratepassword").value = "Múltiplas palavras-passe na lista.";
        passwords.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p;
            passwordlist.appendChild(li);
        });
    }
}

function formatmac() {
    const macaddressInput = document.getElementById("txtmac");
    let macaddress = macaddressInput.value.trim();
    if (macaddress.length < 12 || macaddress.length > 17) {
        alert("Comprimento de MAC Address inválido. Insira algo como '01234567890A'.");
        return;
    }

    const spacer = document.querySelector('input[name="radialicon"]:checked').value || ':';
    macaddress = macaddress.toUpperCase().replace(/[^0-9A-F]/g, '');

    if (macaddress.length !== 12) {
        alert("MAC Address inválido após a limpeza. Certifique-se de que contém 12 caracteres hexadecimais.");
        return;
    }

    macaddress = macaddress.replace(/(.{2})/g, "$1" + spacer).slice(0, -1);
    macaddressInput.value = macaddress;
    macaddressInput.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Falha ao copiar: ', err);
    }
}

function cidrCalculate() {
    try {
        const block = document.getElementById("cidrInput").value.split("/");
        if (block.length !== 2) return;

        const ipAddress = block[0].split('.').map(Number);
        const maskSize = parseInt(block[1], 10);
        if (isNaN(maskSize) || maskSize < 0 || maskSize > 32) return;

        const mask = (0xFFFFFFFF << (32 - maskSize)) >>> 0;
        const ipInt = (ipAddress[0] << 24 | ipAddress[1] << 16 | ipAddress[2] << 8 | ipAddress[3]) >>> 0;

        const networkInt = ipInt & mask;
        const broadcastInt = networkInt | (~mask >>> 0);

        const intToIp = (int) => `${(int >>> 24) & 255}.${(int >>> 16) & 255}.${(int >>> 8) & 255}.${int & 255}`;

        const firstIp = intToIp(networkInt);
        const lastIp = intToIp(broadcastInt);

        document.getElementById("ipRange").textContent = `${firstIp} - ${lastIp}`;

        if (maskSize >= 31) {
            document.getElementById("DHCPrange").textContent = "N/A";
        } else {
            const firstUsable = intToIp(networkInt + 1);
            const lastUsable = intToIp(broadcastInt - 1);
            document.getElementById("DHCPrange").textContent = `${firstUsable} - ${lastUsable}`;
        }
    } catch (e) {
        document.getElementById("ipRange").textContent = "Inválido";
        document.getElementById("DHCPrange").textContent = "Inválido";
    }
}

function createUsername() {
    const fullName = document.getElementById("fullName").value;
    if (!fullName) return;

    const nameParts = fullName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ").filter(Boolean);
    if (nameParts.length === 0) return;

    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

    let username = `${firstName}.${lastName}`;
    let usernameSix = `${firstName.substring(0, Math.min(firstName.length, 3))}${lastName.substring(0, Math.min(lastName.length, 3))}`;

    const userInput = document.getElementById("username");
    document.getElementById("usernamesixchar").value = usernameSix;
    userInput.value = username;
    userInput.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Falha ao copiar: ', err);
    }
}

// --- LÓGICA DA CALCULADORA DE ETANOL ---
function mixEthanolCalc() {
    const petrolLiters = parseFloat(document.getElementById('gasliters').value) || 0;
    const petrolEthanolPercent = parseFloat(document.getElementById('ethanolpercentgas').value) || 0;
    const ethanolLiters = parseFloat(document.getElementById('ethanolliters').value) || 0;
    const totalEthanol = (petrolLiters * (petrolEthanolPercent / 100)) + ethanolLiters;
    const totalVolume = petrolLiters + ethanolLiters;
    let finalMixPercent = (totalVolume > 0) ? (totalEthanol / totalVolume) * 100 : 0;
    document.getElementById('mixresult').textContent = "E " + finalMixPercent.toFixed(2);
}

// --- NOVAS FERRAMENTAS (Timestamp, Base64, JSON, Contador, Hash) ---

// 1. Conversor Timestamp
function getCurrentTimestamp() {
    const now = new Date();
    document.getElementById('timestampInput').value = Math.floor(now.getTime() / 1000);
    document.getElementById('dateInput').value = now.toLocaleString();
}

function tsToDate() {
    const ts = document.getElementById('timestampInput').value;
    if (!ts) return;
    const date = new Date(ts * 1000);
    document.getElementById('dateInput').value = date.toLocaleString();
}

function dateToTs() {
    const dateStr = document.getElementById('dateInput').value;
    if (!dateStr) return;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        alert("Data inválida");
        return;
    }
    document.getElementById('timestampInput').value = Math.floor(date.getTime() / 1000);
}

// 2. Base64 Encoder/Decoder
function textToBase64() {
    const text = document.getElementById('base64Text').value;
    try {
        document.getElementById('base64Output').value = btoa(text);
    } catch (e) {
        // Ignora erros de digitação incompleta ou caracteres inválidos temporários
    }
}

function base64ToText() {
    const base64 = document.getElementById('base64Output').value;
    try {
        document.getElementById('base64Text').value = atob(base64);
    } catch (e) {
        // Ignora erros
    }
}

// 3. Formatador JSON
function formatJSON() {
    const input = document.getElementById('jsonInput');
    try {
        const obj = JSON.parse(input.value);
        input.value = JSON.stringify(obj, null, 4);
    } catch (e) {
        alert("JSON Inválido: " + e.message);
    }
}

// 4. Contador de Caracteres
function updateCounter() {
    const text = document.getElementById('counterInput').value;
    document.getElementById('charCount').textContent = text.length;
    document.getElementById('wordCount').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('lineCount').textContent = text ? text.split(/\n/).length : 0;
}

// 5. Gerador de Hash
async function generateHash() {
    const text = document.getElementById('hashInput').value;
    if (!text) return;

    const algo = document.querySelector('input[name="hashAlgo"]:checked').value;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    try {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        document.getElementById('hashOutput').value = hashHex;
    } catch (e) {
        console.error(e);
        alert("Erro ao gerar hash");
    }
}

// 6. Formatador de Localização
function formatLocation() {
    const input = document.getElementById('locationInput').value.trim();
    const output = document.getElementById('locationOutput');

    if (!input) return;

    // Tenta extrair números de vários formatos
    // Ex: 41°24'12.2"N 2°10'26.5"E
    // Ex: 41 24 12.2 N 2 10 26.5 E
    // Ex: 41.40338, 2.17403

    let lat = 0, lng = 0;

    // Regex para formato Decimal (ex: 41.40338, 2.17403)
    const decimalRegex = /(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/;

    // Regex para formato DMS (Graus, Minutos, Segundos)
    // Aceita símbolos variados ou espaços
    const dmsRegex = /(\d+)[°\s]+(\d+)[,.'\s]+(\d+(?:\.\d+)?)[,.'"\s]*([NSns])[,.\s]*(\d+)[°\s]+(\d+)[,.'\s]+(\d+(?:\.\d+)?)[,.'"\s]*([EWew])/;

    const decimalMatch = input.match(decimalRegex);
    const dmsMatch = input.match(dmsRegex);

    if (decimalMatch) {
        // Já está em decimal, apenas formata para o padrão Google Maps (lat, lng)
        lat = parseFloat(decimalMatch[1]);
        lng = parseFloat(decimalMatch[2]);
    } else if (dmsMatch) {
        // Converte DMS para Decimal
        const latDeg = parseFloat(dmsMatch[1]);
        const latMin = parseFloat(dmsMatch[2]);
        const latSec = parseFloat(dmsMatch[3]);
        const latDir = dmsMatch[4].toUpperCase();

        const lngDeg = parseFloat(dmsMatch[5]);
        const lngMin = parseFloat(dmsMatch[6]);
        const lngSec = parseFloat(dmsMatch[7]);
        const lngDir = dmsMatch[8].toUpperCase();

        lat = latDeg + latMin / 60 + latSec / 3600;
        if (latDir === 'S') lat = -lat;

        lng = lngDeg + lngMin / 60 + lngSec / 3600;
        if (lngDir === 'W') lng = -lng;
    } else {
        output.value = "Formato não reconhecido";
        return;
    }

    // Formata para o padrão Google Maps: lat, lng (com 6 casas decimais)
    const formatted = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    output.value = formatted;

    // Copia para a área de transferência
    output.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Falha ao copiar', err);
    }
}
