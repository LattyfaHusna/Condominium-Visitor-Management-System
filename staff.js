let staffs;
const { faker } = require('@faker-js/faker');
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
	 * @param {*} staffName 
	 * @param {*} staffpassword 
     * @param {*} staffEmail
	 * @param {*} encryptedPassword
	 */

class Staff {
	static async injectDB(conn) {
		staffs = await conn.db("projectLab_7").collection("staffs")		
	}
    //////////////////////////////*******Password hashing by using bycrypt*******//////////////////////////////
	static async register(staffName, staffEmail,staffpassword,staffrole,staffnumber) {
	
		// TODO: Check if username exists
		const staff = await staffs.findOne({							
			$and: [{ 
				'staff_name': staffName,	
				'staff_email':staffEmail,			
				'staff_password': staffpassword,
                'job_type': staffrole,
                'staffcontact_no': staffnumber
				

			}]
		}).then(async staff =>{
			if (staff) {
				if ( staff.staff_name == staffName )		//Used to check whether the username already exists or not
				{
					return "The staffname already exist!";
				}
			}
			else
			{
				const salt = await bcrypt.genSalt(10);
				const hashed=await bcrypt.hash(staffpassword,salt)
				// TODO: Save user to database			//if the username is not exist, then create new user account
				await staffs.insertOne({					//To insert a new user account in DB
				'staff_name':staffName,	
				'staff_email':staffEmail,			
				'staff_password': hashed,
				
				})
				return "New staff is created";
			}
		})
		return staff;	
	}

	static async login(staffname,staffpassword){
        return staffs.findOne({         
            'staff_name' : staffname
        }).then(async user =>{
    
        // TODO: Validate password,username
        if (user) {
            if(user.staffname != staffname && user.password == staffpassword ){
                return "invalid staffpassword or staffname";
            }
			 
        }
    
        else{
            return "Login succesfully";
        }    

        })
    }

}
	
	module.exports = Staff;


    
