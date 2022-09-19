import { getImageData, getCounts } from "./helpers";

interface Opts {
  ignore?: string[];
  scale?: number;
  skipTransparentPixels?: boolean;
}

const defaultOpts: Opts = {
  ignore: [],
  scale: 1,
};

export default async function (
  src: string,
  opts: Opts = defaultOpts
): Promise<{ color: string; count: number }[]> {
  opts = { ...defaultOpts, ...opts };

  const { ignore = [], scale = 1 } = opts;

  if (scale > 1 || scale <= 0) {
    console.warn(
      `You set scale to ${scale}, which isn't between 0-1. This is either pointless (> 1) or a no-op (≤ 0)`
    );
  }

  const data = await getImageData(src, scale);
  return getCounts(data, ignore);
}
