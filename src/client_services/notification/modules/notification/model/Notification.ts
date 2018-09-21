import { plainToClassFromExist } from "class-transformer";

export class Notification {
  sender: Sender;
  receiver: Receiver;
  user_id: string;
  type: string;
  action: string;
  data: any;

  constructor(init?: Partial<Notification>) {
    plainToClassFromExist(this, init);
  }
}

class Sender {
  constructor(init?: Partial<Sender>) {
    plainToClassFromExist(this, init);
  }
  id: string;
  first_name: string;
  last_name: string;
  avatar_id: string;
  email: string;
}

class Receiver {
  constructor(init?: Partial<Receiver>) {
    plainToClassFromExist(this, init);
  }
  id: string;
  first_name: string;
  last_name: string;
  avatar_id: string;
  email: string;
}
