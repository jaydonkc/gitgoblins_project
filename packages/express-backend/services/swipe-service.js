//swipe-service.js
import swipeModel from "../models/swipe.js";

function addSwipe(swipe) {
  const swipeToAdd = new swipeModel(swipe);
  return swipeToAdd.save();
}

function getSwipes() {
  return swipeModel.find();
}

function removeSwipe(id) {
  return swipeModel.findByIdAndDelete(id);
}

function findSwipeById(id) {
  return swipeModel.findById(id);
}

export default {
  addSwipe,
  getSwipes,
  removeSwipe,
  findSwipeById
};
