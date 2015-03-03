/**
 * @class This is where core game functionality should be placed
 * @author Oscar Jara [oscar_e24@hotmail.com]
 */
 
// Game constants
var GAME_WORDS = { // List of categories and words for each one.
        sports : ['football', 'baseball', 'tennis', 'basketball'],
        movies : ['spiderman', 'jobs', 'tesis', 'birdman'],
        fruits : ['apple','orange','banana','lime','mango', 
                'cherry','grape','pear','pineapple','kiwi', 
                'plum','watermelon','peach','blueberry', 
                'coconut','cherimoya','passionfruit'],
        colors : ['red', 'green', 'blue', 'black']
    }, 
    GAME_MASKED_WORD = '', // Stores the masked word to be discovered
    GAME_SELECTED_WORD = '', // Stores the readable word
    GAME_PLAYER_ATTEMPTS = 0, // Stores player attempts when failing
    GAME_RANDOM_NUMBER = 0, // Random number to pick a word
    GAME_MAX_ATTEMPTS = 7, // Max. player attempts before a game over
    GAME_CATEGORY = '', // Stores the value for selected category
    GAME_UI_COMPONENTS = { // UI components declaration
        start: $('#start'), 
        reset: $('#reset'), 
        back: $('#back'), 
        guess: $('#guess'), 
        msg: $('#msg'), 
        word: $('#word'), 
        letter: $('#letter'),
        category: $('#category'),
        labelcategory: $('#category_selected')
    }, 
    GAME_UI_SECTIONS = { // UI sections declaration
        menu: $('#menu'), 
        game: $('#game'),
        msg: $('#msg')
    };

$(function() {;
    var ui = GAME_UI_COMPONENTS;
    
    // Initialize game
    init();
    
    // Start button handler
    ui.start.on('click', function(e) {
        start();
    });

    // Guess button handler
    ui.guess.on('click', function(e) {
        guess();
    });
    
    // Guess enter key handler
    ui.letter.keypress(function(e) {
        if (e.which == 13) {
            guess();
        }
    }); 

    // Play Again button handler
    ui.reset.on('click', function(e) {
        reset();
        start();
    });
    
    // Go Back button handler
    ui.back.on('click', function(e) {
        init();
    });
});

/**
 * Used to initialize the game for first time
 */
function init() {
    var sections = GAME_UI_SECTIONS;
    sections.menu.show();
    sections.game.hide();
    populateCategory();
    reset();
};

/**
 * Used to start the game
 */
function start() {
    var ui = GAME_UI_COMPONENTS, 
        sections = GAME_UI_SECTIONS;

    GAME_CATEGORY = ui.category.val();
    
    // Get list of the words for selected category
    var words = GAME_WORDS[GAME_CATEGORY];

    // Check category's option selected
    if ( GAME_CATEGORY == 0 ) {
        showMsg(' You need to select a category ;) ');
        
    } else {
        // Show category selected
        ui.labelcategory.html(GAME_CATEGORY.toUpperCase());
        
        sections.menu.hide();
        sections.game.show();
        
        GAME_RANDOM_NUMBER = Math.floor(Math.random() * words.length);
        
        for (var i = 0; i < words[GAME_RANDOM_NUMBER].length; ++i) {
            GAME_MASKED_WORD += '*';
        }
        
        GAME_SELECTED_WORD = words[GAME_RANDOM_NUMBER];
    
        ui.word.html(GAME_MASKED_WORD);
        ui.letter.focus();
        
        showMsg('');
    }    
};

/**
 * Guess button handler
 */
function guess() {
    
    var ui = GAME_UI_COMPONENTS, 
        words = GAME_WORDS[GAME_CATEGORY], 
        matches = false, 
        choice;

    // Clean messages each time player do a guess
    showMsg('');
    
    if (ui.letter && ui.letter.val()) {
        ui.letter.select();
        choice = $.trim(ui.letter.val().toLowerCase());
    }
    
    if (choice) {
        for (var i = 0; i < GAME_MASKED_WORD.length; ++i) {
            if (words[GAME_RANDOM_NUMBER].charAt(i) === choice) {
                GAME_MASKED_WORD = GAME_MASKED_WORD.substr(0, i) + choice + 
                    GAME_MASKED_WORD.substr(i + 1);
                matches = true;
            }
        }
        
        if (!matches) {
            ++GAME_PLAYER_ATTEMPTS;
        }
    } else {
        showMsg('Don\'t forget to type a letter!');
    }
    
    // Show attempts left if more than zero
    if (GAME_PLAYER_ATTEMPTS > 0) {
        showMsg('You have ' + 
                (GAME_MAX_ATTEMPTS - GAME_PLAYER_ATTEMPTS) + 
                ' attempt(s) left!');
    }
    
    // Check game status each time doing a guess
    if (isGameOver()) {
        lose();
    } else if (isGameWin()) {
        win();
    } else {
        ui.word.html(GAME_MASKED_WORD);
    }
    
    ui.letter.focus();
};

/**
 * Used to set all game variables from the scratch
 */
function reset() {
    var ui = GAME_UI_COMPONENTS;
    GAME_MASKED_WORD = '';
    GAME_PLAYER_ATTEMPTS = 0; 
    GAME_RANDOM_NUMBER = 0;
    showMsg('');
    ui.guess.show();
    ui.letter.val('');
    ui.word.html('');
};

/**
 * Used to populate all categories into 'select' item.
 */
function populateCategory() {
    var ui = GAME_UI_COMPONENTS;
    $.each(GAME_WORDS, function(key) {  
        ui.category
            .append($('<option></option>')
            .attr("value",key)
            .text(key)); 
    });
}

/**
 * Handler when player lose the game
 */
function lose() {
    var ui = GAME_UI_COMPONENTS;
    showMsg('You Lose! :(');
    ui.word.html(GAME_SELECTED_WORD);
    ui.guess.hide();
    ui.letter.val('');
};

/**
 * Handler when player win the game
 */
function win() {
    var ui = GAME_UI_COMPONENTS;
    showMsg('You Win! :)');
    ui.word.html(GAME_SELECTED_WORD);
    ui.guess.hide();
    ui.letter.val('');
};

/**
 * Use to print UI messages for the player
 */
function showMsg(msg) {
    var ui = GAME_UI_COMPONENTS;
    ui.msg.html(msg);
};

/**
 * Check game status, if player is going to lose the game
 * @returns {Boolean}
 */
function isGameOver() {
    return (GAME_PLAYER_ATTEMPTS >= GAME_MAX_ATTEMPTS);
};

/**
 * Check game status, if player is going to win the game
 * @returns {Boolean}
 */
function isGameWin() {
    return (GAME_MASKED_WORD === GAME_SELECTED_WORD);
};
