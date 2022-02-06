import { useMemo } from "react";

// Hook propio, recibe un address y hace un substr
const useTruncatedAddress = (account) => {
  const truncated = useMemo(
    () => `${account?.substr(0, 6)}...${account?.substr(-4)}`,
    [account]
  );

  return truncated;
};

export default useTruncatedAddress;
