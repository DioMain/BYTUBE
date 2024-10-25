import AuthState from "@type/AuthState";
import { User } from "@type/User";
import { makeAutoObservable } from "mobx";

class UserStore {
  value?: User = undefined;

  status: AuthState = AuthState.Loading;
  error = "";

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (value?: User) => {
    this.value = value;
  };

  setStatus = (value: AuthState) => {
    this.status = value;
  };

  setError = (value: string) => {
    this.error = value;
  };
}

export default new UserStore();
