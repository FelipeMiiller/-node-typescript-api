import { User } from "../../src/models/user";
import { AuthMethods } from "../../src/util/authMethods";








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


      expect(status).toBe(406);
      expect(body).toEqual({
        code: 406,
        description: "Validation failed!",
        error: "Not Acceptable",
        message: JSON.stringify([
          {
            king: 'required',
            path: 'name',
            message: 'Path `name` is required.'
          }]),

      });
      await User.deleteMany({});
    });


    it('should successfuly create a new user with encrypted password', async () => {

      const newUser = { name: 'John Doe', email: 'john@mail.com', password: '1234' };
      const { body, status } = await global.testRequest.post('/users').send(newUser)


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

      expect(status).toBe(406);
      expect(body).toEqual({
        code: 406,
        description: "Validation failed!",
        error: "Not Acceptable",
        message: JSON.stringify([{
          king: 'DUPLICATED',
          path: 'email',
          message: 'already exists in the database.'
        }])
      });
    })



  })


  describe('When Authenticating a user', () => {

    it('should gererate a token for a validad user', async () => {
      const newUser = { name: 'John Doe', email: 'john@mail.com', password: '1234' };
      const { body, status } = await global.testRequest.post('/users/authorizate').send(newUser);



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


      expect(status).toBe(401);
      expect(body).toEqual({
        message: 'User not found', code: 401, error: 'Unauthorized', description: 'Authentication failed!'
      });
    })

    it('Should return 401 when password is incorrect', async () => {
      const newUser = { email: 'john@mail.com', password: '12343' }

      const { body, status } = await global.testRequest.post('/users/authorizate').send(newUser);

      expect(status).toBe(401);
      expect(body).toEqual({
        message: 'Password is incorrect',
        code: 401,
        error: 'Unauthorized',
        description: 'Authentication failed!'
      });
    })

  })
})
