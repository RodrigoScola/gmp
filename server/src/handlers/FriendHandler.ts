export class FriendHandler {
  userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }

  async isFriend(userId: string): Promise<boolean> {
    return true;
  }
}
