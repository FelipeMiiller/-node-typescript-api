import { User } from "@src/models/user";
import { AuthMethods } from "@src/util/authMethods";








describe('Users functional tests', () => {



  beforeAll(async () => {
    await User.deleteMany({});
  });




  describe('When creating a user', () => {

    it('Should return 400 when there is a validation error', async () => {

      const newUser = {
        email: 'john@mail.com',
        password: '1234',
      };
      const { body, status } = await global.testRequest.post('/users').send(newUser)


      console.log(body);
      console.log(status);
      expect(status).toBe(400
      );
      expect(body).toEqual({
        code: 400,
        description: "Validation failed!",
        error: [
          {
            king: 'required',
            path: 'name',
            message: 'Path `name` is required.'
          },

        ]

      });
      await User.deleteMany({});
    });


    it('should successfuly create a new user with encrypted password', async () => {

      const newUser = { name: 'John Doe', email: 'john@mail.com', password: '1234' };
      console.log("201 ");
      const { body, status } = await global.testRequest.post('/users').send(newUser)

      console.log(body);
      console.log(status);
      expect(status).toBe(201);

      await expect(AuthMethods.comparePasswords(newUser.password, body.password)).resolves.toBeTruthy();
      expect(body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    });


    it('Should return 400 when the email already exists', async () => {
      const newUser = { name: 'John Doe', email: 'john@mail.com', password: '1234' }

      const { body, status } = await global.testRequest.post('/users').send(newUser);

      console.log(body);
      console.log(status);
      expect(status).toBe(400);
      expect(body).toEqual({
        code: 400,
        description: "Validation failed!",
        error: [{
          king: 'DUPLICATED',
          path: 'email',
          message: 'already exists in the database.'
        }]
      });
    })



  })


  describe('When Authenticating a user', () => {

    it('should gererate a token for a validad user', async () => {
      const newUser = { name: 'John Doe', email: 'john@mail.com', password: '1234' };
      const { body, status } = await global.testRequest.post('/users/authorizate').send(newUser);

      console.log(body);
      console.log(status);

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          token: expect.any(String)
        })
      )
    })


    it('Should return 401 when password is incorrect', async () => {
      const newUser = { email: 'johnd@mail.com', password: '12343' }

      const { body, status } = await global.testRequest.post('/users/authorizate').send(newUser);

      console.log(body);
      console.log(status);
      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        description: "Authentication failed!",
        error: 'User not found'
      });
    })

    it('Should return 401 when password is incorrect', async () => {
      const newUser = { email: 'john@mail.com', password: '12343' }

      const { body, status } = await global.testRequest.post('/users/authorizate').send(newUser);

      console.log(body);
      console.log(status);
      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        description: "Authentication failed!",
        error: 'Password is incorrect'
      });
    })





  })
})
