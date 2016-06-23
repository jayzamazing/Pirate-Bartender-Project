$(document).ready(function() {
    var Jack, TheDrunkenPirate; //variable declarations
    //get data from json file and pass callback
    getQuestionsIngredients(getDataCallback);
    /*
     * Callback function that gets called after ajax get request is done getting the data.
     * @param data - data returned from ajax called
     */
    function getDataCallback(data) {
        Jack = new Bartender(data.questions);
        TheDrunkenPirate = new Pantry(data.ingredients);
        setTemplate();
    }
    /*
     *
     */
    function setTemplate() {
        var key = Object.keys(Jack.getQuestion(Jack.getQuestionNumber()));
        var currentQuestion = Jack.getQuestion(Jack.getQuestionNumber())[key];
        var types = TheDrunkenPirate.getIngredientType(key);
        var source = $("#question-template").html();
        var template = Handlebars.compile(source);
        var context = {
            drink_question: currentQuestion,
            answer1: types[0],
            answer2: types[1],
            answer3: types[2]
        };
        var html = template(context);
        $('.question-section').html(html);
    }
    /*
     * Function to handle submit form
     */
    $('.question-section').on('submit', '#question-form', function(event) {
        event.preventDefault();
        if (Jack.getQuestionNumber() < (Jack.listOfQuestions.length)) {
            var genreChecked = $('.answer-choices input:checked').val();
            Jack.setQuestionNumber();
            if (Jack.getQuestionNumber() !== (Jack.listOfQuestions.length)) {
                setTemplate();
            } else {

            }
        }
    });
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
    function Pantry(list) {
        Ingredients.call(this, list);
        this.ingredientListNumber = 0;
    }
    //subclass extending superclass
    Pantry.prototype = Object.create(Ingredients.prototype);
    Pantry.prototype.contructor = Pantry;
    /*
     * Getter and setter functions for ingredient number
     */
    Pantry.prototype.getIngredientListNumber = function() {
        return this.ingredientListNumber;
    };
    Pantry.prototype.setIngredientListNumber = function() {
        this.ingredientListNumber++;
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
});
