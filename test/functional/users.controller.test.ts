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

    beforeAll(async () => {
      await User.deleteMany({});



    });


    it('should gererate a token for a validad user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      const { email } = await new User(newUser).save();



      const { body, status } = await global.testRequest.post('/users/authorizate').send({ email, password: newUser.password });



      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          token: expect.any(String)
        })
      )
    })


    it('Should return 401 when email is incorrect', async () => {
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
    describe('When getting user profile info', () => {
      it(`Should return the token's owner profile information`, async () => {
        const newUser = {
          name: 'John Doe',
          email: 'joh@mail.com',
          password: '1234',
        };
        const { email, name, password, id } = await new User(newUser).save();
        const user = { email, name, password, id };
        const token = AuthMethods.generateToken(user);

        const { body, status } = await global.testRequest
          .get('/users/me')
          .set({ 'x-access-token': token });

        expect(status).toBe(200);
        expect(body).toMatchObject(user)
      });

      it(`Should return Not Found, when the user is not found`, async () => {
        const newUser = {
          name: 'John Doe',
          email: 'johh@mail.com',
          password: '1234',
        };

        const user = new User(newUser);
        const token = AuthMethods.generateToken(user.toJSON());
        const { body, status } = await global.testRequest
          .get('/users/me')
          .set({ 'x-access-token': token });

        expect(status).toBe(404);
        expect(body).toEqual({ message: 'User not found', code: 404, error: 'Not Found' });
      });
    });
  })

})