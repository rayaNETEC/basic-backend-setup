import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function getHelloWorld(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/hello-world",
    {
      schema: {
        tags: ["wello-world"],
        summary: "Simple route",
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(201).send({ message: "Hello World" });
    },
  );
}
