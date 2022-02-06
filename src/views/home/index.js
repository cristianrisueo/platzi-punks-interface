// Imports
import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import usePlatziPunks from "../../hooks/usePlatziPunks";

const Home = () => {
  // Variable usada para cambiar el estado del botón obtener punk
  const [isMinting, setIsMinting] = useState(false);
  // Ruta de la imagen
  const [imageSrc, setImageSrc] = useState("");
  // Supply máximo (Total de NFT minteados) y sup. total disponible
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  // Métodos de Web3: Si está conectado y la cuenta conectada
  const { active, account } = useWeb3React();

  // Hook que instancia el contrato
  const platziPunks = usePlatziPunks();

  // Hook que permite mostrar mensajes por pantalla
  const toast = useToast();

  // Cada vez que cambie platziPunks o account se llama al useEffect
  // que llama a esta función
  const getPlatziPunksData = useCallback(async () => {
    if (platziPunks) {
      // Llama al método del contrato para obtener el supply total
      const totalSupply = await platziPunks.methods.totalSupply().call();
      // Modifica el valor de totalSupply
      setTotalSupply(totalSupply);

      // Llama al método del contrato para obtener el supply máximo
      const maxSupply = await platziPunks.methods.maxSupply().call();
      // Modifica el valor de totalSupply
      setMaxSupply(maxSupply);

      // Llama al método del contrato para obtener el ADN del PlatziPunk
      const dnaPreview = await platziPunks.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call();

      // Llama al método del contrato para obtener la imagen
      const image = await platziPunks.methods.imageByDNA(dnaPreview).call();

      // Asigna la imagen obtenida a la variable creada antes
      setImageSrc(image);
    }
  }, [platziPunks, account]);

  // Llamada a la función getPlatziPunksData
  useEffect(() => {
    getPlatziPunksData();
  }, [getPlatziPunksData]);

  // Función que mintea un token
  const mint = () => {
    // Actualiza la variable isMinting a true
    setIsMinting(true);

    // Llamamos a la función del contrato mint(), minteamos un NFT
    // y escuchamos los eventos devueltos con .on
    platziPunks.methods
      .mint()
      .send({
        from: account,
      })
      .on("transactionHash", (txHash) => {
        // Muestra un mensaje en la interfaz
        toast({
          title: "Transacción enviada",
          description: txHash,
          status: "info",
        });

        // Actualiza la variable IsMinting a false
        setIsMinting(false);
      })
      .on("receipt", () => {
        // Muestra un mensaje en la interfaz
        toast({
          title: "Transacción confirmada",
          description: "Nunca pares de aprender!",
          status: "success",
        });

        // Actualiza la variable IsMinting a false
        setIsMinting(false);
      })
      .on("error", (error) => {
        // Muestra un mensaje en la interfaz
        toast({
          title: "Transacción fallida",
          description: error.message,
          status: "error",
        });

        // Actualiza la variable IsMinting a false
        setIsMinting(false);
      });
  };

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "green.400",
              zIndex: -1,
            }}
          >
            Un Platzi Punk
          </Text>
          <br />
          <Text as={"span"} color={"green.400"}>
            nunca para de aprender
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Platzi Punks es una colección de Avatares randomizados cuya metadata
          es almacenada on-chain. Poseen características únicas y sólo hay
          10.000 en existencia.
        </Text>
        <Text color={"green.500"}>
          Cada Platzi Punk se genera de forma secuencial basado en tu address,
          usa el previsualizador para averiguar cuál sería tu Platzi Punk si
          minteas en este momento
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
            disabled={!platziPunks}
            onClick={mint}
            isLoading={isMinting}
          >
            Obtén tu punk
          </Button>
          <Link to="/punks">
            <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
              Galería
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={active ? imageSrc : "https://avataaars.io/"} />
        {/* Si hay una wallet activa */}
        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  1
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="green">
                  0x0000...0000
                </Badge>
              </Badge>
            </Flex>
            <Flex mt={2}>
              <Badge>
                NFT Minteados:
                <Badge ml={1} colorScheme="green">
                  {totalSupply}
                </Badge>
              </Badge>
              <Badge ml={2}>
                NFT Disponibles:
                <Badge ml={1} colorScheme="green">
                  {maxSupply}
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getPlatziPunksData}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Actualizar
            </Button>
          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}
      </Flex>
    </Stack>
  );
};

export default Home;
