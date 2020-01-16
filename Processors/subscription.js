module.exports = function (job) {
    console.log(job.data);
    console.log(job.remove());
    return Promise.resolve();
}