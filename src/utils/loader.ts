import { BasicError, BasicErrorCode } from "../error/basic.ts"
import { URL_CONTEXT_MAP } from "../context/map.ts"

import type { JsonLdDocument } from "../types/jsonld/base.ts"
import type { Loader, RemoteDocument } from "../types/api/loader.ts"
import type { URI } from "../types/jsonld/literals.ts"

/**
 * Construct the document loader for fetching JSON-LD documents from the network.
 *
 * @param {URI} url The URL to fetch.
 *
 * @returns {Promise<RemoteDocument>} Resolve to a loaded document.
 */
export async function network(url: URI): Promise<RemoteDocument> {
  try {
    const response = await fetch(url)
    const document = await response.json()
    return {
      contextUrl: url,
      documentUrl: url,
      document: document,
    }
  } catch (error) {
    throw new BasicError(
      BasicErrorCode.NETWORK_CONNECTION_ERROR,
      "loader#defaultLoader",
      `Failed to fetch the resource from ${url}: ${error}!`,
    )
  }
}

/**
 * Construct the document loader with a fallback function that throws an error.
 *
 * @param {URI} url The URL to fetch.
 *
 * @returns {Promise<RemoteDocument>} Resolve to a loaded document.
 */
export function fallback(url: URI): Promise<RemoteDocument> {
  throw new BasicError(
    BasicErrorCode.DOCUMENT_NOT_FOUND_ERROR,
    "loader#defaultLoader",
    `No custom loader was provided and the document associated with the given URL was not found: ${url}!`,
  )
}

/**
 * Given a existing document loader function, return a new document loader function. The new function will first check
 * if the given URL is in the built-in context map. If not found, it will fallback to using the passed document loader.
 *
 * This function can be used to ensure that any local, in-memory, immutable context documents provided by this library
 * will be used prior to any external document loader.
 *
 * @param {Loader} loader A fallback loader that will be used if the given URL is not in the built-in context map.
 *
 * @returns {Loader} A wrapped loader function.
 */
export function extend(loader: Loader): Loader {
  return (url: string) => {
    if (URL_CONTEXT_MAP.has(url)) {
      return Promise.resolve({
        documentUrl: url,
        document: URL_CONTEXT_MAP.get(url)! as JsonLdDocument,
      })
    }
    return loader(url)
  }
}

/**
 * The basic document loader, which will only resolve to the built-in context map.
 */
export const basic: Loader = extend(fallback)
