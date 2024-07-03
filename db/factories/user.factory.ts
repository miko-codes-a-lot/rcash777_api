import { User } from 'src/modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, (faker) => {
  const admin = { id: '008347f6-0c9b-41e1-86bc-19978e9de440' } as User;

  return User.builder()
    .id(admin.id)
    .email('admin@thefirm.tech')
    .firstName('The')
    .lastName('Firm')
    .phoneNumber('+639394252236')
    .address(faker.location.streetAddress())
    .password('$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy')
    .createdBy(admin)
    .updatedBy(admin)
    .build();
});
