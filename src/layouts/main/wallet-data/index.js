import {
  Flex,
  Button,
  Tag,
  TagLabel,
  Badge,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { connector } from "../../../config/web3";
import { useCallback, useEffect, useState } from "react";
import useTruncatedAddress from "../../../hooks/useTruncatedAddress";

const WalletData = () => {
  // Balance de la cartera
  const [balance, setBalance] = useState(0);

  // Propiedades de web3
  const { active, activate, deactivate, account, error, library } =
    useWeb3React();

  // True o False si la red es soportada
  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  // Conecta la cartera usando el conector creado anteriormente y guarda
  // en localstorage booleano
  const connect = useCallback(() => {
    activate(connector);
    localStorage.setItem("previouslyConnected", "true");
  }, [activate]);

  // Desconecta la cartera y borra el boleano de localstorage
  const disconnect = () => {
    deactivate();
    localStorage.removeItem("previouslyConnected");
  };

  // Obtiene el balance de la cartera y lo redondea
  const getBalance = useCallback(async () => {
    const toSet = await library.eth.getBalance(account);
    setBalance((toSet / 1e18).toFixed(2));
  }, [library?.eth, account]);

  // Si la cartera está conectada obtiene su balance
  // Para que carge el balance automáticamente despues de conectar
  useEffect(() => {
    if (active) getBalance();
  }, [active, getBalance]);

  // Si existe el booleano en localstorage conecta la cartera
  // Para cuando recarguemos la página
  useEffect(() => {
    if (localStorage.getItem("previouslyConnected") === "true") connect();
  }, [connect]);

  // Hook proio que hace un substr de la cartera
  const truncatedAddress = useTruncatedAddress(account);

  return (
    <Flex alignItems={"center"}>
      {/* Si la cartera está conectada */}
      {active ? (
        <Tag colorScheme="green" borderRadius="full">
          <TagLabel>
            <Link to="/punks">{truncatedAddress}</Link>
          </TagLabel>
          <Badge
            d={{
              base: "none",
              md: "block",
            }}
            variant="solid"
            fontSize="0.8rem"
            ml={1}
          >
            {balance} Ξ
          </Badge>
          <TagCloseButton onClick={disconnect} />
        </Tag>
      ) : (
        // Si la cartera NO está conectada
        <Button
          variant={"solid"}
          colorScheme={"green"}
          size={"sm"}
          leftIcon={<AddIcon />}
          onClick={connect}
          disabled={isUnsupportedChain}
        >
          {isUnsupportedChain ? "Red no soportada" : "Conectar wallet"}
        </Button>
      )}
    </Flex>
  );
};

export default WalletData;
