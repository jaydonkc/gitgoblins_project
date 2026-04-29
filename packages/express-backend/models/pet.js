import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: String,
      required: true,
      trim: true
    },
    linked_org: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      trim: true,
    }
  },
  {
    collection: "pets",
    // These two lines are CRITICAL: they tell Mongoose to include
    // virtuals (like our new 'id') whenever data is sent to the Frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// This creates a virtual "id" property that mirrors the MongoDB "_id"
PetSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Pet = mongoose.model("Pet", PetSchema);

export default Pet;
