import { User } from 'src/entities/user.entity';

type AuthSignInResponse = Partial<User> & {
  accessToken?: string;
  message: string;
  statusCode: number;
};
