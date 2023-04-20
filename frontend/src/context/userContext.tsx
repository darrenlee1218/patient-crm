import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUserInfo } from "@config/constant";
import { getCookie } from "cookies-next";

type IContextValue = {
  user: IUserInfo;
  setUser: (user: IUserInfo) => void;
};

const initValue = {
  username: "",
  usermail: "",
  isAdmin: false,
  id: "",
  token: "",
  access: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
};

const UserContext = createContext<IContextValue>({
  user: initValue,
  setUser: () => undefined,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserInfo>(initValue);

  useEffect(() => {
    const userInfo = localStorage.getItem("user-info");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context)
    throw new Error("userUser must be used inside a `UserProvider`");

  return context;
}
