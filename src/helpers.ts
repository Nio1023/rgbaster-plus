type Count = {
  color: string;
  count: number;
};

type CountMap = {
  [T: string]: Count;
};

export const getContext = (width: number, height: number) => {
  if (!isWebWorker()) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", String(width));
    canvas.setAttribute("height", String(height));
    return canvas.getContext("2d");
  } else {
    const canvas = new OffscreenCanvas(width, height);
    return canvas.getContext("2d");
  }
};

export const isWebWorker = () => {
  return typeof window === "undefined" && typeof document === "undefined";
};

export const getImageData = async (
  src: string,
  scale: number = 1
): Promise<Uint8ClampedArray> => {
  if (!isWebWorker()) {
    const img = new Image();

    if (!src.startsWith("data")) img.crossOrigin = "Anonymous";

    return new Promise((resolve, reject) => {
      img.onload = function () {
        const width = img.width * scale;
        const height = img.height * scale;
        const context = getContext(width, height);
        context!.drawImage(img, 0, 0, width, height);

        const { data } = context!.getImageData(0, 0, width, height);
        resolve(data);
      };

      const errorHandler = () =>
        reject(new Error("An error occurred attempting to load image"));

      img.onerror = errorHandler;
      img.onabort = errorHandler;
      img.src = src;
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(src)
        .then((resp) => resp.blob())
        .then((blob) => createImageBitmap(blob))
        .then((imageBitmap) => {
          const width = imageBitmap.width * scale;
          const height = imageBitmap.height * scale;
          const context = getContext(width, height);
          context!.drawImage(imageBitmap, 0, 0, width, height);
          const { data } = context!.getImageData(0, 0, width, height);
          resolve(data);
        })
        .catch(() => {
          reject(new Error("An error occurred attempting to load image"));
        });
    });
  }
};

export const getCounts = (data: Uint8ClampedArray, ignore: string[]): [] => {
  const countMap: CountMap = {};

  for (let i = 0; i < data.length; i += 4) {
    let alpha: number = data[i + 3];
    if (alpha === 0) continue;

    let rgbComponents: number[] = Array.from(data.subarray(i, i + 3));
    if (rgbComponents.indexOf(undefined!) !== -1) continue;

    let color: string =
      alpha && alpha !== 255
        ? `rgba(${[...rgbComponents, alpha].join(",")})`
        : `rgb(${rgbComponents.join(",")})`;
    if (ignore.indexOf(color) !== -1) continue;

    if (countMap[color]) {
      countMap[color].count++;
    } else {
      countMap[color] = { color, count: 1 };
    }
  }

  const counts = Object.values(countMap) as [];
  return counts.sort((a: Count, b: Count) => b.count - a.count);
};
