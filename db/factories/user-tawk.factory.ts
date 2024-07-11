import { UserTawk } from 'src/modules/user/entities/user-tawk.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserTawk, () => {
  const admin = { id: '3e86f702-a335-46fe-8685-a70dd02b720e' } as User;

  const tawk = new UserTawk();
  tawk.propertyId = '668803c39d7f358570d771e7';
  tawk.widgetId = '1i21ktd2a';

  tawk.users = [admin];

  return tawk;
});
