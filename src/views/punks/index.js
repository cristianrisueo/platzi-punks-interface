// Importa web3
import { useWeb3React } from "@web3-react/core";

// Importa los componentes de diseño
import PunkCard from "../../components/punk-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";

const Punks = () => {
  // Crea una instancia de web3
  const { active } = useWeb3React();

  // Si no hay una cartera conectada muestra el componente
  if (!active) return <RequestAccess />;

  return (
    <>
      <p>Gallery</p>
    </>
  );
};

export default Punks;
