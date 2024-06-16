export interface GameDTO {
  gameName: string;
  gameCode: string;
  gameCategory: string;
  providerCode: string;
  isProviderInMaintenance: boolean;
  jackpotClass: string;
  jackpotContribution: number;
  isDemoAllowed: boolean;
  gameTags: string[];
  isFreeroundSupported: boolean;
  rtp: number;
  translations: {
    [key: string]: string;
  };
  images: {
    [key: string]: string;
  };
}
