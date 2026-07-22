export class User {

  constructor(
    private firstName: string,
    private lastName: string,
    private email: string,
    private isGuest: boolean,
    private isEmailVerified: boolean,
    private createdAt: Date,
    private updatedAt: Date
  ){
    //this.firstName = firstName;
  }

  get userFirstName() {
    return  this.firstName;
  }

  get isGuestUser() {
    return this.isGuest;
  }
}
