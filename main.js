<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screeps Bot Main</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Screeps Bot Main</h1>
        
        <!-- Load essential modules -->
        <script src="src/constants.js"></script>
        <script src="src/managers/roomManager.js"></script>
        
        <!-- Application initialization -->
        <script>
            // Initialize the bot connection
            const bot = new ScreepsBot();
            
            // Connect to the server
            bot.connect("http://localhost:3000");
            
            // Start monitoring
            bot.on('update', update => {
                console.log(`Update received: ${JSON.stringify(update)}`);
            });
            
            // Handle disconnections
            bot.on('disconnect', () => {
                console.error('Disconnected from server');
            });
        </script>
    </div>
</body>
</html>