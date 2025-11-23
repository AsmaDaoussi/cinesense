import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../libs/db";
import { User } from "./User";

interface WatchlistAttrs {
  id: number;
  userId: string;     // UUID !
  movieId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
type WatchlistCreation = Optional<WatchlistAttrs, "id">;

export class Watchlist extends Model<WatchlistAttrs, WatchlistCreation> implements WatchlistAttrs {
  public id!: number;
  public userId!: string;
  public movieId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Watchlist.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    movieId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "watchlist", timestamps: true }
);

// Associations (si tu les utilises)
User.hasMany(Watchlist, { foreignKey: "userId" });
Watchlist.belongsTo(User, { foreignKey: "userId" });
