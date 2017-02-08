import CheckoutViewModel from './models/CheckoutViewModel';
/**
 * Initial application setup. Runs once upon every page load.
 *
 * @class App
 * @constructor
 */
class App {

    constructor() {
    }

    /**
     * Initializes the application and kicks off loading of prerequisites.
     *
     * @method init
     * @public
     */
    init() {
        // Create your views here
        // console.log(`CheckoutViewModel`, new CheckoutViewModel().pickHowOptions);
        new CheckoutViewModel().pickHowOptions
    }

}

export default App;
