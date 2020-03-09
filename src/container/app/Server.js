
module.exports = function({App}) {
    return App.listen(process.env.PORT || 8080);
};