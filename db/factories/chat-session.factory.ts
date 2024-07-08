import { ChatSession } from 'src/modules/user/entities/chat-session.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(ChatSession, () => {
  const admin = { id: '008347f6-0c9b-41e1-86bc-19978e9de440' } as User;
  const user = { id: 'fee363ca-a909-453f-ae8b-9d5ce739394e' } as User;

  return ChatSession.builder()
    .id('cb33c525-ed10-4b4d-8996-a0e1a4a6b259')
    .user(user)
    .propertyId('668803c39d7f358570d771e7')
    .widgetId('1i21ktd2a')
    .updatedBy(admin)
    .createdBy(admin)
    .build();
});
