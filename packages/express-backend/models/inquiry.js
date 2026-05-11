import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
      },
    petId: {
      type: String,
      trim: true,
    },
    petName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    housing: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "approved", "rejected"],
      default: "new"
    },
  },
  {
    collection: "inquiries",
    // These two lines are CRITICAL: they tell Mongoose to include
    // virtuals (like our new 'id') whenever data is sent to the Frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


const Inquiry = mongoose.model("Inquiry", InquirySchema);

export default Inquiry;
