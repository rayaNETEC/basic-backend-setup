import axios, { AxiosError, AxiosResponse } from "axios";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { env } from "#/env/index.js";

const releaseSchema = z.array(
  z.object({
    id: z.number(),
    tag_name: z.string(),
    name: z.string().nullable(),
    body: z.string().nullable(),
    published_at: z.string(),
    html_url: z.string(),
    draft: z.boolean(),
    prerelease: z.boolean(),
  }),
);

type Release = z.infer<typeof releaseSchema>[number];

interface GitHubErrorResponse {
  message: string;
  documentation_url?: string;
}

/**
 * Registers the "/releases" GET route that returns GitHub releases as JSON.
 *
 * @param app - Fastify instance
 */
export async function getReleases(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/releases",
    {
      schema: {
        tags: ["releases"],
        summary: "Get GitHub releases as JSON",
        response: {
          200: releaseSchema,
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const response: AxiosResponse<Release[]> = await axios.get(
          `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/releases`,
          {
            headers: {
              Authorization: `token ${env.GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        const releases = response.data.filter((r) => !r.draft && !r.prerelease);

        return reply.status(200).send(releases);
      } catch (error) {
        let message = "Failed to fetch releases from GitHub";

        if (axios.isAxiosError(error)) {
          const err = error as AxiosError<GitHubErrorResponse>;
          if (err.response?.data?.message) {
            message = err.response.data.message;
          }
        }

        return reply.status(500).send({ error: message });
      }
    },
  );
}
