module.exports = class {
    constructor(chrome) {
        this.storage = chrome.storage.sync;
    }

    async set(object) {
        return await this.storage.set(object);
    }

    async remove(string) {
        return await this.storage.remove(string)
    }

    async get(string) {
        return await this.storage.get(string);
    }

    async clear() {
        return await this.storage.clear();
    }
}