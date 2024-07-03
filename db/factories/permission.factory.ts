import { Permission } from 'src/modules/permission/entities/permission.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Permission, () => {
  const admin = { id: '008347f6-0c9b-41e1-86bc-19978e9de440' } as User;

  return Permission.builder()
    .id('f9e0084b-bbdc-46cc-a50e-bf227fd2dcf8')
    .name('Testing')
    .code('testing')
    .createdBy(admin)
    .updatedBy(admin)
    .build();
});
