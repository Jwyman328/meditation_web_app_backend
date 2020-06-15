const request = require("supertest");
const { MongoClient } = require("mongodb");
const app = require("../testApp");

describe("Test auth router.", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterEach(async () => {
    await db.dropDatabase(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
    await db.dropDatabase(global.__MONGO_DB_NAME__);
  });

  it("should create user and get back 201 status", async () => {
    const response = await request(app)
      .post("/auth/sign_up")
      .send({ username: "luckylarry3@gmail.com", password: "theBaerAndBeans" });
    expect(response.status).toEqual(201);
  });
  it("should create user and return user token", async () => {
    const response = await request(app)
      .post("/auth/sign_up")
      .send({ username: "luckylarry3@gmail.com", password: "theBaerAndBeans" });
    expect(response.body.token).toBeTruthy();
  });

  it('should fail signup with non email username',async() => {
    const response = await request(app)
    .post("/auth/sign_up")
    .send({ username: "luckylarry3.com", password: "theBaerAndBeans" });
  expect(response.status).toEqual(400);
  })

  it('should fail signup with empty password',async() => {
    const response = await request(app)
    .post("/auth/sign_up")
    .send({ username: "luckylarry3@gmail.com", password: "" });
  expect(response.status).toEqual(400);
  })


  it("should create user with post and be able to get user in the database with correct data", async () => {
    const response = await request(app)
      .post("/auth/sign_up")
      .send({ username: "luckylarry3@gmail.com", password: "theBaerAndBeans" });
    const userObjFromDb = await db
      .collection("users")
      .findOne({ username: "luckylarry3@gmail.com" });
    expect(userObjFromDb.username).toEqual("luckylarry3@gmail.com");
    expect(userObjFromDb.token).toBeTruthy();
    expect(userObjFromDb.password).toBeTruthy();
  });

  it("should create a hashed password not store the real password", async () => {
    const response = await request(app)
      .post("/auth/sign_up")
      .send({ username: "luckylarry3@gmail.com", password: "theBaerAndBeans" });
    const userObjFromDb = await db
      .collection("users")
      .findOne({ username: "luckylarry3@gmail.com" });
    expect(userObjFromDb.password).not.toEqual("theBaerAndBeans");
  });

  it("should login route after user created", async () => {
    const responseSignUp = await request(app)
      .post("/auth/sign_up")
      .send({ username: "luckylarry3@gmail.com", password: "theBaerAndBeans" });

    const responseLogin = await request(app)
      .post("/auth/login")
      .send({ username: "luckylarry3@gmail.com", password: "theBaerAndBeans" });
    expect(responseLogin.status).toEqual(200);
  });
  it("should return token on login successful response", async () => {
    const responseSignUp = await request(app)
      .post("/auth/sign_up")
      .send({ username: "luckylarry3@gmail.com", password: "theBaerAndBeans" });

    const responseLogin = await request(app)
      .post("/auth/login")
      .send({ username: "luckylarry3@gmail.com", password: "theBaerAndBeans" });
    expect(responseLogin.body.token).toBeTruthy()
  });

  it("should fail login when user does not exist", async () => {
    const responseLogin = await request(app)
      .post("/auth/login")
      .send({ username: "luckylarry3@gmail.com", password: "theBaerAndBeans" });
    expect(responseLogin.status).toBe(401);
  });

});
