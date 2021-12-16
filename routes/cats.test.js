process.env.NODE_ENV = "test";
const { expect } = require("@jest/globals");
const request = require("supertest");
const { describe } = require("yargs");

const app = require("../app");
let cats = require("../fakeDb");

let pickles = { name: "Pickles" };

beforeEach(function () {
	cats.push(pickles);
});

afterEach(function () {
	// make sure this mutates, not redefines, `cats`
	cats.length = 0;
});

describe("GET /cats", () => {
	test("should get all cats", async () => {
		const res = await request(app).get("/cats");
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ cats: [pickles] });
	});
});

describe("POST /cats", () => {
	test("Creating a cat", async () => {
		const res = await request(app).post("/cats").send({ name: "Blue" });
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ cat: { name: "Blue" } });
	});
});

describe("/PATH /cats/:name", () => {
	test("should update a cat's name", async () => {
		const res = await request(app)
			.patch(`/cats/${pickles.name}`)
			.send({ name: "Sherry" });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ cat: { name: "Sherry" } });
	});
});
