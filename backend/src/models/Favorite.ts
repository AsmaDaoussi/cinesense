import { DataTypes, Model, Optional } from "sequelize";
import {sequelize} from "../libs/db"; // ton instance
import { User } from "./User";

interface FavoriteAttrs {
  id: number;           // tu peux garder SERIAL ici, pas lié à la FK
  userId: string;       // <-- UUID en TS
  movieId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
type FavoriteCreationAttrs = Optional<FavoriteAttrs, "id" | "createdAt" | "updatedAt">;

export class Favorite extends Model<FavoriteAttrs, FavoriteCreationAttrs> implements FavoriteAttrs {
  public id!: number;
  public userId!: string;   // <-- string pour UUID
  public movieId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,          // ou DataTypes.BIGINT si tu veux
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,             // <-- type DB = UUID
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, tableName: "favorites" }
);

// Associations (dans models/index.ts ou ici)
User.hasMany(Favorite, { foreignKey: "userId" });
Favorite.belongsTo(User, { foreignKey: "userId" });
