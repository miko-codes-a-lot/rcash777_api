import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from 'src/modules/user/entities/user.entity';
import { PaymentChannel } from 'src/modules/payment-channel/entities/payment-channel.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { ChatSession } from 'src/modules/user/entities/chat-session.entity';
import { DataSource } from 'typeorm';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const paymentFactory = factoryManager.get(PaymentChannel);
    const permissionFactory = factoryManager.get(Permission);
    const roleFactory = factoryManager.get(Role);
    const chatSessionFactory = factoryManager.get(ChatSession);

    const admin = { id: '008347f6-0c9b-41e1-86bc-19978e9de440' } as User;
    const users = [
      {
        id: admin.id,
        email: 'admin@thefirm.tech',
        firstName: 'The',
        lastName: 'Firm',
        phoneNumber: '+639394252236',
        address: 'random address 1',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin,
        updatedBy: admin,
      },
      {
        id: 'fee363ca-a909-453f-ae8b-9d5ce739394e',
        email: 'darwin@gmail.com',
        firstName: 'Darwin',
        lastName: 'Chu',
        phoneNumber: '+639394251111',
        address: 'random address 2',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin,
        updatedBy: admin,
      },
    ];

    const userRepo = dataSource.getRepository(User);
    await userRepo.insert(users);

    await paymentFactory.save();
    await permissionFactory.save();
    await roleFactory.save();
    await chatSessionFactory.save();
  }
}
