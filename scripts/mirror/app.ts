import { config } from "dotenv";
import { join } from "path";
import { writeFileSync } from "fs";
import * as minist from "minimist";

import { subgraphList, type Subgraph, type Environment } from "./subgraphs";

config({ path: join(process.cwd(), ".env") });

type Entity =
  | "attestation"
  | "attestation_recipient"
  | "schema"
  | "event"
  | "offchain_attestation";

const environment: Environment = minist(process.argv).environment;
const environmentSubgraphList = subgraphList.filter(
  (x) => x.chain.environment === environment
);

const entities: Entity[] = [
  "attestation",
  "attestation_recipient",
  "schema",
  "event",
  "offchain_attestation",
];
const OUTPUT_PATH = `./mirror-${environment}.yaml`;
const DB_SECRET_NAME = process.env.MIRROR_DB_SECRET_NAME;
const DB_SCHEMA = process.env.MIRROR_DB_SCHEMA;

const buildSource = (subgraph: Subgraph, entity: Entity) => {
  const {
    chain: { name: chainName, identifier },
    name,
    version,
  } = subgraph;
  const sourceName = `${name.replace(/-/g, "_")}_${identifier}_${entity}`;
  return `  ${sourceName}:
    name: ${entity}
    type: subgraph_entity
    subgraphs:
      - name: ${name}
        version: ${version}`;
};

const buildTransform = (subgraph: Subgraph, entity: Entity) => {
  const {
    chain: { name: chainName, identifier, id: chainId },
    name,
    version,
  } = subgraph;
  const sourceName = `${name.replace(/-/g, "_")}_${identifier}_${entity}`;
  const key = entity === "event" ? "id" : `'${chainName}_${identifier}_' || id`;
  return `  ${sourceName}_transform:
    sql: |
      SELECT
          ${key} as \`key\`, '${chainName}' as \`chainName\`, '${chainId}' as \`chainId\`, '${version}' as \`version\`, *
      FROM
          ${sourceName}
    primary_key: key`;
};

const buildSink = (subgraph: Subgraph, entity: Entity) => {
  const {
    chain: { name: chainName, identifier },
    name,
    version,
  } = subgraph;
  const sourceName = `${name.replace(/-/g, "_")}_${identifier}_${entity}`;
  return `  ${sourceName}_sink:
    type: postgres
    table: sp_${entity}
    schema: ${DB_SCHEMA}
    secret_name: ${DB_SECRET_NAME}
    description: 'Postgres sink for: ${sourceName}'
    from: ${sourceName}_transform`;
};

const sources: string[] = [];
const transforms: string[] = [];
const sinks: string[] = [];

environmentSubgraphList.forEach((subgraph) => {
  entities.forEach((entity) => {
    const source = buildSource(subgraph, entity);
    const transform = buildTransform(subgraph, entity);
    const sink = buildSink(subgraph, entity);
    sources.push(source);
    transforms.push(transform);
    sinks.push(sink);
  });
});

const result = `name: sp-mirror-${environment}
apiVersion: 3
sources:
${sources.join("\n")}

transforms:
${transforms.join("\n")}

sinks:
${sinks.join("\n")}
`;

writeFileSync(join(__dirname, OUTPUT_PATH), result, "utf-8");
