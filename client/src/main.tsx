import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Use the environment variable for Privy App ID
const privyAppId = "cm9u2p5us002bib0lrmk95mcs";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={privyAppId}
        config={{
          appearance: {
            theme: "dark",
            accentColor: "#14F195",
            logo: "https://solana.com/src/img/branding/solanaLogoMark.svg",
          },
          loginMethods: ["wallet", "twitter", "discord", "telegram"],
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
          },
        }}
      >
        <App />
      </PrivyProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
