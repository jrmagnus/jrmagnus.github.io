function generatepassword() { 
    // Clear textbox
    document.getElementById("txtgeneratepassword").value = '';
    var passwordlist = document.getElementById('passwordlist');
    passwordlist.innerHTML = '';

    // Get info
    var passwordquantity = parseInt(document.getElementById('passwordquantity').value);
    var passwordlength = parseInt(document.getElementById('passwordlength').value);
    var chars = '';
    if (document.getElementById('charsletters').checked) chars += "abcdefghkmnopqrstuvwxyzABCDEFGHKLMNPQRSTUVWXYZ";
    if (document.getElementById('charsnumbers').checked) chars += "0123456789";
    if (document.getElementById('charsspecials').checked) chars += "!@#$%^&*~";

    if (passwordquantity > 9999) {
        passwordquantity = 9999;
        document.getElementById('passwordquantity').value = passwordquantity;
        alert(`Max passwords that can be created is ${passwordquantity}`);
    }

    // Create passwords
    for (var i = 0; i < passwordquantity; i++) {
        var password = '';
        for (var j = 0; j < passwordlength; j++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            password += chars[randomNumber];
        }
        let item = document.createElement('li');
        item.innerText = password;
        passwordlist.appendChild(item);
    }

    // Copy the last generated password to the textbox
    if (passwordquantity === 1) {
        document.getElementById("txtgeneratepassword").value = password;
        document.getElementById("txtgeneratepassword").select();
        document.execCommand("copy");
    }
}

function formatmac() {
    var macaddress = document.getElementById("txtmac").value.trim();
    if (macaddress.length < 12 || macaddress.length > 17) {
        alert("Mac address wrong length, input like, '01 23 45 67 89 0A' or '01234567890A'");
        return;
    }

    var macspacer = document.querySelector('input[name="radialicon"]:checked').id;
    var spacerMap = {
        spacer1: ':',
        spacer2: '-',
        spacer3: '.'
    };
    
    macaddress = macaddress.toUpperCase().replace(/[\W_]/g, '');
    if (macaddress.match(/[G-Z]/g)) {
        alert("This isn't a valid MAC");
        return;
    }
    
    macaddress = macaddress.match(/.{1,2}/g).join(spacerMap[macspacer]);
    document.getElementById("txtmac").value = macaddress;
    document.getElementById("txtmac").select();
    document.execCommand("copy");
}

function cidrCalculate() {
    var block = document.getElementById("cidrInput").value.split("/");
    var ipAddress = block[0].split('.').map(Number);
    var netmask = block[1];
    var netmaskBlocks;

    if (!/\d+\.\d+\.\d+\.\d+/.test(netmask)) {
        netmaskBlocks = ("1".repeat(parseInt(netmask)) + "0".repeat(32 - parseInt(netmask))).match(/.{1,8}/g).map(e => parseInt(e, 2));
    } else {
        netmaskBlocks = netmask.split('.').map(Number);
    }

    var invertedNetmaskBlocks = netmaskBlocks.map(e => e ^ 255);
    var baseAddress = ipAddress.map((block, idx) => block & netmaskBlocks[idx]);
    var broadcastAddress = baseAddress.map((block, idx) => block | invertedNetmaskBlocks[idx]);

    document.getElementById("ipRange").value = `${baseAddress.join('.')} - ${broadcastAddress.join('.')}`;
    
    if (netmask === "32") {
        document.getElementById("DHCPrange").value = baseAddress.join('.');
    } else {
        var DHCPbase = baseAddress.slice(0, 3).concat(baseAddress[3] + 1).join('.');
        var DHCPhigher = broadcastAddress.slice(0, 3).concat(broadcastAddress[3] - 1).join('.');
        document.getElementById("DHCPrange").value = `${DHCPbase} - ${DHCPhigher}`;
    }
}

function createUsername() {
    let fullName = document.getElementById("fullName").value;
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const surnames = nameParts.slice(1);
    let username = firstName;

    for (let i = 0; i < surnames.length && username.length < 16; i++) {
        const surname = surnames[i];
        const numCharacters = Math.min(surname.length, Math.floor(Math.random() * 4) + 1);
        username += surname.slice(0, numCharacters);
    }

    username = username.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '').toLowerCase();
    document.getElementById("username").value = username;
    document.getElementById("usernamesixchar").value = username.substring(0, 6);

    document.getElementById("username").select();
    document.execCommand("copy");
}

let isTheme1 = false;

function changeTheme() {
    const theme1 = {
        '--bg-color': 'linear-gradient(to bottom right, rgb(20, 20, 20), rgb(3, 0, 15))',
        '--card-color': 'rgb(23, 23, 23)',
        '--title-color': 'rgb(214, 211, 230)',
        '--text-color': 'rgb(227, 225, 237)',
        '--border-color': 'rgba(255, 255, 255, 0.1)'
    };
    const theme2 = {
        '--bg-color': 'linear-gradient(to bottom right, rgb(255, 255, 255), rgb(242, 242, 242))',
        '--card-color': 'rgb(240, 240, 240)',
        '--title-color': 'rgb(33, 33, 33)',
        '--text-color': 'rgb(26, 26, 26)',
        '--border-color': 'rgba(0, 0, 0, 0.1)'
    };

    const theme = isTheme1 ? theme1 : theme2;
    Object.keys(theme).forEach(key => document.documentElement.style.setProperty(key, theme[key]));
    isTheme1 = !isTheme1;
}

function testDate() {
    var inputDate = document.getElementById("testdate").value;
    var [year, month, day] = inputDate.split('-');
    var dateTime = `${day}/${month}/${year}`;

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        alert("Not a valid date!");
    } else {
        alert(dateTime);
    }
}
