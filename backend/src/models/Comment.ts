import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../libs/db";
import { User } from "./User";

export interface CommentAttributes {
  id: string;
  userId: string;
  movieId: number;
  text: string;
  sentiment?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type CommentCreation = Optional<CommentAttributes, "id" | "sentiment">;

export class Comment
  extends Model<CommentAttributes, CommentCreation>
  implements CommentAttributes
{
  public id!: string;
  public userId!: string;
  public movieId!: number;
  public text!: string;
  public sentiment!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
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
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sentiment: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "comments",
    timestamps: true,
    indexes: [{ fields: ["movieId"] }, { fields: ["userId"] }],
  }
);

// associations
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
