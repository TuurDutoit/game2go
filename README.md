Game2Go
=======

Game2go is a simple, but very fast 2d sidescroller engine, written in javascript. In just a few lines of code, you can create a basic game.


###Let's start
1. To begin, get the engine. This is just a .js file that you can find [here][1]. Put in a folder somewhere on your computer.

2. Then, make a game.html file. This will contain the `canvas` element and controls, a title, and it will import the javascript.
Here's a simple template:
    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <title>Game2Go test</title>
            <script type="text/javascript" src="game2go.js"></script>
            <script type="text/javascript" src="world.js"></script>
        </head>
        <body>
            <h1>Game2Go test game</h1>
            <canvas id="game-canvas"></canvas>
            <button onclick="game.start()">Start!</button>
            <button onclick="game.stop()">Stop</button>
            <script type="text/javascript" src="game.js"></script>
        </body>
    </html>
    ```
    This snippet assumes that the game2go.js file you just downloaded, a game.js file (which will hold the game code) and a world.js file (which will define our world) are located in the same folder as your .html file. If you put your files somewhere else, change the paths accordingly. In the next steps, we will be creating the game.js and world.js files.

3. Make a game.js file in the same folder as the game.html file, and put this code inside it:
    ```javascript
    var canvas = document.getElementById("game-canvas");
    var options = {speed: 5};
    var game = new Game(canvas, options);
    game.load(world);
    ```
    In this snippet, we create get the `canvas` node from the DOM, define some options, and create a new Game, which is stored in the `game` variable. Can you guess what the Start and Stop buttons do in the HTML?
On the last line, we load in the world that we will define in the world.js file in the newt step.

4. Make a world.js file in the same folder as the game.html file. You can put this code inside it:
    ```javascript
    //Define some blocks
    var Blocks = {
        earth: function(d) {
            d.fillStyle("A52A2A").fillRect(0, 0, 20, 20);
        },
        sand: function(d) {
            d.fillStyle("#EDC9AF").fillRect(0, 0, 20, 20);
        },
        water: function(d) {
            d.fillStyle("CEDFEF").fillRect(0, 0, 20, 20);
        }
    };
    
    //Create a world
    var world = [ //world
        [ //scene 1
            [ //column 1
                Blocks.earth,
                Blocks.earth
            ],
            [
                Blocks.sand
            ],
            [
                Blocks.sand
            ],
            [
                Blocks.water
            ],
            [
                Blocks.sand
            ]
        ]
    ];
    ```
    In this example, we create a `Blocks` variable, which contains some basic blocks.  Then, we pass in those blocks in the `World` variable, which is being loaded into the game in the previous snippet.

So, This was just a basic intro to the engine, I will try to add some more documentation later on, when the API is a little more mature. Keep updated!



###TODO

We'll try to keep this up-to-date, but we aren't perfect :smiley:. For a more up-to-date version, check the issue tracker, [on Github
][2]
- [ ] Collisions for objects
  - [x] Add .updateObjectColliders()
  - [ ] Think of a way to easily implement collisions for object (and their respective consequences/callbacks)
  - [ ] Implement that
- [ ] Better positioning of Player
  - [ ] Think about most easy, clear and semantic way of position the game and the player
  - [ ] Implement that concept
- [ ] Animations / Frames
  - [ ] Add an Animation class
  - [ ] Add a Frame class
  - [ ] Add .saveAnimation()
- [ ] Sprites
  - [ ] Research image clipping with canvas
  - [ ] Create a Sprite class
  - [ ] Add .saveSprite()
- [ ] Add/Remove/Hide Blocks/Objects/Backgrounds/Foregrounds
  - [ ] Add Object
  - [ ] Remove Object
  - [ ] Hide Object
  - [ ] Add Block
  - [ ] Remove Block
  - [ ] Hide Block
  - [ ] Add Background
  - [ ] Remove Background
  - [ ] Hide Background
  - [ ] Add Foreground
  - [ ] Remove Foreground
  - [ ] Hide Foreground
- [ ] Static (relative to canvas) Objects/Backgrounds/Foregrounds
  - [ ] Objects
  - [ ] Backgrounds
  - [ ] Foregrounds



[1]: https://raw.githubusercontent.com/TuurDutoit/game2go/master/src/game2go.js
[2]: https://github.com/TuurDutoit/game2go/issues
