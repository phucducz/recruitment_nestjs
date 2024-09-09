import { User } from 'src/entities/user.entity';

export class UsersConverter {
  entityToBasicInfo(user: User) {
    const { achivements, jobPosition, jobs, password, role, ...others } = user;

    return {
      ...others,
      position: { id: jobPosition?.id, title: jobPosition?.title },
      role: { id: role?.id, title: role?.title },
    };
  }
}
