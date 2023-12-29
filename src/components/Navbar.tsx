"use client";

import { doLogin, doLogout, getBalance } from "@/service/Web3Service";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
// import { useRouter as routerUrl } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const urlAtual = window.location.href;
  const parteAposUltimaBarra = urlAtual.slice(urlAtual.lastIndexOf("/"));

  const [user, setUser] = useState({
    logged: localStorage.getItem("wallet") ? true : false,
    wallet: localStorage.getItem("wallet"),
    balance: localStorage.getItem("balance"),
  });

  function redirectAfterLogin(isLogged: boolean) {
    if (isLogged) parteAposUltimaBarra === "/" && router.push("/SlotRoom");
    else router.push("/");
  }

  function handleLogin() {
    doLogin()
      .then((account) => {
        setUser({ ...user, wallet: account, logged: true });
      })
      .catch((error) => {});
  }

  function handleLogout() {
    const user = doLogout();
    user && setUser(false);
  }

  useEffect(() => {
    redirectAfterLogin(user.logged ? true : false);
    getBalance()
      .then((balance) => {
        setUser({
          ...user,
          balance: balance,
        });
      })
      .catch((error) => {
        alert(error);
      });
  }, [user.logged]);

  return (
    <div className="px-10 py-5 bg-black text-white">
      <div className="flex justify-between items-center">
        <div>
          {user ? (
            <div>
              <p className="text-[10px]">User: {user?.wallet?.slice(-5)}</p>
              <p className="text-[10px]">Saldo: {user?.balance}</p>
            </div>
          ) : (
            <p>Bicho</p>
          )}
        </div>
        <div>
          {user.logged ? (
            <>
              <Button
                onClick={handleLogout}
                variant="outlined"
              >
                Desconectar
              </Button>
            </>
          ) : (
            <Button
              onClick={handleLogin}
              variant="outlined"
            >
              Conect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
