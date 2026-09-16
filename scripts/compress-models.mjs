/**
 * Draco 3D Asset Compression Script
 * ---------------------------------
 * Usage:
 *   pnpm compress-models
 *   # or
 *   node scripts/compress-models.mjs
 *
 * What this script does:
 *   1. Copies native Three.js WebAssembly Draco decoders from node_modules into
 *      public/draco/ (draco_decoder.wasm, draco_wasm_wrapper.js, draco_decoder.js)
 *      so models decode 100% locally and offline without external CDN latency.
 *   2. Compresses target GLB 3D models with gltf-pipeline using Google Draco
 *      mesh compression (KHR_draco_mesh_compression) with balanced quantization
 *      levels for high visual fidelity and reduced network payload.
 *
 * Adding new models:
 *   To compress additional GLB models in the future, add them to the `models` array below.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gltfPipeline from 'gltf-pipeline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const { processGlb } = gltfPipeline;

// Configuration list of input and compressed output models in public/glb/
const models = [
  { input: 'Tent_5_5.glb', output: 'Tent_5_5.draco.glb' },
  { input: 'Tent 6.5_6.5.glb', output: 'Tent_6_5_6_5.draco.glb' },
  { input: 'Tent_8_8.glb', output: 'Tent_8_8.draco.glb' },
];

/**
 * Copies the Three.js Draco WASM decoders to public/draco/
 */
async function copyDracoDecoders() {
  const srcDir = path.join(rootDir, 'node_modules', 'three', 'examples', 'jsm', 'libs', 'draco', 'gltf');
  const destDir = path.join(rootDir, 'public', 'draco');

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = ['draco_decoder.wasm', 'draco_wasm_wrapper.js', 'draco_decoder.js'];
  for (const file of files) {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`[Draco] Verified decoder: ${file} in public/draco/`);
    } else {
      console.warn(`[Draco] Warning: ${src} not found.`);
    }
  }
}

/**
 * Compresses an individual GLB model using Draco mesh quantization
 */
async function compressModel(model) {
  const inputPath = path.join(rootDir, 'public', 'glb', model.input);
  const outputPath = path.join(rootDir, 'public', 'glb', model.output);

  if (!fs.existsSync(inputPath)) {
    console.warn(`[Draco] Skipping ${model.input}, source file not found.`);
    return;
  }

  const origSize = fs.statSync(inputPath).size;
  console.log(`[Draco] Compressing ${model.input} (${(origSize / 1024 / 1024).toFixed(2)} MB)...`);

  const glbBuffer = fs.readFileSync(inputPath);
  const options = {
    dracoOptions: {
      compressionLevel: 7,
      quantizePositionBits: 14,
      quantizeNormalBits: 10,
      quantizeTexcoordBits: 12,
      quantizeColorBits: 8,
      quantizeGenericBits: 8,
    },
  };

  const results = await processGlb(glbBuffer, options);
  fs.writeFileSync(outputPath, results.glb);

  const compSize = fs.statSync(outputPath).size;
  const reduction = ((1 - compSize / origSize) * 100).toFixed(1);
  console.log(`[Draco] Generated ${model.output}: ${(compSize / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)`);
}

async function main() {
  console.log('=== Starting Draco Asset Compression ===');
  await copyDracoDecoders();

  for (const model of models) {
    await compressModel(model);
  }
  console.log('=== Asset Compression Completed Successfully ===');
}

main().catch((err) => {
  console.error('[Draco] Error during compression:', err);
  process.exit(1);
});
