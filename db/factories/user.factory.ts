import { ERoles } from 'src/enums/roles.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, (faker) => {
  const user = new User();

  user.email = faker.internet.email();
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.phoneNumber = faker.phone.number();
  user.address = faker.location.streetAddress();
  user.password = '$2b$10$3rSxQ9Dg.WndZoW9zrZcmOGrih2I6BKWL81mwRmlSuRE6Upqviq4a'; // user123
  // user.role = ERoles.USER;

  return user;
});
