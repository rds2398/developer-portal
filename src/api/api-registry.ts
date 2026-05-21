import type { OpenAPIV3 } from "openapi-types";
import pokeApiSpec from "./pokeapi/openapi.json";
import dummyJsonSpec from "./dummy/openapi.json";
import jsonPlaceholderSpec from "./typeicode/opeapi.json";

/** JSON imports are widened; assert once at the registry boundary. */
function openApiDocument(spec: unknown): OpenAPIV3.Document {
  return spec as OpenAPIV3.Document;
}

export interface ApiDefinition {
  id: string;
  name: string;
  version: string;
  baseUrl: string;
  spec: OpenAPIV3.Document;
  docsFile?: string;
  sdkLinks?: {
  name: string;
  url: string;
}[];
}

export const API_REGISTRY: ApiDefinition[] = [
  {
    id: "pokeapi",
    name: "PokéAPI",
    version: "1.0.0",
    baseUrl: "https://pokeapi.co/api/v2",
    spec: openApiDocument(pokeApiSpec),
    docsFile: "/src/apis/pokeapi/docs.md",
    sdkLinks: [
    {
      name: "JavaScript SDK",
      url: "https://github.com/PokeAPI/pokedex-promise-v2",
    },
    {
      name: "Python SDK",
      url: "https://pokeapi.github.io/pokepy/",
    },
  ],
  },
  {
    id: "dummyjson",
    name: "DummyJSON",
    version: "1.0.0",
    baseUrl: "https://dummyjson.com",
    spec: openApiDocument(dummyJsonSpec),
    docsFile: "/src/apis/dummyjson/docs.md",
  },
  {
    id: "jsonplaceholder",
    name: "JSONPlaceholder",
    version: "1.0.0",
    baseUrl: "https://jsonplaceholder.typicode.com",
    spec: openApiDocument(jsonPlaceholderSpec),
    docsFile: "/src/apis/jsonplaceholder/docs.md",
    sdkLinks: [
      {
        name: "Guide",
        url: "https://jsonplaceholder.typicode.com/guide/",
      },
      {
        name: "GitHub",
        url: "https://github.com/typicode/jsonplaceholder",
      },
    ],
  },
];
