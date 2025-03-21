import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';
import { InMemoryDB } from '../config/db.config';
import { AppError } from '../utils/error.handler';

export class UserService {
    private userDb: InMemoryDB<User>;

    constructor() {
        this.userDb = new InMemoryDB<User>();
    }

    async getAllUsers(): Promise<User[]> {
        return this.userDb.findAll();
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userDb.findById(id);
        if (!user) {
            throw new AppError(`User with id ${id} not found`, 404);
        }
        return user;
    }

    async createUser(userData: CreateUserDto): Promise<User> {
        const now = new Date();
        const newUser: User = {
            id: uuidv4(),
            ...userData,
            createdAt: now,
            updatedAt: now
        };

        return this.userDb.create(newUser);
    }

    async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
        const existingUser = await this.userDb.findById(id);
        if (!existingUser) {
            throw new AppError(`User with id ${id} not found`, 404);
        }

        const updatedUser: User = {
            ...existingUser,
            ...userData,
            updatedAt: new Date()
        };

        const result = await this.userDb.update(id, updatedUser);
        return result as User;
    }

    async deleteUser(id: string): Promise<void> {
        const deleted = await this.userDb.delete(id);
        if (!deleted) {
            throw new AppError(`User with id ${id} not found`, 404);
        }
    }

    async clearAllUsers(): Promise<void> {
        await this.userDb.clear();
    }

    async bulkCreateUsers(users: CreateUserDto[], count: number): Promise<void> {
        const now = new Date();
        const bulkUsers: User[] = [];

        for (let i = 0; i < count; i++) {
            const user = users[i % users.length];
            bulkUsers.push({
                id: uuidv4(),
                ...user,
                createdAt: now,
                updatedAt: now
            });
        }

        await this.userDb.bulkInsert(bulkUsers);
    }
}