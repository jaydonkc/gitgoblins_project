export type PetStatus = "available" | "pending" | "adopted";

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  size: string;
  energyLevel: string;
  location: string;
  description: string;
  compatibility: string[];
  health: string;
  adoptionFee: number;
  shelterName: string;
  shelterEmail: string;
  imageUrls: string[];
  status: PetStatus;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  petId: string;
  petName: string;
  name: string;
  email: string;
  phone: string;
  housing: string;
  message: string;
  status: "new" | "contacted" | "approved" | "rejected";
  createdAt: string;
};
