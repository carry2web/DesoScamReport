import { Avatar } from './Avatar';

const mockProfile = {
    "PublicKeyBase58Check": "BC1YLjUapzpeqaaFj4XeZVZXwgkXbj1fSL7ZhuYLK4LK3F12hTXgCFx",
    "Username": "TheNextKillerApp",
    "Description": "The Next Killer App by @brootle\n\nhttps://www.gemstori.com/@TheNextKillerApp 🔥\n\nhttps://openfund.com/d/TheNextKillerApp 💰\n\nhttps://github.com/brootle/deso-templates 💻\n",
    "IsHidden": false,
    "IsReserved": false,
    "IsVerified": false,
    "Comments": null,
    "Posts": null,
    "CoinEntry": {
        "CreatorBasisPoints": 10000,
        "DeSoLockedNanos": 1,
        "NumberOfHolders": 2,
        "CoinsInCirculationNanos": 277288,
        "CoinWatermarkNanos": 37003892105,
        "BitCloutLockedNanos": 1
    },
    "DAOCoinEntry": {
        "NumberOfHolders": 12,
        "CoinsInCirculationNanos": "0xc044c4b94cf0d748a74",
        "MintingDisabled": true,
        "TransferRestrictionStatus": "permanently_unrestricted",
        "LockupTransferRestrictionStatus": "unrestricted"
    },
    "CoinPriceDeSoNanos": 10819,
    "CoinPriceBitCloutNanos": 10819,
    "UsersThatHODL": null,
    "IsFeaturedTutorialWellKnownCreator": false,
    "IsFeaturedTutorialUpAndComingCreator": false,
    "ExtraData": {
        "DAOPublicKeysPurchased": "BC1YLjUapzpeqaaFj4XeZVZXwgkXbj1fSL7ZhuYLK4LK3F12hTXgCFx,BC1YLgcwvXPjeiYBVUDybtaw6GeYDmv6qurDts5DVoR1XG2v2WRvWdw,BC1YLj3zNA7hRAqBVkvsTeqw7oi4H6ogKiAFL1VXhZy6pYeZcZ6TDRY,BC1YLidfSBwkLHaPg12wxWZj34q2sjTudqkb8LgNHcxVhvo6mopyQqp,BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N,BC1YLfsfCCUYvD146UuFzBCJfVJiqCahEywqLHuhkpZoUrihDqA1M3j,BC1YLiUN3RwRJhjKZHCbp1Cow8amiKnqwdkcNTdYPbnL6ReocA8Fbsr,BC1YLis5iZ2HGaFj1yFC2Ya8kckLG8L736DajqTQxscaJ6qX9Z9Fka4,BC1YLiUt3iQG4QY8KHLPXP8LznyFp3k9vFTg2mhhu76d1Uu2WMw9RVY,BC1YLfqtePcmDBpDa8mtSPNBcVWywgnFXwavrdprpbJTXh3sRNwxsLE",
        "DerivedPublicKey": "BC1YLgea2VniuHxFamZXD9uP67szVPLmfiusgmMjguwSULsbqffQM1K",
        "DiscordURL": "",
        "DisplayName": "The Next Killer App",
        "FeaturedImageURL": "https://images.deso.org/e07ac0e3c88951403580214965602b6c940a0826238feb5d18a601375a91272b.webp",
        "LargeProfilePicURL": "https://images.deso.org/fd360a4b13a07b17e5c693df4beb50596fd3c25e367a780e79167746c96c80fb.webp",
        "MarkdownDescription": "# Templates for simple \"Hello World\" apps built on DeSo Protocol API\n\n**May 2, 2023 UPDATE: I have decided to run another $500 fundraising round. Since OpenProsper is gone, I want to put more effort into development of DeSo Transactions Monitor https://deso-transactions.netlify.app/, right now it shows real time transactions feed from DeSo MemPool, the idea is to add transactions by user and expand functionality and publish source code, so other people can use it as example for their projects.**\n\n**1st DeSo Arcade Game** https://deso-games.netlify.app/ and **DeSo Voting Machine** https://deso-voting-machine.netlify.app/ were built on these **DeSo Templates**.\n\nRight now there are 2 simple apps in **ReactJS** and **NextJS**, NextJS app is same ReactJS app, but adapted for NextJS. So devs can clone them and experiment with DeSo Protocol **https://github.com/deso-protocol**\n\n## Here is what those apps can do out of the box\n\n✔ Authorize user with Derived Keys using DeSo Identity service\n\n✔ Load user profile to get username and profile image  \n\n✔ Switch between authorized users.  \n\n✔ Create and Submit Post Transaction\n\nTo see apps in action you must have profile at DeSo. \nThese template apps are deployed to **Netlify** and **Vercel** from this repository https://github.com/brootle/deso-templates. Here are the links:\n\nhttps://deso-template.netlify.app/\t- ReactJS\n\nhttps://deso-template.vercel.app/\t- NextJS\n\nThose apps are using **DeSo Identity** JavaScript library to create and sign transactions https://www.npmjs.com/package/@deso-core/identity \n\nIf you have some questions you can find me by **brootle** username on apps that run on DeSo Protocol, link https://www.gemstori.com/@brootle",
        "TelegramURL": "",
        "TwitterURL": "",
        "WebsiteURL": "https://github.com/brootle/deso-templates"
    },
    "DESOBalanceNanos": 104639436,
    "BestExchangeRateDESOPerDAOCoin": 0.054913523
}

const themeDecorator = (theme) => (Story) => (
  <div data-theme={theme} style={{ padding: '1rem', background: theme === 'light' ? '#fff' : '#1d2125' }}>
    <Story />
  </div>
);

export default {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 24, 38, 64],
    },
  },
};

// === DEFAULT ===
export const DefaultDark = {
  name: 'Default (Dark Theme)',
  args: {
    profile: mockProfile,
    size: 'medium',
  },
  decorators: [themeDecorator('dark')],
};

export const DefaultLight = {
  name: 'Default (Light Theme)',
  args: {
    profile: mockProfile,
    size: 'medium',
  },
  decorators: [themeDecorator('light')],
};

// === SMALL ===
export const SmallDark = {
  args: {
    profile: mockProfile,
    size: 'small',
  },
  decorators: [themeDecorator('dark')],
};

export const SmallLight = {
  args: {
    profile: mockProfile,
    size: 'small',
  },
  decorators: [themeDecorator('light')],
};

// === LARGE ===
export const LargeDark = {
  args: {
    profile: mockProfile,
    size: 'large',
  },
  decorators: [themeDecorator('dark')],
};

export const LargeLight = {
  args: {
    profile: mockProfile,
    size: 'large',
  },
  decorators: [themeDecorator('light')],
};

// === FALLBACK ===
export const FallbackDark = {
  args: {
    profile: null,
    size: 'medium',
  },
  decorators: [themeDecorator('dark')],
};

export const FallbackLight = {
  args: {
    profile: null,
    size: 'medium',
  },
  decorators: [themeDecorator('light')],
};
