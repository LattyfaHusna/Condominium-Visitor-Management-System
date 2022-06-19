const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Staff = require("./staff");
const Visitor = require("./visitor");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.lhdjj.mongodb.net/test",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
	Staff.injectDB(client);
	Visitor.injectDB(client);
})

const express = require('express');
const { userInfo } = require("os")
const app = express()
const port = process.env.PORT || 4000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'MyVMS API',
			version: '1.0.0',
		},
	},
	apis: ['./main.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('Hello visitors')
})

app.get('/hello', (req, res) => {
	res.send('Hello and welcome')
})

app.get('/', (req, res) => {
	res.send('Group5 server')
})

app.post('/login', async (req, res) => {
	//console.log(req.body);

	const user = await User.login(req.body.userName, req.body.userpassword);
	if(user=="The Username is invalid"||user=="The Password is invalid"||user=="The Email id is invalid"){
		return res.status(404).send("Wrong login details")
	}
	return res.status(200).send("login success")
})

/**
 * @swagger
 * /login:
 *   post:
 *     description: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               userName: 
 *                 type: string
 *               userpassword: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Wrong login details
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         userName: 
 *           type: string
 *         userpassword: 
 *           type: string
 */

 app.post('/register', async (req, res) => {
	//console.log(req.body);
	const user = await User.register(req.body.userName, req.body.UserEmail,req.body.userpassword,req.body.encryptedPassword);
	if(user=="The username already exist!"){
		return res.status(404).send("The username already exist!")
	}
	return res.status(200).send("New user is created")
	
})

/**
 * @swagger
 * /register:
 *   post:
 *     description: User Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               userName: 
 *                 type: string
 *               userpassword: 
 *                 type: string
 *               email:
 *                 type: string
 *    
 * 				 
 *     responses:
 *       200:
 *         description: New user is created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The username already exist!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         userName: 
 *           type: string
 *         userpassword:
 *           type: string
 *         email: 
 *           type: string
 */

 app.patch('/update', async (req, res) => {
	const user = await User.update(req.body.userName);
	if (user == "The username is wrong"){
		return res.status(404).send("The update is failed")
	}
	return res.status(200).send("The username is updated!")
})

/**
 * @swagger
 * /update:
 *   patch:
 *     description: User Update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *    
 * 				 
 *     responses:
 *       200:
 *         description: The username is updated!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The update is failed
 */

 app.delete('/delete', async (req, res) => {
	//console.log(req.body);
	const user = await User.delete(req.body.userName, req.body.UserEmail,req.body.userpassword);//,req.body.encryptedPassword);
	if(user=="The Username is invalid"||user=="The Password is invalid"||user=="The Email id is invalid"){
		return res.status(404).send("The information is invalid")
	}
	return res.status(200).send("The information is delete successfully")
	
})

/**
 * @swagger
 * /delete:
 *   delete:
 *     description: Delete User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               userName: 
 *                 type: string
 *               userpassword: 
 *                 type: string
 *               userEmail:
 *                 type: string
 *    
 * 				 
 *     responses:
 *       200:
 *         description: The information is delete successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The information is invalid
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         userName: 
 *           type: string
 *         userpassword:
 *           type: string
 *         userEmail: 
 *           type: string
 */

app.post('/register/visitor', async (req, res) => {
	//console.log(req.body);
	const regvstr = await Visitor.register(req.body.visitorName, req.body.visitorEmail,req.body.visitorpassword,req.body.encryptedPassword);
	if(req.user.role == "user"){
	if(regvstr=="The username already exist!"){
		return res.status(404).send("The visitor name already exist!")
	}
	return res.status(200).send("New visitor is created")
	}	
})

/**
 * @swagger
 * /register/visitor:
 *   post:
 *     description: Visitor Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               visitorName: 
 *                 type: string
 *               visitorpassword: 
 *                 type: string
 *               visitorEmail:
 *                 type: string
 *    
 * 				 
 *     responses:
 *       200:
 *         description: New visitor is created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       404:
 *         description: The visitor name already exist!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         visitorName: 
 *           type: string
 *         visitorpassword:
 *           type: string
 *         visitorEmail: 
 *           type: string
 */


app.post('/login/visitor', async (req, res) => {
	//console.log(req.body);

	const logvstr = await Visitor.login(req.body.visitorName, req.body.visitorpassword);
	if(req.user.role == "user"){
	if(logvstr=="The Username is invalid"||logvstr=="The Password is invalid"||logvstr=="The Email id is invalid"){
		return res.status(404).send("Wrong login details")
	}
	return res.status(200).send("login success")
	}
})

/**
 * @swagger
 * /login/visitor:
 *   post:
 *     description: Visitor Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               visitorName: 
 *                 type: string
 *               visitorpassword: 
 *                 type: string
 *               visitorEmail: 
 *                 type: string
 *     responses:
 *       200:
 *         description: login success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       404:
 *         description: Wrong login details
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         visitorName: 
 *           type: string
 *         visitorpassword: 
 *           type: string
 *         visitorEmail: 
 *           type: string
 */

