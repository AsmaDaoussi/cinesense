import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../libs/db';
import { User } from './User';

export interface InteractionAttributes {
  id: string;
  userId: string;
  titleId: number;
  kind: 'like' | 'rate' | 'watchlist';
  rating?: number | null;
  createdAt?: Date; updatedAt?: Date;
}
type InteractionCreation = Optional<InteractionAttributes, 'id'>;

export class Interaction extends Model<InteractionAttributes, InteractionCreation> implements InteractionAttributes {
  public id!: string;
  public userId!: string;
  public titleId!: number;
  public kind!: 'like' | 'rate' | 'watchlist';
  public rating!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Interaction.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  titleId: { type: DataTypes.INTEGER, allowNull: false },
  kind: { type: DataTypes.ENUM('like','rate','watchlist'), allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: true, validate: { min:0, max:10 } }
}, {
  sequelize, tableName: 'interactions',
  indexes: [{ unique: true, fields: ['userId','titleId','kind'] }]
});

User.hasMany(Interaction, { foreignKey: 'userId', as: 'interactions' });
Interaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
