import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../libs/db';

export interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}
type UserCreation = Optional<UserAttributes, 'id'>;

export class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING(255), allowNull: false }
}, { sequelize, tableName: 'users' });
