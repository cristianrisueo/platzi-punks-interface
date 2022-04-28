// Importamos librería web3, diseño y rutas
import { useWeb3React } from "@web3-react/core";
import { Grid } from "@chakra-ui/react";
import { Link } from "react-router-dom";

// Importmamos componentes propios
import PunkCard from "../../components/punk-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";

// Importamos hook propio
import { usePlatziPunksData } from "../../hooks/usePlatziPunksData";

const Punks = () => {
  // Si la cuenta está conectada
  const { active } = useWeb3React();

  // Los platziPunks y el spinner
  const { punks, loading } = usePlatziPunksData();

  // Si la cuenta NO está conectada muestra una petición de requerimiento
  if (!active) return <RequestAccess />;

  // De lo contrario muestra el espiner si es true, o los platziPunks si es False
  // Es decir Spinner hasta que los cargue de blockchain
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {punks.map(({ name, image, tokenId }) => (
            <Link key={tokenId} to={`/punks/${tokenId}`}>
              <PunkCard image={image} name={name} />
            </Link>
          ))}
        </Grid>
      )}
    </>
  );
};

// Exportamos la función punks
export default Punks;
