import mongoose from "mongoose";

const SwipeSchema = new mongoose.Schema(
  {
    //Keep in mind that swiped = False means swiped left, rather than the user hasn't seen the pet.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    swiped: {
      type: Boolean,
      required: true,
    }
  },
  {
    collection: "swipes",
    // These two lines are CRITICAL: they tell Mongoose to include
    // virtuals (like our new 'id') whenever data is sent to the Frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// This creates a virtual "id" property that mirrors the MongoDB "_id"
SwipeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Swipe = mongoose.model("Swipe", SwipeSchema);

export default Swipe;
