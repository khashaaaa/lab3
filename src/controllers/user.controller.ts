import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { validateCreateUser, validateUpdateUser } from '../utils/validators';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({ data: users });
        } catch (error) {
            next(error);
        }
    };

    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            res.status(200).json({ data: user });
        } catch (error) {
            next(error);
        }
    };

    createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData = validateCreateUser(req.body);
            const newUser = await this.userService.createUser(userData);
            res.status(201).json({ data: newUser });
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const userData = validateUpdateUser(req.body);
            const updatedUser = await this.userService.updateUser(id, userData);
            res.status(200).json({ data: updatedUser });
        } catch (error) {
            next(error);
        }
    };

    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    setupBenchmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { count = 1000 } = req.body;

            await this.userService.clearAllUsers();

            const sampleUsers = [
                { name: 'Test User 1', email: 'test1@example.com' },
                { name: 'Test User 2', email: 'test2@example.com' },
                { name: 'Test User 3', email: 'test3@example.com' },
            ];

            await this.userService.bulkCreateUsers(sampleUsers, count);

            res.status(200).json({ message: `Benchmark setup complete with ${count} users` });
        } catch (error) {
            next(error);
        }
    };
}