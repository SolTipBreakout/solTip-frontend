import { useWallet } from "./useWallet";

export function useSocialAccounts() {
  const { socialAccounts, connectSocialAccount, disconnectSocialAccount } = useWallet();

  const getConnectedPlatforms = () => {
    return socialAccounts.filter(account => account.isConnected);
  };

  const getDisconnectedPlatforms = () => {
    return socialAccounts.filter(account => !account.isConnected);
  };

  const getPlatformByName = (platform: string) => {
    return socialAccounts.find(account => account.platform === platform);
  };

  return {
    socialAccounts,
    connectedPlatforms: getConnectedPlatforms(),
    disconnectedPlatforms: getDisconnectedPlatforms(),
    getPlatformByName,
    connectSocialAccount,
    disconnectSocialAccount
  };
}
