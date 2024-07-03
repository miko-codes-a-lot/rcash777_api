import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from 'src/modules/user/entities/user.entity';
import { PaymentChannel } from 'src/modules/payment-channel/entities/payment-channel.entity';

export default class UserSeeder implements Seeder {
  public async run(_, factoryManager: SeederFactoryManager): Promise<void> {
    const userFactory = factoryManager.get(User);
    const paymentFactory = factoryManager.get(PaymentChannel);

    await userFactory.saveMany(1);
    await paymentFactory.saveMany(1);
  }
}
