let visitors;
const { faker } = require('@faker-js/faker');
//const { PHONE_NUMBER } = require('@faker-js/faker/definitions/phone_number');
const bcrypt = require("bcryptjs");
//const staffName = faker.name.findName(); 
//const UserEmail = faker.internet.email();
//const userpassword = faker.internet.password();
const saltRounds = 10;
let encryptedPassword;
/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} visitorName 
	 * @param {*} visitorpassword 
     * @param {*} visitorEmail
	 * @param {*} encryptedPassword
	 */

class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("projectLab_7").collection("visitors")		
	}
    //////////////////////////////*******Password hashing by using bycrypt*******//////////////////////////////
	static async register(visitorName, visitorEmail,visitorpassword,visitorrole,visitornumber,typeVisitor,genderVisitor,carPlate,blockFloor,purposeVisit,noofVisitor,dateTimeVisit) {
	
		// TODO: Check if username exists
		const visitor = await visitors.findOne({							
			$and: [{ 
				'visitor_name': visitorName,	
				'visitor_email':visitorEmail,			
				'visitor_password': visitorpassword,
                'job_type': visitorrole,
                'visitorcontact_no': visitornumber
				

			}]
		}).then(async user =>{
			if (user) {
				if ( user.visitor_name == visitorName )		//Used to check whether the username already exists or not
				{
					return "The visitor name already exist!";
				}
			}
			else
			{
				// TODO: Save user to database			//if the username is not exist, then create new user account
				await visitors.insertOne({					//To insert a new user account in DB
				'visitor_name':visitorName,	
				'visitor_email':visitorEmail,			
				'visitor_password': visitorpassword,
				//'type_visitor': typeVisitor,
				//'gender_visitor': genderVisitor,
				//'car_plate_no': carPlate,

				'block_floor': blockFloor,
				'purpose_visit': purposeVisit,
				'no_visitor': noofVisitor,
				'date_time_visit':dateTimeVisit

				})
				return "New visitor is created";
			}
		})
		return visitor;	
	}

	static async login(visitorName, visitorEmail,visitorpassword) {
		// TODO: Check if username exists
		
		const visitor = await visitors.findOne({														
			$or: [
				{'visitor_name': visitorName},	
                {'visitor_email': visitorEmail},
				{'visitor_password': visitorpassword}
			]				
		}).then(async user =>{		
		// TODO: Validate username , password , email
			if (user) {																	
				if ( user.visitorname != visitorName &&  user.email == visitorEmail && user.password == visitorpassword) {		//Username is Invalid
					return "The Visitor name is invalid";
				}
				else if ( user.visitorname == visitorName && user.email != visitorEmail && user.password == visitorpassword ) {	//Or if the User's Password is Invalid
					return "The Visitor email is invalid";
				}
				else if ( user.visitorname == visitorName && user.email == visitorEmail && user.password != visitorpassword ) {	//Or if the User's Email id is Invalid
					return "The Password is invalid";
				}
				/*else																	//else the username, password and email entered by the user is valid
				{
					// TODO: Return user object
					return visitor;	
				}*/
			}
			else																		//else the the Username doesn't exists / doesn't match 
			{
				return "Login succesfully";
			}
		})
		return visitor;
	}


	static async updatedate_time (visitorName,dateTimeVisit) {
		//To update
		return visitors.findOne({name: visitorName
		}).then(async user =>{
		if(user){
			return visitors.updateOne({name : visitorName},
			{"$set":{ "Date of visit" : dateTimeVisit}} 
			).then(result=>{ 
				console.log(result)})
		}
		else{
			return "Visitor does not exist"}     
		})
	}

	static async updateblock_floor (visitorName,blockFloor) {
		//To update
		return visitors.findOne({name: visitorName
		}).then(async user =>{
		if(user){
			return visitors.updateOne({name : visitorName},
			{"$set":{ "Block and floor to visit" : blockFloor}} 
			).then(result=>{ 
				console.log(result)})
		}
		else{
			return "Visitor does not exist"}     
		})
	}	

	static async updatepurposeVisit (visitorName,purposeVisit) {
		//To update
		return visitors.findOne({name: visitorName
		}).then(async user =>{
		if(user){
			return visitors.updateOne({name : visitorName},
			{"$set":{ "Purpose of visit" : purposeVisit}} 
			).then(result=>{ 
				console.log(result)})
		}
		else{
			return "Visitor does not exist"}     
		})
	}	
	
	static async updateno_visitor(visitorName,noofVisitor) {
			//To update
		return visitors.findOne({name: visitorName
		}).then(async user =>{
		if(user){
			return visitors.updateOne({name : visitorName},
			{"$set":{ "Number of visitor" : noofVisitor}} 
			).then(result=>{ 
				console.log(result)})
		}
		else{
			return "Visitor does not exist"}     
		})
	}
}	
	module.exports = Visitor;

	