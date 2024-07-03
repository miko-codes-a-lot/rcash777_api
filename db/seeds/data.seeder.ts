import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from 'src/modules/user/entities/user.entity';
import { PaymentChannel } from 'src/modules/payment-channel/entities/payment-channel.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';

export default class UserSeeder implements Seeder {
  public async run(_, factoryManager: SeederFactoryManager): Promise<void> {
    const userFactory = factoryManager.get(User);
    const paymentFactory = factoryManager.get(PaymentChannel);
    const permissionFactory = factoryManager.get(Permission);
    const roleFactory = factoryManager.get(Role);

    await userFactory.saveMany(1);
    await paymentFactory.saveMany(1);
    await permissionFactory.saveMany(1);
    await roleFactory.saveMany(1);
  }
}
