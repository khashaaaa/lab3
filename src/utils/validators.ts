import Joi from 'joi';
import { CreateUserDto, UpdateUserDto } from '../models/user.model';

export const validateCreateUser = (data: any): CreateUserDto => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required()
    });

    const { error, value } = schema.validate(data);
    if (error) throw new Error(`Validation error: ${error.message}`);

    return value;
};

export const validateUpdateUser = (data: any): UpdateUserDto => {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email()
    });

    const { error, value } = schema.validate(data);
    if (error) throw new Error(`Validation error: ${error.message}`);

    return value;
};