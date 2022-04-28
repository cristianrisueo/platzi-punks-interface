import { useCallback, useEffect, useState } from "react";

// Imports the custom hook usePlatziPunks
import usePlatziPunks from "../usePlatziPunks";

// Receives the contract and the tokenId
// Returns the data of the token, including metadata
const getPunkData = async ({ platziPunks, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    platziPunks.methods.tokenURI(tokenId).call(),
    platziPunks.methods.tokenDNA(tokenId).call(),
    platziPunks.methods.ownerOf(tokenId).call(),
    platziPunks.methods.getAccessoriesType(tokenId).call(),
    platziPunks.methods.getAccessoriesType(tokenId).call(),
    platziPunks.methods.getClotheColor(tokenId).call(),
    platziPunks.methods.getClotheType(tokenId).call(),
    platziPunks.methods.getEyeType(tokenId).call(),
    platziPunks.methods.getEyeBrowType(tokenId).call(),
    platziPunks.methods.getFacialHairColor(tokenId).call(),
    platziPunks.methods.getFacialHairType(tokenId).call(),
    platziPunks.methods.getHairColor(tokenId).call(),
    platziPunks.methods.getHatColor(tokenId).call(),
    platziPunks.methods.getGraphicType(tokenId).call(),
    platziPunks.methods.getMouthType(tokenId).call(),
    platziPunks.methods.getSkinColor(tokenId).call(),
    platziPunks.methods.getTopType(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

// Función principal: Mientras carga muestra un spinner, cuando ha
// cargado los punks, muestra estos
const usePlatziPunksData = () => {
  // NFT, Spinner y hook del contrato
  const [punks, setPunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const platziPunks = usePlatziPunks();

  // La función update se ejecuta cada vez que cambia el contrato
  const update = useCallback(async () => {
    // Si el contrato ha sido instanciado
    if (platziPunks) {
      // Loading = True
      setLoading(true);

      // Creamos tokenIds
      let tokenIds;

      // Recogemos el supply total (total de NFT creados)
      const totalSupply = await platziPunks.methods.totalSupply().call();

      // Creamos un array vacío del tamaño de elementos de totalSupply
      tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);

      // Mapeamos todos los tokens minteados en el array creado
      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, platziPunks })
      );

      // Recogemos los datos de punksPromise
      const punks = await Promise.all(punksPromise);

      // Actualizamos la variable punks con la nueva variable punks
      setPunks(punks);

      // Loading = False
      setLoading(false);
    }
  }, [platziPunks]);

  // Use effect que llama a update
  useEffect(() => {
    update();
  }, [update]);

  // Devolvemos las variables loading, punks y la función update
  return {
    loading,
    punks,
    update,
  };
};

const usePlatziPunkData = (tokenId = null) => {
  const [punk, setPunk] = useState({});
  const [loading, setLoading] = useState(true);
  const platziPunks = usePlatziPunks();

  const update = useCallback(async () => {
    if (platziPunks && tokenId != null) {
      setLoading(true);

      const toSet = await getPunkData({ tokenId, platziPunks });
      setPunk(toSet);

      setLoading(false);
    }
  }, [platziPunks, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punk,
    update,
  };
};

// Exporta las funciónes
export { usePlatziPunksData, usePlatziPunkData };