app.post('/login/staff', async (req, res) => {
	//console.log(req.body);

	const logstff = await Staff.login(req.body.staffName, req.body.staffpassword);
	if(req.user.role == "user"){
	if(logstff=="The staffname is invalid"||logstff=="The password is invalid"){
		return res.status(404).send("Wrong login details")
	}
	return res.status(200).send("login success")
}
})

/**
 * @swagger
 * /login/staff:
 *   post:
 *     description: Staff Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               staffname: 
 *                 type: string
 *               staffpassword: 
 *                 type: string
 *     responses:
 *       200:
 *         description: login success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Wrong login details
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         staffname: 
 *           type: string
 *         staffpassword: 
 *           type: string
 */

app.patch('/update/visitor/dateTimeVisit', async (req, res) => {
	const dtvstr = await Visitor.updatedate_time(req.body.visitorName, req.body.dateTimeVisit)
	if(req.user.role == "user"){
	  if (dtvstr == "Visitor does not exist"){
			return res.status(404).send("Visitor does not exist")
	}
	else{
  return res.status(200).json({
		name	: dtvstr.name,
		Updated	: "Date updated"
  })
	}  
	}
	else{
	  return res.status(404).send('Unauthorized')
	}
})

/**
 * @swagger
 * /update/visitor/dateTimeVisit:
 *   patch:
 *     description: Update date and time to visit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               visitorName: 
 *                 type: string
 *               dateTimeVisit: 
 *                 type: string
 *    
 * 				 
 *     responses:
 *       200:
 *         description: Date updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       404:
 *         description: Visitor does not exist
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         visitorName: 
 *           type: string
 *         dateTimeVisit:
 *           type: string

 */

app.patch('/update/visitor/blockFloor', async (req, res) => {
	const dtvstr = await Visitor.updateblock_floor(req.body.visitorName, req.body.blockFloor)
	if(req.user.role == "user"){
	  if (dtvstr == "Visitor does not exist"){
			return res.status(404).send("Visitor does not exist")
	}
	else{
  return res.status(200).json({
		name	: dtvstr.name,
		Updated	: "Floor updated"
  })
	}  
	}
	else{
	  return res.status(404).send('Unauthorized')
	}
})

/**
 * @swagger
 * /update/visitor/blockFloor:
 *   patch:
 *     description: Update block/floor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               visitorName: 
 *                 type: string
 *               blockFloor: 
 *                 type: string
 *    
 * 				 
 *     responses:
 *       200:
 *         description: Floor updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       404:
 *         description: Visitor does not exist
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         visitorName: 
 *           type: string
 *         blockFloor:
 *           type: string
 */

app.patch('/update/visitor/purposeVisit', async (req, res) => {
	const dtvstr = await Visitor.updatepurposeVisit(req.body.visitorName, req.body.purposeVisit)
	if(req.user.role == "user"){
	  if (dtvstr == "Visitor does not exist"){
			return res.status(404).send("Visitor does not exist")
	}
	else{
  return res.status(200).json({
		name	: dtvstr.name,
		Updated	: "Purpose updated"
  })
	}  
	}
	else{
	  return res.status(404).send('Unauthorized')
	}
})

/**
 * @swagger
 * /update/visitor/purposeVisit:
 *   patch:
 *     description: Update purpose of visit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               visitorName: 
 *                 type: string
 *               purposeVisit: 
 *                 type: string
 *    
 * 				 
 *     responses:
 *       200:
 *         description: Purpose updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       404:
 *         description: Visitor does not exist
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         visitorName: 
 *           type: string
 *         purposeVisit:
 *           type: string
 */

app.patch('/update/visitor/noofVisitor', async (req, res) => {
	const dtvstr = await Visitor.updatedate_time(req.body.visitorName, req.body.noofVisitor)
	if(req.user.role == "user"){
	  if (dtvstr == "Visitor does not exist"){
			return res.status(404).send("Visitor does not exist")
	}
	else{
  return res.status(200).json({
		name	: dtvstr.name,
		Updated	: "Number updated"
  })
	}  
	}
	else{
	  return res.status(404).send('Unauthorized')
	}
})


/**
 * @swagger
 * /update/visitor/noofVisitor:
 *   patch:
 *     description: Update number of visitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               visitorName: 
 *                 type: string
 *               noofVisitor: 
 *                 type: string
 *    
 * 				 
 *     responses:
 *       200:
 *         description: Number updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       404:
 *         description: Visitor does not exist
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         visitorName: 
 *           type: string
 *         noofVisitor:
 *           type: string
 */

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", { expiresIn: '60s' });
}

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