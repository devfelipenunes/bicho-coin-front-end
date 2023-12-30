"use client";

import { mint } from "@/service/Web3Service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";

export default function Rollette() {
  const data = [
    { option: "0" },
    { option: "1" },
    { option: "2" },
    { option: "3" },
  ];
  const router = useRouter();

  const [mustSpin, setMustSpin] = useState(false);
  const [userSelected, setUserSelected] = useState("");
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [message, setMessage] = useState("");
  const [play, setPlay] = useState(false);

  const handleSpinClick = () => {
    if (!userSelected) {
      alert("Selecione um número");
      return;
    }
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  function verificarParOuImpar(numero: number) {
    if (numero % 2 === 0) {
      return "par";
    } else {
      return "impar";
    }
  }

  function game() {
    const escolha = verificarParOuImpar(prizeNumber);

    if (userSelected === escolha) {
      alert("Parabéns, voce ganhou... Aguarde a transação ser concluída");
      mint()
        .then((tx) => {
          alert("Parabens você ganhou!");
          localStorage.removeItem("play");
          setPlay(false);
          router.push("/Roulette");
        })
        .catch((err) =>
          alert("Deu ruim" + err.response ? err.response.data : err.message)
        );
    } else {
      alert("Que pena, voce perdeu");
      localStorage.removeItem("play");
      setPlay(false);
    }
  }

  async function handlePutChips() {
    // setMessage("Transação sendo processada");
    localStorage.setItem("play", "true");
    setPlay(true);
    // approve()
    // .then((tx) => console.log(tx))
    // .catch((err) => alert(err));

    // transferFrom(`${localStorage.getItem("wallet")}`, 1)
    //   .then((tx) => {
    //   })
    //   .catch((err) => alert(err));
    // transfer(1)
    //   .then((tx) => {
    //     localStorage.setItem("play", "true");
    //     setPlay(true);
    //     setMessage("");
    //   })
    //   .catch((err) => alert(err));
  }

  useEffect(() => {
    localStorage.getItem("play") && setPlay(true);
  }, [play]);

  return (
    <div className="text-black bg-white flex justify-center items-center flex-col space-y-5 p-[20px]">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={() => {
          game();
          setMustSpin(false);
        }}
      />
      {play ? (
        <div className="w-full flex flex-col justify-center items-center">
          <p className="text-center mt-[50px]">{message}</p>
          <div className="w-[250px] flex justify-between">
            <div
              onClick={() => setUserSelected("impar")}
              className={`w-[100px] h-[100px] ${
                userSelected === "impar" ? "bg-red-500" : "bg-blue-500"
              } flex justify-center items-center`}
            >
              <p>Ímpar</p>
            </div>
            <div
              onClick={() => setUserSelected("par")}
              className={`w-[100px] h-[100px] ${
                userSelected === "par" ? "bg-red-500" : "bg-blue-500"
              } flex justify-center items-center`}
            >
              <p>Par</p>
            </div>
          </div>
          <div
            className="mt-[50px] w-[250px] h-[50px] bg-red-500 flex justify-center items-center"
            onClick={handleSpinClick}
          >
            <p>Jogar</p>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <p>{message}</p>
          <div
            onClick={handlePutChips}
            className="w-[250px] h-[50px] bg-red-500 flex justify-center items-center"
          >
            <p>Coloque a ficha</p>
          </div>
        </div>
      )}
    </div>
  );
}
