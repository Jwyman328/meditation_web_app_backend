const request = require("supertest");
const { MongoClient } = require("mongodb");
const app = require("../testApp");
const createNewUser = require('./setup_funtions/createUser');
const journalsMock = require('./mockData/journalsMock')

describe("test auth router ", () => {
  let connection;
  let db;
  let userToken;
  let today = new Date()

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
  });
  beforeEach(async () => {
    await db.dropDatabase();
    await connection.db(global.__MONGO_DB_NAME__);

  const newUserResponse = await createNewUser()
  userToken = newUserResponse.body.token

  });
  afterEach(async () => {
    await db.dropDatabase(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
    db.dropDatabase(global.__MONGO_DB_NAME__);
  });

  it("should have journal in database after post request", async () => {
    const response = await request(app)
      .post("/journals/").set('Authorization',`Bearer ${userToken}`)
      .send({ text: "my journal", date: today, mood:4});
    
    const journalInDB = await db.collection('journals').find({ text: "my journal", mood:4}).count()
    expect(journalInDB).toEqual(1);
  });

  it("should return 201 status after journals post request", async () => {
    const response = await request(app)
      .post("/journals/").set('Authorization',`Bearer ${userToken}`)
      .send({ text: "my journal", date: today, mood:4});
    expect(response.status).toEqual(201);
  });

  it("should return 400 status after journals post request with non string text input", async () => {
    const response = await request(app)
      .post("/journals/").set('Authorization',`Bearer ${userToken}`)
      .send({ text: 5, date: "3/28/1993", mood:4});
    expect(response.status).toEqual(400);
  });

  it("should return 400 status after journals post request with non number mood input", async () => {
    const response = await request(app)
      .post("/journals/").set('Authorization',`Bearer ${userToken}`)
      .send({ text: 'text value', date: today , mood:'happy'});
    expect(response.status).toEqual(400);
  });

  it("should return 400 status after journals post request with incorrect bearer token", async () => {
    const response = await request(app)
      .post("/journals/").set('Authorization',`Bearer bad token`)
      .send({ text: 'text value', date: today , mood:'happy'});
    expect(response.status).toEqual(401);
  });

  it('should recieve 200 status getting all journals by user after journal created',async() => {
    const postJournalResponse = await request(app)
      .post("/journals/").set('Authorization',`Bearer ${userToken}`)
      .send({ text: "my journal", date: "3/28/1993", mood:4});
    const getJournalResponse = await request(app).get('/journals/').set('Authorization',`Bearer ${userToken}`)
    expect(getJournalResponse.status).toEqual(200)
  })

  it('should recieve the single journal getting all journals by user after journal created',async() => {
    const postJournalResponse = await request(app)
      .post("/journals/").set('Authorization',`Bearer ${userToken}`)
      .send({ text: "my journal", date: "3/28/1993", mood:4});
    const getJournalResponse = await request(app).get('/journals/').set('Authorization',`Bearer ${userToken}`)
    const journal = getJournalResponse.body[0]
    expect(journal.user).toEqual('testUser@gmail.com')
    expect(journal.mood).toEqual(4)
    expect(journal.text).toEqual('my journal')
    expect(journal.date).toBeTruthy()

  })

  it('should recieve 401 status after entering non existent token',async() => {
    const postJournalResponse = await request(app)
      .post("/journals/").set('Authorization',`Bearer ${userToken}`)
      .send({ text: "my journal", date: "3/28/1993", mood:4});
    const getJournalResponse = await request(app).get('/journals/').set('Authorization',`Bearer bad token`)
    expect(getJournalResponse.status).toEqual(401)
  })

  it('should recieve only journals from the past week',async() => {
    const databaseJournalEntry = await db.collection('journals').insertMany(journalsMock)
console.log(databaseJournalEntry)
    const getJournalResponse = await request(app).get('/journals/').set('Authorization',`Bearer ${userToken}`)
    console.log(getJournalResponse.body)
    expect(getJournalResponse.body).toEqual(401)
  })
});
