const testPassword = "TestPassword123!";

function signUp(username, role) {
  cy.visit("/#/signup");
  cy.get("#username").type(username);
  cy.get("#password").type(testPassword);
  cy.get("#role").select(role);
  cy.contains("button", "Sign Up").click();
  cy.location("hash").should("eq", role === "organization" ? "#/shelter" : "#/");
}

function logIn(username, role) {
  cy.visit("/#/login");
  cy.get("#username").type(username);
  cy.get("#password").type(testPassword);
  cy.contains("button", "Log In").click();
  cy.location("hash").should("eq", role === "organization" ? "#/shelter" : "#/");
}

describe("Jaydon assigned pet adoption flows", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("keeps anonymous browsing preferences and saved pets across refreshes", () => {
    let selectedPetName = "";

    cy.visit("/");
    cy.get("[data-cy=session-id]").should("contain.text", "Session");
    cy.window().its("localStorage").invoke("getItem", "gitgoblins:sessionId").should("be.a", "string");

    cy.get("[data-cy=preference-species]").select("Dog").should("have.value", "Dog");
    cy.reload();
    cy.get("[data-cy=session-id]").should("contain.text", "restored");
    cy.get("[data-cy=preference-species]").should("have.value", "Dog");

    cy.get("[data-cy=pet-card]", { timeout: 10000 }).first().find("h3").then(($heading) => {
      selectedPetName = $heading.text();
    });
    cy.get("[data-cy=pet-card]").first().find("[data-cy=pet-card-link]").click();
    cy.then(() => {
      cy.get("[data-cy=pet-profile-name]").should("contain.text", selectedPetName);
    });
    cy.get("[data-cy=save-pet]").click().should("contain.text", "Saved pet");

    cy.reload();
    cy.then(() => {
      cy.get("[data-cy=pet-profile-name]").should("contain.text", selectedPetName);
    });
    cy.get("[data-cy=save-pet]").should("contain.text", "Saved pet");
    cy.window().then((win) => {
      const browsingState = JSON.parse(win.localStorage.getItem("gitgoblins:browsingState"));
      expect(browsingState.page).to.equal("profile");
      expect(browsingState.id).to.be.a("string").and.not.be.empty;
    });

    cy.visit("/#/favorites");
    cy.then(() => {
      cy.get("[data-cy=favorites-list]").should("contain.text", selectedPetName);
    });
    cy.reload();
    cy.then(() => {
      cy.get("[data-cy=favorites-list]").should("contain.text", selectedPetName);
    });
  });

  it("opens a pet profile from discovery and favorites, then submits an adoption inquiry", () => {
    const adopterName = `Jaydon Test ${Date.now()}`;
    const adopterUsername = `cypress-adopter-${Date.now()}`;
    const shelterUsername = `cypress-reviewer-${Date.now()}`;
    const otherShelterUsername = `cypress-other-reviewer-${Date.now()}`;
    const selectedPetName = `Jaydon Inquiry Pet ${Date.now()}`;

    signUp(shelterUsername, "organization");
    cy.get("[data-cy=toggle-create-pet]").click();
    cy.get("[data-cy=pet-name]").type(selectedPetName);
    cy.get("[data-cy=pet-species]").select("Dog");
    cy.get("[data-cy=pet-breed]").type("Retriever Mix");
    cy.get("[data-cy=pet-age]").type("4 years");
    cy.get("[data-cy=pet-location]").type("San Luis Obispo, CA");
    cy.get("[data-cy=pet-shelter-name]").type("Jaydon Test Shelter");
    cy.get("[data-cy=pet-shelter-email]").type("reviewer@example.com");
    cy.get("[data-cy=pet-description]").type("A friendly test pet for inquiry review.");
    cy.get("[data-cy=pet-photo-url]").eq(0).type("https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80");
    cy.get("[data-cy=submit-pet]").click();
    cy.get("[data-cy=pet-create-success]").should("contain.text", selectedPetName);
    cy.contains("button", "Log out").click();

    signUp(adopterUsername, "adopter");
    cy.contains("Pet Adoption Match");
    cy.contains("[data-cy=pet-card]", selectedPetName).find("[data-cy=pet-card-link]").click();

    cy.then(() => {
      cy.get("[data-cy=pet-profile-name]").should("contain.text", selectedPetName);
    });
    cy.get("[data-cy=pet-gallery]").find("[data-cy=pet-photo-thumb]").should("have.length.at.least", 1);
    cy.get("[data-cy=save-pet]").click().should("contain.text", "Saved pet");
    cy.get("[data-cy=start-inquiry]").should("be.visible");

    cy.visit("/#/favorites");
    cy.then(() => {
      cy.get("[data-cy=favorites-list]").should("contain.text", selectedPetName);
    });
    cy.get("[data-cy=favorite-pet-card]").first().within(() => {
      cy.get("[data-cy=favorite-profile-link]").click();
    });
    cy.then(() => {
      cy.get("[data-cy=pet-profile-name]").should("contain.text", selectedPetName);
    });

    cy.get("[data-cy=submit-inquiry]").click();
    cy.get("[data-cy=inquiry-validation]").should("contain.text", "Name is required.");

    cy.get("[data-cy=inquiry-name]").type(adopterName);
    cy.get("[data-cy=inquiry-email]").type("jaydon@example.com");
    cy.get("[data-cy=inquiry-phone]").type("555-123-4567");
    cy.get("[data-cy=inquiry-housing]").type("Apartment with landlord approval and a nearby park.");
    cy.get("[data-cy=inquiry-message]").type("I am interested in meeting this pet this week.");
    cy.get("[data-cy=submit-inquiry]").click();

    cy.get("[data-cy=inquiry-success]").should("contain.text", "Inquiry sent");

    cy.contains("button", "Log out").click();
    signUp(otherShelterUsername, "organization");
    cy.get("[data-cy=inquiries-empty]").should("contain.text", "No adoption inquiries");
    cy.get("body").should("not.contain", adopterName);
    cy.get("body").should("not.contain", selectedPetName);

    cy.contains("button", "Log out").click();
    logIn(shelterUsername, "organization");
    cy.get("[data-cy=inquiry-list]").should("contain.text", adopterName);
    cy.contains("[data-cy=inquiry-item]", adopterName).within(() => {
      cy.then(() => {
        cy.contains(selectedPetName);
      });
      cy.contains("jaydon@example.com");
      cy.contains("555-123-4567");
      cy.contains("Apartment with landlord approval and a nearby park.");
      cy.contains("I am interested in meeting this pet this week.");
      cy.get("[data-cy=inquiry-status-select]").should("have.value", "new").select("contacted");
    });
    cy.get("[data-cy=inquiry-status-message]").should("contain.text", "marked contacted");
    cy.reload();
    cy.contains("[data-cy=inquiry-item]", adopterName).within(() => {
      cy.get("[data-cy=inquiry-status-select]").should("have.value", "contacted");
    });
  });

  it("creates a pet, manages multiple photos, and shows updates in discovery", () => {
    const orgUsername = `cypress-org-${Date.now()}`;
    const originalPhoto =
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=1200&q=80";
    const secondPhoto =
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1200&q=80";
    const replacementPhoto =
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80";

    signUp(orgUsername, "organization");

    cy.get("[data-cy=shelter-pets-empty]").should("contain.text", "No pet profiles");
    cy.get("[data-cy=toggle-create-pet]").click();
    cy.get("[data-cy=submit-pet]").click();
    cy.get("[data-cy=pet-validation]").should("contain.text", "Pet name is required.");

    cy.get("[data-cy=pet-name]").type("Cypress Corgi");
    cy.get("[data-cy=pet-species]").select("Dog");
    cy.get("[data-cy=pet-breed]").type("Corgi Mix");
    cy.get("[data-cy=pet-age]").type("3 years");
    cy.get("[data-cy=pet-size]").select("Small");
    cy.get("[data-cy=pet-energy]").select("Medium");
    cy.get("[data-cy=pet-location]").type("San Luis Obispo, CA");
    cy.get("[data-cy=pet-fee]").clear().type("125");
    cy.get("[data-cy=pet-shelter-name]").type("Cypress Shelter");
    cy.get("[data-cy=pet-shelter-email]").type("shelter@example.com");
    cy.get("[data-cy=pet-description]").type(
      "A friendly test pet who likes walks, naps, and meeting patient adopters."
    );
    cy.get("[data-cy=pet-compatibility]").type("Good with kids, Apartment friendly");
    cy.get("[data-cy=pet-health]").type("Vaccinated and neutered");
    cy.get("[data-cy=pet-photo-url]").eq(0).type(originalPhoto);
    cy.get("[data-cy=pet-photo-url]").eq(1).type(secondPhoto);
    cy.get("[data-cy=submit-pet]").click();

    cy.get("[data-cy=pet-create-success]").should("contain.text", "Cypress Corgi");
    cy.get("[data-cy=shelter-pet-list]").should("contain.text", "Cypress Corgi");

    cy.contains("[data-cy=shelter-pet-item]", "Cypress Corgi").within(() => {
      cy.get("[data-cy=manage-photos-link]").click();
    });
    cy.get("[data-cy=managed-photo-url]").should("have.length", 2);
    cy.get("[data-cy=managed-photo-url]").eq(0).clear().type(replacementPhoto);
    cy.get("[data-cy=remove-managed-photo]").eq(1).click();
    cy.get("[data-cy=managed-photo-url]").should("have.length", 1);
    cy.get("[data-cy=add-managed-photo]").click();
    cy.get("[data-cy=managed-photo-url]").eq(1).type(secondPhoto);
    cy.get("[data-cy=save-managed-photos]").click();
    cy.get("[data-cy=photo-manage-success]").should("contain.text", "Photos updated");
    cy.get("[data-cy=managed-photo-preview]").should("have.length", 2);

    cy.visit("/");
    cy.contains("[data-cy=pet-card]", "Cypress Corgi").within(() => {
      cy.get("[data-cy=pet-card-link]").click();
    });
    cy.get("[data-cy=pet-profile-name]").should("contain.text", "Cypress Corgi");
    cy.get("[data-cy=pet-gallery]").find("[data-cy=pet-photo-thumb]").should("have.length", 2);
    cy.get("[data-cy=selected-pet-photo]").should("have.attr", "src").and("include", "photo-1552053831");
  });
});
