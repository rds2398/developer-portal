import type { OpenAPIV3 } from "openapi-types";
import pokeApiSpec from "./pokeapi/openapi.json";

export interface ApiDefinition {
  id: string;
  name: string;
  version: string;
  baseUrl: string;
  spec: OpenAPIV3.Document;
  docsFile?: string;
}

export const API_REGISTRY: ApiDefinition[] = [
  {
    id: "pokeapi",
    name: "PokéAPI",
    version: "1.0.0",
    baseUrl: "https://pokeapi.co/api/v2",
    spec: pokeApiSpec,
    docsFile: "/src/apis/pokeapi/docs.md",
  },
];
