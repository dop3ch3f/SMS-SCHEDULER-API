class RepositoryResponse {
    constructor(repository = null, status = false, message = null, data = null, error = null, action = null) {
        this.error = error;
        this.repository = repository;
        this.message = message;
        this.data = data;
        this.action = action;
        this.status = status;
    }

    getError() { return this.error };

    getRepository() { return this.repository };

    getMessage() { return this.message };

    getData() { return this.data };

    getAction() { return this.action };
}

module.exports = RepositoryResponse;
