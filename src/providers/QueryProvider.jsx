import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const QueryProvider = ({ Children }) => {
  return (
    <QueryClientProvider client={queryClient}>{Children}</QueryClientProvider>
  );
};

export default QueryProvider;
