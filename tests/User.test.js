const request = require("supertest");
const app = require("../web");

afterAll((done) => {
    app.close(done);
});


let user;
const notFound = "2c0ee195-f17d-45b4-a41a-fd8cc47147c7";

describe("Validation for Users", () => {
    describe("paginated", () => {
        // filterBy
        test("Good filterBy query parameters", async () => {
            let response = await request(app)
                .get("/api/users?filterBy=deleted")
                .send();

            expect(response.status).toBe(200);

            response = await request(app)
                .get("/api/users?filterBy=notDeleted")
                .send();

            expect(response.status).toBe(200);
        });

        test("Bad filterBy query parameter", async () => {
            const response = await request(app)
                .get("/api/users?filterBy=NOOOOOOOOO")
                .send();

            expect(response.status).toBe(400);
        });

        // sortField
        test("Good sortField query parameters", async () => {
            let response = await request(app)
                .get("/api/users?sortField=first_name")
                .send();

            expect(response.status).toBe(200);

            response = await request(app)
                .get("/api/users?sortField=last_name")
                .send();

            expect(response.status).toBe(200);

            response = await request(app)
                .get("/api/users?sortField=email")
                .send();

            expect(response.status).toBe(200);
        });
        test("Bad sortField query parameter", async () => {
            const response = await request(app)
                .get("/api/users?sortField=AAAAAASNFOAINSIOASNFAOFN")
                .send();

            expect(response.status).toBe(400);
        });

        // sortOrder
        test("Good sortOrder query parameters", async () => {
            let response = await request(app)
                .get("/api/users?sortOrder=asc")
                .send();

            expect(response.status).toBe(200);

            response = await request(app)
                .get("/api/users?sortOrder=desc")
                .send();

            expect(response.status).toBe(200);
        });
        test("Bad sortOrder query parameter", async () => {
            const response = await request(app)
                .get("/api/users?sortOrder=SOIFMAOSFMAOISNGAOSNG")
                .send();

            expect(response.status).toBe(400);
        });

        // page
        test("Good page query parameter", async () => {
            let response = await request(app).get("/api/users?page=1").send();

            expect(response.status).toBe(200);
        });
        test("Bad page query parameter", async () => {
            const response = await request(app)
                .get("/api/users?page=one")
                .send();

            expect(response.status).toBe(400);
        });

        // pageSize
        test("Good pageSize query parameter", async () => {
            let response = await request(app)
                .get("/api/users?pageSize=1")
                .send();

            expect(response.status).toBe(200);
        });
        test("Bad pageSize query parameter", async () => {
            const response = await request(app)
                .get("/api/users?pageSize=one")
                .send();

            expect(response.status).toBe(400);
        });

        // search
        test("Good search query parameter", async () => {
            let response = await request(app).get("/api/users?search=a").send();

            expect(response.status).toBe(200);
        });
    });

    describe("create", () => {
        // Invalid email
        test("user email must be valid", async () => {
            const mockUser = {
                email: "exammail.com",
                first_name: "John",
                last_name: "Doe",
                password: "123qwerqwer5",
            };

            const response = await request(app)
                .post("/api/users")
                .send(mockUser);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid email address");
        });

        // Invalid first_name
        test("First name cannot be empty", async () => {
            const mockUser = {
                email: "example@mail.com",
                first_name: "",
                last_name: "Doe",
                password: "123qwerqwer5",
            };

            const response = await request(app)
                .post("/api/users")
                .send(mockUser);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe(
                "First name cannot be empty"
            );
        });

        // Invalid last_name
        test("Last name cannot be empty", async () => {
            const mockUser = {
                email: "example@mail.com",
                first_name: "John",
                last_name: "",
                password: "123qwerqwer5",
            };

            const response = await request(app)
                .post("/api/users")
                .send(mockUser);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe(
                "Last name cannot be empty"
            );
        });

        // Invalid password
        test("user password must be at least 6 characters long", async () => {
            const mockUser = {
                email: "example@mail.com",
                first_name: "John",
                last_name: "Doe",
                password: "123",
            };

            const response = await request(app)
                .post("/api/users")
                .send(mockUser);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe(
                "Password must be at least 6 characters long"
            );
        });

         // Valid create
         test("Valid create user", async () => {
            const mockUser = {
                email: "rade@gmail.com",
                first_name: "Radislav",
                last_name: "Radojkovic",
                password: "123pwpwd456",
            };

            const response = await request(app)
                .post("/api/users")
                .send(mockUser);

            user = JSON.parse(response.text);

            expect(response.status).toBe(201);
        });
    });

    // Show
    describe("show", () => {
        // Invalid uuid given
        test("Invalid request", async () => {
            const response = await request(app)
                .get("/api/users/nonexistent_id")
                .send();

            expect(response.status).toBe(400);
        });

        // User not found
        test("User does not exist", async () => {
            const response = await request(app)
                .get(`/api/users/${notFound}`)
                .send();

            expect(response.status).toBe(404);
        });

         // User found
         test("User found", async () => {
            const response = await request(app)
                .get(`/api/users/${user.id}`)
                .send();

            expect(response.status).toBe(200);
        });
    });

    // update
    describe("update", () => {
        // Invalid uuid given
        test("Invalid request", async () => {
            const mockUser = {
                email: "update@example.com",
                first_name: "Updated",
                last_name: "User",
                password: "updatedpwd",
            };

            const response = await request(app)
                .put("/api/users/invalid_id") // Invalid user ID
                .send(mockUser);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid value");
        });

        // Invalid first_name
        test("user first name must exist", async () => {
            const mockUser = {
                email: "update@example.com",
                first_name: "", // Empty first name
                last_name: "User",
                password: "updatedpwd",
            };

            const response = await request(app)
                .put(`/api/users/${user.id}`)
                .send(mockUser);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe(
                "First name cannot be empty"
            );
        });

        // Invalid last_name
        test("user last name must exist", async () => {
            const mockUser = {
                email: "update@example.com",
                first_name: "Updated",
                last_name: "", // Empty last name
                password: "updatedpwd",
            };

            const response = await request(app)
                .put(`/api/users/${user.id}`)
                .send(mockUser);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe(
                "Last name cannot be empty"
            );
        });

        // Invalid email
        test("email address must be valid", async () => {
            const mockUser = {
                email: "invalidemail",
                first_name: "Updated",
                last_name: "User",
                password: "updatedpwd",
            };

            const response = await request(app)
                .put(`/api/users/${user.id}`)
                .send(mockUser);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid email address");
        });

        // User not found
        test("Validation for updating user: user does not exist", async () => {
            const mockUser = {
                email: "nonexistent@example.com",
                first_name: "John",
                last_name: "Doe",
                password: "nonexistentpwd",
            };

            const response = await request(app)
                .put(`/api/users/${notFound}`)
                .send(mockUser);

            expect(response.status).toBe(404);
        });

        // Valid update
        test("Valid user update", async () => {
            const mockUser = {
                first_name: "Radovan",
            };

            const response = await request(app)
                .put(`/api/users/${user.id}`)
                .send(mockUser);

            expect(response.status).toBe(200);
        });
    });

    // activate
    describe("activate", () => {
        // Invalid uui
        test("Invalid uuid", async () => {
            const response = await request(app)
                .patch("/api/users/nonexistent_id/activate")
                .send();

            expect(response.status).toBe(400);
        });

        // user not found
        test("User not found", async () => {
            const response = await request(app)
                .patch(
                    `/api/users/${notFound}/activate`
                )
                .send();

            expect(response.status).toBe(404);
        });

        // Valid activate but user wasn't previously deactivated
        test("Valid activate but user wasn't previously deactivated", async () => {
            const response = await request(app)
                .patch(
                    `/api/users/${user.id}/activate`
                )
                .send();

            expect(response.status).toBe(404);
        });
    });

    // deactivate
    describe("deactivate", () => {
        // Invalid uui
        test("Invalid uuid", async () => {
            const response = await request(app)
                .patch("/api/users/nonexistent_id/deactivate")
                .send();

            expect(response.status).toBe(400);
        });

        // user not found
        test("User not found", async () => {
            const response = await request(app)
                .patch(`/api/users/${notFound}/deactivate`)
                .send();

            expect(response.status).toBe(404);
        });

        // valid deactivate
        test("Valid deactivate", async () => {
            const response = await request(app)
                .patch(`/api/users/${user.id}/deactivate`)
                .send();

            expect(response.status).toBe(200);
        });
    });

    // delete
    describe("delete", () => {
        // Invalid uui
        test("Invalid uuid", async () => {
            const response = await request(app)
                .delete("/api/users/nonexistent_id")
                .send();

            expect(response.status).toBe(400);
        });

        // user not found
        test("User not found", async () => {
            const response = await request(app)
                .delete(`/api/users/${notFound}`)
                .send();

            expect(response.status).toBe(404);
        });

        // valid delete
        test("Valid delete", async () => {
            const response = await request(app)
                .delete(`/api/users/${user.id}`)
                .send();

            expect(response.status).toBe(200);
        });
    });
});
