module.exports = ({API})=> {

    return Endpoint('users', ModelEndpoint(UserModel))
        .only('get')
        .hooks(Hooks.view(UserView))
        .build(API);
};