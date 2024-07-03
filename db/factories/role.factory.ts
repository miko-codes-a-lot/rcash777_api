import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Role, () => {
  const admin = { id: '008347f6-0c9b-41e1-86bc-19978e9de440' } as User;
  const permission = { id: 'f9e0084b-bbdc-46cc-a50e-bf227fd2dcf8' } as Permission;

  const role = new Role();
  role.id = '0265377d-b5f1-4e69-a826-593e982d6848';
  role.name = 'Player';
  role.description = 'role for players';
  role.createdBy = admin;
  role.updatedBy = admin;
  role.users = [admin];
  role.permissions = [permission];

  return role;
});
