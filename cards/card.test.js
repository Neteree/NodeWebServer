const request = require("supertest");
const app = require("../app");

describe("app", () => {
  test("GET /cards/read should respond with a list of cards", async () => {
    const expectedStatus = 200;
    const expectedBody = [
      {
        _id: "61480db44ab0cf7175467757",
        content: "What is the Korean word for water?",
      },
      {
        _id: "64fc8673e23a8e0fe4ea560c",
        content: "물",
      },
      {
        _id: "64fc8673e23a8e0fe4ea560b",
        content: "What is the Korean word for pizza?",
      },
    ];

    const response = await request(app).get("/cards/read");

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/create should create a new card", async () => {
    const expectedStatus = 201;
    const requestBody = {
      content: "Korean",
    };

    const response = await request(app).post("/cards/create").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expect.objectContaining(requestBody));
    expect(response.body._id).toBeDefined();
  });

  test("POST /cards/create should respond with a 400 status when content is not provided", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: '"content" is required' };
    const requestBody = {};

    const response = await request(app).post("/cards/create").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/create should respond with a 400 status when id is provided", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: '"content" is required' };
    const requestBody = {
      _id: "64fea952d0f7efaabb3129d9",
    };

    const response = await request(app).post("/cards/create").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/create should respond with a 400 status when id is provided in addition the the required content", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: '"_id" is not allowed' };
    const requestBody = {
      _id: "64fea952d0f7efaabb3129d9",
      content: "cat in the hat",
    };
    const response = await request(app).post("/cards/create").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/filter should respond with a 200 status and the list of filtered cards", async () => {
    const expectedStatus = 200;
    const expectedBody = [
      {
        _id: "61480db44ab0cf7175467757",
        content: "What is the Korean word for water?",
      },
      {
        _id: "64fc8673e23a8e0fe4ea560b",
        content: "What is the Korean word for pizza?",
      },
    ];
    const requestBody = {
      content: "(?=.*Korean)(?=.*wHat)(?=.*word)",
    };

    const response = await request(app).post("/cards/filter").send(requestBody);
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/filter should respond with a 200 status and the empty list of filtered cards", async () => {
    const expectedStatus = 200;
    const expectedBody = [];
    const requestBody = {
      content:
        "(?=.*WHat)(?=.*time)|(?=.*Korean)(?=.*language)|(?=.*English)(?=.*word)",
    };

    const response = await request(app).post("/cards/filter").send(requestBody);
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/filter should respond with a 400 status when page is less than 1", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: "Page is less than 1" };
    const requestBody = { content: "What is the Korean word for" };

    const response = await request(app)
      .post("/cards/filter?page=0")
      .send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/filter should respond with a 400 status when page number is greater than total pages", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: "Page number is greater than total pages" };
    const requestBody = { content: "What is the Korean word for" };

    const response = await request(app)
      .post("/cards/filter?page=2")
      .send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/filter should respond with a 400 status when content is not provided", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: '"content" is required' };
    const requestBody = {};

    const response = await request(app).post("/cards/filter").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/filter should respond with a 400 status when id is provided in addition to the required content", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: '"_id" is not allowed' };
    const requestBody = {
      _id: "64fea952d0f7efaabb3129d9",
      content: "cat in the hat",
    };

    const response = await request(app).post("/cards/filter").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/filter should respond with a 400 status when required content is not provided", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: '"content" is required' };
    const requestBody = {};

    const response = await request(app).post("/cards/filter").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/filter should respond with a 400 status when id is provided", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: '"content" is required' };
    const requestBody = {
      _id: "64fea952d0f7efaabb3129d9",
    };

    const response = await request(app).post("/cards/filter").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/update should respond with a 200 and the card/body after it has been updated", async () => {
    const expectedStatus = 200;

    const body = {
      _id: "61480db44ab0cf7175467757",
      content: "cat in the hat",
    };

    const response = await request(app).put("/cards/update").send(body);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(body);
  });

  test("POST /cards/update should respond with a 400 status when card is not found", async () => {
    const expectedStatus = 404;
    const expectedBody = { message: "Card not found" };
    const requestBody = {
      _id: "64fea952d0f7efaabb3129d7",
      content: "cat in the hat",
    };

    const response = await request(app).put("/cards/update").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("PUT /cards/update should respond with a 400 status when content is not provided", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: '"content" is required' };
    const requestBody = { _id: "64fc8673e23a8e0fe4ea560b" };

    const response = await request(app).put("/cards/update").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("PUT /cards/update should respond with a 400 status when id is not provided", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: '"_id" is required' };
    const requestBody = { content: "cat in the hat" };

    const response = await request(app).put("/cards/update").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("PUT /cards/update should respond with a 400 status when content and id are not provided", async () => {
    const expectedStatus = 400;
    const expectedBody = { message: '"_id" is required' };
    const requestBody = {};

    const response = await request(app).put("/cards/update").send(requestBody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/delete should respond with a 204 when the card has been deleted", async () => {
    const expectedStatus = 200;

    const expectedBody = {
      _id: "64fc8673e23a8e0fe4ea560c",
      content: "물",
    };

    const requestbody = {
      _id: "64fc8673e23a8e0fe4ea560c",
    };

    const response = await request(app)
      .delete("/cards/delete")
      .send(requestbody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/delete should respond with a 404 when card has not been found", async () => {
    const expectedStatus = 404;

    const expectedBody = { message: "Card not found" };

    const requestbody = {
      _id: "64fc8673e23a8e0fe4ea5692",
    };

    const response = await request(app)
      .delete("/cards/delete")
      .send(requestbody);
    console.log(response.text);
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/delete should respond with a 400 when id has not been provided", async () => {
    const expectedStatus = 400;

    const expectedBody = { message: '"_id" is required' };

    const requestbody = {};

    const response = await request(app)
      .delete("/cards/delete")
      .send(requestbody);
    console.log(response.text);
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/delete should respond with a 400 when required id has not been provided and content has", async () => {
    const expectedStatus = 400;

    const expectedBody = { message: '"_id" is required' };

    const requestbody = {
      content: "물",
    };

    const response = await request(app)
      .delete("/cards/delete")
      .send(requestbody);
    console.log(response.text);
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/delete should respond with a 400 when required id has been provided and content has also", async () => {
    const expectedStatus = 400;

    const expectedBody = { message: '"content" is not allowed' };

    const requestbody = {
      _id: "64fc8673e23a8e0fe4ea560c",
      content: "물",
    };

    const response = await request(app)
      .delete("/cards/delete")
      .send(requestbody);
    console.log(response.text);
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/deleteFiltered should respond with a 200 and any deleted cards", async () => {
    const expectedStatus = 200;

    const expectedBody = [
      {
        _id: "61480db44ab0cf7175467757",
        content: "cat in the hat",
      },
      {
        _id: "64fc8673e23a8e0fe4ea560b",
        content: "What is the Korean word for pizza?",
      },
    ];

    const requestbody = [
      {
        _id: "61480db44ab0cf7175467757",
      },
      {
        _id: "64fc8673e23a8e0fe4ea560b",
      },
    ];

    const response = await request(app)
      .delete("/cards/deleteFiltered")
      .send(requestbody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/deleteFiltered should respond with a 400 when an id is not provided", async () => {
    const expectedStatus = 400;

    const expectedBody = { message: '"[0]._id" is required' };

    const requestbody = [
      {},
      {
        _id: "61480db44ab0cf7175467757",
      },
    ];

    const response = await request(app)
      .delete("/cards/deleteFiltered")
      .send(requestbody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/deleteFiltered should respond with a 400 when ids are not provided", async () => {
    const expectedStatus = 400;

    const expectedBody = { message: '"[0]._id" is required' };

    const requestbody = [{}, {}];

    const response = await request(app)
      .delete("/cards/deleteFiltered")
      .send(requestbody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test("POST /cards/deleteFiltered should respond with a 404 when ids of non existent cards are provided (Were deleted previously)", async () => {
    const expectedStatus = 404;

    const expectedBody = { message: "Cards not found" };

    const requestbody = [
      {
        _id: "61480db44ab0cf7175467757",
      },
      {
        _id: "64fc8673e23a8e0fe4ea560b",
      },
    ];

    const response = await request(app)
      .delete("/cards/deleteFiltered")
      .send(requestbody);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});
