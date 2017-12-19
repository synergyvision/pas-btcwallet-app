// Placeholder Class/Interface for the data of the logged user

export class User {
    public name: string;
    public email: string;
    public address: string;
    public code: string;

    constructor(name, email, address, code) {
      this.name = name;
      this.email = email;
      this.address = address;
      this.code = code;
    }
  }
