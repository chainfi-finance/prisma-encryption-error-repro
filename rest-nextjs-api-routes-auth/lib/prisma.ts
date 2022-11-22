import { PrismaEncryptorMiddleware } from "@prisma-solutions-engineering/prisma-encryptor-middleware";
import { Prisma, PrismaClient } from "@prisma/client";
declare let global: { prisma: PrismaClient };

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

console.log("CMK_ARN: ", process.env.AWS_CMK_ARN);

const encryptorConfig = {
  kms: {
    key: process.env.AWS_CMK_ARN || "",
  },
};

const encryptor = PrismaEncryptorMiddleware(Prisma, encryptorConfig);

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
  prisma.$use(encryptor);
}
export default prisma;
