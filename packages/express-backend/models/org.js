import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        //In the future, will want better email validation
        if (value.length < 2)
          throw new Error(
            "Invalid email, must be at least 2 characters."
          );
      }
    },
  },
  {
    collection: "orgs",
    // These two lines are CRITICAL: they tell Mongoose to include
    // virtuals (like our new 'id') whenever data is sent to the Frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// This creates a virtual "id" property that mirrors the MongoDB "_id"
OrganizationSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization;
