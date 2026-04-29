import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: true,
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
