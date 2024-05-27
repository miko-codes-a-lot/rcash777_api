import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from 'src/modules/user/entities/user.entity';

export default class UserSeeder implements Seeder {
  public async run(_, factoryManager: SeederFactoryManager): Promise<void> {
    const userFactory = factoryManager.get(User);

    await userFactory.saveMany(20);
  }
}
