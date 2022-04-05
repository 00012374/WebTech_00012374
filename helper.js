module.exports.uid = function () {
    return Math.random().toString(36).substr(2, 9) + '';
}

module.exports.categories = [
    { id: 0, title: 'Account management' },
    { id: 1, title: 'Payment issues' },
    { id: 2, title: 'Hosting issues' },
    { id: 3, title: 'Domain issues' },
]