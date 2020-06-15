const request = require("supertest");
const app = require("../../testApp");
/**
 * @return newUser Response 
 */
const createNewUser = async() => {
    try{
        const newUserResponse = await request(app)
        .post("/auth/sign_up")
        .send({ username: "testUser@gmail.com", password: "theBaerAndBeans" });
        return newUserResponse
    } catch (e) {
        console.log(e)
    }

}

module.exports = createNewUser;