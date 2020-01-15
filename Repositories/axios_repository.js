// File to contain axios integration and usage

import axios from "axios";
import RepositoryResponse from "~/repositories/RepositoryResponse";
import { ErrorCodes, RepositoryTypes } from "~/utilities/enums";

export default class ApiRepository {
    constructor() {
        if (!this.$axios) {
            this.repository = "Api";
            this.$axios = axios.create({});
            this.setupInterceptors();
        }
    }

    setToken = (token) => {
        axios.defaults.headers.common.Authorization = token;
    };

    setupInterceptors = () => {
        this.$axios.interceptors.request.use(function (config) {
            // eslint-disable-next-line
            if (process.env.NODE_ENV !== "production") {
                console.log(`${config.method.toUpperCase()} Request made to ${config.url} with data: ${JSON.stringify(config.data) || null}`);
            }
            return config;
        }, function (err) {
            if (process.env.NODE_ENV !== "production") {
                console.log(err);
            }
            return new RepositoryResponse(RepositoryTypes.API, false, "Unable communicate with servers, check your network", null, ErrorCodes["A-500"], null);
        });

        return this.$axios.interceptors.response.use(function (response) {
            const { status, data, config } = response;
            if (process.env.NODE_ENV !== "production") {
                // eslint-disable-next-line
                console.log(`Response from ${config.url}:`, JSON.stringify({
                    code: status,
                    ...data
                }));
            }
            // sanitize response to fit into repository response format
            const responseData = { ...data };
            return new RepositoryResponse(RepositoryTypes.API, true, "Request Successful", { ...responseData } || null, data.error || null, null);
        }, function (err) {
            if (err.response) {
                const { status, data } = err.response;
                const newError = {
                    code: status,
                    ...data,
                };
                if (process.env.NODE_ENV === "production") {
                    switch (status) {
                        case 401:
                            return new RepositoryResponse(RepositoryTypes.API, false, "You are not authorized to perform this action", null, { ...data }, null);
                        case 403:
                            // return error({ statusCode: 403, message: "You are not allowed to perform this action" });
                            return new RepositoryResponse(RepositoryTypes.API, false, "You are not authorized to perform this action", null, { ...data }, null);
                        case 404:
                            // return error({ statusCode: 404, message: "Not found, try another" });

                            return new RepositoryResponse(RepositoryTypes.API, false, "Not found", null, { ...data }, null);
                        case 500:
                            // return error({ statusCode: 500, message: "We all have our bad days, we are working to resolve this" });
                            return new RepositoryResponse(RepositoryTypes.API, false, "An error occurred, please try again later", null, { ...data }, null);
                        default:
                            return new RepositoryResponse(RepositoryTypes.API, false, "An error occurred, please try again later", null, { ...data }, null);
                    }
                }

                // eslint-disable-next-line
                console.log(newError);
                return new RepositoryResponse(RepositoryTypes.API, false, "An error occurred, please try again later", null, { ...data }, null);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                // return Promise.reject(error({ statusCode: 500, message: "No network connection, Check your internet" }));
                return new RepositoryResponse(RepositoryTypes.API, false, "Unable communicate with servers, check your network", null, ErrorCodes["A-500"], null);
            } else {
                // Something happened in setting up the request that triggered an Error
                // return Promise.reject(error({ statusCode: 500, message: "No network connection, Check your internet" }));
                return null;
            }
        })
    };

    get = async (url) => {
        // eslint-disable-next-line no-return-await
        return await this.$axios.get(url);
    };

    post = async (url, body) => {
        // eslint-disable-next-line no-return-await
        return await this.$axios.post(url, body);
    };

    put = async (url, body) => {
        // eslint-disable-next-line no-return-await
        return await this.$axios.put(url, body);
    };

    delete = async (url) => {
        // eslint-disable-next-line no-return-await
        return await this.$axios.delete(url);
    };

    debouncedRequest = (config) => {
        let call;
        return (function (config, instance) {
            if (call) {
                call.cancel('Only one request allowed at a time');
            }
            call = this.$axios.CancelToken.source();

            config.cancelToken = call.token;
            return instance.$axios(config);
        }(config, this))
    };
}
