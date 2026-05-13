type DogrulanmisDosya = {
  blob: Blob;
  ext: string;
  mime: string;
};

const MAX_SIGNATURE_BYTES = 64;

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((byte, index) => bytes[index] === byte);
}

function ascii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.slice(start, start + length));
}

function mp3FrameSync(bytes: Uint8Array) {
  return bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
}

function detectImage(bytes: Uint8Array) {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { ext: "jpg", mime: "image/jpeg" };
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { ext: "png", mime: "image/png" };
  }
  if (ascii(bytes, 0, 6) === "GIF87a" || ascii(bytes, 0, 6) === "GIF89a") {
    return { ext: "gif", mime: "image/gif" };
  }
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") {
    return { ext: "webp", mime: "image/webp" };
  }
  return null;
}

function detectAudio(bytes: Uint8Array) {
  if (startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3])) return { ext: "webm", mime: "audio/webm" };
  if (ascii(bytes, 0, 4) === "OggS") return { ext: "ogg", mime: "audio/ogg" };
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WAVE") {
    return { ext: "wav", mime: "audio/wav" };
  }
  if (ascii(bytes, 0, 3) === "ID3" || mp3FrameSync(bytes)) {
    return { ext: "mp3", mime: "audio/mpeg" };
  }
  if (ascii(bytes, 4, 4) === "ftyp") return { ext: "m4a", mime: "audio/mp4" };
  return null;
}

async function dogrulaDosya(
  dosya: File,
  detect: (bytes: Uint8Array) => { ext: string; mime: string } | null
): Promise<DogrulanmisDosya | null> {
  const buffer = await dosya.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const signature = bytes.slice(0, MAX_SIGNATURE_BYTES);
  const detected = detect(signature);

  if (!detected) return null;
  return {
    blob: new Blob([buffer], { type: detected.mime }),
    ext: detected.ext,
    mime: detected.mime,
  };
}

export function dogrulaGorselDosya(dosya: File) {
  return dogrulaDosya(dosya, detectImage);
}

export function dogrulaSesDosya(dosya: File) {
  return dogrulaDosya(dosya, detectAudio);
}
