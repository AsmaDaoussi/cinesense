import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../libs/db";
import { User } from "./User";

export interface InteractionAttributes {
  id: string;
  userId: string;
  titleId?: number | null;
  kind:
    | "open_movie"
    | "view"
    | "scroll"
    | "like"
    | "unlike"
    | "rate"
    | "watchlist_add"
    | "watchlist_remove"
    | "trailer"
    | "search_query"
    | "click_reco";
  value?: number | null;
  rating?: number | null;
  extra?: any | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type InteractionCreation = Optional<InteractionAttributes, "id">;

export class Interaction
  extends Model<InteractionAttributes, InteractionCreation>
  implements InteractionAttributes
{
  public id!: string;
  public userId!: string;
  public titleId!: number | null;
  public kind!: InteractionAttributes["kind"];
  public value!: number | null;
  public rating!: number | null;
  public extra!: any | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Interaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    titleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    kind: {
      type: DataTypes.ENUM(
        "open_movie",
        "view",
        "scroll",
        "like",
        "unlike",
        "rate",
        "watchlist_add",
        "watchlist_remove",
        "trailer",
        "search_query",
        "click_reco"
      ),
      allowNull: false,
    },

    value: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { min: 0, max: 10 },
    },

    extra: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "interactions",
    timestamps: true,
    indexes: [
      {
        fields: ["userId", "titleId"],
      },
    ],
  }
);

User.hasMany(Interaction, { foreignKey: "userId", as: "interactions" });
Interaction.belongsTo(User, { foreignKey: "userId", as: "user" });
