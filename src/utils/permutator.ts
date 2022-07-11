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
 */
export function createPossibleIdentifiersf(words: string[]) {
  const wordPermutations = permutator(words);

  return permOps.flatMap(({ separator, fn }) =>
    wordPermutations.map((words) => words.map(fn).join(separator))
  );
}
