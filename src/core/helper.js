export function getStatePath(params) {
    if (typeof params != 'object') params = [params];
    return params.join('.').toLowerCase();
}
