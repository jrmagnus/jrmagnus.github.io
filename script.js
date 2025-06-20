// --- LÓGICA DA API GEMINI ---
async function generateNames() {
    const topic = document.getElementById('idea-topic').value;
    const resultArea = document.getElementById('gemini-result');
    const button = document.querySelector('.card:first-child .btn');

    if (!topic) {
        resultArea.value = "Por favor, insira um tópico para gerar nomes.";
        return;
    }

    resultArea.value = "A gerar nomes criativos com IA...";
    button.disabled = true;

    const prompt = `Gere uma lista de 5 nomes de projetos criativos e curtos para o seguinte tópico: "${topic}". Responda apenas com a lista, um nome por linha.`;
    
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = "" // A chave será fornecida pelo ambiente
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            resultArea.value = text;
        } else {
            resultArea.value = "Não foi possível gerar nomes. A resposta da IA estava vazia ou em formato inesperado.";
        }
    } catch (error) {
        console.error("Erro na chamada da API Gemini:", error);
        resultArea.value = "Ocorreu um erro ao comunicar com a IA. Por favor, tente novamente mais tarde.";
    } finally {
        button.disabled = false;
    }
}


// --- LÓGICA PARA TROCA DE TEMA (Estilo Original) ---
function changeTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('theme');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Aplica o tema guardado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
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

        const intToIp = (int) => `${(int>>>24)&255}.${(int>>>16)&255}.${(int>>>8)&255}.${int&255}`;
        
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
    } catch(e) {
        document.getElementById("ipRange").textContent = "Inválido";
        document.getElementById("DHCPrange").textContent = "Inválido";
    }
}

function createUsername() {
    const fullName = document.getElementById("fullName").value;
    if (!fullName) return;

    const nameParts = fullName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ").filter(Boolean);
    if(nameParts.length === 0) return;

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
