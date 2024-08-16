import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function sayHello(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/say-hello",
    {
      schema: {
        tags: ["say-hello"],
        summary: "Say hello",
        body: z.object({
          name: z.string(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body;

      return reply.status(201).send({ message: `Hello ${name}` });
    },
  );
}
