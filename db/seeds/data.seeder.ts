import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from 'src/modules/user/entities/user.entity';
import { PaymentChannel } from 'src/modules/payment-channel/entities/payment-channel.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { DataSource } from 'typeorm';
import { UserTawk } from 'src/modules/user/entities/user-tawk.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const paymentFactory = factoryManager.get(PaymentChannel);
    const permissionFactory = factoryManager.get(Permission);
    const roleFactory = factoryManager.get(Role);
    const userTawkFactory = factoryManager.get(UserTawk);

    const admin = { id: '008347f6-0c9b-41e1-86bc-19978e9de440' } as User;
    const admin2 = { id: '3e86f702-a335-46fe-8685-a70dd02b720e' } as User;

    // self.crypto.randomUUID

    const users = [
      {
        id: admin.id,
        email: 'admin@thefirmtech.one',
        firstName: 'The',
        lastName: 'Firm',
        phoneNumber: '+639394252236',
        address: 'random address 1',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin,
        updatedBy: admin,
      },
      {
        id: admin2.id,
        email: 'isabelle@gmail.com',
        firstName: 'Isabelle',
        lastName: 'Sanchez',
        phoneNumber: '+639394254444',
        address: 'random address 4',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin,
        updatedBy: admin,
      },
      {
        id: '7c6e8107-01f1-4fbe-90a4-b28a006662a5',
        email: 'owner@rcash777.com',
        firstName: 'Juan',
        lastName: 'Della Cruz',
        phoneNumber: '+639392221212',
        address: 'random address 5',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin,
        updatedBy: admin,
      },
      {
        id: '27b017e0-bd4a-40d6-80f2-2133e3e7fc90',
        email: 'mia@thefirmtech.one',
        firstName: 'Mia Jienel',
        lastName: 'Vidal',
        phoneNumber: '+639394253333',
        address: 'random address 5',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin,
        updatedBy: admin,
      },
      {
        id: 'fee363ca-a909-453f-ae8b-9d5ce739394e',
        email: 'darwin@thefirmtech.one',
        firstName: 'Darwin',
        lastName: 'Chu',
        phoneNumber: '+639394251111',
        address: 'random address 2',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin2,
        updatedBy: admin2,
      },
      {
        id: '723f51ea-9c22-496d-abdb-85901e392900',
        email: 'renz@thefirmtech.one',
        firstName: 'Renz',
        lastName: 'Sanchez',
        phoneNumber: '+639394257777',
        address: 'random address 6',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin,
        updatedBy: admin,
      },
      {
        id: '4c74684d-538b-4fec-848b-cef6640ce342',
        email: 'arjay@thefirmtech.one',
        firstName: 'Arjay',
        lastName: 'Allada',
        phoneNumber: '+639394258888',
        address: 'random address 7',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin,
        updatedBy: admin,
      },
      {
        id: 'e62d259d-2d56-4399-ae57-de767159a5fe',
        email: 'miko@thefirmtech.one',
        firstName: 'Miko',
        lastName: 'Chu',
        phoneNumber: '+639394255454',
        address: 'random address 8',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin,
        updatedBy: admin,
      },
      {
        id: 'aa9ca67f-081f-4ca0-b014-606ab3b5ccf5',
        email: 'gerry@gmail.com',
        firstName: 'Gerry',
        lastName: 'Cruz',
        phoneNumber: '+639394251331',
        address: 'random address 9',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        createdBy: admin,
        updatedBy: admin,
      },
      {
        id: '01658469-9043-4d28-9afc-540caeec545b',
        email: 'ryan@gmail.com',
        firstName: 'Ryan',
        lastName: 'Cruz',
        phoneNumber: '+639394257878',
        address: 'random address 3',
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
    await userTawkFactory.save();
  }
}
