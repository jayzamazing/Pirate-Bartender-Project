$(document).ready(function() {
    //variable declarations
    var Jack, TheDrunkenPirate;
    //get data from json file and pass callback
    getQuestionsIngredients(getDataCallback);
    /*
     * Callback function that gets called after ajax get request is done getting the data.
     * @param data - data returned from ajax called
     */
    function getDataCallback(data) {
        //initialize bartender and pantry objects
        Jack = new Bartender(data.questions);
        TheDrunkenPirate = new Pantry(data.ingredients, data['drink adjective'], data['drink noun']);
        //set the template to use on the web page and fill with data
        setTemplate();
    }
    /*
     * Function to set up the question template, fill it with data, and display it
     */
    function setTemplate() {
        //data needed to fill template
        var key = Object.keys(Jack.getQuestion(Jack.getQuestionNumber()));
        var currentQuestion = Jack.getQuestion(Jack.getQuestionNumber())[key];
        var types = TheDrunkenPirate.getIngredientType(key);
        //template to use
        var source = $("#question-template").html();
        var template = Handlebars.compile(source);
        //fields to be filled in the template
        var context = {
            drink_question: currentQuestion,
            answer1: types[0],
            answer2: types[1],
            answer3: types[2]
        };
        //set the fields in the template
        var html = template(context);
        //add to the html
        $('.question-section').html(html);
    }
    /*
     * Function to ask the bartender for another drink, deals with showing your drink
     * and shows a button to ask for another drink
     */
    function setStartOver() {
        //template to use
        var source = $("#another-drink-template").html();
        var template = Handlebars.compile(source);
        //data to fill the template, uses randomnumber function to determine the drink adjective and noun
        var drinkName = TheDrunkenPirate.getDrinkAdjective(getRandomNumber(10)).concat(' ' + TheDrunkenPirate.getDrinkNoun(getRandomNumber(10)));
        //set the fields in the template
        var context = {
            drink: drinkName
        };
        //set the fields in the template
        var html = template(context);
        //add to the html
        $('.question-section').html(html);
    }
    /*
     * Function that deals with asking the user drink information
     * or asking if the user wants another drink
     */
    $('.question-section').on('submit', '#question-form', function(event) {
        //block page reload
        event.preventDefault();
        //only fire if option is selected
        if ($('input[name=options]:checked').val()) {
            //play yarrrr!
            playMusic('#music');
            //if the current question number is less than the total amount of questions
            if (Jack.getQuestionNumber() < (Jack.listOfQuestions.length)) {
                //increment question number
                Jack.setQuestionNumber();
                //if statement to stop if question number is now max
                if (Jack.getQuestionNumber() !== (Jack.listOfQuestions.length)) {
                    //set the question template
                    setTemplate();
                } else {
                    //show drink and as if you want more to drink
                    setStartOver();
                }
            }
        }
    });
    /*
     * Function to ask if you want another drink
     */
    $('.question-section').on('submit', '#another-drink-form', function(event) {
        //prevent page reload
        event.preventDefault();
        //play yarrrr!
        playMusic('#music');
        //if the objects exist
        if (Jack && TheDrunkenPirate) {
            //reset question number to 0
            Jack.resetQuestionNumber();
            //show the question template
            setTemplate();
        } else {
            //otherwise make ajax call to fill objects
            getQuestionsIngredients(getDataCallback);
        }
    });
    /*
     * Random number generator function
     */
    function getRandomNumber(number) {
        return parseInt(Math.random() * (number));
    }
    /*
     * Questions object to store questions
     * @param questions - list of questions
     */
    function Questions(questions) {
        this.listOfQuestions = questions;
    }
    /*
     * Function to return a specific question based on index
     * @param index - element to return
     * @return question string element
     */
    Questions.prototype = {
        getQuestion: function(index) {
            return this.listOfQuestions[index];
        }
    };
    /*
     * Bartender object that wraps Questions object
     * @param questions list to initialize questions
     */
    function Bartender(questions) {
        Questions.call(this, questions);
        this.questionNumber = 0;
    }
    //subclass extending superclass
    Bartender.prototype = Object.create(Questions.prototype);
    Bartender.prototype.contructor = Bartender;
    /*
     * Getter and setter functions for question and answers
     */
    Bartender.prototype.getQuestionNumber = function() {
        return this.questionNumber;
    };
    Bartender.prototype.setQuestionNumber = function() {
        this.questionNumber++;
    };
    //Reset question number for another round
    Bartender.prototype.resetQuestionNumber = function() {
        this.questionNumber = 0;
    };
    /*
     * Ingredients object to store list of ingredients
     * @param list - list of ingredients to store
     */
    function Ingredients(list) {
        this.listOfIngredients = list;
    }
    /*
     * Function to return an array of the specific type of ingredient
     * @param type - type to return ie. strong ingredients
     * @return array of type ie strong ingredients[]
     */
    Ingredients.prototype = {
        getIngredientType: function(type) {
            return this.listOfIngredients[type];
        }
    };
    /*
     * Pantry object that wraps ingredients object.
     * @param list of ingredients to initialize ingredients
     */
    function Pantry(list, drinkAdjective, drinkNoun) {
        Ingredients.call(this, list);
        this.drinkAdjective = drinkAdjective;
        this.drinkNoun = drinkNoun;
    }
    //subclass extending superclass
    Pantry.prototype = Object.create(Ingredients.prototype);
    Pantry.prototype.contructor = Pantry;
    //getter for drink adjective
    Pantry.prototype.getDrinkAdjective = function(index) {
        return this.drinkAdjective[index];
    };
    //getter for drink noun
    Pantry.prototype.getDrinkNoun = function(index) {
        return this.drinkNoun[index];
    };
    /*
     * Function to get the questions and ingredients from json file
     * @param callback - function to call once done is fired off
     */
    function getQuestionsIngredients(callback) {
        $.get("data/questionsandingredients.json", function(data) {
            console.log("got data");
        }).done(function(data) {
            if (typeof callback === 'function') { //check if callback is a function
                callback(data);
            }
        });
    }
    /*
     * Function to play music
     */
    function playMusic(music) {
        $(music)[0].volume = 0.5;
        $(music)[0].load();
        $(music)[0].play();
    }
});
