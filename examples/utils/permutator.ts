import { Define, Replace } from "../../src/types";

function permutator<T>(inputArr: T[]): T[][] {
  let result: T[][] = [];

  const permute = (arr: any[], m: any[] = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
}
function permuteOps(
  separators: string[],
  array2: ((string) => string)[]
): { separator: string; fn: (string) => string }[] {
  return separators.flatMap((separator) =>
    array2.map((fn) => ({ separator, fn }))
  );
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const separatorFunctions = [
  (s) => s,
  capitalizeFirstLetter,
  (s) => s.toUpperCase(),
];
const separators = ["", " ", ".", "-", "_"];
const permOps = permuteOps(separators, separatorFunctions);

/**
 * Will create a list of a lot of possible word capialization and separator combinations
 * e.g.
 * ```
 * [
 * ['vehiclepositioninquiry',
 * 'vehicleinquiryposition',
 * 'positionvehicleinquiry',
 * ...
 * 'POSITION_INQUIRY_VEHICLE',
 * 'INQUIRY_VEHICLE_POSITION',
 * 'INQUIRY_POSITION_VEHICLE'
 * ]
 * ```
 * @deprecated since 07/22 we might not rely on all permutations in which case code should be removed in time
 */
export function createPossibleIdentifiers(words: string[]) {
  const wordPermutations = permutator(words);

  return permOps.flatMap(({ separator, fn }) =>
    wordPermutations.map((words) => words.map(fn).join(separator))
  );
}

export function createPossibleIdentifiersPlaceholders(words: string[]): {
  define: Define[];
  replace: Replace[];
} {
  const define = words.map((w, k) => ({
    word: w,
    templateKey: `_word${k}`,
  }));

  const define_f = words.map((w, k) => ({
    word: k == 0 ? w : capitalizeFirstLetter(w),
    templateKey: `__word${k}_f`,
  }));

  const define_u = words.map((w, k) => ({
    word: w.toUpperCase(),
    templateKey: `_word${k}_u`,
  }));

  const define_c = words.map((w, k) => ({
    word: capitalizeFirstLetter(w),
    templateKey: `_word${k}_c`,
  }));

  return {
    define: [define, define_f, define_u, define_c]
      .flat()
      .map((d) => ({ trg: d.templateKey, default: d.word })),
    replace: [define, define_f, define_u, define_c].flatMap(getCombinations),
  };
}

function getCombinations(define: { word: string; templateKey: string }[]) {
  return separators.flatMap((separator) => ({
    src: define.map(({ word }) => word).join(separator),
    trg: define
      .map(({ templateKey }) => `{{cookiecutter.${templateKey}}}`)
      .join(separator),
  }));
}
