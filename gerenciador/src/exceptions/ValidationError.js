module.exports = function ValidationErrors(message, status) {
    this.name = 'ValidationError';
    this.message = message;
    this.status = status || 400;
} ;
