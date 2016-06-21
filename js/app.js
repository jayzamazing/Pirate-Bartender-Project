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
        //example that this is working TODO - remove later
        console.log(Jack.getQuestion(1));
        console.log(TheDrunkenPirate.getIngredientType('strong ingredients'));
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
    }
    //subclass extending superclass
    Bartender.prototype = Object.create(Questions.prototype);
    Bartender.prototype.contructor = Bartender;
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
    }
    //subclass extending superclass
    Pantry.prototype = Object.create(Ingredients.prototype);
    Pantry.prototype.contructor = Pantry;
    /*
     * Function to get the questions and ingredients from json file
     * @param callback - function to call once done is fired off
     */
    function getQuestionsIngredients(callback) {
        $.get("data/questionsandingredients.json", function(data) {
            console.log("got data");
        }).done(function(data) {
            callback(data);
        });
    }
});
