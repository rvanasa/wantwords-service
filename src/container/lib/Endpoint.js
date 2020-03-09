module.exports = function() {
    class Service {
        constructor(name, methods, hooksArray) {
            this.name = name;
            this.methods = methods || {};
            this.hooksArray = hooksArray || [];
            this.listeners = [];
        }

        add(id, fn) {
            if(arguments.length === 1) {
                Object.assign(this.methods, id);
            }
            else {
                this.methods[id] = fn;
            }
            return this;
        }

        remove(...methods) {
            for(var id of methods) {
                this.methods[id] = null;
            }
            return this;
        }

        only(...methods) {
            for(var id of Object.keys(this.methods)) {
                if(!methods.includes(id)) {
                    this.remove(id);
                }
            }
            return this;
        }

        hooks(...hooks) {
            this.hooksArray.push(...hooks);
            return this;
        }

        on(...args) {
            this.listeners.push(args);
            return this;
        }

        build(api) {
            if(!Object.keys(this.methods).length) {
                throw new Error('Endpoint requires at least one method');
            }

            api.use(this.name, this.methods);
            var service = api.service(this.name);
            for(var hook of this.hooksArray) {
                service.hooks(hook);
            }
            for(var args of this.listeners) {
                service.on(...args);
            }
            return service;
        }
    }

    return (name, methods, filters) => new Service(name, methods, filters);
};