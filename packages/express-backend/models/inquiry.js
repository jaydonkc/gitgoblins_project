import mongoose from "mongoose";

const inquiryStatuses = ["new", "contacted", "approved", "rejected"];

const InquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Pet"
    },
    name: {
      type: String,
      required() {
        return !this.user;
      },
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      required() {
        return !this.user;
      },
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    housing: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    status: {
      type: String,
      enum: inquiryStatuses,
      default: "new"
    }
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
