const request = require("supertest");
const app = require("../web");
const userService = require('../services/UserService');

afterAll((done) => {
    app.close(done);
});


let company;
let user;
const notFound = "2c0ee195-f17d-45b4-a41a-fd8cc47147c7";

describe("Validation for Companies", () => {
    describe("paginated", () => {
        // filterBy
        test("Good filterBy query parameters", async () => {
            let response = await request(app)
                .get("/api/companies?filterBy=deleted")
                .send();

            expect(response.status).toBe(200);

            response = await request(app)
                .get("/api/companies?filterBy=notDeleted")
                .send();

            expect(response.status).toBe(200);
        });
        test("Bad filterBy query parameter", async () => {
            const response = await request(app)
                .get("/api/companies?filterBy=NOOOOOOOOO")
                .send();

            expect(response.status).toBe(400);
        });

        // sortField
        test("Good sortField query parameters", async () => {
            let response = await request(app)
                .get("/api/companies?sortField=handle")
                .send();

            expect(response.status).toBe(200);

            response = await request(app)
                .get("/api/companies?sortField=name")
                .send();

            expect(response.status).toBe(200);

            response = await request(app)
                .get("/api/companies?sortField=website")
                .send();

            expect(response.status).toBe(200);

            response = await request(app)
                .get("/api/companies?sortField=country")
                .send();

            expect(response.status).toBe(200);

            response = await request(app)
                .get("/api/companies?sortField=created_at")
                .send();

            expect(response.status).toBe(200);
        });
        test("Bad sortField query parameter", async () => {
            const response = await request(app)
                .get("/api/companies?sortField=AAAAAASNFOAINSIOASNFAOFN")
                .send();

            expect(response.status).toBe(400);
        });

        // sortOrder
        test("Good sortOrder query parameters", async () => {
            let response = await request(app)
                .get("/api/companies?sortOrder=asc")
                .send();

            expect(response.status).toBe(200);

            response = await request(app)
                .get("/api/companies?sortOrder=desc")
                .send();

            expect(response.status).toBe(200);
        });
        test("Bad sortOrder query parameter", async () => {
            const response = await request(app)
                .get("/api/companies?sortOrder=SOIFMAOSFMAOISNGAOSNG")
                .send();

            expect(response.status).toBe(400);
        });

        // page
        test("Good page query parameter", async () => {
            let response = await request(app)
                .get("/api/companies?page=1")
                .send();

            expect(response.status).toBe(200);
        });
        test("Bad page query parameter", async () => {
            const response = await request(app)
                .get("/api/companies?page=one")
                .send();

            expect(response.status).toBe(400);
        });

        // pageSize
        test("Good pageSize query parameter", async () => {
            let response = await request(app)
                .get("/api/companies?pageSize=1")
                .send();

            expect(response.status).toBe(200);
        });
        test("Bad pageSize query parameter", async () => {
            const response = await request(app)
                .get("/api/companies?pageSize=one")
                .send();

            expect(response.status).toBe(400);
        });

        // search
        test("Good search query parameter", async () => {
            let response = await request(app)
                .get("/api/companies?search=a")
                .send();

            expect(response.status).toBe(200);
        });
    });

    describe("create", () => {
        test("Valid submodels", async () => {
            // user 
            user = (await userService.create({
                email: "example@gmail.com",
                first_name: "Jhonny",
                last_name: "Monny",
                password: "123qwerqwer5",
            })).dataValues;

            expect(user!=null).toBe(true);
        });

        // Invalid handle
        test("company handle must not be empty", async () => {
            const mockCompany = {
                handle: "",
                name: "erm company",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: user.id,
            };

            const response = await request(app)
                .post("/api/companies")
                .send(mockCompany);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Handle cannot be empty");
        });

        // Invalid name
        test("company name must not be empty", async () => {
            const mockCompany = {
                handle: "erm4",
                name: "",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: user.id,
            };

            const response = await request(app)
                .post("/api/companies")
                .send(mockCompany);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Name cannot be empty");
        });

        // Invalid website
        test("Invalid website URL", async () => {
            const mockCompany = {
                handle: "erm",
                name: "erm company",
                website: "tractors",
                country: "HR",
                created_by: user.id,
            };

            const response = await request(app)
                .post("/api/companies")
                .send(mockCompany);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid website URL");
        });

        // Invalid country
        test("company country must not be empty", async () => {
            const mockCompany = {
                handle: "erm",
                name: "erm company",
                website: "http://pranjesudova.com",
                country: "",
                created_by: user.id,
            };

            const response = await request(app)
                .post("/api/companies")
                .send(mockCompany);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Country cannot be empty");
        });

        // Invalid created_by
        test("company created_by invalid uuid", async () => {
            const mockCompany = {
                handle: "erm",
                name: "erm company",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: "password",
            };

            const response = await request(app)
                .post("/api/companies")
                .send(mockCompany);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid value");
        });

        // created_by user not found
        test("company created_by not found", async () => {
            const mockCompany = {
                handle: "erm",
                name: "erm company",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: notFound,
            };

            const response = await request(app)
                .post("/api/companies")
                .send(mockCompany);

            expect(response.status).toBe(404);
        });

        // Valid create
        test("Valid create", async () => {
            const mockCompany = {
                handle: "erm4",
                name: "erm4 company",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: user.id,
            };

            const response = await request(app)
                .post("/api/companies")
                .send(mockCompany);

            company = JSON.parse(response.text);

            expect(response.status).toBe(201);
        });
    });

    // Show
    describe("show", () => {
        // Invalid uuid given
        test("Invalid request", async () => {
            const response = await request(app)
                .get("/api/companies/nonexistent_id")
                .send();

            expect(response.status).toBe(400);
        });

        // Company not found
        test("Company does not exist", async () => {
            const response = await request(app)
                .get(`/api/companies/${notFound}`)
                .send();

            expect(response.status).toBe(404);
        });

        // Valid show
        test("Valid show", async () => {
            const response = await request(app)
                .get(`/api/companies/${company.id}`)
                .send();

            expect(response.status).toBe(200);
        });
    });

    // update
    describe("update", () => {
        // Invalid handle
        test("company handle must not be empty", async () => {
            const mockCompany = {
                handle: "",
                name: "erm company",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: user.id,
            };

            const response = await request(app)
                .put(`/api/companies/${company.id}`)
                .send(mockCompany);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Handle cannot be empty");
        });

        // Invalid name
        test("company name must not be empty", async () => {
            const mockCompany = {
                handle: "erm4",
                name: "",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: user.id,
            };

            const response = await request(app)
                .put(`/api/companies/${company.id}`)
                .send(mockCompany);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Name cannot be empty");
        });

        // Invalid website
        test("Invalid website URL", async () => {
            const mockCompany = {
                handle: "erm",
                name: "erm company",
                website: "tractors",
                country: "HR",
                created_by: user.id,
            };

            const response = await request(app)
                .put(`/api/companies/${company.id}`)
                .send(mockCompany);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid website URL");
        });

        // Invalid country
        test("company country must not be empty", async () => {
            const mockCompany = {
                handle: "erm",
                name: "erm company",
                website: "http://pranjesudova.com",
                country: "",
                created_by: user.id,
            };

            const response = await request(app)
                .put(`/api/companies/${company.id}`)
                .send(mockCompany);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Country cannot be empty");
        });

        // created_by user not found
        test("company created_by invalid uuid", async () => {
            const mockCompany = {
                handle: "erm",
                name: "erm company",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: notFound,
            };

            const response = await request(app)
                .put(`/api/companies/${company.id}`)
                .send(mockCompany);

            expect(response.status).toBe(404);
        });

        // Invalid uuid given
        test("Invalid request", async () => {
            const mockCompany = {
                handle: "erm",
                name: "erm company",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: user.id,
            };

            const response = await request(app)
                .put("/api/companies/invalid_id") // Invalid company ID
                .send(mockCompany);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid value");
        });

        // Valid update
        test("Valid update request", async () => {
            const mockCompany = {
                handle: "erm update",
                name: "erm company",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: user.id,
            };

            const response = await request(app)
                .put(`/api/companies/${company.id}`)
                .send(mockCompany);

            expect(response.status).toBe(200);
        });
    });

    // activate
    describe("activate", () => {
        // Invalid uui
        test("Invalid uuid", async () => {
            const response = await request(app)
                .patch("/api/companies/nonexistent_id/activate")
                .send();

            expect(response.status).toBe(400);
        });

        // Company not found
        test("Company not found", async () => {
            const response = await request(app)
                .patch(
                    `/api/companies/${notFound}/activate`
                )
                .send();

            expect(response.status).toBe(404);
        });

        // Valid activate but company wasn't previously deactivated
        test("Valid activate but company wasn't previously deactivated", async () => {
            const response = await request(app)
                .patch(
                    `/api/companies/${company.id}/activate`
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
                .patch("/api/companies/nonexistent_id/deactivate")
                .send();

            expect(response.status).toBe(400);
        });

        // Company not found
        test("Company not found", async () => {
            const response = await request(app)
                .patch(`/api/companies/${notFound}/deactivate`)
                .send();

            expect(response.status).toBe(404);
        });

        // Valid deactivate
        test("Valid deactivate", async () => {
            const response = await request(app)
                .patch(`/api/companies/${company.id}/deactivate`)
                .send();

            expect(response.status).toBe(200);
        });
    });


      // delete
      describe("delete", () => {
        // Invalid uui
        test("Invalid uuid", async () => {
            const response = await request(app)
                .delete("/api/companies/nonexistent_id")
                .send();

            expect(response.status).toBe(400);
        });

        // Company not found
        test("Company not found", async () => {
            const response = await request(app)
                .delete(`/api/companies/${notFound}`)
                .send();

            expect(response.status).toBe(404);
        });

         // Valid delete company 
         test("Valid delete company", async () => {
            const response = await request(app)
                .delete(`/api/companies/${company.id}`)
                .send();

            expect(response.status).toBe(200);
        });

         // Valid delete submodels 
         test("Valid delete company", async () => {
            await userService.deactivate(user.id);
            const response = await userService.delete(user.id);
            expect(response).toBe(true);
        });
    });
});
