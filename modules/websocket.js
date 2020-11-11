const http = require('http');
const https = require('https');

const credentials = require('../../../scripts/all/credentials');
const httpServer = http.createServer();
const httpsServer = https.createServer(credentials);

const WebSocket = require('ws');
const httpWss = new WebSocket.Server({ server: httpServer });
const httpsWss = new WebSocket.Server({ server: httpsServer });

const simulationController = require('../scripts/private/simulation/controller');
const simulationData = require('../scripts/private/data/simulation');
const $Classes = require('../scripts/public/class-definitions/classes');

httpWss.on('connection', OnConnect);
httpsWss.on('connection', OnConnect);

//Start the http server; port is 1000 + 80 + 1 per level of development removed
httpServer.listen(1080, () => {
    console.log(`Server started on port ${httpServer.address().port} :)`);
});

//Start the https server; port is 1000 + 443 + 1 per level of development removed
httpsServer.listen(1443, () => {
    console.log(`Server started on port ${httpsServer.address().port} :)`);
});

//Called when the http(s) server receives a websocket connection from a client
function OnConnect(ws) {
    //Watch for messages from the client
    ws.on('message', OnMessage);

    //Create an EncodedMessageHandler; it handles objects received in messages
    var messageHandler = new $Classes.EncodedMessageHandler();

    /**
     * Handles SimulationRequests received by the client
     * @param {import('../../../../scripts/warframe-beta/public/class-definitions/classes').SimulationRequest} request 
     */
    async function $_receiveSimulationRequest(request) {
        //Fetch settings
        var type = request.Settings.Type;
        var accuracy = request.Settings.Accuracy;
        var headshot = request.Settings.Headshot;

        //If the simulation is ranked, use the default simulation values
        //TODO: Remove these as constants and put them somewhere higher up, where they will be inserted into the HTML directly, and referenced here, to prevent inconsistencies should only one be updated
        if (type == 'Ranked') {
            accuracy = 0.9;
            headshot = 0.5;
        }

        //Fetch the weapon object being simulated
        /** @type {import('../../../../scripts/warframe-beta/public/class-definitions/classes').Weapon} */
        var weapon = await simulationData.GetWeaponById(request.Weapon.Name);
        //Fill in mods
        for (var m = 0; m < request.Weapon.Mods.length; m++)
        {
            weapon.SetMod(m, await simulationData.GetModById(request.Weapon.Mods[m]));
        }

        //Fetch the first enemy being simulated
        /** @type {import('../../../../scripts/warframe-beta/public/class-definitions/classes').Enemy} */
        var enemy1 = null;
        if (request.Enemy1 != null) {
            enemy1 = await simulationData.GetEnemyById(request.Enemy1.Name);
            enemy1.SetLevel(request.Enemy1.Level);
        }

        //Fetch the second enemy being simulated
        /** @type {import('../../../../scripts/warframe-beta/public/class-definitions/classes').Enemy} */
        var enemy2 = null;
        if (request.Enemy2 != null) {
            enemy2 = await simulationData.GetEnemyById(request.Enemy2.Name);
            enemy2.SetLevel(request.Enemy2.Level);
        }

        //Fetch the third enemy being simulated
        /** @type {import('../../../../scripts/warframe-beta/public/class-definitions/classes').Enemy} */
        var enemy3 = null;
        if (request.Enemy3 != null) {
            enemy3 = await simulationData.GetEnemyById(request.Enemy3.Name);
            enemy3.SetLevel(request.Enemy3.Level);
        }

        //Fetch the fourth enemy being simulated
        /** @type {import('../../../../scripts/warframe-beta/public/class-definitions/classes').Enemy} */
        var enemy4 = null;
        if (request.Enemy4 != null) {
            enemy4 = await simulationData.GetEnemyById(request.Enemy4.Name);
            enemy4.SetLevel(request.Enemy4.Level);
        }

        //Set the weapon's firing mode (SEMI, AUTO, etc.)
        for (var f = 0; f < weapon.FiringModes.length; f++)
        {
            /** @type {import('../../../../scripts/warframe-beta/public/class-definitions/classes').WeaponFiringMode} */
            var firingMode = weapon.FiringModes[f];
            if (firingMode.UrlName == request.Weapon.FiringMode) {
                weapon.SetFiringMode(f);
                break;
            }
        }

        //If the weapon has Kuva variables, use them
        if (request.AdditionalSettingsVariables.KuvaElement != undefined && request.AdditionalSettingsVariables.KuvaBonus != undefined) {
            weapon.AddRelativeBaseDamage(request.AdditionalSettingsVariables.KuvaElement, request.AdditionalSettingsVariables.KuvaBonus/100);
        }

        //Queue a simulation with the filled message handler (filled below this function)
        simulationController.QueueSimulation(messageHandler, weapon, enemy1, enemy2, enemy3, enemy4, type, accuracy, headshot, request.AdditionalSettingsVariables);
        //If not a ranked simulation, queue one up and run it as well
        if (type != 'Ranked') {
            //Worth noting an empty message handler is used; client does not need info on this one
            var emptyMessageHandler = new $Classes.EncodedMessageHandler()
                .CreateHandle($Classes.SimulationRequest.name, function(obj) {})
                .CreateHandle($Classes.SimulationProgress.name, function(obj) {})
                .CreateHandle($Classes.Metrics.name, function(obj) {})
                .CreateHandle($Classes.SimulationError.name, function(obj) {});

            simulationController.QueueSimulation(emptyMessageHandler, weapon, enemy1, enemy2, enemy3, enemy4, 'Ranked', accuracy, headshot, request.AdditionalSettingsVariables);
        }
    }

    /**
     * Handles SimulationProgress received by the thread
     * @param {import('./scripts/warframe-beta/class-definitions/public/classes').SimulationProgress} progress 
     */
    function $_receiveSimulationProgress(progress) {
        //Encode it in a message
        var message = new $Classes.EncodedMessage()
            .Encode(progress)
            .ToString();

        //Send it to the client
        ws.send(message);
    }

    /**
     * Handles Metrics received by the thread
     * @param {import('../../../../scripts/warframe-beta/public/class-definitions/classes').Metrics} metrics 
     */
    function $_receiveSimulationResults(metrics) {
        //Encode it in a message
        var message = new $Classes.EncodedMessage()
            .Encode(metrics)
            .ToString();

        //Send it to the client
        ws.send(message);
    }

    /**
     * 
     * @param {import('../../../../scripts/warframe-beta/public/class-definitions/classes').SimulationError} error 
     */
    function $_receiveSimulationError(error) {
        //Encode it in a message
        var message = new $Classes.EncodedMessage()
            .Encode(error)
            .ToString();

        //Send it to the client
        ws.send(message);
    }

    //Create handlers for each of the object types above, and pass the handler callbacks
    messageHandler.CreateHandle($Classes.SimulationRequest.name, $_receiveSimulationRequest);
    messageHandler.CreateHandle($Classes.SimulationProgress.name, $_receiveSimulationProgress);
    messageHandler.CreateHandle($Classes.Metrics.name, $_receiveSimulationResults);
    messageHandler.CreateHandle($Classes.SimulationError.name, $_receiveSimulationError);

    /**
     * Called when the client sends a websocket message
     * @param {string} message 
     */
    function OnMessage(message) {
        console.log('received: %s', message, typeof(message));

        //Parse the object from the message
        var encodedMessage = JSON.parse(message);

        //Give it to the EncodedMessageHandler to handle the object
        messageHandler.DoHandle(encodedMessage);
    }
}