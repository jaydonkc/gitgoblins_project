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
    species: {
      type: String,
      trim: true
    },
    breed: {
      type: String,
      trim: true
    },
    age: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: String,
      trim: true
    },
    energyLevel: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    compatibility: {
      type: [String],
      default: []
    },
    health: {
      type: String,
      trim: true
    },
    adoptionFee: {
      type: Number,
      default: 0
    },
    shelterName: {
      type: String,
      trim: true
    },
    shelterEmail: {
      type: String,
      trim: true
    },
    imageUrls: {
      type: [String],
      default: []
    },
    linked_org: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    availability: {
      type: String,
      enum: ["available", "pending", "adopted"],
      default: "available"
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
