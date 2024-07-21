import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from 'src/modules/user/entities/user.entity';
import { PaymentChannel } from 'src/modules/payment-channel/entities/payment-channel.entity';
import { DataSource } from 'typeorm';
import { UserTawk } from 'src/modules/user/entities/user-tawk.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const paymentFactory = factoryManager.get(PaymentChannel);

    // self.crypto.randomUUID

    const admin = { id: '3e86f702-a335-46fe-8685-a70dd02b720e' } as User;

    const owner = { id: 'b83638ae-d32f-497c-b0d5-fad0054ddb92' } as User;
    const cm = { id: '0ac0fbc4-39aa-4425-9b4d-a79a4b93ea2b' } as User;
    const ma = { id: '86d8bc80-6d9d-472e-bc2d-78786963fa79' } as User;
    const agent = { id: '1e116311-d18c-4338-b0c1-f446d267c10a' } as User;
    const player = { id: '2340a756-4573-40e0-88f4-a99162d9498a' } as User;

    const tawk = await dataSource.getRepository(UserTawk).save({
      propertyId: '668803c39d7f358570d771e7',
      widgetId: '1i21ktd2a',
    } as UserTawk);

    const users = [
      {
        id: owner.id,
        email: 'owner@rcash777.com',
        firstName: 'Juan',
        lastName: 'Della Cruz',
        phoneNumber: '+639392221212',
        address: 'random address 5',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        commission: 50,
        isOwner: true,
      },
      {
        id: cm.id,
        email: 'cm@rcash777.com',
        firstName: 'City',
        lastName: 'Manager',
        phoneNumber: '+639392221212',
        address: 'random address 5',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: owner,
        updatedBy: owner,
        commission: 10,
        isCityManager: true,
      },
      {
        id: ma.id,
        email: 'ma@rcash777.com',
        firstName: 'Master',
        lastName: 'Agent',
        phoneNumber: '+639392221212',
        address: 'random address 5',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: cm,
        updatedBy: cm,
        commission: 5,
        isMasterAgent: true,
      },
      {
        id: agent.id,
        email: 'agent@rcash777.com',
        firstName: 'Agent',
        lastName: 'Lname',
        phoneNumber: '+639392221212',
        address: 'random address 5',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: ma,
        updatedBy: ma,
        commission: 35,
        isAgent: true,
      },
      {
        id: player.id,
        email: 'player@rcash777.com',
        firstName: 'Player',
        lastName: 'Lname',
        phoneNumber: '+639392221212',
        address: 'random address 5',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: agent,
        updatedBy: agent,
        isPlayer: true,
      },
      {
        id: admin.id,
        email: 'isabelle@gmail.com',
        firstName: 'Isabelle',
        lastName: 'Sanchez',
        phoneNumber: '+639394254444',
        address: 'random address 4',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: ma,
        updatedBy: ma,
        commission: 35,
        isAgent: true,
      },
      {
        id: '27b017e0-bd4a-40d6-80f2-2133e3e7fc90',
        email: 'mia@thefirmtech.one',
        firstName: 'Mia Jienel',
        lastName: 'Vidal',
        phoneNumber: '+639394253333',
        address: 'random address 5',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: admin,
        updatedBy: admin,
        isPlayer: true,
      },
      {
        id: 'fee363ca-a909-453f-ae8b-9d5ce739394e',
        email: 'darwin@thefirmtech.one',
        firstName: 'Darwin',
        lastName: 'Chu',
        phoneNumber: '+639394251111',
        address: 'random address 2',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        tawkto: tawk,
        parent: admin,
        updatedBy: admin,
        isPlayer: true,
      },
      {
        id: '723f51ea-9c22-496d-abdb-85901e392900',
        email: 'renz@thefirmtech.one',
        firstName: 'Renz',
        lastName: 'Sanchez',
        phoneNumber: '+639394257777',
        address: 'random address 6',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: admin,
        updatedBy: admin,
        isPlayer: true,
      },
      {
        id: '4c74684d-538b-4fec-848b-cef6640ce342',
        email: 'arjay@thefirmtech.one',
        firstName: 'Arjay',
        lastName: 'Allada',
        phoneNumber: '+639394258888',
        address: 'random address 7',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: admin,
        updatedBy: admin,
        isPlayer: true,
      },
      {
        id: 'e62d259d-2d56-4399-ae57-de767159a5fe',
        email: 'miko@thefirmtech.one',
        firstName: 'Miko',
        lastName: 'Chu',
        phoneNumber: '+639394255454',
        address: 'random address 8',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: admin,
        updatedBy: admin,
        isPlayer: true,
      },
      {
        id: 'aa9ca67f-081f-4ca0-b014-606ab3b5ccf5',
        email: 'gerry@gmail.com',
        firstName: 'Gerry',
        lastName: 'Cruz',
        phoneNumber: '+639394251331',
        address: 'random address 9',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: admin,
        updatedBy: admin,
        isPlayer: true,
      },
      {
        id: '01658469-9043-4d28-9afc-540caeec545b',
        email: 'ryan@gmail.com',
        firstName: 'Ryan',
        lastName: 'Cruz',
        phoneNumber: '+639394257878',
        address: 'random address 3',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: admin,
        updatedBy: admin,
        isPlayer: true,
      },
      {
        id: 'f6f50bea-96d1-4368-9f08-6d6b7e4f7271',
        email: 'kenez@nextral.com',
        firstName: 'Kenez',
        lastName: 'Herczeg',
        phoneNumber: '+639394257888',
        address: 'random address 3',
        password: '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        parent: admin,
        updatedBy: admin,
        isPlayer: true,
      },
    ];

    const treeUser = dataSource.manager.getTreeRepository(User);

    for (const user of users) {
      await treeUser.save(user);
    }

    await paymentFactory.save();
  }
}
