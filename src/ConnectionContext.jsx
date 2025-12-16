import React from "react";

const ConnectionContext = React.createContext();

export const ConnectionProvider = ({ children }) => {
  const [isConnected, setIsConnected] = React.useState(false);

  return (
    <ConnectionContext.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const connection = React.useContext(ConnectionContext);
  if (!connection) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return connection;
};
