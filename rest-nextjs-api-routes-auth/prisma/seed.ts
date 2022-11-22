import { PrismaEncryptorMiddleware } from "@prisma-solutions-engineering/prisma-encryptor-middleware";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const encryptorConfig = {
  kms: {
    key: process.env.AWS_CMK_ARN || "",
  },
};

const encryptor = PrismaEncryptorMiddleware(Prisma, encryptorConfig);
prisma.$use(encryptor);

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    posts: {
      create: [
        {
          title: "Join the Prisma Slack (Encrypted field)",
          content: "https://slack.prisma.io",
          published: true,
          testEncryptedField: "this value should get encrypted",
        },
      ],
    },
  },
  {
    name: "Nilu",
    email: "nilu@prisma.io",
    posts: {
      create: [
        {
          title: "Follow Prisma on Twitter",
          content: "https://www.twitter.com/prisma",
          published: true,
          testEncryptedField: "this value should get encrypted",
        },
      ],
    },
  },
  {
    name: "Mahmoud",
    email: "mahmoud@prisma.io",
    posts: {
      create: [
        {
          title: "Ask a question about Prisma on GitHub",
          content: "https://www.github.com/prisma/prisma/discussions",
          published: true,
          testEncryptedField: "this value should get encrypted",
        },
        {
          title: "Prisma on YouTube",
          content: "https://pris.ly/youtube",
          testEncryptedField: "this value should get encrypted",
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
