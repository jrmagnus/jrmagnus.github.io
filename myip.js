// Function to get IPv4 address
function getIPv4() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ipv4').textContent = data.ip;
        })
        .catch(error => {
            document.getElementById('ipv4').textContent = 'Error fetching IPv4';
            console.error('Error fetching IPv4:', error);
        });
}

// Function to get IPv6 address
function getIPv6() {
    fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ipv6').textContent = data.ip;
        })
        .catch(error => {
            document.getElementById('ipv6').textContent = 'Error fetching IPv6';
            console.error('Error fetching IPv6:', error);
        });
}

// Call functions to get IP addresses
getIPv4();
getIPv6();
