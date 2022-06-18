const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor");
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");
const saltRounds = 10;
let encryptedPassword;

const username="Qalifa"
const email="Qalifa@gmail.com"
const password="2022"
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

describe("Visitor Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(	
		"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.lhdjj.mongodb.net/test",
			{ 
				useNewUrlParser: true
			 }
		);
		Visitor.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})


	//Test should be pass , if any new visitor is created
	test("New visitor registration", async () => {				
		const res = await Visitor.register("Asma","Asma@gmail.com","1997")
		expect(res).toBe("New visitor is created");		
	})
    // To detect the duplicate visitor - test will be passed if any duplicate visitor was found during the visitor sign up 
	test("Duplicate visitorname", async () => {
		const res = await Visitor.register("Iifa","Iifa@gmail.com","2506",)
		expect(res).toBe("The visitor name already exist!");
	})

	//If the username do not match to any usernames saved in db
	test("Visitor login invalid visitor name", async () => {
		const res = await Visitor.login("chanyeol","Iifa@gmail.com","2506")
		expect(res).toBe("The visitor name is invalid");
	})

	//If the password do not match to any passwords saved in db
	test("Visitor login invalid password", async () => {
		const res = await Visitor.login("Qalifa","Qalifa@gmail.com","3456")
		expect(res).toBe("The Password is invalid");
	})

	//If the email id do not match to any email ids saved in db
	test("Visitor login invalid visitor email", async () => {
		const res = await Visitor.login("Qalifa","123@gmail.com","2022")
		expect(res).toBe("The visitor email is invalid");
	})

	test("Visitor login successfully", async () => {
        const res = await Visitor.login("Qalifa", "2022")
        expect(res).toBe("Login Successfully")
    })

	test("Update Date of visit", async()=>{
        const res = await Visitor.updatedate_time("Iifa","25/06/2022")
        expect(res).toBe("Date updated")
    })

	test("Update Block and floor to visit", async()=>{
        const res = await Visitor.updateblock_floor("Iifa","3")
        expect(res).toBe("Floor updated")
    })

	test("Update Purpose of visit", async()=>{
        const res = await Visitor.updatepurposeVisit("Iifa","Hari Raya")
        expect(res).toBe("Purpose updated")
    })

	test("Update Number of visitor", async()=>{
        const res = await Visitor.updateno_visitor("Iifa","6")
        expect(res).toBe("Number updated")
    })
	
	test('should run', () => {
	});
});