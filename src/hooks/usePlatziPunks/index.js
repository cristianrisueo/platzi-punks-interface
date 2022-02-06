// useMemo se usa para evitar cálculos innecesarios
import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";

// Importamos los datos del contrato (su Json)
import PlatziPunksArtifact from "../../config/web3/artifacts/PlatziPunks";

// Obtenemos el address y el abi
const { address, abi } = PlatziPunksArtifact;

const usePlatziPunks = () => {
  // Define los métodos de web3 que vamos a usar
  const { active, library, chainId } = useWeb3React();

  // Crea platziPunks solo cuando existe active, chainId y
  // library... para esto sirve useMemo
  const platziPunks = useMemo(() => {
    // Si hay una wallet conectada
    if (active) return new library.eth.Contract(abi, address[chainId]);
  }, [active, chainId, library?.eth?.Contract]);

  // Deuvelve el contrato creado
  return platziPunks;
};

export default usePlatziPunks;
