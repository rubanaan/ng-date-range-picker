picker.service('pickerService',
function()
{
    //-- private variables
    let self      = this,
        callbacks = {};

    //-- public methods
    self.registerCallback = registerCallback;
    self.executeCallback  = executeCallback;

    /**
     * Sets a callback.
     * @param name
     * @param callback
     */
    function registerCallback (name, callback)
    {
        callbacks[name] = callback;
    }

    /**
     * Do a callback.
     * @param name
     * @param first
     * @param second
     */
    function executeCallback (name, first, second)
    {
        if (angular.isFunction(callbacks[name]))
        {
            let args = [].splice.call(arguments, 0);

            args.splice(0, 1);

            callbacks[name].apply(null, args);
        }
    }
});