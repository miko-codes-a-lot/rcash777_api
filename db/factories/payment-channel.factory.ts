import { PaymentChannel } from 'src/modules/payment-channel/entities/payment-channel.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(PaymentChannel, () => {
  const admin = { id: '008347f6-0c9b-41e1-86bc-19978e9de440' } as User;

  return PaymentChannel.builder()
    .id('b2de9197-4d7b-4947-bb15-e2d228b444d4')
    .name('Gcash')
    .description('payment through gcash')
    .createdBy(admin)
    .updatedBy(admin)
    .build();
});
