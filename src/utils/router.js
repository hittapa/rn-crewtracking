export function route(name, params = {}) {
    Object.keys(params).map(param => {
        name = name.replace(param, params[param]);
    });

    return name;
}