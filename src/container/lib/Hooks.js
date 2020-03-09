module.exports = function() {

    return function Hooks(name, filter) {
        if(arguments.length === 1) {
            return Hooks[name];
        }
        Hooks[name] = filter;
    };
};