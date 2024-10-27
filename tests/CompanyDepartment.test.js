const request = require("supertest");
const app = require("../web");
const companyService = require('../services/CompanyService');
const userService = require('../services/UserService');

afterAll((done) => {
    app.close(done);
});

let department;
let company;
let user;
const notFound = "2c0ee195-fa7d-45b4-a41a-fd8cc47147c7";

describe("Validation for Company departments", () => {
    describe("create", () => {
        // can create user and company
        test("Valid submodels", async () => {
            // user 
            user = (await userService.create({
                email: "example@gmail.com",
                first_name: "Jhonny",
                last_name: "Monny",
                password: "123qwerqwer5",
            })).dataValues;

            // company 
            company = (await companyService.create({
                handle: "test1",
                name: "test1 company",
                website: "http://pranjesudova.com",
                country: "HR",
                created_by: user.id,
            })).dataValues;

            expect(user!=null).toBe(true);
            expect(company!=null).toBe(true);
        });
        
        // Invalid created_by
        test("invalid created_by", async () => {
            const mockDepartment = {
                "name":"DAS",
                "created_by":"aaa",
            };

            const response = await request(app)
                .post(`/api/companies/${company.id}/departments`)
                .send(mockDepartment);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid value");
        });

        // Invalid company
        test("invalid company", async () => {
            const mockDepartment = {
                "name":"DAS",
                "created_by":user.id,
            };

            const response = await request(app)
                .post("/api/companies/invalid_uuid/departments")
                .send(mockDepartment);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid value");
        });

        // Empty name
        test("empty name", async () => {
            const mockDepartment = {
                "name":"",
                "created_by":user.id,
            };

            const response = await request(app)
                .post(`/api/companies/${company.id}/departments`)
                .send(mockDepartment);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Department name cannot be empty");
        });
        


        // created_by not found
        test("created_by not found", async () => {
            const mockDepartment = {
                "name":"comp",
                "created_by":notFound,
            };

            const response = await request(app)
                .post(`/api/companies/${company.id}/departments`)
                .send(mockDepartment);

            expect(response.status).toBe(404);
            expect(response.body.errors[0].msg).toBe("User not found");
        });

        // company not found
        test("company not found", async () => {
            const mockDepartment = {
                "name":"comp",
                "created_by":user.id,
            };

            const response = await request(app)
                .post(`/api/companies/${notFound}/departments`)
                .send(mockDepartment);

            expect(response.status).toBe(404);
        });

        // valid request
        test("Valid create", async () => {
            // department 
            const mockDepartment = {
                "name":"DAS",
                "created_by":user.id,
            };
        
            const response = await request(app)
                .post(`/api/companies/${company.id}/departments`)
                .send(mockDepartment);

            department = JSON.parse(response.text);

            expect(response.status).toBe(201);
        });
    });

    // Show
    describe("show", () => {
        // Invalid uuid given
        test("Invalid request", async () => {
            const response = await request(app)
                .get(`/api/companies/${company.id}/departments/invaliduuid`)
                .send();

            expect(response.status).toBe(400);
        });

        // Department not found
        test("Department does not exist", async () => {
            const response = await request(app)
                .get(`/api/companies/${company.id}/departments/${notFound}`)
                .send();

            expect(response.status).toBe(404);
        });
    });

    // update
    describe("update", () => {
        
        // Empty name
        test("empty name", async () => {
            const mockDepartment = {
                "name":"",
            };

            const response = await request(app)
                .put(`/api/companies/${company.id}/departments/${department.id}`)
                .send(mockDepartment);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Department name cannot be empty");
        });
    

        // Invalid company
        test("invalid company", async () => {
            const mockDepartment = {
                "name":"WOW",
            };

            const response = await request(app)
                .put(`/api/companies/notuuid/departments/${department.id}`)
                .send(mockDepartment);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid value");
        });

        // company not found
        test("company not found", async () => {
            const mockDepartment = {
                "name":"compa",
            };

            const response = await request(app)
                .put(`/api/companies/${notFound}/departments/${department.id}`)
                .send(mockDepartment);

            expect(response.status).toBe(404);
        });


        // Invalid department
        test("invalid department", async () => {
            const mockDepartment = {
                "name":"compa",
            };

            const response = await request(app)
                .put(`/api/companies/${company.id}/departments/invaliduuid`)
                .send(mockDepartment);

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid value");
        });

         // department not found
         test("department not found", async () => {
            const mockDepartment = {
                "name":"compa",
            };

            const response = await request(app)
                .put(`/api/companies/${company.id}/departments/${notFound}`)
                .send(mockDepartment);

            expect(response.status).toBe(404);
        });
    });

    // activate
    describe("activate", () => {
        // Invalid company uuid
        test("Invalid company uuid", async () => {
            const response = await request(app)
                .patch(`/api/companies/invaliduuid/departments/${department.id}/activate`)
                .send();

            expect(response.status).toBe(400);
        });

        // Not found company uuid
        test("Not found company uuid", async () => {
            const response = await request(app)
                .patch(`/api/companies/${notFound}/departments/${department.id}/activate`)
                .send();

            expect(response.status).toBe(404);
        });

        // Invalid department uuid
        test("Invalid company uuid", async () => {
            const response = await request(app)
                .patch(`/api/companies/${company.id}/departments/invaliduuid/activate`)
                .send();

            expect(response.status).toBe(400);
        });

        // Not found department uuid
        test("Not found department uuid", async () => {
            const response = await request(app)
                .patch(`/api/companies/${company.id}/departments/${notFound}/activate`)
                .send();

            expect(response.status).toBe(404);
        });

        // Valid activate but department wasn't previously deactivated
        test("Not found department uuid", async () => {
            const response = await request(app)
                .patch(`/api/companies/${company.id}/departments/${department.id}/activate`)
                .send();

            expect(response.status).toBe(404);
        });
    });


    // deactivate
    describe("deactivate", () => {
        // Invalid company
        test("invalid company", async () => {
            const response = await request(app)
                .patch(`/api/companies/notuuid/departments/${department.id}/deactivate`)
                .send();

            expect(response.status).toBe(400);
        });

        // Not found company uuid
        test("Not found company uuid", async () => {
            const response = await request(app)
                .patch(`/api/companies/${notFound}/departments/${department.id}/deactivate`)
                .send();

            expect(response.status).toBe(404);
        });

        // Invalid department uuid
        test("Invalid company uuid", async () => {
            const response = await request(app)
                .patch(`/api/companies/${company.id}/departments/invaliduuid/deactivate`)
                .send();

            expect(response.status).toBe(400);
        });

        // Not found department uuid
        test("Not found department uuid", async () => {
            const response = await request(app)
                .patch(`/api/companies/${company.id}/departments/${notFound}/deactivate`)
                .send();

            expect(response.status).toBe(404);
        });

        // Valid deactivate
        test("Valid deactivate", async () => {
            const response = await request(app)
                .patch(`/api/companies/${company.id}/departments/${department.id}/deactivate`)
                .send();

            expect(response.status).toBe(200);
        });
    });

    // delete
    describe("delete", () => {
        // Invalid company uuid
        test("Invalid company uuid", async () => {
            const response = await request(app)
                .delete(`/api/companies/invaliduuid/departments/${department.id}`)
                .send();

            expect(response.status).toBe(400);
        });

        // Not found company uuid
        test("Not found company uuid", async () => {
            const response = await request(app)
                .delete(`/api/companies/${notFound}/departments/${department.id}`)
                .send();

            expect(response.status).toBe(404);
        });

        // Invalid department uuid
        test("Invalid company uuid", async () => {
            const response = await request(app)
                .delete(`/api/companies/${company.id}/departments/invaliduuid`)
                .send();

            expect(response.status).toBe(400);
        });

        // Not found department uuid
        test("Not found department uuid", async () => {
            const response = await request(app)
                .delete(`/api/companies/${company.id}/departments/${notFound}`)
                .send();

            expect(response.status).toBe(404);
        });

        // Valid delete
        test("Valid delete", async () => {
            const response = await request(app)
                .delete(`/api/companies/${company.id}/departments/${department.id}`)
                .send();

            expect(response.status).toBe(200);
        });

        // Valid delete submodels
        test("Valid delete submodels", async () => {
            await userService.deactivate(user.id);
            const userDeleted = await userService.delete(user.id);
            await companyService.deactivate(company.id);
            const companyDeleted = await companyService.delete(company.id);

            expect(userDeleted).toBe(true);
            expect(companyDeleted).toBe(true);
        });
    });
   

});

