"use strict";

import { Logger } from "@nestjs/common";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import * as opentelemetry from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import 'dotenv/config';


const otelExporterOtlpHeaders = process.env.OTEL_EXPORTER_OTLP_HEADERS;
console.log(process.env.OTEL_EXPORTER_OTLP_ENDPOINT,process.env.OTEL_TOKEN)
const exporterOptions = {
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT, 
  headers:{
    Authorization:process.env.OTEL_TOKEN,
  }
 
};

const traceExporter = new OTLPTraceExporter(exporterOptions);
const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({   
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,  
  }),
});

//sdk.start();
Logger.log('otel started')
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});

export default sdk;
