const apiBaseUrl = "http://localhost:8000";
const testPassword = "TestPassword123!";

const pets = [
  {
    _id: "pet-maple",
    id: "pet-maple",
    name: "Maple",
    species: "Dog",
    type: "Dog",
    breed: "Terrier Mix",
    age: "3 years",
    size: "Small",
    energyLevel: "Medium",
    location: "San Luis Obispo, CA",
    description: "A steady demo pet for the adopter flow.",
    compatibility: ["Good with kids", "Apartment friendly"],
    health: "Vaccinated and microchipped",
    adoptionFee: 125,
    shelterName: "Story Shelter",
    shelterEmail: "story-shelter@example.com",
    ownerUsername: "story-shelter",
    imageUrls: ["/favicon.svg", "/favicon.svg"],
    availability: "available"
  },
  {
    _id: "pet-nova",
    id: "pet-nova",
    name: "Nova",
    species: "Cat",
    type: "Cat",
    size: "Small",
    energyLevel: "Low",
    ownerUsername: "other-shelter",
    imageUrls: ["/favicon.svg"],
    availability: "available"
  },
  {
    _id: "pet-river",
    id: "pet-river",
    name: "River",
    species: "Dog",
    type: "Dog",
    breed: "Lab Mix",
    age: "5 years",
    size: "Large",
    energyLevel: "High",
    ownerUsername: "story-shelter",
    imageUrls: ["/favicon.svg"],
    availability: "adopted"
  }
];

function inquiryFixtures() {
  return [
    {
      _id: "inquiry-alex",
      id: "inquiry-alex",
      pet: pets[0],
      name: "Alex Adopter",
      email: "alex@example.com",
      phone: "555-0101",
      housing: "Townhome with a fenced patio.",
      message: "I can visit this week.",
      status: "new",
      date: "2026-06-01T16:00:00.000Z"
    },
    {
      _id: "inquiry-blake",
      id: "inquiry-blake",
      pet: pets[0],
      name: "Blake Adopter",
      email: "blake@example.com",
      phone: "555-0102",
      housing: "House with another calm pet.",
      message: "I already submitted landlord approval.",
      status: "approved",
      date: "2026-06-02T16:00:00.000Z"
    }
  ];
}

function mockPets(nextPets = pets) {
  cy.intercept("GET", `${apiBaseUrl}/pets`, nextPets).as(
    "getPets"
  );
}

function mockAuth() {
  cy.intercept("POST", `${apiBaseUrl}/signup`, (req) => {
    req.reply({
      statusCode: 201,
      body: {
        token: `${req.body.role}-token`,
        role: req.body.role,
        username: req.body.username
      }
    });
  }).as("signup");

  cy.intercept("POST", `${apiBaseUrl}/login`, (req) => {
    const role = req.body.username.includes("shelter")
      ? "organization"
      : "adopter";
    req.reply({
      statusCode: 200,
      body: {
        token: `${role}-token`,
        role,
        username: req.body.username
      }
    });
  }).as("login");
}

function signUp(username, role) {
  cy.visit("/#/signup");
  cy.get("#username").type(username);
  cy.get("#password").type(testPassword);
  cy.get("#role").select(role);
  cy.contains("button", "Sign Up").click();
  cy.location("hash").should(
    "eq",
    role === "organization" ? "#/shelter" : "#/"
  );
}

function fillInquiryForm() {
  cy.get("[data-cy=inquiry-name]").type("Casey Viewer");
  cy.get("[data-cy=inquiry-email]").type("casey@example.com");
  cy.get("[data-cy=inquiry-phone]").type("555-0103");
  cy.get("[data-cy=inquiry-housing]").type(
    "Apartment with pet approval."
  );
  cy.get("[data-cy=inquiry-message]").type(
    "I am ready to schedule a visit."
  );
}

