import type { VercelRequest, VercelResponse } from "@vercel/node";

// Serverless proxy for Cloudinary's Admin API. The browser calls this
// endpoint directly on every page load; this function holds the Cloudinary
// API secret (set as a Vercel environment variable, never shipped to the
// client) and does the actual authenticated fetch.

const CLOUD_NAME = "pp2u6xmw";

// Cloudinary asset folder -> this site's Category value.
const FOLDER_TO_CATEGORY: Record<string, string> = {
  live: "live",
  portraits: "portrait",
  postcards: "postcard",
  editorial: "editorial",
};

interface StructuredMetadataField {
  external_id: string;
  label?: string;
  value?: string;
}

interface CloudinaryResource {
  public_id: string;
  asset_folder?: string;
  context?: { custom?: Record<string, string> } & Record<string, string | Record<string, string> | undefined>;
  metadata?: StructuredMetadataField[];
}

interface ResourcesResponse {
  resources: CloudinaryResource[];
  next_cursor?: string;
}

// Checks both plain "context" metadata and structured metadata fields,
// since either could be how a value was set in the Cloudinary UI.
const readField = (resource: CloudinaryResource, key: string): string | undefined => {
  const context: Record<string, string> =
    resource.context?.custom ?? (resource.context as Record<string, string>) ?? {};
  if (context[key]) return context[key];

  const field = resource.metadata?.find((entry) => entry.external_id === key || entry.label?.toLowerCase() === key);
  return field?.value;
};

async function fetchAllResources(auth: string): Promise<CloudinaryResource[]> {
  const resources: CloudinaryResource[] = [];
  let nextCursor: string | undefined;

  do {
    const url = new URL(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`);
    url.searchParams.set("type", "upload");
    url.searchParams.set("context", "true");
    url.searchParams.set("metadata", "true");
    url.searchParams.set("max_results", "500");
    if (nextCursor) url.searchParams.set("next_cursor", nextCursor);

    const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
    if (!response.ok) {
      throw new Error(`Cloudinary API error ${response.status}: ${await response.text()}`);
    }

    const data = (await response.json()) as ResourcesResponse;
    resources.push(...data.resources);
    nextCursor = data.next_cursor;
  } while (nextCursor);

  return resources;
}

const buildCloudinaryUrl = (filename: string): string =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_2000/${filename}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    res.status(500).json({ error: "Server is missing Cloudinary credentials." });
    return;
  }

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const resources = await fetchAllResources(auth);

    const photos = resources
      .map((resource) => {
        const category = resource.asset_folder ? FOLDER_TO_CATEGORY[resource.asset_folder] : undefined;
        if (!category) return null;
        return {
          filename: resource.public_id,
          category,
          name: readField(resource, "name"),
          location: readField(resource, "location"),
          src: buildCloudinaryUrl(resource.public_id),
        };
      })
      .filter((photo): photo is NonNullable<typeof photo> => photo !== null)
      .sort((a, b) => a.category.localeCompare(b.category) || a.filename.localeCompare(b.filename));

    // Cache at the CDN edge so we don't call Cloudinary's Admin API on every single visitor
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    res.status(200).json({ photos });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: "Failed to fetch photos from Cloudinary." });
  }
}
