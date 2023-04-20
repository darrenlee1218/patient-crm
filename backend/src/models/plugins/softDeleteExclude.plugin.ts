import mongoose from "mongoose";

export type TWithSoftDeleted = {
  isDeleted: boolean;
  deletedAt: Date | null;
};

type TDocument = TWithSoftDeleted & mongoose.Document;

const excludeDeletedItems = (schema: mongoose.Schema) => {
  schema.add({
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  const excludeInFindQueriesIsDeleted = async function (
    this: mongoose.Query<any, TDocument>,
    next: (err?: Error) => void
  ) {
    this.where({
      $or: [
        {
          isDeleted: false,
        },
        {
          isDeleted: undefined,
        },
      ],
    });
    next();
  };

  const excludeInDeletedInAggregateMiddleware = async function (
    this: mongoose.Aggregate<any>,
    next: (err?: Error) => void
  ) {
    this.pipeline().unshift({
      $match: {
        $or: [
          {
            isDeleted: false,
          },
          {
            isDeleted: undefined,
          },
        ],
      },
    });
    next();
  };

  schema.pre("find", excludeInFindQueriesIsDeleted);
  schema.pre("findOne", excludeInFindQueriesIsDeleted);
  schema.pre("update", excludeInFindQueriesIsDeleted);
  schema.pre("updateOne", excludeInFindQueriesIsDeleted);
  schema.pre("count", excludeInFindQueriesIsDeleted);
  schema.pre("countDocuments", excludeInFindQueriesIsDeleted);

  schema.pre("aggregate", excludeInDeletedInAggregateMiddleware);
};

export { excludeDeletedItems };