describe("final user story coverage", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    mockAuth();
  });

  it("covers adopter browsing, filters, profile fallbacks, favorites, and auth-required inquiry", () => {
    mockPets();

    cy.visit("/");
    cy.get("[data-cy=pet-card]").should("have.length", 2);
    cy.contains("[data-cy=pet-card]", "Maple").click();
    cy.location("hash").should("eq", "#/pets/pet-maple");
    cy.get("[data-cy=pet-profile-name]").should(
      "contain.text",
      "Maple"
    );
    cy.visit("/");

    cy.get("[data-cy=preference-species]").select("Other");
    cy.get("[data-cy=feed-empty]").should(
      "contain.text",
      "No pets match"
    );
    cy.get("[data-cy=clear-preferences]").click();
    cy.get("[data-cy=pet-card]").should("have.length", 2);

    cy.contains("[data-cy=pet-card]", "Nova")
      .find("[data-cy=pet-card-link]")
      .click();
    cy.get("[data-cy=pet-profile-name]").should(
      "contain.text",
      "Nova"
    );
    cy.get("[data-cy=pet-health]").should(
      "contain.text",
      "Health details pending"
    );
    cy.get("[data-cy=pet-shelter]").should(
      "contain.text",
      "Shelter contact pending"
    );
    cy.get("[data-cy=pet-compatibility-list]").should(
      "contain.text",
      "Compatibility notes pending"
    );

    cy.get("[data-cy=save-pet]")
      .click()
      .should("contain.text", "Saved pet");
    cy.reload();
    cy.get("[data-cy=save-pet]").should(
      "contain.text",
      "Saved pet"
    );

    cy.visit("/#/favorites");
    cy.get("[data-cy=favorites-list]").should(
      "contain.text",
      "Nova"
    );
    cy.contains("[data-cy=favorite-pet-card]", "Nova").click();
    cy.get("[data-cy=pet-profile-name]").should(
      "contain.text",
      "Nova"
    );

    fillInquiryForm();
    cy.get("[data-cy=submit-inquiry]").click();
    cy.get("[data-cy=inquiry-success]").should(
      "contain.text",
      "Please log in"
    );
  });

  it("covers organization role gates, owner-scoped inquiry review, filtering, and retry", () => {
    const inquiries = inquiryFixtures();

    mockPets();
    cy.intercept(
      "GET",
      `${apiBaseUrl}/inquiries`,
      inquiries
    ).as("getInquiries");
    cy.intercept(
      {
        method: "GET",
        url: `${apiBaseUrl}/inquiries`,
        times: 1
      },
      { statusCode: 500 }
    ).as("getInquiriesFailure");
    cy.intercept(
      "PATCH",
      `${apiBaseUrl}/inquiries/*/status`,
      (req) => {
        const id = req.url.split("/").slice(-2)[0];
        const inquiry = inquiries.find(
          (item) => item.id === id
        );
        inquiry.status = req.body.status;
        req.reply(inquiry);
      }
    ).as("updateInquiry");

    signUp("story-shelter", "organization");
    cy.get("[data-cy=shelter-pet-list]").should(
      "contain.text",
      "Maple"
    );
    cy.get("[data-cy=shelter-pet-list]").should(
      "not.contain",
      "Nova"
    );

    cy.get("[data-cy=inquiries-error]").should(
      "contain.text",
      "could not be loaded"
    );
    cy.get("[data-cy=retry-inquiries]").click();
    cy.get("[data-cy=inquiry-list]").should(
      "contain.text",
      "Alex Adopter"
    );
    cy.get("[data-cy=inquiry-summary]").should(
      "contain.text",
      "2"
    );

    cy.get("[data-cy=inquiry-status-filter]").select(
      "rejected"
    );
    cy.get("[data-cy=inquiries-filter-empty]").should(
      "contain.text",
      "No rejected inquiries"
    );
    cy.get("[data-cy=inquiry-status-filter]").select(
      "approved"
    );
    cy.get("[data-cy=inquiry-list]").should(
      "contain.text",
      "Blake Adopter"
    );

    cy.get("[data-cy=inquiry-status-filter]").select("all");
    cy.contains(
      "[data-cy=inquiry-item]",
      "Alex Adopter"
    ).within(() => {
      cy.get("[data-cy=inquiry-status-select]").select(
        "approved"
      );
    });
    cy.wait("@updateInquiry");
    cy.get("[data-cy=inquiry-status-message]").should(
      "contain.text",
      "marked accepted"
    );

    cy.contains("button", "Log out").click();
    signUp("story-adopter", "adopter");
    cy.visit("/#/shelter");
    cy.contains("Organization account required");
  });

  it("covers organization pet creation validation and photo management", () => {
    let createdPet;

    mockPets([]);
    cy.intercept("POST", `${apiBaseUrl}/pets`, (req) => {
      createdPet = {
        ...req.body,
        _id: "pet-created",
        id: "pet-created",
        ownerUsername: "new-shelter"
      };
      req.reply({
        statusCode: 201,
        body: createdPet
      });
    }).as("createPet");
    cy.intercept(
      "PATCH",
      `${apiBaseUrl}/pets/pet-created/photos`,
      (req) => {
        createdPet = {
          ...createdPet,
          imageUrls: req.body.imageUrls
        };
        req.reply(createdPet);
      }
    ).as("savePhotos");

    signUp("new-shelter", "organization");
    cy.get("[data-cy=shelter-pets-empty]").should(
      "contain.text",
      "No pet profiles"
    );
    cy.get("[data-cy=toggle-create-pet]").click();
    cy.get("[data-cy=submit-pet]").click();
    cy.get("[data-cy=pet-validation]").should(
      "contain.text",
      "Pet name is required"
    );

    cy.get("[data-cy=pet-name]").type("Story Spaniel");
    cy.get("[data-cy=pet-species]").select("Dog");
    cy.get("[data-cy=pet-breed]").type("Spaniel Mix");
    cy.get("[data-cy=pet-age]").type("2 years");
    cy.get("[data-cy=pet-location]").type(
      "San Luis Obispo, CA"
    );
    cy.get("[data-cy=pet-shelter-name]").type(
      "New Story Shelter"
    );
    cy.get("[data-cy=pet-shelter-email]").type(
      "new-story@example.com"
    );
    cy.get("[data-cy=pet-description]").type(
      "A calm pet prepared for the final demo."
    );
    cy.get("[data-cy=pet-photo-url]")
      .eq(0)
      .type("/favicon.svg");
    cy.get("[data-cy=pet-photo-url]")
      .eq(1)
      .type("/favicon.svg");
    cy.get("[data-cy=submit-pet]").click();
    cy.wait("@createPet");
    cy.get("[data-cy=pet-create-success]").should(
      "contain.text",
      "Story Spaniel"
    );
    cy.get("[data-cy=shelter-pet-list]").should(
      "contain.text",
      "Story Spaniel"
    );

    cy.contains(
      "[data-cy=shelter-pet-item]",
      "Story Spaniel"
    ).within(() => {
      cy.get("[data-cy=manage-photos-link]").click();
    });
    cy.get("[data-cy=managed-photo-url]").should(
      "have.length",
      2
    );
    cy.get("[data-cy=remove-managed-photo]").eq(1).click();
    cy.get("[data-cy=add-managed-photo]").click();
    cy.get("[data-cy=managed-photo-url]")
      .eq(1)
      .type("/favicon.svg");
    cy.get("[data-cy=save-managed-photos]").click();
    cy.wait("@savePhotos");
    cy.get("[data-cy=photo-manage-success]").should(
      "contain.text",
      "Photos updated"
    );
    cy.get("[data-cy=managed-photo-preview]").should(
      "have.length",
      2
    );
  });

  it("covers recoverable pet loading failures", () => {
    cy.intercept("GET", `${apiBaseUrl}/pets`, pets).as(
      "getPetsAfterRetry"
    );
    cy.intercept(
      {
        method: "GET",
        url: `${apiBaseUrl}/pets`,
        times: 1
      },
      {
        delay: 300,
        statusCode: 500
      }
    ).as("getPetsFailure");

    cy.visit("/");
    cy.get("[data-cy=feed-loading]").should(
      "contain.text",
      "Loading adoptable pets"
    );
    cy.get("[data-cy=feed-error]").should(
      "contain.text",
      "Pets could not be loaded"
    );
    cy.get("[data-cy=retry-load-pets]").click();
    cy.get("[data-cy=pet-card]").should("have.length", 2);
  });
});
