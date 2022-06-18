const MongoClient = require("mongodb").MongoClient;
const Staff = require("./staff");
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");
const saltRounds = 10;
let encryptedPassword;

const username="Haura"
const email="Haura@gmail.com"
const password="001";
///////////////////////*******Creating sample user by using Faker-js********//////////////////////////////////////////////////
//const staffName = faker.name.findName(); 
//const staffEmail = faker.internet.email();
//const staffpassword = faker.internet.password();
//const encryptedPassword = "$2a$05$3pqF8gapjY82H.T4G7LNauba.lObTbsVWsBkAh2jEKl"


bcrypt.genSalt(saltRounds, function (saltError, salt) {
		if (saltError) {
		  throw saltError
		} else {
		  bcrypt.hash(password, salt, function(hashError, hash) {
			if (hashError) {
			  throw hashError
			} else {
				encryptedPassword=hash;
				console.log("Hash:",hash);
			  
			}
		  })
		}
	  })
	//const encryptedPassword = hash

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe("Staff Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(	
		"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.lhdjj.mongodb.net/test",
			{ 
				useNewUrlParser: true
			 }
		);
		Staff.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})


	//Test should be pass , if any new staff is created
	test("New staff registration", async () => {				
		const res = await Staff.register("Azam","Azam@gmail.com","2307")
		expect(res).toBe("New staff is created");		
	})
    
	  
    test("staff login successfully", async () => {
        const res = await Staff.login("Haura", "001")
        expect(res).toBe("Login Successfully")
    })

	function verifyToken(req, res, next) {
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]
	
		if (token == null) return res.sendStatus(404)
	
		jwt.verify(token, "my-super-secret", (err, user) => {
			console.log(err)
	
			if (err) return res.sendStatus(404)
	
			req.user = user
	
			next()
		})
	}
	
	test('should run', () => {
	});
});