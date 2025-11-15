import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../libs/db";
import { User } from "./User";

export interface InteractionBehaviorAttrs {
  id: number;
  userId: string;      // UUID
  movieId: number;

  type:
    | "view"
    | "scroll"
    | "favorite_add"
    | "favorite_remove"
    | "watchlist_add"
    | "watchlist_remove"
    | "trailer_play"
    | "reco_click";

  dwellSeconds?: number | null;
  scrollDepthPct?: number | null;
  trailerWatchSeconds?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export class InteractionBehavior extends Model<InteractionBehaviorAttrs>
  implements InteractionBehaviorAttrs {
  public id!: number;
  public userId!: string;
  public movieId!: number;
  public type!: InteractionBehaviorAttrs["type"];
  public dwellSeconds!: number | null;
  public scrollDepthPct!: number | null;
  public trailerWatchSeconds!: number | null;
}

InteractionBehavior.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    movieId: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM(
        "view",
        "scroll",
        "favorite_add",
        "favorite_remove",
        "watchlist_add",
        "watchlist_remove",
        "trailer_play",
        "reco_click"
      ),
      allowNull: false,
    },
    dwellSeconds: { type: DataTypes.INTEGER, allowNull: true },
    scrollDepthPct: { type: DataTypes.INTEGER, allowNull: true },
    trailerWatchSeconds: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: "interaction_behavior" }
);

User.hasMany(InteractionBehavior, { foreignKey: "userId" });
InteractionBehavior.belongsTo(User, { foreignKey: "userId" });
