class RepositoryResponse {
    constructor(repository = null, status = false, message = null, data = null, error = null, action = null) {
        this.error = error;
        this.repository = repository;
        this.message = message;
        this.data = data;
        this.action = action;
        this.status = status;
    }

    getError = () => this.error;

    getRepository = () => this.repository;

    getMessage = () => this.message;

    getData = () => this.data;

    getAction =() => this.action;
}

module.exports = RepositoryResponse;
