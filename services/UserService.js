const bcrypt = require('bcrypt');
const { makeConnection } = require('../config/db.config');
const UserRepository = require('../repositories/UserRepository');

class UserService {
    constructor() {
        this.db = null;
        this.userRepository = null;
        this.initialized = false;
    }

    async init() {
        if (!this.initialized) {
            this.db = await makeConnection();
            this.userRepository = new UserRepository(this.db.users);
            this.initialized = true;
        }
    }

    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async withInitialization(fn, ...args) {
        await this.init();
        return fn(...args);
    }

    async paginated({ search, sortField, sortOrder, page, pageSize, filterBy }) {
        return this.withInitialization(async () => {
            const users = await this.userRepository.paginated({
                search, sortField, sortOrder, page, pageSize, filterBy
            });
            return users;
        });
    }

    async create(userData) {
        return this.withInitialization(async () => {
            const newUser = await this.userRepository.create({
                email: userData.email.toLowerCase(),
                first_name: userData.first_name,
                last_name: userData.last_name,
                password: await this.hashPassword(userData.password),
            });
            return newUser;
        });
    }

    async show(userId) {
        return await this.withInitialization(async () => {
            const user = await this.userRepository.show(userId);
            return user;
        });
    }
    

    async update(userId, { email, first_name, last_name }) {
        return this.withInitialization(async () => {
            const user = await this.userRepository.update(userId, { email, first_name, last_name });
            return user;
        });
    }

    async deactivate(user_id) {
        return this.withInitialization(async () => {
            return await this.userRepository.deactivate(user_id);
        });
    }

    async delete(user_id) {
        return this.withInitialization(async () => {
            return await this.userRepository.delete(user_id);
        });
    }

    async activate(user_id) {
        return this.withInitialization(async () => {
            return await this.userRepository.activate(user_id);
        });
    }
}

module.exports = new UserService();